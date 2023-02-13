import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { userInfo } from 'os';
import { program } from 'commander';
import vanilla from './vanilla.js';

// ============================= Program Config ============================= //

program
	.name('mcs-fetch')
	.version('1.0.0-dev')
	.description('CLI to download or build minecraft server binaries');

program
	.command('vanilla [version]')
	.description('Download vanilla binary')
	.option('-o, --output <path>', 'Output directory')
	.action(vanilla);

program.parse();

// ============================ Common functions ============================ //

async function downloadFile(fileName: string, url: string, outputDir: string): Promise<void> {
	outputDir = path.normalize(outputDir);
	const homeRegexp = /~\//; // Looks for file paths starting with "~/"
	outputDir = outputDir.replace(homeRegexp, `${userInfo().homedir}/`);

	fs.access(outputDir, (err) => {
		if (err) program.error(`An error occurred accessing directory ${outputDir}: ${err.message}`);
	});

	const fileExtension = url.match(/\/\w+(\.\w+)$/)?.[1];
	const outputFile = path.resolve(outputDir, `${fileName}${fileExtension}`);
	fs.writeFile(outputFile, '', (err) => {
		if (err) program.error(`An error occurred making file: ${err}`);
	});

	const fileStream = fs.createWriteStream(outputFile, { autoClose: true });
	const response = await axios.get(url, { responseType: 'stream' });
	response.data.pipe(fileStream);

	fileStream.on('error', (err) => {
		program.error(`An error occurred with WriteStream: ${err}`);
	});
}

// TODO: Add pretty output

export { program, downloadFile };
