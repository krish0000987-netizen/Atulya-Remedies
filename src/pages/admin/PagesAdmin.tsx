import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Save, Upload, Plus, Trash2, CheckCircle, ImagePlus } from "lucide-react";
import type { Json } from "@/integrations/supabase/types";

const uploadMedia = async (file: File): Promise<string> => {
  const ext = file.name.split(".").pop();
  const path = `pages/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from("site-media").upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from("site-media").getPublicUrl(path);
  return data.publicUrl;
};

const ImageUploadField = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const url = await uploadMedia(file);
      onChange(url);
    } catch {
      // handled by parent
    }
    setUploading(false);
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground block">{label}</label>
      {value && (
        <div className="relative inline-block">
          <img src={value} alt={label} className="w-full max-w-xs h-32 object-contain rounded border border-border bg-muted" />
          <Button
            type="button"
            size="sm"
            variant="destructive"
            className="absolute top-1 right-1 h-6 w-6 p-0"
            onClick={() => onChange("")}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-md hover:bg-secondary/20 transition-colors text-sm font-medium">
          <Upload className="w-4 h-4" />
          {value ? "Replace Image" : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0])}
          />
        </label>
        {uploading && <span className="text-xs text-muted-foreground">Uploading...</span>}
      </div>
      <Input
        placeholder="Or paste image URL"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-xs"
      />
    </div>
  );
};

// New: Multi-image upload field for certificates
const MultiImageUploadField = ({
  label,
  values,
  onChange,
}: {
  label: string;
  values: string[];
  onChange: (urls: string[]) => void;
}) => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();

  const handleUpload = async (files: FileList) => {
    setUploading(true);
    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      try {
        const url = await uploadMedia(file);
        newUrls.push(url);
      } catch (err) {
        toast({
          title: "Upload Failed",
          description: `Failed to upload ${file.name}`,
          variant: "destructive",
        });
      }
    }
    onChange([...values, ...newUrls]);
    setUploading(false);
  };

  const removeImage = (idx: number) => {
    onChange(values.filter((_, i) => i !== idx));
  };

  const moveImage = (from: number, to: number) => {
    if (to < 0 || to >= values.length) return;
    const updated = [...values];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    onChange(updated);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <span className="text-xs text-muted-foreground">
          {values.length} image{values.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Image grid */}
      {values.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {values.map((url, idx) => (
            <div
              key={`${url}-${idx}`}
              className="relative group border border-border rounded-lg overflow-hidden bg-muted"
            >
              <img
                src={url}
                alt={`${label} ${idx + 1}`}
                className="w-full h-32 object-contain p-2"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                {idx > 0 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0 text-xs"
                    onClick={() => moveImage(idx, idx - 1)}
                    title="Move left"
                  >
                    ←
                  </Button>
                )}
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  className="h-7 w-7 p-0"
                  onClick={() => removeImage(idx)}
                  title="Remove image"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
                {idx < values.length - 1 && (
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-7 w-7 p-0 text-xs"
                    onClick={() => moveImage(idx, idx + 1)}
                    title="Move right"
                  >
                    →
                  </Button>
                )}
              </div>
              <div className="absolute top-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">
                {idx + 1}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      <div className="flex gap-2 items-center">
        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-md hover:bg-secondary/20 transition-colors text-sm font-medium">
          <ImagePlus className="w-4 h-4" />
          {values.length > 0 ? "Add More Images" : "Upload Certificate Images"}
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            disabled={uploading}
            onChange={(e) => e.target.files && e.target.files.length > 0 && handleUpload(e.target.files)}
          />
        </label>
        {uploading && <span className="text-xs text-muted-foreground animate-pulse">Uploading...</span>}
      </div>

      {values.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
          No images yet. Upload one or more certificate images.
        </p>
      )}
    </div>
  );
};

const ListEditor = ({
  label,
  items,
  fields,
  onChange,
}: {
  label: string;
  items: Record<string, string>[];
  fields: { key: string; label: string; type?: string }[];
  onChange: (items: Record<string, string>[]) => void;
}) => {
  const addItem = () => {
    const empty: Record<string, string> = {};
    fields.forEach((f) => (empty[f.key] = ""));
    onChange([...items, empty]);
  };

  const updateItem = (idx: number, key: string, value: string) => {
    const updated = [...items];
    updated[idx] = { ...updated[idx], [key]: value };
    onChange(updated);
  };

  const removeItem = (idx: number) => {
    onChange(items.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-foreground">{label}</label>
        <Button type="button" size="sm" variant="outline" onClick={addItem} className="gap-1">
          <Plus className="w-3 h-3" /> Add Item
        </Button>
      </div>
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={idx} className="border border-border rounded-lg p-3 space-y-2 relative bg-muted/30">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-muted-foreground">Item {idx + 1}</span>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="text-destructive h-7 w-7 p-0"
                onClick={() => removeItem(idx)}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            {fields.map((f) => (
              <div key={f.key}>
                <label className="text-xs text-muted-foreground">{f.label}</label>
                {f.type === "textarea" ? (
                  <Textarea
                    value={item[f.key] || ""}
                    onChange={(e) => updateItem(idx, f.key, e.target.value)}
                    rows={2}
                  />
                ) : (
                  <Input
                    value={item[f.key] || ""}
                    onChange={(e) => updateItem(idx, f.key, e.target.value)}
                  />
                )}
              </div>
            ))}
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed border-border rounded-lg">
            No items yet. Click "Add Item" to start.
          </p>
        )}
      </div>
    </div>
  );
};

const pageConfigs: Record<string, { label: string; sections: { key: string; label: string; fields: { key: string; label: string; type: "text" | "textarea" | "image" | "images" | "list"; listFields?: { key: string; label: string; type?: string }[] }[] }[] }> = {
  home: {
    label: "Home",
    sections: [
      {
        key: "hero",
        label: "🏠 Hero Section",
        fields: [
          { key: "badge_text", label: "Badge Text", type: "text" },
          { key: "heading", label: "Main Heading", type: "text" },
          { key: "subheading", label: "Subheading", type: "textarea" },
          { key: "cta1_text", label: "Button 1 Text", type: "text" },
          { key: "cta2_text", label: "Button 2 Text", type: "text" },
          { key: "bg_image", label: "Background Image", type: "image" },
        ],
      },
      {
        key: "about_short",
        label: "📊 About Short Section",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "stats", label: "Stats", type: "list", listFields: [{ key: "label", label: "Label" }, { key: "value", label: "Value" }] },
        ],
      },
      {
        key: "why_us",
        label: "⭐ Why Choose Us",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "items", label: "Items", type: "list", listFields: [{ key: "title", label: "Title" }, { key: "desc", label: "Description", type: "textarea" }] },
        ],
      },
      {
        key: "testimonials",
        label: "💬 Testimonials",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "items", label: "Testimonials", type: "list", listFields: [{ key: "name", label: "Name" }, { key: "role", label: "Role" }, { key: "text", label: "Review", type: "textarea" }] },
        ],
      },
      {
        key: "cta",
        label: "🔘 Call to Action Section",
        fields: [
          { key: "heading", label: "Heading", type: "text" },
          { key: "description", label: "Description", type: "textarea" },
          { key: "button_text", label: "Button Text", type: "text" },
        ],
      },
    ],
  },
  about: {
    label: "About",
    sections: [
      {
        key: "intro",
        label: "📝 Introduction",
        fields: [
          { key: "title", label: "Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "paragraph1", label: "Paragraph 1", type: "textarea" },
          { key: "paragraph2", label: "Paragraph 2", type: "textarea" },
          { key: "paragraph3", label: "Paragraph 3", type: "textarea" },
          { key: "image_url", label: "Image", type: "image" },
        ],
      },
      {
        key: "values",
        label: "🎯 Mission / Vision / Quality",
        fields: [
          { key: "items", label: "Cards", type: "list", listFields: [{ key: "title", label: "Title" }, { key: "desc", label: "Description", type: "textarea" }] },
        ],
      },
    ],
  },
  certifications: {
    label: "Certifications",
    sections: [
      {
        key: "main",
        label: "🏅 Certifications",
        fields: [
          { key: "title", label: "Page Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "certificate_images", label: "Certificate Images (Multiple)", type: "images" },
          { key: "certs", label: "Certificates", type: "list", listFields: [{ key: "title", label: "Title" }, { key: "desc", label: "Description", type: "textarea" }] },
        ],
      },
    ],
  },
  contact: {
    label: "Contact",
    sections: [
      {
        key: "main",
        label: "📞 Contact Info",
        fields: [
          { key: "title", label: "Page Title", type: "text" },
          { key: "subtitle", label: "Subtitle", type: "textarea" },
          { key: "form_title", label: "Form Title", type: "text" },
          { key: "maps_url", label: "Google Maps Embed URL", type: "text" },
        ],
      },
    ],
  },
};

const PagesAdmin = () => {
  const [activePage, setActivePage] = useState("home");
  const [sectionData, setSectionData] = useState<Record<string, Record<string, any>>>({});
  const [hasUnsaved, setHasUnsaved] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: pageContent, isLoading } = useQuery({
    queryKey: ["admin-page-content", activePage],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("page_content")
        .select("*")
        .eq("page", activePage);
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (pageContent) {
      const map: Record<string, Record<string, any>> = {};
      pageContent.forEach((row) => {
        const content = (row.content as Record<string, any>) || {};
        // Migration: if old single image_url exists for certifications, convert to array
        if (activePage === "certifications" && row.section === "main") {
          if (content.image_url && !content.certificate_images) {
            content.certificate_images = [content.image_url];
            delete content.image_url;
          }
        }
        map[row.section] = content;
      });
      setSectionData(map);
      setHasUnsaved(false);
    }
  }, [pageContent, activePage]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const [section, content] of Object.entries(sectionData)) {
        const { error } = await supabase
          .from("page_content")
          .upsert(
            { page: activePage, section, content: content as Json },
            { onConflict: "page,section" }
          );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-page-content", activePage] });
      queryClient.invalidateQueries({ queryKey: ["page-content", activePage] });
      setHasUnsaved(false);
      toast({ title: "Updated Successfully ✅", description: "Your changes are now live on the website." });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const updateField = (section: string, key: string, value: any) => {
    setSectionData((prev) => ({
      ...prev,
      [section]: { ...(prev[section] || {}), [key]: value },
    }));
    setHasUnsaved(true);
  };

  const config = pageConfigs[activePage];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Edit Pages</h1>
          <p className="text-sm text-muted-foreground mt-1">Edit any text, image, or section on your website</p>
        </div>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending || !hasUnsaved}
          size="lg"
          className="bg-gradient-accent font-semibold gap-2"
        >
          {saveMutation.isPending ? (
            <>Saving...</>
          ) : hasUnsaved ? (
            <><Save className="w-4 h-4" /> Save Changes</>
          ) : (
            <><CheckCircle className="w-4 h-4" /> All Saved</>
          )}
        </Button>
      </div>

      <Tabs value={activePage} onValueChange={(v) => { setActivePage(v); setHasUnsaved(false); }}>
        <TabsList className="flex flex-wrap h-auto gap-1 mb-6">
          {Object.entries(pageConfigs).map(([key, cfg]) => (
            <TabsTrigger key={key} value={key} className="text-sm px-4">
              {cfg.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {Object.entries(pageConfigs).map(([pageKey, cfg]) => (
          <TabsContent key={pageKey} value={pageKey}>
            {isLoading ? (
              <p className="text-muted-foreground">Loading content...</p>
            ) : (
              <div className="space-y-6 max-w-3xl">
                {cfg.sections.map((section) => (
                  <Card key={section.key}>
                    <CardHeader>
                      <CardTitle className="text-lg">{section.label}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      {section.fields.map((field) => {
                        const val = sectionData[section.key]?.[field.key];

                        if (field.type === "image") {
                          return (
                            <ImageUploadField
                              key={field.key}
                              label={field.label}
                              value={val || ""}
                              onChange={(url) => updateField(section.key, field.key, url)}
                            />
                          );
                        }

                        if (field.type === "images") {
                          return (
                            <MultiImageUploadField
                              key={field.key}
                              label={field.label}
                              values={Array.isArray(val) ? val : val ? [val] : []}
                              onChange={(urls) => updateField(section.key, field.key, urls)}
                            />
                          );
                        }

                        if (field.type === "list" && field.listFields) {
                          return (
                            <ListEditor
                              key={field.key}
                              label={field.label}
                              items={Array.isArray(val) ? val : []}
                              fields={field.listFields}
                              onChange={(items) => updateField(section.key, field.key, items)}
                            />
                          );
                        }

                        if (field.type === "textarea") {
                          return (
                            <div key={field.key}>
                              <label className="text-sm font-medium text-foreground mb-1 block">{field.label}</label>
                              <Textarea
                                value={val || ""}
                                onChange={(e) => updateField(section.key, field.key, e.target.value)}
                                rows={3}
                              />
                            </div>
                          );
                        }

                        return (
                          <div key={field.key}>
                            <label className="text-sm font-medium text-foreground mb-1 block">{field.label}</label>
                            <Input
                              value={val || ""}
                              onChange={(e) => updateField(section.key, field.key, e.target.value)}
                            />
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default PagesAdmin;
