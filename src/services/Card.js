import * as DB from '../DB';

export function findCardsByAuthorId (authorId) {
  return DB.init().then(() => {
    return DB.Card.find({ where : { authorId : authorId } });
  });
}

export function findCardsByWorkId (workId) {
  return DB.init().then(() => {
    return DB.Card.find({ where : { workId : workId } });
  });
}
