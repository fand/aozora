'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _csv = require('csv');

var _fandPromisify = require('@fand/promisify');

var _fandPromisify2 = _interopRequireDefault(_fandPromisify);

(0, _fandPromisify2['default'])(_fs2['default'].readFile)('./list_person_all.utf8.csv').then(function (file) {
  return (0, _fandPromisify2['default'])(_csv.parse, {})(file);
}).then(function (data) {
  data.slice(0, 10).forEach(function (o) {
    return console.log(o);
  });
})['catch'](function (err) {
  return console.error(err);
});