import * as React from 'react';
import { useTranslate } from 'react-polyglot';

import './styles.scss';

export * from './Buttons';
export * from './ButtonAsyncToggle';

export const createHoverButton = (ComponentOut, outTitle, ComponentOver, overTitle) => {
	const HoverButton = (props) => {
		const t = useTranslate();
		const [hovered, setHovered] = React.useState(false);

		const handleMouseEnter = () => {
			setHovered(true);
		}

		const handleMouseLeave = (e) => {
			setHovered(false);
		}

		React.useEffect(() => {
			const over = () => setHovered(false);
			window.addEventListener('mouseleave', over);
			return () => window.removeEventListener('mouseleave', over);
		}, []);

		return (hovered ?
			<ComponentOver {...props} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{t(overTitle)}</ComponentOver>
			:
			<ComponentOut {...props} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>{t(outTitle)}</ComponentOut>
		);
	}

	return HoverButton;
}
