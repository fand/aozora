import fs           from 'fs';
import { parse }    from 'csv';
import p            from '@fand/promisify';
import dedent       from 'dedent';
import { padStart } from 'lodash';

import Sequelize from 'sequelize';

import AuthorModel from './Author';
import WorkModel   from './Work';
import PageModel   from './Page';

function log (str) {
  process.stdout.write(str);
}

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

const Author = sequelize.import('author', AuthorModel);
const Work   = sequelize.import('work', WorkModel);
const Page   = sequelize.import('page', PageModel);

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
    uuid : row[0],
    name : row[1],
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

Promise.all([readCSV(), sequelize.truncate(), Author.sync(), Work.sync(), Page.sync()]).then(() => {
  log('Installing authors data');

  const authorIds = {};
  return data.reduce((prev, row, i) => prev.then(() => {
    if (i % 100 === 0) { log('.'); }

    const { uuid, name } = rowToAuthor(row);

    if (authorIds[uuid]) { return true; }
    authorIds[uuid] = true;

    return Author.create({ uuid, name });
  }), Promise.resolve())
  .then(() => {
    log('DONE\n');
  });
})
.then(() => {
  log('Installing works data');

  const workIds = {};
  return data.reduce((prev, row, i) => prev.then(() => {
    if (i % 100 === 0) { log('.'); }

    const { uuid, title } = rowToWork(row);

    if (workIds[uuid]) { return true; }
    workIds[uuid] = true;

    return Work.create({ uuid, title });
  }), Promise.resolve())
  .then(() => {
    log('DONE\n');
  });
})
.then(() => {
  log('Installing pages data');

  return data.reduce((prev, row, i) => prev.then(() => {
    if (i % 100 === 0) { log('.'); }

    const { workId, authorId, kanaType, translaterName } = rowToPage(row);
    return Page.create({ workId, authorId, kanaType, translaterName });
  }), Promise.resolve())
  .then(() => {
    log('DONE\n');
  });
})
.then(() => {
  return Promise.all([
    sequelize.query('SELECT count(*) as count FROM authors').then(x => x[0][0].count),
    sequelize.query('SELECT count(*) as count FROM works').then(x => x[0][0].count),
    sequelize.query('SELECT count(*) as count FROM pages').then(x => x[0][0].count),
  ])
  .then(([ authors, works, pages ]) => {
    const length = Math.max(authors, works, pages).toString().length;
    const pad = str => padStart(str, length);

    console.log(dedent`
      #### aozora INSTALLED ####
      authors : ${pad(authors)}
      works   : ${pad(works)}
      pages   : ${pad(pages)}
    `);
  });
})
.catch((err) => {
  console.log(err);
});
