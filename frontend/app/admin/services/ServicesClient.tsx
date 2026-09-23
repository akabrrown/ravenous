"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createService, deleteService, updateService } from "@/lib/actions";
import { Edit, Trash2, Plus } from "lucide-react";
import { MediaUploader } from "@/components/ui/media-uploader";
import { Checkbox } from "@/components/ui/checkbox";

export default function ServicesClient({ initialServices }: { initialServices: any[] }) {
  const [services, setServices] = useState(initialServices);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: "",
    slug: "",
    shortDescription: "",
    description: "",
    equipmentUsed: "",
    startingPrice: "",
    categoryId: "00000000-0000-0000-0000-000000000000", // Dummy UUID for now, in a real app fetch categories
    sortOrder: 0,
    isFeatured: false,
    published: true,
    seoTitle: "",
    seoDescription: "",
    coverMediaId: null,
    coverMedia: null,
  });

  const resetForm = () => {
    setFormData({
      name: "",
      slug: "",
      shortDescription: "",
      description: "",
      equipmentUsed: "",
      startingPrice: "",
      categoryId: "00000000-0000-0000-0000-000000000000",
      sortOrder: 0,
      isFeatured: false,
      published: true,
      seoTitle: "",
      seoDescription: "",
      coverMediaId: null,
      coverMedia: null,
    });
    setIsEditing(false);
  };

  const openAddForm = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEditForm = (service: any) => {
    setFormData({
      ...service,
      equipmentUsed: service.equipmentUsed ? service.equipmentUsed.join(", ") : "",
    });
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this service?")) {
      await deleteService(id);
      setServices(services.filter(s => s.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Parse equipment string to array
    const equipmentArray = formData.equipmentUsed 
      ? formData.equipmentUsed.split(",").map((item: string) => item.trim())
      : [];

    const payload = {
      ...formData,
      equipmentUsed: equipmentArray,
      startingPrice: formData.startingPrice ? parseFloat(formData.startingPrice) : null,
      sortOrder: parseInt(formData.sortOrder) || 0
    };

    if (isEditing) {
      const id = payload.id;
      delete payload.id;
      delete payload.category;
      delete payload.coverMedia;
      await updateService(id, payload);
    } else {
      await createService(payload);
    }
    
    // Quick reload strategy for this demo (in production use router.refresh())
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-bold text-secondary">All Services</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button onClick={openAddForm} className="gap-2" />}>
            <Plus size={16} /> Add New Service
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading uppercase tracking-wide">
                {isEditing ? "Edit Service" : "Add New Service"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name *</Label>
                  <Input id="name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug *</Label>
                  <Input id="slug" required value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <MediaUploader 
                  label="Cover Image"
                  currentMediaUrl={formData.coverMedia?.deliveryUrl}
                  onUploadSuccess={(id, url) => setFormData({...formData, coverMediaId: id || null, coverMedia: { deliveryUrl: url }})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="shortDescription">Short Description *</Label>
                <Input id="shortDescription" required value={formData.shortDescription} onChange={e => setFormData({...formData, shortDescription: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea id="description" required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="equipmentUsed">Equipment Used (comma separated)</Label>
                <Input id="equipmentUsed" placeholder="e.g. 4K Cameras, Drone, Gimbal" value={formData.equipmentUsed} onChange={e => setFormData({...formData, equipmentUsed: e.target.value})} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startingPrice">Starting Price (GHS)</Label>
                  <Input id="startingPrice" type="number" step="0.01" value={formData.startingPrice} onChange={e => setFormData({...formData, startingPrice: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sortOrder">Sort Order</Label>
                  <Input id="sortOrder" type="number" value={formData.sortOrder} onChange={e => setFormData({...formData, sortOrder: e.target.value})} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">SEO Title</Label>
                  <Input id="seoTitle" value={formData.seoTitle || ""} onChange={e => setFormData({...formData, seoTitle: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">SEO Description</Label>
                  <Input id="seoDescription" value={formData.seoDescription || ""} onChange={e => setFormData({...formData, seoDescription: e.target.value})} />
                </div>
              </div>

              <div className="flex gap-6 py-2">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="published" 
                    checked={formData.published} 
                    onCheckedChange={(c) => setFormData({...formData, published: !!c})} 
                  />
                  <Label htmlFor="published">Published</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="isFeatured" 
                    checked={formData.isFeatured} 
                    onCheckedChange={(c) => setFormData({...formData, isFeatured: !!c})} 
                  />
                  <Label htmlFor="isFeatured">Feature on Homepage</Label>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                <Button type="submit">{isEditing ? "Save Changes" : "Create Service"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Service Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Starting Price</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {services.map((service) => (
            <TableRow key={service.id}>
              <TableCell className="font-medium text-secondary">{service.name}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{service.slug}</TableCell>
              <TableCell>
                {service.startingPrice ? `GHS ${Number(service.startingPrice).toLocaleString()}` : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(service)}>
                    <Edit size={16} className="text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(service.id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {services.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No services found. Add one to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
