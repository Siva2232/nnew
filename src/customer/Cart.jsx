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

  const placeOrder = () => {
    if (!table || cart.length === 0) return;
    
    const orderId = generateId("ORD");
    
    // CRITICAL FIX: Save ID to localStorage so Summary can find it
    localStorage.setItem("lastOrderId", orderId);

    const details = { 
      id: orderId, 
      table, 
      items: [...cart], 
      status: "Preparing", 
      createdAt: new Date().toISOString(), 
      notes: notes.trim() 
    };

    addOrder(details);
    setPlacedDetails({ orderId, table, total: totalAmount, notes: notes.trim() });
    clearCart();
    setShowSuccess(true);
    
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="min-h-screen bg-white md:bg-[#F8FAFC] font-sans pb-32">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-100 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to={`/menu${table ? `?table=${table}` : ""}`} className="p-2 -ml-2">
            <ChevronLeft size={24} className="text-slate-900" />
          </Link>
          <div className="text-center">
            <h1 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Review</h1>
            <p className="text-sm font-bold text-slate-900">{cart.length} Items</p>
          </div>
          <div className="w-10 flex justify-end">
            {cart.length > 0 && (
              <button onClick={clearCart} className="text-rose-500 p-2"><Trash2 size={20} /></button>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 pt-6">
        <AnimatePresence mode="wait">
          {showSuccess ? (
            <SuccessView key="success" details={placedDetails} navigate={navigate} />
          ) : cart.length === 0 ? (
            <EmptyView key="empty" table={table} />
          ) : (
            <div className="grid lg:grid-cols-12 gap-8">
              <div className="lg:col-span-7 space-y-3">
                <div className="flex justify-between items-center mb-4">
                   <h2 className="text-xl font-black text-slate-900">Your Selection</h2>
                   <div className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full">
                      <span className="text-[9px] font-black text-slate-500">TABLE</span>
                      <input 
                        type="number" 
                        value={table || ""} 
                        onChange={(e) => setTable(e.target.value)}
                        className="w-6 bg-transparent font-black text-sm outline-none"
                      />
                   </div>
                </div>

                {cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-white p-3 rounded-2xl border border-slate-100 shadow-sm">
                    <img src={item.image} className="w-20 h-20 rounded-xl object-cover bg-slate-50" alt="" />
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                      <p className="text-indigo-600 font-black text-xs">₹{item.price}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center bg-slate-50 rounded-lg p-1 border">
                          <button onClick={() => updateQuantity(item.id, item.qty - 1)} className="px-2"><Minus size={12}/></button>
                          <span className="px-2 text-xs font-black">{item.qty}</span>
                          <button onClick={() => updateQuantity(item.id, item.qty + 1)} className="px-2"><Plus size={12}/></button>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-rose-400"><Trash2 size={16}/></button>
                      </div>
                    </div>
                  </div>
                ))}
                
                <textarea 
                  value={notes} 
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Special instructions..."
                  className="w-full mt-4 bg-slate-50 border-none rounded-xl p-4 text-sm min-h-[100px]"
                />
              </div>

              {/* Desktop Summary Sidebar */}
              <aside className="hidden lg:block lg:col-span-5">
                <div className="bg-white p-8 rounded-[2rem] border shadow-sm sticky top-24">
                  <div className="flex justify-between mb-4">
                    <span className="font-bold text-slate-400">Total</span>
                    <span className="font-black text-2xl text-slate-900">₹{totalAmount.toFixed(2)}</span>
                  </div>
                  <button onClick={placeOrder} disabled={!table} className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs">Place Order</button>
                </div>
              </aside>
            </div>
          )}
        </AnimatePresence>
      </main>

      {!showSuccess && cart.length > 0 && (
        <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t p-6 pb-10 z-50 shadow-2xl">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase">Total</p>
              <p className="text-xl font-black text-slate-900">₹{totalAmount.toFixed(2)}</p>
            </div>
            <button onClick={placeOrder} disabled={!table} className="flex-1 bg-slate-900 text-white py-4 rounded-xl font-black uppercase text-[11px] tracking-widest active:scale-95 transition-all">
              {table ? 'Confirm Order' : 'Enter Table #'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const SuccessView = ({ details, navigate }) => (
  <div className="text-center py-10">
    <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 text-white shadow-xl shadow-emerald-100">
      <CheckCircle2 size={40} />
    </div>
    <h2 className="text-2xl font-black text-slate-900">Order Sent!</h2>
    <p className="text-slate-400 text-sm mt-2 mb-8 px-10">Kitchen is preparing your meal for Table #{details.table}.</p>
    <button onClick={() => navigate("/order-summary")} className="w-full max-w-xs bg-slate-900 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 mx-auto">
      Track Order <ReceiptText size={18} />
    </button>
  </div>
);

const EmptyView = ({ table }) => (
  <div className="text-center py-20">
    <ShoppingBag size={64} className="mx-auto text-slate-100 mb-6" />
    <h3 className="text-lg font-black text-slate-900 uppercase">Cart is empty</h3>
    <Link to={`/menu?table=${table}`} className="inline-block mt-6 text-indigo-600 font-bold">Return to Menu</Link>
  </div>
);