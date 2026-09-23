"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPortfolio, deletePortfolio, updatePortfolio } from "@/lib/actions";
import { Edit, Trash2, Plus, X } from "lucide-react";
import { MediaUploader } from "@/components/ui/media-uploader";
import { Checkbox } from "@/components/ui/checkbox";

export default function PortfolioClient({ initialProjects }: { initialProjects: any[] }) {
  const [projects, setProjects] = useState(initialProjects);
  const [isOpen, setIsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<any>({
    title: "",
    eventType: "",
    clientName: "",
    eventDate: "",
    location: "",
    description: "",
    coverMediaId: null,
    coverMedia: null,
    isFeatured: false,
    published: true,
    galleryMedia: [] as { id: string, deliveryUrl: string }[],
  });

  const resetForm = () => {
    setFormData({
      title: "",
      eventType: "",
      clientName: "",
      eventDate: "",
      location: "",
      description: "",
      coverMediaId: null,
      coverMedia: null,
      isFeatured: false,
      published: true,
      galleryMedia: [],
    });
    setIsEditing(false);
  };

  const openAddForm = () => {
    resetForm();
    setIsOpen(true);
  };

  const openEditForm = (project: any) => {
    setFormData({
      ...project,
      // Format date for date input field
      eventDate: project.eventDate ? new Date(project.eventDate).toISOString().split('T')[0] : "",
      galleryMedia: project.galleryMedia || [],
    });
    setIsEditing(true);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      await deletePortfolio(id);
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      servicesProvided: [], // Dummy empty array for now since no services selector is built
      // For a full implementation, we'd also link `projectMedia` junction table for galleryMedia IDs
    };

    if (isEditing) {
      const id = payload.id;
      delete payload.id;
      delete payload.coverMedia;
      delete payload.galleryMedia; // we skip junction for now in demo
      await updatePortfolio(id, payload);
    } else {
      delete payload.galleryMedia;
      await createPortfolio(payload);
    }
    
    // Quick reload strategy
    window.location.reload();
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-border p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-heading font-bold text-secondary">All Portfolio Projects</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger render={<Button onClick={openAddForm} className="gap-2" />}>
            <Plus size={16} /> Add New Project
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="font-heading uppercase tracking-wide">
                {isEditing ? "Edit Project" : "Add New Project"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Project Title *</Label>
                  <Input id="title" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventType">Event Type *</Label>
                  <Input id="eventType" required placeholder="e.g. Wedding, Corporate" value={formData.eventType} onChange={e => setFormData({...formData, eventType: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <MediaUploader 
                  label="Cover Image"
                  currentMediaUrl={formData.coverMedia?.deliveryUrl}
                  onUploadSuccess={(id, url) => setFormData({...formData, coverMediaId: id || null, coverMedia: { deliveryUrl: url }})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name</Label>
                  <Input id="clientName" value={formData.clientName} onChange={e => setFormData({...formData, clientName: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eventDate">Event Date *</Label>
                  <Input id="eventDate" type="date" required value={formData.eventDate} onChange={e => setFormData({...formData, eventDate: e.target.value})} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input id="location" required value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Full Description *</Label>
                <Textarea id="description" required rows={4} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>

              <div className="space-y-2 pt-2 border-t border-border mt-4">
                <h3 className="font-heading font-bold uppercase text-secondary">Gallery Images</h3>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {(formData.galleryMedia || []).map((media: any, idx: number) => (
                    <div key={idx} className="relative group aspect-square rounded-md overflow-hidden border border-border">
                      <img src={media.deliveryUrl} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => setFormData({...formData, galleryMedia: formData.galleryMedia.filter((_:any, i:number) => i !== idx)})}
                        className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="text-white" size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <MediaUploader 
                  label="Add to Gallery"
                  isMultiple={true}
                  onUploadSuccess={(id, url) => {
                    if (id && url) {
                      setFormData((prev: any) => ({
                        ...prev,
                        galleryMedia: [...prev.galleryMedia, { id, deliveryUrl: url }]
                      }))
                    }
                  }}
                />
              </div>

              <div className="flex gap-6 py-4">
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
                <Button type="submit">{isEditing ? "Save Changes" : "Create Project"}</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Project Title</TableHead>
            <TableHead>Event Type</TableHead>
            <TableHead>Event Date</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium text-secondary">{project.title}</TableCell>
              <TableCell className="text-muted-foreground text-sm">{project.eventType}</TableCell>
              <TableCell>
                {project.eventDate ? new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(new Date(project.eventDate)) : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEditForm(project)}>
                    <Edit size={16} className="text-muted-foreground" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(project.id)}>
                    <Trash2 size={16} className="text-red-500" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {projects.length === 0 && (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                No portfolio projects found. Add one to get started.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
