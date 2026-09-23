import { getAdminSettings } from "@/lib/actions";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 font-heading">Settings</h1>
          <p className="text-gray-500 mt-2">Manage global platform settings and configurations.</p>
        </div>
      </div>

      <SettingsClient initialSettings={settings} />
    </div>
  );
}
