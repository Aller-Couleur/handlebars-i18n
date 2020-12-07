/********************************************************************
 * handlebars-i18next.js
 *
 * @author: Florian Walzel
 * @version: 1.0.1
 * @date: 2020-05
 *
 * Handlebars-i18next adds features for localization/
 * internationalization to handelbars.js
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
    root['HandlebarsI18next'] = factory(root.Handlebars, root.i18next, root.Intl);
  else {
    console.error('@handlebars-i18next: One or more dependencies are missing. Check for Handlebars, i18next and Intl.');
    return false;
  }

})(this, function(handlebars, i18next, Intl) {

  'use strict';

  var configuredOptions = {
    DateTimeFormat : { },
    NumberFormat : { },
    PriceFormat : {
      all : { style: 'currency', currency: 'EUR' }
    }
  };

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
   * @param lngShortcode
   * @param typeOfFormat
   * @param options
   * @returns {boolean}
   * @private
   */
  function __validateArgs(lngShortcode, typeOfFormat, options) {

    if (typeof lngShortcode !== 'string') {
      console.error('@ HandelbarsI18next.configure(): Invalid argument ['+ lngShortcode +'] ' +
        'First argument must be a string with language code such as "en".');
      return false;
    }

    if (typeOfFormat !== 'DateTimeFormat'
      && typeOfFormat !== 'NumberFormat'
      && typeOfFormat !== 'PriceFormat') {
      console.error('@ HandelbarsI18next.configure(): Invalid argument ['+ typeOfFormat +']. ' +
        'Second argument must be a string with the options key. ' +
        'Use either "DateTimeFormat", "NumberFormat" or "PriceFormat".');
      return false;
    }

    if (typeof options !== 'object') {
      console.error('@ HandelbarsI18next.configure(): Invalid argument [' + options + '] ' +
        'Third argument must be an object containing the configuration parameters');
      return false;
    }

    return true;
  }

  return {
    /**
     * configure the options for INTL number, currency, and date formatting
     *
     * @param langOrArr : string – the language key like 'fr' or 'all' for all languages
     *                 | array – an array with multiple options
     * @param typeOfFormat : string - DateTimeFormat | NumberFormat | PriceFormat
     * @param options : object - the options object
     */
    configure : function(langOrArr, typeOfFormat, options) {

      if (typeof langOrArr !== 'string' && !Array.isArray(langOrArr)) {
        console.error('@ HandelbarsI18next.configure(): Invalid argument ['+ langOrArr +'] ' +
          'First argument must be a string with language code such as "en" or an array with parameters.');
        return false;
      }

      if (Array.isArray(langOrArr)) {
        if (langOrArr.length < 1) {
          console.log('@ HandelbarsI18next.configure(): ' +
            'You passed an empty array, no parameters taken.');
          return false;
        }
        langOrArr.forEach(elem => {
          if (__validateArgs(elem[0], elem[1], elem[2]))
            configuredOptions[elem[1]][elem[0]] = elem[2];
          else
            return false;
        });
      }
      else {
        if (__validateArgs(langOrArr, typeOfFormat, options))
          configuredOptions[typeOfFormat][langOrArr] = options;
        else
          return false;
      }

      return true;
    },

    /**
     * init all handlebars helpers
     *
     * @returns {*}
     */
    init : function() {
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
        function() {
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
        function(language) {
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
         * @link: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date
         *
         * @param dateInput : string | number
         * @param options
         */
        function(dateInput, options) {

          var date;

          if (typeof dateInput === 'number') {
            // input as milliseconds since unix epoch, like: 1583922952743
            date = new Date(dateInput);
          }
          else if (typeof dateInput === 'string') {

            if (dateInput.charAt(0) == '[' && dateInput.slice(-1) == ']') {
              // input as array represented as string such as "[2020, 11]"
              dateInput = dateInput.substring(1, dateInput.length-1).replace(/ /g,'');
              var dateArr = dateInput.split(',');
              var dateFactory = __applyToConstructor.bind(null, Date);
              date = dateFactory(dateArr);
            }
            else if (dateInput.toLowerCase() == 'now' || dateInput.toLowerCase() == 'today') {
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

          var opts =
            (typeof options !== 'undefined' && Object.keys(options.hash).length != 0) ?
              options.hash : configuredOptions.DateTimeFormat[i18next.language] ||
            configuredOptions.DateTimeFormat.all;

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
         *  * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
         *
         * @param number : number
         * @param options
         * @returns {*}
         */
        function(number, options) {

          var opts =
            (Object.keys(options.hash).length != 0) ? options.hash : configuredOptions.NumberFormat[i18next.language] ||
            configuredOptions.NumberFormat.all;

          const priceFormat = new Intl.NumberFormat(i18next.language, opts);
          return priceFormat.format(number);
        }
      );
      handlebars.registerHelper('_price',
        /**
         * formats a number as currency
         *
         * use with preset: {{_price 4999.99}
         * or with individual option parameters: {{_price 4999.99 currency="EUR" minimumFractionDigits=2}}
         *
         * @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat
         *
         * @param price : number
         * @param options
         * @returns {*}
         */
        function(price, options) {
          var opts =
            (Object.keys(options.hash).length != 0) ? options.hash : configuredOptions.PriceFormat[i18next.language] ||
            configuredOptions.PriceFormat.all;

          // for convenience automatically add the object parameter style:'currency' if not given
          if (typeof opts['style'] !== 'string' )
            opts['style'] = 'currency';

          const priceFormat = new Intl.NumberFormat(i18next.language, opts);
          return priceFormat.format(price);
        }
      );

      return handlebars;
    }
  }
});



