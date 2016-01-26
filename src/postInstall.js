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

function rowToAuthor (row) {
  return {
    uuid  : row[0],
    title : row[1],
  };
}

function rowToWork (row) {
  return {
    uuid  : row[2],
    title : row[3],
  };
}

function rowToPage (row) {
  return {
    authorId       : row[0],
    workId         : row[2],
    kanaType       : row[4],
    translaterName : row[5],
  };
}

const Author = sequelize.define('author', {
  uuid : { type : Sequelize.UUID, primaryKey : true },
  name : Sequelize.STRING,
});

const Work = sequelize.define('Work', {
  uuid : { type : Sequelize.UUID, primaryKey : true },
  title : Sequelize.STRING,
});

const Page = sequelize.define('page', {
  workId : {
    type : Sequelize.UUID,
    references : {
      model : Work,
      key   : 'uuid',
    },
  },
  authorId : {
    type       : Sequelize.UUID,
    references : {
      model : Author,
      key   : 'uuid',
    },
  },
  kanaType       : Sequelize.ENUM('新字新仮名', '新字旧仮名', '旧字新仮名', '旧字旧仮名', 'その他'),
  translaterName : Sequelize.STRING,
});

Promise.all([readCSV(), Author.sync(), Work.sync(), Page.sync()]).then(() => {
  const authorIds = {};
  return data.reduce((prev, row) => prev.then(() => {
    const { uuid, name } = rowToAuthor(row);

    if (authorIds[uuid]) { return true; }
    authorIds[uuid] = true;

    return Author.create({ uuid, name });
  }), Promise.resolve());
})
.then(() => {
  const workIds = {};
  return data.reduce((prev, row) => prev.then(() => {
    const { uuid, title } = rowToWork(row);

    if (workIds[uuid]) { return true; }
    workIds[uuid] = true;

    return Work.create({ uuid, title });
  }), Promise.resolve());
})
.then(() => {
  return data.reduce((prev, row) => prev.then(() => {
    const { workId, authorId, kanaType, translaterName } = rowToPage(row);
    return Page.create({ workId, authorId, kanaType, translaterName })
      .catch(e => console.log(e));
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
