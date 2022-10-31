/********************************************************************
 * handlebars-i18n.js
 *
 * @author: Florian Walzel
 * @date: 2021-10
 *
 * handlebars-i18n adds features for localization/
 * internationalization to handlebars.js
 *
 * Copyright (c) 2020 Florian Walzel
 *
 * Permission is hereby granted, free of charge, to any person
 * obtaininga copy of this software and associated documentation
 * files (the "Software"), to deal in the Software without restriction,
 * including without limitation the rights to use, copy, modify, merge,
 * publish, distribute, sublicense, and/or sell copies of the Software,
 * and to permit persons to whom the Software is furnished to do so,
 * subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
 * OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 * BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *********************************************************************/

(function (root, factory) {

  if (typeof exports === 'object' && typeof module === 'object') {
    const Handlebars = require('handlebars'),
      i18next = require('i18next'),
      Intl = require('intl');
    module.exports = factory(Handlebars, i18next, Intl);
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

})(this, function (handlebars, i18next, Intl) {

  'use strict';

  var defaultConf = {
    DateTimeFormat: {
      standard: {},
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

  // make a copy of default object
  var optionsConf = JSON.parse(JSON.stringify(defaultConf));


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
    var args = [null].concat(argArray);
    var factoryFunction = constructor.bind.apply(constructor, args);
    return new factoryFunction();
  }

  /**
   *
   * @param hndlbrsOpts
   * @param OCFormat
   * @returns {*}
   * @private
   */
  function __configLookup(hndlbrsOpts, lang, OCFormat) {

    // check if an options object with .hash exists, and holds some content
    if (typeof hndlbrsOpts === 'object'
      && typeof hndlbrsOpts.hash === 'object'
      && Object.keys(hndlbrsOpts.hash).length > 0) {

      let oh = hndlbrsOpts.hash;

      // check against a custom format, if nonexistent
      // return the options hash (= template configuration)
      if (typeof oh.format === 'undefined') {
        return oh;
      }
      // when custom format is given, check if the configuration was set
      else if (typeof OCFormat.custom[oh.format] !== 'undefined'
        && typeof OCFormat.custom[oh.format][lang] !== 'undefined') {
        return OCFormat.custom[oh.format][lang];
      }
    }

    // when no options for custom formats given, first check whether
    // the specific language has a generic definition
    if (typeof OCFormat.standard[lang] !== 'undefined')
      return OCFormat.standard[lang];

    // … then check if a universal format definition for all languages exist
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
   * @returns {boolean}
   * @private
   */
  function __validateArgs(lngShortcode, typeOfFormat, options, customFormat) {

    if (typeof lngShortcode !== 'string') {
      console.error('@ handlebars-i18n.configure(): Invalid argument <' + lngShortcode + '> ' +
        'First argument must be a string with language code such as "en".');
      return false;
    }

    if (typeOfFormat !== 'DateTimeFormat'
      && typeOfFormat !== 'NumberFormat'
      && typeOfFormat !== 'PriceFormat') {
      console.error('@ handlebars-i18n.configure(): Invalid argument <' + typeOfFormat + '>. ' +
        'Second argument must be a string with the options key. ' +
        'Use either "DateTimeFormat", "NumberFormat" or "PriceFormat".');
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
   * @param typeOfFormat
   * @param options
   * @param customFormat
   * @returns {boolean}
   * @private
   */
  function __setArgs(lang, typeOfFormat, options, customFormat) {

    if (typeof customFormat !== 'undefined' && customFormat !== null) {
      // create object node with name of the configuration if not already existing
      if (typeof optionsConf[typeOfFormat].custom[customFormat] === 'undefined')
        optionsConf[typeOfFormat].custom[customFormat] = {};

      optionsConf[typeOfFormat].custom[customFormat][lang] = options;
    }
    else
      optionsConf[typeOfFormat].standard[lang] = options;

    return true;
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
    configure: function (langOrArr, typeOfFormat, options, customFormatname = null) {

      if (typeof langOrArr !== 'string' && !Array.isArray(langOrArr)) {
        console.error('@ handlebars-i18n.configure(): Invalid argument <' + langOrArr + '> ' +
          'First argument must be a string with language code such as "en" or an array with parameters.');
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
        if (__validateArgs(langOrArr, typeOfFormat, options, customFormatname))
          __setArgs(langOrArr, typeOfFormat, options, customFormatname);
        else
          return false;
      }

      return true;
    },

    /**
     * resets the configuration to default state like it is before configure() is called
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

          var date;

          if (typeof dateInput === 'number') {
            // input as milliseconds since unix epoch, like: 1583922952743
            date = new Date(dateInput);
          }
          else if (typeof dateInput === 'string') {

            if (dateInput.charAt(0) === '[' && dateInput.slice(-1) === ']') {
              // input as array represented as string such as "[2020, 11]"
              dateInput = dateInput.substring(1, dateInput.length - 1).replace(/ /g, '');
              var dateArr = dateInput.split(',');
              var dateFactory = __applyToConstructor.bind(null, Date);
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

          var opts = __configLookup(options, i18next.language, optionsConf.DateTimeFormat);

          const dateFormat = new Intl.DateTimeFormat(i18next.language, opts);
          return dateFormat.format(date);
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

          var opts = __configLookup(options, i18next.language, optionsConf.NumberFormat);

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

          var opts = __configLookup(options, i18next.language, optionsConf.PriceFormat);

          // for convenience automatically add the object parameter style:'currency' if not given
          if (typeof opts['style'] !== 'string' && typeof opts['currency'] === 'string')
            opts['style'] = 'currency';

          const priceFormat = new Intl.NumberFormat(i18next.language, opts);
          return priceFormat.format(price);
        }
      );

      return handlebars;
    }
  }
});



