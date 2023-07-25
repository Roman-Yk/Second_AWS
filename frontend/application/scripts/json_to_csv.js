const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const _ = require('lodash');


const flat = (obj, path=[], result={}) => {
	const keys = Object.keys(obj);

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const d = obj[key];

		if (d instanceof Object) {
			flat(d, [...path, key], result);
		} else if (typeof d === "string") {
			const kk = [...path, key].join(".");
			result[kk] = {
				ref: null,
				str: d,
			};
		}
	}

	return result;
}

const getFlattenTranslate = (lang) => {
	const f = fs.readFileSync(`translation/locales/${lang}.json`);
	const json = JSON.parse(f);
	return {
		lang: lang,
		translations: flat(json),
	};
}

const mergeTranslations = (en, ...rest) => {
	const result = {};
	const objs = [en, ...rest];

	for (let obj of objs) {
		const translations = obj.translations;
		const lang = obj.lang;
		for (let key in translations) {
			if (!result[key]) {
				result[key] = {};
			}

			if (translations[key]) {
				result[key][lang] = translations[key].str;
			} else if (en.translations[key]) {
				result[key][lang] = en.translations[key].str;
			} else {
				console.log(`No ENGLISH and "${lang}" for:`, key, en.translations[key]);
			}
		}
	}

	return result;
}

const en = getFlattenTranslate("en");
const merged = mergeTranslations(en,
	getFlattenTranslate("ua"),
	getFlattenTranslate("nl"),
);

const items = Object.keys(merged).map(key => ({
	key: key,
	...merged[key],
}));

const csvWriter = createCsvWriter({
    path: 'translation/dictionary.csv',
    header: [
        {id: 'key', title: 'key'},
        {id: 'ref', title: 'ref'},
        {id: 'en', title: 'en'},
        {id: 'ua', title: 'ua'},
        {id: 'nl', title: 'nl'},
    ]
});

csvWriter.writeRecords(items);
