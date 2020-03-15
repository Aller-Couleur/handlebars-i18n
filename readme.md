# handlebars-i18next.js

`handlebars-i18next.js` adds internationalization features of i18next and Intl to handlebars.js.

[Handlebars](https://handlebarsjs.com/) is a slim and convenient templating language but does not come up with 
build in localization / internationalization and is not in the [list](https://www.i18next.com/overview/supported-frameworks) of i18next's supported Frameworks.
Handlebars-i18next.js bridges the gap. It is usable as node module and in browser.


## License

Copyright (c) 2020 Florian Walzel
MIT License

## Install

```
$ npm install handlebars-i18next
```

Usage as node module:
```
const HandelbarsI18next = require('handlebars-i18next');
HandelbarsI18next.init.()
```

Usage in web browser:
```
<script src="assets/js/handlebars-i18next.js"></script>
<script>
    let handlebarsI18n = new HandelbarsI18next();
    handlebarsI18n.init(Handlebars, i18next);
</script>
```

## Documentation

// todo