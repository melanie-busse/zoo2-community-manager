import { describe, test, expect, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import { useClickOutside } from "./useClickOutside";

describe("useClickOutside Hook", () => {
  test("löst den Handler aus, wenn außerhalb geklickt wird", () => {
    const handler = vi.fn();

    // 1. Wir erstellen zwei echte HTML-Elemente im JSDOM
    const insideElement = document.createElement("div");
    const outsideElement = document.createElement("div");
    document.body.appendChild(insideElement);
    document.body.appendChild(outsideElement);

    // 2. Ref erstellen und auf das innere Element zeigen lassen
    const ref = { current: insideElement };

    // 3. Hook rendern
    renderHook(() => useClickOutside(ref, handler));

    // 4. Klick auf das ÄUẞERE Element simulieren
    outsideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    // Der Handler MUSS aufgerufen worden sein
    expect(handler).toHaveBeenCalledTimes(1);

    // Aufräumen
    document.body.removeChild(insideElement);
    document.body.removeChild(outsideElement);
  });

  test("löst den Handler NICHT aus, wenn innerhalb geklickt wird", () => {
    const handler = vi.fn();

    const insideElement = document.createElement("div");
    document.body.appendChild(insideElement);

    const ref = { current: insideElement };

    renderHook(() => useClickOutside(ref, handler));

    // Klick auf das INNERE Element simulieren
    insideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    // Der Handler darf NICHT aufgerufen worden sein
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(insideElement);
  });

  test("entfernt die Event-Listener beim Unmount (Cleanup)", () => {
    const handler = vi.fn();
    const outsideElement = document.createElement("div");
    document.body.appendChild(outsideElement);

    const ref = { current: document.createElement("div") };

    // unmount Funktion aus dem renderHook Destructuring ziehen
    const { unmount } = renderHook(() => useClickOutside(ref, handler));

    // Hook zerstören
    unmount();

    // Jetzt draußen klicken
    outsideElement.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));

    // Wenn der Cleanup-Code im useEffect (return) funktioniert,
    // wurde der Listener entfernt und der Handler bleibt bei 0 Aufrufen
    expect(handler).not.toHaveBeenCalled();

    document.body.removeChild(outsideElement);
  });
});
