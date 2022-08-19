odule.exports = [
	{
		script: './main.js',
		name: 'application',
		exec_mode: 'fork',
		instances: 1,
		max_memory_restart: '100M',
		autorestart: true
	}
];