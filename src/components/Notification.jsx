import React, { useEffect, useRef, useState } from "react";
import { useOrders } from "../context/OrderContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  ShoppingBag,
  Clock,
  ArrowRight,
  X,
  Zap,
  Ticket
} from "lucide-react";

export default function Notification() {
  const { orders } = useOrders();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Filter pending orders (using status from your Orders component)
  const pendingOrders = orders.filter((o) => o.status === "Preparing" || o.status === "Pending");

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* --- Trigger Button --- */}
      <button
        onClick={() => setOpen(!open)}
        className={`group relative p-3 rounded-2xl transition-all duration-500 ${
          open ? 'bg-slate-900 text-white' : 'hover:bg-slate-100 text-slate-600'
        }`}
      >
        <Bell className={`w-6 h-6 ${open ? 'animate-none' : 'group-hover:rotate-12 transition-transform'}`} />
        
        {pendingOrders.length > 0 && (
          <span className="absolute top-2 right-2 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500 border-2 border-white"></span>
          </span>
        )}
      </button>

      {/* --- Notification Panel --- */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-[400px] bg-white/90 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-200/50 rounded-[2.5rem] overflow-hidden z-50 origin-top-right"
          >
            {/* Header */}
            <div className="p-6 pb-4 flex items-center justify-between bg-gradient-to-b from-slate-50/50 to-transparent">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                  <Zap size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 leading-none">Incoming</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                    {pendingOrders.length} Orders Pending
                  </p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                <X size={18} className="text-slate-400" />
              </button>
            </div>

            {/* List */}
            <div className="px-4 pb-4 max-h-[450px] overflow-y-auto no-scrollbar">
              {pendingOrders.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="h-20 w-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto">
                    <ShoppingBag className="text-slate-200" size={40} strokeWidth={1} />
                  </div>
                  <p className="text-slate-400 font-bold text-sm">No new activity</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pendingOrders.map((order, idx) => (
                    <NotificationItem 
                      key={order.id} 
                      order={order} 
                      idx={idx} 
                      onClick={() => { navigate("/admin/orders"); setOpen(false); }} 
                    />
                  ))}
                </div>
              )}
            </div>

            {/* View All Footer */}
            {pendingOrders.length > 0 && (
              <div className="p-4 bg-slate-50/50 border-t border-slate-100">
                <button 
                  onClick={() => { navigate("/admin/orders"); setOpen(false); }}
                  className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
                >
                  Enter Orders Portal <ArrowRight size={14} />
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const NotificationItem = ({ order, idx, onClick }) => {
  const total = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: idx * 0.1 }}
      onClick={onClick}
      className="group relative p-4 bg-white rounded-[1.8rem] border border-slate-100 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all cursor-pointer overflow-hidden"
    >
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100 group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-colors">
            <Ticket size={18} className="text-slate-400 group-hover:text-indigo-600" />
          </div>
          <div>
            <p className="font-black text-slate-900 tracking-tight">Table {order.table}</p>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md uppercase tracking-tighter">New Order</span>
              <span className="text-[10px] font-medium text-slate-400 flex items-center gap-1">
                <Clock size={10} /> Just now
              </span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="font-black text-slate-900 tracking-tight">₹{total}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{order.items.length} Items</p>
        </div>
      </div>
      
      {/* Decorative arrow that slides in on hover */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
         <ArrowRight size={20} className="text-indigo-400" />
      </div>
    </motion.div>
  );
};