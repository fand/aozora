import * as Aozora from './index';
import dedent      from 'dedent';

const argv = require('minimist')(process.argv.slice(2));
if (argv.a) {
  Aozora.showAuthor(argv.a);
}
else if (argv.w) {
  Aozora.showWork(argv.w);
}
else if (argv.r) {
  Aozora.random(argv.r);
}
else {
  console.log(dedent`
    Usage:  aozora [-a author] [option] ...

  `);
}
