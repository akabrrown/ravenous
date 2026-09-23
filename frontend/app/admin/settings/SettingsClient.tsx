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
import { Trash2, Edit2, Plus, Save, X } from "lucide-react";
import { deleteSetting, saveSetting } from "@/lib/actions";
import { Input } from "@/components/ui/input";

type Setting = {
  id: string;
  key: string;
  value: any;
  updatedAt: Date;
};

export default function SettingsClient({ initialSettings }: { initialSettings: Setting[] }) {
  const [settings, setSettings] = useState(initialSettings);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");

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
      
      // Try to parse as JSON if it looks like an object or array
      if (editValue.trim().startsWith('{') || editValue.trim().startsWith('[')) {
        try {
          parsedValue = JSON.parse(editValue);
        } catch (e) {
          // If it fails to parse but looks like JSON, maybe it's just a string they wanted.
          // Or we can show an error. Let's just pass it as a string if it fails.
        }
      }

      await saveSetting(key, parsedValue);
      
      // We don't have the new ID if it was inserted, but we can refresh the page or mock it.
      // Easiest is to force a reload to get fresh data since we mutate server-side anyway.
      window.location.reload();
      
    } catch (e) {
      alert("Failed to save setting.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setIsAdding(true); setEditingKey("NEW"); setNewKey(""); setEditValue(""); }} className="flex items-center gap-2">
          <Plus size={16} /> Add Setting
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
                  No settings found.
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
  );
}
