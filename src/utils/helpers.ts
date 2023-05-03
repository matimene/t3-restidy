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
}) {
  const locale = rawLocale
    .toLowerCase()
    .replace(/\w/, (firstLetter) => firstLetter.toUpperCase()) as Locales;

  const locales: LooseObject = {};

  keys.forEach((key) => {
    const localeKey = `${key}${locale}`;
    const translation = item[localeKey as keyof T] ?? "";
    locales[key] = translation;
  });

  return locales;
}

export { getProductLocaleProps };
