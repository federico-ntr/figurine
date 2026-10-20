import { describe, it, expect } from "vitest";
import { add, encode, decode, validate, type Album } from "./data";
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
