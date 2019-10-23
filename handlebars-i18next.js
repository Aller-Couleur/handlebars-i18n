'use strict';

module.exports = {
    init : function(handlebars, i18next) {
      return handlebars.registerHelper('t',
        /**
         *
         * @param str
         * @param options
         * @returns {*}
         */
        function (str, options) {
          return new handlebars.SafeString((typeof(i18next) !== 'undefined' ? i18next.t(str, options.hash) : str));
        }
      )
    }
};
