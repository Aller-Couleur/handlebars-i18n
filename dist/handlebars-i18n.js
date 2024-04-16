/********************************************************************
 * handlebars-i18n.js
 *
 * @author: Florian Walzel
 * @date: 2024-02
 *
 * handlebars-i18n adds features for localization/
 * internationalization to handlebars.js
 *
 * Copyright (c) 2020-24 Florian Walzel, MIT License
 *
 *********************************************************************/

(function (root, factory) {

  if (typeof exports === 'object' && typeof module === 'object') {
    const Handlebars = require('handlebars'),
      i18next = require('i18next'),
      Intl = require('intl'),
      RelativeTimeFormat= require('relative-time-format');
    module.exports = factory(
      Handlebars,
      i18next,
      Intl,
      RelativeTimeFormat,
      process?.env?.NODE_ENV === 'TEST');
  }
  else if (typeof define === 'function' && define.amd)
    define(['Handlebars', 'i18next', 'Intl'], factory);
  else if (typeof root.Handlebars === 'object'
    && typeof root.i18next === 'object'
    && typeof root.Intl === 'object')
    root['HandlebarsI18n'] = factory(root.Handlebars, root.i18next, root.Intl);
  else {
    console.error('@ handlebars-i18n: One or more dependencies are missing. Check for Handlebars, i18next and Intl.');
    return false;
  }

})(this, function (handlebars, i18next, Intl, RelativeTimePolyfill, isTest) {

  'use strict';

  //
  const defaultConf = {
    DateTimeFormat: {
      standard: {},
      custom: {}
    },
    RelativeTimeFormat: {
      standard: {
        all: {unit: 'day'}
      },
      custom: {}
    },
    NumberFormat: {
      standard: {},
      custom: {}
    },
    PriceFormat: {
      standard: {
        all: {style: 'currency', currency: 'EUR'}
      },
      custom: {}
    }
  };

  // make a copy of default object to hold (optional)
  // custom configuration to be defined by the user
  let optionsConf = JSON.parse(JSON.stringify(defaultConf));

  // object holding polyfill languages for node environment
  const polyfillLangs = {};


  /*************************************
   * PRIVATE FUNCTIONS (HELPERS)
   *************************************/

  /**
   *
   * @param constructor
   * @param argArray
   * @returns {*|function(this:*)}
   * @private
   */
  function __applyToConstructor(constructor, argArray) {
    let args = [null].concat(argArray);
    let factoryFunction = constructor.bind.apply(constructor, args);
    return new factoryFunction();
  }

  /**
   *
   * @param hndlbrsOpts
   * @param lang
   * @param OCFormat
   * @returns {*}
   * @private
   */
  function __configLookup(hndlbrsOpts, lang, OCFormat) {

    // check if an options object with property hash exists, and holds some content
    if (typeof hndlbrsOpts === 'object'
      && typeof hndlbrsOpts.hash === 'object'
      && Object.keys(hndlbrsOpts.hash).length > 0) {

      let oh = hndlbrsOpts.hash;

      // check against a custom format, if nonexistent
      // return the options hash (= template configuration)
      if (typeof oh.format === 'undefined') {
        return oh;
      }
      // when custom format is given, check if the configuration was set ...
      else if (typeof OCFormat.custom[oh.format] !== 'undefined'
        && typeof OCFormat.custom[oh.format][lang] !== 'undefined') {
        return OCFormat.custom[oh.format][lang];
      }
    }

    // ... when no options for custom formats given, first check whether
    // the specific language has a generic definition
    if (typeof OCFormat.standard[lang] !== 'undefined')
      return OCFormat.standard[lang];

    // ... then check if a universal format definition for all languages exists
    if (typeof OCFormat.standard.all !== 'undefined')
      return OCFormat.standard.all;

    // no configuration delivered, fallback is Intl standard definition
    else
      return {};
  }

  /**
   *
   * @param lngShortcode
   * @param typeOfFormat
   * @param options
   * @param customFormat
   * @returns {boolean}
   * @private
   */
  function __validateArgs(lngShortcode, typeOfFormat, options, customFormat) {

    if (typeof lngShortcode !== 'string') {
      console.error('@ handlebars-i18n.configure(): Invalid argument <' + lngShortcode + '> ' +
        'First argument must be a string with language code such as "en".');
      return false;
    }

    if (! ['DateTimeFormat', 'RelativeTimeFormat', 'NumberFormat', 'PriceFormat'].includes(typeOfFormat)) {
      console.error('@ handlebars-i18n.configure(): Invalid argument <' + typeOfFormat + '>. ' +
        'Second argument must be a string with the options key. ' +
        'Use either "DateTimeFormat", "RelativeTimeFormat", "NumberFormat", or "PriceFormat".');
      return false;
    }

    if (typeof options !== 'object') {
      console.error('@ handlebars-i18n.configure(): Invalid argument <' + options + '> ' +
        'Third argument must be an object containing the configuration parameters.');
      return false;
    }

    if ((customFormat !== null && typeof customFormat !== 'undefined' && typeof customFormat !== 'string')
      || customFormat === '' || customFormat === ' ') {
      console.error('@ handlebars-i18n.configure(): Invalid argument <' + customFormat + '> ' +
        'Fourth argument (optional) must be a string naming your custom format configuration.');
      return false;
    }

    return true;
  }

  /**
   *
   * @param lang
   * @param formatType
   * @param options
   * @param customFormat
   * @returns {boolean}
   * @private
   */
  function __setArgs(lang, formatType, options, customFormat) {

    if (typeof customFormat !== 'undefined' && customFormat !== null) {
      // create object node with name of the configuration if not already existing
      if (typeof optionsConf[formatType].custom[customFormat] === 'undefined')
        optionsConf[formatType].custom[customFormat] = {};

      optionsConf[formatType].custom[customFormat][lang] = options;
    }
    else
      optionsConf[formatType].standard[lang] = options;

    return true;
  }

  /**
   *
   * @param input
   * @returns {boolean}
   * @private
   */
  function __isNumOrString(input) {
    return typeof input === 'number' || (typeof input === 'string' && input !== '')
  }

  /**
   *
   * @param dateInput
   * @returns {Date}
   * @private
   */
  function __createDateObj(dateInput) {

    let date;

    if (typeof dateInput === 'number') {
      // input as milliseconds since unix epoch, like: 1583922952743
      date = new Date(dateInput);
    }
    else if (typeof dateInput === 'string') {

      if (dateInput.charAt(0) === '[' && dateInput.slice(-1) === ']') {
        // input as array represented as string such as "[2020, 11]"
        dateInput = dateInput.substring(1, dateInput.length - 1).replace(/ /g, '');
        let dateArr = dateInput.split(',');
        let dateFactory = __applyToConstructor.bind(null, Date);
        date = dateFactory(dateArr);
      }
      else if (dateInput.toLowerCase() === 'now' || dateInput.toLowerCase() === 'today') {
        // input as word "now" or "today"
        date = new Date();
      }
      else {
        // input as date string such as "1995-12-17T03:24:00"
        date = new Date(dateInput);
      }
    }
    else {
      // fallback: today's date
      date = new Date();
    }

    return date;
  }

  /**
   *
   * @param lang
   * @param opts
   * @returns {Intl.RelativeTimeFormat|*}
   * @private
   */
  function __getRelDateFormatPolyfill(lang, opts) {
    if (typeof Intl.RelativeTimeFormat === 'function')
      return new Intl.RelativeTimeFormat(lang, opts);
    else {
      if (typeof polyfillLangs[lang] === 'undefined') {
        try {
          polyfillLangs[lang] = require(`relative-time-format/locale/${lang}`);
        } catch (e) {
          console.error(e);
        }
      }
      RelativeTimePolyfill.addLocale(polyfillLangs[lang]);
      return new RelativeTimePolyfill(lang, opts);
    }
  }

  /**
   *
   * @param diff {Date Object}
   * @param formatter
   * @returns {number}
   * @private
   */
  function __getDateDiff(diff, formatter) {
    const
      WEEK_IN_MILLIS = 6.048e8,
      DAY_IN_MILLIS = 8.64e7,
      HOUR_IN_MILLIS = 3.6e6,
      MIN_IN_MILLIS = 6e4,
      SEC_IN_MILLIS = 1e3;
    if (Math.abs(diff) > WEEK_IN_MILLIS)
      return formatter.format(Math.trunc(diff / WEEK_IN_MILLIS), 'week');
    else if (Math.abs(diff) > DAY_IN_MILLIS)
      return formatter.format(Math.trunc(diff / DAY_IN_MILLIS), 'day');
    else if (Math.abs(diff) > HOUR_IN_MILLIS)
      return formatter.format(Math.trunc((diff % DAY_IN_MILLIS) / HOUR_IN_MILLIS), 'hour');
    else if (Math.abs(diff) > MIN_IN_MILLIS)
      return formatter.format(Math.trunc((diff % HOUR_IN_MILLIS) / MIN_IN_MILLIS), 'minute');
    else
      return formatter.format(Math.trunc((diff % MIN_IN_MILLIS) / SEC_IN_MILLIS), 'second');
  }


  /*************************************
   * PUBLIC INTERFACE
   *************************************/

  return {
    /**
     * configure the options for INTL number, currency, and date formatting
     *
     * @param langOrArr : string – the language key like 'fr' or 'all' for all languages
     *                 | array – an array with multiple options
     * @param typeOfFormat : string - DateTimeFormat | NumberFormat | PriceFormat
     * @param options : object - the options object
     */
    configure: function (langOrArr, typeOfFormat, options, customFormatName) {

      if (typeof langOrArr !== 'string' && !Array.isArray(langOrArr)) {
        console.error('@ handlebars-i18n.configure(): Invalid argument <' + langOrArr + '> ' +
          'First argument must be a string with language code such as "en" or an array with language parameters.');
        return false;
      }

      if (Array.isArray(langOrArr)) {
        if (langOrArr.length < 1) {
          console.log('@ handlebars-i18n.configure(): ' +
            'You passed an empty array, no parameters taken.');
          return false;
        }
        langOrArr.forEach(elem => {
          if (__validateArgs(elem[0], elem[1], elem[2], elem[3]))
            __setArgs(elem[0], elem[1], elem[2], elem[3]);
          else
            return false;
        });
      }
      else {
        if (__validateArgs(langOrArr, typeOfFormat, options, customFormatName))
          __setArgs(langOrArr, typeOfFormat, options, customFormatName);
        else
          return false;
      }

      return true;
    },

    /**
     * resets the configuration to default state like it was before configure() has been called
     */
    reset: function () {
      optionsConf = JSON.parse(JSON.stringify(defaultConf));
      return true;
    },

    /**
     * init all handlebars helpers
     *
     * @param overrideHndlbrs | optional: pass an individual instance of handlebars object to the init() function
     * to override the generic instance required in LINE 37
     *
     * @param overrideI18n | optional: pass an individual instance of handlebars i18next to the init() function
     * to override the generic instance required in LINE 38
     *
     * @returns {*}
     */
    init: function (overrideHndlbrs, overrideI18n) {

      if (typeof overrideHndlbrs === 'object' && overrideHndlbrs !== null)
        handlebars = overrideHndlbrs;
      else if (typeof overrideHndlbrs !== 'undefined' && overrideHndlbrs !== null)
        console.error('@ handlebars-i18n.init(): Invalid Argument [1] given for overrideHndlbrs. ' +
          'Argument must be the Handlebars Object. Using handlebars object on module instead.');

      if (typeof overrideI18n === 'object' && overrideI18n !== null)
        i18next = overrideI18n;

      else if (typeof overrideI18n !== 'undefined' && overrideI18n !== null)
        console.error('@ handlebars-i18n.init(): Invalid Argument [2] given for overrideI18n. ' +
          'Argument must be the i18next Object. Using i18next object on module level instead.');

      handlebars.registerHelper('__',
        /**
         * retrieves the translation phrase from a key given as string
         * use like: {{__ "key_name"}}
         * or with attributes: {{__ "key_with_count" count=7}}
         *
         * @param str
         * @param attributes
         * @returns {*}
         */
        function (str, attributes) {
          return new handlebars.SafeString((typeof(i18next) !== 'undefined' ? i18next.t(str, attributes.hash) : str));
        }
      );
      handlebars.registerHelper('_locale',
        /**
         * echos the current language
         * use like: {{_locale}}
         *
         * @returns {language|any|string|*|e}
         */
        function () {
          return i18next.language;
        }
      );
      handlebars.registerHelper('localeIs',
        /**
         * checks against the current language
         * use like: {{#if (localeIs "en")}} Hello EN {{/if}}
         *
         * @returns {language|any|string|*|e}
         */
        function (language) {
          return i18next.language === language;
        }
      );
      handlebars.registerHelper('_date',
        /**
         * formats a given date by the give internationalization options
         *
         * allows multiple input forms:
         * {{_date}}
         * -> returns the current date
         *
         * {{_date "now" hour="numeric" minute="numeric" second="numeric"}}
         * -> returns the current date with specific options
         *
         * {{_date 1583922952743}}
         * -> returns the date given in milliseconds since begin of unix epoch
         *
         * {{_date "2020-03-11T03:24:00"}} or {{_date "March 11, 2020 03:24:00"}}
         * -> returns the date given according to date string
         *
         * {{_date "[2020, 2, 11]"}}
         * -> returns the date given according to parameters: year, month, day, hours, minutes, seconds, milliseconds
         *
         * @link https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
         * @link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
         *
         * @param dateInput : string | number
         * @param options
         */
        function (dateInput, options) {
          const date= __createDateObj(dateInput);
          const opts = __configLookup(options, i18next.language, optionsConf.DateTimeFormat);
          const dateFormat = new Intl.DateTimeFormat(i18next.language, opts);
          return dateFormat.format(date);
        }
      );
      handlebars.registerHelper('_dateRel',
        /**
         *
         * @param dateValue
         * @param options
         * @returns {string}
         */
        function (dateValue, options) {
          const date= parseInt(dateValue);
          const opts = __configLookup(options, i18next.language, optionsConf.RelativeTimeFormat);
          const relDateFormat = __getRelDateFormatPolyfill(i18next.language, opts);
          return relDateFormat.format(date, opts.unit);
        }
      );
      handlebars.registerHelper('_dateDiff',
        function (dateInputA, dateInputB, options) {

          let dateDiff;

          if (! __isNumOrString(dateInputA) && ! __isNumOrString(dateInputB))
            return null;
          else if (! __isNumOrString(dateInputB))
            dateDiff = __createDateObj(dateInputA);
          else if (! __isNumOrString(dateInputA))
            dateDiff = __createDateObj(dateInputB);
          else {
            const dateA= __createDateObj(dateInputA);
            const dateB= __createDateObj(dateInputB);
            dateDiff = dateB - dateA;
          }

          /*todo!*/ const opts = __configLookup(options, i18next.language, optionsConf.DateTimeFormat);
          const dateFormat = typeof Intl.RelativeTimeFormat === 'function'
            ? new Intl.RelativeTimeFormat(i18next.language, opts)
            : new RelativeTimePolyfill(i18next.language, opts);
          return __getDateDiff(dateDiff, dateFormat);
        }
      );
      handlebars.registerHelper('_num',
        /**
         * formats a given number by internationalization options
         *
         * use with preset: {{_num 3000}}
         * or with individual option parameters: {{_num 3000 minimumFractionDigits=2}}
         *
         * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
         *
         * @param number : number
         * @param options
         * @returns {*}
         */
        function (number, options) {

          let opts = __configLookup(options, i18next.language, optionsConf.NumberFormat);

          const priceFormat = new Intl.NumberFormat(i18next.language, opts);
          return priceFormat.format(number);
        }
      );
      handlebars.registerHelper('_price',
        /**
         * formats a number as currency
         *
         * use with preset: {{_price 4999.99}}
         * or with individual option parameters: {{_price 4999.99 currency="EUR" minimumFractionDigits=2}}
         *
         * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
         *
         * @param price : number
         * @param options
         * @returns {*}
         */
        function (price, options) {

          let opts = __configLookup(options, i18next.language, optionsConf.PriceFormat);

          // for convenience automatically add the object parameter style:'currency' if not given
          if (typeof opts['style'] !== 'string' && typeof opts['currency'] === 'string')
            opts['style'] = 'currency';

          const priceFormat = new Intl.NumberFormat(i18next.language, opts);
          return priceFormat.format(price);
        }
      );

      return handlebars;
    },

    /**
     * we conditionally export the helpers to be able to test against them;
     * in production they are not exported.
     */
    ...(isTest) && {
      helpers: {
        applyToConstructor: __applyToConstructor,
        configLookup: __configLookup,
        validateArgs: __validateArgs,
        setArgs: __setArgs,
        createDateObj: __createDateObj,
        getDateDiff: __getDateDiff
      }
    },
  }
});