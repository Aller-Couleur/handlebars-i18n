/**
 * Tests for handlebars-i18n.js
 *
 * usage:
 * $ cd test
 * $ npm run test
 */

const assert = require('chai').assert;
const expect = require('chai').expect;

const Handlebars = require('handlebars');
const i18next = require('i18next');
const HandlebarsI18n = require('../dist/handlebars-i18n');
//const HandlebarsModified = require("handlebars");

describe('handlebars-i18n Test', function() {

  const i18nInitObj = {
    resources : {
      'en' : {
        translation : {
          'key1': 'What is good?',
          'key2': '{{what}} is {{adverb}}.'
        }
      },
      'de' : {
        translation: {
          'key1': 'Was ist gut?',
          'key2': '{{what}} ist {{adverb}}.'
        }
      }
    },
    lng : 'en'
  };

  const hI18n = HandlebarsI18n.init();

  // -- Tests for method init() -- //

  it('after method call init() should return an object (HandlebarsEnvironment)', function() {
    assert.isObject(hI18n);
  });

  it('after method call init() HandlebarsEnvironment object should have a function __', function() {
    assert.isFunction(hI18n.helpers.__);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _locale', function() {
    assert.isFunction(hI18n.helpers._locale);
  });

  it('after method call init() HandlebarsEnvironment object should have a function localeIs', function() {
    assert.isFunction(hI18n.helpers.localeIs);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _date', function() {
    assert.isFunction(hI18n.helpers._date);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _num', function() {
    assert.isFunction(hI18n.helpers._num);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _price', function() {
    assert.isFunction(hI18n.helpers._price);
  });

  // -- Tests for method init() with override Argument -- //

  it('after method call init(overrideHndlbrs) with custom handlebars Object, HandlebarsEnvironment object should have custom function foo', function() {
    const HandlebarsModified = require('handlebars');
    HandlebarsModified.registerHelper('foo', function() { return true });
    const hI18nMod = HandlebarsI18n.init(HandlebarsModified);
    assert.isFunction(hI18nMod.helpers.foo);
  });

  it('after method call init(null, overrideI18n) with custom i18n Object, i18n object should have custom function foo', function() {
    const i18nModified = require('i18next');
    i18nModified.init({supportedLngs: ['de','en']});
    const hI18nMod = HandlebarsI18n.init(null, i18nModified);
    assert.isFunction(function(){}); // write a test here
  });


  // -- Tests for function _locale -- //

  it('expecting function _locale to be [undefined] as long as no language was set with i18next.init', function() {
    i18next.init(); // empty init
    const res = hI18n.helpers._locale();
    expect(res).to.be.undefined;
  });

  it('function _locale should return "en" if language is specified as "en" by init Object', function() {
    i18next.init(i18nInitObj); // initialize with data
    const res = hI18n.helpers._locale();
    assert.equal('en', res);
  });

  it('function _locale should return "de" after language change to "de"', function() {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._locale();
    assert.equal('de', res);
  });


  // -- Tests for function isLocale -- //

  it('function isLocale should return TRUE when current language is set to "en" and given "en" as parameter', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers.localeIs('en');
    assert.equal(true, res);
  });

  it('function isLocale should return FALSE when current language is set to "en" and given "someOther" as parameter', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers.localeIs('someOther');
    assert.equal(false, res);
  });


  // -- Tests for function __ -- //

  it('expecting __ to throw error when called with no parameter', function() {
    expect(function() { hI18n.helpers.__() }).to.throw();
  });

  it('function __ should return a SafeString object with property "string" where "string" returns the first argument given to __', function() {
    const res = hI18n.helpers.__("someNoneExitingKey", { hash: {} });
    assert.equal("someNoneExitingKey", res.string);
  });

  it('function __ should return a SafeString object with property "string" where "string" contains "What is good?!', function() {
    const res = hI18n.helpers.__("key1", { hash: {} });
    assert.equal("What is good?", res.string);
  });

  it('function __ should return a SafeString object with property "string" where "string" contains "Was ist gut?"', function() {
    i18next.changeLanguage('de');
    const res = hI18n.helpers.__("key1", { hash: {} });
    assert.equal("Was ist gut?", res.string);
  });

  it('function __ should return a SafeString object with property "string" where "string" contains "handlebarsI18next is good."', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers.__("key2", { hash: { what : "handlebarsI18next", adverb : "good" } });
    assert.equal("handlebarsI18next is good.", res.string);
  });

  it('function __ should return a SafeString object with property "string" where "string" contains "handlebarsI18next ist gut."', function() {
    i18next.changeLanguage('de');
    const res = hI18n.helpers.__("key2", { hash: { what: "handlebarsI18next", adverb: "gut" } });
    assert.equal("handlebarsI18next ist gut.", res.string);
  });


  // -- Tests for function _date -- //

  it('expect function _date to throw error when called with invalid date parameter', function() {
    expect(function() { hI18n.helpers._date('someStrangeString') }).to.throw("Invalid valid date passed to format");
  });

  it('function _date should return today\'s date in Intl default format when called without parameter', function() {
    i18next.changeLanguage('en');
    const today = new Date();
    const todayFormated = new Intl.DateTimeFormat().format(today);

    const res = hI18n.helpers._date();
    assert.equal(todayFormated, res);
  });

  it('function _date should return today\'s date in Intl default format when called with parameter, "Today" or "Now" no matter of upper or lower case writing', function() {
    i18next.changeLanguage('en');
    const today = new Date();
    const todayFormated = new Intl.DateTimeFormat().format(today);

    assert.equal(todayFormated, hI18n.helpers._date("today"));
    assert.equal(todayFormated, hI18n.helpers._date("Today"));
    assert.equal(todayFormated, hI18n.helpers._date("TODAY"));
    assert.equal(todayFormated, hI18n.helpers._date("now"));
    assert.equal(todayFormated, hI18n.helpers._date("Now"));
    assert.equal(todayFormated, hI18n.helpers._date("NOW"));
  });

  it('function _date should return "1/1/1970" (Intl default format) when called with parameter 1 as number ', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date(1);
    assert.equal('1/1/1970', res);
  });

  it('function _date should return "12/17/1995" (Intl default format) when called with parameter "1995-12-17T03:24:00"', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('1995-12-17T03:24:00');
    assert.equal('12/17/1995', res);
  });

  it('function _date should return "12/17/1995" (Intl default format) when called with parameter "December 17, 1995 03:24:00"', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00');
    assert.equal('12/17/1995', res);
  });

  it('function _date should return "1/1/2020" (Intl default format) when called with parameter "[2020]"', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('[1995]');
    assert.equal('1/1/1995', res);
  });

  it('function _date should return "12/1/1995" (Intl default format) when called with parameter "[2020,11]"', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('[1995,11]');
    assert.equal('12/1/1995', res);
  });

  it('function _date should return "12/17/1995" (Intl default format) when called with parameter "[2020,11,17]"', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('[1995,11,17]');
    assert.equal('12/17/1995', res);
  });

  it('function _date should return "12/1/95" when called with parameter "[2020,11,01] and specifying options"', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('[1995,11,1]', { hash: { year:"2-digit", month:"2-digit", day:"2-digit" } });
    assert.equal('12/1/95', res);
  });

  it('function _date should return "01.12.95" when called with parameter "[2020,11,01] and specifying options an language set to "de"', function() {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._date('[1995,11,1]', { hash: { year:"2-digit", month:"2-digit", day:"2-digit" } });
    assert.equal('01.12.95', res);
  });


  // -- Tests for function _num -- //

  it('function _num should return comma separated triples of decimals when language is "en"', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, { hash: {} });
    assert.equal('4,000,000', res);
  });

  it('function _num should return dot separated triples of decimals when language is "de"', function() {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._num(4000000, { hash: {} });
    assert.equal('4.000.000', res);
  });

  it('function _num should return comma separated triples of decimals and 2 fraction digits"', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, { hash: { minimumFractionDigits : 2 } });
    assert.equal('4,000,000.00', res);
  });

  it('function _num should return dot separated triples of decimals and 2 fraction digits when language is "de"', function() {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._num(4000000, { hash: { minimumFractionDigits : 2 } });
    assert.equal('4.000.000,00', res);
  });


  // -- Tests for function _price -- //

  it('function _currency should return price in € written in comma separated triples of decimals and 2 fraction digits with leading currency symbol', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(4000000, { hash: {} });
    assert.equal('€4,000,000.00', res);
  });

  it('function _currency should return price in € written in dot separated triples of decimals and 2 fraction digits with trailing currency symbol', function() {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._price(4000000, { hash: {} });
    assert.isString(res);
    assert.equal('4.000.000,00 €', res);
  });

  it('function _currency should return price in ¥ written in comma separated triples of decimals with leading currency symbol', function() {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(4000000, { hash: { currency: 'JPY', maximumFractionDigits: 0 } });
    assert.equal('¥4,000,000', res);
  });

  it('function _currency should return price in ¥ written in comma separated triples of decimals with trailing currency symbol', function() {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._price(4000000, { hash: { currency: 'JPY', maximumFractionDigits: 0 } });
    assert.equal('4.000.000 ¥', res);
  });


  // -- Tests for method configure() -- //

  it('method configure() should return false if called without argument', function() {
    const configure = HandlebarsI18n.configure();
    assert.isNotOk(configure);
  });

  it('method configure() should return false if called with empty array []', function() {
    const configure = HandlebarsI18n.configure([]);
    assert.isNotOk(configure);
  });

  it('method configure() should return false if called with only one argument', function() {
    const configure = HandlebarsI18n.configure('en');
    assert.isNotOk(configure);
  });

  it('method configure() should return false if called with language argument and invalid second argument', function() {
    const configure = HandlebarsI18n.configure('en', 'somestrangeinput');
    assert.isNotOk(configure);
  });

  it('method configure() should return false if called with language argument "en" and second argument "DateTimeFormat" and Number (invalid argument) as third', function() {
    const configure = HandlebarsI18n.configure('en', 'DateTimeFormat', 12);
    assert.isNotOk(configure);
  });

  it('method configure() should return true if called with language argument "en" and second argument "DateTimeFormat" and options object as third argument', function() {
    const configure = HandlebarsI18n.configure('en', 'DateTimeFormat', { year:'numeric' } );
    assert.isOk(configure);
  });

  it('method configure() should return true if called with arguments "en", "DateTimeFormat", { year:"numeric" } and a string as custom configuration name', function() {
    const configure = HandlebarsI18n.configure('en', 'DateTimeFormat', { year:'numeric' }, "my-custom-conf" );
    assert.isOk(configure);
  });

  it('method configure() should return false if called with arguments "en", "DateTimeFormat", { year:"numeric" } and an additional object (invalid argument)', function() {
    const configure = HandlebarsI18n.configure('en', 'DateTimeFormat', { year:'numeric' }, {} );
    assert.isNotOk(configure);
  });

  it('method configure() should return false if called with arguments "en", "DateTimeFormat", { year:"numeric" } and an additional empty string (invalid argument)', function() {
    const configure = HandlebarsI18n.configure('en', 'DateTimeFormat', { year:'numeric' }, "" );
    assert.isNotOk(configure);
  });


  // -- Tests for method reset() -- //

  it('method reset() should return TRUE if called', function() {
    const res = HandlebarsI18n.reset();
    assert.isOk(res);
  });

  it('function _num should return Intl standard format (no fraction digits) after reset() beeing called', function() {
    HandlebarsI18n.configure('en', 'NumberFormat', { minimumFractionDigits:4 } );
    i18next.changeLanguage('en');
    HandlebarsI18n.reset();
    const res = hI18n.helpers._num(4000000);
    assert.equal('4,000,000', res);
  });


  // -- Tests for custom format configurations for function _date -- //

  it('function _date when called after configure() with defined custom format (year:2-digit) should return ' +
    'date "95" when language is "en"', function() {
    HandlebarsI18n.configure('en', 'DateTimeFormat', { year:"2-digit" }, 'my-custom-format');
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', { hash: { format: 'my-custom-format'} });
    assert.equal('95', res);
  });

  it('function _date when called after configure() with defined custom format (year:2-digit) given as ARRAY should return ' +
    'date "12/17/95" when language is "en"', function() {
    HandlebarsI18n.configure(['en', 'DateTimeFormat', { year:"2-digit" }, 'my-custom-format']);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', { hash: { format: 'my-custom-format'} });
    assert.equal('95', res);
  });

  it('function _date when called after configure() with defined custom format (year:2-digit) should override ' +
    'standard configuration when language is "en"', function() {
    HandlebarsI18n.configure([
      ['en', 'DateTimeFormat', { year:"numeric" }],
      ['en', 'DateTimeFormat', { year:"2-digit" }, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', { hash: { format: 'my-custom-format'} });
    assert.equal('95', res);
  });

  it('function _date when called after configure() with defined custom format (year:2-digit) should override ' +
    'standard configuration also when beeing defined first', function() {
    HandlebarsI18n.configure([
      ['en', 'DateTimeFormat', { year:"2-digit" }, 'my-custom-format'],
      ['en', 'DateTimeFormat', { year:"numeric" }]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', { hash: { format: 'my-custom-format'} });
    assert.equal('95', res);
  });

  it('function _date when called after configure() should fall back to generic language format "en" when custom format is unknown' +
    'standard configuration also when beeing defined first', function() {
    HandlebarsI18n.configure([
      ['en', 'DateTimeFormat', { year:"2-digit" }, 'my-custom-format'],
      ['en', 'DateTimeFormat', { year:"numeric" }]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', { hash: { format: 'my-unknown-format'} });
    assert.equal('1995', res);
  });

  it('function _date when called after configure() should fall back to generic language format "all" when custom format is unknown' +
    'standard configuration also when beeing defined first', function() {
    HandlebarsI18n.configure([
      ['all', 'DateTimeFormat', { year:"2-digit" }, 'my-custom-format'],
      ['en', 'DateTimeFormat', { year:"numeric" }]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', { hash: { format: 'my-unknown-format'} });
    assert.equal('1995', res);
  });

  it('function _date when called after configure() should fall back to Intl default format when custom format is unknown' +
    'standard configuration also when beeing defined first', function() {
    HandlebarsI18n.reset();
    HandlebarsI18n.configure([
      ['en', 'DateTimeFormat', { year:"2-digit" }, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', { hash: { format: 'my-unknown-format'} });
    assert.equal('12/17/1995', res);
  });
  

  // -- Tests for custom format configurations for function _num -- //

  it('function _num when called after configure() with defined custom format (minimumFractionDigits:4) should return ' +
    'comma separated triples of decimals and 4 fraction of digits when language is "en"', function() {
    HandlebarsI18n.configure('en', 'NumberFormat', { minimumFractionDigits:4 }, 'my-custom-format');
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, { hash: { format: 'my-custom-format'} });
    assert.equal('4,000,000.0000', res);
  });

  it('function _num when called after configure() with defined custom format (minimumFractionDigits:4) given as ARRAY should return ' +
    'comma separated triples of decimals and 4 fraction of digits when language is "en"', function() {
    HandlebarsI18n.configure(['en', 'NumberFormat', { minimumFractionDigits:4 }, 'my-custom-format']);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, { hash: { format: 'my-custom-format'} });
    assert.equal('4,000,000.0000', res);
  });

  it('function _num when called after configure() with defined custom format (minimumFractionDigits:4) should override' +
    'standard configuration when language is "en"', function() {
    HandlebarsI18n.configure([
      ['en', 'NumberFormat', { maximumFractionDigits:1 }],
      ['en', 'NumberFormat', { minimumFractionDigits:4 }, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, { hash: { format: 'my-custom-format'} });
    assert.equal('4,000,000.0000', res);
  });

  it('function _num when called after configure() with defined custom format (minimumFractionDigits:4) should override' +
    'standard configuration also when being defined first', function() {
    HandlebarsI18n.configure([
      ['en', 'NumberFormat', { minimumFractionDigits:4 }, 'my-custom-format'],
      ['en', 'NumberFormat', { maximumFractionDigits:1 }]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, { hash: { format: 'my-custom-format'} });
    assert.equal('4,000,000.0000', res);
  });

  it('function _num when called after configure() should fall back to standard language format "en" when custom format is unknown', function() {
    HandlebarsI18n.configure([
      ['en', 'NumberFormat', { minimumFractionDigits:4 }, 'my-custom-format'],
      ['en', 'NumberFormat', { minimumFractionDigits:1 }]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, { hash: { format: 'my-unknown-format'} });
    assert.equal('4,000,000.0', res);
  });

  it('function _num when called after configure() should fall back to standard language format "all" when custom format is unknown', function() {
    HandlebarsI18n.configure([
      ['en', 'NumberFormat', { minimumFractionDigits:4 }, 'my-custom-format'],
      ['all', 'NumberFormat', { minimumFractionDigits:1 }]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, { hash: { format: 'my-unknown-format'} });
    assert.equal('4,000,000.0', res);
  });

  it('function _num when called after configure() should fall back to Intl default when custom format is unknown', function() {
    HandlebarsI18n.reset();
    HandlebarsI18n.configure([
      ['en', 'NumberFormat', { minimumFractionDigits:4 }, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, { hash: { format: 'my-unknown-format'} });
    assert.equal('4,000,000', res);
  });


  // -- Tests for custom format configurations for function _price -- //

  it('function _price when called after configure() with defined custom format (minimumFractionDigits:4) should return ' +
    'comma separated triples of decimals and 4 fraction of digits when language is "en"', function() {
    HandlebarsI18n.configure('en', 'PriceFormat', { currency:'EUR', minimumFractionDigits:3 }, 'my-custom-format');
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, { hash: { format: 'my-custom-format'} });
    assert.equal('€2.000', res);
  });

  it('function _price when called after configure() with defined custom format (minimumFractionDigits:4) should return ' +
    'comma separated triples of decimals and 4 fraction of digits when language is "en"', function() {
    HandlebarsI18n.configure('en', 'PriceFormat', { currency:'EUR', minimumFractionDigits:3 }, 'my-custom-format');
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, { hash: { format: 'my-custom-format'} });
    assert.equal('€2.000', res);
  });

  it('function _price when called after configure() with defined custom format (minimumFractionDigits:4) given as ARRAY should return ' +
    'comma separated triples of decimals and 4 fraction of digits when language is "en"', function() {
    HandlebarsI18n.configure(['en', 'PriceFormat', { currency:'EUR', minimumFractionDigits:3 }, 'my-custom-format']);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, { hash: { format: 'my-custom-format'} });
    assert.equal('€2.000', res);
  });

  it('function _price when called after configure() with defined custom format (minimumFractionDigits:3) should override' +
    'standard configuration when language is "en"', function() {
    HandlebarsI18n.configure([
      ['en', 'PriceFormat', { currency:'USD'}],
      ['en', 'PriceFormat', { currency:'EUR', minimumFractionDigits:3 }, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, { hash: { format: 'my-custom-format'} });
    assert.equal('€2.000', res);
  });

  it('function _price when called after configure() with defined custom format (minimumFractionDigits:3) should override' +
    'standard configuration also when being defined first', function() {
    HandlebarsI18n.configure([
      ['en', 'PriceFormat', { currency:'EUR', minimumFractionDigits:3 }, 'my-custom-format'],
      ['en', 'PriceFormat', { currency:'USD'}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, { hash: { format: 'my-custom-format'} });
    assert.equal('€2.000', res);
  });

  it('function _price when called after configure() should fall back to standard language format "en" when custom format is unknown', function() {
    HandlebarsI18n.configure([
      ['en', 'PriceFormat', { currency:'EUR', minimumFractionDigits:3 }, 'my-custom-format'],
      ['en', 'PriceFormat', { currency:'USD'}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, { hash: { format: 'my-unknown-format'} });
    assert.equal('$2.00', res);
  });

  it('function _price when called after configure() should fall back to standard language format "all" when custom format is unknown', function() {
    HandlebarsI18n.configure([
      ['en', 'PriceFormat', { currency:'EUR', minimumFractionDigits:3 }, 'my-custom-format'],
      ['all', 'PriceFormat', { currency:'USD'}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, { hash: { format: 'my-unknown-format'} });
    assert.equal('$2.00', res);
  });

  it('function _price when called after configure() should fall back to Intl default when custom format is unknown', function() {
    HandlebarsI18n.configure([
      ['en', 'PriceFormat', { currency:'EUR', minimumFractionDigits:3 }, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, { hash: { format: 'my-unknown-format'} });
    assert.equal('$2.00', res);
  });

});