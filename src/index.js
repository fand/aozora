import Sequelize    from 'sequelize';
import { padStart } from 'lodash';

import AuthorModel from './Author';
import WorkModel   from './Work';
import PageModel   from './Page';

const sequelize = new Sequelize('aozora', '', '', {
  dialect : 'sqlite',
  logging : false,
  storage : './aozora.db',
});

const Author = sequelize.import('author', AuthorModel);
const Work   = sequelize.import('work', WorkModel);
const Page   = sequelize.import('page', PageModel);

const authorId       = process.argv[2];
const authorIdPadded = padStart(authorId, 6, '0');

Promise.all([Author.sync(), Work.sync(), Page.sync()]).then(() => {
  return Page.findAll({ where : { authorId } });
})
.then((pages) => {
  pages.forEach((page) => {
    const url = `http://www.aozora.gr.jp/cards/${authorIdPadded}/card${page.workId}.html`;
    console.log(url);
  });
});
