import Sequelize    from 'sequelize';
import { padStart } from 'lodash';
import dedent       from 'dedent';

import { readCSV, forEachAuthors, forEachWorks, forEachCards } from './CSVParser';

import AuthorModel from './models/Author';
import WorkModel   from './models/Work';
import CardModel   from './models/Card';

function log (str) {
  process.stdout.write(str);
}

const sequelize = new Sequelize('aozora', '', '', {
  dialect : 'sqlite',
  logging : false,
  storage : './aozora.db',
});

const Author = sequelize.import('author', AuthorModel);
const Work   = sequelize.import('work', WorkModel);
const Card   = sequelize.import('card', CardModel);

readCSV('./list_person_all.utf8.csv')
  .then(() => Promise.all([sequelize.truncate(), Author.sync(), Work.sync(), Card.sync()]))
  .then(() => {
    log('Installing authors data');

    const done = {};
    return forEachAuthors((author, i) => {
      if (i % 100 === 0) { log('.'); }

      done[author.uuid] = done[author.uuid] || Author.create(author);
      return done[author.uuid];
    })
    .then(() => log('DONE\n'));
  })
  .then(() => {
    log('Installing works data');

    const done = {};
    return forEachWorks((work, i) => {
      if (i % 100 === 0) { log('.'); }

      done[work.uuid] = done[work.uuid] || Work.create(work);
      return done[work.uuid];
    })
    .then(() => log('DONE\n'));
  })
  .then(() => {
    log('Installing cards data');

    return forEachCards((card, i) => {
      if (i % 100 === 0) { log('.'); }
      return Card.create(card);
    })
    .then(() => log('DONE\n'));
  })
  .then(() => {
    return Promise.all([
      sequelize.query('SELECT count(*) as count FROM authors').then(x => x[0][0].count),
      sequelize.query('SELECT count(*) as count FROM works').then(x => x[0][0].count),
      sequelize.query('SELECT count(*) as count FROM cards').then(x => x[0][0].count),
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
