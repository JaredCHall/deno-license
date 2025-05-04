import {assertStringIncludes, assertEquals, assertThrows} from "@std/assert"
import { FakeTime } from "@std/testing/time"
import { LicenseRegistry } from "../src/LicenseRegistry.ts"

new FakeTime("2023-05-01T00:00:00Z")

Deno.test("fetch BSD license with placeholder replacements", () => {
  const reg = new LicenseRegistry()
  const text = reg.fetch("BSD-3", '2023', "Some Person")

  assertStringIncludes(text, "Copyright (c) 2023 Some Person.")
  assertStringIncludes(
      text,
      'THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"',
  )
})

Deno.test("fetch Hippocratic license with owner and software name", () => {
  const reg = new LicenseRegistry()
  const text = reg.fetch("Hippocratic", '2023', "Some Person", "This Software")

  assertStringIncludes(text, "Hippocratic License")
  assertStringIncludes(text, "Some Person")
  assertStringIncludes(text, "This Software")
})

Deno.test("fetch MIT license with default software name fallback", () => {
  const reg = new LicenseRegistry()
  const text = reg.fetch("MIT", '2023', "Some Person")

  assertStringIncludes(text, "MIT License")
  assertStringIncludes(text, "Copyright (c) 2023 Some Person")
})

Deno.test("rejects unknown license", () => {
  const reg = new LicenseRegistry()

  assertThrows(() => Promise.resolve(reg.fetch("UnknownLicense")), Error , "License not found")
})

Deno.test("has() returns true only for known licenses", () => {
  const reg = new LicenseRegistry()

  assertEquals(reg.has("BSD-3"), true)
  assertEquals(reg.has("GPL-3.0"), true)
  assertEquals(reg.has("Unknown"), false)
})

Deno.test("list() returns all available license keys", () => {
  const reg = new LicenseRegistry()
  const licenses = reg.list()

  // These should always exist in your `licenses.json`
  for (const key of ["BSD-3", "MIT", "GPL-3.0", "AGPL-3.0", "Hippocratic"]) {
    assertEquals(licenses.includes(key), true)
  }
})

Deno.test("expectedMappings returns correct placeholder keys", () => {
  const reg = new LicenseRegistry()

  assertEquals(reg.expectedMappings("MIT"), ["year", "owner"])
  assertEquals(reg.expectedMappings("BSD-3"), ["year", "owner"])
  assertEquals(reg.expectedMappings("GPL-3.0"), []) // no placeholders
  assertEquals(reg.expectedMappings("AGPL-3.0"), []) // no placeholders
  assertEquals(reg.expectedMappings("Hippocratic"), ["year", "softwareName", "owner"])
})
