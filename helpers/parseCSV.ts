export const parseCSV = csvString => {
	const results = [];
	const lines = csvString.trim().split('\n');
	const headers = lines[0].split(',');

	for (let i = 1; i < lines.length; i++) {
		const values = lines[i].split(',');
		const obj = {};

		for (let j = 0; j < headers.length; j++) {
			let value = values[j].replace(/""/g, '"');
			value = value.replace(/^"|"$/g, '');

			if (value.includes(';')) {
				value = value.split(';');
			}

			obj[headers[j].toLowerCase()] = value;
		}

		results.push(obj);
	}

	return results;
};
