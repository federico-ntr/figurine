import { AlbumStat } from "./AlbumStat";
import { Box, Stack, Typography, Paper, LinearProgress } from "@mui/material";
import type { Album } from "../data";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per mostra completamento, figurine mancanti e doppioni.
 */
type AlbumOverviewProps = Readonly<
  Pick<AlbumManager, "pct" | "owned" | "copies"> & { album: Album }
>;

/**
 * Mostra completamento, figurine mancanti e doppioni.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function AlbumOverview(props: AlbumOverviewProps) {
  const { album, pct, owned, copies } = props;
  return (
    <Paper
      component="section"
      variant="outlined"
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(3, 1fr)", md: "1.5fr 1fr 1fr 1fr" },
        py: { xs: 2.5, sm: 3.125 },
        mb: 3.25,
      }}
    >
      <Box
        sx={{
          px: { xs: 2.25, sm: 3.125 },
          gridColumn: { xs: "1 / -1", md: "auto" },
          mb: { xs: 2.5, md: 0 },
        }}
      >
        <Typography variant="overline">LA COLLEZIONE PRENDE FORMA</Typography>
        <Stack direction="row" sx={{ alignItems: "baseline", gap: 0.875, mt: 1, mb: 1.75 }}>
          <Typography component="span" sx={{ fontSize: 42, fontWeight: 750, letterSpacing: -1.5 }}>
            {pct}
          </Typography>
          <Typography variant="caption" sx={{ fontSize: 11 }}>
            % completato
          </Typography>
          <Typography
            component="span"
            sx={{ fontSize: 40, color: "secondary.main", ml: "auto", lineHeight: 1 }}
          >
            ✧
          </Typography>
        </Stack>
        <LinearProgress
          variant="determinate"
          value={pct}
          aria-label="Completamento collezione"
          sx={{ height: 8, borderRadius: "10px", bgcolor: "primary.light" }}
        />
        <Typography variant="body2" sx={{ fontSize: 11, mb: 0 }}>
          {owned === album.total
            ? "Album completo. Che soddisfazione!"
            : `Ancora ${album.total - owned} figurine e ci sei.`}
        </Typography>
      </Box>
      <AlbumStat
        label="Nell’album"
        value={owned}
        total={album.total}
        note="figurine diverse"
        first
      />
      <AlbumStat
        label="Da trovare"
        value={album.total - owned}
        note="il bello deve ancora venire"
      />
      <AlbumStat label="Doppioni" value={copies - owned} note="pronti per uno scambio" />
    </Paper>
  );
}
