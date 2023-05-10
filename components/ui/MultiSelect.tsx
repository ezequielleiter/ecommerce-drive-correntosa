import { Dropdown } from '@nextui-org/react';
import React from 'react';

const MultiSelect = ({ itemsToSelect, setSelecteItem, selectedItems, productorSeletedItems}) => {

    const selectedValue = React.useMemo(
        () => Array.from(selectedItems).join(", ").replaceAll("_", " "),
        [selectedItems]
      );

	return (
		<Dropdown>
			<Dropdown.Button flat color="secondary" >
				Selecciones los tags
			</Dropdown.Button>
			<Dropdown.Menu
				aria-label="Multiple selection actions"
				color="secondary"
				disallowEmptySelection
				selectionMode="multiple"
				selectedKeys={selectedItems}
				onSelectionChange={(e) => setSelecteItem(e)}
			>
                {
                    itemsToSelect.map((item) => (
                        <Dropdown.Item key={item._id.toString()}>{item.name}</Dropdown.Item>
                    ))
                }
			</Dropdown.Menu>
		</Dropdown>
	);
};

export default MultiSelect;
