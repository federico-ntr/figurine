import { Box, Stack, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CollectionsIcon from "@mui/icons-material/Style";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per invita a creare o importare la prima collezione.
 */
type EmptyStateProps = Readonly<Pick<AlbumManager, "setModal">>;

/**
 * Invita a creare o importare la prima collezione.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function EmptyState(props: EmptyStateProps) {
  const { setModal } = props;
  return (
    <Stack
      component="section"

      sx={{
        alignItems: "center",
        justifyContent: "center",
        minHeight: { xs: "65vh", sm: "75vh" },
        textAlign: "center",
      }}
    >
      <Box
        sx={{
          width: { xs: 100, sm: 130 },
          height: { xs: 110, sm: 140 },
          bgcolor: "primary.light",
          display: "grid",
          placeItems: "center",
          borderRadius: "20px",
          transform: "rotate(-8deg)",
          mb: 4.5,
          color: "secondary.main",
          fontSize: 26,
        }}
      >
        ✦<CollectionsIcon sx={{ fontSize: 65, color: "primary.main" }} />
      </Box>
      <Typography variant="overline">LE PICCOLE COSE, TUTTE AL LORO POSTO</Typography>
      <Typography variant="h1" sx={{ fontSize: { xs: 33, sm: 45 }, mt: 2 }}>
        Ogni collezione
        <br />
        comincia da una figurina.
      </Typography>
      <Typography variant="body2" sx={{ mb: 3.5 }}>
        Crea il tuo album, apri un pacchetto e tieni il conto.
        <br />
        Anche dei doppioni, naturalmente.
      </Typography>
      <Button
        variant="contained"
        size="large"
        startIcon={<AddIcon />}
        onClick={() => setModal("create")}
        sx={{ mb: 1.5 }}
      >
        Crea la prima collezione
      </Button>
      <Button onClick={() => setModal("import")} sx={{ mb: 1.5 }}>
        Ho già un backup da importare
      </Button>
    </Stack>
  );
}
