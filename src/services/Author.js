import * as DB from '../DB';

export function findAuthorById (authorId) {
  return DB.init().then(() => {
    return DB.Author.find({ where : { uuid : authorId } });
  });
}

export function findAuthorsByName (authorName) {
  return DB.init().then(() => {
    return DB.Author.findAll({ where : { name : { $like : `%${authorName}%` } } });
  });
}
