import { describe, expect, it } from "vitest";
import {
  formatDate,
  formatPossibleDate,
  priorityPresentation,
  roleLabel,
  statusPresentation,
} from "../src/utils/presentation";

describe("mobile presentation helpers", () => {
  it("never exposes raw work-order enums", () => {
    expect(statusPresentation("in_progress").label).toBe("Devam Ediyor");
    expect(statusPresentation("waiting_part").label).toBe("Parça Bekliyor");
    expect(statusPresentation("completed").tone).toBe("success");
  });

  it("localizes priority and roles", () => {
    expect(priorityPresentation("critical").label).toBe("Kritik");
    expect(roleLabel("maintenance_manager")).toBe("Bakım Yöneticisi");
  });

  it("formats date-only values without exposing ISO", () => {
    expect(formatDate("2026-08-31")).not.toContain("2026-08-31");
    expect(formatPossibleDate("2026-08-31")).not.toContain("2026-08-31");
    expect(formatPossibleDate("12 adet")).toBe("12 adet");
  });
});
