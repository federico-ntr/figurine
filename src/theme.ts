import { createTheme } from "@mui/material";

/** Stato visivo di una figurina nella collezione. */
export type StickerState = "found" | "duplicate" | "missing";

/** Colori semantici condivisi da figurine e legenda. */
interface StickerColors {
  background: string;
  border: string;
  text: string;
  marker: string;
}

declare module "@mui/material/styles" {
  interface Palette {
    stickers: Record<StickerState, StickerColors>;
    albumCovers: string[];
  }
  interface PaletteOptions {
    stickers?: Record<StickerState, StickerColors>;
    albumCovers?: string[];
  }
}

/** Tema condiviso: colori semantici, tipografia, breakpoint e impostazioni dei controlli. */
export const theme = createTheme({
  breakpoints: { values: { xs: 0, sm: 700, md: 1100, lg: 1200, xl: 1600 } },
  palette: {
    primary: { main: "#195540", light: "#eaf0df", dark: "#285b3c" },
    secondary: { main: "#cb6c3a", light: "#eab879" },
    background: { default: "#f7f7f2", paper: "#ffffff" },
    text: { primary: "#233a32", secondary: "#778276", disabled: "#929a8b" },
    divider: "#e5e8df",
    action: { selected: "#edf2e8", hover: "#f0f2e9", focus: "#e99b45" },
    stickers: {
      found: { background: "#edf4e9", border: "#c7dbc0", text: "#285b3c", marker: "#195540" },
      duplicate: { background: "#fff0db", border: "#efcf9f", text: "#976023", marker: "#eab879" },
      missing: { background: "#fcfdf9", border: "#dce1d4", text: "#a7b09c", marker: "transparent" },
    },
    albumCovers: ["#dbe4c4", "#f3d9b8", "#d8e3eb"],
  },
  typography: {
    fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
    h1: {
      fontSize: 38,
      lineHeight: 1.18,
      letterSpacing: -1.5,
      fontWeight: 750,
      overflowWrap: "anywhere",
      margin: "9px 0 12px",
      "@media (max-width:699.95px)": { fontSize: 30 },
    },
    h2: { fontSize: 18, letterSpacing: -0.5, fontWeight: 700, margin: "7px 0" },
    body2: { fontSize: 13, lineHeight: 1.7, color: "#778276", margin: "8px 0" },
    caption: { fontSize: 10, color: "#929a8b" },
    overline: {
      fontSize: 10,
      fontWeight: 750,
      letterSpacing: 1.7,
      color: "#839071",
      lineHeight: "normal",
      "@media (max-width:699.95px)": { fontSize: 9 },
    },
    button: { textTransform: "none", fontWeight: 650 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiCssBaseline: { styleOverrides: { ":root": { fontSynthesis: "none" } } },
    MuiButton: { defaultProps: { disableElevation: true } },
    MuiTextField: { defaultProps: { size: "small" } },
    MuiPaper: { styleOverrides: { outlined: { borderRadius: 16 } } },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: "none",
          fontSize: 11,
          padding: "6px 13px",
          borderColor: theme.palette.divider,
          "&.Mui-selected": {
            backgroundColor: theme.palette.action.selected,
            color: theme.palette.primary.main,
            "&:hover": { backgroundColor: theme.palette.action.hover },
          },
        }),
      },
    },
  },
});
