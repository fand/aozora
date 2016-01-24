import fs from 'fs';
import { parse } from 'csv';
import p from '@fand/promisify';

p(fs.readFile)('./list_person_all.utf8.csv')
  .then((file) => p(parse, {})(file))
  .then((data) => {
    data.slice(0, 10).forEach((o) => console.log(o));
  })
  .catch((err) => console.error(err));
