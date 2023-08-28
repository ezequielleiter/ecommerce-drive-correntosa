export const parseCSV = csvString => {
	const results = [];
	const lines = csvString.trim().split('\n');
	const headers = lines[0].split(',');

	const arrayToSave = [];

	lines.slice(1).forEach(line => {
		const values = line.split(',');
		let arrayFromLine = [];
		let cellArray = [];
		let isCell = null;
		values.forEach(value => {
			if (isCell && !value.includes('"')) {
				cellArray.push(value);
				return;
			}
			if (value.includes('"')) {
				if (value[0] === '"') {
					isCell = true;
					const valueToSave = value.replace(/"/g, '');
					cellArray.push(valueToSave);
					return;
				} else if (value[value.length - 1] === '"') {
					isCell = false;
					const valueToSave = value.replace(/"/g, '');
					cellArray.push(valueToSave);
					arrayFromLine.push(cellArray);
					cellArray = [];
					return;
				}
			} else {
				arrayFromLine.push(value === '' ? null : value);
			}
		});
		arrayToSave.push(arrayFromLine);
	});

	const result = [];

	arrayToSave.forEach(line => {
		const obj = {};

		headers.forEach((header, index) => {
			obj[header.toLowerCase()] = line[index];
		});
		result.push(obj);
	});

	return result;
};
