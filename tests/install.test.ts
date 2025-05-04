import { assertStringIncludes } from "@std/assert"
import { installWithPrompts } from "../src/install.ts"
import type { LicenseRegistry} from "../src/LicenseRegistry.ts";

Deno.test("installWithPrompts installs license with mocked registry", async () => {
	const tempDir = await Deno.makeTempDir()

	//@ts-ignore - mock
	const mockRegistry: LicenseRegistry = {
		has: () => true,
		expectedMappings: () => ["year", "owner"],
		fetch: (lic: string, year: string, owner: string) =>
				`License: ${lic}\nYear: ${year}\nOwner: ${owner}`,
	}

	try {
		withExpectedPrompts([],async () => {
			await installWithPrompts(`${tempDir}/LICENSE.txt`, mockRegistry)

			const writtenText = await Deno.readTextFile(`${tempDir}/LICENSE.txt`)

			assertStringIncludes(writtenText, "License: mit")
			assertStringIncludes(writtenText, "Year: 2024")
			assertStringIncludes(writtenText, "Owner: Ada Lovelace")
		})

	} finally {
		await Deno.remove(tempDir, { recursive: true})
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
