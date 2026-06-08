"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type MedStatus = "active" | "inactive" | "low_stock";
type Category = "Churna" | "Capsule" | "Tablet" | "Ghrita" | "Syrup" | "Oil" | "Juice" | "Cream" | "Drop";

type Medicine = {
  id: string; name: string; brand: string; category: Category;
  description: string; price: number; stock: number; unit: string;
  discipline: string; status: MedStatus; sku: string; added: string;
};

const INITIAL: Medicine[] = [
  { id: "m1", name: "Ashwagandha Churna", brand: "Kottakkal Arya Vaidya Sala", category: "Churna", description: "Adaptogenic root for stress, immunity and vitality", price: 285, stock: 450, unit: "100g", discipline: "Ayurveda", status: "active", sku: "MVA-CHU-001", added: "10 Jan 2026" },
  { id: "m2", name: "Triphala Churna", brand: "Himalaya Wellness", category: "Churna", description: "Tri-fruit blend for digestion and detoxification", price: 145, stock: 320, unit: "100g", discipline: "Ayurveda", status: "active", sku: "MVA-CHU-002", added: "10 Jan 2026" },
  { id: "m3", name: "Brahmi Ghrita", brand: "Nagarjuna Herbal", category: "Ghrita", description: "Medicated ghee for cognitive function and memory", price: 410, stock: 18, unit: "150g", discipline: "Ayurveda", status: "low_stock", sku: "MVA-GHR-001", added: "15 Jan 2026" },
  { id: "m4", name: "Chyawanprash", brand: "Dabur", category: "Syrup", description: "Classic immunity tonic with Amla and 40+ herbs", price: 299, stock: 210, unit: "500g", discipline: "Ayurveda", status: "active", sku: "MVA-SYP-001", added: "20 Jan 2026" },
  { id: "m5", name: "Neem Capsules", brand: "Organic India", category: "Capsule", description: "Blood purifier and skin health support", price: 245, stock: 180, unit: "60 caps", discipline: "Ayurveda", status: "active", sku: "MVA-CAP-001", added: "01 Feb 2026" },
  { id: "m6", name: "Giloy Juice", brand: "Patanjali", category: "Juice", description: "Immune modulator and fever management", price: 159, stock: 90, unit: "500ml", discipline: "Ayurveda", status: "active", sku: "MVA-JUI-001", added: "05 Feb 2026" },
  { id: "m7", name: "Brahmi Oil", brand: "Bajaj Keo Karpin", category: "Oil", description: "Scalp nourishment and mental calm", price: 175, stock: 12, unit: "200ml", discipline: "Ayurveda", status: "low_stock", sku: "MVA-OIL-001", added: "10 Feb 2026" },
  { id: "m8", name: "Tulsi Drops", brand: "Himalaya", category: "Drop", description: "Respiratory support and immunity", price: 120, stock: 0, unit: "30ml", discipline: "Ayurveda", status: "inactive", sku: "MVA-DRP-001", added: "15 Feb 2026" },
];

const CATEGORIES: Category[] = ["Churna", "Capsule", "Tablet", "Ghrita", "Syrup", "Oil", "Juice", "Cream", "Drop"];
const DISCIPLINES = ["Ayurveda", "Homeopathy", "Unani", "Siddha", "Naturopathy"];

const STATUS_STYLE: Record<MedStatus, string> = {
  active: "bg-herb-green/10 text-herb-green",
  low_stock: "bg-amber-50 text-amber-700",
  inactive: "bg-red-50 text-red-600",
};

const STATUS_LABEL: Record<MedStatus, string> = {
  active: "Active",
  low_stock: "Low Stock",
  inactive: "Out of Stock",
};

const EMPTY_FORM = { name: "", brand: "", category: "Churna" as Category, description: "", price: "", stock: "", unit: "", discipline: "Ayurveda", sku: "" };

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("all");
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<Medicine | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const filtered = medicines.filter((m) => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.brand.toLowerCase().includes(search.toLowerCase()) ||
      m.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCat === "all" || m.category === filterCat;
    return matchSearch && matchCat;
  });

  function openAdd() { setForm(EMPTY_FORM); setEditItem(null); setShowForm(true); }
  function openEdit(m: Medicine) {
    setForm({ name: m.name, brand: m.brand, category: m.category, description: m.description, price: String(m.price), stock: String(m.stock), unit: m.unit, discipline: m.discipline, sku: m.sku });
    setEditItem(m);
    setShowForm(true);
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      const stockNum = Number(form.stock);
      const computedStatus: MedStatus = stockNum === 0 ? "inactive" : stockNum < 20 ? "low_stock" : "active";
      if (editItem) {
        setMedicines((prev) => prev.map((m) => m.id === editItem.id
          ? { ...m, ...form, price: Number(form.price), stock: stockNum, status: computedStatus }
          : m
        ));
      } else {
        setMedicines((prev) => [{
          id: `m${Date.now()}`, ...form,
          price: Number(form.price), stock: stockNum, status: computedStatus,
          added: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        }, ...prev]);
      }
      setShowForm(false);
      setSaving(false);
    }, 800);
  }

  function toggleActive(id: string) {
    setMedicines((prev) => prev.map((m) =>
      m.id === id ? { ...m, status: m.status === "active" ? "inactive" : "active" } : m
    ));
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 py-6 max-w-7xl mx-auto">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-foreground">Medicines & Apothecary</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{medicines.length} products · {medicines.filter(m => m.status === "low_stock").length} low stock · {medicines.filter(m => m.status === "inactive").length} out of stock</p>
        </div>
        <button onClick={openAdd} className="bg-herb-green text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-herb-green/90 transition-all active:scale-95 flex-shrink-0">
          + Add Medicine
        </button>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <input type="text" placeholder="Search by name, brand, SKU…" value={search} onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-48 px-3.5 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20 bg-white" />
        <select value={filterCat} onChange={e => setFilterCat(e.target.value)} className="px-3 py-2 text-sm border border-border rounded-xl focus:outline-none bg-white text-foreground">
          <option value="all">All Categories</option>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-background">
                <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Medicine</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Stock</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">SKU</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((m) => (
                <tr key={m.id} className="hover:bg-background transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{m.name}</p>
                    <p className="text-[10px] text-muted-foreground">{m.brand} · {m.unit}</p>
                  </td>
                  <td className="px-4 py-3.5">
                    <span className="text-xs bg-copper/10 text-copper px-2 py-0.5 rounded-full font-medium">{m.category}</span>
                  </td>
                  <td className="px-4 py-3.5 text-sm font-semibold text-foreground">₹{m.price}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("text-xs font-semibold", m.stock === 0 ? "text-red-500" : m.stock < 20 ? "text-amber-600" : "text-foreground")}>
                      {m.stock} units
                    </span>
                  </td>
                  <td className="px-4 py-3.5 font-mono text-xs text-muted-foreground">{m.sku}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn("text-[10px] font-semibold px-2.5 py-1 rounded-full", STATUS_STYLE[m.status])}>
                      {STATUS_LABEL[m.status]}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => openEdit(m)} className="text-[10px] font-semibold text-herb-green hover:underline">Edit</button>
                      <button onClick={() => toggleActive(m.id)} className={cn("text-[10px] font-semibold hover:underline", m.status === "active" ? "text-red-500" : "text-amber-600")}>
                        {m.status === "active" ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-sm text-muted-foreground">No medicines found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <h2 className="font-semibold text-foreground">{editItem ? "Edit Medicine" : "Add Medicine"}</h2>
              <button onClick={() => setShowForm(false)} className="text-muted-foreground hover:text-foreground">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <form onSubmit={handleSave} className="px-6 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Medicine Name</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Ashwagandha Churna" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Brand</label>
                  <input required value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="Brand name" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Category</label>
                  <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as Category }))} className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none bg-white">
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Discipline</label>
                  <select value={form.discipline} onChange={e => setForm(f => ({ ...f, discipline: e.target.value }))} className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none bg-white">
                    {DISCIPLINES.map(d => <option key={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Price (₹)</label>
                  <input required type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="0" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Stock (units)</label>
                  <input required type="number" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">Unit</label>
                  <input required value={form.unit} onChange={e => setForm(f => ({ ...f, unit: e.target.value }))} placeholder="e.g. 100g, 60 caps" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-foreground block mb-1">SKU</label>
                  <input required value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} placeholder="MVA-CAT-XXX" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20" />
                </div>
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-foreground block mb-1">Description</label>
                  <textarea rows={2} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Short description" className="w-full px-3 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-herb-green/20 resize-none" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2.5 border border-border rounded-xl text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" disabled={saving} className="flex-1 py-2.5 bg-herb-green text-white rounded-xl text-sm font-semibold hover:bg-herb-green/90 transition-all disabled:opacity-60">
                  {saving ? "Saving…" : editItem ? "Save Changes" : "Add Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
