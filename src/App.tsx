import { Alert, Box } from "@mui/material";
import { useAlbumManager } from "./hooks/useAlbumManager";
import { AppHeader } from "./components/AppHeader";
import { AlbumSidebar } from "./components/AlbumSidebar";
import { EmptyState } from "./components/EmptyState";
import { AlbumView } from "./components/AlbumView";
import { CreateAlbumDialog } from "./components/CreateAlbumDialog";
import { ImportAlbumDialog } from "./components/ImportAlbumDialog";
import { ShareAlbumDialog } from "./components/ShareAlbumDialog";
import { StickerDetailDialog } from "./components/StickerDetailDialog";
import { AlbumSettingsDialog } from "./components/AlbumSettingsDialog";
import { CompareAlbumDialog } from "./components/CompareAlbumDialog";

/**
 * Collega la gestione degli album alle sezioni e alle finestre dell’interfaccia.
 * @returns L’applicazione completa per la gestione delle figurine.
 */
export function App() {
  const manager = useAlbumManager();
  return (
    <>
      <AppHeader openImport={manager.openImport} />
      <Box
        sx={{
          display: { xs: "flex", sm: "grid" },
          flexDirection: "column",
          gridTemplateColumns: { sm: "220px minmax(0, 1fr)", md: "260px minmax(0, 1fr)" },
          minHeight: { xs: "calc(100vh - 68px)", sm: "calc(100vh - 84px)" },
        }}
      >
        <AlbumSidebar {...manager} />
        <Box
          component="main"
          sx={{
            p: { xs: "22px 16px", sm: "25px", md: "32px 44px 20px", xl: "32px 65px 20px" },
            maxWidth: 1500,
            width: "100%",
            minWidth: 0,
            m: "auto",
          }}
        >
          {manager.error && (
            <Alert severity="error" onClose={() => manager.setError("")} sx={{ mb: 2 }}>
              {manager.error}
            </Alert>
          )}
          {manager.album ? (
            <AlbumView {...manager} album={manager.album} />
          ) : (
            <EmptyState setModal={manager.setModal} />
          )}
        </Box>
      </Box>
      <CreateAlbumDialog {...manager} />
      <ImportAlbumDialog {...manager} />
      <ShareAlbumDialog {...manager} />
      <StickerDetailDialog {...manager} />
      <AlbumSettingsDialog {...manager} />
      {manager.modal === "compare" && manager.album && (
        <CompareAlbumDialog
          key={manager.album.id}
          album={manager.album}
          onClose={() => manager.setModal("")}
        />
      )}
    </>
  );
}
