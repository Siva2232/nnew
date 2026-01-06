import { createContext, useContext, useEffect, useState, useMemo } from "react";

/* ---------- Mock Products (Added 10 more – total 23) ---------- */
const MOCK_PRODUCTS = [
  {
    id: "PROD-001",
    name: "Chicken Biryani",
    price: 220,
    description: "Aromatic & spicy rice dish with tender chicken",
    category: "Main Courses",
    image: "https://static.vecteezy.com/system/resources/previews/067/390/426/large_2x/chicken-biryani-dish-served-on-black-plate-in-natural-light-free-photo.jpg",
    available: true,
  },
  {
    id: "PROD-002",
    name: "Paneer Butter Masala",
    price: 180,
    description: "Creamy & rich cottage cheese curry",
    category: "Main Courses",
    image: "https://vegecravings.com/wp-content/uploads/2017/04/paneer-butter-masala-recipe-step-by-step-instructions.jpg",
    available: true,
  },
  {
    id: "PROD-003",
    name: "Veg Noodles",
    price: 150,
    description: "Stir-fried noodles with fresh vegetables",
    category: "Main Courses",
    image: "https://myfoodstory.com/wp-content/uploads/2021/02/Vegetable-Hakka-Noodles-Restaurant-Style-3.jpg",
    available: true,
  },
  {
    id: "PROD-004",
    name: "Mutton Curry",
    price: 250,
    description: "Rich & spicy slow-cooked mutton gravy",
    category: "Main Courses",
    image: "https://maunikagowardhan.co.uk/wp-content/uploads/2015/04/Kadai-Gosht1-1024x683.jpg",
    available: true,
  },
  {
    id: "PROD-005",
    name: "Veg Salad",
    price: 120,
    description: "Fresh garden vegetables with light dressing",
    category: "Starters",
    image: "https://cdn.jwplayer.com/v2/media/wGEqBtuf/thumbnails/qSXwlEH3.jpg?width=1280",
    available: true,
  },
  {
    id: "PROD-006",
    name: "Butter Naan",
    price: 60,
    description: "Soft tandoori bread brushed with butter",
    category: "Main Courses",
    image: "https://media.gettyimages.com/id/1298748782/photo/traditional-indian-naan-flatbread.jpg?s=612x612&w=gi&k=20&c=JpEQkvatZi7L0nUv89GMCZMnnsLYaqSmnQXH5R_U72M=",
    available: true,
  },
  {
    id: "PROD-007",
    name: "Dal Tadka",
    price: 160,
    description: "Tempered yellow lentils with aromatic spices",
    category: "Main Courses",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2021/02/dal-fry.webp",
    available: true,
  },
  {
    id: "PROD-008",
    name: "Chicken Tikka Masala",
    price: 240,
    description: "Grilled chicken in creamy tomato sauce",
    category: "Main Courses",
    image: "https://www.allrecipes.com/thmb/1ul-jdOz8H4b6BDrRcYOuNmJgt4=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/239867chef-johns-chicken-tikka-masala-ddmfs-3X4-0572-e02a25f8c7b745459a9106e9eb13de10.jpg",
    available: true,
  },
  {
    id: "PROD-009",
    name: "Palak Paneer",
    price: 190,
    description: "Cottage cheese in creamy spinach gravy",
    category: "Main Courses",
    image: "https://www.foodandwine.com/thmb/QqinPDSGc2krV8XDgZWwoxVgi5s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/palak-paneer-with-pressed-ricotta-FT-RECIPE0322-4c6f0e411c6444bd81152cb2d078f2bd.jpg",
    available: true,
  },
  {
    id: "PROD-010",
    name: "Gulab Jamun",
    price: 90,
    description: "Soft fried dumplings soaked in rose syrup",
    category: "Desserts",
    image: "https://media.istockphoto.com/id/668147754/photo/gulab-jamun.jpg?s=612x612&w=0&k=20&c=yM8YjrafVCS6SLTEWQH4s2FVduHnAzfkUIR-KkWI7Z0=",
    available: true,
  },
  {
    id: "PROD-011",
    name: "Mango Lassi",
    price: 80,
    description: "Refreshing sweet yogurt drink with mango",
    category: "Beverages",
    image: "https://www.cookwithmanali.com/wp-content/uploads/2015/04/Mango-Lassi-Recipe.jpg",
    available: true,
  },
  {
    id: "PROD-012",
    name: "Masala Chai",
    price: 50,
    description: "Spiced Indian tea with milk",
    category: "Beverages",
    image: "https://www.teaforturmeric.com/wp-content/uploads/2020/01/Masala-Chai-Tea-Recipe.jpg",
    available: true,
  },
  {
    id: "PROD-013",
    name: "Fresh Lime Soda",
    price: 60,
    description: "Zesty lime soda – sweet or salted",
    category: "Beverages",
    image: "https://www.vegrecipesofindia.com/wp-content/uploads/2014/06/lime-soda-recipe-1.jpg",
    available: true,
  },
  /* ---------- 10 New Mock Products ---------- */
  {
    id: "PROD-014",
    name: "Vegetable Samosa",
    price: 80,
    description: "Crispy pastry filled with spiced potatoes and peas",
    category: "Starters",
    image: "https://www.vegrecipesofindia.com/wp-content/uploads/2019/11/samosa-recipe-4.jpg",
    available: true,
  },
  {
    id: "PROD-015",
    name: "Chicken 65",
    price: 180,
    description: "Spicy deep-fried chicken appetizer",
    category: "Starters",
    image: "https://www.indianhealthyrecipes.com/wp-content/uploads/2022/03/chicken-65-recipe.jpg",
    available: true,
  },
  {
    id: "PROD-016",
    name: "Onion Bhaji",
    price: 100,
    description: "Crispy fried onion fritters with spices",
    category: "Starters",
    image: "https://www.kitchensanctuary.com/wp-content/uploads/2021/03/Onion-Bhaji-square-FS-34.jpg",
    available: true,
  },
  {
    id: "PROD-017",
    name: "Butter Chicken",
    price: 260,
    description: "Tender chicken in rich buttery tomato sauce",
    category: "Main Courses",
    image: "https://www.recipetineats.com/wp-content/uploads/2019/01/Butter-Chicken_5.jpg",
    available: true,
  },
  {
    id: "PROD-018",
    name: "Lamb Rogan Josh",
    price: 280,
    description: "Aromatic Kashmiri lamb curry with yogurt and spices",
    category: "Main Courses",
    image: "https://www.kitchensanctuary.com/wp-content/uploads/2020/07/Rogan-Josh-square-FS-38.jpg",
    available: true,
  },
  {
    id: "PROD-019",
    name: "Aloo Gobi",
    price: 140,
    description: "Spiced potato and cauliflower stir-fry",
    category: "Main Courses",
    image: "https://www.teaforturmeric.com/wp-content/uploads/2020/02/Aloo-Gobi-Recipe.jpg",
    available: true,
  },
  {
    id: "PROD-020",
    name: "Rasmalai",
    price: 120,
    description: "Soft cheese patties in creamy milk syrup with pistachios",
    category: "Desserts",
    image: "https://www.cookwithmanali.com/wp-content/uploads/2019/07/Rasmalai-Recipe.jpg",
    available: true,
  },
  {
    id: "PROD-021",
    name: "Jalebi",
    price: 80,
    description: "Crispy pretzel-shaped sweets soaked in sugar syrup",
    category: "Desserts",
    image: "https://www.vegrecipesofindia.com/wp-content/uploads/2020/10/jalebi-recipe.jpg",
    available: true,
  },
  {
    id: "PROD-022",
    name: "Falooda",
    price: 130,
    description: "Chilled rose-flavored milk drink with vermicelli and basil seeds",
    category: "Beverages",
    image: "https://www.cookwithmanali.com/wp-content/uploads/2014/05/Falooda-Recipe.jpg",
    available: true,
  },
  {
    id: "PROD-023",
    name: "Thandai",
    price: 100,
    description: "Cooling spiced milk drink with nuts and saffron",
    category: "Beverages",
    image: "https://www.vegrecipesofindia.com/wp-content/uploads/2021/02/thandai-recipe.jpg",
    available: true,
  },
];

const MOCK_CATEGORIES = ["Starters", "Main Courses", "Desserts", "Beverages"];

/* ---------- Helpers ---------- */
const getProducts = () => {
  let stored = JSON.parse(localStorage.getItem("products")) || [];
  let merged = [...stored];
  let changed = false;

  const storedIds = new Set(stored.map((p) => p.id));

  MOCK_PRODUCTS.forEach((mock) => {
    if (storedIds.has(mock.id)) {
      const index = merged.findIndex((p) => p.id === mock.id);
      const current = merged[index];
      if (
        current.name !== mock.name ||
        current.price !== mock.price ||
        current.description !== mock.description ||
        current.category !== mock.category ||
        current.image !== mock.image
      ) {
        merged[index] = { ...current, ...mock };
        changed = true;
      }
    } else {
      merged.push(mock);
      changed = true;
    }
  });

  if (changed) {
    localStorage.setItem("products", JSON.stringify(merged));
    window.dispatchEvent(new Event("storage"));
  }

  return merged;
};

const setProductsToStorage = (data) => {
  localStorage.setItem("products", JSON.stringify(data));
  window.dispatchEvent(new Event("storage"));
};

/* Helpers for categories */
const getCategories = () => {
  const stored = JSON.parse(localStorage.getItem("categories")) || [];
  let merged = [...new Set(stored)]; // Dedupe just in case
  let changed = false;

  const storedSet = new Set(merged);

  MOCK_CATEGORIES.forEach((mock) => {
    if (!storedSet.has(mock)) {
      merged.push(mock);
      changed = true;
    }
  });

  // Auto-import categories from existing products (safety for old data)
  const products = getProducts();
  products.forEach((p) => {
    if (p.category && !storedSet.has(p.category)) {
      merged.push(p.category);
      changed = true;
    }
  });

  if (changed) {
    merged = [...new Set(merged)]; // Final dedupe
    localStorage.setItem("categories", JSON.stringify(merged));
    window.dispatchEvent(new Event("storage"));
  }

  return merged.sort((a, b) => a.localeCompare(b)); // Initial sort
};

const setCategoriesToStorage = (data) => {
  localStorage.setItem("categories", JSON.stringify(data));
  window.dispatchEvent(new Event("storage"));
};

/* Context */
const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState(getProducts());
  const [categories, setCategories] = useState(getCategories());

  const preferredOrder = ["Starters", "Main Courses", "Desserts", "Beverages"];

  /* Reactive ordered categories – updates instantly when categories change */
  const orderedCategories = useMemo(() => {
    const preferred = preferredOrder.filter((c) => categories.includes(c));
    const others = categories
      .filter((c) => !preferredOrder.includes(c))
      .sort((a, b) => a.localeCompare(b));
    return [...preferred, ...others];
  }, [categories]);

  /* Sync across tabs */
  useEffect(() => {
    const sync = () => {
      setProducts(getProducts());
      setCategories(getCategories());
    };
    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  /* Product actions */
  const addProduct = (product) => {
    const updated = [...products, product];
    setProducts(updated);
    setProductsToStorage(updated);
  };

  const updateProduct = (id, data) => {
    const updated = products.map((p) => (p.id === id ? { ...p, ...data } : p));
    setProducts(updated);
    setProductsToStorage(updated);
  };

  const toggleAvailability = (id) => {
    const updated = products.map((p) => (p.id === id ? { ...p, available: !p.available } : p));
    setProducts(updated);
    setProductsToStorage(updated);
  };

  /* Category actions – now fully reactive */
  const normalizeCategory = (str) => {
    if (!str.trim()) return "";
    return str
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const addCategory = (name) => {
    const norm = normalizeCategory(name);
    if (norm && !categories.includes(norm)) {
      const updated = [...categories, norm];
      setCategories(updated);
      setCategoriesToStorage(updated);
      return true;
    }
    return false;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        categories, // Raw categories (if needed elsewhere)
        orderedCategories, // Use this everywhere for display
        addProduct,
        updateProduct,
        toggleAvailability,
        addCategory,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProducts must be used within ProductProvider");
  }
  return context;
};