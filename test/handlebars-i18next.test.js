/**
 * Created by florianwalzel on 02.05.20.
 */

const assert = require('chai').assert;
const expect = require('chai').expect;

const Handlebars = require('handlebars');
const i18next = require('i18next');
const HandlebarsI18next = require('../dist/handlebars-i18next');


describe('handlebarsI18next Test', function() {

  i18next.init();
  const hI18n = HandlebarsI18next.init();

  // -- Tests for method init() -- //
  it('method init() should return an object (HandlebarsEnvironment)', function() {
    assert.isObject(hI18n);
  });

  it('after method init() HandlebarsEnvironment object should have a function __', function() {
    assert.isFunction(hI18n.helpers.__);
  });

  it('after method init() HandlebarsEnvironment object should have a function _locale', function() {
    assert.isFunction(hI18n.helpers._locale);
  });

  it('after method init() HandlebarsEnvironment object should have a function localeIs', function() {
    assert.isFunction(hI18n.helpers.localeIs);
  });

  it('after method init() HandlebarsEnvironment object should have a function _date', function() {
    assert.isFunction(hI18n.helpers._date);
  });

  it('after method init() HandlebarsEnvironment object should have a function _num', function() {
    assert.isFunction(hI18n.helpers._num);
  });

  it('after method init() HandlebarsEnvironment object should have a function _price', function() {
    assert.isFunction(hI18n.helpers._price);
  });

  // -- Tests for function __ -- //
  it('function __ should throw error when called with no parameter', function() {
    expect(function() { hI18n.helpers.__() }).to.throw("Cannot read property 'hash' of undefined");
  });

  it('function __ should throw error when called with missing second key', function() {
    expect(function() { hI18n.helpers.__("someKey") }).to.throw("Cannot read property 'hash' of undefined");
  });

  it('function __ should return a SafeString object with property "string" where "string" contains the first parameter given to __', function() {
    const res = hI18n.helpers.__("someKey", {});
    assert.isObject(res);
    assert.isString(res.string);
    assert.equal("someKey", res.string);
  });

  // todo:more



  
  
  
  
  
  
  
  
  
  
  


  // -- Tests for method configure() -- //
  it('method configure() returns false if called without argument', function() {
    const configure = HandlebarsI18next.configure();
    assert.isNotOk(configure);
  });

  it('method configure() returns true if called with empty array []', function() {
    const configure = HandlebarsI18next.configure([]);
    assert.isOk(configure);
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