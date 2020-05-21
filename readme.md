# handlebars-i18next.js

`handlebars-i18next.js` adds the internationalization features of i18next and Intl to handlebars.js.

[Handlebars.js](https://handlebarsjs.com/) is a slim and convenient templating language but does not come up with build in localization / internationalization features and is not in the [list](https://www.i18next.com/overview/supported-frameworks) of [i18next](https://www.i18next.com)'s supported Frameworks. Handlebars-i18next.js bridges the gap. It is usable as node module as well as in browser.


## License

Copyright (c) 2020 Florian Walzel
MIT License

## Install

```
$ npm install handlebars-i18next
```


## Usage

Usage within node environment:

```
const HandelbarsI18next = require("handlebars-i18next");
HandelbarsI18next.init();
```

Usage in web browser:

```
<script src="handelbars.js"></script>
<script src="i18next.js"></script>
<script src="handlebars-i18next.js"></script>

<script>
    HandelbarsI18next.init()
</script>
```

## Example

Initialize i18next with your language strings and default settings:

```
i18next.init({
	resources : {
        "en" : {
            translation : {
                "key1": "What is good?",
                "key2": "{{what}} is good."
            }
        },
        "de" : {
            translation: {
                "key0": "Sprache wechseln zu",
                "key1": "Was ist gut?",
           }
        }
    },
    lng : "en"
});
```

Set your Handlebars.js data object:

```
let data = { 
	myPrice: 12.99,
 	myDate: '2020-03-11T03:24:00'
}

```

Initialize handlebars-i18next:

```
HandelbarsI18next.init()
```

Optionally configure your language specific number, currency, and date-time defaults:

```
 HandlebarsI18next.configure([
 	["en", "PriceFormat", {currency: "USD"}],
	["de", "PriceFormat", {currency: "EUR"}]
]);
```

Finally use in template:

```
<p> {{ }} {{_price myPrice}}  </p>
```

Also see the *examples folder* in the repo for more details.


## API

#### __



```
{{__ "keyToTranslationPhrase"}}
```

```
{{__ keyToTranslationPhrase}}
```
**Variable Replacement**

**Plurals**


--

#### _locale

Returns the shortcode of i18next's currently selected language such as "en", "de", "fr", "fi" … etc.

```
{{_locale}}
```
--

#### localeIs


```
{{#if (localeIs "en")}} ... {{/if}}
```
--

#### _date



--

#### _num

--

#### _price

--

#### How to use HandlebarsI18next.configure

--