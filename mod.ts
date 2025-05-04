import { installLicense } from "./src/install.ts";

/**
 * Install a LICENSE file into the given project directory.
 *
 * @param options - The license options
 * @param options.projectPath - The target directory (defaults to '.')
 * @param options.license - The SPDX ID or string similar to the SPDX id (e.g., "MIT", "BSD", "gpl","GPL-3.0","gpl3")
 */
export { installLicense };

if (import.meta.main) {
  const args = Deno.args;

  const licenseIndex = args.indexOf("--license");
  let licenseArg = args.at(licenseIndex + 1);
  if (!licenseArg) {
    licenseArg = prompt("📜 License (bsd, mit, gpl, agpl, hippocratic):")?.trim().toLowerCase();
  }

  if (!licenseArg) {
    console.error("❌ License is required.");
    showUsage();
    Deno.exit(1);
  }

  try {
    await installLicense({
      projectPath: ".",
      license: licenseArg,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`💥 ${err.message}`);
    } else {
      console.error("💥 Unknown error occurred.");
    }
    Deno.exit(1);
  }
}

function showUsage() {
  console.log(`
Usage:
  deno run --allow-read --allow-write --allow-net mod.ts \\
    --license [bsd|mit|gpl|agpl|hippocratic]
`);
}