import { useRef, useState, type ChangeEvent } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import { compareAlbums, decode, type Album } from "../data";

/**
 * Confronta un export esterno senza importarlo nelle collezioni salvate.
 * @param props - Collezione attiva e azione di chiusura.
 * @returns La finestra di confronto con i doppioni utili in entrambe le direzioni.
 */
export function CompareAlbumDialog({
  album,
  onClose,
}: Readonly<{ album: Album; onClose: () => void }>) {
  const [text, setText] = useState("");
  const [albums, setAlbums] = useState<Album[]>([]);
  const [selected, setSelected] = useState("");
  const [error, setError] = useState("");
  const file = useRef<HTMLInputElement>(null);
  const friend = selected === "" ? undefined : albums[Number(selected)];
  const compatible = friend?.total === album.total;
  const result = friend && compatible ? compareAlbums(album, friend) : null;

  /**
   * Valida il contenuto e seleziona automaticamente l’album solo se è l’unico compatibile.
   * @param value - Backup JSON o codice FIG1 dell’amico.
   */
  function read(value: string) {
    setAlbums([]);
    setSelected("");
    setError("");
    try {
      const next = decode(value.trim());
      if (!next.length) throw Error("Il file non contiene collezioni.");
      setAlbums(next);
      const matches = next.map((a, i) => (a.total === album.total ? i : -1)).filter((i) => i >= 0);
      if (matches.length === 1) setSelected(String(matches[0]));
    } catch {
      setError(
        "Impossibile leggere l’export. Scegli un backup JSON valido o un codice FIG1 completo.",
      );
    }
  }

  /**
   * Legge un file locale e gestisce dimensioni e possibili errori di lettura.
   * @param event - Selezione del file dell’amico.
   */
  async function readFile(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const chosen = target.files?.[0];
    target.value = "";
    if (!chosen) return;
    setAlbums([]);
    setSelected("");
    try {
      if (chosen.size > 5000000) throw Error("File troppo grande (massimo 5 MB).");
      read(await chosen.text());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Impossibile leggere il file.");
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="md" aria-labelledby="compare-title">
      <DialogTitle id="compare-title">Confronta e organizza gli scambi</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5}>
          <Typography variant="body2">
            Stai confrontando «{album.name}» ({album.total} figurine). Carica l’export dell’amico
            oppure incolla il suo JSON o codice FIG1. Il confronto avviene sul dispositivo e non
            modifica né salva le collezioni.
          </Typography>
          <input
            ref={file}
            type="file"
            accept=".json,application/json"
            hidden
            onChange={readFile}
          />
          <Button
            variant="outlined"
            startIcon={<UploadIcon />}
            onClick={() => file.current?.click()}
          >
            Scegli export dell’amico
          </Button>
          <TextField
            multiline
            minRows={3}
            fullWidth
            label="JSON o codice FIG1 dell’amico"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Button variant="contained" disabled={!text.trim()} onClick={() => read(text)}>
            Confronta codice
          </Button>
          {error && <Alert severity="error">{error}</Alert>}
          {albums.length > 0 && (
            <>
              <TextField
                select
                fullWidth
                label="Collezione dell’amico"
                value={selected}
                onChange={(e) => setSelected(e.target.value)}
                helperText="Scegli lo stesso album e la stessa edizione: il totale uguale non garantisce che le figurine corrispondano."
              >
                <MenuItem value="">Scegli una collezione</MenuItem>
                {albums.map((a, i) => (
                  <MenuItem key={i} value={String(i)}>
                    {a.name} · {a.total} figurine
                  </MenuItem>
                ))}
              </TextField>
              {friend && !compatible && (
                <Alert severity="warning">
                  Gli album hanno un numero totale di figurine diverso ({album.total} e{" "}
                  {friend.total}). Seleziona una collezione con la stessa numerazione per
                  confrontarli.
                </Alert>
              )}
            </>
          )}
          {result && (
            <>
              <Alert severity={result.swaps ? "success" : "info"}>
                {result.swaps
                  ? `Potete fare fino a ${result.swaps} ${result.swaps === 1 ? "scambio" : "scambi"} uno a uno: scegliete altrettanti numeri da ciascuna lista.`
                  : "Al momento non ci sono scambi uno a uno possibili."}{" "}
                Ogni numero indica una sola copia da scambiare; ciascuno conserva la propria.
              </Alert>
              <Box
                sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 3 }}
              >
                <TradeList
                  title="Puoi dare"
                  numbers={result.give}
                  empty="Non hai doppioni che mancano all’amico."
                />
                <TradeList
                  title="Puoi ricevere"
                  numbers={result.receive}
                  empty="L’amico non ha doppioni che ti mancano."
                />
              </Box>
              <Typography variant="caption">
                Il confronto usa le quantità presenti nell’export. Dopo lo scambio, aggiornate le
                copie nei vostri album.
              </Typography>
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Chiudi</Button>
      </DialogActions>
    </Dialog>
  );
}

/**
 * Mostra i numeri scambiabili in ordine crescente, con un messaggio per la lista vuota.
 * @param props - Titolo, numeri utili e messaggio di assenza.
 * @returns Un elenco leggibile anche su schermi piccoli.
 */
function TradeList({
  title,
  numbers,
  empty,
}: Readonly<{ title: string; numbers: number[]; empty: string }>) {
  return (
    <Box component="section" aria-label={title}>
      <Typography variant="h6">
        {title} · {numbers.length}
      </Typography>
      {numbers.length ? (
        <Box
          component="ul"
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            pl: 0,
            listStyle: "none",
            maxHeight: 280,
            overflowY: "auto",
          }}
        >
          {numbers.map((n) => (
            <Box component="li" key={n}>
              <Chip label={`#${n}`} />
            </Box>
          ))}
        </Box>
      ) : (
        <Typography variant="body2">{empty}</Typography>
      )}
    </Box>
  );
}
