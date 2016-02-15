import * as Authors from '../services/Author';
import * as Works   from '../services/Work';
import * as Cards   from '../services/Card';
import * as View    from '../View';

function showWorksForAuthors (authors) {
  authors.reduce((prev, author) => prev.then(() => {
    View.showAuthors([author]);

    return Cards.findCardsByAuthorId(author.get('uuid'))
      .then((cards) => {
        const workIds = cards.map(card => card.get('workId'));
        return Works.findWorksByIds(workIds);
      })
      .then((works) => {
        View.showWorks(works);
      });
  }), Promise.resolve());
}

/**
 * @param {string} authorIdOrName
 */
export function showAuthor (authorIdOrName, isVerbose) {
  return Promise.resolve().then(() => {
    if (/^\d+$/.test(authorIdOrName)) {
      return Authors.findAuthorById(authorIdOrName).then(x => [x]);
    }
    else {
      return Authors.findAuthorsByName(authorIdOrName);
    }
  })
  .then((authors) => {
    if (authors.length === 0) {
      throw new Error(`No authors found for "${authorIdOrName}"`);
    }

    if (authors.length === 1 || isVerbose) {
      return showWorksForAuthors(authors);
    }
    else {
      return View.showAuthors(authors);
    }
  });
}
