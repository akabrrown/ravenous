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
import { Trash2, Edit2, Plus, Save, X, PlusCircle, MinusCircle } from "lucide-react";
import { createPackage, updatePackage, deletePackage } from "@/lib/actions";

type Package = {
  id: string;
  name: string;
  eventType: string;
  description: string;
  price: string | null;
  features: string[];
  highlighted: boolean;
  published: boolean;
};

export default function PackagesClient({ initialPackages }: { initialPackages: Package[] }) {
  const [packages, setPackages] = useState(initialPackages);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<Partial<Package>>({
    name: "",
    eventType: "",
    description: "",
    price: "",
    features: [],
    highlighted: false,
    published: true,
  });

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    await deletePackage(id);
    setPackages(packages.filter(p => p.id !== id));
  };

  const handleStartEdit = (pkg: Package) => {
    setEditingId(pkg.id);
    setFormData(pkg);
    setIsAdding(false);
  };

  const handleStartAdd = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      name: "",
      eventType: "",
      description: "",
      price: "",
      features: [""],
      highlighted: false,
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
        const newPkg = await createPackage(formData);
        setPackages([newPkg, ...packages]);
      } else if (editingId) {
        const updatedPkg = await updatePackage(editingId, formData);
        setPackages(packages.map(p => p.id === editingId ? updatedPkg : p));
      }
      handleCancel();
    } catch (e) {
      alert("Failed to save package");
    }
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures[index] = value;
    setFormData({ ...formData, features: newFeatures });
  };

  const addFeature = () => {
    setFormData({ ...formData, features: [...(formData.features || []), ""] });
  };

  const removeFeature = (index: number) => {
    const newFeatures = [...(formData.features || [])];
    newFeatures.splice(index, 1);
    setFormData({ ...formData, features: newFeatures });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={handleStartAdd} className="flex items-center gap-2" disabled={isAdding || !!editingId}>
          <Plus size={16} /> Add Package
        </Button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h2 className="text-xl font-bold text-gray-900">{isAdding ? 'New Package' : 'Edit Package'}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Package Name</label>
              <Input 
                value={formData.name || ''} 
                onChange={e => setFormData({ ...formData, name: e.target.value })} 
                placeholder="e.g. Professional"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Event Type (or Tagline)</label>
              <Input 
                value={formData.eventType || ''} 
                onChange={e => setFormData({ ...formData, eventType: e.target.value })} 
                placeholder="e.g. Multi-camera production with live stream"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Price (GHS)</label>
              <Input 
                type="number"
                value={formData.price || ''} 
                onChange={e => setFormData({ ...formData, price: e.target.value })} 
                placeholder="e.g. 5500"
              />
            </div>
            
            <div className="flex items-center gap-6 pt-8">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="highlighted" 
                  checked={formData.highlighted} 
                  onCheckedChange={(checked) => setFormData({ ...formData, highlighted: !!checked })}
                />
                <label htmlFor="highlighted" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Highlighted / Most Popular
                </label>
              </div>
              
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="published" 
                  checked={formData.published} 
                  onCheckedChange={(checked) => setFormData({ ...formData, published: !!checked })}
                />
                <label htmlFor="published" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Published
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Description</label>
            <Textarea 
              value={formData.description || ''} 
              onChange={e => setFormData({ ...formData, description: e.target.value })} 
              placeholder="Short description of the package"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-medium text-gray-700">Features</label>
            {(formData.features || []).map((feature, i) => (
              <div key={i} className="flex items-center gap-2">
                <Input 
                  value={feature}
                  onChange={e => updateFeature(i, e.target.value)}
                  placeholder="e.g. 3x camera operators (4K)"
                />
                <Button variant="ghost" size="icon" onClick={() => removeFeature(i)} className="text-red-500 shrink-0">
                  <MinusCircle size={18} />
                </Button>
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addFeature} className="flex items-center gap-2">
              <PlusCircle size={14} /> Add Feature
            </Button>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button variant="outline" onClick={handleCancel}>Cancel</Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save size={16} /> Save Package
            </Button>
          </div>
        </div>
      )}

      {!isAdding && !editingId && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-gray-50/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Event Type / Tagline</TableHead>
                <TableHead>Price (GHS)</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {packages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No packages found. Create one above.
                  </TableCell>
                </TableRow>
              ) : (
                packages.map((pkg) => (
                  <TableRow key={pkg.id}>
                    <TableCell className="font-semibold">
                      {pkg.name}
                      {pkg.highlighted && <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold uppercase">Popular</span>}
                    </TableCell>
                    <TableCell className="text-gray-600">{pkg.eventType}</TableCell>
                    <TableCell className="font-medium text-gray-900">{pkg.price}</TableCell>
                    <TableCell>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${pkg.published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {pkg.published ? 'Published' : 'Hidden'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleStartEdit(pkg)} className="text-blue-500 hover:bg-blue-50">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDelete(pkg.id)} className="text-red-500 hover:bg-red-50">
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
