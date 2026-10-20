import { Box, ButtonBase } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import type { StickerState } from "../theme";

/** Numero, quantità posseduta e azioni di dettaglio e aggiunta rapida. */
interface StickerCardProps {
  readonly number: number;
  readonly count: number;
  readonly onSelect: (number: number) => void;
  readonly onAdd: (number: number) => void;
}

/**
 * Mostra una figurina con i colori semantici corrispondenti alle copie possedute.
 * @param props - Numero, quantità e azioni di selezione e aggiunta della figurina.
 * @returns La scheda con pulsanti separati per dettaglio e aggiunta di una copia.
 */
export function StickerCard({ number, count, onSelect, onAdd }: StickerCardProps) {
  let state: StickerState = "missing";
  if (count > 1) {
    state = "duplicate";
  } else if (count) {
    state = "found";
  }
  return (
    <Box
      sx={{
        position: "relative",
        borderRadius: "8px",
        fontSize: { xs: 13, sm: 14 },
        fontWeight: 600,
        border: 1,
        borderStyle: state === "missing" ? "dashed" : "solid",
        borderColor: `stickers.${state}.border`,
        color: `stickers.${state}.text`,
        bgcolor: `stickers.${state}.background`,
        transition: (theme) => theme.transitions.create("transform", { duration: 150 }),
        "&:hover": { transform: "translateY(-3px)", boxShadow: 1 },
        "& .Mui-focusVisible": {
          outline: "3px solid",
          outlineColor: "action.focus",
          outlineOffset: 2,
        },
      }}
    >
      <ButtonBase
        aria-label={`Figurina ${number}, ${count} copie`}
        onClick={() => onSelect(number)}
        sx={{
          position: "relative",
          width: "100%",
          aspectRatio: "1.1",
          borderRadius: "7px 7px 0 0",
        }}
      >
        <span>{String(number).padStart(3, "0")}</span>
        {count > 0 && (
          <Box component="small" sx={{ position: "absolute", right: 5, bottom: 3, fontSize: 9 }}>
            {count > 1 ? `×${count}` : "✓"}
          </Box>
        )}
      </ButtonBase>
      <ButtonBase
        aria-label={`Aggiungi una copia della figurina ${number}`}
        title="Aggiungi una copia"
        onClick={() => onAdd(number)}
        sx={{
          display: "flex",
          width: "100%",
          minHeight: 32,
          borderTop: 1,
          borderColor: `stickers.${state}.border`,
          borderRadius: "0 0 7px 7px",
          "&:hover": { bgcolor: "action.hover" },
        }}
      >
        <AddIcon sx={{ fontSize: 18 }} />
      </ButtonBase>
    </Box>
  );
}
