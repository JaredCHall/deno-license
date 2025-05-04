import {LicenseRegistry} from "./LicenseRegistry.ts";

/** install a license from the LicenseRegistry with prompts for additional information */
export async function installWithPrompts(
		outputPath: string = 'LICENSE',
		registry = new LicenseRegistry(),
): Promise<void> {

	const license = LicenseRegistry.normalizeKey(
			promptUser("📜 License (bsd, mit, gpl, agpl, hippocratic):")
	);
	if (!registry.has(license)) {
		console.error(`❌ Unknown license: ${license}`)
		Deno.exit(1)
	}

	const replacements = {
		license,
		year: '????',
		owner: 'Anonymous',
		softwareName: 'This Software',
	}

	registry.expectedMappings(license).forEach(tokenMapping => {
		switch(tokenMapping) {
			case 'year': return replacements.year = promptUser("📅 Year of copyright:", new Date().getFullYear().toString())
			case 'owner': return replacements.owner = promptUser('👤 Enter license holder name:')
			case 'softwareName': return replacements.softwareName = promptUser("💾 Project or software name (optional):")
		}
	})

	const licenseText = registry.fetch(license, replacements.year, replacements.owner, replacements.softwareName)
	await Deno.writeTextFile(outputPath, licenseText + "\n")
	console.log(`✅ License written to ${outputPath}`)
}

function promptUser(question: string, defaultValue?: string): string {
	const input = prompt(question, defaultValue)?.trim()
	if(!input) Deno.exit(1);
	return input;
}