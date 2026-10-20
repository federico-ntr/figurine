import { StickerCard } from "./StickerCard";
import {
  Box,
  Stack,
  Typography,
  Paper,
  Button,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import type { Album } from "../data";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per mostra le figurine con filtri, ricerca e caricamento progressivo.
 */
type StickerGridProps = Readonly<
  Pick<
    AlbumManager,
    | "filter"
    | "updateFilter"
    | "search"
    | "updateSearch"
    | "nums"
    | "page"
    | "setPage"
    | "setDetail"
    | "change"
  > & { album: Album }
>;

/**
 * Mostra le figurine con filtri, ricerca e caricamento progressivo.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function StickerGrid(props: StickerGridProps) {
  const {
    album,
    filter,
    updateFilter,
    search,
    updateSearch,
    nums,
    page,
    setPage,
    setDetail,
    change,
  } = props;
  return (
    <Paper component="section" variant="outlined" sx={{ p: { xs: "18px 14px", sm: 3.125 } }}>
      <Stack
        direction="row"
        sx={{ alignItems: "center", justifyContent: "space-between", mb: 2.875 }}
      >
        <Typography variant="h2" sx={{ m: 0 }}>
          Le figurine{" "}
          <Box
            component="span"
            sx={{
              fontSize: 11,
              color: "text.secondary",
              bgcolor: "action.hover",
              borderRadius: "5px",
              p: "3px 7px",
              ml: 1,
            }}
          >
            {album.total}
          </Box>
        </Typography>
      </Stack>
      <Typography variant="caption" component="p" sx={{ mb: 2 }}>
        Tocca + per aggiungere una copia, il numero per gestirle.
      </Typography>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          alignItems: { xs: "stretch", sm: "center" },
          justifyContent: "space-between",
          gap: 1.875,
        }}
      >
        <ToggleButtonGroup
          exclusive
          value={filter}
          onChange={(_, value) => updateFilter(value)}
          size="small"
          sx={{
            display: "flex",
            "& .MuiToggleButton-root": {
              flex: { xs: 1, sm: "initial" },
              px: { xs: 1, sm: 1.625 },
              py: { xs: 0.875, sm: 0.75 },
            },
          }}
        >
          <ToggleButton value="all">Tutte</ToggleButton>
          <ToggleButton value="missing">Mancanti</ToggleButton>
          <ToggleButton value="owned">Trovate</ToggleButton>
          <ToggleButton value="duplicates">Doppioni</ToggleButton>
        </ToggleButtonGroup>
        <TextField
          label="Cerca numero"
          value={search}
          onChange={(e) => updateSearch(e.target.value)}
          slotProps={{ htmlInput: { inputMode: "numeric" } }}
          sx={{ width: { xs: "100%", sm: 170 } }}
        />
      </Stack>
      <Stack direction="row" sx={{ gap: 2.25, mt: 3, mb: 2.25 }}>
        {(
          [
            { state: "found", label: "Trovata" },
            { state: "duplicate", label: "Doppione" },
            { state: "missing", label: "Da trovare" },
          ] as const
        ).map(({ state, label }) => (
          <Stack key={state} direction="row" sx={{ alignItems: "center", gap: 0.75 }}>
            <Box
              component="span"
              aria-hidden
              sx={{
                width: 7,
                height: 7,
                border: 1,
                borderRadius: "2px",
                bgcolor: `stickers.${state}.marker`,
                borderColor:
                  state === "missing" ? "stickers.missing.border" : `stickers.${state}.marker`,
              }}
            />
            <Typography variant="caption">{label}</Typography>
          </Stack>
        ))}
      </Stack>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "repeat(auto-fill, minmax(49px, 1fr))",
            sm: "repeat(auto-fill, minmax(61px, 1fr))",
          },
          gap: { xs: 1, sm: 1.25 },
        }}
      >
        {nums.slice(0, page * 200).map((n) => (
          <StickerCard
            key={n}
            number={n}
            count={album.counts[n] || 0}
            onSelect={setDetail}
            onAdd={(number) => change(number, 1)}
          />
        ))}
      </Box>
      {!nums.length && (
        <Typography variant="body2" sx={{ textAlign: "center", p: 3.75 }}>
          Nessuna figurina con questo filtro.
        </Typography>
      )}
      {nums.length > page * 200 && (
        <Button onClick={() => setPage(page + 1)} sx={{ mt: 2 }}>
          Mostra altre 200 ({nums.length - page * 200} rimanenti)
        </Button>
      )}
    </Paper>
  );
}
