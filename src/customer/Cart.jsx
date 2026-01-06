import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrderContext";
import { generateId } from "../utils/generateId";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingBag, Trash2, Plus, Minus, ChevronLeft, 
  CheckCircle2, ReceiptText, ArrowRight
} from "lucide-react";
import confetti from 'canvas-confetti';

export default function Cart() {
  const {
    cart, table, setTable, clearCart,
    totalAmount, updateQuantity, removeFromCart,
  } = useCart();

  const { addOrder } = useOrders();
  const navigate = useNavigate();

  const [notes, setNotes] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [placedDetails, setPlacedDetails] = useState(null);

  useEffect(() => {
    if (showSuccess) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b']
      });
    }
  }, [showSuccess]);

  const placeOrder = () => {
    if (!table || cart.length === 0) return;
    const orderId = generateId("ORD");
    const details = { id: orderId, table, items: cart, status: "Preparing", createdAt: new Date().toISOString(), notes: notes.trim() };
    addOrder(details);
    setPlacedDetails({ orderId, table, total: totalAmount, notes: notes.trim() });
    clearCart();
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#F8FAFC] font-sans">
      {/* --- Sticky Navbar --- */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-4 md:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={`/menu${table ? `?table=${table}` : ""}`} className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-slate-900" />
          </Link>
          <div className="text-center">
            <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Review Order</h1>
            <p className="text-sm font-bold text-slate-900">{cart.length} {cart.length === 1 ? 'Item' : 'Items'}</p>
          </div>
          <div className="w-10 flex justify-end">
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-rose-500 p-2 active:scale-90 transition-transform">
                <Trash2 size={20} />
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 pt-4 pb-40 md:px-8 md:pt-12">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <SuccessView key="success" details={placedDetails} navigate={navigate} />
          ) : cart.length === 0 ? (
            <EmptyView key="empty" table={table} />
          ) : (
            <div key="cart" className="grid lg:grid-cols-12 gap-8">
              
              {/* Left Side: Items List */}
              <div className="lg:col-span-7 space-y-3">
                <div className="flex items-center justify-between mb-4 px-1">
                  <h2 className="text-xl md:text-3xl font-black text-slate-900 tracking-tight">Your Selection</h2>
                  <div className="md:hidden flex items-center gap-2 bg-indigo-50 px-3 py-1.5 rounded-full">
                    <span className="text-[9px] font-black text-indigo-600 uppercase">Table</span>
                    <input 
                      type="number" 
                      value={table || ""} 
                      onChange={(e) => setTable(e.target.value)} 
                      className="w-6 bg-transparent text-indigo-600 font-black text-sm outline-none"
                      placeholder="--"
                    />
                  </div>
                </div>

                {cart.map((item, idx) => (
                  <CartItem 
                    key={item.id} 
                    item={item} 
                    idx={idx} 
                    updateQuantity={updateQuantity} 
                    removeFromCart={removeFromCart} 
                  />
                ))}

                {/* Mobile Special Instructions */}
                <div className="mt-8 md:hidden">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1">Cooking Instructions</p>
                  <textarea 
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Less spicy, no onions..."
                    className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-100 rounded-2xl p-4 text-sm focus:ring-0 min-h-[100px] transition-all"
                  />
                </div>
              </div>

              {/* Right Side: Desktop Summary */}
              <aside className="hidden lg:block lg:col-span-5 sticky top-24 h-fit">
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-2xl shadow-slate-200/50">
                   <SummaryContent 
                      table={table} 
                      setTable={setTable} 
                      notes={notes} 
                      setNotes={setNotes} 
                      totalAmount={totalAmount} 
                      placeOrder={placeOrder} 
                   />
                </div>
              </aside>
            </div>
          )}
        </AnimatePresence>
      </main>

      {/* --- Mobile Fixed Action Bar --- */}
      {!showSuccess && cart.length > 0 && (
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-2xl border-t border-slate-100 px-6 pt-5 pb-10 z-50 shadow-[0_-10px_40px_rgba(0,0,0,0.08)]"
        >
          <div className="max-w-md mx-auto flex items-center justify-between gap-6">
            <div className="flex-shrink-0">
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Grand Total</p>
              <p className="text-2xl font-black text-slate-900 tracking-tighter">₹{totalAmount.toFixed(2)}</p>
            </div>
            
            <button 
              onClick={placeOrder}
              disabled={!table}
              className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 ${
                table ? 'bg-slate-900 text-white shadow-slate-200' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
              }`}
            >
              {table ? (
                <>Send Order <ArrowRight size={16} /></>
              ) : (
                'Enter Table #'
              )}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/* --- Sub-Components --- */

const CartItem = ({ item, idx, updateQuantity, removeFromCart }) => (
  <motion.div 
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay: idx * 0.05 }}
    className="flex items-center gap-4 bg-white md:bg-white p-3 md:p-4 rounded-2xl md:rounded-[2rem] border border-slate-100 hover:shadow-md transition-all"
  >
    <div className="h-20 w-20 md:h-24 md:w-24 bg-slate-50 rounded-xl overflow-hidden flex-shrink-0">
      <img src={item.image || 'https://via.placeholder.com/150'} alt="" className="h-full w-full object-cover" />
    </div>
    
    <div className="flex-1 min-w-0">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-slate-900 text-sm md:text-lg truncate">{item.name}</h3>
        <button onClick={() => removeFromCart(item.id)} className="md:hidden text-slate-300 p-1">
            <Trash2 size={16} />
        </button>
      </div>
      <p className="text-indigo-600 font-black text-xs md:text-base mb-2">₹{item.price}</p>
      
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center bg-slate-100 rounded-lg p-1">
          <button 
            onClick={() => updateQuantity(item.id, Math.max(1, item.qty - 1))} 
            className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm active:bg-slate-50"
          >
            <Minus size={14} />
          </button>
          <span className="w-10 text-center text-xs font-black">{item.qty}</span>
          <button 
            onClick={() => updateQuantity(item.id, item.qty + 1)} 
            className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm active:bg-slate-50"
          >
            <Plus size={14} />
          </button>
        </div>
        <button onClick={() => removeFromCart(item.id)} className="hidden md:block text-[10px] font-black text-slate-300 uppercase tracking-widest hover:text-rose-500 transition-colors">Remove</button>
      </div>
    </div>
  </motion.div>
);

const SummaryContent = ({ table, setTable, notes, setNotes, totalAmount, placeOrder }) => (
  <div className="space-y-6">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Order Summary</span>
      <div className="flex items-center gap-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
        <span className="text-[10px] font-black text-indigo-600">TABLE</span>
        <input 
          type="number" 
          value={table || ""} 
          onChange={(e) => setTable(e.target.value)} 
          className="w-8 bg-transparent text-indigo-600 font-black outline-none"
          placeholder="--"
        />
      </div>
    </div>

    <textarea 
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="Any special cooking requests?"
      className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm focus:ring-2 focus:ring-indigo-500/10 min-h-[120px] resize-none"
    />

    <div className="space-y-3 pt-4 border-t border-slate-50">
      <div className="flex justify-between text-slate-400 text-sm font-medium px-1">
        <span>Subtotal</span>
        <span className="font-mono text-slate-900">₹{totalAmount.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-slate-900 text-xl font-black px-1">
        <span>Total</span>
        <span className="font-mono tracking-tighter text-indigo-600">₹{totalAmount.toFixed(2)}</span>
      </div>
    </div>

    <button 
      onClick={placeOrder}
      disabled={!table}
      className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 disabled:bg-slate-200"
    >
      Place Order
    </button>
  </div>
);

const SuccessView = ({ details, navigate }) => (
  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md mx-auto text-center py-10">
    <div className="h-24 w-24 bg-emerald-500 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-emerald-200">
      <CheckCircle2 size={48} className="text-white" />
    </div>
    <h2 className="text-3xl font-black text-slate-900 mb-2">Order Fired!</h2>
    <p className="text-slate-400 mb-8 px-4 text-sm font-medium">Sit back and relax. Our chefs are preparing your delicious meal for Table #{details.table}.</p>
    
    <div className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl mb-6 mx-2">
      <p className="text-sm font-bold text-slate-500 mb-1 uppercase tracking-widest text-[10px]">Total Bill</p>
      <p className="text-4xl font-black text-slate-900 font-mono tracking-tighter">₹{details.total}</p>
    </div>

    <div className="px-2">
        <button 
            onClick={() => navigate("/order-summary")}
            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-3 active:scale-95 transition-all shadow-lg shadow-slate-100"
        >
            Track Real-time Status <ReceiptText size={18} />
        </button>
    </div>
  </motion.div>
);

const EmptyView = ({ table }) => (
  <div className="text-center py-24 px-6">
    <div className="h-32 w-32 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100">
      <ShoppingBag size={48} className="text-slate-200" />
    </div>
    <h3 className="text-xl font-black text-slate-900 mb-2">Your cart is empty</h3>
    <p className="text-slate-400 text-sm mb-10 max-w-[240px] mx-auto font-medium">Looks like you haven't added anything to your order yet.</p>
    <Link to={`/menu?table=${table}`} className="inline-block bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-slate-200 active:scale-95 transition-all">
      Start Ordering
    </Link>
  </div>
);