import * as Authors from './services/Author';
import * as Works   from './services/Work';
import * as Cards   from './services/Card';
import * as Fetcher from './Fetcher';
import * as Table   from './Table';

function showWorksForAuthors (authors) {
  authors.reduce((prev, author) => prev.then(() => {
    Table.showAuthors([author]);

    return Cards.findCardsByAuthorId(author.get('uuid'))
      .then((cards) => {
        const workIds = cards.map(card => card.get('workId'));
        return Works.findWorksByIds(workIds);
      })
      .then((works) => {
        Table.showWorks(works);
      });
  }), Promise.resolve());
}

function showWorkText (work) {
  return Fetcher.fetchCardPageByWorkId(work.uuid)
    .then(Fetcher.fetchTextFromCardPage)
    .then((body) => {
      return body.replace(/［＃.*?］/g, '');
    })
    .then((body) => {
      console.log(body);
    });
}

/**
 * @param {string} authorIdOrName
 */
export function showAuthor (authorIdOrName, isVerbose) {
  return Promise.resolve().then(() => {
    if (/^\d+$/.test(authorIdOrName)) {
      return Authors.findAuthorById(authorIdOrName).then(x => [x]);
    }
    else {
      return Authors.findAuthorsByName(authorIdOrName);
    }
  })
  .then((authors) => {
    if (authors.length === 0) {
      throw new Error(`No authors found for "${authorIdOrName}"`);
    }

    if (authors.length === 1 || isVerbose) {
      return showWorksForAuthors(authors);
    }
    else {
      return Table.showAuthors(authors);
    }
  });
}

/**
 * @param {string} workIdOrTitle
 */
export function showWork (workIdOrTitle) {
  return Promise.resolve().then(() => {
    if (/^\d+$/.test(workIdOrTitle)) {
      return Works.findWorkById(workIdOrTitle).then(x => [x]);
    }
    else {
      return Works.findWorksByTitle(workIdOrTitle);
    }
  })
  .then((works) => {
    if (works.length === 0) {
      throw new Error(`No works found for "${workIdOrTitle}"`);
    }
    if (works.length === 1) {
      return showWorkText(works[0]);
    }
    return Table.showWorks(works);
  });
}

/**
 * @param {Number} length
 */
export function random (length) {
  console.log(`random : ${length}`);
}
