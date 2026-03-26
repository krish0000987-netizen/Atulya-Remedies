import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

const settingsFields = [
  { key: "website_name", label: "Website Name", type: "text" },
  { key: "phone_primary", label: "Primary Phone", type: "tel" },
  { key: "phone_alt1", label: "Alternative Phone 1", type: "tel" },
  { key: "phone_alt2", label: "Alternative Phone 2", type: "tel" },
  { key: "whatsapp", label: "WhatsApp Number (with country code, no spaces)", type: "tel" },
  { key: "email1", label: "Email 1", type: "email" },
  { key: "email2", label: "Email 2", type: "email" },
  { key: "address", label: "Address", type: "textarea" },
];

const socialFields = [
  { key: "facebook_url", label: "Facebook URL", type: "url" },
  { key: "instagram_url", label: "Instagram URL", type: "url" },
  { key: "youtube_url", label: "YouTube URL", type: "url" },
  { key: "threads_url", label: "Threads URL", type: "url" },
  { key: "google_business_url", label: "Google Business URL", type: "url" },
  { key: "maps_embed_url", label: "Google Maps Embed URL", type: "url" },
];

const seoFields = [
  { key: "seo_title", label: "SEO Title", type: "text" },
  { key: "seo_description", label: "SEO Description", type: "textarea" },
];

const SettingsAdmin = () => {
  const [values, setValues] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: settings, isLoading } = useQuery({
    queryKey: ["admin-settings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (settings) {
      const map: Record<string, string> = {};
      settings.forEach((s) => {
        map[s.key] = s.value || "";
      });
      setValues(map);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async () => {
      for (const [key, value] of Object.entries(values)) {
        const { error } = await supabase
          .from("site_settings")
          .upsert({ key, value }, { onConflict: "key" });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-settings"] });
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast({ title: "Settings Saved ✅" });
    },
    onError: (err: Error) => {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    },
  });

  const renderFields = (fields: typeof settingsFields) =>
    fields.map((field) => (
      <div key={field.key}>
        <label className="text-sm font-medium text-foreground mb-1 block">{field.label}</label>
        {field.type === "textarea" ? (
          <Textarea
            value={values[field.key] || ""}
            onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
            rows={3}
          />
        ) : (
          <Input
            type={field.type}
            value={values[field.key] || ""}
            onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}
          />
        )}
      </div>
    ));

  if (isLoading) return <p className="text-muted-foreground">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-heading font-bold text-foreground">Settings</h1>
        <Button
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          size="lg"
          className="bg-gradient-accent font-semibold gap-2"
        >
          <Save className="w-4 h-4" />
          {saveMutation.isPending ? "Saving..." : "Save All"}
        </Button>
      </div>

      <div className="space-y-4 max-w-2xl">
        <Card>
          <CardHeader><CardTitle className="text-lg">Contact Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">{renderFields(settingsFields)}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Social Media Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">{renderFields(socialFields)}</CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">SEO Settings</CardTitle></CardHeader>
          <CardContent className="space-y-4">{renderFields(seoFields)}</CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsAdmin;
