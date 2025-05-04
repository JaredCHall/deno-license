# deno-license

[![deno module](https://img.shields.io/badge/deno%20module-jsr:@jaredhall/deno--license-blue?logo=deno)](https://jsr.io/@jaredhall/deno-license)
[![CI](https://github.com/JaredCHall/deno-license/actions/workflows/ci.yml/badge.svg)](https://github.com/JaredCHall/deno-license/actions/workflows/ci.yml)

**OSI-compliant license scaffolding for Deno projects.**  

This tool helps you apply consistent, open-source licenses to your libraries or applications—quickly and correctly.

- 100% TypeScript / Zero Dependencies


## Quick Setup

### `deno run --allow-write jsr:jaredhall/deno-license`

- Run the utility from your project root
- You will be prompted for required information

```bash
deno run --allow-write jsr:jaredhall/deno-license
📜 License (bsd, mit, gpl, agpl, hippocratic): BSD # input is case-insensitive
👤 Enter license holder name (e.g. your name or org): Somebody Somewhere
✅ License written to ./LICENSE
```

## Use as a Module

You may also want to use the module programmatically in your Deno tooling.

```ts
import { installLicense } from "jsr:jaredhall/deno-license";

await installLicense({
  projectPath: "./my-project",
  type: "library",
  license: "MIT",
});
```

---

## License Strategy

This tool encourages clear, responsible licensing for all projects—whether you're building a small utility or a full-stack product.

- Permissive Licenses: [`BSD-3-Clause`](https://spdx.org/licenses/BSD-3-Clause.html), [`MIT`](https://spdx.org/licenses/MIT.html)
- Copyleft Licenses: [`GPL-3.0`](https://spdx.org/licenses/GPL-3.0-only.html), [`AGPL-3.0`](https://spdx.org/licenses/AGPL-3.0-only.html)

### Hippocratic License

While OSI licenses are best for libraries and tools, you’re encouraged to consider [`Hippocratic License v2.1`](https://firstdonoharm.dev/version/2/1/license/) for application software with potential for misuse—it enforces alignment with the UN Universal Declaration of Human Rights.

## 🕊️ Ethical Use (Non-Binding)

While this project is licensed under a permissive open-source license, we ask that you do not use it for harm.

Please avoid using this software in:
- Surveillance or censorship systems
- Military or policing applications

We can’t stop you. But we can ask. Choose wisely.
