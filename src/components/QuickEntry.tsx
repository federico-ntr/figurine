import { Box, Stack, Typography, Paper, Button, TextField } from "@mui/material";
import ArrowIcon from "@mui/icons-material/ArrowForward";
import UndoIcon from "@mui/icons-material/Undo";
import type { Album } from "../data";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per permette inserimenti rapidi e l’annullamento dell’ultimo inserimento.
 */
type QuickEntryProps = Readonly<
  Pick<
    AlbumManager,
    "submit" | "input" | "number" | "setNumber" | "notice" | "history" | "undo"
  > & { album: Album }
>;

/**
 * Permette inserimenti rapidi e l’annullamento dell’ultimo inserimento.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function QuickEntry(props: QuickEntryProps) {
  const { album, submit, input, number, setNumber, notice, history, undo } = props;
  return (
    <Paper
      component="section"
      variant="outlined"
      sx={{
        bgcolor: "primary.light",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { xs: "stretch", md: "center" },
        justifyContent: "space-between",
        gap: { xs: 1.875, md: 3.125 },
        p: { xs: 2.5, sm: "25px 28px" },
        mb: { xs: 2.75, sm: 4.5 },
      }}
    >
      <Box>
        <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 1.5 }}>
          ✦ MODALITÀ SBUSTO
        </Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: 19, sm: 18 } }}>
          Apri. Digita. Invio. Ripeti.
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 11 }}>
          Un numero alla volta, senza perdere il ritmo.
        </Typography>
      </Box>
      <Box sx={{ width: { xs: "100%", md: "47%" }, minWidth: { xs: 0, md: 300 } }}>
        <Stack component="form" direction="row" onSubmit={submit} sx={{ gap: { xs: 1, sm: 1.25 } }}>
          <TextField
            inputRef={input}
            label="Numero figurina"
            value={number}
            onChange={(e) => setNumber(e.target.value)}
            slotProps={{
              htmlInput: { inputMode: "numeric", pattern: "[0-9]*", autoComplete: "off" },
            }}
            sx={{ bgcolor: "background.paper", borderRadius: 2, flex: 1, minWidth: 0 }}
          />
          <Button
            type="submit"
            variant="contained"
            endIcon={<ArrowIcon />}
            sx={{ fontSize: { xs: 12, sm: 14 } }}
          >
            Aggiungi
          </Button>
        </Stack>
        <Box
          role="status"
          sx={{
            fontSize: 10,
            color: "primary.main",
            minHeight: 32,
            pt: 1,
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          {notice || `Numeri da 1 a ${album.total}. I doppioni vengono contati automaticamente.`}
          {history.length > 0 && (
            <Button
              size="small"
              startIcon={<UndoIcon />}
              onClick={undo}
              sx={{ fontSize: 10, p: "0 4px" }}
            >
              Annulla ultimo
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
}
