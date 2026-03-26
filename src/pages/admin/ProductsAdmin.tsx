import { useEffect, useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Upload, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface ProductForm {
  name: string;
  tagline: string;
  category: string;
  price: string;
  rating: number;
  description: string;
  benefits: string;
  status: string;
  existingImageUrl: string;
}

const emptyForm: ProductForm = {
  name: "",
  tagline: "",
  category: "Syrup",
  price: "",
  rating: 4.0,
  description: "",
  benefits: "",
  status: "active",
  existingImageUrl: "",
};

const ProductsAdmin = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  const { 
    adminProducts: products, 
    isAdminLoading: isLoading, 
    isError, 
    errorMessage, 
    fetchAdminProducts,
    addProduct,
    updateProduct,
    deleteProduct
  } = useProductStore();

  useEffect(() => {
    fetchAdminProducts();
  }, []);

  const uploadImage = async (file: File): Promise<string> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("product-images").upload(path, file);
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const payload = {
        name: form.name,
        tagline: form.tagline,
        category: form.category,
        price: form.price,
        rating: form.rating,
        description: form.description,
        benefits: form.benefits.split("\n").filter(Boolean),
        status: form.status,
        ...(imageUrl ? { image_url: imageUrl } : {}),
      };

      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await addProduct(payload);
      }

      setDialogOpen(false);
      setEditingId(null);
      setForm(emptyForm);
      setImageFile(null);
      setImagePreview("");
      toast({ title: editingId ? "Product Updated ✅" : "Product Added ✅" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id);
      toast({ title: "Product Deleted ✅" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const openEdit = (product: any) => {
    setEditingId(product.id);
    setForm({
      name: product.name,
      tagline: product.tagline || "",
      category: product.category || "Syrup",
      price: product.price || "",
      rating: product.rating || 4.0,
      description: product.description || "",
      benefits: (product.benefits || []).join("\n"),
      status: product.status || "active",
      existingImageUrl: product.image_url || "",
    });
    setImageFile(null);
    setImagePreview("");
    setDialogOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setForm(emptyForm);
    setImageFile(null);
    setImagePreview("");
    setDialogOpen(true);
  };

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const currentPreviewImage = imagePreview || form.existingImageUrl;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Products</h1>
          <p className="text-sm text-muted-foreground mt-1">Add, edit, or remove products from your website</p>
        </div>
        <Button onClick={openAdd} className="bg-gradient-accent font-semibold gap-2" size="lg">
          <Plus className="w-4 h-4" /> Add Product
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary mx-auto mb-3" />
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-16 text-destructive">
          <p className="text-lg font-medium">Failed to load products</p>
          <p className="text-sm">{errorMessage}</p>
        </div>
      ) : !products?.length ? (
        <div className="text-center py-16 text-muted-foreground">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p className="text-lg font-medium">No products yet</p>
          <p className="text-sm">Click "Add Product" to get started</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((p) => (
            <Card key={p.id} className={p.status === "inactive" ? "opacity-60" : ""}>
              <CardHeader className="pb-2">
                {p.image_url ? (
                  <img src={p.image_url} alt={p.name} className="w-full h-40 object-contain rounded mb-2 bg-muted" />
                ) : (
                  <div className="w-full h-40 bg-muted rounded mb-2 flex items-center justify-center text-muted-foreground">
                    <ImageIcon className="w-8 h-8" />
                  </div>
                )}
                <CardTitle className="text-lg">{p.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{p.tagline} • {p.category} • {p.price}</p>
                {p.status === "inactive" && (
                  <span className="inline-block text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded-full w-fit">Inactive</span>
                )}
              </CardHeader>
              <CardContent className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => openEdit(p)} className="gap-1 flex-1">
                  <Pencil className="w-3 h-3" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive" className="gap-1">
                      <Trash2 className="w-3 h-3" /> Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete "{p.name}"?</AlertDialogTitle>
                      <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(p.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">{editingId ? "Edit Product" : "Add New Product"}</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
            className="space-y-4"
          >
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Product Name *</label>
              <Input placeholder="e.g. Yazyme Syrup" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Tagline</label>
              <Input placeholder="e.g. Digestive Enzyme Syrup" value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Category</label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Syrup">Syrup</SelectItem>
                    <SelectItem value="Capsule">Capsule</SelectItem>
                    <SelectItem value="Tablet">Tablet</SelectItem>
                    <SelectItem value="Cream">Cream</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Price</label>
                <Input placeholder="e.g. ₹140 / 200ml" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Rating</label>
                <Input type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: parseFloat(e.target.value) })} />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Status</label>
                <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
              <Textarea placeholder="Product description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Benefits (one per line)</label>
              <Textarea placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3" value={form.benefits} onChange={(e) => setForm({ ...form, benefits: e.target.value })} rows={4} />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Product Image</label>
              {currentPreviewImage && (
                <div className="mb-2">
                  <img src={currentPreviewImage} alt="Preview" className="w-full max-w-[200px] h-32 object-contain rounded border border-border bg-muted" />
                  <p className="text-xs text-muted-foreground mt-1">{imageFile ? "New image (preview)" : "Current image"}</p>
                </div>
              )}
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-secondary/10 text-secondary rounded-md hover:bg-secondary/20 transition-colors text-sm font-medium">
                <Upload className="w-4 h-4" />
                {currentPreviewImage ? "Replace Image" : "Upload Image"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleImageSelect(e.target.files[0])}
                />
              </label>
            </div>
            <Button type="submit" className="w-full bg-gradient-accent font-semibold" size="lg" disabled={isSaving}>
              {isSaving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsAdmin;
