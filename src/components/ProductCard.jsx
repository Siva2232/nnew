import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ---------- Veg / Non-Veg Icon ---------- */
function FoodTypeIcon({ type }) {
  const isVeg = type === "veg";

  return (
    <div
      className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm
        ${isVeg ? "border-green-600" : "border-red-600"}
      `}
    >
      <div
        className={`w-2.5 h-2.5 rounded-full
          ${isVeg ? "bg-green-600" : "bg-red-600"}
        `}
      />
    </div>
  );
}

export default function ProductCard({ product, onAdd }) {
  const {
    name,
    description,
    price,
    image,
    available = true,
    type = "veg",
  } = product;

  const [added, setAdded] = useState(false);
  const [showCheck, setShowCheck] = useState(false);

  const handleAdd = (e) => {
    e.stopPropagation();
    if (!available) return;

    setAdded(true);
    setShowCheck(true);
    onAdd();
    setTimeout(() => setShowCheck(false), 800);
  };

  return (
    <motion.div
      className={`relative rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
      animate={available ? {} : { x: [0, -5, 5, -5, 5, 0] }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative aspect-[4/5]">

        {/* Image */}
        <img
          src={image || "https://via.placeholder.com/600x800"}
          alt={name}
          className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
            !available ? "grayscale contrast-90" : ""
          }`}
        />

        {/* Veg / Non-Veg Icon */}
        <div className="absolute top-3 left-3 z-30 bg-white/90 backdrop-blur-md p-1 rounded-md shadow">
          <FoodTypeIcon type={type} />
        </div>

        {/* OUT OF STOCK Overlay */}
        <AnimatePresence>
          {!available && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-black/70 "
            >
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="bg-gradient-to-r  px-8 py-4 rounded-full shadow-2xl text-white font-bold text-xl md:text-2xl text-center"
              >
                Out of Stock
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Added Badge */}
        <AnimatePresence>
          {added && available && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute top-3 right-3 z-30"
            >
              <div className="bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                ✓
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-5 pt-10">
          <h3 className="text-white text-lg font-bold line-clamp-2">{name}</h3>

          {description && (
            <p className="text-white/80 text-xs mt-1 line-clamp-2">
              {description}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between">
            <span className="text-white text-2xl font-extrabold">
              ₹{price}
            </span>

            {/* Add Button */}
            {available && (
              <motion.button
                onClick={handleAdd}
                whileTap={{ scale: 0.85 }}
                className="relative bg-white w-14 h-14 rounded-full flex items-center justify-center shadow-2xl overflow-hidden"
              >
                {/* Ripple */}
                <AnimatePresence>
                  {showCheck && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 2.5 }}
                      exit={{ scale: 3, opacity: 0 }}
                      transition={{ duration: 0.6 }}
                      className="absolute inset-0 bg-green-400 rounded-full"
                    />
                  )}
                </AnimatePresence>

                {/* + → ✓ */}
                <AnimatePresence mode="wait">
                  {showCheck ? (
                    <motion.span
                      key="check"
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      exit={{ scale: 0 }}
                      className="text-green-600 text-3xl font-bold z-10"
                    >
                      ✓
                    </motion.span>
                  ) : (
                    <motion.span
                      key="plus"
                      className="text-green-600 text-3xl font-bold z-10"
                    >
                      +
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
