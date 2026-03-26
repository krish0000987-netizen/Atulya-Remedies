import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Phone, MapPin, Trash2, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const InquiriesAdmin = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: inquiries, isLoading } = useQuery({
    queryKey: ["admin-inquiries"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inquiries")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const markRead = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inquiries").update({ status: "read" }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] }),
  });

  const deleteInquiry = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("inquiries").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-inquiries"] });
      toast({ title: "Inquiry Deleted" });
    },
  });

  const openWhatsApp = (phone: string, name: string) => {
    const msg = encodeURIComponent(`Hello ${name}, thank you for contacting Atulya Remedies!`);
    window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${msg}`, "_blank");
  };

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Inquiries</h1>

      {isLoading ? (
        <p className="text-muted-foreground">Loading...</p>
      ) : inquiries?.length === 0 ? (
        <p className="text-muted-foreground">No inquiries yet.</p>
      ) : (
        <div className="space-y-3">
          {inquiries?.map((inq) => (
            <Card key={inq.id} className={inq.status === "new" ? "border-secondary/50 bg-secondary/5" : ""}>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-heading font-semibold text-foreground">{inq.name}</span>
                      <Badge variant={inq.status === "new" ? "default" : "secondary"} className="text-xs">
                        {inq.status}
                      </Badge>
                    </div>
                    {inq.phone && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" /> {inq.phone}
                      </div>
                    )}
                    {inq.city && (
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="w-3 h-3" /> {inq.city}
                      </div>
                    )}
                    {inq.message && (
                      <p className="text-sm text-muted-foreground mt-2">{inq.message}</p>
                    )}
                    <p className="text-xs text-muted-foreground/60 mt-1">
                      {new Date(inq.created_at).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {inq.phone && (
                      <Button size="sm" variant="outline" onClick={() => openWhatsApp(inq.phone!, inq.name)} className="gap-1 text-secondary border-secondary">
                        <MessageSquare className="w-3 h-3" /> WhatsApp
                      </Button>
                    )}
                    {inq.status === "new" && (
                      <Button size="sm" variant="outline" onClick={() => markRead.mutate(inq.id)} className="gap-1">
                        <Check className="w-3 h-3" /> Mark Read
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" className="gap-1">
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete this inquiry?</AlertDialogTitle>
                          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteInquiry.mutate(inq.id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InquiriesAdmin;
