import React, { useState, useEffect } from 'react';
import { useOrders } from "../context/OrderContext";
import {
  ShoppingBag, Activity, CheckCircle, Sparkles, Coffee,
  Clock, Flame, BellRing, ChevronRight, MessageSquare, Timer
} from "lucide-react";

const gradientMap = {
  Preparing: "from-amber-400 to-orange-500",
  Cooking: "from-orange-500 to-rose-500",
  Ready: "from-indigo-500 to-purple-600",
  Served: "from-emerald-500 to-teal-600",
};

const statusStep = { Preparing: 1, Cooking: 2, Ready: 3, Served: 4 };

const PremiumOrderCard = ({ order, updateOrderStatus, isCompleted = false }) => {
  const [timeAgo, setTimeAgo] = useState("");
  const total = order.items.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0);
  const status = order.status;
  const currentStep = statusStep[status] || 1;
  const gradient = gradientMap[status] || "from-slate-400 to-slate-600";

  // Real-time counter logic
  useEffect(() => {
    const update = () => {
      const diff = Math.floor((new Date() - new Date(order.createdAt)) / 60000);
      setTimeAgo(diff < 1 ? "Just now" : `${diff}m ago`);
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [order.createdAt]);

  return (
    <div className={`relative transition-all duration-500 ${isCompleted ? "opacity-75 scale-[0.98]" : "hover:-translate-y-1"}`}>
      
      {/* Background Glow Effect */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5 blur-2xl rounded-[2.5rem]`} />
      
      <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
        
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-50">
          <div 
            className={`h-full bg-gradient-to-r ${gradient} transition-all duration-1000 ease-out`}
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>

        <div className="p-6 sm:p-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div className="flex items-start gap-5">
              <div className={`h-16 w-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg`}>
                <span className="text-2xl font-black italic">{order.table}</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Table {order.table}</h3>
                <div className="flex items-center gap-3 mt-1 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
                  <span className="flex items-center gap-1"><Timer size={12}/> {timeAgo}</span>
                  <span>•</span>
                  <span>#{order.id.slice(-5)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-100">
               {["Preparing", "Cooking", "Ready", "Served"].map((s) => (
                 <div 
                   key={s}
                   className={`h-2 w-8 rounded-full transition-all duration-500 ${
                     statusStep[s] <= currentStep ? `bg-gradient-to-r ${gradientMap[s]}` : 'bg-slate-200'
                   }`}
                 />
               ))}
               <span className="ml-2 text-[10px] font-black uppercase text-slate-500 tracking-tighter pr-2">{status}</span>
            </div>
          </div>

          {/* Items Section */}
          <div className="grid md:grid-cols-2 gap-8 items-start">
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Order Items</p>
              {order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center group/item">
                  <div className="flex items-center gap-4">
                    <span className="h-8 w-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-xs font-black italic">
                      {item.qty}
                    </span>
                    <span className="font-bold text-slate-700">{item.name}</span>
                  </div>
                  <span className="text-slate-400 font-medium italic text-sm">₹{item.price * item.qty}</span>
                </div>
              ))}
              
              {/* Note highlight */}
              {order.notes && (
                <div className="mt-6 flex items-start gap-3 bg-orange-50 p-4 rounded-2xl border border-orange-100">
                  <MessageSquare className="text-orange-500 shrink-0" size={18} />
                  <p className="text-sm font-bold text-orange-700 italic">"{order.notes}"</p>
                </div>
              )}
            </div>

            {/* Quick Action Controller */}
            {!isCompleted && (
              <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 text-center">Move Status</p>
                <div className="flex flex-col gap-2">
                  {["Preparing", "Cooking", "Ready", "Served"].map((s) => {
                    const isCurrent = s === status;
                    const Icon = s === "Preparing" ? Clock : s === "Cooking" ? Flame : s === "Ready" ? BellRing : CheckCircle;
                    
                    return (
                      <button
                        key={s}
                        onClick={() => updateOrderStatus(order.id, s)}
                        className={`flex items-center justify-between px-5 py-4 rounded-xl font-black text-[11px] uppercase tracking-widest transition-all ${
                          isCurrent 
                            ? "bg-white text-slate-900 shadow-sm border border-slate-200 opacity-50 cursor-not-allowed" 
                            : "bg-white hover:bg-slate-900 hover:text-white text-slate-600 border border-slate-200 hover:border-slate-900 shadow-sm"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={16} className={isCurrent ? "text-slate-300" : "group-hover:text-white"} />
                          {s}
                        </div>
                        {!isCurrent && <ChevronRight size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest leading-none">Total Value</p>
             <p className="text-3xl font-black text-slate-900 italic tracking-tighter leading-none">₹{total.toLocaleString()}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Orders() {
  const { orders, updateOrderStatus } = useOrders();
  const activeOrders = orders.filter((o) => o.status !== "Served").sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt));
  const completedOrders = orders.filter((o) => o.status === "Served");

  return (
    <div className="min-h-screen bg-[#FDFDFD] p-4 sm:p-10 font-sans">
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">Kitchen <span className="text-orange-500">Live</span></h1>
            <p className="text-slate-400 font-bold mt-2 uppercase tracking-[0.3em] text-[10px]">Management Portal • {activeOrders.length} Active</p>
          </div>
          <div className="flex gap-4">
             <div className="bg-white border border-slate-100 px-6 py-3 rounded-2xl shadow-sm">
                <p className="text-[9px] font-black text-slate-400 uppercase">Success Rate</p>
                <p className="text-xl font-black text-emerald-500 italic">98%</p>
             </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="py-32 text-center bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
             <Coffee size={64} className="mx-auto text-slate-200 mb-6" />
             <h3 className="text-2xl font-black text-slate-900 uppercase">Kitchen Quiet</h3>
             <p className="text-slate-400 font-medium">New orders will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-12">
            {activeOrders.length > 0 && (
              <div className="space-y-8">
                <div className="flex items-center gap-4">
                  <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
                  <h2 className="text-[12px] font-black text-slate-900 uppercase tracking-[0.4em]">Ongoing Preparations</h2>
                </div>
                <div className="grid gap-8">
                  {activeOrders.map((order) => (
                    <PremiumOrderCard key={order.id} order={order} updateOrderStatus={updateOrderStatus} />
                  ))}
                </div>
              </div>
            )}

            {completedOrders.length > 0 && (
              <div className="space-y-8 mt-12 opacity-60">
                <h2 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em] text-center">History (Last 24h)</h2>
                <div className="grid gap-6">
                  {completedOrders.slice(0, 5).map((order) => (
                    <PremiumOrderCard key={order.id} order={order} updateOrderStatus={updateOrderStatus} isCompleted />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}