import Sequelize    from 'sequelize';
import { padStart } from 'lodash';
import dedent       from 'dedent';

import { readCSV, forEachAuthors, forEachWorks, forEachPages } from './CSVParser';

import AuthorModel from './Author';
import WorkModel   from './Work';
import PageModel   from './Page';

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
const Page   = sequelize.import('page', PageModel);

readCSV('./list_person_all.utf8.csv')
  .then(() => Promise.all([sequelize.truncate(), Author.sync(), Work.sync(), Page.sync()]))
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
    log('Installing pages data');

    return forEachPages((page, i) => {
      if (i % 100 === 0) { log('.'); }
      return Page.create(page);
    })
    .then(() => log('DONE\n'));
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
