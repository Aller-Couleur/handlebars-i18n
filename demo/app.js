/**
 * Created by florianwalzel on 21.10.19.
 */

'use strict';

const Handlebars = require('handlebars');
let data = { name: 'HandelbarsI18next' };
let template = '<div>{{t "key" what=name }}</div>';

const i18next = require('i18next');

i18next.init({
  resources : {
    'en_EN' : {
      translations : {
        'key': '{{what}} is good.'
      }
    },
    'de_DE' : {
      translations: {
        'key': '{{what}} ist gut.'
      }
    }
  },
  defaultNS: 'translations',
  lng : 'en_EN',
  // debug : true
});

const HandelbarsI18next = require('./../handlebars-i18next.js');
HandelbarsI18next.init(Handlebars, i18next);

let compiled = Handlebars.compile(template);

console.log(compiled(data));