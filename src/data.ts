import LZString from "lz-string";
/**
 * Collezione con numerazione continua e quantità possedute per figurina.
 */
export type Album = { id: string; name: string; total: number; counts: Record<string, number> };
/**
 * Chiave del backup versionato salvato sul dispositivo.
 */
export const KEY = "figurine.albums.v1";
/**
 * Valida un backup e normalizza le collezioni importate.
 * @param value - Dati non attendibili letti dal backup.
 * @returns Le collezioni validate; genera un errore per dati non validi.
 */
export function validate(value: unknown): Album[] {
  const v = value as { version?: number; albums?: unknown[] };
  if (!v || v.version !== 1 || !Array.isArray(v.albums) || v.albums.length > 100)
    throw Error("Formato del backup non valido.");
  return v.albums.map((raw) => {
    const a = raw as Album;
    if (
      !a ||
      typeof a.name !== "string" ||
      !a.name.trim() ||
      a.name.length > 100 ||
      !Number.isInteger(a.total) ||
      a.total < 1 ||
      a.total > 10000 ||
      !a.counts ||
      typeof a.counts !== "object" ||
      Array.isArray(a.counts)
    )
      throw Error("Collezione non valida (da 1 a 10.000 figurine).");
    const counts: Record<string, number> = {};
    for (const [k, n] of Object.entries(a.counts)) {
      if (
        !/^\d+$/.test(k) ||
        +k < 1 ||
        +k > a.total ||
        String(+k) !== k ||
        !Number.isSafeInteger(n) ||
        n < 1 ||
        n > 100000
      )
        throw Error("Quantità o numero figurina non valido.");
      counts[k] = n;
    }
    return {
      id: typeof a.id === "string" && a.id.length < 100 ? a.id : crypto.randomUUID(),
      name: a.name.trim(),
      total: a.total,
      counts,
    };
  });
}
/**
 * Serializza le collezioni nel formato JSON versionato.
 * @param albums - Collezioni da salvare o trasferire.
 * @returns Il backup JSON.
 */
export const serialize = (albums: Album[]) => JSON.stringify({ version: 1, albums });
/**
 * Comprime le collezioni in un codice trasferibile tramite QR.
 * @param albums - Collezioni da includere nel codice.
 * @returns Il testo compresso con prefisso FIG1.
 */
export const encode = (albums: Album[]) =>
  "FIG1:" + LZString.compressToEncodedURIComponent(serialize(albums));
/**
 * Decodifica e valida un backup JSON oppure un codice FIG1.
 * @param text - Testo del backup o del QR.
 * @returns Le collezioni validate; genera un errore se il testo non è valido.
 */
export function decode(text: string) {
  return validate(
    JSON.parse(
      text.startsWith("FIG1:") ? LZString.decompressFromEncodedURIComponent(text.slice(5)) : text,
    ),
  );
}
/**
 * Aggiorna le copie senza modificare la collezione originale.
 * @param a - Collezione da aggiornare.
 * @param n - Numero della figurina, compreso nella collezione.
 * @param delta - Variazione delle copie; i conteggi non positivi vengono rimossi.
 * @returns Una nuova collezione con le quantità aggiornate.
 */
export function add(a: Album, n: number, delta = 1): Album {
  if (!Number.isInteger(n) || n < 1 || n > a.total) throw Error("Numero fuori intervallo");
  const counts = { ...a.counts };
  const q = (counts[n] || 0) + delta;
  if (q > 100000) throw Error("Quantità massima raggiunta");
  if (q > 0) counts[n] = q;
  else delete counts[n];
  return { ...a, counts };
}

/**
 * Individua i doppioni utili all’altra persona, conservando una copia per numero.
 * @param mine - La propria collezione.
 * @param friend - La collezione dell’amico, con la stessa numerazione.
 * @returns Numeri da dare e ricevere e massimo numero di scambi uno a uno.
 */
export function compareAlbums(mine: Album, friend: Album) {
  if (mine.total !== friend.total)
    throw Error("Gli album hanno un numero totale di figurine diverso.");
  const give: number[] = [];
  const receive: number[] = [];
  for (let n = 1; n <= mine.total; n++) {
    if (mine.counts[n] > 1 && !friend.counts[n]) give.push(n);
    if (friend.counts[n] > 1 && !mine.counts[n]) receive.push(n);
  }
  return { give, receive, swaps: Math.min(give.length, receive.length) };
}
