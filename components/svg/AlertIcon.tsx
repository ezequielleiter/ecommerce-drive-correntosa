import { FC } from 'react';

type props = {
	fill?: string;
	size?: number;
	height?: string;
	width?: string;
	color?: string;
	filled?: string;
	label?: string
};

export const AlertIcon: FC<props> = ({
	color = 'currentColor',
	fill = 'currentColor',
	filled,
	size,
	height = '24',
	width = '24',
	label,
	...props
}) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className="icon icon-tabler icon-tabler-alert-triangle"
			width={width}
			height={height}
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke={color}
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
			<path d="M12 9v2m0 4v.01"></path>
			<path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"></path>
		</svg>
	);
};
