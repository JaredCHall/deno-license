import { assertEquals, assertRejects } from '@std/assert'
import { fetchLicenses, type LicenseSource } from '../scripts/fetch.ts'

Deno.test('fetchLicenses trims license text and returns correct structure', async () => {
	const mockFetch = (url: string): Promise<Response> => {
		const text = `  License for ${url}  \n\n\n`
		return Promise.resolve(new Response(text, { status: 200 }))
	}

	globalThis.fetch = mockFetch as typeof fetch

	const sources: LicenseSource[] = [
		{ name: 'BSD-3', url: 'https://example.com/bsd' },
		{ name: 'MIT', url: 'https://example.com/mit' },
	]

	const result = await fetchLicenses(sources)

	assertEquals(result['BSD-3'], 'License for https://example.com/bsd')
	assertEquals(result['MIT'], 'License for https://example.com/mit')
})

Deno.test('fetchLicenses throws on failed fetch', async () => {
	globalThis.fetch = (() =>
		Promise.resolve(
			new Response(null, { status: 404 }),
		)) as typeof fetch

	await assertRejects(
		() => fetchLicenses([{ name: 'MIT', url: 'https://fail.example.com' }]),
		Error,
		'Failed to fetch MIT',
	)
})
