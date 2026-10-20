import { Typography } from "@mui/material";
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per raccoglie nome e dimensione di una nuova collezione.
 */
type CreateAlbumDialogProps = Readonly<
  Pick<AlbumManager, "modal" | "setModal" | "create" | "name" | "setName" | "total" | "setTotal">
>;

/**
 * Raccoglie nome e dimensione di una nuova collezione.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function CreateAlbumDialog(props: CreateAlbumDialogProps) {
  const { modal, setModal, create, name, setName, total, setTotal } = props;
  return (
    <Dialog open={modal === "create"} onClose={() => setModal("")} fullWidth maxWidth="xs">
      <form onSubmit={create}>
        <DialogTitle>Una nuova collezione</DialogTitle>
        <DialogContent>
          <Typography variant="body2">Come si chiama il tuo prossimo album?</Typography>
          <TextField
            autoFocus
            fullWidth
            label="Nome della collezione"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            slotProps={{ htmlInput: { maxLength: 100 } }}
            sx={{ my: 1 }}
          />
          <TextField
            fullWidth
            label="Numero totale di figurine"
            type="number"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            required
            slotProps={{ htmlInput: { min: 1, max: 10000, step: 1 } }}
            helperText="Numerazione da 1 al totale, fino a 10.000."
            sx={{ my: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModal("")}>Annulla</Button>
          <Button variant="contained" type="submit">
            Crea collezione
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
