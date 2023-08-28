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

export const InfoIcon: FC<props> = ({
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
			className="icon icon-tabler icon-tabler-info-square-rounded"
			width={width}
			height={height}
			viewBox="0 0 24 24"
			stroke-width="2"
			stroke={color}
			fill="none"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path stroke="none" d="M0 0h24v24H0z" fill="none" />
			<path d="M12 9h.01" />
			<path d="M11 12h1v4h1" />
			<path d="M12 3c7.2 0 9 1.8 9 9s-1.8 9 -9 9s-9 -1.8 -9 -9s1.8 -9 9 -9z" />{' '}
		</svg>
	);
};
