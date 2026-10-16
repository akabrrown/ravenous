"use client";

import { useState } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2, Plus, Save, X, Phone, MessageSquare, Check, ExternalLink, RefreshCw } from "lucide-react";
import { deleteSetting, saveSetting, saveAdminWhatsAppSetting } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { normalizeWhatsAppPhone, createWhatsAppDeepLink } from "@/lib/whatsapp-utils";

type Setting = {
  id: string;
  key: string;
  value: any;
  updatedAt: Date;
};

type WhatsAppConfig = {
  phone: string;
  webhookUrl: string;
};

export default function SettingsClient({ 
  initialSettings,
  initialWhatsAppConfig,
}: { 
  initialSettings: Setting[];
  initialWhatsAppConfig?: WhatsAppConfig;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");

  // WhatsApp Notification Settings State
  const [whatsappPhone, setWhatsappPhone] = useState(initialWhatsAppConfig?.phone || "0552471202");
  const [webhookUrl, setWebhookUrl] = useState(initialWhatsAppConfig?.webhookUrl || "");
  const [isSavingWhatsApp, setIsSavingWhatsApp] = useState(false);
  const [whatsappSaveSuccess, setWhatsappSaveSuccess] = useState(false);

  const normalizedPhone = normalizeWhatsAppPhone(whatsappPhone);

  const handleSaveWhatsAppConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!whatsappPhone.trim()) {
      alert("Please provide a valid phone number.");
      return;
    }

    setIsSavingWhatsApp(true);
    setWhatsappSaveSuccess(false);

    try {
      await saveAdminWhatsAppSetting(whatsappPhone, webhookUrl);
      setWhatsappSaveSuccess(true);
      setTimeout(() => setWhatsappSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to save WhatsApp settings.");
    } finally {
      setIsSavingWhatsApp(false);
    }
  };

  const handleTestWhatsApp = () => {
    if (!normalizedPhone) {
      alert("Please enter a valid phone number before testing.");
      return;
    }
    const testMessage = `🔔 *Test Alert from Ravenous Studio*\nThis is a test notification to verify that incoming client requests will be successfully routed to this WhatsApp number.\n\nEverything is working! ✅`;
    const link = createWhatsAppDeepLink(normalizedPhone, testMessage);
    if (link) {
      window.open(link, "_blank", "noopener,noreferrer");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this setting?")) return;
    await deleteSetting(id);
    setSettings(settings.filter(s => s.id !== id));
  };

  const handleStartEdit = (setting: Setting) => {
    setEditingKey(setting.key);
    setEditValue(typeof setting.value === 'object' ? JSON.stringify(setting.value, null, 2) : String(setting.value));
  };

  const handleSave = async (key: string, isNew = false) => {
    try {
      let parsedValue = editValue;
      if (editValue.trim().startsWith('{') || editValue.trim().startsWith('[')) {
        try {
          parsedValue = JSON.parse(editValue);
        } catch (e) {
          // Keep as string if parsing fails
        }
      }

      await saveSetting(key, parsedValue);
      window.location.reload();
    } catch (e) {
      alert("Failed to save setting.");
    }
  };

  return (
    <div className="space-y-10 max-w-6xl">
      {/* WhatsApp Notifications Configuration Card */}
      <Card className="border border-green-200/60 shadow-sm bg-gradient-to-br from-white via-white to-green-50/20 rounded-xl overflow-hidden">
        <div className="h-1.5 bg-green-500 w-full" />
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center font-bold">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="text-xl font-heading font-bold text-gray-900">
                  WhatsApp Request Notifications
                </CardTitle>
                <CardDescription className="text-sm text-gray-600">
                  Configure the admin number that receives instant WhatsApp messages when users submit booking, quote, or contact requests.
                </CardDescription>
              </div>
            </div>
            {normalizedPhone ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 self-start sm:self-auto">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                Active ({normalizedPhone})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 self-start sm:self-auto">
                Needs Valid Number
              </span>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSaveWhatsAppConfig} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-green-600" />
                  Admin WhatsApp Number *
                </label>
                <Input 
                  value={whatsappPhone} 
                  onChange={(e) => setWhatsappPhone(e.target.value)}
                  placeholder="e.g. 055 247 1202 or +233552471202"
                  className="bg-white border-gray-300 font-medium text-base"
                  required
                />
                <p className="text-xs text-gray-500">
                  Local Ghana format (e.g. <span className="font-mono text-gray-700">0552471202</span>) or international format (<span className="font-mono text-gray-700">+233552471202</span>).
                  {normalizedPhone && (
                    <span className="block mt-0.5 text-green-600 font-medium">
                      ✓ Normalizes to WhatsApp wa.me ID: <code>+{normalizedPhone}</code>
                    </span>
                  )}
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-700">
                  Automated Gateway Webhook URL (Optional)
                </label>
                <Input 
                  value={webhookUrl} 
                  onChange={(e) => setWebhookUrl(e.target.value)}
                  placeholder="https://api.wasapi.io/v1/send or webhook URL"
                  className="bg-white border-gray-300 font-mono text-sm"
                />
                <p className="text-xs text-gray-500">
                  Optional: If using an automated WhatsApp Business API gateway (Twilio, Wasapi, UltraMsg, etc.), enter the webhook dispatch URL.
                </p>
              </div>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <Button 
                  type="submit" 
                  disabled={isSavingWhatsApp}
                  className="bg-green-600 hover:bg-green-700 text-white font-medium flex items-center gap-2"
                >
                  {isSavingWhatsApp ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : whatsappSaveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved Successfully!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Save WhatsApp Settings
                    </>
                  )}
                </Button>

                <Button 
                  type="button" 
                  variant="outline"
                  onClick={handleTestWhatsApp}
                  className="border-green-300 text-green-700 hover:bg-green-50 flex items-center gap-1.5"
                >
                  <ExternalLink className="w-4 h-4" />
                  Test Message on WhatsApp
                </Button>
              </div>

              <p className="text-xs text-gray-400">
                Incoming requests are also securely saved to the database.
              </p>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* General Platform Settings Management Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold font-heading text-gray-900">All System Settings</h2>
            <p className="text-sm text-gray-500">View and manage raw key-value database records.</p>
          </div>
          <Button 
            onClick={() => { setIsAdding(true); setEditingKey("NEW"); setNewKey(""); setEditValue(""); }} 
            className="flex items-center gap-2"
          >
            <Plus size={16} /> Add Setting Key
          </Button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-1/4">Key</TableHead>
                <TableHead className="w-1/2">Value</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isAdding && editingKey === "NEW" && (
                <TableRow className="bg-blue-50/50">
                  <TableCell>
                    <Input 
                      value={newKey} 
                      onChange={e => setNewKey(e.target.value)} 
                      placeholder="e.g. site_title" 
                      className="font-mono text-sm"
                    />
                  </TableCell>
                  <TableCell>
                    <Input 
                      value={editValue} 
                      onChange={e => setEditValue(e.target.value)} 
                      placeholder="Value..." 
                    />
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">Just now</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button variant="ghost" size="icon" onClick={() => handleSave(newKey, true)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                        <Save size={16} />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => { setIsAdding(false); setEditingKey(null); }} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                        <X size={16} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )}

              {settings.length === 0 && !isAdding ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                    No custom settings records found.
                  </TableCell>
                </TableRow>
              ) : (
                settings.map((setting) => (
                  <TableRow key={setting.id}>
                    <TableCell className="font-mono text-sm text-gray-900 font-semibold">
                      {setting.key}
                    </TableCell>
                    <TableCell>
                      {editingKey === setting.key ? (
                        <Input 
                          value={editValue} 
                          onChange={e => setEditValue(e.target.value)} 
                          autoFocus
                        />
                      ) : (
                        <div className="text-sm text-gray-600 truncate max-w-md font-mono bg-gray-50 p-1.5 rounded border border-gray-100">
                          {typeof setting.value === 'object' ? JSON.stringify(setting.value) : String(setting.value)}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }).format(new Date(setting.updatedAt))}
                    </TableCell>
                    <TableCell className="text-right">
                      {editingKey === setting.key ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleSave(setting.key)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                            <Save size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setEditingKey(null)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                            <X size={16} />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="icon" onClick={() => handleStartEdit(setting)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                            <Edit2 size={16} />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(setting.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
