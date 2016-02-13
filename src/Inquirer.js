import inquirer     from 'inquirer';
import * as Authors from './services/Author';
import * as Works   from './services/Work';
import * as Cards   from './services/Card';
import * as Fetcher from './Fetcher';

/**
 * Promisify inquirer.
 */
const p = f => (opts) => new Promise((resolve) => f(opts, resolve));

const Inquirer = {

  inquire () {
    return p(inquirer.prompt)([{
      type    : 'list',
      name    : 'selection',
      message : 'Search a work by',
      choices : ['Author', 'Title'],
    }])
    .then((answers) => {
      if (answers.selection === 'Author') {
        return Inquirer.askAuthor().then(Inquirer.askWorksForAuthor);
      }
      else {
        console.log('bye bye(=^・^=)');
        return;
      }
    });
  },

  askAuthor () {
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
  },

  askWorksForAuthor (author) {
    return Cards.findCardsByAuthorId(author.get('uuid')).then((cards) => {
      return p(inquirer.prompt)({
        type    : 'list',
        name    : 'card',
        message : 'Select work',
        choices : cards.map(c => ({
          name  : c.get('workTitle'),
          value : c,
          short : c.get('workTitle'),
        })),
      });
    })
    .then(({ card }) => {
      return Fetcher.fetchCardPageByWorkId(card.get('workId'))
        .then(Fetcher.fetchTextFromCardPage)
        .then((body) => {
          return body.replace(/［＃.*］/g, '');
        })
        .then((body) => {
          console.log(body);
        });
    });
  },

};

export default Inquirer;
