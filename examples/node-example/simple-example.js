/**
 * A simple example using handlebars-i18n.js
 *
 * @author: Florian Walzel
 *
 * usage:
 * $ npm run example:js
 */


'use strict';

const Handlebars = require('handlebars');
const i18next = require('i18next');
const HandlebarsI18n = require('../../dist/handlebars-i18n.js');
const htmlEntities = require('html-entities');

// -- The translation phrases for i18next
i18next
  .init({
    resources: {
      'en': {
        translation: {
          'key0': 'Change Language to',
          'key1': 'What is good?',
          'key2': '{{what}} is good.',
          'key3WithCount': '{{count}} item',
          'key3WithCount_plural': '{{count}} items',
          'key4': 'Selected Language is:'
        }
      },
      'de': {
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
    lng: 'en',
    compatibilityJSON: 'v2'
  });

// -- Handlebars' example data object
let data = {
  sayWhat: 'handlebars-i18n',
  holdKey3: 'key3WithCount',
  holdKey4: 'key4',
  mynumber: 33.333,
  myMmaxDigits: 1,
  myPrice: 12.99,
  myDate: '2020-03-11T03:24:00'
};

// -- Init and configure handlebars-i18n
HandlebarsI18n.init();
HandlebarsI18n.configure([
  // generic configuration for all languages for number representation:
  ['all', 'NumberFormat', {minimumFractionDigits: 2}],
  // generic configurations per language for price representation:
  ['en', 'PriceFormat', {currency: 'USD'}],
  ['de', 'PriceFormat', {currency: 'EUR'}],
  // generic configurations per language for date representation:
  ['en', 'DateTimeFormat', {year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric'}],
  ['de', 'DateTimeFormat', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false
  }],
  // configurations per language with custom formats for date:
  ['en', 'DateTimeFormat', {year: 'numeric'}, 'custom-year-only'],
  ['de', 'DateTimeFormat', {year: 'numeric'}, 'custom-year-only'],
  ['en', 'DateTimeFormat', {year: 'numeric', month: 'numeric', day: 'numeric'}, 'custom-date-short'],
  ['de', 'DateTimeFormat', {year: 'numeric', month: 'numeric', day: 'numeric'}, 'custom-date-short'],
  ['en', 'DateTimeFormat', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false}, 'custom-time'],
  ['de', 'DateTimeFormat', {hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: false}, 'custom-time'],
  // custom formats for relative dates:
  ['en', 'RelativeTimeFormat', {style: 'short', unit: 'year'}, 'date-rel-spec'],
  ['de', 'RelativeTimeFormat', {style: 'short', unit: 'year'}, 'date-rel-spec']
]);

let template;

/**
 * Replaces curly brackets by html entities so that it does not compile as handlebars.
 * Also adds line breaks and an arrow symbol.
 * Will be re-transformed with htmlEntities.decode() before logging
 * @param str
 * @returns {string}
 */
const raw = (str) => '\n\n' + str.replace(/{/g, '&lcub;').replace(/}/g, '&rcub;') + '\n&nbsp&#x2192;&nbsp;&nbsp;';

template = '\n' + 'HandlebarsI18n example output:' + '\n';
template += '-------------------------------------';

// Translations
// ----------------------------------------

// Simple translation, key given as string:
template += raw('{{__ "key1"}}');
template += '{{__ "key1"}}';

// Translation with variable replacement:
template += raw('{{__ "key2" what=sayWhat}}');
template += '{{__ "key2" what=sayWhat}}';

// Phrase with [singular] / plural:
template += raw('{{__ "key3WithCount" count=1}}');
template += '{{__ "key3WithCount" count=1}}';

// Phrase with singular / [plural]:
template += raw('{{__ "key3WithCount" count=7}}');
template += '{{__ "key3WithCount" count=7}}';

// Override language to use:
template += raw('{{__ "key1" lng="de"}}');
template += '{{__ "key1" lng="de"}}';


// Output selected language
// ----------------------------------------

// Translation key given through handlebars variable and _locale output:
  template += raw('{{__ holdKey4}} {{_locale}}');
  template += '{{__ holdKey4}} {{_locale}}';

// Check against selected language:
  template += raw('{{#if (localeIs "en")}}English {{else}}Deutsch {{/if}}');
  template += '{{#if (localeIs "en")}}English {{else}}Deutsch {{/if}}';


// Number representation
// ----------------------------------------

// Number representation as configured for all languages:
  template += raw('{{_num 7000}}');
  template += '{{_num 7000}}';

// Number representation with specific format attribute:
  template += raw('{{_num 3.1415926 maximumFractionDigits=0}}');
  template += '{{_num 3.1415926 maximumFractionDigits=0}}';

// Number and attribute given through handlebars variables:
  template += raw('{{_num mynumber maximumFractionDigits=myMaxDigits}}');
  template += '{{_num mynumber maximumFractionDigits=myMaxDigits}}';


// Price representation
// ----------------------------------------

// Price representation as configured per language:
  template += raw('{{_price 9999.99}}');
  template += '{{_price 9999.99}}';

// Price representation with specific format attributes:
  template += raw('{{_price 1000.99 currency="JPY" minimumFractionDigits=0}}');
  template += '{{_price 1000.99 currency="JPY" minimumFractionDigits=0}}';

// Price given through handlebars variable and with specific format attribute:
  template += raw('{{_price myPrice currency="DKK"}}');
  template += '{{_price myPrice currency="DKK"}}';


// Date representation
// ----------------------------------------

// Todays’ date as configured per language:
  template += raw('{{_date}}');
  template += '{{_date}}';

// Date given as date string:
  template += raw('{{_date "2020-03-11T03:24:00"}}');
  template += '{{_date "2020-03-11T03:24:00"}}';

// Date given in milliseconds since begin of unix epoch:
  template += raw('{{_date 1583922952743}}');
  template += '{{_date 1583922952743}}';

// Date given as javascript date parameter array:
  template += raw('{{_date "[2012, 11, 20, 3, 0, 0]"}}');
  template += '{{_date "[2012, 11, 20, 3, 0, 0]"}}';

// Todays’ date with specific format attributes:
  template += raw('{{_date "today" year="2-digit" month="2-digit" day="2-digit"}}');
  template += '{{_date "today" year="2-digit" month="2-digit" day="2-digit"}}';

// Date given through handlebars variable:
  template += raw('{{_date myDate}}');
  template += '{{_date myDate}}';

// Date formatted by custom configuration (subset "custom-year-only"):
  template += raw('{{_date myDate format="custom-year-only"}}');
  template += '{{_date myDate format="custom-year-only"}}';

// Date formatted by custom configuration (subset "custom-date-short"):
  template += raw('{{_date myDate format="custom-date-short"}}');
  template += '{{_date myDate format="custom-date-short"}}';

// Date formatted by custom configuration (subset "custom-date-short"):
  template += raw('{{_date myDate format="custom-time"}}');
  template += '{{_date myDate format="custom-time"}}';

// Relative date representation
// ----------------------------------------

// Date with positive time offset:
  template += raw('{{_dateAdd "December 17, 1995 08:00:00" 24 unit="hour"}}');
  template += '{{_dateAdd "December 17, 1995 08:00:00" 24 unit="hour"}}';

// Date with negative time offset:
  template += raw('{{_dateAdd "December 17, 1995" -10 unit="day"}}');
  template += '{{_dateAdd "December 17, 1995" -10 unit="day"}}';

// Relative difference between two dates:
  template += raw('{{_dateDiff "1996-12-07T00:00:00" "1996-12-08T00:00:00" unit="day"}}');
  template += '{{_dateDiff "1996-12-07T00:00:00" "1996-12-08T00:00:00" unit="day"}}';

// Relative difference between two dates with custom configuration (subset "date-rel-spec"):
  template += raw('{{_dateDiff myDate "1995-12-17T00:00:00" format="date-rel-spec"}}');
  template += '{{_dateDiff myDate "1995-12-17T00:00:00" format="date-rel-spec"}}';

// Relative date event in the future:
  template += raw('{{_dateRel 7 unit="hour"}}');
  template += '{{_dateRel 7 unit="hour"}}';

// Relative date event in the past:
  template += raw('{{_dateRel -7 unit="hour"}}');
  template += '{{_dateRel -7 unit="hour"}}';

  const compiled = Handlebars.compile(template);

  i18next.changeLanguage('de'); // --> Test the changes by replacing 'de' with 'en'

  const decoded = htmlEntities.decode(compiled(data));

  console.log('\x1b[36m%s\x1b[0m', decoded);