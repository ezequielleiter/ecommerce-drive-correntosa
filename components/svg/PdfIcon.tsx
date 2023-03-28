import { FC } from 'react';

type props = {
	fill?: string;
	size?: number;
	height?: string;
	width?: string;
	color?: string;
};

export const PdfIcon: FC<props> = ({
	color = 'currentColor',
	fill = 'currentColor',
	size,
	height = '24',
	width = '24',
	...props
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-pdf"
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
			<path d="M10 8v8h2a2 2 0 0 0 2 -2v-4a2 2 0 0 0 -2 -2h-2z"></path>
			<path d="M3 12h2a2 2 0 1 0 0 -4h-2v8"></path>
			<path d="M17 12h3"></path>
			<path d="M21 8h-4v8"></path>
		</svg>
	);
};
