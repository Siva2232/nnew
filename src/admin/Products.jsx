import React from "react";
import { useProducts } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import { Plus, Package, CheckCircle2, AlertCircle, Edit3, Trash2, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminProducts() {
  const { products, toggleAvailability } = useProducts();
  const navigate = useNavigate();

  const stats = [
    { label: "Total Inventory", value: products.length, icon: Package, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Live Items", value: products.filter(p => p.available).length, icon: CheckCircle2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Unavailable", value: products.length - products.filter(p => p.available).length, icon: AlertCircle, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div className="space-y-1">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Catalog Manager</h1>
          <p className="text-slate-500 font-medium">Configure your digital menu and inventory in real-time.</p>
        </div>
        
        <button
          onClick={() => navigate("/admin/products/add")}
          className="group flex items-center gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-800 transition-all duration-300 shadow-xl shadow-slate-200 active:scale-95"
        >
          <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
          Add Premium Product
        </button>
      </header>

      {/* Analytics Dashboard */}
      <section className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white border border-slate-100 p-6 rounded-[2rem] shadow-sm flex items-center gap-5">
            <div className={`${stat.bg} ${stat.color} p-4 rounded-2xl`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-3xl font-black text-slate-800 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Product Grid */}
      <main className="max-w-7xl mx-auto">
        <AnimatePresence mode="popLayout">
          {products.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white border-2 border-dashed border-slate-200 rounded-[3rem] py-20 text-center"
            >
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-slate-300" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Your vault is empty</h3>
              <p className="text-slate-500 mb-6">Start your collection by adding a new product above.</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} onToggle={toggleAvailability} />
              ))}
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

function ProductCard({ product, onToggle }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-slate-200 transition-all duration-500 overflow-hidden flex flex-col"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c"}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${!product.available && "grayscale opacity-60"}`}
        />
        
        {/* Availability Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter backdrop-blur-md shadow-sm border ${
            product.available 
            ? "bg-emerald-500/90 text-white border-emerald-400" 
            : "bg-slate-900/90 text-white border-slate-700"
          }`}>
            {product.available ? "In Stock" : "Out of Stock"}
          </span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center text-slate-500 font-bold">
            <IndianRupee size={14} strokeWidth={3} />
            <span className="text-lg tracking-tight">{product.price.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex flex-col gap-2">
            <button
              onClick={() => onToggle(product.id)}
              className={`w-full py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all duration-300 border-2 ${
                product.available 
                ? "bg-white border-slate-100 text-slate-600 hover:border-rose-200 hover:text-rose-500" 
                : "bg-emerald-50 border-emerald-100 text-emerald-600 hover:bg-emerald-600 hover:text-white"
              }`}
            >
              {product.available ? "In Stock" : "Out of Stock We back to you shortly"}
            </button>
            
            <div className="flex gap-2">
                <button className="flex-1 py-3 bg-slate-50 hover:bg-slate-100 rounded-xl flex justify-center text-slate-400 transition-colors">
                    <Edit3 size={16} />
                </button>
                <button className="flex-1 py-3 bg-rose-50 hover:bg-rose-100 rounded-xl flex justify-center text-rose-400 transition-colors">
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
      </div>
    </motion.div>
  );
}