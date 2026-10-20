import { Box, Button, ListItemButton, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DownloadIcon from "@mui/icons-material/Download";
import CollectionsIcon from "@mui/icons-material/Style";
import type { AlbumManager } from "../hooks/useAlbumManager";

/**
 * Proprietà necessarie per mostra le collezioni disponibili e il backup completo.
 */
type AlbumSidebarProps = Readonly<
  Pick<AlbumManager, "albums" | "album" | "selectAlbum" | "setModal" | "exportFile">
>;

/**
 * Mostra le collezioni disponibili e il backup completo.
 * @param props - Stato e azioni necessari a questa sezione.
 * @returns La sezione dell’interfaccia.
 */
export function AlbumSidebar(props: AlbumSidebarProps) {
  const { albums, album, selectAlbum, setModal, exportFile } = props;
  return (
    <Box
      component="aside"
      sx={{
        p: { xs: "17px 18px", sm: "35px 22px" },
        bgcolor: "background.paper",
        borderRightWidth: { xs: 0, sm: 1 },
        borderRightStyle: "solid",
        borderBottomWidth: { xs: 1, sm: 0 },
        borderBottomStyle: "solid",
        borderColor: "divider",
        display: "flex",
        flexDirection: "column",
        gap: { xs: 1.5, sm: 2.75 },
      }}
    >
      <Typography
        variant="overline"
        component="div"
        sx={{ display: { xs: "none", sm: "flex" }, justifyContent: "space-between" }}
      >
        IL TUO SCAFFALE{" "}
        <Box component="span" sx={{ letterSpacing: 0 }}>
          {albums.length}
        </Box>
      </Typography>
      <Box
        component="nav"
        aria-label="Collezioni"
        sx={{
          display: { xs: "flex", sm: "block" },
          gap: 1,
          overflowX: "auto",
          "&:empty": { display: "none" },
        }}
      >
        {albums.map((a, i) => (
          <ListItemButton
            key={a.id}
            selected={album?.id === a.id}
            onClick={() => selectAlbum(a.id)}
            sx={{
              gap: 1.5,
              borderRadius: "10px",
              p: { xs: 1, sm: "12px 10px" },
              mb: { xs: 0, sm: 0.75 },
              minWidth: { xs: 160, sm: 0 },
              maxWidth: { xs: 240, sm: "none" },
              width: { xs: "auto", sm: "100%" },
              flexShrink: 0,
              "&.Mui-selected": { color: "primary.main" },
            }}
          >
            <Box
              component="span"
              sx={{
                width: { xs: 26, sm: 34 },
                height: { xs: 32, sm: 43 },
                flexShrink: 0,
                bgcolor: (theme) => theme.palette.albumCovers[i % theme.palette.albumCovers.length],
                border: 2,
                borderColor: "background.paper",
                borderRadius: "4px",
                display: "grid",
                placeItems: "center",
                transform: "rotate(-6deg)",
              }}
            >
              <CollectionsIcon sx={{ fontSize: { xs: 18, sm: 24 } }} />
            </Box>
            <Box sx={{ minWidth: 0 }}>
              <Typography
                component="span"
                sx={{
                  display: "block",
                  fontSize: 13,
                  fontWeight: 650,
                  overflowWrap: "anywhere",
                  whiteSpace: { xs: "nowrap", sm: "normal" },
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                }}
              >
                {a.name}
              </Typography>
              <Typography
                variant="caption"
                component="span"
                sx={{ display: "block", fontSize: 11, mt: 0.625 }}
              >
                {Object.keys(a.counts).length} di {a.total} figurine
              </Typography>
            </Box>
          </ListItemButton>
        ))}
      </Box>
      <Button
        fullWidth
        startIcon={<AddIcon />}
        variant="outlined"
        onClick={() => setModal("create")}
        sx={{
          width: { xs: "auto", sm: "100%" },
          alignSelf: { xs: "flex-start", sm: "stretch" },
          borderWidth: { xs: 0, sm: 1 },
          fontSize: { xs: 12, sm: 14 },
          p: { xs: 0, sm: "5px 15px" },
        }}
      >
        Nuova collezione
      </Button>
      <Box sx={{ display: { xs: "none", sm: "block" }, mt: "auto", pt: 12.5 }}>
        <Typography component="span" sx={{ fontSize: 34, color: "secondary.main" }}>
          ✦
        </Typography>
        <Typography component="strong" sx={{ display: "block", fontSize: 12, fontWeight: 700 }}>
          Un pacchetto alla volta.
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 12 }}>
          Il tuo prossimo doppione potrebbe essere il pezzo che manca a qualcuno.
        </Typography>
        <Button
          size="small"
          startIcon={<DownloadIcon />}
          disabled={!albums.length}
          onClick={() => exportFile(true)}
        >
          Backup di tutte le collezioni
        </Button>
      </Box>
    </Box>
  );
}
