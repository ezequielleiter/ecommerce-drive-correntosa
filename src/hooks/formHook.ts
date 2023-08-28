import { useState } from 'react';

export function useFormValidation<T>(form: T) {
	const [fields, setFields] = useState(form);

	const setValue = (property: keyof T, value: string | boolean | any): void => {
		if(property === null){
			setFields(value);
			return
		}
		setFields({ ...fields, [property]: value });
		setFields({ ...fields, [property]: value });
	};

	const validateFields = (messages: T) => {
		let errors = {};	
		Object.keys(fields).forEach(field => {
			if (field === "_id" || field === "__v"){
				return
			}
			if (typeof fields[field] === "boolean") {
				return
			}
			if (!fields[field]) {
				errors = { ...errors, [field]: `${messages[field]}` };
			}
		});

		return Object.keys(errors).length > 0 ? errors : false;
	};

	return { ...fields, setValue, validateFields, fields };
}
