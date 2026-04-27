function log(level, message, meta) {
	const entry = { level, message, timestamp: new Date().toISOString() };
	if (meta && typeof meta === 'object') {
		Object.assign(entry, meta);
	}
	const output = JSON.stringify(entry);
	if (level === 'error') {
		console.error(output);
	} else {
		console.log(output);
	}
}

const logger = {
	info: (message, meta) => log('info', message, meta),
	warn: (message, meta) => log('warn', message, meta),
	error: (message, meta) => log('error', message, meta),
};

module.exports = logger;
