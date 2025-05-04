import rawLicenses from "./licenses.json" with { type: "json" }

const licenses: Record<string, string> = rawLicenses

/** Options for installing a software license. */
export interface InstallLicenseOptions {
	/** The SPDX ID or string similar to the SPDX id (e.g., "MIT", "BSD", "gpl","GPL-3.0","gpl3") */
	license: string
	/** where output is written. defaults to LICENSE within the working directory */
	outputFile?: string
}

/** Install a LICENSE file into the given project directory. Prompts User for licensing details. */
export async function installLicense(
		options: InstallLicenseOptions,
): Promise<void> {
	const { license } = options

	const key = normalizeLicenseKey(license)
	const licenseText = licenses[key]

	if (!licenseText) {
		throw new Error(`License not found for key: ${key}`)
	}

	const filled = applyTemplatePlaceholders(licenseText)
	const outputPath = options.outputFile ?? 'LICENSE'

	await Deno.writeTextFile(outputPath, filled + "\n")
	console.log(`✅ License written to ${outputPath}`)
}

/** Convert user input into SPDX-like id */
function normalizeLicenseKey(input: string): string {
	const key = input.toLowerCase().replace(/[-_.]/g, "")
	const map: Record<string, string> = {
		bsd: "BSD-3",
		bsd3: "BSD-3",
		bsd3clause: "BSD-3",
		mit: "MIT",
		hippocratic: "Hippocratic",
		hippocratic21: "Hippocratic",
		hippocraticv21: "Hippocratic",
		hippocraticv2: "Hippocratic",
		gpl: "GPL-3.0",
		gpl3: "GPL-3.0",
		gplv3: "GPL-3.0",
		gpl30: "GPL-3.0",
		gplv30: "GPL-3.0",
		agpl: "AGPL-3.0",
		agpl3: "AGPL-3.0",
		agplv3: "AGPL-3.0",
		agpl30: "AGPL-3.0",
		agplv30: "AGPL-3.0",
	}
	return map[key] ?? input // fallback to raw input (useful if added to `licenses.json`)
}

/** Replace tokens in license templates. Prompts user for missing data. */
function applyTemplatePlaceholders(text: string): string {
	const year = new Date().getFullYear().toString()

	let owner: string | undefined
	let software: string | undefined

	if (/<owner>|<copyright holders>|\(COPYRIGHT HOLDER\(S\)\/AUTHOR\(S\)\)/i.test(text)) {
		owner = prompt("👤 Enter license holder name (e.g. your name or org):")?.trim()
		if (!owner) owner = "Anonymous"
	}

	if (/\[SOFTWARE NAME\]/.test(text)) {
		software = prompt("💾 Project or software name (optional):")?.trim() || "this software"
	}

	return replacePlaceholders(text, {
		"<year>": year,
		"(YEAR)": year,
		"<owner>": owner,
		"<copyright holders>": owner,
		"(COPYRIGHT HOLDER(S)/AUTHOR(S))": owner,
		"[SOFTWARE NAME]": software,
	})
}

/** Replaces all placeholders in the text with values provided. */
function replacePlaceholders(
		text: string,
		values: Record<string, string | undefined>,
): string {
	for (const [pattern, value] of Object.entries(values)) {
		if (value === undefined) continue
		const escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
		const re = new RegExp(escaped, "gi")
		text = text.replace(re, value)
	}
	return text
}
