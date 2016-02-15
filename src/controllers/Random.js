import * as Works   from '../services/Work';
import * as Fetcher from '../Fetcher';
import * as View    from '../View';

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
 * @param {Number} length
 */
export function random (length) {
  return Works.getRandomWork().then((work) => {
    return showWorkText(work, length);
  });
}
