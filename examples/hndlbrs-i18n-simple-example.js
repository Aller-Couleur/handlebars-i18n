/**
 * Simple Example using handlebars-i18next.js
 *
 * @author: Florian Walzel
 * @date: 2020-03
 */

'use strict';

const Handlebars = require('handlebars');
const i18next = require('i18next');
const HandelbarsI18next = require('./../handlebars-i18next.js');

i18next
  .init({
  resources : {
    'en' : {
      translation : {
        'key1': 'What is good?',
        'key2': '{{what}} is good.',
        'key3WithCount': '{{count}} item',
        'key3WithCount_plural': '{{count}} items',
        'key4': 'Selected Language is:',
      }
    },
    'de' : {
      translation: {
        'key1': 'Was ist gut?',
        'key2': '{{what}} ist gut.',
        'key3WithCount': '{{count}} Gegenstand',
        'key3WithCount_plural': '{{count}} Gegenstände',
        'key4': 'Die ausgewählte Sprache ist:',
      }
    }
  },
  lng : 'en' // change to 'en' to see the difference
  //debug : true
});

let data = {
  sayWhat : 'HandelbarsI18next',
  holdKey3 : 'key3WithCount',
  number : 33,
  holdKey4 : 'key4'
};

HandelbarsI18next.init();
HandelbarsI18next.configure([
  ['en', 'PriceFormat', { currency: 'USD'}],
  ['de', 'PriceFormat', { currency: 'EUR'}]
]);

let template;

template = 'EXAMPLE OUTPUT:' + '\n';
template += '------------------------' + '\n';

// key given as string
template += '{{__ "key1"}}' + '\n';

// key with variable replacement
template += '{{__ "key2" what=sayWhat}}' + '\n';

// phrase with singular
template += '{{__ "key3WithCount" count=1}}' + '\n';

// phrase with plural
template += '{{__ "key3WithCount" count=7}}' + '\n';

// key given as handlebars variable and _locale output
template += '{{_v holdKey4}} {{_locale}}' + '\n';

// if condition for selected language
template += '{{#if (localeIs "en")}}RED {{else}}BLUE {{/if}}' + '\n';

// number representation
template += '{{_num 4000000.2}}' + '\n';

// price representation
template += '{{_price 9999.99}}' + '\n';

// price representation with custom settings
template += '{{_price 9999.99 currency="JPY"}}' + '\n';


//let template = '<h1>{{__ "key1"}}</h1>';
//let template = '<h1>{{__ "key2" what=name}}</h1>';
//let template = '<h1>{{__ "key3WithCount" count=7 }}</h1>';
//let template = '{{#if (localeIs "de")}}Hello DE{{/if}}';
//let template = '{{_num 40000000.3}}';
//let template = '{{_price 400000}}';
//let template = '{{_price 400000 currency="EUR"}}';
//let template = '{{_date "March 11, 2020 03:24:00"}}';

let compiled = Handlebars.compile(template);

// output the test
console.log(compiled(data));