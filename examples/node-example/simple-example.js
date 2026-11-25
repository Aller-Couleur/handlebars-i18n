/**
 * A simple example using handlebars-i18n.js
 *
 * Mirrors the content structure of examples/browser-example/index.html
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

// -- The translation phrases for i18next
i18next
  .init({
    resources: {
      'en': {
        translation: {
          'key0': 'Language',
          'key1': 'What is good?',
          'key2': '{{what}} is good.',
          'key3WithCount_one': '{{count}} item',
          'key3WithCount_other': '{{count}} items',
          'key4': 'Selected Language is:',
          'key5': 'I am the default translation.',
          'fruits': ['Apple', 'Banana', 'Cherry'],
          'steps': [
            {'title': 'Step 1', 'text': 'Open the app'},
            {'title': 'Step 2', 'text': 'Click start'}
          ]
        }
      },
      'de': {
        translation: {
          'key0': 'Sprache',
          'key1': 'Was ist gut?',
          'key2': '{{what}} ist gut.',
          'key3WithCount_one': '{{count}} Gegenstand',
          'key3WithCount_other': '{{count}} Gegenstände',
          'key4': 'Die ausgewählte Sprache ist:',
          'key5': 'Ich bin die Standard-Übersetzung.',
          'fruits': ['Apfel', 'Banane', 'Kirsche'],
          'steps': [
            {'title': 'Schritt 1', 'text': 'App öffnen'},
            {'title': 'Schritt 2', 'text': 'Klicke auf Start'}
          ]
        }
      }
    },
    lng: 'en',
    compatibilityJSON: 'v4', // important: defines the JSON standard for plurals
    returnObjects: true // set to true if you want to loop over an array or objects of properties
  });

// -- Handlebars' example data object
let data = {
  sayWhat: 'handlebars-i18n',
  holdKey3: 'key3WithCount',
  holdKey4: 'key4',
  mynumber: 33.333,
  myMaxDigits: 1,
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

/**
 * The examples below are organized like the sections in
 * examples/browser-example/index.html. Each entry is
 * [description, handlebars snippet] — the snippet gets printed
 * un-rendered and below its compiled output.
 */
const sections = [
  {
    title: 'Translations ( __ )',
    examples: [
      ['Simple translation, key given as string', '{{__ "key1"}}'],
      ['Translation key given through a handlebars variable', '{{__ holdKey4}}'],
      ['Translation with variable replacement', '{{__ "key2" what=sayWhat}}'],
      ['Phrase with [singular] / plural', '{{__ "key3WithCount" count=1}}'],
      ['Phrase with singular / [plural]', '{{__ "key3WithCount" count=7}}'],
      ['Override language to use', '{{__ "key1" lng="de"}}'],
      ['Loop over an array of translations', '<ul>{{#each (__ "fruits")}}<li>{{this}}</li>{{/each}}</ul>'],
      ['Loop over an array of objects', '<ul>{{#each (__ "steps")}}<li>{{this.title}} – {{this.text}}</li>{{/each}}</ul>']
    ]
  },
  {
    title: 'Fallbacks & key checks ( __fallback , keyExists )',
    examples: [
      ['Missing key falls back to another translation key', '{{__fallback "key.missing" fallbackKey="key5"}}'],
      ['Missing key falls back to a literal text', '{{__fallback "key.missing" fallbackText="This is a literal fallback text."}}'],
      ['Fallback key combined with plural count', '{{__fallback "key.missing" fallbackKey="key3WithCount" count=3}}'],
      ['Check whether a key exists', '{{#if (keyExists "key1")}}key "key1" exists{{else}}key "key1" is missing{{/if}}'],
      ['Check for a missing key', '{{#if (keyExists "key.missing")}}key "key.missing" exists{{else}}key "key.missing" is missing{{/if}}']
    ]
  },
  {
    title: 'Selected language ( _locale , localeIs )',
    examples: [
      ['Output the selected language', '{{__ "key4"}} {{_locale}}'],
      ['Check against the selected language', '{{#if (localeIs "en")}}English is selected{{else}}Deutsch ist ausgewählt{{/if}}'],
      ['Use it in markup, e.g. a flag icon', '<img src="img/{{#if (localeIs "en")}}united_kingdom{{else}}germany{{/if}}.png" height="20" alt="flag">']
    ]
  },
  {
    title: 'Number representation ( _num )',
    examples: [
      ['Number as configured for all languages', '{{_num 7000}}'],
      ['Number with a specific format attribute', '{{_num 3.1415926 maximumFractionDigits=2}}'],
      ['Number and attribute given through handlebars variables', '{{_num mynumber maximumFractionDigits=myMaxDigits}}']
    ]
  },
  {
    title: 'Price representation ( _price )',
    examples: [
      ['Price as configured per language', '{{_price 9999.99}}'],
      ['Price with specific format attributes', '{{_price 1000.99 currency="JPY" minimumFractionDigits=0}}'],
      ['Price given through a handlebars variable', '{{_price myPrice currency="DKK"}}']
    ]
  },
  {
    title: 'Date representation ( _date )',
    examples: [
      ['Current date as configured per language', '{{_date}}'],
      ['Date given as date string', '{{_date "2020-03-11T03:24:00"}}'],
      ['Date in milliseconds since begin of unix epoch', '{{_date 1583922952743}}'],
      ['Date given as javascript date parameter array', '{{_date "[2012, 11, 20, 3, 0, 0]"}}'],
      ['Current date with specific format attributes', '{{_date "today" year="2-digit" month="2-digit" day="2-digit"}}'],
      ['Date given through a handlebars variable', '{{_date myDate}}'],
      ['Custom configuration subset custom-year-only', '{{_date myDate format="custom-year-only"}}'],
      ['Custom configuration subset custom-date-short', '{{_date myDate format="custom-date-short"}}'],
      ['Custom configuration subset custom-time', '{{_date myDate format="custom-time"}}']
    ]
  },
  {
    title: 'Relative dates & date checks ( _dateRange , _dateAdd , _dateDiff , _dateRel , isFuture , isPast )',
    examples: [
      ['Date range, collapsed per locale conventions', '{{_dateRange "2021-01-10" "2021-01-12"}}'],
      ['Date range with a custom separator', '{{_dateRange "2021-01-10" "2021-01-12" " ⇔ "}}'],
      ['Date range with format attributes', '{{_dateRange "2021-01-10" "2021-01-12" month="long" day="numeric"}}'],
      ['Date with a positive time offset', '{{_dateAdd "December 17, 1995 08:00:00" 24 unit="hour"}}'],
      ['Date with a negative time offset', '{{_dateAdd "December 17, 1995" -10 unit="day"}}'],
      ['Relative difference between two dates', '{{_dateDiff "1996-12-07T00:00:00" "1996-12-08T00:00:00" unit="day"}}'],
      ['Difference with custom configuration subset date-rel-spec', '{{_dateDiff myDate "1995-12-17T00:00:00" format="date-rel-spec"}}'],
      ['Relative date event in the future', '{{_dateRel 7 unit="hour"}}'],
      ['Relative date event in the past', '{{_dateRel -7 unit="hour"}}'],
      ['Check if a date lies in the future', '{{#if (isFuture "2030-01-01")}}2030-01-01 lies in the future{{else}}2030-01-01 lies in the past{{/if}}'],
      ['Check if a date lies in the past', '{{#if (isPast "2020-01-01")}}2020-01-01 lies in the past{{else}}2020-01-01 lies in the future{{/if}}']
    ]
  }
];

// --> Test the changes by replacing 'en' with 'de'
i18next.changeLanguage('en');

// -- Semantic colors for the log output
const color = {
  bold: '\x1b[1m',
  dim: '\x1b[90m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  reset: '\x1b[0m'
};

// -- Build the output: description, un-rendered snippet, compiled result
let output = '\n' + color.bold + 'HandlebarsI18n example output' + color.reset + '\n';
output += color.bold + '========================================' + color.reset + '\n';

sections.forEach(function (section) {
  output += '\n' + color.yellow + section.title + color.reset + '\n';
  output += color.yellow + '----------------------------------------' + color.reset + '\n';
  section.examples.forEach(function (example) {
    output += color.dim + example[0] + color.reset + '\n'; // explanation
    output += color.cyan + '  ' + example[1] + color.reset + '\n'; // code sample
    output += color.green + '  → ' + Handlebars.compile(example[1])(data) + color.reset + '\n\n'; // result
  });
});

console.log('%s', output);