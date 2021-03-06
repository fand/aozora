import inquirer     from 'inquirer';
import * as Authors from '../services/Author';
import * as Works   from '../services/Work';
import * as Cards   from '../services/Card';
import * as Fetcher from '../Fetcher';
import * as View    from '../View';

/**
 * Promisify inquirer.
 */
const p = f => (opts) => new Promise((resolve) => f(opts, resolve));

function askAuthor () {
  return p(inquirer.prompt)({
    type    : 'input',
    name    : 'authorName',
    message : 'Input author name',
  })
  .then(({ authorName }) => Authors.findAuthorsByName(authorName))
  .then((authors) => {
    if (authors.length === 1) {
      return authors[0];
    }
    else {
      return p(inquirer.prompt)({
        type    : 'list',
        name    : 'authorName',
        message : 'Select author',
        choices : authors.map(a => a.get('name')),
      })
      .then(({ authorName }) => authors.find(a => a.get('name') === authorName));
    }
  });
}

function askWorksForAuthor (author) {
  return Cards.findCardsByAuthorId(author.get('uuid')).then((cards) => {
    return p(inquirer.prompt)({
      type    : 'list',
      name    : 'card',
      message : 'Select title',
      choices : cards.map(c => ({
        name  : c.get('workTitle'),
        value : c,
        short : c.get('workTitle'),
      })),
    });
  })
  .then(({ card }) => Fetcher.fetchTextByWorkId(card.get('workId')))
  .then(View.showWorkText);
}

function askCard () {
  return p(inquirer.prompt)({
    type    : 'input',
    name    : 'workTitle',
    message : 'Input title',
  })
  .then(({ workTitle }) => Works.findWorksByTitle(workTitle))
  .then((works) => Cards.findCardsByWorkIds(works.map(w => w.get('uuid'))))
  .then((cards) => {
    if (cards.length === 1) {
      return cards[0];
    }
    else {
      return p(inquirer.prompt)({
        type    : 'list',
        name    : 'card',
        message : 'Select title',
        choices : cards.map(c => ({
          name  : `${c.get('authorName')} : ${c.get('workTitle')}`,
          value : c,
          short : `${c.get('authorName')} : ${c.get('workTitle')}`,
        })),
      })
      .then(({ card }) => Fetcher.fetchTextByWorkId(card.get('workId')))
      .then(View.showWorkText);
    }
  });
}

export function showInteractive () {
  return p(inquirer.prompt)([{
    type    : 'list',
    name    : 'selection',
    message : 'Search works by',
    choices : ['Author', 'Title'],
  }])
  .then((answers) => {
    if (answers.selection === 'Author') {
      return askAuthor().then(askWorksForAuthor);
    }
    else {
      return askCard();
    }
  });
}
