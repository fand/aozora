import { padStart } from 'lodash';
import dedent       from 'dedent';

import { readCSV, forEachAuthors, forEachWorks, forEachCards } from './CSVParser';

function log (str) {
  process.stdout.write(str);
}

import * as DB from './DB';

readCSV('./list_person_all.utf8.csv')
  .then(() => DB.init())
  .then(() => DB.sequelize.truncate())
  .then(() => {
    log('Installing authors data');

    const done = {};
    return forEachAuthors((author, i) => {
      if (i % 100 === 0) { log('.'); }

      done[author.uuid] = done[author.uuid] || DB.Author.create(author);
      return done[author.uuid];
    })
    .then(() => log('DONE\n'));
  })
  .then(() => {
    log('Installing works data');

    const done = {};
    return forEachWorks((work, i) => {
      if (i % 100 === 0) { log('.'); }

      done[work.uuid] = done[work.uuid] || DB.Work.create(work);
      return done[work.uuid];
    })
    .then(() => log('DONE\n'));
  })
  .then(() => {
    log('Installing cards data');

    return forEachCards((card, i) => {
      if (i % 100 === 0) { log('.'); }
      return DB.Card.create(card);
    })
    .then(() => log('DONE\n'));
  })
  .then(() => {
    return Promise.all([
      DB.query('SELECT count(*) as count FROM authors').then(x => x[0][0].count),
      DB.query('SELECT count(*) as count FROM works').then(x => x[0][0].count),
      DB.query('SELECT count(*) as count FROM cards').then(x => x[0][0].count),
    ])
    .then(([ authors, works, cards ]) => {
      const length = Math.max(authors, works, cards).toString().length;
      const pad = str => padStart(str, length);

      console.log(dedent`
        #### aozora INSTALLED ####
        authors : ${pad(authors)}
        works   : ${pad(works)}
        cards   : ${pad(cards)}
      `);
    });
  })
  .catch((err) => {
    console.log(err);
  });
