/**
 * Created by florianwalzel on 21.10.19.
 */

'use strict';

const Handlebars = require('handlebars');
const i18next = require('i18next');
const HandelbarsI18next = require('./../handlebars-i18next.js');

HandelbarsI18next.init();

i18next
  .init({
  resources : {
    'en' : {
      translation : {
        'key1': 'Is good.',
        'key2': '{{what}} is good.',
        'key3': 'item',
        'key3_plural': 'items',
        'key3WithCount': '{{count}} item',
        'key3WithCount_plural': '{{count}} items'
      }
    },
    'de' : {
      translation: {
        'key1': 'Ist gut.',
        'key2': '{{what}} ist gut.',
        'key3': 'Gegenstand',
        'key3_plural': 'Gegenstände',
        'key3WithCount': '{{count}} Gegenstand',
        'key3WithCount_plural': '{{count}} Gegenstände'
      }
    }
  },
  lng : 'de'
  //debug : true
});

let data = { name : 'HandelbarsI18next' };
//let template = '<h1>{{t "key1"}}</h1>';
//let template = '<h1>{{t "key2" what=name}}</h1>';
//let template = '<h1>{{__ "key3WithCount" count=7 }}</h1>';
//let template = '{{#if (localeIs "de")}}Hello DE{{/if}}';
//let template = '{{_num 400000}}';
let template = '{{_price 400000}}';


let compiled = Handlebars.compile(template);

console.log(compiled(data));