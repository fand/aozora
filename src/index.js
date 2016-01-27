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

const authorId       = process.argv[2];
const authorIdPadded = padStart(authorId, 6, '0');

Promise.all([Author.sync(), Work.sync(), Card.sync()]).then(() => {
  return Card.findAll({ where : { authorId } });
})
.then((cards) => {
  cards.forEach((card) => {
    const url = `http://www.aozora.gr.jp/cards/${authorIdPadded}/card${card.workId}.html`;
    console.log(url);
  });
});
