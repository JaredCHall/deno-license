import { assertRejects, assertStringIncludes } from '@std/assert'
import { FakeTime } from '@std/testing/time'
import { installLicense } from '../mod.ts'

new FakeTime('2023-05-01T00:00:00Z')

Deno.test(
	'installs BSD license',
	withExpectedPrompts([
		{ message: 'Enter license holder name', returnValue: 'Some Person' },
	], async () => {
		const tempDir = await Deno.makeTempDir()
		await installLicense({
			outputFile: `${tempDir}/LICENSE`,
			license: 'bsd3',
		})

		const licensePath = `${tempDir}/LICENSE`
		const license = await Deno.readTextFile(licensePath)

		assertStringIncludes(license, 'Copyright (c) 2023 Some Person.')
		assertStringIncludes(
			license,
			'THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"',
		)
	}),
)

Deno.test(
	'installs Hippocratic license',
	withExpectedPrompts([
		{ message: 'Enter license holder name', returnValue: 'Some Person' },
		{
			message: 'Project or software name (optional)',
			returnValue: 'This Software',
		},
	], async () => {
		const tempDir = await Deno.makeTempDir()
		await installLicense({
			outputFile: `${tempDir}/LICENSE`,
			license: 'Hippocratic',
		})

		const license = await Deno.readTextFile(`${tempDir}/LICENSE`)
		assertStringIncludes(license, 'Hippocratic License')
		assertStringIncludes(license, 'Some Person')
		assertStringIncludes(license, 'This Software')
	}),
)

Deno.test('installs GPL license', async () => {
	const tempDir = await Deno.makeTempDir()
	await installLicense({
		outputFile: `${tempDir}/LICENSE`,
		license: 'gpl3',
	})

	const license = await Deno.readTextFile(`${tempDir}/LICENSE`)
	assertStringIncludes(
		license,
		'GNU GENERAL PUBLIC LICENSE\nVersion 3, 29 June 2007',
	)
})

Deno.test('installs AGPL license', async () => {
	const tempDir = await Deno.makeTempDir()
	await installLicense({
		outputFile: `${tempDir}/LICENSE`,
		license: 'agpl3',
	})

	const license = await Deno.readTextFile(`${tempDir}/LICENSE`)
	assertStringIncludes(
		license,
		'GNU AFFERO GENERAL PUBLIC LICENSE\nVersion 3, 19 November 2007',
	)
})

Deno.test(
	'installs MIT license',
	withExpectedPrompts([
		{ message: 'Enter license holder name', returnValue: 'Some Person' },
	], async () => {
		const tempDir = await Deno.makeTempDir()
		await installLicense({
			outputFile: `${tempDir}/LICENSE`,
			license: 'MIT',
		})

		const licensePath = `${tempDir}/LICENSE`
		const license = await Deno.readTextFile(licensePath)

		assertStringIncludes(license, 'MIT License')
		assertStringIncludes(license, 'Copyright (c) 2023 Some Person')
	}),
)

Deno.test('throws on invalid license key', async () => {
	const tempDir = await Deno.makeTempDir()

	await assertRejects(
		() =>
			installLicense({
				outputFile: `${tempDir}/LICENSE`,
				license: 'InvalidLicense',
			}),
		Error,
		'License not found',
	)
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

function withExpectedPrompts(
	prompts: ExpectedPrompt[],
	testFn: () => Promise<void>,
) {
	return async () => {
		const restore = expectPromptChain(prompts)
		try {
			await testFn()
		} finally {
			restore()
		}
	}
}
