import { useState, useCallback, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, Trash2, Copy, Check, ImageIcon, CloudUpload, X } from "lucide-react";
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

interface UploadItem {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "done" | "error";
  error?: string;
}

const MediaAdmin = () => {
  const [uploads, setUploads] = useState<UploadItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: files, isLoading } = useQuery({
    queryKey: ["admin-media"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from("site-media").list("pages", {
        sortBy: { column: "created_at", order: "desc" },
      });
      if (error) throw error;

      const { data: productFiles } = await supabase.storage.from("product-images").list("", {
        sortBy: { column: "created_at", order: "desc" },
      });

      const siteMediaItems = (data || []).map((f) => ({
        ...f,
        bucket: "site-media",
        folder: "pages/",
        publicUrl: supabase.storage.from("site-media").getPublicUrl(`pages/${f.name}`).data.publicUrl,
      }));

      const productItems = (productFiles || []).map((f) => ({
        ...f,
        bucket: "product-images",
        folder: "",
        publicUrl: supabase.storage.from("product-images").getPublicUrl(f.name).data.publicUrl,
      }));

      return [...siteMediaItems, ...productItems];
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

    let successCount = 0;
    let failCount = 0;

    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i];
      const uploadIndex = uploads.length + i;

      setUploads((prev) =>
        prev.map((u, idx) => (idx === uploadIndex ? { ...u, status: "uploading", progress: 30 } : u))
      );

      try {
        const ext = file.name.split(".").pop();
        const path = `pages/${Date.now()}-${Math.random().toString(36).slice(2, 6)}.${ext}`;
        const { error } = await supabase.storage.from("site-media").upload(path, file);
        if (error) throw error;

        setUploads((prev) =>
          prev.map((u, idx) => (idx === uploadIndex ? { ...u, status: "done", progress: 100 } : u))
        );
        successCount++;
      } catch (err: any) {
        setUploads((prev) =>
          prev.map((u, idx) =>
            idx === uploadIndex ? { ...u, status: "error", progress: 0, error: err.message } : u
          )
        );
        failCount++;
      }
    }

    queryClient.invalidateQueries({ queryKey: ["admin-media"] });

    if (successCount > 0) {
      toast({ title: `${successCount} image${successCount > 1 ? "s" : ""} uploaded ✅` });
    }
    if (failCount > 0) {
      toast({ title: `${failCount} upload${failCount > 1 ? "s" : ""} failed`, variant: "destructive" });
    }

    // Clear completed uploads after 3s
    setTimeout(() => {
      setUploads((prev) => prev.filter((u) => u.status !== "done"));
    }, 3000);
  }, [uploads.length, queryClient, toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
      e.target.value = "";
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const droppedFiles = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith("image/")
      );
      if (droppedFiles.length) {
        processFiles(droppedFiles);
      } else {
        toast({ title: "Only image files are allowed", variant: "destructive" });
      }
    },
    [processFiles, toast]
  );

  const deleteMutation = useMutation({
    mutationFn: async ({ bucket, folder, name }: { bucket: string; folder: string; name: string }) => {
      const { error } = await supabase.storage.from(bucket).remove([`${folder}${name}`]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-media"] });
      toast({ title: "Image Deleted" });
    },
  });

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
    toast({ title: "URL Copied!" });
  };

  const isUploading = uploads.some((u) => u.status === "uploading" || u.status === "pending");

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Media Library</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload and manage images for your website
          </p>
        </div>
        <Button
          onClick={() => fileInputRef.current?.click()}
          className="bg-gradient-accent font-semibold gap-2"
          disabled={isUploading}
        >
          <Upload className="w-4 h-4" />
          {isUploading ? "Uploading..." : "Upload Images"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFileInput}
        />
      </div>

      {/* Drag & Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`mb-6 border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? "border-secondary bg-secondary/10 scale-[1.01]"
            : "border-border hover:border-secondary/50 hover:bg-muted/50"
        }`}
      >
        <CloudUpload className={`w-10 h-10 mx-auto mb-3 ${isDragging ? "text-secondary" : "text-muted-foreground"}`} />
        <p className="text-sm font-medium text-foreground">
          {isDragging ? "Drop images here!" : "Drag & drop images here, or click to browse"}
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Supports JPG, PNG, WEBP • Multiple files allowed
        </p>
      </div>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="mb-6 space-y-2">
          <p className="text-sm font-medium text-foreground">
            Uploads ({uploads.filter((u) => u.status === "done").length}/{uploads.length})
          </p>
          {uploads.map((u, i) => (
            <div key={i} className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border">
              <div className="w-8 h-8 rounded bg-muted flex items-center justify-center flex-shrink-0">
                {u.status === "done" ? (
                  <Check className="w-4 h-4 text-secondary" />
                ) : u.status === "error" ? (
                  <X className="w-4 h-4 text-destructive" />
                ) : (
                  <ImageIcon className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs truncate text-foreground">{u.file.name}</p>
                {u.status === "error" ? (
                  <p className="text-xs text-destructive">{u.error}</p>
                ) : (
                  <Progress value={u.progress} className="h-1.5 mt-1" />
                )}
              </div>
              <span className="text-xs text-muted-foreground flex-shrink-0">
                {(u.file.size / 1024).toFixed(0)} KB
              </span>
            </div>
          ))}
        </div>
      )}

      {/* File Grid */}
      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-3" />
          <p className="text-muted-foreground">Loading media...</p>
        </div>
      ) : !files?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No images uploaded yet</p>
          <p className="text-sm">Use the upload button or drag & drop to add images</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground mb-3">{files.length} image{files.length !== 1 ? "s" : ""}</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {files.map((file) => (
              <Card key={`${file.bucket}-${file.name}`} className="overflow-hidden group">
                <div className="aspect-square bg-muted">
                  <img
                    src={file.publicUrl}
                    alt={file.name}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-2 space-y-1">
                  <p className="text-xs text-muted-foreground truncate">{file.name}</p>
                  <span className="inline-block text-[10px] bg-muted px-1.5 py-0.5 rounded text-muted-foreground">
                    {file.bucket}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 text-xs flex-1 gap-1"
                      onClick={() => copyUrl(file.publicUrl)}
                    >
                      {copiedUrl === file.publicUrl ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      Copy URL
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="h-7 w-7 p-0">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this image?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This cannot be undone. Pages using this image will show broken images.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              deleteMutation.mutate({ bucket: file.bucket, folder: file.folder, name: file.name })
                            }
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default MediaAdmin;
