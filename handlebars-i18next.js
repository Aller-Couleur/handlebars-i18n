'use strict';

const handlebars = require('handlebars');
const i18next = require('i18next');
const intl = require('intl');

module.exports = {

    configuredOptions : {
      DateTimeFormat : { },
      NumberFormat : { },
      PriceFormat : {
        all : { style: 'currency' }
      }
    },

    /**
     * configure the options for INTL number, currency, and date formatting
     *
     * @param language : the language key like 'fr' or 'all' for all languages
     * @param typeOfFormat : DateTimeFormat | NumberFormat | PriceFormat
     * @param options : the options object
     */
    configure : function(language, typeOfFormat, options) {

      if (typeof language !== string)
        return console.log('boo 1');
      if (typeof language !== typeOfFormat)
        return console.log('boo 2');

      this.configuredOptions[typeOfFormat][language] = options;

      return true;
    },

    init : function() {
      return handlebars.registerHelper('__',
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
      ).registerHelper('_v',
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
      ).registerHelper('_locale',
        /**
         * echo the current language
         * use like: {{_locale}}
         *
         * @returns {language|any|string|*|e}
         */
        function() {
          return i18next.language;
        }
      ).registerHelper('localeIs',
        /**
         * check against the current language
         * use like: {{#if (localeIs "en")}} Hello EN {{/if}}
         *
         * @returns {language|any|string|*|e}
         */
        function(language) {
          return i18next.language === language;
        }
      ).registerHelper('_date',
          /**
           *
           * @param dateString
           * @param options
           */
          function(dateString, options) {
            let options =
                this.configuredOptions.DateTimeFormat[i18next.language] ||
                this.configuredOptions.DateTimeFormat.all || options;
            const dateFormat = new Intl.DateTimeFormat(i18next.language, options);
            return dateFormat.format(dateString);
          }
      ).registerHelper('_num',
          /**
           *
           * @param number
           * @param options
           * @returns {*}
           */
          function(number, options) {
            let options =
                this.configuredOptions.NumberFormat[i18next.language] ||
                this.configuredOptions.NumberFormat.all || options;
            const priceFormat = new intl.NumberFormat(i18next.language, options);
            return priceFormat.format(number);
        }
      ).registerHelper('_price',
          /**
           *
           * @param price
           * @param options
           * @returns {*}
           */
          function(price, options) {
            let options =
                this.configuredOptions.PriceFormat[i18next.language] ||
                this.configuredOptions.PriceFormat.all || options;
            const priceFormat = new intl.NumberFormat(i18next.language, options);
            return priceFormat.format(price);
          }
      );
    }
};
