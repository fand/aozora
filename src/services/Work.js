import * as DB from '../DB';

export function findWorkById (workId) {
  return DB.init().then(() => {
    return DB.Work.find({ where : { uuid : workId } });
  });
}

export function findWorksByIds (workIds) {
  return DB.init().then(() => {
    return DB.Work.findAll({ where : { uuid : { $in : workIds } } });
  });
}

export function findWorksByTitle (workTitle) {
  return DB.init().then(() => {
    return DB.Work.findAll({ where : { title : { $like : `%${workTitle}%` } } });
  });
}

export function getRandomWork () {
  return DB.init().then(() => {
    return DB.Work.count().then((c) => {
      const index = Math.floor(Math.random() * c);
      return DB.Work.findOne({ offset : index });
    });
  });
}
