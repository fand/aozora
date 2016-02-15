import * as Works   from '../services/Work';
import * as Cards   from '../services/Card';
import * as Fetcher from '../Fetcher';
import * as Table   from '../Table';

function showWorkText (work, length) {
  return Fetcher.fetchCardPageByWorkId(work.uuid)
    .then(Fetcher.fetchTextFromCardPage)
    .then((body) => {
      return body.replace(/［＃.*］/g, '');
    })
    .then((body) => {
      console.log(body.slice(0, length || body.length).trim());
    });
}

/**
 * @param {string} workIdOrTitle
 */
export function showWork (workIdOrTitle) {
  return Promise.resolve().then(() => {
    if (/^\d+$/.test(workIdOrTitle)) {
      return Works.findWorkById(workIdOrTitle).then(x => [x]);
    }
    else {
      return Works.findWorksByTitle(workIdOrTitle);
    }
  })
  .then((works) => {
    if (works.length === 0) {
      throw new Error(`No works found for "${workIdOrTitle}"`);
    }
    if (works.length === 1) {
      return showWorkText(works[0]);
    }

    return Cards.findCardsByWorkIds(works.map(w => w.uuid))
      .then((cards) => {
        return Table.showCards(cards);
      });
  });
}
