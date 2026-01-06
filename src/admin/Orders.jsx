import React from 'react';
import { useOrders } from "../context/OrderContext";
import StatusBadge from "../components/StatusBadge";
import {
  ShoppingBag,
  Activity,
  CheckCircle,
  Sparkles,
  Coffee,
  Clock,
  Flame,
  BellRing,
} from "lucide-react";

const gradientMap = {
  Preparing: "from-amber-500 via-orange-500 to-red-500",
  Cooking: "from-orange-600 via-red-600 to-rose-600",
  Ready: "from-indigo-500 via-purple-500 to-pink-500",
  Served: "from-emerald-500 via-teal-500 to-cyan-500",
};

const statusIcons = {
  Preparing: Clock,
  Cooking: Flame,
  Ready: BellRing,
  Served: CheckCircle,
};

const PremiumOrderCard = ({ order, updateOrderStatus, isCompleted = false }) => {
  const total = order.items.reduce((acc, item) => acc + (item.price || 0) * (item.qty || 1), 0);
  const status = order.status;
  const gradient = gradientMap[status] || "from-gray-400 to-gray-600";

  return (
    <div className={`group relative transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl ${isCompleted ? "opacity-80" : ""}`}>
      {/* Glow on hover */}
      <div className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-30 blur-3xl transition-opacity duration-700 rounded-3xl`} />
      
      <div className="relative overflow-hidden rounded-3xl bg-white/70 backdrop-blur-xl border border-white/30 shadow-2xl">
        {/* Status-colored top bar */}
        <div className={`h-2 bg-gradient-to-r ${gradient}`} />

        <div className="p-5 sm:p-7 space-y-6">
          {/* Header: Table + Total + Status */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
                Table {order.table || "Counter"}
              </h3>
              <p className="text-sm text-slate-500 mt-1">Order #{order.id}</p>
            </div>

            <div className="flex flex-col items-end gap-3">
              <StatusBadge status={status} />
              <p className="text-2xl sm:text-3xl font-black text-slate-900">₹{total}</p>
            </div>
          </div>

          {/* Order Items - Receipt style */}
          <div className="space-y-4 py-4 border-t border-dashed border-slate-200">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center text-base animate-fade-in"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-700">
                    {item.qty || 1}×
                  </span>
                  <span className="text-slate-800">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-900">
                  ₹{(item.price || 0) * (item.qty || 1)}
                </span>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {!isCompleted ? (
            <div className="flex flex-wrap gap-4 justify-center">
              {["Preparing", "Cooking", "Ready", "Served"].map((s) => {
                const isCurrent = s === status;
                const btnGradient = gradientMap[s];
                const Icon = statusIcons[s];

                return (
                  <button
                    key={s}
                    onClick={() => updateOrderStatus(order.id, s)}
                    disabled={isCurrent}
                    className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-white shadow-lg transition-all duration-300 ${
                      isCurrent
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-70"
                        : `bg-gradient-to-r ${btnGradient} hover:shadow-2xl hover:scale-105`
                    }`}
                  >
                    <Icon size={22} />
                    {s}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-xl font-bold text-emerald-600 flex items-center justify-center gap-3">
                <CheckCircle size={28} />
                Order Served
              </p>
            </div>
          )}
        </div>

        {/* Subtle bottom shine */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/5 to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

const PremiumEmptyOrdersCard = () => (
  <div className="group relative">
    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-20 blur-3xl rounded-3xl" />
    
    <div className="relative rounded-3xl bg-white/70 backdrop-blur-xl border border-white/20 shadow-2xl p-12 sm:p-16 text-center">
      <Coffee className="w-32 h-32 mx-auto text-amber-600 mb-8 opacity-80" />
      <h3 className="text-4xl font-black text-slate-800 mb-4">
        No Orders Yet
      </h3>
      <p className="text-xl text-slate-600 max-w-md mx-auto">
        The kitchen is ready and waiting. Enjoy the calm before the storm!
      </p>
      <Sparkles className="w-16 h-16 mx-auto text-indigo-500 mt-8 opacity-50" />
    </div>
  </div>
);

export default function Orders() {
  const { orders, updateOrderStatus } = useOrders();

  const activeOrders = orders.filter((o) => o.status !== "Served");
  const completedOrders = orders.filter((o) => o.status === "Served");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Premium Page Header */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-3xl -z-10" />
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl">
                <ShoppingBag className="text-white" size={30} />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 bg-clip-text text-transparent">
                  Orders
                </h1>
                <p className="text-lg text-slate-600 mt-1">
                  {orders.length} total • {activeOrders.length} active
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        {orders.length === 0 ? (
          <PremiumEmptyOrdersCard />
        ) : (
          <div className="space-y-16">
            {activeOrders.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-4 text-amber-700">
                  <Activity size={36} />
                  Active Orders
                </h2>
                <div className="space-y-8">
                  {activeOrders.map((order) => (
                    <PremiumOrderCard
                      key={order.id}
                      order={order}
                      updateOrderStatus={updateOrderStatus}
                    />
                  ))}
                </div>
              </section>
            )}

            {completedOrders.length > 0 && (
              <section>
                <h2 className="text-3xl font-bold mb-8 flex items-center gap-4 text-emerald-700">
                  <CheckCircle size={36} />
                  Completed Orders
                </h2>
                <div className="space-y-8">
                  {completedOrders.map((order) => (
                    <PremiumOrderCard
                      key={order.id}
                      order={order}
                      updateOrderStatus={updateOrderStatus}
                      isCompleted
                    />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}