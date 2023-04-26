import { FC } from 'react';

type props = {
	fill?: string;
	size?: number;
	height?: string;
	width?: string;
	color?: string;
	filled?: string;
	label?: string;
};

export const ArrowScroll: FC<props> = ({ fill = 'currentColor', filled, size, height, width, label, ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-chevrons-up"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke="currentColor"
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
			<path d="M7 11l5 -5l5 5"></path>
			<path d="M7 17l5 -5l5 5"></path>
		</svg>
	);
};
