import Sequelize    from 'sequelize';
import { padStart } from 'lodash';

import AuthorModel from './models/Author';
import WorkModel   from './models/Work';
import CardModel   from './models/Card';

const sequelize = new Sequelize('aozora', '', '', {
  dialect : 'sqlite',
  logging : false,
  storage : './aozora.db',
});

const Author = sequelize.import('author', AuthorModel);
const Work   = sequelize.import('work', WorkModel);
const Card   = sequelize.import('card', CardModel);

const init = function () {
  return Promise.all([Author.sync(), Work.sync(), Card.sync()]);
};

function showAuthorById (authorId) {
  return Author.find({ where : { uuid : authorId } })
    .then((author) => {
      console.log(author.get('name'));
    })
    .catch((e) => {
      console.log('>>>>>>>>>error');
      console.log(e);
    });
}

function showAuthorByName (authorName) {
  return Author.findAll({ where : { name : { $like : `%${authorName}%` } } })
    .then((authors) => {
      if (authors.length === 0) {
        return console.log('No author found');
      }

      authors.forEach(a => console.log(a.get('name')));
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
  init().then(() => {
    if (/^\d+$/.test(authorIdOrName)) {
      return showAuthorById(authorIdOrName);
    }
    else {
      return showAuthorByName(authorIdOrName);
    }
  });

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
  console.log(`showWork : ${workIdOrTitle}`);
}

/**
 * @param {Number} length
 */
export function random (length) {
  console.log(`random : ${length}`);
}
