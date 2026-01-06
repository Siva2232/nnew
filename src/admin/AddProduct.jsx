import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useProducts } from "../context/ProductContext";
import { generateId } from "../utils/generateId";

export default function AddProduct() {
  const { addProduct, orderedCategories = [], addCategory } = useProducts();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    category: "",
    type: "veg", // ✅ NEW (veg | non-veg)
  });

  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [addStatus, setAddStatus] = useState("");
  const [isCompressing, setIsCompressing] = useState(false);

  /* ---------- Image Compression ---------- */
  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 800;
          let width = img.width;
          let height = img.height;

          if (width > MAX_WIDTH) {
            height = (MAX_WIDTH / width) * height;
            width = MAX_WIDTH;
          }

          canvas.width = width;
          canvas.height = height;
          canvas.getContext("2d").drawImage(img, 0, 0, width, height);

          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    });
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;

    setIsCompressing(true);
    const compressed = await compressImage(file);
    setForm((prev) => ({ ...prev, image: compressed }));
    setIsCompressing(false);
  };

  const normalizeCategory = (str) =>
    str.trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

  const handleAddCategory = () => {
    const input = newCategoryInput.trim();
    if (!input) {
      setAddStatus("Please enter a category name");
      setTimeout(() => setAddStatus(""), 3000);
      return;
    }

    const normalized = normalizeCategory(input);

    if (orderedCategories.includes(normalized)) {
      setForm((prev) => ({ ...prev, category: normalized }));
      setNewCategoryInput("");
      return;
    }

    addCategory(normalized);
    setForm((prev) => ({ ...prev, category: normalized }));
    setNewCategoryInput("");
  };

  const handleSubmit = () => {
    if (
      !form.name.trim() ||
      !form.price ||
      !form.description.trim() ||
      !form.image ||
      !form.category
    ) {
      alert("Please fill all fields");
      return;
    }

    addProduct({
      id: generateId("PROD"),
      name: form.name.trim(),
      price: Number(form.price),
      description: form.description.trim(),
      image: form.image,
      category: form.category,
      type: form.type, // ✅ SAVED
      available: true,
    });

    navigate("/admin/products");
  };

  return (
    <div className="max-w-md mx-auto mt-6 bg-white p-6 rounded-xl shadow-sm">
      <h1 className="text-xl font-semibold mb-4">Add New Product</h1>

      <div className="grid gap-4">
        <input
          type="text"
          placeholder="Product Name *"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
        />

        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="Price *"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
        />

        <input
          type="text"
          placeholder="Description *"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
        />

        {/* ✅ Veg / Non-Veg (UI SIMPLE, NO STYLE CHANGE) */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Food Type <span className="text-red-500">*</span>
          </label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          >
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
          >
            <option value="" disabled>
              Select a category
            </option>
            {orderedCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Add Category */}
        <div className="border-t pt-4">
          <p className="text-sm text-slate-600 mb-2">
            Don't see the category? Add it:
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={newCategoryInput}
              onChange={(e) => setNewCategoryInput(e.target.value)}
              placeholder="e.g. Soups"
              className="flex-1 border rounded-lg px-4 py-3 focus:outline-none focus:border-orange-500"
            />
            <button
              onClick={handleAddCategory}
              className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold px-6 py-3 rounded-lg shadow-md"
            >
              Add
            </button>
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Product Image <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isCompressing}
            className="w-full border rounded-lg px-4 py-3"
          />
        </div>

        {/* Preview */}
        {form.image && (
          <img
            src={form.image}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg shadow-md"
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={isCompressing}
          className="bg-black text-white font-bold px-6 py-4 rounded-lg hover:bg-gray-800 transition shadow-lg mt-6"
        >
          Add Product
        </button>
      </div>
    </div>
  );
}
