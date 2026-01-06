import { Trash2 } from 'lucide-react';

export default function CartItem({ item, onRemove }) {
  return (
    <div className="group flex items-center justify-between bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300">
      {/* Product Info */}
      <div className="flex items-center gap-4">
        {/* Optional: Add a placeholder image if you have one */}
        <div className="w-16 h-16 bg-gray-200 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center">
          <span className="text-gray-400 text-xs">No image</span>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 text-lg">{item.name}</h4>
          <p className="text-sm text-gray-500 mt-1">
            ₹{item.price.toLocaleString('en-IN')} × <span className="font-medium text-gray-700">{item.qty}</span>
          </p>
        </div>
      </div>

      {/* Price & Actions */}
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-900">
            ₹{(item.price * item.qty).toLocaleString('en-IN')}
          </p>
        </div>

        <button
          onClick={() => onRemove(item.id)}
          className="p-3 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 active:scale-95 transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100"
          aria-label="Remove item"
        >
          <Trash2 size={20} strokeWidth={2} />
        </button>
      </div>
    </div>
  );
}