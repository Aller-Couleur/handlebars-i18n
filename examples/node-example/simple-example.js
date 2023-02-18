/**
 * A simple example using handlebars-i18n.js
 *
 * @author: Florian Walzel
 * @date: 2021-01
 *
 * usage:
 * $ npm run example:js
 */


'use strict';

const Handlebars = require('handlebars');
const i18next = require('i18next');
const HandlebarsI18n = require('../../dist/handlebars-i18n.js');

// -- The translation phrases for i18next
i18next
  .init({
    resources : {
      'en' : {
        translation : {
          'key0': 'Change Language to',
          'key1': 'What is good?',
          'key2': '{{what}} is good.',
          'key3WithCount': '{{count}} item',
          'key3WithCount_plural': '{{count}} items',
          'key4': 'Selected Language is:'
        }
      },
      'de' : {
        translation: {
          'key0': 'Sprache wechseln zu',
          'key1': 'Was ist gut?',
          'key2': '{{what}} ist gut.',
          'key3WithCount': '{{count}} Gegenstand',
          'key3WithCount_plural': '{{count}} Gegenstände',
          'key4': 'Die ausgewählte Sprache ist:'
        }
      }
    },
    lng : 'en',
    compatibilityJSON: 'v2'
  });

// -- Handlebars' example data object
let data = {
  sayWhat : 'handlebars-i18n',
  holdKey3 : 'key3WithCount',
  holdKey4 : 'key4',
  mynumber : 33.333,
  myMmaxDigits: 1,
  myPrice: 12.99,
  myDate: '2020-03-11T03:24:00'
};

// -- Init and configure handlebars-i18n
HandlebarsI18n.init();
HandlebarsI18n.configure([
  // generic configuration for all languages for number representation:
  ['all', 'NumberFormat', { minimumFractionDigits: 2 }],
  // generic configurations per language for price representation:
  ['en', 'PriceFormat', { currency: 'USD'}],
  ['de', 'PriceFormat', { currency: 'EUR'}],
  // generic configurations per language for date representation:
  ['en', 'DateTimeFormat', { year:'numeric', month:'long', day:'numeric', hour:'numeric', minute:'numeric'}],
  ['de', 'DateTimeFormat', { year:'numeric', month:'numeric', day:'numeric', hour:'numeric', minute:'numeric', hour12:false}],
  // configurations per language with custom formats for date:
  ['en', 'DateTimeFormat', { year:'numeric' }, 'custom-year-only'],
  ['de', 'DateTimeFormat', { year:'numeric' }, 'custom-year-only'],
  ['en', 'DateTimeFormat', { year:'numeric', month:'numeric', day:'numeric' }, 'custom-date-short'],
  ['de', 'DateTimeFormat', { year:'numeric', month:'numeric', day:'numeric' }, 'custom-date-short'],
  ['en', 'DateTimeFormat', { hour:'numeric', minute:'numeric', second:'numeric', hour12:false}, 'custom-time'],
  ['de', 'DateTimeFormat', { hour:'numeric', minute:'numeric', second:'numeric', hour12:false}, 'custom-time']
]);

let template;

template = '\n' + 'EXAMPLE OUTPUT:' + '\n';
template += '------------------------' + '\n';

// Translations
// ----------------------------------------

// Simple translation, key given as string:
template += '{{__ "key1"}}' + '\n';

// Translation with variable replacement:
template += '{{__ "key2" what=sayWhat}}' + '\n';

// Phrase with [singular] / plural:
template += '{{__ "key3WithCount" count=1}}' + '\n';

// Phrase with singular / [plural]:
template += '{{__ "key3WithCount" count=7}}' + '\n';

// Override language to use:
template += '{{__ "key1" lng="de"}}' + '\n';


// Output selected language
// ----------------------------------------

// Translation key given through handlebars variable and _locale output:
template += '{{__ holdKey4}} {{_locale}}' + '\n';

// Check against selected language:
template += '{{#if (localeIs "en")}}English {{else}}Deutsch {{/if}}' + '\n';


// Number representation
// ----------------------------------------

// Number representation as configured for all languages:
template += '{{_num 7000}}' + '\n';

// Number representation with specific format attribute:
template += '{{_num 3.1415926 maximumFractionDigits=0}}' + '\n';

// Number and attribute given through handlebars variables:
template += '{{_num mynumber maximumFractionDigits=myMaxDigits}}' + '\n';


// Price representation
// ----------------------------------------

// Price representation as configured per language:
template += '{{_price 9999.99}}' + '\n';

// Price representation with specific format attributes:
template += '{{_price 1000.99 currency="JPY" minimumFractionDigits=0}}' + '\n';

// Price given through handlebars variable and with with specific format attribute:
template += '{{_price myPrice currency="DKK"}}' + '\n';


// date representation
// ----------------------------------------

// Todays date as configured per language:
template += '{{_date}}' + '\n';

// Date given as date string:
template += '{{_date "2020-03-11T03:24:00"}}' + '\n';

// Date given in milliseconds since begin of unix epoch:
template += '{{_date 1583922952743}}' + '\n';

// Date given as javascript date parameter array:
template += '{{_date "[2012, 11, 20, 3, 0, 0]"}}' + '\n';

// Todays date with with specific format attributes:
template += '{{_date "today" year="2-digit" month="2-digit" day="2-digit"}}' + '\n';

// Date given through handlebars variable:
template += '{{_date myDate}}' + '\n';

// Date formated by custom configuration (subset "custom-year-only"):
template += '{{_date myDate format="custom-year-only"}}' + '\n';

// Date formated by custom configuration (subset "custom-date-short"):
template += '{{_date myDate format="custom-date-short"}}' + '\n';

// Date formated by custom configuration (subset "custom-date-short"):
template += '{{_date myDate format="custom-time"}}' + '\n';


let compiled = Handlebars.compile(template);
i18next.changeLanguage('de'); // --> Test the changes by replacing 'de' with 'en'

console.log('\x1b[36m%s\x1b[0m', compiled(data));