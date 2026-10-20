import {
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per consente l’esportazione e l’eliminazione della collezione attiva.
 */
type AlbumSettingsDialogProps = Readonly<
  Pick<AlbumManager, "modal" | "setModal" | "album" | "exportFile" | "deleteAlbum">
>;

/**
 * Consente l’esportazione e l’eliminazione della collezione attiva.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function AlbumSettingsDialog(props: AlbumSettingsDialogProps) {
  const { modal, setModal, album, exportFile, deleteAlbum } = props;
  return (
    <Dialog open={modal === "settings"} onClose={() => setModal("")} fullWidth maxWidth="xs">
      <DialogTitle>Gestisci collezione</DialogTitle>
      <DialogContent>
        <Typography variant="body2">Esporta una copia prima di eliminare la collezione.</Typography>
        <Button startIcon={<DownloadIcon />} onClick={() => exportFile()}>
          Esporta {album?.name}
        </Button>
        <Typography variant="body2">
          Eliminare «{album?.name}» da questo dispositivo? L’operazione non può essere annullata.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModal("")}>Chiudi</Button>
        <Button color="error" onClick={deleteAlbum}>
          Elimina collezione
        </Button>
      </DialogActions>
    </Dialog>
  );
}
