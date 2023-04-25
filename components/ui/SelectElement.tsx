import { useState } from 'react';

function SelectComponent({ title, options, onSelect, selectedOption, multiple = false }) {
	const handleOptionChange = event => {
		onSelect(event.target.value);
	};

  const handleMultiOptionChange = event => {
    const selectedOptions = Array.from(event.target.selectedOptions, option => option.value);
    onSelect(selectedOptions);
	};
	return (
		<div>
			<label htmlFor="selectOption">{title}</label>
			<select id="selectOption" multiple={multiple} value={selectedOption} onChange={multiple ? handleMultiOptionChange : handleOptionChange}>
				<option value="">Selecciona una opción</option>
				{options.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
      <style jsx>{`
        select {
          background-color: white;
          cursor: pointer;
          outline: none;
          position: relative;
          width: 100%;
          z-index: 1;
        }
        select:after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 1em;
          height: 1em;
          background-color: #ccc;
          pointer-events: none;
          z-index: -1;
        }
        select:focus:after {
          background-color: #0070f3;
        }
        select option {
          background-color: white;
          color: #333;
        }
        `}
      </style>
		</div>
	);
}

export default SelectComponent;
