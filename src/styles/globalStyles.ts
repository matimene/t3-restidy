import { type MantineTheme } from "@mantine/core";

enum COLORS {
  primary,
  secondary,
  tertiary,
}

export const getColorTheme = (theme: MantineTheme, key: COLORS) => {
  const DEFAULT_COLORS = {
    [COLORS.primary]: theme.colors.gray[8],
    [COLORS.secondary]: theme.colors.yellow[5],
    [COLORS.tertiary]: theme.colors.violet[8],
  };

  return DEFAULT_COLORS[key];
};

const getCustomGlobalStyles = (theme: MantineTheme) => ({
  "*, *::before, *::after": {
    boxSizing: "border-box",
  },
  colorScheme: "light",
});

export default getCustomGlobalStyles;
