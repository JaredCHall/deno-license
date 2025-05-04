import { installLicense } from "./src/install.ts";

export { installLicense };

if (import.meta.main) {
  const args = Deno.args;

  const licenseIndex = args.indexOf("--license");
  let licenseArg = args.at(licenseIndex + 1);
  if (!licenseArg) {
    licenseArg = prompt("📜 License (bsd, mit, gpl, agpl, hippocratic):","bsd")?.trim().toLowerCase();
  }

  if (!licenseArg) {
    console.error("❌ License is required.");
    Deno.exit(1);
  }

  const outputFileIndex = args.indexOf("--outputFile");
  const outputFileArg = args.at(outputFileIndex + 1);

  try {
    await installLicense({
      outputFile: outputFileArg ?? "LICENSE",
      license: licenseArg,
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(`💥 ${err.message}`);
    } else {
      console.error("💥💥 Unknown error occurred.");
    }
    Deno.exit(1);
  }
}