import fs        from 'fs';
import { parse } from 'csv';
import p         from '@fand/promisify';

import Sequelize from 'sequelize';

let data;
function readCSV () {
  return p(fs.readFile)('./list_person_all.utf8.csv')
    .then((file) => p(parse)(file))
    .then((_data) => data = _data.slice(1))
    .catch((err) => { throw err; });
}

const sequelize = new Sequelize('aozora', '', '', {
  dialect : 'sqlite',
  logging : false,
  storage : './aozora.db',
});

// '人物ID'
// '著者名'
// '作品ID'
// '作品名'
// '仮名遣い種別'
// '翻訳者名等'
// '入力者名'
// '校正者名'
// '状態'
// '状態の開始日'
// '底本名'
// '出版社名'
// '入力に使用した版'
// '校正に使用した版'

const Author = sequelize.define('author', {
  uuid : Sequelize.INTEGER,
  name : Sequelize.STRING,
});

Promise.all([readCSV(), Author.sync()]).then(() => {
  const authorIds = {};
  return data.reduce((prev, [uuid, name]) => prev.then(() => {
    if (authorIds[uuid]) { return true; }

    authorIds[uuid] = true;
    return Author.create({uuid, name});
  }), Promise.resolve());
})
.then(() => {
  Author.findAll({
    attributes : [[sequelize.fn('COUNT', sequelize.col('name')), 'authors']],
  })
  .then((res) => {
    console.log(res);
  });
});
