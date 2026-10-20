import { AlbumOverview } from "./AlbumOverview";
import { QuickEntry } from "./QuickEntry";
import { StickerGrid } from "./StickerGrid";
import { Box, Stack, Typography, Breadcrumbs, Button, IconButton, Tooltip } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import QrCodeIcon from "@mui/icons-material/QrCode2";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import type { Album } from "../data";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per compone la schermata della collezione attiva.
 */
type AlbumViewProps = Readonly<
  Pick<
    AlbumManager,
    | "exportFile"
    | "setModal"
    | "pct"
    | "owned"
    | "copies"
    | "submit"
    | "input"
    | "number"
    | "setNumber"
    | "notice"
    | "history"
    | "undo"
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
 * Compone la schermata della collezione attiva.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function AlbumView(props: AlbumViewProps) {
  const { album, exportFile, setModal } = props;
  return (
    <>
      <Breadcrumbs
        aria-label="Percorso"
        sx={{ fontSize: 11, color: "text.secondary", mb: { xs: 2.5, sm: 3.5 } }}
      >
        <Typography component="span" sx={{ fontSize: "inherit" }}>
          Le mie collezioni
        </Typography>
        <Typography component="span" sx={{ fontSize: "inherit", overflowWrap: "anywhere" }}>
          {album.name}
        </Typography>
      </Breadcrumbs>
      <Stack
        direction="row"

        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", md: "center" },
          gap: { xs: 1.25, sm: 2.5 },
          mb: { xs: 2.5, sm: 3.5 },
          flexWrap: { xs: "wrap", sm: "nowrap" },
        }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="overline">IL TUO ALBUM DIGITALE</Typography>
          <Typography variant="h1">{album.name}</Typography>
          <Typography variant="body2" sx={{ fontSize: { xs: 12, sm: 13 } }}>
            Ogni numero è un piccolo passo verso l’album completo.
          </Typography>
        </Box>
        <Stack
          direction="row"
          sx={{
            flexShrink: 0,
            gap: 0.625,
            alignItems: "center",
            flexWrap: { xs: "wrap", md: "nowrap" },
            justifyContent: { xs: "flex-start", sm: "flex-end" },
          }}
        >
          <Button size="small" startIcon={<SwapHorizIcon />} onClick={() => setModal("compare")}>
            Confronta
          </Button>
          <Tooltip title="Esporta collezione">
            <IconButton aria-label="Esporta collezione" onClick={() => exportFile()}>
              <DownloadIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Condividi con QR">
            <IconButton aria-label="Condividi con QR" onClick={() => setModal("qr")}>
              <QrCodeIcon />
            </IconButton>
          </Tooltip>
          <Button size="small" onClick={() => setModal("settings")}>
            Gestisci
          </Button>
        </Stack>
      </Stack>
      <AlbumOverview {...props} />
      <QuickEntry {...props} />
      <StickerGrid {...props} />
      <Stack
        component="footer"
        direction={{ xs: "column", sm: "row" }}

        sx={{
          justifyContent: "space-between",
          typography: "caption",
          mt: 3.125,
          gap: { xs: 0.75, sm: 1.875 },
        }}
      >
        Fatto per chi ama collezionare. <span>Salvataggio locale · Nessun account</span>
      </Stack>
    </>
  );
}
