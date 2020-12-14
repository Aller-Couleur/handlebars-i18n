# handlebars-i18n

`handlebars-i18n` adds the internationalization features of **i18next** and **Intl** to **handlebars.js**.

[Handlebars.js](https://handlebarsjs.com/) is a slim and convenient templating language but does not come up with build-in localization / internationalization features and is not in the [list](https://www.i18next.com/overview/supported-frameworks) of [i18next](https://www.i18next.com)'s supported Frameworks. Handlebars-i18next.js bridges the gap. It is usable as node module as well as in browser.


[![Build Status](https://travis-ci.org/fwalzel/handlebars-i18n.svg?branch=master)](https://travis-ci.org/fwalzel/handlebars-i18n) [![Coverage Status](https://coveralls.io/repos/github/fwalzel/handlebars-i18next/badge.svg?branch=master)](https://coveralls.io/github/fwalzel/handlebars-i18next?branch=master)

## License

Copyright (c) 2020 Florian Walzel,
MIT License

## Install

```
$ npm install handlebars-i18n handlebars i18next intl
```


## Usage

Usage within node environment:

```
const HandlebarsI18n = require("handlebars-i18n");
HandlebarsI18n.init();
```

Usage in web browser:

```
<script src="handlebars.js"></script>
<script src="i18next.js"></script>
<script src="handlebars-i18n.js"></script>

<script>
    HandlebarsI18n.init()
</script>
```

## Example

Initialize i18next with your language strings and default settings:

```
const i18next = require('i18next');

i18next.init({
	resources : {
        "en" : {
            translation : {
                "phrase1": "What is good?",
                "phrase2": "{{what}} is good."
            }
        },
        "de" : {
            translation: {
                "phrase1": "Was ist gut?",
                "phrase2": "{{what}} ist gut."
           }
        }
    },
    lng : "en"
});
```

Set your Handlebars.js data object:

```
let data = {
	myItem: "handlebars-i18n", 
	myPrice: 1200.99,
 	myDate: "2020-03-11T03:24:00"
}

```

Initialize handlebars-i18n:

```
HandlebarsI18n.init();
```

Optionally configure your language specific number, currency, and date-time defaults:

```
 HandlebarsI18n.configure([
 	["en", "PriceFormat", {currency: "USD"}],
	["de", "PriceFormat", {currency: "EUR"}]
]);
```

Finally use in template:

```
<p> {{__ "phrase1"}} </p>
```
* returns for "en" &#x2192; **What is good?**

```
<p> {{__ "phrase2" what=myItem}} </p>
```
* returns for "en" &#x2192; **handlebars-i18n is good.**

```
<p> {{_date myDate}} </p>
```
* returns for "en" &#x2192; **March 11, 2020, 4:24 AM**

```
<p> {{_price myPrice}} </p>
```
* returns for "en" &#x2192; **$1,200.99**

Also see the *examples folder* in the repo for more details.


## API



### __

Returns the phrase associated with the given key for the selected language. The key can be passed hard encoded in the template when written in quotes:

```
{{__ "keyToTranslationPhrase"}}
```
… or it can be referenced via a handlebars variable:

```
{{__ keyFromHandlebarsData}}
```

**Variable Replacement**

Template usage:

```
{{__ "whatIsWhat" a="Everything" b="fine"}}
```

The i18next resource:

```
"en" : {
	translation : {
        "whatIsWhat": "{{a}} is {{b}}."
	}
},
```

**Plurals**

```
{{__ "keyWithCount" count=8}}
```

```
'en' : {
	translation : {
   		'keyWithCount': '{{count}} item',
     	'keyWithCount_plural': '{{count}} items',
    }
},
```

---



### _locale

Returns the shortcode of i18next's currently selected language such as "**en**", "**de**", "**fr**", "**fi**" … etc.

```
{{_locale}}
```
---

### localeIs

Checks a string against i18next's currently selected language. Returns **true** or **false**.

```
{{#if (localeIs "en")}} ... {{/if}}
```
---

### _date

Outputs a formated date according to the language specific conventions.

```
{{_date}}
```

If called without argument the current date is returned. Any other input date can be passed as a conventional date string, a number (timestamp in milliseconds), or a javascript date array.

**Date argument given as date string:**

```
{{_date "2020-03-11T03:24:00"}}
```

```
{{_date "December 17, 1995 03:24:00"}}
```

**Date argument given as number (milliseconds since begin of unix epoch):**

```
{{_date 1583922952743}}
```

**Date argument given as javascript date array:**

```
{{_date "[2012, 11, 20, 3, 0, 0]"}}
```

**Additional arguments for formating**

You can add multiple arguments for individual formating. See [Intl DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for your option arguments.

```
{{_date 1583922952743 year="2-digit" day="2-digit" timeZone="America/Los_Angeles"}}
```
---

### _num

Outputs a formated number according to the language specific conventions of number representation, e.g. **4,100,000.8314** for "**en**", but **4.100.000,8314** for "**de**".

```
{{_num 4100000.8314 }}
```

**Additional arguments for formating**

You can add multiple arguments for individual formating. See [Intl NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) for your option arguments.

```
{{_num 3.14159 maximumFractionDigits=2}}
```

---

### _price

Outputs a formated currency string according to the language specific conventions of price representation, e.g. **€9,999.99** for "**en**", but **9.999,99 €** for "**de**".


```
{{_price 9999.99}}
```

**Additional arguments for formating**

You can add multiple arguments for individual currency formating. See [Intl NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) for your option arguments.

```
{{_price 1000 currency="JPY" minimumFractionDigits=2}}
```

---

## How to use HandlebarsI18n.configure method

### Generic language format settings

Instead of defining the formating options for each date, number or price anew, you can configure global settings for all languages or only for specific languages.

```
 HandlebarsI18n.configure("en", "DateTimeFormat", {timeZone: "America/Los_Angeles"});
```

First argument is the language shortcode or "**all**" for all languages. Second is the format option you want to address (DateTimeFormat, NumberFormat, or PriceFormat). Third argument ist the options object with the specific settings.

### Custom language format subsets 

… to do! …

### The lookup cascade

The lookup cascade is:

* `1st Priority`: The argument given in the template for custom configurations by the key "format", i.e. `{{_date format="my-custom-format"}}` 
* `2nd Priority`: The extra argument(s) given in the template, e.g. `{{_date timeZone="America/Los_Angeles" year="2-digit"}}` 
* `3rd Priority`: The global setting configured for the current language, such as "**en**"
* `4th Priority`: The global setting configured for **all** languages
* `Default`: The **Intl** default setting

**Example:**

This defines that all prices for all languages are represented as Dollar:

```
 HandlebarsI18n.configure("all", "PriceFormat", {currency: "USD"});
```

This defines that all prices for all languages are represented as Dollar, but that for language French the currency is Euro:

```
 HandlebarsI18n.configure([
 	["all", "PriceFormat", {currency: "USD"}],
 	["fr", "PriceFormat", {currency: "EUR"}]
]);
```


### Reset an existing configuration

Dismiss all existing configurations:

```
 HandlebarsI18n.reset();
```