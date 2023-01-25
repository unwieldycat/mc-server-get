import { program } from 'commander';

program
	.name('mcs-fetch')
	.version('1.0.0-dev')
	.description('CLI to download or build minecraft server binaries');

program.parse();
