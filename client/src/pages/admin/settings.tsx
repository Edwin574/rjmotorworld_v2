import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AdminAuthContext";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { CarBrand, CarModel } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

const AdminSettingsPage = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  useEffect(() => {}, []);

  const { data: brands = [] } = useQuery<CarBrand[]>({
    queryKey: ["/api/brands"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await fetch("/api/brands");
      if (!res.ok) throw new Error("Failed to load brands");
      return res.json();
    },
  });

  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [modelName, setModelName] = useState("");
  const [modelBrandId, setModelBrandId] = useState<number | "">("");
  const [savingBrand, setSavingBrand] = useState(false);
  const [savingModel, setSavingModel] = useState(false);

  const createBrand = async () => {
    if (!brandName.trim()) return;
    try {
      setSavingBrand(true);
      const body: any = { name: brandName.trim() };
      if (brandLogo.trim()) body.logoUrl = brandLogo.trim();

      const res = await fetch("/api/admin/brands", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create brand");
      }
      setBrandName("");
      setBrandLogo("");
      queryClient.invalidateQueries({ queryKey: ["/api/brands"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brands"] });
      toast({ title: "Brand added", description: "The brand was created successfully." });
    } catch (e: any) {
      toast({ title: "Failed to add brand", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSavingBrand(false);
    }
  };

  const createModel = async () => {
    if (!modelName.trim() || !modelBrandId) return;
    try {
      setSavingModel(true);
      const res = await fetch("/api/admin/models", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ name: modelName.trim(), brandId: Number(modelBrandId) }),
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Failed to create model");
      }
      setModelName("");
      // keep selected brand to view newly added model
      queryClient.invalidateQueries({ queryKey: ["/api/admin/models", { brandId: Number(modelBrandId) }] });
      queryClient.invalidateQueries({ queryKey: ["/api/models"] });
      toast({ title: "Model added", description: "The model was created successfully." });
    } catch (e: any) {
      toast({ title: "Failed to add model", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSavingModel(false);
    }
  };

  if (!isAuthenticated) return null;

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar activePage="settings" />
        <div className="flex-1 overflow-x-hidden">
          <AdminHeader title="Settings" />
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add Car Brand</h2>
            <div className="space-y-4">
              <div>
                <Label>Brand Name</Label>
                <Input value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="e.g., Audi" />
              </div>
              <div>
                <Label>Logo URL (optional)</Label>
                <Input value={brandLogo} onChange={(e) => setBrandLogo(e.target.value)} placeholder="https://..." />
              </div>
              <Button onClick={createBrand} disabled={savingBrand} className="bg-primary">
                {savingBrand ? 'Saving...' : 'Save Brand'}
              </Button>
            </div>

            <h3 className="text-lg font-semibold mt-8 mb-2">Existing Brands</h3>
            <ul className="space-y-2">
              {brands.map((b) => (
                <li key={b.id} className="flex items-center gap-3">
                  {b.logoUrl ? <img src={b.logoUrl} className="w-6 h-6 object-contain" /> : <div className="w-6 h-6 bg-gray-200" />}
                  <span>{b.name}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Add Car Model</h2>
            <div className="space-y-4">
              <div>
                <Label>Model Name</Label>
                <Input value={modelName} onChange={(e) => setModelName(e.target.value)} placeholder="e.g., A4" />
              </div>
              <div>
                <Label>Brand</Label>
                <select
                  value={modelBrandId}
                  onChange={(e) => setModelBrandId(e.target.value ? Number(e.target.value) : "")}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="">Select a brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
              </div>
              <Button onClick={createModel} disabled={savingModel} className="bg-primary">
                {savingModel ? 'Saving...' : 'Save Model'}
              </Button>
            </div>

            {modelBrandId && (
              <div>
                <h3 className="text-lg font-semibold mt-8 mb-2">Models for {brands.find(b => b.id === modelBrandId as number)?.name}</h3>
                <BrandModels brandId={modelBrandId as number} accessToken={accessToken || ''} />
              </div>
            )}
            </div>
          </div>
        </div>
      </div>
      </div>
    </ProtectedRoute>
  );
};

const BrandModels = ({ brandId, accessToken }: { brandId: number; accessToken: string }) => {
  const { data: models = [] } = useQuery<CarModel[]>({
    queryKey: ["/api/admin/models", { brandId }],
    queryFn: async () => {
      const u = new URL("/api/admin/models", window.location.origin);
      u.searchParams.set("brandId", String(brandId));
      const res = await fetch(u.pathname + u.search, { headers: { Authorization: `Bearer ${accessToken}` } });
      if (!res.ok) throw new Error("Failed to load models");
      return res.json();
    },
  });

  return (
    <ul className="space-y-2">
      {models.map((m) => (
        <li key={m.id} className="px-3 py-2 bg-gray-50 rounded">{m.name}</li>
      ))}
      {models.length === 0 && <li className="text-gray-500">No models yet for this brand.</li>}
    </ul>
  );
};

export default AdminSettingsPage;


