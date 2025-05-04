export interface LicenseSource {
	name: string
	url: string
}

export async function fetchLicenses(
	sources: LicenseSource[],
): Promise<Record<string, string>> {
	const result: Record<string, string> = {}

	for (const { name, url } of sources) {
		const res = await fetch(url)
		if (!res.ok) {
			throw new Error(`Failed to fetch ${name}: ${res.statusText}`)
		}
		result[name] = (await res.text()).trim()
	}

	return result
}
