import * as Works   from '../services/Work';
import * as Cards   from '../services/Card';
import * as Fetcher from '../Fetcher';
import * as View    from '../View';

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
      return Fetcher.fetchTextByWorkId(works[0].uuid).then(View.showWorkText);
    }

    return Cards.findCardsByWorkIds(works.map(w => w.uuid))
      .then((cards) => {
        return View.showCards(cards);
      });
  });
}
