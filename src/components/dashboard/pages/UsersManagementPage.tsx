import { GenericManagementPage } from "./GenericManagementPage";
import { usersManagementConfig } from "../configs/usersConfig";

export default function UsersManagementPage() {
  return <GenericManagementPage config={usersManagementConfig} userRole="admin" />;
}