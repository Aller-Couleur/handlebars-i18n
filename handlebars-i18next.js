'use strict';

module.exports = {
    init : function(handlebars, i18next) {
      return handlebars.registerHelper('__',
        /** __()
         *
         * this puts together handlebars and i18Next
         * use like: {{__ "key_name"}}
         *
         * @param str
         * @param options
         * @returns {*}
         */
        function (str, options) {
          return new handlebars.SafeString((typeof(i18next) !== 'undefined' ? i18next.t(str, options.hash) : str));
        }
      ).registerHelper('_v',
        /** _v()
         *
         * …
         * use like: {{_v here.is.theKey}}
         *
         * @param str
         * @param options
         * @returns {*}
         */
        function (str, options) {
          return new handlebars.SafeString((typeof(i18next) !== 'undefined' ? i18next.t(str, options) : options));
        }
      ).registerHelper('_lang',
        /**
         *
         * use like: {{_lang}}
         *
         * @returns {language|any|string|*|e}
         */
        function() {
          return i18next.language;
        }
      ).registerHelper('_langIs',
        /**
         *
         * use like: {{#if (_langIs "en")}} Hello EN {{/if}}
         *
         * @returns {language|any|string|*|e}
         */
        function(lng) {
          return i18next.language === lng;
        }
      ).registerHelper('_formatDate', function() {

        }
      ).registerHelper('_formatNumber', function() {

        }
      ).registerHelper('_formatCurrency', function() {

        }
      );
    }
};
