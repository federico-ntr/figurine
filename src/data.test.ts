import { describe, it, expect } from "vitest";
import { add, encode, decode, validate, compareAlbums, serialize, type Album } from "./data";
const a: Album = { id: "a", name: "Album", total: 600, counts: { "1": 1, "5": 2 } };
describe("collezioni", () => {
  it("conta doppioni e rimuove l’ultima copia", () => {
    expect(add(a, 5).counts[5]).toBe(3);
    expect(add(a, 1, -1).counts[1]).toBeUndefined();
    expect(a.counts[5]).toBe(2);
  });
  it("rifiuta numeri fuori intervallo", () => {
    expect(() => add(a, 601)).toThrow();
    expect(() => add(a, 0)).toThrow();
  });
  it("trasferisce senza perdita via QR e JSON", () => {
    expect(decode(encode([a]))).toEqual([a]);
    expect(decode(JSON.stringify({ version: 1, albums: [a] }))).toEqual([a]);
  });
  it("rifiuta backup malformati", () => {
    for (const counts of [{ "601": 1 }, { "1": -2 }, { "1": 1.5 }, { "01": 2 }])
      expect(() => validate({ version: 1, albums: [{ ...a, counts }] })).toThrow();
    expect(() => decode("FIG1:bad")).toThrow();
  });
});

describe("confronto per gli scambi", () => {
  const mine: Album = {
    id: "mine",
    name: "Album",
    total: 8,
    counts: { "1": 3, "2": 1, "3": 2, "5": 2, "8": 2 },
  };
  const friend: Album = {
    id: "friend",
    name: "Album amico",
    total: 8,
    counts: { "3": 1, "4": 4, "5": 3, "6": 1 },
  };

  it("propone solo doppioni mancanti all’altra persona, una copia per numero", () => {
    expect(compareAlbums(mine, friend)).toEqual({ give: [1, 8], receive: [4], swaps: 1 });
    expect(compareAlbums(friend, mine)).toEqual({ give: [4], receive: [1, 8], swaps: 1 });
  });

  it("mostra le opportunità anche quando sono in una sola direzione", () => {
    expect(compareAlbums(mine, { ...friend, counts: {} })).toEqual({
      give: [1, 3, 5, 8],
      receive: [],
      swaps: 0,
    });
  });

  it("gestisce album vuoti e collezioni senza opportunità", () => {
    expect(compareAlbums({ ...mine, counts: {} }, { ...friend, counts: {} })).toEqual({
      give: [],
      receive: [],
      swaps: 0,
    });
    expect(compareAlbums(mine, mine)).toEqual({ give: [], receive: [], swaps: 0 });
  });

  it("rifiuta album con numerazioni diverse", () => {
    expect(() => compareAlbums(mine, { ...friend, total: 9 })).toThrow("numero totale");
  });

  it("confronta export JSON e QR senza modificare le collezioni originali", () => {
    const before = serialize([mine, friend]);
    for (const text of [serialize([friend]), encode([friend])]) {
      expect(compareAlbums(mine, decode(text)[0])).toEqual({
        give: [1, 8],
        receive: [4],
        swaps: 1,
      });
    }
    expect(serialize([mine, friend])).toBe(before);
  });
});
