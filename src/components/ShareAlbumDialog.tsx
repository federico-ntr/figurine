import {
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  useTheme,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import { QRCode } from "react-qrcode-logo";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per condivide la collezione tramite QR o file JSON.
 */
type ShareAlbumDialogProps = Readonly<
  Pick<AlbumManager, "modal" | "setModal" | "qr" | "exportFile">
>;

/**
 * Condivide la collezione tramite QR o file JSON.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function ShareAlbumDialog(props: ShareAlbumDialogProps) {
  const { modal, setModal, qr, exportFile } = props;
  const theme = useTheme();
  return (
    <Dialog open={modal === "qr"} onClose={() => setModal("")} fullWidth maxWidth="xs">
      <DialogTitle>Un album da portare con te</DialogTitle>
      <DialogContent sx={{ textAlign: "center" }}>
        {qr.length <= 2200 ? (
          <>
            <Box
              role="img"
              aria-label="Codice QR della collezione da importare su un altro dispositivo"
              sx={{
                my: 2,
                mx: "auto",
                p: 1,
                width: "fit-content",
                maxWidth: "100%",
                bgcolor: "primary.light",
                border: 1,
                borderColor: "divider",
                borderRadius: 3,
                "& canvas": {
                  display: "block",
                  maxWidth: "100%",
                  height: "auto !important",
                  borderRadius: 2,
                },
              }}
            >
              <QRCode
                value={qr}
                size={240}
                quietZone={24}
                ecLevel="L"
                fgColor={theme.palette.primary.main}
                bgColor={theme.palette.background.paper}
                qrStyle="fluid"
                eyeRadius={4}
              />
            </Box>
            <Typography variant="body2">
              Il QR contiene la collezione, senza caricarla online. Sul secondo dispositivo leggilo
              con un lettore QR, copia il testo e incollalo in «Importa».
            </Typography>
          </>
        ) : (
          <Alert severity="info">
            Questa collezione è troppo grande per un singolo QR. Usa il file JSON.
          </Alert>
        )}
        <Button startIcon={<DownloadIcon />} onClick={() => exportFile()}>
          Esporta file JSON
        </Button>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => setModal("")}>Chiudi</Button>
      </DialogActions>
    </Dialog>
  );
}
