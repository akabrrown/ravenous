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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Edit2, Plus, Save, X } from "lucide-react";
import { createFaq, updateFaq, deleteFaq } from "@/lib/actions";

type Faq = {
  id: string;
  question: string;
  answer: string;
  group: string;
  sortOrder: number;
  published: boolean;
};

export default function FaqsClient({ initialFaqs }: { initialFaqs: Faq[] }) {
  const [faqs, setFaqs] = useState(initialFaqs);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Faq>>({
    question: "",
    answer: "",
    group: "General",
    sortOrder: 0,
    published: true,
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ?")) return;
    await deleteFaq(id);
    setFaqs(faqs.filter(f => f.id !== id));
  };

  const handleStartEdit = (faq: Faq) => {
    setEditingId(faq.id);
    setFormData(faq);
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      question: "",
      answer: "",
      group: "General",
      sortOrder: faqs.length > 0 ? Math.max(...faqs.map(f => f.sortOrder)) + 1 : 0,
      published: true,
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSave = async () => {
    try {
      if (isAdding) {
        const newFaq = await createFaq(formData);
        setFaqs([newFaq, ...faqs].sort((a, b) => a.sortOrder - b.sortOrder));
      } else if (editingId) {
        const updatedFaq = await updateFaq(editingId, formData);
        setFaqs(faqs.map(f => f.id === editingId ? updatedFaq : f).sort((a, b) => a.sortOrder - b.sortOrder));
      }
      handleCancel();
    } catch (e) {
      alert("Failed to save FAQ");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleStartAdd} className="flex items-center gap-2" disabled={isAdding || !!editingId}>
          <Plus size={16} /> Add FAQ
        </Button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">{isAdding ? 'New FAQ' : 'Edit FAQ'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Question</label>
              <Input 
                value={formData.question || ''} 
                onChange={e => setFormData({ ...formData, question: e.target.value })} 
                placeholder="e.g. How far in advance should I book?"
              />
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Answer</label>
              <Textarea 
                value={formData.answer || ''} 
                onChange={e => setFormData({ ...formData, answer: e.target.value })} 
                placeholder="Clear and concise answer..."
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category Group</label>
              <Input 
                value={formData.group || ''} 
                onChange={e => setFormData({ ...formData, group: e.target.value })} 
                placeholder="e.g. General, Pricing, Equipment"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Sort Order</label>
              <Input 
                type="number"
                value={formData.sortOrder || 0} 
                onChange={e => setFormData({ ...formData, sortOrder: parseInt(e.target.value) })} 
              />
            </div>
            
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="published" 
                  checked={formData.published} 
                  onCheckedChange={(checked) => setFormData({ ...formData, published: !!checked })}
                />
                <label htmlFor="published" className="text-sm font-medium leading-none">
                  Published
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={16} /> Save FAQ
            </Button>
          </div>
        </div>
      )}

      {!isAdding && !editingId && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead className="w-1/12">Order</TableHead>
                <TableHead className="w-4/12">Question</TableHead>
                <TableHead className="w-3/12">Group</TableHead>
                <TableHead className="w-2/12">Status</TableHead>
                <TableHead className="w-2/12 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {faqs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No FAQs found.
                  </TableCell>
                </TableRow>
              ) : (
                faqs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell className="text-gray-500 font-mono">{faq.sortOrder}</TableCell>
                    <TableCell className="font-medium text-gray-900">{faq.question}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs font-medium">
                        {faq.group}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${faq.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {faq.published ? 'Published' : 'Hidden'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleStartEdit(faq)} className="text-blue-500 hover:bg-blue-50">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(faq.id)} className="text-red-500 hover:bg-red-50">
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
