import { Box, Stack, Typography, Button } from "@mui/material";
import UploadIcon from "@mui/icons-material/Upload";
import CollectionsIcon from "@mui/icons-material/Style";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per mostra il marchio e l’accesso all’importazione.
 */
type AppHeaderProps = Readonly<Pick<AlbumManager, "openImport">>;

/**
 * Mostra il marchio e l’accesso all’importazione.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function AppHeader(props: AppHeaderProps) {
  const { openImport } = props;
  return (
    <Box
      component="header"
      sx={{
        height: { xs: 68, sm: 84 },
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 2.25, sm: 5.25 },
        bgcolor: "background.paper",
        borderBottom: 1,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          fontSize: { xs: 25, sm: 29 },
          fontWeight: 800,
          letterSpacing: -1.4,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Box
          component="span"
          sx={{
            display: "grid",
            placeItems: "center",
            bgcolor: "primary.main",
            color: "primary.contrastText",
            width: 36,
            height: 36,
            borderRadius: "11px",
            transform: "rotate(-9deg)",
            mr: 1.5,
          }}
        >
          <CollectionsIcon />
        </Box>
        figurine
        <Box component="span" sx={{ color: "secondary.main" }}>
          .
        </Box>
      </Box>
      <Stack direction="row" sx={{ alignItems: "center", gap: { xs: 0, sm: 3.5 } }}>
        <Typography
          variant="caption"
          sx={{ display: { xs: "none", sm: "inline" }, fontSize: 12, color: "text.secondary" }}
        >
          ● Tutto sul tuo dispositivo
        </Typography>
        <Button startIcon={<UploadIcon />} onClick={openImport}>
          Importa
        </Button>
      </Stack>
    </Box>
  );
}
