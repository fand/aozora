import fs           from 'fs';
import { parse }    from 'csv';
import p            from '@fand/promisify';
import dedent       from 'dedent';
import { padStart } from 'lodash';

import Sequelize from 'sequelize';

const sequelize = new Sequelize('aozora', '', '', {
  dialect : 'sqlite',
  logging : false,
  storage : './aozora.db',
});

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
