import fs from 'fs';
import path from 'path';

export const codes = {};
export const lookup = {};

const dir = path.resolve(__dirname, '..', 'messages', 'en');
const filenameRegExp = /^(\d+(?:\.\d+)?)\-(.+)\.md$/;

for (const name of fs.readdirSync(dir)) {
	const subdir = path.join(dir, name);
	try {
		for (const name of fs.readdirSync(subdir)) {
			const m = name.match(filenameRegExp);
			if (m) {
				codes[m[2]] = m[1];
				lookup[m[1]] = m[2];
			}
		}
	} catch (e) {}
}
