import { assertEquals, assertStringIncludes } from '@std/assert'
import { installWithPrompts } from '../src/install.ts'
import { LicenseRegistry } from '../src/LicenseRegistry.ts'

Deno.test('installWithPrompts installs license', async () => {
	const tempDir = await Deno.makeTempDir()
	const restorePrompts = expectPromptChain([
		{ message: 'License', returnValue: 'hippocratic' },
		{ message: 'Year of copyright', returnValue: '1840' },
		{ message: 'Project or software name', returnValue: 'Note G' },
		{ message: 'license holder', returnValue: 'Ada Lovelace' },
	])

	try {
		await installWithPrompts(`${tempDir}/LICENSE.txt`, new LicenseRegistry())

		const writtenText = await Deno.readTextFile(`${tempDir}/LICENSE.txt`)

		assertStringIncludes(writtenText, 'Hippocratic License')
		assertStringIncludes(writtenText, 'Note G Copyright 1840 Ada Lovelace')
	} finally {
		await Deno.remove(tempDir, { recursive: true })
		restorePrompts()
	}
})

Deno.test('installWithPrompts exits when license not found', {
	permissions: {
		write: false,
	},
}, async () => {
	const originalExit = Deno.exit
	Deno.exit = (code: number | undefined): never => {
		throw new Error(`Deno.exit(${code})`)
	}
	const restorePrompts = expectPromptChain([
		{ message: 'License', returnValue: 'unknown' },
	])

	try {
		await installWithPrompts(`SOME_FILE.txt`, new LicenseRegistry())
	} catch (err) {
		const msg = err instanceof Error ? err.message : ''
		assertEquals(msg, 'Deno.exit(1)')
	} finally {
		Deno.exit = originalExit
		restorePrompts()
	}
})

interface ExpectedPrompt {
	message: string
	returnValue: string | null
}

function expectPromptChain(prompts: ExpectedPrompt[]) {
	const originalPrompt = globalThis.prompt
	let promptIndex = 0

	globalThis.prompt = (msg: string | undefined) => {
		if (promptIndex >= prompts.length) {
			throw new Error(
				`Too many prompts: ${promptIndex + 1} > ${prompts.length}`,
			)
		}

		const expectedMessage = prompts[promptIndex].message
		const returnValue = prompts[promptIndex].returnValue
		promptIndex++

		if (!(msg ?? '').includes(expectedMessage)) {
			throw new Error(
				`Unexpected prompt at index ${promptIndex}:
Expected: "${expectedMessage}"
Received: "${msg}"
`,
			)
		}

		return returnValue
	}

	return () => {
		globalThis.prompt = originalPrompt
	}
}
