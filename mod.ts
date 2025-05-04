import { installWithPrompts } from "./src/install.ts";
import { LicenseRegistry } from "./src/LicenseRegistry.ts"

export { installWithPrompts };
export { LicenseRegistry };

if (import.meta.main) {
    await installWithPrompts('LICENSE.txt')
}