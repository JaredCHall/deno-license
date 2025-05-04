import rawLicenses from "./licenses.json" with { type: "json" }

type Token = { name: string; mapsTo: string }
function createToken(name: string, mapsTo?: string): Token {
  return { name: name, mapsTo: (mapsTo ?? name).replace(/[<>]/g, "") }
}

/** fetches cached licenses with placeholder replacements */
export class LicenseRegistry {
  private templates: Record<string, string> = rawLicenses
  /**
   * list placeholders in license templates mapped by license name
   *
   * this must be updated if license data changes
   */
  private templatePlaceHolders: Record<string, Token[]> = {
    "BSD-3": [createToken('<year>'), createToken('<owner>')],
    "MIT": [
      createToken('<year>'),
      createToken('<copyright holders>','<owner>')
    ],
    "GPL-3.0": [],
    "AGPL-3.0": [],
    "Hippocratic": [
      createToken('(YEAR)','<year>'),
      createToken('[SOFTWARE NAME]','<softwareName>'),
      createToken('(COPYRIGHT HOLDER(S)/AUTHOR(S))','<owner>'),
    ],
  }

  /** check if license exists in registry */
  public has(license: string): boolean {
    return this.templates[license] !== undefined
  }

  /** list available licenses */
  public list(): string[] {
    return Object.keys(this.templates)
  }

  /** list replacement values required to fetch license properly **/
  public expectedMappings(license: string): string[] {
    return this.templatePlaceHolders[license].map(({ mapsTo }) => mapsTo) ?? []
  }

  /** fetch license and replace common placeholders */
  public fetch(
      license: string,
      year: string = '????',
      owner: string = 'Anonymous',
      softwareName: string = 'This Software',
  ){

    const placeHolders = this.templatePlaceHolders[license] ?? []
    const replacementMap: Record<string, string> = {year, owner, softwareName}
    let text = this.templates[license] ?? null
    if(!text) throw new Error(`License not found for key: ${license}`)

    placeHolders.forEach(token => {
      const value = replacementMap[token.mapsTo] ?? null
      if(!value) throw new Error(`Missing replacement value for token: ${token.name} in license template: ${license}`)
      const escapedSearchPattern = token.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
      const re = new RegExp(escapedSearchPattern, "gi")
      text = text.replace(re, value)
    })

    return text
  }
}