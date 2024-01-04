# handlebars-i18n

`handlebars-i18n` adds the internationalization features of [i18next](https://www.i18next.com/) to [handlebars.js](https://handlebarsjs.com/). It also provides **date**, **number**, and **currency formatting** via [Intl](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Intl). Use as node module or in the web browser. Supports Typescript.

Handlebars-i18n is listed amongst i18next’s [framework helpers](https://www.i18next.com/overview/supported-frameworks).

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Node.js Version](https://img.shields.io/badge/Node.js-14.x-green)
[![Build](https://github.com/fwalzel/handlebars-i18n/actions/workflows/node.js.yml/badge.svg)](https://github.com/fwalzel/handlebars-i18n/actions/workflows/node.js.yml/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/fwalzel/handlebars-i18next/badge.svg?branch=master)](https://coveralls.io/github/fwalzel/handlebars-i18next?branch=master)
[![Code Climate](https://codeclimate.com/github/Aller-Couleur/handlebars-i18n/badges/gpa.svg)](https://codeclimate.com/github/Aller-Couleur/handlebars-i18n)
[![Known Vulnerabilities](https://snyk.io/test/github/Aller-Couleur/handlebars-i18n/badge.svg)](https://snyk.io/test/github/Aller-Couleur/handlebars-i18n/badge.svg)
![npm](https://img.shields.io/npm/dt/handlebars-i18n)
![npm](https://img.shields.io/npm/dm/handlebars-i18n)

## License

Copyright (c) 2020–24 Florian Walzel,

MIT License

If you use handlebars-i18n in a professional context, you could

[![BuyMeACoffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/fwalzel)

## Install

If you use version npm >= 7:

```bash
$ npm i handlebars-i18n
```

For older versions do:

```bash
$ npm i handlebars-i18n handlebars@4.7.6 i18next@20.2.1 intl@1.2.5
```

## Usage

Usage within node environment:

```javascript
const HandlebarsI18n = require("handlebars-i18n");
HandlebarsI18n.init();
```

Usage in web browser:

```javascript
<script src="handlebars.js"></script>
<script src="i18next.js"></script>
<script src="handlebars-i18n.js"></script>

<script>
  HandlebarsI18n.init()
</script>
```

With ES6 import syntax:

```typescript
import * as HandlebarsI18n from "handlebars-i18n";
HandlebarsI18n.init();
```

## Quick example

Initialize i18next with your language strings and default settings:

```javascript
const i18next = require("i18next");

i18next.init({
  resources : {
    "en" : {
      translation : {
        "phrase1": "What is good?",
        "phrase2": "{{thing}} is good."
      }
    },
    "de" : {
      translation: {
        "phrase1": "Was ist gut?",
        "phrase2": "{{thing}} ist gut."
      }
    }
  },
  lng : "en"
});
```

Set your Handlebars.js data object:

```javascript
let data = {
  myItem: "handlebars-i18n",
  myPrice: 1200.99,
  myDate: "2020-03-11T03:24:00"
}

```

Initialize handlebars-i18n:

```javascript
HandlebarsI18n.init();
```

Optionally configure your language specific number, currency, and date-time defaults:

```javascript
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
<p> {{__ "phrase2" thing=myItem}} </p>
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

## Further examples

:point_right: See the *examples folder* in the repo for more use cases and details.

- Open `examples/browser-example/index.html` in your Web browser to see an implementation with a simple UI
- Run `$ npm run example:js` in the console to get a very basic node example logged
- Run `$ npm run example:ts` to compile and log a typescript example

## Additional CLI Helper for Handlebars-i18n available :metal:

Handlebars-i18n has its own command line interface [handlebars-i18n-cli](https://www.npmjs.com/package/handlebars-i18n-cli).

```bash
$ npm i handlebars-i18n-cli --save-dev
```

Automatically extract translation strings from handlebars templates and generate i18next conform json files from it.
Handlebars-i18n-cli also helps to keep[](https://) your translations up to date when changes are made in the templates over time.

## API

### __

Returns the phrase associated with the given key for the selected language. __ will take all options i18next’s [t-function](https://www.i18next.com/overview/api#t) would take.
The primary key can be passed hard encoded in the template when written in quotes:

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

```javascript
"en" : {
  translation : {
    "whatIsWhat": "{{a}} is {{b}}."
  }
}
```

**Plurals**

```
{{__ "keyWithCount" count=8}}
```

```javascript
"en" : {
  translation : {
    "keyWithCount" : "{{count}} item",
    "keyWithCount_plural" : "{{count}} items"
  }
}, ...
```

**Override globally selected language**

```
{{__ "key1" lng="de"}}
```

Will output the contents for "**de**" even though other language is selected.

---

### _locale

Returns the shortcode of i18next’s currently selected language such as "**en**", "**de**", "**fr**", "**fi**" … etc.

```
{{_locale}}
```

---

### localeIs

Checks a string against i18next’s currently selected language. Returns **true** or **false**.

```
{{#if (localeIs "en")}} ... {{/if}}
```

---

### _date

Outputs a formatted date according to the language specific conventions.

```
{{_date}}
```

If called without argument the current date is returned. Any other input date can be passed as a conventional date string, a number (timestamp in milliseconds), or a date array. _date accepts all arguments Javascript’s [new Date()](https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Date) constructor would accept.

**Date argument given as date string:**

```
{{_date "2020-03-11T03:24:00"}}
```

or

```
{{_date "December 17, 1995 03:24:00"}}
```

**Date argument given as number (milliseconds since begin of unix epoch):**

```
{{_date 1583922952743}}
```

**Date argument given as javascript date array** [year, monthIndex [, day [, hour [, minutes [, seconds [, milliseconds]]]]]]:

```
{{_date "[2012, 11, 20, 3, 0, 0]"}}
```

**Additional arguments for formatting**

You can add multiple arguments for individual formatting. See [Intl DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat) for your option arguments.

```
{{_date 1583922952743 year="2-digit" day="2-digit" timeZone="America/Los_Angeles"}}
```

---

### _num

Outputs a formatted number according to the language specific conventions of number representation, e.g. **4,100,000.8314** for "**en**", but **4.100.000,8314** for "**de**".

```
{{_num 4100000.8314 }}
```

**Additional arguments for formatting**

You can add multiple arguments for individual formatting. See [Intl NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) for your option arguments.

```
{{_num 3.14159 maximumFractionDigits=2}}
```

Will output **3.14** for "**en**", but **3,14** for "**de**".

---

### _price

Outputs a formatted currency string according to the language specific conventions of price representation, e.g. **€9,999.99** for "**en**", but **9.999,99 €** for "**de**".

```
{{_price 9999.99}}
```

**Additional arguments for formatting**

You can add multiple arguments for individual currency formatting. See [Intl NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat) for your option arguments.

```
{{_price 1000 currency="JPY" minimumFractionDigits=2}}
```

---

## How to use HandlebarsI18n.configure method

### Generic language format settings

Instead of defining the formatting options for each date, number or price anew, you can configure global settings for all languages or only for specific languages.

```javascript
HandlebarsI18n.configure("all", "DateTimeFormat", {timeZone: "America/Los_Angeles"});
```

First argument is the language shortcode or "**all**" for all languages. Second is the format option you want to address (DateTimeFormat, NumberFormat, or PriceFormat). Third argument ist the options object with the specific settings.

### Custom language format subsets

You can define specific subsets to be used in the template, i.e. if you want the date in different formats such as:

- **2020** (year-only)
- **11.3.2020** (standard-date)
- **7:24:02** (time-only)

To do this, define a 4th parameter with a custom name:

```javascript
HandlebarsI18n.configure([
  ["en", "DateTimeFormat", {year:"numeric"}, "year-only"],
  ["en", "DateTimeFormat", {year:"numeric", month:"numeric", day:"numeric"}, "standard-date"],
  ['en', 'DateTimeFormat', {hour:"numeric", minute:"numeric", second:"numeric", hour12:false}, "time-only"]
]);
```

Call a subset in template with the parameter format="custom-name", like:

```
{{_date myDate format="year-only"}}
```

### The lookup cascade

The general lookup cascade is:

- **1st Priority**: The argument given in the template for custom configurations by the key "format", i.e. `{{_date format="my-custom-format"}}`
- **2nd Priority**: The extra argument(s) given in the template, e.g. `{{_date timeZone="America/Los_Angeles" year="2-digit"}}`
- **3rd Priority**: The global setting configured for the current language, such as "**en**"
- **4th Priority**: The global setting configured for **all** languages
- **Default**: The **Intl** default setting

**Example:**

This defines that all prices for all languages are represented in Dollar:

```javascript
HandlebarsI18n.configure("all", "PriceFormat", {currency: "USD"});
```

This defines that all prices for all languages are represented in Dollar, but that for the language French the currency is Euro:

```javascript
HandlebarsI18n.configure([
  ["all", "PriceFormat", {currency: "USD"}],
  ["fr", "PriceFormat", {currency: "EUR"}]
]);
```

### Reset an existing configuration

Dismiss all existing configurations:

```javascript
HandlebarsI18n.reset();
```

## Using custom instances of Handlebars and/or i18next

Sometimes you may want to use a Handlebars object you have already modified before, or you may want to use multiple
discrete instances of Handlebars. In this case you can pass you custom Handlebars instance to the init function to use
it instead of the generic Handlebars object like so:

```javascript
const HandlebarsModified = require("handlebars");
HandlebarsModified.registerHelper("foo", function() { return "what you want" });
HandlebarsI18n.init(HandlebarsModified);
```

HandlebarsI18n will have your previously defined method **foo()** by now.

The same can be done for a custom instance of i18next. Pass it as the second argument to the init function.

```javascript
const i18nextCustom = require("i18next");
i18nextCustom.createInstance( /* pass some params here ... */ );
HandlebarsI18n.init(null, i18nextCustom);
```

## Run tests

```bash
$ npm test
```

## Merci à vous

For your contribution, I would like to thank [@MickL](https://github.com/MickL), [@dargmuesli](https://github.com/dargmuesli), and [@DiefBell](DiefBell).

## Note

There is a *different* package named [handlebars-i18next](https://www.npmjs.com/package/handlebars-i18next) by [@jgonggrijp](https://github.com/jgonggrijp) which might also suit your needs. Cheers!
