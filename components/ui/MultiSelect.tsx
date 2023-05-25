import { Dropdown } from '@nextui-org/react';
import React from 'react';

const MultiSelect = ({ itemsToSelect, setSelecteItem, selectedItems, selectedTitle }) => {
	return (
		<div style={{paddingTop: "1rem"}}>
			<Dropdown>
				<Dropdown.Button flat color="secondary">
					{selectedTitle}
				</Dropdown.Button>
				<Dropdown.Menu
					aria-label="Multiple selection actions"
					color="secondary"
					selectionMode="multiple"
					selectedKeys={selectedItems}
					onSelectionChange={e => setSelecteItem(e)}
					onSelect={e => setSelecteItem(e)}
					// onSelectionChange={}
					css={{display: "contents"}}
				>
					{itemsToSelect.map(item => (
						<Dropdown.Item key={item._id.toString()}>{item.name}</Dropdown.Item>
					))}
				</Dropdown.Menu>
			</Dropdown>
		</div>
	);
};

export default MultiSelect;
