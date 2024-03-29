/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.mjs");

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,

  /**
   * If you have `experimental: { appDir: true }` set, then you must comment the below `i18n` config
   * out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["default", "en", "es"],
    defaultLocale: "default",
    localeDetection: false,
  },
  trailingSlash: true,
  experimental: {
    esmExternals: false, // Uploadthing will not work with this enabled.
  },
};
export default config;
