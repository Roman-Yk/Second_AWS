console.log(
	'%c%s %s',
	`background-color: ${NODE_ENV === 'development' ? 'red' : '#00AA00'}; color: white; font-weight: 900; padding: 0.8em; font-size: 1.2em;`,
	NODE_ENV,
	BUILD_TIME
);