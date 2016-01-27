import fs        from 'fs';
import p         from '@fand/promisify';
import { parse } from 'csv';

let data;
export function readCSV (path) {
  return p(fs.readFile)(path)
    .then((file) => p(parse)(file))
    .then((_data) => data = _data.slice(1))
    .catch((err) => { throw err; });
}

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

export function forEachAuthors (callback) {
  return data.reduce((prev, row, i) => prev.then(() => callback(rowToAuthor(row), i)), Promise.resolve());
}

export function forEachWorks (callback) {
  return data.reduce((prev, row, i) => prev.then(() => callback(rowToWork(row), i)), Promise.resolve());
}

export function forEachPages (callback) {
  return data.reduce((prev, row, i) => prev.then(() => callback(rowToPage(row), i)), Promise.resolve());
}
