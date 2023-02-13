import axios from 'axios';
import { userInfo } from 'os';
import { program, downloadFile } from './main';
import { OptionValues } from 'commander';

// ============================= Main function ============================= //

interface VersionMeta {
	id: string;
	type: string;
	url: string;
	time: string;
	releaseTime: string;
	sha1: string;
	complianceLevel: number;
}

interface Manifest {
	latest: { release: string; snapshot: string };
	versions: VersionMeta[];
}

async function main(version: string, options: OptionValues): Promise<void> {
	if (version) {
		const versionRegexp = /(\d{2}w\d{2}\w+)|(1\.\d{1,2}(\.\d{1,2})?(-(pre|rc)\d{1})?)/;
		const versionIsValid = versionRegexp.test(version);
		if (!versionIsValid) program.error('Invalid version string!');
	}

	const manifest: Manifest = await (async () => {
		const res = await axios.get('https://piston-meta.mojang.com/mc/game/version_manifest_v2.json');
		if (res.status !== 200)
			program.error(`An error occurred getting the version manifest (Recieved HTTP ${res.status})`);
		return res.data;
	})();

	if (!version) version = manifest.latest.release;

	const versionManifest = await (async () => {
		const meta = manifest.versions.find((v) => v.id === version);
		if (!meta) program.error(`Unable to find version ${version}`);

		const res = await axios.get(meta.url);
		return res.data;
	})();

	const downloadUrl = versionManifest.downloads?.server.url;
	if (!downloadUrl) program.error(`No server binary for version ${version}`);

	const filePath = options?.output || userInfo().homedir;
	downloadFile(`server-${version}`, downloadUrl, filePath);
}

export default main;
