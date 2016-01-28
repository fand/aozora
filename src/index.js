// import { padStart } from 'lodash';

import * as Authors from './services/Author';
import * as Works   from './services/Work';
// import * as Cards   from './services/Card';

function showAuthorById (authorId) {
  return Authors.findAuthorById(authorId)
    .then((author) => {
      console.log(author.get('uuid'), author.get('name'));
    })
    .catch((e) => {
      console.error(e);
      console.log(`No authors found for uuid : ${authorId}`);
    });
}

function showAuthorsByName (authorName) {
  return Authors.findAuthorsByName(authorName)
    .then((authors) => {
      if (authors.length === 0) {
        return console.log(`No authors found for name "${authorName}"`);
      }

      authors.forEach(a => console.log(a.get('uuid'), a.get('name')));
    })
    .catch((e) => {
      console.log('>>>>>>>>>error');
      console.log(e);
    });
}

function showWorkById (workId) {
  return Works.findWorkById(workId)
    .then((work) => {
      console.log(work.get('uuid'), work.get('title'));
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

      works.forEach(w => console.log(w.get('uuid'), w.get('title')));
    })
    .catch((e) => {
      console.log('>>>>>>>>>error');
      console.log(e);
    });
}

/**
 * @param {string} authorIdOrName
 */
export function showAuthor (authorIdOrName) {
  if (/^\d+$/.test(authorIdOrName)) {
    return showAuthorById(authorIdOrName);
  }
  else {
    return showAuthorsByName(authorIdOrName);
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
export function showWork (workIdOrTitle) {
  if (/^\d+$/.test(workIdOrTitle)) {
    return showWorkById(workIdOrTitle);
  }
  else {
    return showWorksByTitle(workIdOrTitle);
  }
}

/**
 * @param {Number} length
 */
export function random (length) {
  console.log(`random : ${length}`);
}
