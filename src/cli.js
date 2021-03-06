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
  Aozora.showRandom(length).catch(e => console.error(e));
}
else if (argv.h) {
  console.log(dedent`
    Usage:
      aozora [-a authorId|authorName] [-w workId|workTitle] [-r length] ...
  `);
}
else {
  Aozora.showInteractive().catch(e => console.error(e));
}
