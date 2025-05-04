import rawLicenses from './licenses.json' with { type: 'json' }

/** A record of available licenses keyed by their lowercase name. */
const licenses: Record<string, string> = rawLicenses

/** Options for installing a software license. */
export interface InstallLicenseOptions {
	/** The SPDX ID or string similar to the SPDX id (e.g., "MIT", "BSD", "gpl","GPL-3.0","gpl3") */
	license: string
	/** The target directory (defaults to '.') */
	projectPath?: string
}

/** Install a LICENSE file into the given project directory. Prompts User for licensing details. */
export async function installLicense(
	options: InstallLicenseOptions,
): Promise<void> {
	const { license } = options
	const projectPath = options.projectPath || './'

	const licenseText = licenses[normalizeLicenseKey(license)]
	const targetLicensePath = `${projectPath}/LICENSE`

	// Write LICENSE file
	const filledLicense = applyTemplatePlaceholders(licenseText)
	await Deno.writeTextFile(targetLicensePath, filledLicense + '\n')
	console.log(`✅ License written to ${targetLicensePath}`)
}

/** Convert User input into SPDX id */
function normalizeLicenseKey(input: string): string {
	const key = input.toLowerCase().replace(/[-_.]/g, '')

	switch (key) {
		case 'bsd':
		case 'bsd3':
		case 'bsd3clause':
			return 'BSD-3'
		case 'mit':
			return 'MIT'
		case 'hippocratic':
		case 'hippocratic21':
		case 'hippocraticv21':
		case 'hippocraticv2':
			return 'Hippocratic'
		case 'gpl':
		case 'gpl3':
		case 'gplv3':
		case 'gpl30':
		case 'gplv30':
			return 'GPL-3.0'
		case 'agpl':
		case 'agpl3':
		case 'agplv3':
		case 'agpl30':
		case 'agplv30':
			return 'AGPL-3.0'
		default:
			throw new Error(`Unrecognized license key: ${input}`)
	}
}

/** Replace tokens in license templates. Prompts User for additional details when tokens are found */
function applyTemplatePlaceholders(text: string): string {
	const year = new Date().getFullYear().toString()

	let owner: string | undefined
	let software: string | undefined

	const needsOwner = text.includes('<owner>') ||
		text.includes('<copyright holders>') ||
		text.includes('(COPYRIGHT HOLDER(S)/AUTHOR(S))')

	if (needsOwner) {
		owner = prompt('👤 Enter license holder name (e.g. your name or org):')
			?.trim()
		if (!owner || owner.length === 0) {
			owner = 'Anonymous'
		}
	}

	if (text.includes('[SOFTWARE NAME]')) {
		software = prompt('💾 Project or software name (optional):')?.trim() ||
			'this software'
	}

	return text
		.replace(/<year>/gi, year)
		.replace(/\(YEAR\)/gi, year)
		.replace(/<owner>/gi, owner || '')
		.replace(/<copyright holders>/gi, owner || '')
		.replace(/\(COPYRIGHT HOLDER\(S\)\/AUTHOR\(S\)\)/gi, `${owner || ''}`)
		.replace(/\[SOFTWARE NAME\]/gi, software || '')
}
