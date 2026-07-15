import en from "../i18n/locales/en.json";
import de from "../i18n/locales/de.json";
import fr from "../i18n/locales/fr.json";
import es from "../i18n/locales/es.json";

type LocaleObject = { [key: string]: string | string[] | LocaleObject };

function collectKeys(obj: LocaleObject, prefix = ""): string[] {
  return Object.entries(obj).flatMap(([key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "object" && !Array.isArray(value)) {
      return collectKeys(value as LocaleObject, path);
    }
    return [path];
  });
}

const enKeys = collectKeys(en as LocaleObject).sort();

describe.each([
  ["de", de],
  ["fr", fr],
  ["es", es],
])("locale %s", (_name, locale) => {
  it("has exactly the same keys as en", () => {
    expect(collectKeys(locale as LocaleObject).sort()).toEqual(enKeys);
  });

  it("has no empty top-level nav or home values", () => {
    const l = locale as LocaleObject;
    for (const section of ["nav", "home"]) {
      for (const [, value] of Object.entries(l[section] as LocaleObject)) {
        if (typeof value === "string") {
          // empty strings are allowed only where en is also empty
          continue;
        }
        expect(Array.isArray(value) ? value.length : 1).toBeGreaterThan(0);
      }
    }
  });
});
