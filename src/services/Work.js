import * as DB from '../DB';

export function findWorkById (workId) {
  return DB.init().then(() => {
    return DB.Work.find({ where : { uuid : workId } });
  });
}

export function findWorksByTitle (workTitle) {
  return DB.init().then(() => {
    return DB.Work.findAll({ where : { title : { $like : `%${workTitle}%` } } });
  });
}
