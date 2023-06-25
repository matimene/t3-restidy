import { type NextRouter, useRouter } from "next/router";
import useStore from "../zustand-store";
import messagesEn from "../../../public/locales/en.json";
import messagesEs from "../../../public/locales/es.json";

const NAME_LANGS = {
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

const getKeyValueString =
  <U extends keyof T, T extends Record<string, string>>(key: U) =>
  (obj: T) =>
    obj[key];

// export function getFieldTranslation<Type extends Record<string, unknown>>(
//   item: Type,
//   field: string,
//   router: NextRouter
// ) {
//   const lang = (router.query.lang as string) ?? "en";
//   const translatedKey = `${field}${
//     isKeyInObject(NAME_LANGS, lang) ? NAME_LANGS[lang] : ""
//   }`;

//   const translatedField = getKeyValue<keyof Type, Type>(translatedKey)(
//     item
//   ) as string;
//   return translatedField ?? "";
// }

export default function useFieldTranslation<
  Type extends Record<string, unknown>
>() {
  // const lang = (router.query.lang as string) ?? "en";
  const lang = useStore((state) => state.lang);

  const toLocale = (item: Type, field: string) => {
    const translatedKey = `${field}${
      isKeyInObject(NAME_LANGS, lang) ? NAME_LANGS[lang] : ""
    }`;
    return (getKeyValue<keyof Type, Type>(translatedKey)(item) as string) ?? "";
  };

  const t = (key: string) =>
    lang === "en"
      ? (getKeyValueString(key)(messagesEn) as string)
      : (getKeyValueString(key)(messagesEs) as string);

  return { toLocale, t };
}
