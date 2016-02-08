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

function showAuthorById (authorId) {
  return Authors.findAuthorById(authorId)
    .then((author) => {
      return showWorksForAuthors([author]);
    })
    .catch(() => {
      throw new Error(`No authors found for uuid : ${authorId}`);
    });
}

function showAuthorsByName (authorName, isVorbose) {
  return Authors.findAuthorsByName(authorName)
    .then((authors) => {
      if (authors.length === 0) {
        throw new Error(`No authors found for name "${authorName}"`);
      }

      if (isVorbose) {
        return showWorksForAuthors(authors);
      }
      else {
        return Table.showAuthors(authors);
      }
    });
}

function showWorkById (workId) {
  return Fetcher.fetchCardPageByWorkId(workId)
    .then(Fetcher.fetchTextFromCardPage)
    .then((body) => {
      return body.replace(/［＃.*?］/g, '');
    })
    .then((body) => {
      console.log(body);
    });
}

function showWorksByTitle (workTitle) {
  return Works.findWorksByTitle(workTitle)
    .then((works) => {
      if (works.length === 0) {
        throw new Error(`No works found for title "${workTitle}"`);
      }
      Table.showWorks(works);
    });
}

/**
 * @param {string} authorIdOrName
 */
export function showAuthor (authorIdOrName, isVerbose) {
  if (/^\d+$/.test(authorIdOrName)) {
    return showAuthorById(authorIdOrName, isVerbose);
  }
  else {
    return showAuthorsByName(authorIdOrName, isVerbose);
  }
}

/**
 * @param {string} workIdOrTitle
 */
export function showWork (workIdOrTitle, isVerbose) {
  if (/^\d+$/.test(workIdOrTitle)) {
    return showWorkById(workIdOrTitle, isVerbose);
  }
  else {
    return showWorksByTitle(workIdOrTitle, isVerbose);
  }
}

/**
 * @param {Number} length
 */
export function random (length) {
  console.log(`random : ${length}`);
}
