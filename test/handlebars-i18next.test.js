/**
 * Created by florianwalzel on 02.05.20.
 */

const assert = require('chai').assert;
const expect = require('chai').expect;

const Handlebars = require('handlebars');
const i18next = require('i18next');
const HandlebarsI18next = require('../dist/handlebars-i18next');


describe('handlebarsI18next Test', function() {

  const hI18n = HandlebarsI18next.init();

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


  // -- Tests for function __ -- //

  i18next.init();

  it('expecting __ to throw error when called with no parameter', function() {
    expect(function() { hI18n.helpers.__() }).to.throw("Cannot read property 'hash' of undefined");
  });

  it('expecting __ to throw error when called with missing second key', function() {
    expect(function() { hI18n.helpers.__("someKey") }).to.throw("Cannot read property 'hash' of undefined");
  });

  it('function __ should return a SafeString object with property "string" where "string" contains the first parameter given to __', function() {
    const res = hI18n.helpers.__("someKey", { hash: {} });
    assert.isObject(res);
    assert.isString(res.string);
    assert.equal("someKey", res.string);
  });

  // todo: more here


  // -- Tests for function _locale -- //

  it('expecting function _locale to be [undefined] as long as no language was set with i18next.init', function() {
    expect(hI18n.helpers._locale()).to.be.undefined;
  });

  it('function _locale should return "en" if language is specified via i18next.init as "en', function() {
    i18next.init({
        resources : {
          en : { translation : { } },
          de : { translation: { } }
        },
        lng : 'en'
      });
    assert.equal('en', hI18n.helpers._locale());
  });

  it('function _locale should return "de" after language change to "de"', function() {
    i18next.changeLanguage('de');
    assert.equal('de', hI18n.helpers._locale());
  });


  // -- Tests for function isLocale -- //

  it('function isLocale should return TRUE when current language is set to "en" and given "en" as parameter', function() {
    i18next.changeLanguage('en');
    assert.equal(true, hI18n.helpers.localeIs('en'));
  });

  it('function isLocale should return FALSE when current language is set to "en" and given "someOther" as parameter', function() {
    i18next.changeLanguage('en');
    assert.equal(false, hI18n.helpers.localeIs('someOther'));
  });


  // -- Tests for function _date -- //

  it('expect function _date to throw error when called with invalid date parameter', function() {
    expect(function() { hI18n.helpers._date('someStrangeString') }).to.throw("Invalid valid date passed to format");
  });

  it('function _date should return today\'s date in Intl default format when called without parameter', function() {
    const today = new Date();
    const todayFormated = new Intl.DateTimeFormat().format(today);
    assert.equal(todayFormated, hI18n.helpers._date());
  });

  it('function _date should return today\'s date in Intl default format when called with parameter, "Today" or "Now" ', function() {
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
    assert.equal('1/1/1970', hI18n.helpers._date(1));
  });

  it('function _date should return "12/17/1995" (Intl default format) when called with parameter "1995-12-17T03:24:00"', function() {
    assert.equal('12/17/1995', hI18n.helpers._date('1995-12-17T03:24:00'));
  });

  it('function _date should return "12/17/1995" (Intl default format) when called with parameter "December 17, 1995 03:24:00"', function() {
    assert.equal('12/17/1995', hI18n.helpers._date('December 17, 1995 03:24:00'));
  });

  it('function _date should return "1/1/2020" (Intl default format) when called with parameter "[2020]"', function() {
    assert.equal('1/1/1995', hI18n.helpers._date('[1995]'));
  });

  it('function _date should return "12/1/1995" (Intl default format) when called with parameter "[2020,11]"', function() {
    assert.equal('12/1/1995', hI18n.helpers._date('[1995,11]'));
  });

  it('function _date should return "12/17/1995" (Intl default format) when called with parameter "[2020,11,17]"', function() {
    assert.equal('12/17/1995', hI18n.helpers._date('[1995,11,17]'));
  });

  it('function _date should return 12/1/95"  when called with parameter "[2020,11,01] and specifying options"', function() {
    assert.equal('12/1/95', hI18n.helpers._date('[1995,11,1]', { hash: { year:"2-digit", month:"2-digit", day:"2-digit" }}));
  });


  // -- Tests for function _num -- //

  it('function _num should return comma separated triples of decimals when language is "en""', function() {
    i18next.changeLanguage('en');
    assert.equal('4,000,000', hI18n.helpers._num(4000000, { hash: {} }));
  });

  it('function _num should return dot separated triples of decimals and 2 fraction digits"', function() {
    assert.equal('4,000,000.00', hI18n.helpers._num(4000000, { hash: { minimumFractionDigits : 2 } }));
  });

  it('function _num should return dot separated triples of decimals when language is "de"', function() {
    i18next.changeLanguage('de');
    assert.equal('4.000.000', hI18n.helpers._num(4000000, { hash: {} }));
  });

  it('function _num should return dot separated triples of decimals when language is "de"', function() {
    assert.equal('4.000.000,00', hI18n.helpers._num(4000000, { hash: { minimumFractionDigits : 2 } }));
  });


  // -- Tests for function _currency -- //





  // -- Tests for method configure() -- //
  it('method configure() returns false if called without argument', function() {
    const configure = HandlebarsI18next.configure();
    assert.isNotOk(configure);
  });

  it('method configure() returns true if called with empty array []', function() {
    const configure = HandlebarsI18next.configure([]);
    assert.isNotOk(configure);
  });

  it('method configure() returns false if called with only one argument', function() {
    const configure = HandlebarsI18next.configure('en');
    assert.isNotOk(configure);
  });

  it('method configure() returns false if called with only one argument', function() {
    const configure = HandlebarsI18next.configure('en', 'somestrangeinput');
    assert.isNotOk(configure);
  });

});