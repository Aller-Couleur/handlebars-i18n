import * as HandlebarsI18n from "../../dist/handlebars-i18n";
import * as i18next from "i18next";
import * as handlebars from "handlebars";
import { readFileSync } from "fs";

/**
 * A simple example using handlebars-i18n
 * with TypeScript.
 *
 * @author: Dief Bell
 *
 * usage:
 * $ npm run example:ts
 */


// -- The translation phrases for i18next
const myI18nInstance = i18next.createInstance();
myI18nInstance
	.init({
		resources: {
			"en-GB": {
				translation: {
					"key0": "Change Language to",
					"key1": "What is good?",
					"key2": "{{what}} is good.",
					"key3WithCount": "{{count}} item",
					"key3WithCount_plural": "{{count}} items",
					"key4": "Selected Language is:"
				}
			},
			"de": {
				translation: {
					"key0": "Sprache wechseln zu",
					"key1": "Was ist gut?",
					"key2": "{{what}} ist gut.",
					"key3WithCount": "{{count}} Gegenstand",
					"key3WithCount_plural": "{{count}} Gegenstände",
					"key4": "Die ausgewählte Sprache ist:"
				}
			}
		},
		lng: "en-GB",
		compatibilityJSON: "v2"
	});

// -- Handlebars" example data object
const data = {
	sayWhat: "handlebars-i18n",
	holdKey3: "key3WithCount",
	holdKey4: "key4",
	mynumber: 33.333,
	myMmaxDigits: 1,
	myPrice: 12.99,
	myDate: "2020-03-11T03:24:00"
};


const myHandlebarsInstance = handlebars.create();

// -- Init and configure handlebars-i18n
HandlebarsI18n.init(myHandlebarsInstance, myI18nInstance);

HandlebarsI18n.configure([
	// generic configuration for all languages for number representation:
	[ "all", "NumberFormat", { minimumFractionDigits: 2 } ],

	// generic configurations per language for price representation:
	[ "en-GB", "PriceFormat", { currency: "USD" } ],
	[ "de", "PriceFormat", { currency: "EUR" } ],

	// generic configurations per language for date representation:
	[ "en-GB", "DateTimeFormat", { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "numeric" } ],
	[ "de", "DateTimeFormat", { year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", hour12: false } ],

	// configurations per language with custom formats for date:
	[ "en-GB", "DateTimeFormat", { year: "numeric" }, "custom-year-only" ],
	[ "de", "DateTimeFormat", { year: "numeric" }, "custom-year-only" ],
	[ "en-GB", "DateTimeFormat", { year: "numeric", month: "numeric", day: "numeric" }, "custom-date-short" ],
	[ "de", "DateTimeFormat", { year: "numeric", month: "numeric", day: "numeric" }, "custom-date-short" ],
	[ "en-GB", "DateTimeFormat", { hour: "numeric", minute: "numeric", second: "numeric", hour12: false }, "custom-time" ],
	[ "de", "DateTimeFormat", { hour: "numeric", minute: "numeric", second: "numeric", hour12: false }, "custom-time" ],

  // custom formats for relative dates:
  ["en-GB", "RelativeTimeFormat", { style: "short", unit: "year" }, "date-rel-spec"],
  ["de", "RelativeTimeFormat", { style: "short", unit: "year" }, "date-rel-spec"]
]);

const template = readFileSync(__dirname + "/test.hbs", { encoding: "utf-8" });
const compiled = myHandlebarsInstance.compile(template);
myI18nInstance.changeLanguage("de"); // --> Test the changes by replacing "de" with "en-GB"

console.log("\x1b[36m%s\x1b[0m", compiled(data));
