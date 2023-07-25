const fs = require("fs");
const path = require("path");


const isDirectory = source => fs.lstatSync(source).isDirectory();

function getEntriesFrom(sourcePath) {
	return fs.readdirSync(sourcePath)
		.filter(file => isDirectory(path.resolve(sourcePath, file)))
		.reduce((entries, file) => {
			const entry = path.resolve(sourcePath, file, "index.tsx");
			if (!fs.existsSync(entry)) return entries;
			return {
				...entries,
				[file]: entry,
			}
		}, {});
}


exports.getEntriesFrom = getEntriesFrom;