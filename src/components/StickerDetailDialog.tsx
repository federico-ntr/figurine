import {
  Typography,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per mostra e modifica il numero di copie di una figurina.
 */
type StickerDetailDialogProps = Readonly<
  Pick<AlbumManager, "detail" | "setDetail" | "album" | "change" | "removeCopy">
>;

/**
 * Mostra e modifica il numero di copie di una figurina.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function StickerDetailDialog(props: StickerDetailDialogProps) {
  const { detail, setDetail, album, change, removeCopy } = props;
  return (
    <Dialog open={detail !== null} onClose={() => setDetail(null)} fullWidth maxWidth="xs">
      <DialogTitle>Figurina #{detail}</DialogTitle>
      <DialogContent>
        <Typography variant="body2">
          {(detail && album?.counts[detail]) || 0} copie nella tua collezione
        </Typography>
        <Stack direction="row" useFlexGap sx={{ flexWrap: "wrap", gap: 1.5 }}>
          <Button
            variant="outlined"
            startIcon={<RemoveIcon />}
            disabled={!detail || !album?.counts[detail]}
            onClick={removeCopy}
          >
            Rimuovi copia
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => detail && change(detail, 1)}
          >
            Aggiungi copia
          </Button>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setDetail(null)}>Fatto</Button>
      </DialogActions>
    </Dialog>
  );
}
