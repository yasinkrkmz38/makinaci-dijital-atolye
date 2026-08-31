import { describe, expect, it } from "vitest";
import { canUser } from "@/services/permissions";
import type { User } from "@/types";

const user = (company_role: User["company_role"]): User => ({
  id: 1,
  name: "Test",
  email: "test@example.com",
  role: "user",
  platform_admin: false,
  email_verified: true,
  mfa_enabled: false,
  company_role,
});
describe("mobil rol görünürlüğü", () => {
  it("görüntüleyiciye yazma işlemi göstermez", () => {
    expect(canUser(user("viewer"), "operate")).toBe(false);
    expect(canUser(user("viewer"), "work")).toBe(false);
  });
  it("operatöre arıza bildirme izni verir ama yönetim vermez", () => {
    expect(canUser(user("operator"), "operate")).toBe(true);
    expect(canUser(user("operator"), "manageCompany")).toBe(false);
  });
  it("firma sahibine rol yönetimi verir", () => {
    expect(canUser(user("owner"), "manageRoles")).toBe(true);
  });
  it("platform yöneticisine tüm mobil eylemleri açar", () => {
    expect(canUser({ ...user("viewer"), platform_admin: true }, "manageRoles")).toBe(true);
  });
});
