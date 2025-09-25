/**
 * Tests for handlebars-i18n.js
 *
 * usage:
 * $ npm run test
 */

const assert = require('chai').assert;
const expect = require('chai').expect;

const Handlebars = require('handlebars');
const i18next = require('i18next');
const HandlebarsI18n = require('../dist/handlebars-i18n');

describe('handlebars-i18n Tests', function () {

  const i18nInitObj = {
    resources: {
      'en': {
        translation: {
          'key1': 'What is good?',
          'key2': '{{what}} is {{adverb}}.',
          'fruits': ["Apple", "Banana", "Cherry"]
        }
      },
      'de': {
        translation: {
          'key1': 'Was ist gut?',
          'key2': '{{what}} ist {{adverb}}.',
          'fruits': ["Apfel", "Banane", "Kirsche"]
        }
      }
    },
    lng: 'en'
  };

  const hI18n = HandlebarsI18n.init();


  /****************************************
   Tests against method init()
   ****************************************/

  it('after method call init() should return an object (HandlebarsEnvironment)', function () {
    assert.isObject(hI18n);
  });

  it('after method call init() HandlebarsEnvironment object should have a function __', function () {
    assert.isFunction(hI18n.helpers.__);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _locale', function () {
    assert.isFunction(hI18n.helpers._locale);
  });

  it('after method call init() HandlebarsEnvironment object should have a function localeIs', function () {
    assert.isFunction(hI18n.helpers.localeIs);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _date', function () {
    assert.isFunction(hI18n.helpers._date);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _dateAdd', function () {
    assert.isFunction(hI18n.helpers._dateAdd);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _dateRel', function () {
    assert.isFunction(hI18n.helpers._dateRel);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _dateDiff', function () {
    assert.isFunction(hI18n.helpers._dateDiff);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _num', function () {
    assert.isFunction(hI18n.helpers._num);
  });

  it('after method call init() HandlebarsEnvironment object should have a function _price', function () {
    assert.isFunction(hI18n.helpers._price);
  });

  // -- Tests for method init() with override Argument -- //

  it('after method call init(overrideHndlbrs) with custom handlebars Object, HandlebarsEnvironment object should have custom function foo', function () {
    const HandlebarsModified = require('handlebars');
    HandlebarsModified.registerHelper('foo', function () {
      return true
    });
    const hI18nMod = HandlebarsI18n.init(HandlebarsModified);
    assert.isFunction(hI18nMod.helpers.foo);
  });

  it('after method call init(null, overrideI18n) with custom i18n Object, i18n object should have custom function foo', function () {
    const i18nModified = require('i18next');
    i18nModified.init({supportedLngs: ['de', 'en']});
    const hI18nMod = HandlebarsI18n.init(null, i18nModified);
    assert.isFunction(function () {
    }); // write a test here
  });


  /****************************************
   Tests against function _locale
   ****************************************/

  it('expecting _locale to be [undefined] as long as no language was set with i18next.init', function () {
    i18next.init(); // empty init
    const res = hI18n.helpers._locale();
    expect(res).to.be.undefined;
  });

  it('_locale should return "en" if language is specified as "en" by init Object', function () {
    i18next.init(i18nInitObj); // initialize with data
    const res = hI18n.helpers._locale();
    assert.equal('en', res);
  });

  it('_locale should return "de" after language change to "de"', function () {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._locale();
    assert.equal('de', res);
  });


  /****************************************
   Tests against function isLocale
   ****************************************/

  it('function isLocale should return TRUE when current language is set to "en" and given "en" as parameter', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers.localeIs('en');
    assert.equal(true, res);
  });

  it('function isLocale should return FALSE when current language is set to "en" and given "someOther" as parameter', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers.localeIs('someOther');
    assert.equal(false, res);
  });


  /****************************************
   Tests against function __
   ****************************************/

  it('expect __ to throw error when called with no parameter', function () {
    expect(function () {
      hI18n.helpers.__()
    }).to.throw();
  });

  it('__ should return a SafeString object with property "string" where "string" returns the first argument given to __', function () {
    const res = hI18n.helpers.__("someNoneExitingKey", {hash: {}});
    assert.equal("someNoneExitingKey", res.string);
  });

  it('__ should return a SafeString object with property "string" where "string" contains "What is good?!', function () {
    const res = hI18n.helpers.__("key1", {hash: {}});
    assert.equal("What is good?", res.string);
  });

  it('__ should return a SafeString object with property "string" where "string" contains "Was ist gut?"', function () {
    i18next.changeLanguage('de');
    const res = hI18n.helpers.__("key1", {hash: {}});
    assert.equal("Was ist gut?", res.string);
  });

  it('__ should return a SafeString object with property "string" where "string" contains "handlebarsI18next is good."', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers.__("key2", {hash: {what: "handlebarsI18next", adverb: "good"}});
    assert.equal("handlebarsI18next is good.", res.string);
  });

  it('__ should return a SafeString object with property "string" where "string" contains "handlebarsI18next ist gut."', function () {
    i18next.changeLanguage('de');
    const res = hI18n.helpers.__("key2", {hash: {what: "handlebarsI18next", adverb: "gut"}});
    assert.equal("handlebarsI18next ist gut.", res.string);
  });

  it("__ should loop over array of strings with #each", () => {
    i18next.changeLanguage('en');
    const template = Handlebars.compile(`
      <ul>
        {{#each (__ "fruits")}}
          <li>{{this}}</li>
        {{/each}}
      </ul>
    `);

    const output = template({});
    console.log(output);
    expect(output).to.contain("Apple");
    expect(output).to.contain("Banana");
    expect(output).to.contain("Cherry");
  });

  it("__ should loop over array of objects with #each", () => {
    const template = Handlebars.compile(`
      <ol>
        {{#each (__ "steps")}}
          <li><strong>{{title}}</strong>: {{text}}</li>
        {{/each}}
      </ol>
    `);

    const output = template({});
    expect(output).to.contain("<strong>Step 1</strong>: Open the app");
    expect(output).to.contain("<strong>Step 2</strong>: Click start");
  });


  /****************************************
   Tests against function _date
   ****************************************/

  it('expect _date to throw error when called with invalid date parameter', function () {
    expect(function () {
      hI18n.helpers._date('someStrangeString')
    }).to.throw("Invalid valid date passed to format");
  });

  it('_date should return today’s date in Intl default format when called without parameter', function () {
    i18next.changeLanguage('en');
    const today = new Date();
    const todayFormated = new Intl.DateTimeFormat().format(today);

    const res = hI18n.helpers._date();
    assert.equal(todayFormated, res);
  });

  it('_date should return today’s date in Intl default format when called with parameter, "Today" or "Now" no matter of upper or lower case writing',
    function () {
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

  it('_date should return "1/1/1970" (Intl default format) when called with parameter 1 as number ', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date(1);
    assert.equal('1/1/1970', res);
  });

  it('_date should return "12/17/1995" (Intl default format) when called with parameter "1995-12-17T03:24:00"', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('1995-12-17T03:24:00');
    assert.equal('12/17/1995', res);
  });

  it('_date should return "12/17/1995" (Intl default format) when called with parameter "December 17, 1995 03:24:00"', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00');
    assert.equal('12/17/1995', res);
  });

  it('_date should return "1/1/2020" (Intl default format) when called with parameter "[2020]"', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('[1995]');
    assert.equal('1/1/1995', res);
  });

  it('_date should return "12/1/1995" (Intl default format) when called with parameter "[2020,11]"', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('[1995,11]');
    assert.equal('12/1/1995', res);
  });

  it('_date should return "12/17/1995" (Intl default format) when called with parameter "[2020,11,17]"', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('[1995,11,17]');
    assert.equal('12/17/1995', res);
  });

  it('_date should return "12/1/95" when called with parameter "[2020,11,01] and specifying options"', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('[1995,11,1]', {hash: {year: "2-digit", month: "2-digit", day: "2-digit"}});
    assert.equal('12/1/95', res);
  });

  it('_date should return "01.12.95" when called with parameter "[2020,11,01] and specifying options an language set to "de"', function () {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._date('[1995,11,1]', {hash: {year: "2-digit", month: "2-digit", day: "2-digit"}});
    assert.equal('01.12.95', res);
  });


  /****************************************
   Tests against function _dateAdd
   ****************************************/

  it('_dateAdd should throw error when called without params', function () {
    expect(function () {
      hI18n.helpers._dateAdd()
    }).to.throw("@ handlebars-i18n: invalid first argument \"dateInput\" was given for _dateAdd.");
  });

  it('_dateAdd should throw error when called without 2nd param', function () {
    expect(function () {
      hI18n.helpers._dateAdd('December 17, 1995 02:00:00')
    }).to.throw("@ handlebars-i18n: invalid second argument \"offset\" was given for _dateAdd.");
  });

  it('_dateAdd should use default unit "hour" when called without 3rd param', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateAdd('December 17, 1995 02:00:00', 25);
    assert.equal('12/18/1995', res);
  });

  it('_dateAdd should return "12/17/1995" when called with parameters "December 17, 1995 02:00:00", 1, and "day"', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateAdd('December 17, 1995 02:00:00', 1, {"hash": {unit: "day"}});
    assert.equal('12/18/1995', res);
  });

  // -- Test for "second" -- //

  it('_dateAdd should return "12/18/1995" when called with parameters "December 17, 1995 02:00:00", 1, and "second"', function () {
    i18next.changeLanguage('en');
    const options = {hash: {unit: "second", hour: "2-digit", minute: "2-digit", second: "2-digit"}}
    const res = hI18n.helpers._dateAdd('December 17, 1995 02:00:00', 1, options);
    assert.equal('02:00:01', res);
  });

  // -- Test for "minute" -- //

  it('_dateAdd should return "02:01:00" when called with parameters "December 17, 1995 02:00:00", 1, and "minute"', function () {
    i18next.changeLanguage('en');
    const options = {hash: {unit: "minute", hour: "2-digit", minute: "2-digit", second: "2-digit"}}
    const res = hI18n.helpers._dateAdd('December 17, 1995 02:00:00', 1, options);
    assert.equal('02:01:00', res);
  });

  // -- Test for "hour" -- //

  it('_dateAdd should return "03:00:00" when called with parameters "December 17, 1995 02:00:00", 1, and "hour"', function () {
    i18next.changeLanguage('en');
    const options = {hash: {unit: "hour", hour: "2-digit", minute: "2-digit", second: "2-digit"}}
    const res = hI18n.helpers._dateAdd('December 17, 1995 02:00:00', 1, options);
    assert.equal('03:00:00', res);
  });

  // -- Test for "day" -- //

  it('_dateAdd should return "December 18, 1995 02:00:00" when called with parameters "December 17, 1995 02:00:00", 1, and "day"', function () {
    i18next.changeLanguage('en');
    const options = {
      hash: {
        unit: "day",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    }
    const res = hI18n.helpers._dateAdd('December 17, 1995 02:00:00', 1, options);
    assert.equal('December 18, 1995 at 02:00:00', res);
  });

  // -- Test for "week" -- //

  it('_dateAdd should return "December 24, 1995 02:00:00" when called with parameters "December 17, 1995 02:00:00", 1, and "week"', function () {
    i18next.changeLanguage('en');
    const options = {
      hash: {
        unit: "week",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    }
    const res = hI18n.helpers._dateAdd('December 17, 1995 02:00:00', 1, options);
    assert.equal('December 24, 1995 at 02:00:00', res);
  });

  // -- Test for "month" -- //

  it('_dateAdd should return "January 17, 1996 02:00:00" when called with parameters "December 17, 1995 02:00:00", 1, and "month"', function () {
    i18next.changeLanguage('en');
    const options = {
      hash: {
        unit: "month",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    }
    const res = hI18n.helpers._dateAdd('December 17, 1995 02:00:00', 1, options);
    assert.equal('January 17, 1996 at 02:00:00', res);
  });

  // -- Test for "quarter" -- //

  it('_dateAdd should return "March 17, 1996 02:00:00" when called with parameters "December 17, 1995 02:00:00", 1, and "quarter"', function () {
    i18next.changeLanguage('en');
    const options = {
      hash: {
        unit: "quarter",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    }
    const res = hI18n.helpers._dateAdd('December 17, 1995 02:00:00', 1, options);
    assert.equal('March 17, 1996 at 02:00:00', res);
  });

  // -- Test for "year" -- //

  it('_dateAdd should return "December 17, 1996 02:00:00" when called with parameters "December 17, 1995 02:00:00", 1, and "year"', function () {
    i18next.changeLanguage('en');
    const options = {
      hash: {
        unit: "year",
        year: "numeric",
        month: "long",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      }
    }
    const res = hI18n.helpers._dateAdd('December 17, 1995 02:00:00', 1, options);
    assert.equal('December 17, 1996 at 02:00:00', res);
  });


  /****************************************
   Tests against function _dateRel
   ****************************************/

  it('expect _dateRel to throw error when called without parameter', function () {
    expect(function () {
      hI18n.helpers._dateRel()
    }).to.throw('Invalid "number" argument: NaN');
  });

  it('expect _dateRel to throw error when called with invalid date parameter', function () {
    expect(function () {
      hI18n.helpers._dateRel('someStrangeString')
    }).to.throw('Invalid "number" argument: NaN');
  });

  it('expect _dateRel to throw error when called with non-existent language shortcode', function () {
    i18next.changeLanguage('invalid');
    expect(function () {
      hI18n.helpers._dateRel(1, {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: "day"}})
    }).to.throw('No locale data passed');
  });

  it('expect _dateRel to return \'in 1 hour\' when called with \'en\' and first parameter being 1', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateRel(1);
    assert.equal('in 1 hour', res);
  });

  it('expect _dateRel to return \'1 hour ago\' when called with \'en\' and first parameter being -1', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateRel(-1);
    assert.equal('1 hour ago', res);
  });

  it('expect _dateRel to return \'in 1 second\' when called with \'en\' and first parameter being 1 and according options', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateRel(1, {
      hash: {
        localeMatcher: "best fit",
        numeric: "always",
        style: "long",
        unit: "seconds"
      }
    });
    assert.equal('in 1 second', res);
  });

  it('expect _dateRel to return \'in 1 Tag\' when called with \'de\' and paramter 1 and according options', function () {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._dateRel(1, {
      hash: {
        localeMatcher: "best fit",
        numeric: "always",
        style: "long",
        unit: "day"
      }
    });
    assert.equal('in 1 Tag', res);
  });


  /****************************************
   Tests against function _dateDiff
   ****************************************/

  it('_dateDiff should return null when called with no parameter', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateDiff();
    assert.equal(null, res);
  });

  it('expect _dateDiff to throw error when called with invalid 1. date parameter', function () {
    expect(function () {
      hI18n.helpers._dateDiff('someStrangeString', '1995-12-17T03:24:00')
    })
      .to.throw('Invalid "number" argument: NaN');
  });

  it('expect _dateDiff to throw error when called with invalid 2. date parameter', function () {
    expect(function () {
      hI18n.helpers._dateDiff('1995-12-17T03:24:00', 'someStrangeString')
    })
      .to.throw('Invalid "number" argument: NaN');
  });

  it('expect _dateDiff to return null when called with empty argument', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateDiff('');
    assert.equal(null, res);
  });

  it('expect _dateDiff to return "in 0 hours", when dates are identical', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateDiff('1995-12-17T00:00:00', '1995-12-17T00:00:00');
    assert.equal('in 0 hours', res);
  });

  // -- Test year -- //

  it('expect _dateDiff to return "in 1 year"', function () {
    i18next.changeLanguage('en');
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: "year"}};
    const res = hI18n.helpers._dateDiff('1996-12-17T00:00:00', '1995-12-17T00:00:00', hash);
    assert.equal('in 1 year', res);
  });

  it('expect _dateDiff to return "1 year ago"', function () {
    i18next.changeLanguage('en');
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: "year"}};
    const res = hI18n.helpers._dateDiff('1995-12-17T00:00:00', '1996-12-17T00:00:00', hash);
    assert.equal('1 year ago', res);
  });

  // -- Test quarter -- //

  it('expect _dateDiff to return "in 1 quarter"', function () {
    i18next.changeLanguage('en');
    const unit = 'quarter';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-12-17T00:00:00', '1996-09-16T00:00:00', hash);
    assert.equal(`in 1 ${unit}`, res);
  });

  it('expect _dateDiff to return "1 quarter ago"', function () {
    i18next.changeLanguage('en');
    const unit = 'quarter';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-09-16T00:00:00', '1996-12-17T00:00:00', hash);
    assert.equal(`1 ${unit} ago`, res);
  });

  // -- Test month -- //

  it('expect _dateDiff to return "in 1 month"', function () {
    i18next.changeLanguage('en');
    const unit = 'month';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-12-17T00:00:00', '1996-11-16T00:00:00', hash);
    assert.equal(`in 1 ${unit}`, res);
  });

  it('expect _dateDiff to return "1 month ago"', function () {
    i18next.changeLanguage('en');
    const unit = 'month';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-11-16T00:00:00', '1996-12-17T00:00:00', hash);
    assert.equal(`1 ${unit} ago`, res);
  });

  // -- Test week -- //

  it('expect _dateDiff to return "in 1 week"', function () {
    i18next.changeLanguage('en');
    const unit = 'week';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-12-08T00:00:00', '1996-12-01T00:00:00', hash);
    assert.equal(`in 1 ${unit}`, res);
  });

  it('expect _dateDiff to return "1 week ago"', function () {
    i18next.changeLanguage('en');
    const unit = 'week';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-12-01T00:00:00', '1996-12-08T00:00:00', hash);
    assert.equal(`1 ${unit} ago`, res);
  });

  // -- Test day -- //

  it('expect _dateDiff to return "in 1 day"', function () {
    i18next.changeLanguage('en');
    const unit = 'day';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-12-08T00:00:00', '1996-12-07T00:00:00', hash);
    assert.equal(`in 1 ${unit}`, res);
  });

  it('expect _dateDiff to return "1 day ago"', function () {
    i18next.changeLanguage('en');
    const unit = 'day';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-12-07T00:00:00', '1996-12-08T00:00:00', hash);
    assert.equal(`1 ${unit} ago`, res);
  });

  // -- Test minute -- //

  it('expect _dateDiff to return "in 1 minute"', function () {
    i18next.changeLanguage('en');
    const unit = 'minute';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-12-08T00:01:00', '1996-12-08T00:00:00', hash);
    assert.equal(`in 1 ${unit}`, res);
  });

  it('expect _dateDiff to return "1 minute ago"', function () {
    i18next.changeLanguage('en');
    const unit = 'minute';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-12-08T00:00:00', '1996-12-08T00:01:00', hash);
    assert.equal(`1 ${unit} ago`, res);
  });

  // -- Test second -- //

  it('expect _dateDiff to return "in 1 second"', function () {
    i18next.changeLanguage('en');
    const unit = 'second';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-12-08T00:00:01', '1996-12-08T00:00:00', hash);
    assert.equal(`in 1 ${unit}`, res);
  });

  it('expect _dateDiff to return "1 second ago"', function () {
    i18next.changeLanguage('en');
    const unit = 'second';
    const hash = {hash: {localeMatcher: "best fit", numeric: "always", style: "long", unit: unit}};
    const res = hI18n.helpers._dateDiff('1996-12-08T00:00:00', '1996-12-08T00:00:01', hash);
    assert.equal(`1 ${unit} ago`, res);
  });


  /****************************************
   Tests against function _num
   ****************************************/

  it('_num should return comma separated triples of decimals when language is "en"', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, {hash: {}});
    assert.equal('4,000,000', res);
  });

  it('_num should return dot separated triples of decimals when language is "de"', function () {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._num(4000000, {hash: {}});
    assert.equal('4.000.000', res);
  });

  it('_num should return comma separated triples of decimals and 2 fraction digits"', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, {hash: {minimumFractionDigits: 2}});
    assert.equal('4,000,000.00', res);
  });

  it('_num should return dot separated triples of decimals and 2 fraction digits when language is "de"', function () {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._num(4000000, {hash: {minimumFractionDigits: 2}});
    assert.equal('4.000.000,00', res);
  });


  /****************************************
   Tests against function _price
   ****************************************/

  it('_currency should return price in € written in comma separated triples of decimals and 2 fraction digits with leading currency symbol', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(4000000, {hash: {}});
    assert.equal('€4,000,000.00', res);
  });

  it('_currency should return price in € written in dot separated triples of decimals and 2 fraction digits with trailing currency symbol', function () {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._price(4000000, {hash: {}});
    assert.isString(res);
    assert.equal('4.000.000,00 €', res);
  });

  it('_currency should return price in ¥ written in comma separated triples of decimals with leading currency symbol', function () {
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(4000000, {hash: {currency: 'JPY', maximumFractionDigits: 0}});
    assert.equal('¥4,000,000', res);
  });

  it('_currency should return price in ¥ written in comma separated triples of decimals with trailing currency symbol', function () {
    i18next.changeLanguage('de');
    const res = hI18n.helpers._price(4000000, {hash: {currency: 'JPY', maximumFractionDigits: 0}});
    assert.equal('4.000.000 ¥', res);
  });


  /****************************************
   Tests against method configure()
   ****************************************/

  it('method configure() should return false if called without argument', function () {
    const configure = HandlebarsI18n.configure();
    assert.isNotOk(configure);
  });

  it('method configure() should return false if called with empty array []', function () {
    const configure = HandlebarsI18n.configure([]);
    assert.isNotOk(configure);
  });

  it('method configure() should return false if called with only one argument', function () {
    const configure = HandlebarsI18n.configure('en');
    assert.isNotOk(configure);
  });

  it('method configure() should return false if called with language argument and invalid second argument', function () {
    const configure = HandlebarsI18n.configure('en', 'somestrangeinput');
    assert.isNotOk(configure);
  });

  it('method configure() should return false if called with language argument "en" and second argument "DateTimeFormat" and Number (invalid argument) as third', function () {
    const configure = HandlebarsI18n.configure('en', 'DateTimeFormat', 12);
    assert.isNotOk(configure);
  });

  it('method configure() should return true if called with language argument "en" and second argument "DateTimeFormat" and options object as third argument', function () {
    const configure = HandlebarsI18n.configure('en', 'DateTimeFormat', {year: 'numeric'});
    assert.isOk(configure);
  });

  it('method configure() should return true if called with arguments "en", "DateTimeFormat", { year:"numeric" } and a string as custom configuration name', function () {
    const configure = HandlebarsI18n.configure('en', 'DateTimeFormat', {year: 'numeric'}, "my-custom-conf");
    assert.isOk(configure);
  });

  it('method configure() should return false if called with arguments "en", "DateTimeFormat", { year:"numeric" } and an additional object (invalid argument)', function () {
    const configure = HandlebarsI18n.configure('en', 'DateTimeFormat', {year: 'numeric'}, {});
    assert.isNotOk(configure);
  });

  it('method configure() should return false if called with arguments "en", "DateTimeFormat", { year:"numeric" } and an additional empty string (invalid argument)', function () {
    const configure = HandlebarsI18n.configure('en', 'DateTimeFormat', {year: 'numeric'}, "");
    assert.isNotOk(configure);
  });

  it('method configure() should return true if called with arguments "en", "RelativeTimeFormat", { localeMatcher: "best fit", numeric: "always", style: "long" }', function () {
    const configure = HandlebarsI18n.configure('en', 'RelativeTimeFormat', {
      localeMatcher: "best fit",
      numeric: "always",
      style: "long"
    });
    assert.isOk(configure);
  });


  /****************************************
   Tests against method reset()
   ****************************************/

  it('method reset() should return TRUE if called', function () {
    const res = HandlebarsI18n.reset();
    assert.isOk(res);
  });

  it('_num should return Intl standard format (no fraction digits) after reset() being called', function () {
    HandlebarsI18n.configure('en', 'NumberFormat', {minimumFractionDigits: 4});
    i18next.changeLanguage('en');
    HandlebarsI18n.reset();
    const res = hI18n.helpers._num(4000000);
    assert.equal('4,000,000', res);
  });


  /********************************************************************
   Tests for custom format configurations for function _date
   ********************************************************************/

  it('_date when called after configure() with defined custom format (year:2-digit) should return ' +
    'date "95" when language is "en"', function () {
    HandlebarsI18n.configure('en', 'DateTimeFormat', {year: "2-digit"}, 'my-custom-format');
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', {hash: {format: 'my-custom-format'}});
    assert.equal('95', res);
  });

  it('_date when called after configure() with defined custom format (year:numeric) given as ARRAY should return ' +
    'date "12/17/95" when language is "en"', function () {
    HandlebarsI18n.configure(['en', 'DateTimeFormat', {year: "numeric"}, 'my-custom-format']);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', {hash: {format: 'my-custom-format'}});
    assert.equal('95', res);
  });

  it('_date when called after configure() with defined custom format (year:2-digit) should override ' +
    'standard configuration when language is "en"', function () {
    HandlebarsI18n.configure([
      ['en', 'DateTimeFormat', {year: "numeric"}],
      ['en', 'DateTimeFormat', {year: "2-digit"}, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('[1995,11,17]', {hash: {format: 'my-custom-format'}});
    assert.equal('95', res);
  });

  it('_date when called after configure() with defined custom format (year:2-digit) should override ' +
    'standard configuration also when being defined first', function () {
    HandlebarsI18n.configure([
      ['en', 'DateTimeFormat', {year: "2-digit"}, 'my-custom-format'],
      ['en', 'DateTimeFormat', {year: "numeric"}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', {hash: {format: 'my-custom-format'}});
    assert.equal('95', res);
  });

  it('_date when called after configure() should fall back to generic language format "en" when custom format is unknown' +
    'standard configuration also when being defined first', function () {
    HandlebarsI18n.configure([
      ['en', 'DateTimeFormat', {year: "2-digit"}, 'my-custom-format'],
      ['en', 'DateTimeFormat', {year: "numeric"}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', {hash: {format: 'my-unknown-format'}});
    assert.equal('1995', res);
  });

  it('_date when called after configure() should fall back to generic language format "all" when custom format is unknown' +
    'standard configuration also when being defined first', function () {
    HandlebarsI18n.configure([
      ['all', 'DateTimeFormat', {year: "2-digit"}, 'my-custom-format'],
      ['en', 'DateTimeFormat', {year: "numeric"}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', {hash: {format: 'my-unknown-format'}});
    assert.equal('1995', res);
  });

  it('_date when called after configure() should fall back to Intl default format when custom format is unknown' +
    'standard configuration also when being defined first', function () {
    HandlebarsI18n.reset();
    HandlebarsI18n.configure([
      ['en', 'DateTimeFormat', {year: "2-digit"}, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._date('December 17, 1995 03:24:00', {hash: {format: 'my-unknown-format'}});
    assert.equal('12/17/1995', res);
  });


  /********************************************************************
   Tests for custom format configurations for _dateRel / _dateDiff
   ********************************************************************/

  it('_dateRel called after configure() with defined "all" (style: "long", unit: "second") should return ' +
    '"in 12 seconds" when language is "en"', function () {
    HandlebarsI18n.configure('all', 'RelativeTimeFormat', {style: "long", unit: "second"});
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateRel('12');
    assert.equal('in 12 seconds', res);
  });

  it('_dateRel called after configure() with defined custom format (style: "long", unit: "year") should return ' +
    '"in 12 Jahren" when language is "de"', function () {
    HandlebarsI18n.configure('de', 'RelativeTimeFormat', {style: "long", unit: "year"}, 'date-rel-custom');
    i18next.changeLanguage('de');
    const res = hI18n.helpers._dateRel('12', {hash: {format: 'date-rel-custom'}});
    assert.equal('in 12 Jahren', res);
  });

  it('_dateRel called after configure() with defined custom format { style: "short", unit: "minutes" } should override ' +
    'standard configuration when language is "en"', function () {
    HandlebarsI18n.configure([
      ['en', 'RelativeTimeFormat', {style: "short", unit: "day"}, 'date-rel-spec'],
      ['en', 'RelativeTimeFormat', {style: "long", unit: "second"}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateRel('12', {hash: {format: 'date-rel-spec'}});
    assert.equal('in 12 days', res);
  });

  it('_dateRel called after configure() with defined custom format { style: "short", unit: "minutes" } should override ' +
    'standard configuration when language is "en" and output: \'in 12 days\'', function () {
    HandlebarsI18n.configure([
      ['en', 'RelativeTimeFormat', {style: "short", unit: "day"}, 'date-rel-spec'],
      ['en', 'RelativeTimeFormat', {style: "long", unit: "second"}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateRel('12', {hash: {format: 'date-rel-spec'}});
    assert.equal('in 12 days', res);
  });

  it('_dateDiff called after configure() with defined custom format { style: "short", unit: "minutes" } should override ' +
    'standard configuration when language is "en" and output: \'in in 1 yr.\'', function () {
    HandlebarsI18n.configure([
      ['en', 'RelativeTimeFormat', {style: "short", unit: "year"}, 'date-rel-spec'],
      ['en', 'RelativeTimeFormat', {style: "long", unit: "day"}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._dateDiff('1996-12-17T00:00:00', '1995-12-17T00:00:00', {hash: {format: 'date-rel-spec'}});
    assert.equal('in 1 yr.', res);
  });


  /********************************************************************
   Tests for custom format configurations for function _num
   ********************************************************************/

  it('_num when called after configure() with defined custom format (minimumFractionDigits:4) should return ' +
    'comma separated triples of decimals and 4 fraction of digits when language is "en"', function () {
    HandlebarsI18n.configure('en', 'NumberFormat', {minimumFractionDigits: 4}, 'my-custom-format');
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, {hash: {format: 'my-custom-format'}});
    assert.equal('4,000,000.0000', res);
  });

  it('_num when called after configure() with defined custom format (minimumFractionDigits:4) given as ARRAY should return ' +
    'comma separated triples of decimals and 4 fraction of digits when language is "en"', function () {
    HandlebarsI18n.configure(['en', 'NumberFormat', {minimumFractionDigits: 4}, 'my-custom-format']);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, {hash: {format: 'my-custom-format'}});
    assert.equal('4,000,000.0000', res);
  });

  it('_num when called after configure() with defined custom format (minimumFractionDigits:4) should override' +
    'standard configuration when language is "en"', function () {
    HandlebarsI18n.configure([
      ['en', 'NumberFormat', {maximumFractionDigits: 1}],
      ['en', 'NumberFormat', {minimumFractionDigits: 4}, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, {hash: {format: 'my-custom-format'}});
    assert.equal('4,000,000.0000', res);
  });

  it('_num when called after configure() with defined custom format (minimumFractionDigits:4) should override' +
    'standard configuration also when being defined first', function () {
    HandlebarsI18n.configure([
      ['en', 'NumberFormat', {minimumFractionDigits: 4}, 'my-custom-format'],
      ['en', 'NumberFormat', {maximumFractionDigits: 1}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, {hash: {format: 'my-custom-format'}});
    assert.equal('4,000,000.0000', res);
  });

  it('_num when called after configure() should fall back to standard language format "en" when custom format is unknown', function () {
    HandlebarsI18n.configure([
      ['en', 'NumberFormat', {minimumFractionDigits: 4}, 'my-custom-format'],
      ['en', 'NumberFormat', {minimumFractionDigits: 1}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, {hash: {format: 'my-unknown-format'}});
    assert.equal('4,000,000.0', res);
  });

  it('_num when called after configure() should fall back to standard language format "all" when custom format is unknown', function () {
    HandlebarsI18n.configure([
      ['en', 'NumberFormat', {minimumFractionDigits: 4}, 'my-custom-format'],
      ['all', 'NumberFormat', {minimumFractionDigits: 1}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, {hash: {format: 'my-unknown-format'}});
    assert.equal('4,000,000.0', res);
  });

  it('_num when called after configure() should fall back to Intl default when custom format is unknown', function () {
    HandlebarsI18n.reset();
    HandlebarsI18n.configure([
      ['en', 'NumberFormat', {minimumFractionDigits: 4}, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._num(4000000, {hash: {format: 'my-unknown-format'}});
    assert.equal('4,000,000', res);
  });


  /********************************************************************
   Tests for custom format configurations for function _price
   ********************************************************************/

  it('_price when called after configure() with defined custom format (minimumFractionDigits:4) should return ' +
    'comma separated triples of decimals and 4 fraction of digits when language is "en"', function () {
    HandlebarsI18n.configure('en', 'PriceFormat', {currency: 'EUR', minimumFractionDigits: 3}, 'my-custom-format');
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, {hash: {format: 'my-custom-format'}});
    assert.equal('€2.000', res);
  });

  it('_price when called after configure() with defined custom format (minimumFractionDigits:4) should return ' +
    'comma separated triples of decimals and 4 fraction of digits when language is "en"', function () {
    HandlebarsI18n.configure('en', 'PriceFormat', {currency: 'EUR', minimumFractionDigits: 3}, 'my-custom-format');
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, {hash: {format: 'my-custom-format'}});
    assert.equal('€2.000', res);
  });

  it('_price when called after configure() with defined custom format (minimumFractionDigits:4) given as ARRAY should return ' +
    'comma separated triples of decimals and 4 fraction of digits when language is "en"', function () {
    HandlebarsI18n.configure(['en', 'PriceFormat', {currency: 'EUR', minimumFractionDigits: 3}, 'my-custom-format']);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, {hash: {format: 'my-custom-format'}});
    assert.equal('€2.000', res);
  });

  it('_price when called after configure() with defined custom format (minimumFractionDigits:3) should override' +
    'standard configuration when language is "en"', function () {
    HandlebarsI18n.configure([
      ['en', 'PriceFormat', {currency: 'USD'}],
      ['en', 'PriceFormat', {currency: 'EUR', minimumFractionDigits: 3}, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, {hash: {format: 'my-custom-format'}});
    assert.equal('€2.000', res);
  });

  it('_price when called after configure() with defined custom format (minimumFractionDigits:3) should override' +
    'standard configuration also when being defined first', function () {
    HandlebarsI18n.configure([
      ['en', 'PriceFormat', {currency: 'EUR', minimumFractionDigits: 3}, 'my-custom-format'],
      ['en', 'PriceFormat', {currency: 'USD'}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, {hash: {format: 'my-custom-format'}});
    assert.equal('€2.000', res);
  });

  it('_price when called after configure() should fall back to standard language format "en" when custom format is unknown', function () {
    HandlebarsI18n.configure([
      ['en', 'PriceFormat', {currency: 'EUR', minimumFractionDigits: 3}, 'my-custom-format'],
      ['en', 'PriceFormat', {currency: 'USD'}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, {hash: {format: 'my-unknown-format'}});
    assert.equal('$2.00', res);
  });

  it('_price when called after configure() should fall back to standard language format "all" when custom format is unknown', function () {
    HandlebarsI18n.configure([
      ['en', 'PriceFormat', {currency: 'EUR', minimumFractionDigits: 3}, 'my-custom-format'],
      ['all', 'PriceFormat', {currency: 'USD'}]
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, {hash: {format: 'my-unknown-format'}});
    assert.equal('$2.00', res);
  });

  it('_price when called after configure() should fall back to Intl default when custom format is unknown', function () {
    HandlebarsI18n.configure([
      ['en', 'PriceFormat', {currency: 'EUR', minimumFractionDigits: 3}, 'my-custom-format']
    ]);
    i18next.changeLanguage('en');
    const res = hI18n.helpers._price(2, {hash: {format: 'my-unknown-format'}});
    assert.equal('$2.00', res);
  });

});

describe('handlebars-i18n Private helper Function Tests (in production not exported)', () => {

  /********************************************************************
   Tests for private function applyToConstructor
   ********************************************************************/

  // Mock constructor function
  function TestConstructor(a, b) {
    this.a = a;
    this.b = b;
  }

  it('should return an instance of the constructor with provided arguments', () => {
    const args = [1, 2];
    const instance = HandlebarsI18n.private.applyToConstructor(TestConstructor, args);
    expect(instance).to.be.an.instanceof(TestConstructor);
    expect(instance.a).to.equal(1);
    expect(instance.b).to.equal(2);
  });

  /* it('should handle no arguments', () => {
     const instance = HandlebarsI18n.private.applyToConstructor(TestConstructor, []);
     expect(instance).to.be.an.instanceof(TestConstructor);
     expect(instance.a).to.equal(null);
     expect(instance.b).to.equal(undefined); // because 'undefined' is passed as second argument
   });*/

  it('should handle constructor with no arguments', () => {
    function ConstructorWithNoArgs() {
      this.value = 10;
    }

    const instance = HandlebarsI18n.private.applyToConstructor(ConstructorWithNoArgs, []);
    expect(instance).to.be.an.instanceof(ConstructorWithNoArgs);
    expect(instance.value).to.equal(10);
  });

  it('should handle constructor with complex arguments', () => {
    class ComplexArgument {
      constructor(value) {
        this.value = value;
      }
    }

    const args = [new ComplexArgument(5)];

    function ConstructorWithComplexArg(arg) {
      this.arg = arg;
    }

    const instance = HandlebarsI18n.private.applyToConstructor(ConstructorWithComplexArg, args);
    expect(instance).to.be.an.instanceof(ConstructorWithComplexArg);
    expect(instance.arg).to.be.an.instanceof(ComplexArgument);
    expect(instance.arg.value).to.equal(5);
  });


  /********************************************************************
   Tests for private function applyToConstructor
   ********************************************************************/

  const hndlbrsOpts = {
    hash: {
      format: 'customFormat',
      // Add other properties if needed for specific test cases
    }
  };
  const lang = 'en';
  const OCFormat = {
    standard: {
      en: { /* Standard configuration for English */},
      all: { /* Universal configuration for all languages */}
    },
    custom: {
      customFormat: {
        en: { /* Custom configuration for English */}
      }
    }
  };

  /*it('should return template configuration when options object with content is provided', () => {
    const result = HandlebarsI18n.private.configLookup(hndlbrsOpts, lang, OCFormat);
    expect(result).to.deep.equal(hndlbrsOpts.hash);
  });*/

  it('should return custom configuration when custom format and language are provided', () => {
    const result = HandlebarsI18n.private.configLookup(hndlbrsOpts, lang, OCFormat);
    expect(result).to.deep.equal(OCFormat.custom.customFormat[lang]);
  });

  it('should return standard language configuration when no custom format is provided', () => {
    const hndlbrsOptsWithoutFormat = {
      hash: {
        // Add other properties if needed for specific test cases
      }
    };
    const result = HandlebarsI18n.private.configLookup(hndlbrsOptsWithoutFormat, lang, OCFormat);
    expect(result).to.deep.equal(OCFormat.standard[lang]);
  });

  it('should return universal configuration when no language-specific configuration is provided', () => {
    const langWithoutConfig = 'fr'; // Assuming French configuration is not provided
    const result = HandlebarsI18n.private.configLookup(hndlbrsOpts, langWithoutConfig, OCFormat);
    expect(result).to.deep.equal(OCFormat.standard.all);
  });

  it('should return an empty object when no configuration is provided at all', () => {
    const result = HandlebarsI18n.private.configLookup({}, lang, OCFormat);
    expect(result).to.deep.equal({});
  });

});
