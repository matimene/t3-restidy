import { type NextRouter, useRouter } from "next/router";

const LANGS = {
  en: "En",
  es: "Es",
};

function isKeyInObject<T extends Record<string, unknown>>(
  obj: T,
  key: string | number | symbol
): key is keyof T {
  return obj[key as keyof typeof obj] !== undefined;
}

const getKeyValue =
  <U extends keyof T, T extends Record<string, unknown>>(key: U) =>
  (obj: T) =>
    obj[key];

export function getFieldTranslation<Type extends Record<string, unknown>>(
  item: Type,
  field: string,
  router: NextRouter
) {
  const lang = (router.query.lang as string) ?? "en";
  const translatedKey = `${field}${
    isKeyInObject(LANGS, lang) ? LANGS[lang] : ""
  }`;

  const translatedField = getKeyValue<keyof Type, Type>(translatedKey)(
    item
  ) as string;
  return translatedField ?? "";
}

export default function useFieldTranslation<
  Type extends Record<string, unknown>
>(item: Type, field: string) {
  const router = useRouter();
  const lang = (router.query.lang as string) ?? "en";
  const translatedKey = `${field}${
    isKeyInObject(LANGS, lang) ? LANGS[lang] : ""
  }`;

  const translatedField = getKeyValue<keyof Type, Type>(translatedKey)(
    item
  ) as string;
  return translatedField ?? "";
}
