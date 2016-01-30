// import { padStart } from 'lodash';

import * as Authors from './services/Author';
import * as Works   from './services/Work';
import * as Cards   from './services/Card';


import Table from 'cli-table2';

function showAuthors (authors) {
  const table = new Table({
    head      : ['UUID', 'Name'],
    colWidths : [10, 60],
  });

  authors.forEach(a => {
    table.push(
        [a.get('uuid'), a.get('name')]
    );
  });

  console.log(table.toString());
}

function showWorks (works) {
  const table = new Table({
    head      : ['UUID', 'Title'],
    colWidths : [10, 60],
  });

  works.forEach(w => {
    table.push(
        [w.get('uuid'), w.get('title')]
    );
  });

  console.log(table.toString());
}

function showWorksForAuthors (authors) {
  authors.reduce((prev, author) => prev.then(() => {
    showAuthors([author]);

    return Cards.findCardsByAuthorId(author.get('uuid'))
      .then((cards) => {
        const workIds = cards.map(card => card.get('workId'));
        return Works.findWorksByIds(workIds);
      })
      .then((works) => {
        showWorks(works);
      })
      .catch((err) => {
        console.log(err.stack);
      });
  }), Promise.resolve());
}

function showAuthorById (authorId) {
  return Authors.findAuthorById(authorId)
    .then((author) => {
      return showWorksForAuthors([author]);
    })
    .catch((e) => {
      console.error(e);
      console.log(`No authors found for uuid : ${authorId}`);
    });
}

function showAuthorsByName (authorName, isVorbose) {
  return Authors.findAuthorsByName(authorName)
    .then((authors) => {
      if (authors.length === 0) {
        return console.log(`No authors found for name "${authorName}"`);
      }

      if (isVorbose) {
        return showWorksForAuthors(authors);
      }
      else {
        return showAuthors(authors);
      }
    })
    .catch((e) => {
      console.log('>>>>>>>>>error');
      console.log(e);
    });
}

function showWorkById (workId) {
  return Works.findWorkById(workId)
    .then((work) => {
      showWorks([work]);
    })
    .catch((e) => {
      console.error(e);
      console.log(`No works found for uuid : ${workId}`);
    });
}

function showWorksByTitle (workTitle) {
  return Works.findWorksByTitle(workTitle)
    .then((works) => {
      if (works.length === 0) {
        return console.log(`No works found for title "${workTitle}"`);
      }
      showWorks(works);
    })
    .catch((e) => {
      console.log('>>>>>>>>>error');
      console.log(e);
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

  // const authorIdPadded = padStart(authorIdOrName, 6, '0');
  //
  // init().then(() => {
  //   return Card.findAll({ where : { authorId : authorIdOrName } });
  // })
  // .then((cards) => {
  //   cards.forEach((card) => {
  //     const url = `http://www.aozora.gr.jp/cards/${authorIdPadded}/card${card.workId}.html`;
  //     console.log(url);
  //   });
  // });

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
