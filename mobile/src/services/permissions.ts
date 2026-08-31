import type { CompanyRole, User } from "@/types";

export type CompanyAction =
  | "manageCompany"
  | "manageRoles"
  | "editAssets"
  | "work"
  | "operate";
const allowed: Record<CompanyAction, CompanyRole[]> = {
  manageCompany: ["owner", "manager"],
  manageRoles: ["owner"],
  editAssets: ["owner", "manager", "maintenance_manager"],
  work: [
    "owner",
    "manager",
    "maintenance_manager",
    "technician",
    "warehouse_manager",
  ],
  operate: [
    "owner",
    "manager",
    "maintenance_manager",
    "technician",
    "operator",
    "warehouse_manager",
  ],
};
export function canUser(user: User | null | undefined, action: CompanyAction) {
  if (!user) return false;
  if (user.platform_admin || user.role === "admin") return true;
  return !!user.company_role && allowed[action].includes(user.company_role);
}
