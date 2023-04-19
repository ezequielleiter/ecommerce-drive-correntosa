/* Formating Date*/
export const formatDate = (date: Date) => {
	date.setSeconds(0, 0);
	return date.toISOString().replace(/:00.\d+Z$/g, '');
};

/* Function to get Close Date*/
export const getMinCloseDate = (date: string) => {
	if (!date) {
		return '';
	}
	let minDate = new Date(date);
	minDate.setDate(minDate.getDate() + 1);
	return formatDate(minDate);
};

export const statusDate = (currentDate: any) => {
	let formattedOpenDate = new Date(currentDate.openDate);
	let formattedClosedDate = new Date(currentDate.closeDate);

	formattedOpenDate.setHours(formattedOpenDate.getHours() + 3);
	formattedClosedDate.setHours(formattedClosedDate.getHours() + 3);

	const openTime = formattedOpenDate.getTime();
	const closeTime = formattedClosedDate.getTime();

	const today = new Date();
	const isOpen = today.getTime() >= openTime && today.getTime() <= closeTime;

	let status = '';

	if (isOpen) {
		status = 'open';
	} else if (today.getTime() < openTime) {
		status = 'toOpen';
	} else {
		status = 'closed';
	}

	return status;
};

export const statuSale = (currentDate: any, capital = false) => {
	let formattedOpenDate = new Date(currentDate.openDate);
	let formattedClosedDate = new Date(currentDate.closeDate);

	formattedOpenDate.setHours(formattedOpenDate.getHours() + 3);
	formattedClosedDate.setHours(formattedClosedDate.getHours() + 3);

	const openTime = formattedOpenDate.getTime();
	const closeTime = formattedClosedDate.getTime();

	const today = new Date();
	const isOpen = today.getTime() >= openTime && today.getTime() <= closeTime;

	let status = '';

	if (isOpen) {
		capital ? status = 'ABIERTA' : status = "abierta";
	} else if (today.getTime() < openTime) {
		capital ? status = 'PROXIMAMENTE' : status = "proximamente";
	} else {
		capital ? status = 'FINALIZADA' : status = "finalizada";
	}

	return status;
};
