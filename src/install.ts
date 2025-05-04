import rawLicenses from './licenses.json' with { type: 'json' }

const licenses: Record<string, string> = rawLicenses

export interface InstallLicenseOptions {
	license: string
	projectPath?: string
}

export async function installLicense(
	options: InstallLicenseOptions,
): Promise<void> {
	const { license } = options
	const projectPath = options.projectPath || './'

	const licenseText = getLicenseText(normalizeLicenseKey(license))

	const targetLicensePath = `${projectPath}/LICENSE`

	// Write LICENSE file
	const filledLicense = applyTemplatePlaceholders(licenseText)
	await Deno.writeTextFile(targetLicensePath, filledLicense + '\n')
	console.log(`✅ License written to ${targetLicensePath}`)
}

function getLicenseText(license: string): string {
	return licenses[normalizeLicenseKey(license)]
}

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

function applyTemplatePlaceholders(text: string): string {
	const year = new Date().getFullYear().toString()

	let owner: string | undefined
	let software: string | undefined

	// Prompt only if required
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
