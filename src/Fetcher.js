import axios        from 'axios';
import { padStart } from 'lodash';

import * as Cards from './services/Card';

/**
 * @param  {Array<Card>} cards
 * @return {Promise<Response>}
 */
export function fetchCards (cards) {
  return cards.reduce((done, card) => done.then((resolved) => {
    if (resolved) { return Promise.resolve(resolved); }

    const authorIdPadded = padStart(card.get('authorId'), 6, '0');
    const url = `http://www.aozora.gr.jp/cards/${authorIdPadded}/card${card.workId}.html`;

    return axios.get(url).catch(() => null);
  }), Promise.resolve())
  .catch(() => {
    throw new Error('Could not fetch any card page');
  });
}

/**
 * @param  {number} workId
 * @return {Response}
 */
export function fetchCardPageByWorkId (workId) {
  return Cards.findCardsByWorkId(workId)
    .then(fetchCards);
}
