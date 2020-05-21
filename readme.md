# handlebars-i18next.js

`handlebars-i18next.js` adds the internationalization features of i18next and Intl to handlebars.js.

[Handlebars.js](https://handlebarsjs.com/) is a slim and convenient templating language but does not come up with build in localization / internationalization features and is not in the [list](https://www.i18next.com/overview/supported-frameworks) of [i18next](https://www.i18next.com)'s supported Frameworks. Handlebars-i18next.js bridges the gap. It is usable as node module as well as in browser.


## License

Copyright (c) 2020 Florian Walzel,
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



### __



```
{{__ "keyToTranslationPhrase"}}
```

```
{{__ keyToTranslationPhrase}}
```
**Variable Replacement**

**Plurals**


--



### _locale

Returns the shortcode of i18next's currently selected language such as "**en**", "**de**", "**fr**", "**fi**" … etc.

```
{{_locale}}
```
--

### localeIs

Check against  i18next's currently selected language. Returns **true** or **false**.

```
{{#if (localeIs "en")}} ... {{/if}}
```
--

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

--

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

--

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

--

#### How to use HandlebarsI18next.configure

Instead of defining the formating options for each date, number or price anew, you can configure global settings for all languages or only specific languages.

```
 HandlebarsI18next.configure("en", "DateTimeFormat", {timeZone: "America/Los_Angeles"});
```

First argument is the language shortcode or "**all**" for all languages. Second is the format option you want to address (DateTimeFormat, NumberFormat, or PriceFormat). Third argument ist the options object with the specific settings.

The lookup cascade is:

* `1st Priority`: The argument given in the template, e.g. `{{_date timeZone="America/Los_Angeles"}}` 
* `2nd Priority`: The global setting configured for the current language, such as "**en**"
* `3rd Priority`: The global setting configured for **all** languages
* `4th Priority`: The **Intl** default setting

**Example:**

*This defines that all prices for all languages is represented as Dollar:*

```
 HandlebarsI18next.configure("all", "PriceFormat", {currency: "USD"});
```

*This defines that all prices for all languages is represented as Dollar, but that for language French the currency is Euro:*

```
 HandlebarsI18next.configure([
 	["all", "PriceFormat", {currency: "USD"}],
 	["fr", "PriceFormat", {currency: "EUR"}]
]);
```


