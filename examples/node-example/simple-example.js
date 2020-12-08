/**
 * A simple example using handlebars-i18n.js
 *
 * @author: Florian Walzel
 * @date: 2020-12
 *
 * usage:
 * $ cd examples/node-example
 * $ node simple-example.js
 */


'use strict';

const Handlebars = require('handlebars');
const i18next = require('i18next');
const HandlebarsI18n = require('../../dist/handlebars-i18n.js');

i18next
  .init({
  resources : {
    'en' : {
      translation : {
        'key1': 'What is good?',
        'key2': '{{what}} is good.',
        'key3WithCount': '{{count}} item',
        'key3WithCount_plural': '{{count}} items',
        'key4': 'Selected Language is:'
      }
    },
    'de' : {
      translation: {
        'key1': 'Was ist gut?',
        'key2': '{{what}} ist gut.',
        'key3WithCount': '{{count}} Gegenstand',
        'key3WithCount_plural': '{{count}} Gegenstände',
        'key4': 'Die ausgewählte Sprache ist:'
      }
    }
  },
  lng : 'en' // change to 'de' to see the alternative translations
});

let data = {
  sayWhat : 'handlebars-i18n',
  holdKey3 : 'key3WithCount',
  holdKey4 : 'key4',
  number : 33.333,
  maxDigits: 1,
  myPrice: 12.99,
  myDate: '2020-03-11T03:24:00'
};

HandlebarsI18n.init();

/*
HandlebarsI18n.configure([
 ['all', 'NumberFormat', { minimumFractionDigits: 2 }],
 ['en', 'PriceFormat', { currency: 'USD'}],
 ['de', 'PriceFormat', { currency: 'EUR'}],
 ['en', 'DateTimeFormat', { year:'numeric', month:'long', day:'numeric', hour:'numeric', minute:'numeric'}],
 ['de', 'DateTimeFormat', { year:'numeric', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric', hour12:false}]
 ]);
 */

/*
HandlebarsI18n.configure([
 ['all', 'NumberFormat', { minimumFractionDigits: 2 }],
 ]);
 */

let template;

template = '\n' + 'EXAMPLE OUTPUT:' + '\n';
template += '------------------------' + '\n';

// key given as string
template += '{{__ "key1"}}' + '\n';

// key with variable replacement
template += '{{__ "key2" what=sayWhat}}' + '\n';

// phrase with [singular] / plural
template += '{{__ "key3WithCount" count=1}}' + '\n';

// phrase with singular / [plural]
template += '{{__ "key3WithCount" count=7}}' + '\n';

// key given as handlebars variable and _locale output
template += '{{__ holdKey4}} {{_locale}}' + '\n';

// if condition against selected language
template += '{{#if (localeIs "en")}}English {{else}}Deutsch {{/if}}' + '\n';

// number representation
template += '{{_num 4000000.2}}' + '\n';

// number representation with custom configuration
template += '{{_num 4000000.2 maximumFractionDigits=0}}' + '\n';

// number given as handlebars variable
template += '{{_num number maximumFractionDigits=maxDigits}}' + '\n';

// price representation
template += '{{_price 9999.99}}' + '\n';

// price representation with custom configuration
template += '{{_price 1000 currency="JPY" minimumFractionDigits=1}}' + '\n';

// price given as handlebars variable
template += '{{_price myPrice currency="DKK"}}' + '\n';

// todays date
template += '{{_date}}' + '\n';

// todays date with custom configuration
template += '{{_date "today" year="2-digit" month="2-digit" day="2-digit"}}' + '\n';

// date given as date string
template += '{{_date "2020-03-11T03:24:00"}}' + '\n';

// date given in milliseconds since begin of unix epoch
template += '{{_date 1583922952743}}' + '\n';

// date given as javascript date parameters
template += '{{_date "[2012, 11, 20, 3, 0, 0]"}}' + '\n';

// date given as handlebars variable
template += '{{_date myDate}}' + '\n';


let compiled = Handlebars.compile(template);

console.log('\x1b[36m%s\x1b[0m', compiled(data));