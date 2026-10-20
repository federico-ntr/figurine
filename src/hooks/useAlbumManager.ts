import { useState, useRef, type SubmitEvent } from "react";
import { type Album, KEY, serialize, decode, encode, add } from "../data";
import { loadAlbums, exportAlbums } from "../storage";

const initial = loadAlbums();

/**
 * Gestisce selezione, persistenza, inserimenti e trasferimento delle collezioni.
 * @returns Stato dell’applicazione e azioni disponibili per la UI.
 */
export function useAlbumManager() {
  const [albums, setAlbums] = useState<Album[]>(initial.albums),
    [selected, setSelected] = useState(initial.albums[0]?.id || ""),
    [error, setError] = useState(initial.error),
    [modal, setModal] = useState(""),
    [name, setName] = useState(""),
    [total, setTotal] = useState(""),
    [number, setNumber] = useState(""),
    [filter, setFilter] = useState("all"),
    [search, setSearch] = useState(""),
    [notice, setNotice] = useState(""),
    [history, setHistory] = useState<{ id: string; n: number }[]>([]),
    [importText, setImportText] = useState(""),
    [pending, setPending] = useState<Album[] | null>(null),
    [detail, setDetail] = useState<number | null>(null);
  const input = useRef<HTMLInputElement>(null);
  const album = albums.find((a) => a.id === selected) || albums[0];

  /**
   * Salva le collezioni prima di aggiornare lo stato visibile.
   * @param next - Collezioni da conservare sul dispositivo.
   * @returns Vero se il salvataggio è riuscito.
   */
  function save(next: Album[]) {
    try {
      if (next.length > 100) {
        setError("Puoi salvare al massimo 100 collezioni.");
        return false;
      }
      localStorage.setItem(KEY, serialize(next));
      setAlbums(next);
      setError("");
      return true;
    } catch {
      setError("Salvataggio non riuscito: memoria piena o accesso bloccato. Esporta un backup.");
      return false;
    }
  }

  /**
   * Aggiorna le copie della figurina selezionata e registra gli inserimenti annullabili.
   * @param n - Numero della figurina.
   * @param delta - Copie da aggiungere o rimuovere.
   * @returns Vero se un inserimento è stato salvato; falso o undefined altrimenti.
   */
  function change(n: number, delta: number) {
    if (!album) return;
    try {
      const next = add(album, n, delta);
      if (save(albums.map((a) => (a.id === album.id ? next : a))) && delta > 0) {
        setHistory((h) => [{ id: album.id, n }, ...h].slice(0, 50));
        setNotice((album.counts[n] ? "Doppione" : "Nuova figurina") + " · #" + n);
        return true;
      }
    } catch (e) {
      setError((e as Error).message);
    }
    return false;
  }

  /**
   * Valida e inserisce il numero digitato, mantenendo il focus sul campo.
   * @param e - Invio del modulo di inserimento.
   */
  function submit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = Number(number);
    if (!/^\d+$/.test(number) || !album || n < 1 || n > album.total) {
      setNotice(`Inserisci un numero da 1 a ${album?.total}.`);
      input.current?.select();
      return;
    }
    if (change(n, 1)) setNumber("");
    input.current?.focus();
  }

  /**
   * Annulla l’ultimo inserimento salvato nella cronologia.
   */
  function undo() {
    const h = history[0];
    if (!h) return;
    const a = albums.find((a) => a.id === h.id);
    if (a && save(albums.map((x) => (x.id === a.id ? add(a, h.n, -1) : x)))) {
      setHistory(history.slice(1));
      setNotice("Ultimo inserimento annullato · #" + h.n);
    }
  }

  /**
   * Valida i campi e salva una nuova collezione.
   * @param e - Invio del modulo di creazione.
   */
  function create(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const n = Number(total);
    if (!name.trim() || name.trim().length > 100 || !Number.isInteger(n) || n < 1 || n > 10000)
      return;
    const a: Album = { id: crypto.randomUUID(), name: name.trim(), total: n, counts: {} };
    if (save([...albums, a])) {
      setSelected(a.id);
      setModal("");
      setName("");
      setTotal("");
      setNotice("Collezione creata. Apri il primo pacchetto!");
    }
  }

  /**
   * Valida un backup e ne prepara l’anteprima di importazione.
   * @param text - Backup JSON o codice FIG1 da leggere.
   */
  function parse(text: string) {
    try {
      const next = decode(text.trim());
      if (!next.length) throw Error("Il file non contiene collezioni.");
      setPending(next);
      setModal("import");
      setError("");
    } catch (e) {
      setError("Importazione: " + (e as Error).message);
    }
  }
  const owned = album ? Object.keys(album.counts).length : 0,
    copies = album ? Object.values(album.counts).reduce((a, b) => a + b, 0) : 0,
    pct = album ? Math.round((owned / album.total) * 100) : 0;
  const nums = album
    ? Array.from({ length: album.total }, (_, i) => i + 1).filter(
        (n) =>
          (filter === "all" ||
            (filter === "missing" && !album.counts[n]) ||
            (filter === "owned" && album.counts[n] > 0) ||
            (filter === "duplicates" && album.counts[n] > 1)) &&
          (!search || String(n).includes(search)),
      )
    : [];
  const [page, setPage] = useState(1);
  const qr = album ? encode([album]) : "";

  /**
   * Apre l’importazione azzerando il testo e l’anteprima precedenti.
   */
  function openImport() {
    setPending(null);
    setImportText("");
    setModal("import");
  }

  /**
   * Chiude l’importazione e scarta l’anteprima.
   */
  function closeImport() {
    setModal("");
    setPending(null);
  }

  /**
   * Seleziona una collezione e azzera pagina, cronologia e messaggio.
   * @param id - Identificativo della collezione da visualizzare.
   */
  function selectAlbum(id: string) {
    setSelected(id);
    setPage(1);
    setHistory([]);
    setNotice("");
  }

  /**
   * Applica un filtro e riparte dalla prima pagina.
   * @param value - Filtro scelto; il valore vuoto viene ignorato.
   */
  function updateFilter(value: string) {
    if (value) {
      setFilter(value);
      setPage(1);
    }
  }

  /**
   * Aggiorna la ricerca e riparte dalla prima pagina.
   * @param value - Testo da cercare nei numeri delle figurine.
   */
  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  /**
   * Legge il codice oppure salva le collezioni in anteprima con nuovi identificativi.
   */
  function confirmImport() {
    if (!pending) {
      parse(importText);
      return;
    }
    const next = pending.map((a) => ({ ...a, id: crypto.randomUUID() }));
    if (save([...albums, ...next])) {
      setSelected(next[0].id);
      setHistory([]);
      setPending(null);
      setModal("");
      setNotice("Collezione importata.");
    }
  }

  /**
   * Rimuove una copia dal dettaglio e azzera la cronologia degli inserimenti.
   */
  function removeCopy() {
    if (detail) {
      change(detail, -1);
      setHistory([]);
    }
  }

  /**
   * Elimina la collezione attiva e chiude la finestra di gestione.
   */
  function deleteAlbum() {
    if (album && save(albums.filter((a) => a.id !== album.id))) {
      setSelected("");
      setHistory([]);
      setModal("");
    }
  }

  /**
   * Esporta la collezione attiva oppure un backup completo.
   * @param all - Se vero esporta tutte le collezioni.
   */
  function exportFile(all = false) {
    exportAlbums(albums, album, all);
  }

  return {
    albums,
    album,
    error,
    setError,
    modal,
    setModal,
    name,
    setName,
    total,
    setTotal,
    number,
    setNumber,
    filter,
    search,
    notice,
    history,
    importText,
    setImportText,
    pending,
    detail,
    setDetail,
    input,
    owned,
    copies,
    pct,
    nums,
    page,
    setPage,
    qr,
    submit,
    undo,
    create,
    change,
    parse,
    openImport,
    closeImport,
    selectAlbum,
    updateFilter,
    updateSearch,
    confirmImport,
    removeCopy,
    deleteAlbum,
    exportFile,
  };
}

/**
 * Contratto di stato e azioni condiviso dai componenti della UI.
 */
export type AlbumManager = ReturnType<typeof useAlbumManager>;
