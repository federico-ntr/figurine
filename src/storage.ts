import { type Album, KEY, validate, serialize } from "./data";

/**
 * Legge gli album locali, restituendo un errore recuperabile se i dati non sono validi.
 * @returns Gli album caricati e l’eventuale messaggio di errore.
 */
export function loadAlbums() {
  try {
    const s = localStorage.getItem(KEY);
    return { albums: s ? validate(JSON.parse(s)) : [], error: "" };
  } catch {
    return {
      albums: [],
      error:
        "Impossibile leggere i dati locali. Esporta eventuali dati prima di modificare le collezioni.",
    };
  }
}

/**
 * Scarica un backup JSON degli album richiesti.
 * @param albums - Tutte le collezioni disponibili.
 * @param album - Collezione attualmente selezionata.
 * @param all - Se vero include tutte le collezioni nel backup.
 */
export function exportAlbums(albums: Album[], album: Album | undefined, all = false) {
  let exportedAlbums: Album[] = [];
  if (all) {
    exportedAlbums = albums;
  } else if (album) {
    exportedAlbums = [album];
  }
  const blob = new Blob([serialize(exportedAlbums)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = all ? "figurine-backup.json" : "figurine-collezione.json";
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
