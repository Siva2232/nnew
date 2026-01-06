import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import ProductCard from "../components/ProductCard";
import RestaurantLoader from "../components/RestaurantLoader";
import { useSearchParams, Link } from "react-router-dom";
import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ShoppingCart,
  Utensils,
  Sparkles,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

export default function Menu() {
  const { products } = useProducts();
  const { addToCart, cart = [], table, setTable } = useCart();
  const [searchParams] = useSearchParams();

  const [searchQuery, setSearchQuery] = useState("");
  const [slide, setSlide] = useState(0);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const sectionRefs = useRef({});
  const [showLoader, setShowLoader] = useState(false);

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1600&q=80",
      title: "Art of Dining",
      subtitle: "Discover Flavors Beyond Boundaries",
    },
    {
      img: "https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=1600",
      title: "Purely Organic",
      subtitle: "Farm to Fork, Every Single Day",
    },
    {
       img: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
       title: "Chef's Special",
       subtitle: "Handcrafted Culinary Masterpieces",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  useEffect(() => {
    const t = searchParams.get("table");
    if (t) setTable(t);
  }, [searchParams, setTable]);

  const categories = useMemo(() => {
    const cats = products.map((p) => p.category || "Other");
    return ["All", ...new Set(cats)];
  }, [products]);

  const totalItems = cart.reduce(
    (sum, item) => sum + (item.qty || item.quantity || 1),
    0
  );

  const suggestions = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) return [];
    const q = trimmed.toLowerCase();
    return products
      .filter((p) => (p.name?.toLowerCase() || "").includes(q))
      .slice(0, 6);
  }, [products, searchQuery]);

  useEffect(() => {
    const hasShown = sessionStorage.getItem("menuLoaderShown");
    if (!hasShown) {
      setShowLoader(true);
      const timer = setTimeout(() => {
        sessionStorage.setItem("menuLoaderShown", "true");
        setShowLoader(false);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
      <AnimatePresence>
        {showLoader && <RestaurantLoader />}
      </AnimatePresence>

      {!showLoader && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col flex-1">
          {/* --- ULTRA MODERN HEADER --- */}
          <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-100 shadow-sm h2">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-200">
                    <Utensils className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tighter uppercase leading-none">The Menu</h1>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-1">Est. 2024 • Organic</p>
                  </div>
                </div>

                {table && (
                  <div className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-xl shadow-xl">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest">Table {table}</span>
                  </div>
                )}
              </div>

              {/* Enhanced Search */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search size={18} strokeWidth={2.5} />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="What are you craving?"
                  className="w-full pl-12 pr-12 py-3.5 rounded-2xl bg-slate-100/50 border-none text-sm font-semibold focus:ring-2 focus:ring-slate-900/10 transition-all placeholder:text-slate-400"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900">
                    <X size={18} strokeWidth={2.5} />
                  </button>
                )}
              </div>
            </div>

            {/* Premium Category Bar */}
            <div className="border-t border-slate-50 py-3 bg-white/50">
              <div className="max-w-7xl mx-auto px-4 overflow-x-auto no-scrollbar">
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        if (cat === "All") window.scrollTo({ top: 0, behavior: "smooth" });
                        else sectionRefs.current[cat]?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }}
                      className="px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all border border-slate-100 bg-white text-slate-500 hover:border-slate-900 hover:text-slate-900 active:scale-95 shadow-sm"
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </header>

          {/* --- CINEMATIC HERO --- */}
          {!searchQuery && (
            <div className="relative h-[45vh] overflow-hidden">
              <div className="absolute inset-0 flex transition-transform duration-1000 ease-in-out" style={{ transform: `translateX(-${slide * 100}%)` }}>
                {slides.map((s, i) => (
                  <div key={i} className="w-full h-full flex-shrink-0 relative">
                    <img src={s.img} className="w-full h-full object-cover scale-105" alt={s.title} />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-12 left-6 right-6 max-w-7xl mx-auto">
                        <motion.span initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="text-orange-400 text-[10px] font-black uppercase tracking-[0.4em]">Seasonal Menu</motion.span>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mt-2">{s.title}</h2>
                        <p className="text-slate-300 text-sm font-medium mt-1">{s.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- MENU LIST --- */}
          <main className="max-w-7xl mx-auto w-full px-4 py-12 pb-40">
            {(() => {
              const q = searchQuery.toLowerCase().trim();
              const catList = categories.filter((c) => c !== "All").sort();
              const sections = [];
              let foundMatch = false;

              catList.forEach((cat) => {
                const filtered = products.filter((p) => 
                    ((p.category || "Other") === cat) && 
                    (p.name?.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q))
                );

                if (filtered.length > 0) {
                  foundMatch = true;
                  sections.push(
                    <section key={cat} ref={(el) => (sectionRefs.current[cat] = el)} className="mb-20 scroll-mt-48">
                      <div className="flex items-end justify-between mb-8 border-b-2 border-slate-900/5 pb-4">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.3em] mb-1">Collection</span>
                            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">{cat}</h2>
                        </div>
                        <span className="text-xs font-black text-slate-300">{filtered.length} Dishes</span>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-10">
                        {filtered.map((product, idx) => (
                          <motion.div 
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                          >
                            <ProductCard 
                                product={product} 
                                onAdd={() => product.available !== false && addToCart(product)} 
                            />
                          </motion.div>
                        ))}
                      </div>
                    </section>
                  );
                }
              });

              if (!foundMatch) {
                return (
                  <div className="flex flex-col items-center justify-center py-20">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                      <Search className="text-slate-300" size={32} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 uppercase">No Dishes Found</h3>
                    <p className="text-slate-400 text-sm mt-1">Try a different keyword or category.</p>
                  </div>
                );
              }
              return sections;
            })()}
          </main>

          {/* --- FLOATING CART --- */}
          <AnimatePresence>
            {totalItems > 0 && (
              <motion.div initial={{ y: 100 }} animate={{ y: 0 }} exit={{ y: 100 }} className="fixed bottom-6 inset-x-4 z-50 flex justify-center pointer-events-none">
                <Link to={`/cart${table ? `?table=${table}` : ""}`} className="pointer-events-auto group">
                  <div className="bg-slate-950 text-white px-8 py-4 rounded-[2rem] flex items-center gap-8 shadow-2xl transition-all hover:scale-[1.02] active:scale-95">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <ShoppingCart size={24} />
                            <span className="absolute -top-3 -right-3 bg-orange-500 text-[10px] font-black w-6 h-6 flex items-center justify-center rounded-full border-2 border-slate-950">
                                {totalItems}
                            </span>
                        </div>
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Items Added</p>
                            <p className="text-sm font-bold leading-none italic">View Selection</p>
                        </div>
                    </div>
                    <div className="w-[1px] h-8 bg-slate-800" />
                    <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}