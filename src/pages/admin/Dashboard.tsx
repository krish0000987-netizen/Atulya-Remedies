import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, MessageSquare, TrendingUp, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { data: productCount } = useQuery({
    queryKey: ["admin-product-count"],
    queryFn: async () => {
      const { count } = await supabase.from("products").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: inquiryCount } = useQuery({
    queryKey: ["admin-inquiry-count"],
    queryFn: async () => {
      const { count } = await supabase.from("inquiries").select("*", { count: "exact", head: true });
      return count ?? 0;
    },
  });

  const { data: newInquiries } = useQuery({
    queryKey: ["admin-new-inquiries"],
    queryFn: async () => {
      const { count } = await supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new");
      return count ?? 0;
    },
  });

  return (
    <div>
      <h1 className="text-2xl font-heading font-bold text-foreground mb-6">Dashboard</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Products</CardTitle>
            <Package className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{productCount ?? "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Inquiries</CardTitle>
            <MessageSquare className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{inquiryCount ?? "..."}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">New Inquiries</CardTitle>
            <TrendingUp className="h-5 w-5 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{newInquiries ?? "..."}</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/admin/pages">
          <Button className="bg-gradient-accent font-semibold gap-2">
            <FileText className="w-4 h-4" /> Edit Pages
          </Button>
        </Link>
        <Link to="/admin/products">
          <Button variant="outline">Add Product</Button>
        </Link>
        <Link to="/admin/inquiries">
          <Button variant="outline">View Inquiries</Button>
        </Link>
        <Link to="/admin/settings">
          <Button variant="outline">Settings</Button>
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;
