import * as Aozora from './index';
import dedent      from 'dedent';

const argv = require('minimist')(process.argv.slice(2));
if (argv.a) {
  Aozora.showAuthor(argv.a, argv.v).catch(e => console.error(e));
}
else if (argv.w) {
  Aozora.showWork(argv.w, argv.v).catch(e => console.error(e));
}
else if (argv.r) {
  const length = parseInt(argv.r, 10);
  Aozora.random(length).catch(e => console.error(e));
}
else {
  console.log(dedent`
    Usage:  aozora [-a author] [option] ...

  `);
}
