'use strict';

const handlebars = require('handlebars');
const i18next = require('i18next');
const intl = require('intl');

var configuredOptions = {
      DateTimeFormat : { },
      NumberFormat : { },
      PriceFormat : {
        all : { style: 'currency', currency: 'EUR' }
      }
    };

module.exports = {

    /**
     * configure the options for INTL number, currency, and date formatting
     *
     * @param language : the language key like 'fr' or 'all' for all languages
     * @param typeOfFormat : DateTimeFormat | NumberFormat | PriceFormat
     * @param options : the options object
     */
    configure : function(language, typeOfFormat, options) {

      if (typeof language !== 'string')
        return console.log('@ HandelbarsI18next.configure(): First argument must be a string with ' +
          'language code such as "en".');

      if (typeOfFormat !== 'DateTimeFormat'
            && typeOfFormat !== 'NumberFormat'
            && typeOfFormat !== 'PriceFormat')
        return console.log('@ HandelbarsI18next.configure(): Second argument must be a string with ' +
          'the options key. Use either "DateTimeFormat", "NumberFormat" oer "PriceFormat".');

      if (typeof options !== 'object')
        return console.log('@ HandelbarsI18next.configure(): Third argument must be an object ' +
          'containing the configuration parameters');

      configuredOptions[typeOfFormat][language] = options;

      return true;
    },

    init : function() {
      handlebars.registerHelper('__',
        /**
         * key as string retrieves the translation phrase
         * use like: {{__ "key_name"}}
         *
         * @param str
         * @param attributes
         * @returns {*}
         */
        function (str, attributes) {
          return new handlebars.SafeString((typeof(i18next) !== 'undefined' ? i18next.t(str, attributes.hash) : str));
        }
      );
      handlebars.registerHelper('_v',
        /**
         * the key comes from a handlebars variable instead
         * use like: {{_v here.is.theKey}}
         *
         * @param str
         * @param attributes
         * @returns {*}
         */
        function (str, attributes) {
          return new handlebars.SafeString((typeof(i18next) !== 'undefined' ? i18next.t(str, attributes) : attributes));
        }
      );
      handlebars.registerHelper('_locale',
        /**
         * echo the current language
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
         * check against the current language
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
           *
           * @param dateString
           * @param options
           */
          function(dateString, options) {
            let options =
                configuredOptions.DateTimeFormat[i18next.language] ||
                configuredOptions.DateTimeFormat.all || options;
            const dateFormat = new Intl.DateTimeFormat(i18next.language, options);
            return dateFormat.format(dateString);
          }
      );
      handlebars.registerHelper('_num',
          /**
           *
           * @param number
           * @param options
           * @returns {*}
           */
          function(number, options) {
            let opts =
                (typeof options === 'string') ? { style: 'currency', currency: currency } : null ||
                configuredOptions.NumberFormat[i18next.language] ||
                configuredOptions.NumberFormat.all || options;
            const priceFormat = new intl.NumberFormat(i18next.language, opts);
            return priceFormat.format(number);
        }
      );
      handlebars.registerHelper('_price',
          /**
           *
           * @param price
           * @param options
           * @returns {*}
           */
          function(price, options) {
            let opts =
                (Object.keys(options.hash).length != 0) ? options.hash : configuredOptions.PriceFormat[i18next.language] ||
                configuredOptions.PriceFormat.all;

            // for usage convenience automatically add the object parameter style:'currency' if not given
            if (typeof opts['style'] !== 'string' )
              opts['style'] = 'currency';

            const priceFormat = new intl.NumberFormat(i18next.language, opts);
            return priceFormat.format(price);
          }
      );

      return handlebars;
    }
};
