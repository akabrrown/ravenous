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
import { deleteSiteContent, saveSiteContent } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SiteContent = {
  id: string;
  key: string;
  value: any;
  updatedAt: Date;
};

const COMMON_KEYS = [
  "hero_title",
  "hero_subtitle",
  "about_story",
  "about_mission",
  "about_vision",
  "contact_email",
  "contact_phone",
  "contact_address"
];

export default function SiteContentClient({ initialContent }: { initialContent: SiteContent[] }) {
  const [contentList, setContentList] = useState(initialContent);
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newKey, setNewKey] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this content block?")) return;
    
    await deleteSiteContent(id);
    setContentList(contentList.filter(s => s.id !== id));
  };

  const handleStartEdit = (content: SiteContent) => {
    setEditingKey(content.key);
    setEditValue(typeof content.value === 'object' ? JSON.stringify(content.value, null, 2) : String(content.value));
  };

  const handleSave = async (key: string) => {
    if (!key.trim()) return alert("Key is required");
    
    try {
      let parsedValue = editValue;
      
      if (editValue.trim().startsWith('{') || editValue.trim().startsWith('[')) {
        try {
          parsedValue = JSON.parse(editValue);
        } catch (e) {
          // Fallback to string
        }
      }

      await saveSiteContent(key, parsedValue);
      window.location.reload();
    } catch (e) {
      alert("Failed to save content.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={() => { setIsAdding(true); setEditingKey("NEW"); setNewKey(""); setEditValue(""); }} className="flex items-center gap-2">
          <Plus size={16} /> Add Content Block
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50/50">
            <TableRow>
              <TableHead className="w-1/4">Key</TableHead>
              <TableHead className="w-1/2">Content Value</TableHead>
              <TableHead>Last Updated</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isAdding && editingKey === "NEW" && (
              <TableRow className="bg-blue-50/50">
                <TableCell className="align-top pt-4">
                  <Input 
                    value={newKey} 
                    onChange={e => setNewKey(e.target.value)} 
                    placeholder="e.g. hero_title" 
                    className="font-mono text-sm mb-2"
                    list="common-keys"
                  />
                  <datalist id="common-keys">
                    {COMMON_KEYS.map(key => <option key={key} value={key} />)}
                  </datalist>
                </TableCell>
                <TableCell className="align-top pt-4">
                  <Textarea 
                    value={editValue} 
                    onChange={e => setEditValue(e.target.value)} 
                    placeholder="Content value..." 
                    rows={4}
                  />
                </TableCell>
                <TableCell className="text-sm text-gray-500 align-top pt-6">Just now</TableCell>
                <TableCell className="text-right align-top pt-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleSave(newKey)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                      <Save size={16} />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => { setIsAdding(false); setEditingKey(null); }} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                      <X size={16} />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            )}

            {contentList.length === 0 && !isAdding ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                  No site content found.
                </TableCell>
              </TableRow>
            ) : (
              contentList.map((content) => (
                <TableRow key={content.id}>
                  <TableCell className="font-mono text-sm text-gray-900 font-semibold align-top pt-4">
                    {content.key}
                  </TableCell>
                  <TableCell className="align-top pt-4">
                    {editingKey === content.key ? (
                      <Textarea 
                        value={editValue} 
                        onChange={e => setEditValue(e.target.value)} 
                        autoFocus
                        rows={4}
                      />
                    ) : (
                      <div className="text-sm text-gray-600 whitespace-pre-wrap max-w-md bg-gray-50 p-2.5 rounded border border-gray-100 max-h-48 overflow-y-auto">
                        {typeof content.value === 'object' ? JSON.stringify(content.value, null, 2) : String(content.value)}
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-gray-500 align-top pt-6">
                    {new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" }).format(new Date(content.updatedAt))}
                  </TableCell>
                  <TableCell className="text-right align-top pt-4">
                    {editingKey === content.key ? (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleSave(content.key)} className="text-green-600 hover:text-green-700 hover:bg-green-50">
                          <Save size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => setEditingKey(null)} className="text-gray-500 hover:text-gray-700 hover:bg-gray-100">
                          <X size={16} />
                        </Button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleStartEdit(content)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-50">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(content.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
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
