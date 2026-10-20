import { Typography } from "@mui/material";
import { useRef, type ChangeEvent } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per legge backup e codici QR e conferma l’importazione delle copie.
 */
type ImportAlbumDialogProps = Readonly<
  Pick<
    AlbumManager,
    | "modal"
    | "closeImport"
    | "pending"
    | "importText"
    | "setImportText"
    | "confirmImport"
    | "parse"
    | "setError"
  >
>;

/**
 * Legge backup e codici QR e conferma l’importazione delle copie.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function ImportAlbumDialog(props: ImportAlbumDialogProps) {
  const { modal, closeImport, pending, importText, setImportText, confirmImport, parse, setError } =
    props;
  const file = useRef<HTMLInputElement>(null);

  /**
   * Legge un backup locale entro il limite di 5 MB e ne prepara l’anteprima.
   * @param event - Selezione del file da importare.
   */
  async function readFile(event: ChangeEvent<HTMLInputElement>) {
    const target = event.target;
    const selectedFile = target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5000000) setError("File troppo grande (massimo 5 MB).");
      else parse(await selectedFile.text());
    }
    target.value = "";
  }
  return (
    <>
      <input ref={file} type="file" accept=".json,application/json" hidden onChange={readFile} />
      <Dialog open={modal === "import"} onClose={closeImport} fullWidth maxWidth="sm">
        <DialogTitle>Porta qui la tua collezione</DialogTitle>
        <DialogContent>
          {pending ? (
            <>
              <Alert severity="info">
                Importazione di {pending.length} collezioni. Verranno aggiunte come nuove copie,
                senza modificare quelle esistenti.
              </Alert>
              {pending.map((a, i) => (
                <Typography variant="body2" key={i}>
                  <strong>{a.name}</strong> · {Object.keys(a.counts).length}/{a.total} figurine
                </Typography>
              ))}
            </>
          ) : (
            <>
              <Typography variant="body2">
                Scegli il backup JSON oppure incolla il testo letto da un QR. Il trasferimento
                avviene interamente sul dispositivo.
              </Typography>
              <Button
                variant="outlined"
                startIcon={<UploadIcon />}
                onClick={() => file.current?.click()}
              >
                Scegli file JSON
              </Button>
              <TextField
                multiline
                minRows={4}
                fullWidth
                label="JSON o codice FIG1 del QR"
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                sx={{ mt: 3 }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeImport}>Annulla</Button>
          <Button
            variant="contained"
            disabled={!pending && !importText.trim()}
            onClick={confirmImport}
          >
            {pending ? "Conferma importazione" : "Leggi codice"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
