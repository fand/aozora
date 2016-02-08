import URL          from 'url';
import axios        from 'axios';
import cheerio      from 'cheerio';
import { padStart } from 'lodash';

import { Iconv } from 'iconv';
const sjis2utf8 = new Iconv('SHIFT_JIS', 'UTF-8//TRANSLIT//IGNORE');

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

export function fetchTextFromCardPage (cardPage) {
  return Promise.resolve().then(() => {
    const $     = cheerio.load(cardPage.data);
    const links = $('.download a').map((i, e) => $(e).attr('href')).toArray();
    const link  = links.filter(l => l.match(/.html$/))[0];

    const textUrl = URL.resolve(cardPage.config.url, link);

    return axios.get(textUrl, {
      responseType      : 'arraybuffer',
      transformResponse : [(data) => {
        return sjis2utf8.convert(data).toString();
      }],
    });
  })
  .then((res) => {
    const $ = cheerio.load(res.data);
    return $('.main_text').text();
  });
}
