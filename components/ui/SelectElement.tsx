import { Dropdown } from '@nextui-org/react';

function SelectComponent({ title, options, onSelect, selectedOption, multiple = false, useId = false, selectedTitle = '' }) {
	const handleOptionChange = e => {
		const value = Array.from(e);
		onSelect(value[0]);
	};

	const handleMultiOptionChange = event => {
		const selectedOptions = Array.from(event);
		onSelect(selectedOptions);
	};
	return (
		<div style={{paddingTop: "1rem"}}>
		<Dropdown>
			<Dropdown.Button flat color="secondary">
				{selectedTitle ? selectedTitle : selectedOption ? selectedOption.name : title}
			</Dropdown.Button>
			<Dropdown.Menu
				aria-label="Multiple selection actions"
				color="secondary"
				disallowEmptySelection
				selectionMode={multiple ? "multiple" : "single"}
				selectedKeys={"asdsa"}
				onSelectionChange={e => multiple ? handleMultiOptionChange(e) : handleOptionChange(e)}
			>
				{options.map(item => (
					<Dropdown.Item key={useId ? item._id.toString() : item}>{useId ? item.name : item}</Dropdown.Item>
				))}
			</Dropdown.Menu>
		</Dropdown>
		</div>
	);
}

export default SelectComponent;
