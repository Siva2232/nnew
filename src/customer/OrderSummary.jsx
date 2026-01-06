import { useOrders } from "../context/OrderContext";
import { useNavigate, Link } from "react-router-dom";
import StatusBadge from "../components/StatusBadge";
import OrderProgress from "../components/OrderProgress";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { 
  ChevronLeft, 
  ChefHat, 
  Receipt, 
  RotateCcw, 
  Timer, 
  UtensilsCrossed 
} from "lucide-react";

export default function OrderSummary() {
  const { orders } = useOrders();
  const lastOrderId = localStorage.getItem("lastOrderId");
  const navigate = useNavigate();

  const order = orders.find((o) => o.id === lastOrderId);

  const totalAmount =
    order?.items?.reduce(
      (sum, i) => sum + (i.price || 0) * (i.qty || 1),
      0
    ) || 0;

  const orderTime = order?.createdAt
    ? format(new Date(order.createdAt), "h:mm a • MMM d, yyyy")
    : "";

  useEffect(() => {
    if (order?.status === "Served") {
      const duration = 2 * 1000;
      const end = Date.now() + duration;

      (function frame() {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#6366f1', '#a855f7']
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#6366f1', '#a855f7']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      }());
    }
  }, [order?.status]);

  if (!order || !order.items || order.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] px-6 text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-[2.5rem] flex items-center justify-center mb-6">
          <Receipt size={40} className="text-slate-300" />
        </div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-2">No Active Order</h2>
        <p className="text-slate-400 text-sm mb-8 max-w-[240px]">You haven't placed any orders in this session yet.</p>
        <Link to="/menu" className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl">
          Browse Our Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col pb-32">
      {/* --- PRESTIGE HEADER --- */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={20} className="text-slate-900" />
          </button>
          <div className="text-center">
            <h1 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Track Order</h1>
            <p className="text-sm font-bold text-slate-900">Live Status</p>
          </div>
          <div className="w-8" />
        </div>
      </header>

      <main className="flex-1 max-w-md mx-auto w-full px-4 pt-6 space-y-6">
        {/* --- MAIN ORDER CARD --- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-100 overflow-hidden"
        >
          {/* Top Identity Section */}
          <div className="bg-slate-900 p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12">
              <ChefHat size={120} strokeWidth={1} />
            </div>
            
            <div className="relative z-10 flex justify-between items-end">
              <div>
                <span className="inline-block px-2 py-1 bg-white/10 rounded-lg text-[9px] font-black uppercase tracking-widest mb-3">Confirmation Hash</span>
                <p className="text-lg font-mono font-bold tracking-tighter">{order.id.slice(-10)}</p>
                <div className="flex items-center gap-2 text-slate-400 mt-1">
                  <Timer size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-wider">{orderTime}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Table</span>
                <p className="text-5xl font-black tracking-tighter">#{order.table}</p>
              </div>
            </div>
          </div>

          {/* Live Progress Section */}
          <div className="p-6 border-b border-slate-50">
            <div className="flex items-center justify-between mb-6">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">Current Phase</span>
              <StatusBadge status={order.status} />
            </div>
            <OrderProgress status={order.status} />
          </div>

          {/* Success Banner */}
          <AnimatePresence>
            {order.status === "Served" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                className="bg-emerald-50 p-4 border-b border-emerald-100 flex items-center gap-4"
              >
                <div className="h-10 w-10 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                  <UtensilsCrossed size={18} />
                </div>
                <div>
                  <p className="text-sm font-black text-emerald-900">Order Fulfilled</p>
                  <p className="text-[11px] font-medium text-emerald-600">Your meal has been served. Enjoy!</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Itemized List */}
          <div className="p-6 space-y-4">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Order Manifest</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 group">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden shrink-0">
                    {item.image ? (
                      <img src={item.image} alt="" className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center text-xl">🍽️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{item.name}</p>
                    <p className="text-[10px] font-black text-indigo-500 font-mono">
                      {item.qty} UNIT{item.qty > 1 && 'S'} • ₹{item.price.toFixed(2)}
                    </p>
                  </div>
                  <p className="font-black text-slate-900 font-mono text-sm">
                    ₹{(item.price * item.qty).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Receipt Total */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Receipt size={16} className="text-slate-400" />
                <span className="text-sm font-black uppercase tracking-widest text-slate-900">Amount Due</span>
              </div>
              <span className="text-2xl font-black text-slate-900 font-mono tracking-tighter">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Special Notes */}
          {order.notes && (
            <div className="p-6 bg-amber-50/50 border-t border-amber-100">
              <div className="flex gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-600 bg-amber-100 px-2 py-0.5 rounded-md h-fit">Notes</span>
                <p className="text-xs italic text-amber-900 font-medium">“{order.notes}”</p>
              </div>
            </div>
          )}
        </motion.div>

        <p className="text-center text-[10px] font-black uppercase tracking-[0.3em] text-slate-300">
          Pulse Connection: Active 📡
        </p>
      </main>

      {/* --- FLOATING BOTTOM ACTION --- */}
      <div className="fixed bottom-0 inset-x-0 p-6 z-40 lg:relative lg:p-0">
        <div className="max-w-md mx-auto">
          <motion.div 
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={`/menu?table=${order.table}`}
              className="group flex items-center justify-center gap-3 w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-slate-200 transition-all hover:bg-indigo-600"
            >
              <RotateCcw size={16} className="group-hover:rotate-180 transition-transform duration-700" />
              Add More Items
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
}