import * as HandlebarsI18n from "../../dist/handlebars-i18n";
import * as i18next from "i18next";
import * as handlebars from "handlebars";
import { readFileSync } from "fs";

/**
 * A simple example using handlebars-i18n
 * with TypeScript.
 *
 * Mirrors the content structure of examples/browser-example/index.html
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
					"key0": "Language",
					"key1": "What is good?",
					"key2": "{{what}} is good.",
					"key3WithCount_one": "{{count}} item",
					"key3WithCount_other": "{{count}} items",
					"key4": "Selected Language is:",
					"key5": "I am the default translation.",
					"fruits": ["Apple", "Banana", "Cherry"],
					"steps": [
						{ title: "Step 1", text: "Open the app" },
						{ title: "Step 2", text: "Click start" }
					]
				}
			},
			"de": {
				translation: {
					"key0": "Sprache",
					"key1": "Was ist gut?",
					"key2": "{{what}} ist gut.",
					"key3WithCount_one": "{{count}} Gegenstand",
					"key3WithCount_other": "{{count}} Gegenstände",
					"key4": "Die ausgewählte Sprache ist:",
					"key5": "Ich bin die Standard-Übersetzung.",
					"fruits": ["Apfel", "Banane", "Kirsche"],
					"steps": [
						{ title: "Schritt 1", text: "App öffnen" },
						{ title: "Schritt 2", text: "Klicke auf Start" }
					]
				}
			}
		},
		lng: "en-GB",
		compatibilityJSON: "v4", // important: defines the JSON standard for plurals
		returnObjects: true // set to true if you want to loop over an array or objects of properties
	});

// -- Handlebars" example data object
const data = {
	sayWhat: "handlebars-i18n",
	holdKey3: "key3WithCount",
	holdKey4: "key4",
	mynumber: 33.333,
	myMaxDigits: 1,
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

/**
 * The template layer lives in examples.hbs — a plain handlebars file
 * organized like the sections of examples/browser-example/index.html.
 *
 * A comment starting with "#" opens a section,
 * every other comment describes the snippet that follows it.
 */
type Example = [description: string, snippet: string];

interface Section {
	title: string;
	examples: Example[];
}

// -- Split the template file into sections and snippets
function parseExamples(source: string): Section[] {
	const sections: Section[] = [];
	let current: Section | undefined;
	const tokens = source.split(/\{\{!--([\s\S]*?)--\}\}/);

	for (let i = 1; i < tokens.length; i += 2) {
		const comment = tokens[i].trim();
		const snippet = (tokens[i + 1] || "").trim();

		if (comment.indexOf("#") === 0) {
			current = { title: comment.substring(1).trim(), examples: [] };
			sections.push(current);
		} else if (current !== undefined && snippet.length > 0) {
			current.examples.push([comment, snippet]);
		}
	}

	return sections;
}

// -- Load the template layer
const sections = parseExamples(readFileSync(__dirname + "/examples.hbs", { encoding: "utf-8" }));

// --> Test the changes by replacing "en-GB" with "de"
myI18nInstance.changeLanguage("en-GB");

// -- Semantic colors for the log output
const color = {
	bold: "\x1b[1m",
	dim: "\x1b[90m",
	yellow: "\x1b[33m",
	cyan: "\x1b[36m",
	green: "\x1b[32m",
	reset: "\x1b[0m"
};

// -- Build the output: description, un-rendered snippet, compiled result
let output = "\n" + color.bold + "HandlebarsI18n example output" + color.reset + "\n";
output += color.bold + "========================================" + color.reset + "\n";

sections.forEach(function (section) {
	output += "\n" + color.yellow + section.title + color.reset + "\n";
	output += color.yellow + "----------------------------------------" + color.reset + "\n";
	section.examples.forEach(function (example) {
		output += color.dim + example[0] + color.reset + "\n"; // explanation
		output += color.cyan + "  " + example[1] + color.reset + "\n"; // code sample
		output += color.green + "  → " + myHandlebarsInstance.compile(example[1])(data) + color.reset + "\n\n"; // result
	});
});

console.log("%s", output);
