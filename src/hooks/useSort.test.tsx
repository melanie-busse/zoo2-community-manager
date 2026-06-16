import { describe, test, expect } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useSort } from "./useSort"; // Pfad ggf. anpassen

describe("useSort Hook", () => {
  test("initialisiert mit den Standardwerten", () => {
    const { result } = renderHook(() => useSort());

    expect(result.current.sortBy).toBe("name");
    expect(result.current.sortDirection).toBe("asc");
  });

  test("initialisiert mit benutzerdefinierten Werten", () => {
    const { result } = renderHook(() => useSort("level", "desc"));

    expect(result.current.sortBy).toBe("level");
    expect(result.current.sortDirection).toBe("desc");
  });

  test("ändert die Richtung (toggle), wenn derselbe Key erneut geklickt wird", () => {
    const { result } = renderHook(() => useSort("name", "asc"));

    // WICHTIG: Zustandsänderungen bei Hooks IMMER in 'act()' einpacken!
    act(() => {
      result.current.toggleSort("name");
    });

    expect(result.current.sortBy).toBe("name");
    expect(result.current.sortDirection).toBe("desc");

    // Noch mal klicken -> sollte wieder auf 'asc' springen
    act(() => {
      result.current.toggleSort("name");
    });

    expect(result.current.sortDirection).toBe("asc");
  });

  test("wechselt den Key und setzt die Richtung zurück auf 'asc', wenn ein neuer Key geklickt wird", () => {
    const { result } = renderHook(() => useSort("name", "desc"));

    act(() => {
      result.current.toggleSort("level");
    });

    expect(result.current.sortBy).toBe("level");
    expect(result.current.sortDirection).toBe("asc"); // Neuer Key fängt immer mit 'asc' an
  });

  describe("getSortIcon", () => {
    test("gibt das richtige Icon für den aktiven und inaktiven Zustand zurück", () => {
      const { result } = renderHook(() => useSort("name", "asc"));

      // Aktiver Key, aufsteigend
      expect(result.current.getSortIcon("name")).toBe("▲");

      // Inaktiver Key
      expect(result.current.getSortIcon("level")).toBe("↕");

      // Auf absteigend wechseln
      act(() => {
        result.current.toggleSort("name");
      });

      // Aktiver Key, absteigend
      expect(result.current.getSortIcon("name")).toBe("▼");
    });
  });
});
