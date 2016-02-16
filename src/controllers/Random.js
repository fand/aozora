import * as Works   from '../services/Work';
import * as Fetcher from '../Fetcher';
import * as View    from '../View';

/**
 * @param {Number} length
 */
export function showRandom (length) {
  return Works.getRandomWork()
    .then(work => Fetcher.fetchTextByWorkId(work.get('uuid')))
    .then(text => View.showWorkText(text, length));
}
