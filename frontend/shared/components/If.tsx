import * as React from 'react';


export const If = ({ condition, children }) => {
	return condition ? children : null;
}
