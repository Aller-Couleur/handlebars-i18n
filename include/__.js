/**
 * Created by florianwalzel on 02.05.20.
 */

const handlebars = require('handlebars');
const i18next = require('i18next');

module.exports = function (str, attributes) {
  return new handlebars.SafeString((typeof(i18next) !== 'undefined' ? i18next.t(str, attributes.hash) : str));
};