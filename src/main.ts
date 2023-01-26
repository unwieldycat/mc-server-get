import { program } from 'commander';
import vanilla from './vanilla';

// ============================= Program Config ============================= //

program
	.name('mcs-fetch')
	.version('1.0.0-dev')
	.description('CLI to download or build minecraft server binaries');

program.command('vanilla [version]').description('Download vanilla binary').action(vanilla);

program.parse();

// ============================ Common functions ============================ //

function downloadFile(): void {
	// ...
}

export { program, downloadFile };
