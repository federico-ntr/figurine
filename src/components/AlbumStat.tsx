import { Stack, Typography } from "@mui/material";

/** Valore e descrizioni di una statistica della collezione. */
interface AlbumStatProps {
  readonly label: string;
  readonly value: number;
  readonly total?: number;
  readonly note: string;
  readonly first?: boolean;
}

/**
 * Presenta una statistica con lo stesso layout nei tre riepiloghi dell’album.
 * @param props - Valore, etichette e posizione nel riepilogo.
 * @returns Il riquadro della statistica.
 */
export function AlbumStat({ label, value, total, note, first = false }: AlbumStatProps) {
  return (
    <Stack
      sx={{
        borderLeftWidth: { xs: first ? 0 : 1, md: 1 },
        borderLeftStyle: "solid",
        borderColor: "divider",
        px: { xs: 1.5, sm: 2.25, md: 3 },
        py: { xs: 0.5, sm: 1.25, md: 1 },
        justifyContent: "center",
        gap: { xs: 1, sm: 1.5 },
        minWidth: 0,
      }}
    >
      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>{label}</Typography>
      <Typography
        component="strong"
        sx={{ fontSize: { xs: 28, sm: 35 }, fontWeight: 650, letterSpacing: -1 }}
      >
        {value}
        {total !== undefined && (
          <Typography
            component="span"
            sx={{ fontSize: 13, color: "text.disabled", fontWeight: 400, letterSpacing: 0 }}
          >
            {" "}
            / {total}
          </Typography>
        )}
      </Typography>
      <Typography variant="caption" sx={{ fontSize: { xs: 9, sm: 10 }, lineHeight: 1.5 }}>
        {note}
      </Typography>
    </Stack>
  );
}
