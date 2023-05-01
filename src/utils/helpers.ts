type Locales = "En" | "Es";

interface LooseObject {
  [key: string]: any;
}

function getProductLocaleProps<T>({
  locale: rawLocale = "en",
  item,
  keys,
}: {
  locale?: string;
  item: T;
  keys: string[];
}): LooseObject {
  const locale = rawLocale
    .toLowerCase()
    .replace(/\w/, (firstLetter) => firstLetter.toUpperCase()) as Locales;

  const locales = {};
  keys.forEach((key) => {
    // @ts-ignore: Unreachable code error
    const localeKey = `${key}${locale}`;
    // @ts-ignore: Unreachable code error
    locales[key] = item[localeKey] ?? "";
  });

  return locales;
}

export { getProductLocaleProps };
