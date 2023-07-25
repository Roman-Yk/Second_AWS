const csv = require('csv-parser');
const fs = require('fs');
const _ = require('lodash');


const readCsvList = (filePath) => new Promise(res => {
	const result = [];
	fs.createReadStream(filePath)
		.pipe(csv())
		.on('data', (data) => {
			result.push(data);
		})
		.on('end', () => {
			res(result);
		});
});



const csvToJson = (fallbacks={}) => {
	const result = {};

	fs.createReadStream('translation/dictionary.csv')
		.pipe(csv())
		.on('data', ({ key, ref, ...langs }) => {
			for (let lang in langs) {
				if (!result[lang]) result[lang] = {};
				if (lang !== "en") {
					const str = fallbacks[langs.en] || langs[lang] || langs.en;
					_.set(result, [lang, key].join('.'), str || _.get(result, [lang, ref]));
				} else {
					const str = langs[lang] || langs.en;
					_.set(result, [lang, key].join('.'), str || _.get(result, [lang, ref]));
				}
			}
		})
		.on('end', () => {
			for (let lang in result) {
				const js = JSON.stringify(result[lang], null, 4);
				fs.writeFileSync(`translation/locales/${lang}.json`, js);
			}
		});
}


const main = async () => {
	const isWatch = process.argv.find(e => e === '--watch');
	if (isWatch) {
		const chokidar = require('chokidar');
		chokidar.watch('translation/dictionary.csv').on('change', (event, path) => {
			console.log('Changed!');
			csvToJson({});
		});
	} else {
		csvToJson({});
	}
}

main();
