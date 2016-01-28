import Sequelize   from 'sequelize';
import AuthorModel from './models/Author';
import WorkModel   from './models/Work';
import CardModel   from './models/Card';

export const sequelize = new Sequelize('aozora', '', '', {
  dialect : 'sqlite',
  logging : false,
  storage : './aozora.db',
});

export const Author = sequelize.import('author', AuthorModel);
export const Work   = sequelize.import('work', WorkModel);
export const Card   = sequelize.import('card', CardModel);

let isInitialized;
export function init () {
  isInitialized = isInitialized || Promise.all([
    Author.sync(), Work.sync(), Card.sync(),
  ]);
  return isInitialized;
}

export function query (sql) {
  return sequelize.query(sql);
}
