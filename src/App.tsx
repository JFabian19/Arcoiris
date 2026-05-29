import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingBag, Plus, Minus, ChevronRight, X, Trash2, Utensils, Facebook, MapPin, Loader2, Gift, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { fetchSheetData, submitSheetData, SheetDish, SheetCategory } from './services/googleSheets';

// ==========================================
// CONFIGURACIÓN GENERAL DEL MENÚ
// ==========================================

// Reemplaza por tu número de WhatsApp con código de país (ej: 51923494953 para Perú)
const WHATSAPP_NUMBER = "51997119246"; 

// Nombre del negocio que se mostrará en cabecera y pie de página
const BUSINESS_NAME = "Arcoiris"; 

// Eslogan o frase corta del negocio
const BUSINESS_SLOGAN = "heladería y cafetería"; 

// Enlaces de redes sociales e ubicación (dejar vacío "" si no se usa)
const FACEBOOK_URL = "";
const MAPS_URL = "";

// Texto del banner infinito (Marquee)
const MARQUEE_TEXT = "🍦 SABOR Y COLOR EN CADA BOCADO • BUBBLE TEAS Y HELADOS FRITOS • ¡ENDULZA TU DÍA! 🌈 • ";

// Mapa opcional de imágenes locales para platos conocidos (si deseas usar imágenes de la carpeta public)
// Ejemplo: { "Nombre del Plato": "nombre_imagen.jpg" }
const LOCAL_IMAGES: Record<string, string> = {};

const DEFAULT_CATEGORIES = [
  { nombre: "Bebidas Calientes" },
  { nombre: "Bebidas Frías" },
  { nombre: "Jugos" },
  { nombre: "Batidos" },
  { nombre: "Waffles" },
  { nombre: "Frutero" },
  { nombre: "Frappé / Smoothie / Frozen" },
  { nombre: "Limonadas" },
  { nombre: "Bubbles Teas & Lattes" },
  { nombre: "Helados Frito" },
  { nombre: "Sandwich" },
  { nombre: "Postres" }
];

const DEFAULT_DISHES = [
  {
    "categoría": "Bebidas Calientes",
    "nombre del plato": "Americano",
    "descripción": "",
    "precio": "s/7.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Calientes",
    "nombre del plato": "Expresso",
    "descripción": "",
    "precio": "s/6.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Calientes",
    "nombre del plato": "Capuccino",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Calientes",
    "nombre del plato": "Mocaccino",
    "descripción": "",
    "precio": "s/12.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Calientes",
    "nombre del plato": "Latte",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Calientes",
    "nombre del plato": "Chai Latte",
    "descripción": "",
    "precio": "s/12.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Calientes",
    "nombre del plato": "Caramel Latte",
    "descripción": "",
    "precio": "s/12.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Calientes",
    "nombre del plato": "Chocolate Arcoiris",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Frías",
    "nombre del plato": "Iced Coffe",
    "descripción": "",
    "precio": "s/8.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Frías",
    "nombre del plato": "Iced Latte",
    "descripción": "",
    "precio": "s/12.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Frías",
    "nombre del plato": "Iced Caramel Macchiato",
    "descripción": "",
    "precio": "s/12.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Frías",
    "nombre del plato": "Orange Coffee",
    "descripción": "",
    "precio": "s/12.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bebidas Frías",
    "nombre del plato": "Iced Vainilla Latte",
    "descripción": "",
    "precio": "s/12.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Fresa+Papaya+Piña",
    "descripción": "",
    "precio": "s/9.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Fresa+Plátano+Naranja",
    "descripción": "",
    "precio": "s/9.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Papaya+Piña",
    "descripción": "",
    "precio": "s/9.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Papaya+Piña+Naranja",
    "descripción": "",
    "precio": "s/9.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Papaya+Naranja",
    "descripción": "",
    "precio": "s/9.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Fresa",
    "descripción": "",
    "precio": "s/8.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Papaya",
    "descripción": "",
    "precio": "s/8.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Piña",
    "descripción": "",
    "precio": "s/8.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Naranja Arcoli",
    "descripción": "",
    "precio": "s/8.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Mango",
    "descripción": "",
    "precio": "s/8.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Jugos",
    "nombre del plato": "Surtido",
    "descripción": "",
    "precio": "s/8.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Batidos",
    "nombre del plato": "Lúcuma+Leche",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Waffles",
    "nombre del plato": "Waffle Con Helado",
    "descripción": "Incluye Nutella+fresa + plátano+durazno +1 topping y helado frito sabor a elección",
    "precio": "s/17.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Waffles",
    "nombre del plato": "Waffle Personalizado",
    "descripción": "Elige entre nutella, miel de maple, fosh omanjar blanco+3 frutas de estación +3 topping",
    "precio": "s/15.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Frutero",
    "nombre del plato": "Ensalada de Fruta",
    "descripción": "La mejor selección de frutas de estación +yogurt+cereales",
    "precio": "s/17.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Frappé / Smoothie / Frozen",
    "nombre del plato": "Frappé Con Café",
    "descripción": "Sabores: Café, Oreo, Caramelo, Manjar Blanco, Moka, Nutella, Algarrobina. Incluyen crema Chantilly",
    "precio": "s/15.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Frappé / Smoothie / Frozen",
    "nombre del plato": "Frappé Sin Café",
    "descripción": "Sabores: Choco Lucuma, Pie de Limón, Taro, Matcha, Maracuyá Arcelik. Incluyen crema Chantilly",
    "precio": "s/15.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Limonadas",
    "nombre del plato": "Limonada Clásica o de Sabores",
    "descripción": "Sabores: Fresa, Mango, Piña, Maracumango Fresa, Durazno, Sandia, Arcoiris. Incluyen crema Chantilly",
    "precio": "s/10.50",
    "URL de imagen": ""
  },
  {
    "categoría": "Bubbles Teas & Lattes",
    "nombre del plato": "Leche de Coco",
    "descripción": "Sabores: Piña Colada, Coconut, Mango",
    "precio": "s/15.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bubbles Teas & Lattes",
    "nombre del plato": "Milk Tea",
    "descripción": "Sabores: Matcha, Taro, Taro Oreo",
    "precio": "s/15.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Bubbles Teas & Lattes",
    "nombre del plato": "Base Yogurt",
    "descripción": "Sabores: Fresa, Fresa+Arándanos, Lúcuma, Mango+Maracuyá",
    "precio": "s/15.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Galletas",
    "descripción": "Sabores: Oreo, Casino Menta, Vainilla, Morochas, Picaras. 1 Sabor 2 Toppings",
    "precio": "s/10.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Chocolate",
    "descripción": "Sabores: Nutella, Chocman, Sublime, Beso de mosa. 1 Sabor 2 Toppings",
    "precio": "s/10.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Helados Frito",
    "nombre del plato": "Helado con Licores",
    "descripción": "Sabores: Baileys, Ron con Pasas, Piña Colada. Incluye +4 toppings",
    "precio": "s/14.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Helados Frito",
    "nombre del plato": "Helados Otros Sabores",
    "descripción": "Sabores: Café, Pistacho, Algarrobina. Incluye +2 toppings",
    "precio": "s/12.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Sandwich",
    "nombre del plato": "Croisant Clásico",
    "descripción": "Jamón+ Queso Edam",
    "precio": "s/6.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Sandwich",
    "nombre del plato": "Croisant de Pollo",
    "descripción": "Apio y Mayonesa",
    "precio": "s/7.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Sandwich",
    "nombre del plato": "Ciabatta de Pollo",
    "descripción": "Apio y Mayonesa",
    "precio": "s/7.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Sandwich",
    "nombre del plato": "Triangulo Doble de Pollo",
    "descripción": "Apio y Mayonesa",
    "precio": "s/6.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Sandwich",
    "nombre del plato": "Triple",
    "descripción": "Pollo, Jamón y Queso",
    "precio": "s/7.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Postres",
    "nombre del plato": "Torta de Chocolate",
    "descripción": "",
    "precio": "s/8.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Postres",
    "nombre del plato": "Cheesecake de Maracuya",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
  },
  {
    "categoría": "Postres",
    "nombre del plato": "Queques de Casa",
    "descripción": "Sabores: Naranja Chocolate, Zanahona, Platanol",
    "precio": "s/4.00",
    "URL de imagen": ""
  }
];

interface Dish {
  nombre: string;
  descripcion?: string;
  imagen?: string;
  precio: string;
}

interface Category {
  id: string;
  nombre: string;
  items: Dish[];
}

interface CartItem {
  nombre: string;
  precio: string;
  cantidad: number;
}

export default function App() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // States for Birthday Form
  const [showBirthdayForm, setShowBirthdayForm] = useState(false);
  const [isSubmittingBirthday, setIsSubmittingBirthday] = useState(false);
  const [birthdaySuccess, setBirthdaySuccess] = useState(false);
  const [birthdayData, setBirthdayData] = useState({
    nombre: '',
    telefono: '',
    fechaNacimiento: '',
    distrito: '',
    correo: ''
  });

  // States for Review Form
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewData, setReviewData] = useState({
    estrellasMozo: 0,
    estrellasComida: 0,
    comentario: ''
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        let cats = await fetchSheetData<SheetCategory>('Categorías');
        let dishes = await fetchSheetData<SheetDish>('Platos');

        if (!cats || cats.length === 0 || !dishes || dishes.length === 0) {
          console.log("No se pudieron cargar datos de Google Sheets o están vacíos. Usando datos por defecto.");
          cats = DEFAULT_CATEGORIES;
          dishes = DEFAULT_DISHES;
        }

        const formattedCategories: Category[] = cats.map(c => ({
          id: c.nombre.toLowerCase().replace(/\s+/g, '-'),
          nombre: c.nombre,
          items: dishes
            .filter(d => d.categoría === c.nombre)
            .map(d => ({
              nombre: d['nombre del plato'],
              descripcion: d.descripción,
              precio: d.precio,
              imagen: LOCAL_IMAGES[d['nombre del plato']] || d['URL de imagen'] || null
            }))
        }));

        setCategories(formattedCategories);
      } catch (error) {
        console.error("Error loading data from sheet, using fallback default data:", error);
        const formattedCategories: Category[] = DEFAULT_CATEGORIES.map(c => ({
          id: c.nombre.toLowerCase().replace(/\s+/g, '-'),
          nombre: c.nombre,
          items: DEFAULT_DISHES
            .filter(d => d.categoría === c.nombre)
            .map(d => ({
              nombre: d['nombre del plato'],
              descripcion: d.descripción,
              precio: d.precio,
              imagen: LOCAL_IMAGES[d['nombre del plato']] || d['URL de imagen'] || null
            }))
        }));
        setCategories(formattedCategories);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.cantidad, 0), [cart]);

  const addToCart = (dish: Dish) => {
    setCart(prev => {
      const existing = prev.find(i => i.nombre === dish.nombre && i.precio === dish.precio);
      if (existing) {
        return prev.map(i =>
          (i.nombre === dish.nombre && i.precio === dish.precio)
            ? { ...i, cantidad: i.cantidad + 1 }
            : i
        );
      }
      return [...prev, { nombre: dish.nombre, precio: dish.precio, cantidad: 1 }];
    });
  };

  const updateQuantity = (nombre: string, precio: string, delta: number) => {
    setCart(prev =>
      prev
        .map(i => {
          if (i.nombre === nombre && i.precio === precio) {
            const newQty = i.cantidad + delta;
            return newQty > 0 ? { ...i, cantidad: newQty } : null;
          }
          return i;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const calculateTotal = () => {
    return cart.reduce((acc, item) => {
      const cleanPrice = item.precio.replace(/^[^\d]*/, '');
      const num = parseFloat(cleanPrice) || 0;
      return acc + num * item.cantidad;
    }, 0);
  };

  const sendToWhatsApp = () => {
    const total = calculateTotal();
    let message = `*Hola ${BUSINESS_NAME}, deseo realizar un pedido:*\n\n`;
    cart.forEach(item => {
      message += `• ${item.cantidad} x ${item.nombre} (${item.precio})\n`;
    });
    message += `\n*TOTAL: S/.${total.toFixed(2)}*`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleBirthdaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingBirthday(true);
    const success = await submitSheetData('Cumpleaños', {
      timestamp: new Date().toLocaleString('es-PE'),
      nombre: birthdayData.nombre,
      telefono: birthdayData.telefono,
      fechaNacimiento: birthdayData.fechaNacimiento,
      distrito: birthdayData.distrito,
      correo: birthdayData.correo || 'No indicado'
    });
    
    setIsSubmittingBirthday(false);
    if (success) {
      setBirthdaySuccess(true);
      setTimeout(() => {
        setShowBirthdayForm(false);
        setBirthdaySuccess(false);
        setBirthdayData({ nombre: '', telefono: '', fechaNacimiento: '', distrito: '', correo: '' });
      }, 3000);
    } else {
      alert("Hubo un error al enviar tus datos. Por favor, inténtalo de nuevo.");
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewData.estrellasMozo === 0 || reviewData.estrellasComida === 0) {
      alert("Por favor califica ambas opciones con estrellas.");
      return;
    }

    setIsSubmittingReview(true);
    const success = await submitSheetData('Reseñas', {
      timestamp: new Date().toLocaleString('es-PE'),
      estrellasMozo: reviewData.estrellasMozo,
      estrellasComida: reviewData.estrellasComida,
      comentario: reviewData.comentario || 'Sin comentarios'
    });
    
    setIsSubmittingReview(false);
    if (success) {
      setReviewSuccess(true);
      setTimeout(() => {
        setShowReviewForm(false);
        setReviewSuccess(false);
        setReviewData({ estrellasMozo: 0, estrellasComida: 0, comentario: '' });
      }, 3000);
    } else {
      alert("Hubo un error al enviar tu reseña. Por favor, inténtalo de nuevo.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
        <p className="font-slogan text-primary font-bold tracking-widest uppercase text-xs">Cargando menú...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto bg-white min-h-screen relative shadow-2xl overflow-hidden flex flex-col font-sans">
      <header className="sticky top-0 bg-white/95 backdrop-blur-md z-50 px-4 py-3 flex justify-between items-center border-b border-gray-100">
        <div className="flex items-center gap-3">
          {/* Logo recreado en contenedor rojo redondeado */}
          <div className="bg-[#ef4444] px-4 py-2 rounded-2xl flex flex-col items-center justify-center shadow-md shadow-primary/20 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] pointer-events-none"></div>
            <div className="relative font-logo text-[23px] text-white leading-none tracking-wide select-none pt-1">
              Arcoiris
              {/* Icono de helado + arcoíris sobre el primer 'i' */}
              <span className="absolute -top-[12px] left-[38px] w-[26px] h-[22px] pointer-events-none">
                <svg viewBox="0 0 26 22" fill="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Arcos del Arcoíris */}
                  <path d="M10 8 C 11 3, 17 1, 23 2.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M10 10.5 C 12.5 5.5, 19.5 3.5, 25 5.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.85" />
                  <path d="M10 13 C 14 8, 22 6, 26 8.5" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
                  
                  {/* Copa de helado base */}
                  <path d="M3 15 L9.5 15 C10.5 15, 11 15.5, 10 17.5 L8 20.5 C7.5 21.2, 5 21.2, 4.5 20.5 L2.5 17.5 C1.5 15.5, 2 15, 3 15 Z" fill="#ffffff" opacity="0.25" stroke="#ffffff" strokeWidth="1" />
                  {/* Bola de helado / copete */}
                  <path d="M1.5 14 C0.5 12, 2.5 9.5, 4.5 9 C5 7.5, 7 6.5, 8.5 7 C9.5 6, 12 7.5, 12 9 C14 9.5, 15 12, 13.5 14 C11.5 15.5, 3.5 15.5, 1.5 14 Z" fill="#ffffff" stroke="#ffffff" strokeWidth="1" />
                </svg>
              </span>
            </div>
            <span className="text-[9px] text-white/90 font-sans font-bold tracking-widest uppercase mt-1 leading-none">{BUSINESS_SLOGAN}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {FACEBOOK_URL && (
            <motion.a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center text-primary cursor-pointer"
            >
              <Facebook size={22} />
            </motion.a>
          )}
          {MAPS_URL && (
            <motion.a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center text-primary cursor-pointer"
            >
              <MapPin size={22} />
            </motion.a>
          )}
          <motion.div
            onClick={() => cartCount > 0 && setShowSummary(true)}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 bg-primary/10 rounded-full flex items-center justify-center relative cursor-pointer"
          >
            <ShoppingBag size={22} className="text-primary" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 bg-secondary text-white rounded-full text-[10px] font-bold flex items-center justify-center px-1">
                {cartCount}
              </span>
            )}
          </motion.div>
        </div>
      </header>

      <div className="w-full bg-primary py-2 overflow-hidden flex items-center">
        <div className="animate-marquee flex gap-6 text-white font-slogan font-bold text-[11px] tracking-widest uppercase whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i}>{MARQUEE_TEXT}</span>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4">
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            boxShadow: ["0px 0px 0px 0px rgba(245,158,11,0.6)", "0px 0px 20px 8px rgba(245,158,11,0)", "0px 0px 0px 0px rgba(245,158,11,0)"] 
          }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          onClick={() => setShowBirthdayForm(true)}
          className="w-full bg-gradient-to-r from-secondary/80 via-secondary to-secondary/95 text-white py-3 rounded-2xl flex items-center justify-center gap-2 font-black text-[11px] sm:text-xs uppercase tracking-wider border border-secondary/20 relative overflow-hidden group"
        >
          <div className="absolute inset-0 shimmer opacity-30 mix-blend-overlay"></div>
          <Gift size={18} className="animate-bounce" />
          <span>¡Registra tu cumpleaños <span className="text-red-100">aquí</span> y recibe una dulce sorpresa arcoíris! 🎁</span>
        </motion.button>
      </div>

      <div className="px-5 pt-4 pb-3">
        <div className="relative w-full rounded-3xl overflow-hidden shadow-xl aspect-[2/1] bg-gray-100 flex items-center justify-center">
          <img 
            src="/banner.png" 
            alt={BUSINESS_NAME} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Si la imagen de banner no existe, muestra un placeholder elegante
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const placeholder = document.createElement('div');
                placeholder.className = "flex flex-col items-center justify-center text-gray-400 p-6 text-center";
                placeholder.innerHTML = `<span class='font-bold text-sm'>Banner del Negocio</span><span class='text-[10px] mt-1'>(Sube tu imagen 'banner.png' en la carpeta public)</span>`;
                parent.appendChild(placeholder);
              }
            }}
          />
        </div>
      </div>

      <div className="px-5 py-3 overflow-x-auto no-scrollbar">
        <div className="flex gap-2 w-max">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all duration-200 border
                ${activeCategory === cat.id
                  ? 'bg-primary text-white border-primary shadow-md shadow-primary/20'
                  : 'bg-white text-dark border-gray-200 hover:border-primary/40 hover:text-primary'
                }`}
            >
              {cat.nombre}
            </button>
          ))}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-32 px-5">
        {categories.map(cat => (
          <section key={cat.id} id={`cat-${cat.id}`} className="mb-10 scroll-mt-28">
            <div className="mb-5 pt-2">
              <div className="flex items-center gap-2 mb-1">
                <Utensils className="text-primary wave-icon" size={20} />
                <h3 className="font-title text-primary text-[26px] leading-none tracking-wide category-underline">
                  {cat.nombre}
                </h3>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {cat.items.map((dish, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  className="bg-white rounded-[2rem] overflow-hidden flex flex-col shadow-sm border border-gray-100 hover:border-primary/30 hover:shadow-md transition-all duration-200"
                >
                  <div 
                    className="bg-gray-50 aspect-square flex items-center justify-center relative overflow-hidden cursor-pointer group p-2"
                    onClick={() => dish.imagen && setSelectedImage(dish.imagen.startsWith('http') ? dish.imagen : `/${dish.imagen}`)}
                  >
                    {dish.imagen ? (
                      <img 
                        src={dish.imagen.startsWith('http') ? dish.imagen : `/${dish.imagen}`} 
                        alt={dish.nombre} 
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-300 rounded-2xl" 
                      />
                    ) : (
                      <div className="text-center p-2 flex flex-col items-center">
                        <Utensils className="text-gray-300 mb-1" size={24} />
                        <span className="text-gray-400 text-[9px] uppercase tracking-wider font-semibold">Sin imagen</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-4 flex flex-col flex-1">
                    <h4 className="font-bold text-dark text-[13px] leading-tight mb-1">
                      {dish.nombre}
                    </h4>
                    {dish.descripcion && (
                      <p className="text-[10px] text-gray-400 leading-tight mb-2">
                        {dish.descripcion}
                      </p>
                    )}
                    <div className="flex-1"></div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-bold text-dark text-[16px] whitespace-nowrap">
                        {dish.precio}
                      </span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => addToCart(dish)}
                        className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors duration-200 shrink-0"
                      >
                        <Plus size={16} strokeWidth={3} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        ))}

        <section className="mt-8 mb-4 border border-gray-100 bg-gray-50 rounded-3xl p-5 text-center shadow-sm">
          <h3 className="font-title text-primary text-[22px] leading-tight mb-2">¿Cómo estuvo todo?</h3>
          <p className="text-[11px] text-gray-500 mb-4 px-4">Ayúdanos a mejorar calificando tu experiencia con nosotros</p>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowReviewForm(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 mx-auto w-full"
          >
            <Star size={18} className="fill-white" />
            Reseña nuestra comida
          </motion.button>
        </section>

        <footer className="mt-8 pt-8 pb-10 border-t border-gray-200 flex flex-col items-center justify-center">
          <p className="font-title text-2xl text-primary mb-4">{BUSINESS_NAME}</p>
          <div className="w-32 h-32 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm mb-6 overflow-hidden">
            <img 
              src="/logo.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
              onError={(e) => {
                // Si la imagen de logo no existe, muestra un placeholder elegante
                e.currentTarget.style.display = 'none';
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const placeholder = document.createElement('div');
                  placeholder.className = "flex flex-col items-center justify-center text-gray-400 p-2 text-center";
                  placeholder.innerHTML = `<span class='font-bold text-[11px]'>Logo</span><span class='text-[8px] mt-0.5'>(Sube tu 'logo.png' en public)</span>`;
                  parent.appendChild(placeholder);
                }
              }}
            />
          </div>
          <p className="text-[11px] text-gray-400 font-medium">© 2026 Todos los derechos reservados.</p>
        </footer>

        <div className="bg-dark py-6 flex flex-col items-center justify-center rounded-2xl">
          <p className="text-[10px] font-bold tracking-[0.2em] uppercase mb-1 opacity-50 text-white/50">Digital Menu Experience</p>
          <motion.a 
            href="https://tymasolutions.lat/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 font-bold text-sm tracking-tight group cursor-pointer"
            whileTap={{ scale: 0.95 }}
          >
            <span className="text-white group-hover:text-[#00BFFF] transition-colors duration-200">Hecho por Tyma</span>
            <span className="text-[#00BFFF] group-hover:text-white transition-colors duration-200">Solutions</span>
          </motion.a>
        </div>
      </main>

      <AnimatePresence>
        {cartCount > 0 && !showSummary && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 w-full max-w-md p-5 z-40"
          >
            <div className="glass rounded-[2rem] p-4 flex items-center justify-between border border-white/50 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center relative overflow-hidden">
                  <div className="shimmer absolute inset-0 opacity-20"></div>
                  <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tu Pedido</p>
                  <p className="font-bold text-dark text-lg">{cartCount} Artículos</p>
                </div>
              </div>
              <button
                onClick={() => setShowSummary(true)}
                className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/30 font-bold text-sm"
              >
                Ver Pedido
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSummary && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end justify-center p-4 lg:p-0"
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[3rem] p-6 max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-title text-2xl text-primary">Mi Pedido</h2>
                <button
                  onClick={() => setShowSummary(false)}
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-3 mb-8">
                {cart.map(item => (
                  <div
                    key={`${item.nombre}-${item.precio}`}
                    className="flex items-center gap-4 bg-gray-50 p-4 rounded-2xl"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-dark text-sm truncate">{item.nombre}</h4>
                      <p className="text-xs text-primary font-bold">{item.precio}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-100">
                      <button onClick={() => updateQuantity(item.nombre, item.precio, -1)} className="text-gray-400">
                        <Minus size={16} />
                      </button>
                      <span className="font-bold text-sm w-4 text-center">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.nombre, item.precio, 1)} className="text-primary">
                        <Plus size={16} />
                      </button>
                    </div>
                    <button
                      onClick={() => updateQuantity(item.nombre, item.precio, -item.cantidad)}
                      className="text-red-300 ml-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t border-dashed border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-dark">Total a pagar</h3>
                  <h3 className="text-xl font-bold text-primary">S/.{calculateTotal().toFixed(2)}</h3>
                </div>
              </div>
              <button
                onClick={sendToWhatsApp}
                className="w-full bg-[#25D366] text-white py-4 rounded-2xl flex items-center justify-center gap-3 shadow-xl shadow-green-100 hover:scale-[1.02] transition-transform font-bold"
              >
                Enviar Pedido a WhatsApp
                <ChevronRight size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-6 right-6 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <X size={28} />
            </button>
            <motion.img
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage}
              alt="Plato ampliado"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showBirthdayForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowBirthdayForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center"
              >
                <X size={18} className="text-gray-400" />
              </button>

              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
                  <Gift size={24} className="text-secondary" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-2">¡Tu Cumpleaños!</h2>
                <p className="text-xs text-gray-500">Déjanos tus datos para enviarte una sorpresa en tu día especial.</p>
              </div>

              {birthdaySuccess ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-center text-sm font-bold border border-green-100">
                  ¡Gracias! Tus datos han sido guardados.
                </div>
              ) : (
                <form onSubmit={handleBirthdaySubmit} className="space-y-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre Completo</label>
                    <input required type="text" value={birthdayData.nombre} onChange={e => setBirthdayData({...birthdayData, nombre: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Teléfono</label>
                    <input required type="tel" minLength={9} maxLength={11} pattern="[0-9]*" value={birthdayData.telefono} onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setBirthdayData({...birthdayData, telefono: val});
                    }} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors" placeholder="Ej. 987654321" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Fecha de Nacimiento</label>
                    <input required type="date" value={birthdayData.fechaNacimiento} onChange={e => setBirthdayData({...birthdayData, fechaNacimiento: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors text-gray-700" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Distrito</label>
                    <input required type="text" value={birthdayData.distrito} onChange={e => setBirthdayData({...birthdayData, distrito: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors" placeholder="Ej. Miraflores" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Correo Electrónico (Opcional)</label>
                    <input type="email" value={birthdayData.correo} onChange={e => setBirthdayData({...birthdayData, correo: e.target.value})} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-secondary/50 transition-colors" placeholder="correo@ejemplo.com" />
                  </div>
                  
                  <button disabled={isSubmittingBirthday} type="submit" className="w-full bg-secondary text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-secondary/20 mt-2 disabled:opacity-70 flex justify-center items-center">
                    {isSubmittingBirthday ? <Loader2 size={18} className="animate-spin" /> : "Guardar mis datos"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showReviewForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowReviewForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center"
              >
                <X size={18} className="text-gray-400" />
              </button>

              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-12 h-12 bg-teal-50 rounded-full flex items-center justify-center mb-3">
                  <Star size={24} className="text-primary fill-primary" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-2">¡Calificanos!</h2>
                <p className="text-xs text-gray-500">Tu opinión es muy importante para nosotros.</p>
              </div>

              {reviewSuccess ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-center text-sm font-bold border border-green-100">
                  ¡Gracias por tu reseña! Nos ayuda a mejorar.
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-5">
                  
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-500 mb-2">Atención del Mozo</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setReviewData({...reviewData, estrellasMozo: star})}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star size={28} className={reviewData.estrellasMozo >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-500 mb-2">Calidad de la Comida</p>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setReviewData({...reviewData, estrellasComida: star})}
                          className="p-1 transition-transform hover:scale-110"
                        >
                          <Star size={28} className={reviewData.estrellasComida >= star ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Comentario (Opcional)</label>
                    <textarea 
                      rows={3} 
                      value={reviewData.comentario} 
                      onChange={e => setReviewData({...reviewData, comentario: e.target.value})} 
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none mt-1" 
                      placeholder="Cuéntanos más sobre tu experiencia..." 
                    />
                  </div>
                  
                  <button disabled={isSubmittingReview} type="submit" className="w-full bg-primary text-white py-3 rounded-xl font-bold text-sm shadow-md shadow-primary/20 mt-2 disabled:opacity-70 flex justify-center items-center">
                    {isSubmittingReview ? <Loader2 size={18} className="animate-spin" /> : "Enviar Reseña"}
                  </button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
