import fs from 'fs';
import { parse } from 'csv';
import p from '@fand/promisify';

let data;

const init = function () {
  if (data) {
    return Promise.resolve();
  }

  return p(fs.readFile)('./list_person_all.utf8.csv')
    .then((file) => p(parse, {})(file))
    .then((_data) => data = _data)
    .catch((err) => { throw err; });
};

export function findWorkById (workId) {
  const workIdStr = `${workId}`;
  return init().then(() => {
    for (let i = 0, len = data.length; i < len; i++) {
      if (workIdStr === data[i][2]) {
        return data[i];
      }
    }
  });
}
