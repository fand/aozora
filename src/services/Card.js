import * as DB from '../DB';

export function findCardsByAuthorId (authorId) {
  return DB.init().then(() => {
    return DB.Card.findAll({ where : { authorId : authorId } });
  });
}

export function findCardsByWorkId (workId) {
  return DB.init().then(() => {
    return DB.Card.findAll({ where : { workId : workId } });
  });
}
