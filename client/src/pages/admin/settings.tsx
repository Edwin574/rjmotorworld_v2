import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AdminAuthContext";
import { useLocation } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { CarBrand, CarModel } from "@shared/schema";

const AdminSettingsPage = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const [, navigate] = useLocation();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isAuthenticated) navigate("/admin");
  }, [isAuthenticated, navigate]);

  const { data: brands = [] } = useQuery<CarBrand[]>({
    queryKey: ["/api/admin/brands"],
    enabled: isAuthenticated,
    queryFn: async () => {
      const res = await fetch("/api/admin/brands", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) throw new Error("Failed to load brands");
      return res.json();
    },
  });

  const [brandName, setBrandName] = useState("");
  const [brandLogo, setBrandLogo] = useState("");
  const [modelName, setModelName] = useState("");
  const [modelBrandId, setModelBrandId] = useState<number | "">("");

  const createBrand = async () => {
    if (!brandName.trim()) return;
    const res = await fetch("/api/admin/brands", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: brandName.trim(), logoUrl: brandLogo || null }),
    });
    if (res.ok) {
      setBrandName("");
      setBrandLogo("");
      queryClient.invalidateQueries({ queryKey: ["/api/admin/brands"] });
    }
  };

  const createModel = async () => {
    if (!modelName.trim() || !modelBrandId) return;
    const res = await fetch("/api/admin/models", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ name: modelName.trim(), brandId: Number(modelBrandId) }),
    });
    if (res.ok) {
      setModelName("");
      setModelBrandId("");
    }
  };

  if (!isAuthenticated) return null;

  return (
    <section className="py-10 bg-primary-white">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-secondary-color">Admin Settings</h1>

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
              <Button onClick={createBrand} className="bg-primary">Save Brand</Button>
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
              <Button onClick={createModel} className="bg-primary">Save Model</Button>
            </div>

            {modelBrandId && (
              <>
                <h3 className="text-lg font-semibold mt-8 mb-2">Models for {brands.find(b => b.id === modelBrandId as number)?.name}</h3>
                <BrandModels brandId={modelBrandId as number} accessToken={accessToken || ''} />
              </>
            )}
          </div>
        </div>
      </div>
    </section>
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


