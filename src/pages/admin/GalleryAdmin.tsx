import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, ImageIcon, CloudUpload, X, Check, ArrowLeft } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Link } from "react-router-dom";

interface UploadItem {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

const GalleryAdmin = () => {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: images, isLoading } = useQuery({
    queryKey: ["admin-gallery"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("site-media").list("gallery", {
        sortBy: { column: "created_at", order: "desc" },
      });
      if (error) throw error;

      return (data || []).map((f) => ({
        ...f,
        publicUrl: supabase.storage.from("site-media").getPublicUrl(`gallery/${f.name}`).data.publicUrl,
      }));
    },
  });

  const processFiles = useCallback(async (fileList: File[]) => {
    if (!fileList.length) return;

    const newUploads: UploadItem[] = fileList.map((file) => ({
      file,
      progress: 0,
      status: "pending" as const,
    }));

    setUploads((prev) => [...prev, ...newUploads]);

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const uploadIndex = uploads.length + i;

      setUploads((prev) =>
        prev.map((u, idx) => (idx === uploadIndex ? { ...u, status: "uploading", progress: 30 } : u))
      );

      try {
        const ext = file.name.split(".").pop();
        const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
        const { error } = await supabase.storage.from("site-media").upload(path, file);
        if (error) throw error;

        setUploads((prev) =>
          prev.map((u, idx) => (idx === uploadIndex ? { ...u, status: "done", progress: 100 } : u))
        );
      } catch (err: any) {
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === uploadIndex ? { ...u, status: "error", progress: 0, error: err.message } : u
          )
        );
      }
    }

    queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
    toast({ title: "Uploads processed!" });

    setTimeout(() => {
      setUploads((prev) => prev.filter((u) => u.status !== "done"));
    }, 2000);
  }, [uploads.length, queryClient, toast]);

  const deleteMutation = useMutation({
    mutationFn: async (name: string) => {
      const { error } = await supabase.storage.from("site-media").remove([`gallery/${name}`]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-gallery"] });
      toast({ title: "Photo removed from gallery" });
    },
  });

  const isUploading = uploads.some((u) => u.status === "uploading" || u.status === "pending");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="rounded-full">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-heading font-bold text-foreground">Gallery Manager</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage photos visible on the Public Gallery page</p>
          </div>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-secondary text-white font-semibold gap-2 h-11 px-6 rounded-xl"
          disabled={isUploading}
        >
          <Upload className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Add Photos"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => e.target.files && processFiles(Array.from(e.target.files))}
        />
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          const droppedFiles = Array.from(e.dataTransfer.files).filter((f) => f.type.startsWith("image/"));
          if (droppedFiles.length) processFiles(droppedFiles);
        }}
        className={`mb-10 border-2 border-dashed rounded-[2rem] p-12 text-center transition-all ${
          isDragging ? "border-secondary bg-secondary/5 scale-[1.01]" : "border-border bg-card/50 hover:bg-card"
        }`}
      >
        <CloudUpload className={`w-12 h-12 mx-auto mb-4 ${isDragging ? "text-secondary" : "text-muted-foreground"}`} />
        <h3 className="text-lg font-bold mb-1">Drag & drop photos here</h3>
        <p className="text-sm text-muted-foreground">Or click to browse from your computer</p>
      </div>

      {uploads.length > 0 && (
        <div className="mb-10 grid gap-4">
          {uploads.map((u, i) => (
            <div key={i} className="flex items-center gap-4 bg-muted/50 rounded-2xl p-4 border border-border">
              <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                {u.status === "done" ? <Check className="w-5 h-5 text-secondary" /> : <ImageIcon className="w-5 h-5 text-muted-foreground" />}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium truncate">{u.file.name}</p>
                <Progress value={u.progress} className="h-2 mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading photos...</p>
        </div>
      ) : !images?.length ? (
        <div className="text-center py-20 border-2 border-dashed border-border rounded-[2rem] bg-card">
          <ImageIcon className="w-14 h-14 mx-auto mb-4 opacity-10" />
          <p className="text-lg font-medium">No photos found in gallery</p>
          <p className="text-sm text-muted-foreground mt-1">Start by adding some pharmaceutical excellence!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {images.map((img) => (
            <Card key={img.name} className="overflow-hidden group rounded-2xl relative shadow-md">
              <div className="aspect-square bg-muted">
                <img src={img.publicUrl} alt={img.name} className="w-full h-full object-cover" />
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="destructive" className="h-10 w-10 rounded-xl shadow-lg">
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="rounded-2xl">
                    <AlertDialogHeader>
                      <AlertDialogTitle>Remove from gallery?</AlertDialogTitle>
                      <AlertDialogDescription>This photo will no longer be visible to visitors.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-xl">Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => deleteMutation.mutate(img.name)} className="rounded-xl bg-destructive">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default GalleryAdmin;
