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

export const CheckIcon: FC<props> = ({ fill = 'currentColor', filled, size, height, width, label, ...props }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-check"
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
			<path d="M5 12l5 5l10 -10"></path>
		</svg>
	);
};
