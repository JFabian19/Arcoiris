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
const LOCAL_IMAGES: Record<string, string> = {
  "Americano": "americano.png",
  "Capuccino": "Capuccino.png",
  "Caramel Latte": "Caramel Latte.png",
  "Chai Latte": "Chai Latte.png",
  "Chocolate Arcoiris": "Chocolate Arcoiris.png",
  "Expresso": "Expresso.png",
  "Fresa + papaya + piña": "Fresa+Papaya+Piña.png",
  "Fresa + plátano + naranja": "Fresa+Plátano+Naranja.png",
  "Iced Coffe": "Iced Coffe.png",
  "Latte": "Latte.png",
  "Mocaccino": "Mocaccino.png",
  "Orange Coffee": "Orange Coffee.png",
  "Papaya + piña": "Papaya+Piña.png"
};

const DEFAULT_CATEGORIES = [
  { nombre: "Bebidas Calientes" },
  { nombre: "Bebidas Frías" },
  { nombre: "Jugos" },
  { nombre: "Batidos" },
  { nombre: "Wafles" },
  { nombre: "Ensalada de frutas" },
  { nombre: "Frozen" },
  { nombre: "Bubble Juice" },
  { nombre: "Bubble Teas" },
  { nombre: "Bubble Lattes" },
  { nombre: "Bebidas Especiales" },
  { nombre: "Frappé" },
  { nombre: "Helados Frito" },
  { nombre: "Complementos" },
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
    "nombre del plato": "Fresa + papaya + piña",
    "descripción": "",
    "precio": "s/9.00",
    "URL de imagen": ""
},
{
    "categoría": "Jugos",
    "nombre del plato": "Fresa + plátano + naranja",
    "descripción": "",
    "precio": "s/9.00",
    "URL de imagen": ""
},
{
    "categoría": "Jugos",
    "nombre del plato": "Papaya + piña",
    "descripción": "",
    "precio": "s/9.00",
    "URL de imagen": ""
},
{
    "categoría": "Jugos",
    "nombre del plato": "Papaya + piña + naranja",
    "descripción": "",
    "precio": "s/9.00",
    "URL de imagen": ""
},
{
    "categoría": "Jugos",
    "nombre del plato": "Papaya + naranja",
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
    "nombre del plato": "Naranja",
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
    "nombre del plato": "Lúcuma + leche",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Batidos",
    "nombre del plato": "Fresa + plátano + leche",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Batidos",
    "nombre del plato": "Mango + fresa + leche",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Batidos",
    "nombre del plato": "Mango + leche",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Batidos",
    "nombre del plato": "Fresa + leche",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Batidos",
    "nombre del plato": "Papaya + leche",
    "descripción": "",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Wafles",
    "nombre del plato": "W. Clásico",
    "descripción": "Incluye fosh o miel de maple, fresa, plátano y arándanos",
    "precio": "S/20.00",
    "URL de imagen": ""
},
{
    "categoría": "Wafles",
    "nombre del plato": "W. Frutero",
    "descripción": "Incluye Nutella, fresa, plátano, durazno, arándanos, kiwi, mango",
    "precio": "S/22.00",
    "URL de imagen": ""
},
{
    "categoría": "Wafles",
    "nombre del plato": "W. Personalizado",
    "descripción": "Personaliza a tu gusto: nutella, miel de maple, fosh o manjar blanco + 3 frutas + 3 topping",
    "precio": "S/22.00",
    "URL de imagen": ""
},
{
    "categoría": "Wafles",
    "nombre del plato": "W. con Helado",
    "descripción": "Incluye Nutella + fresa + plátano + durazno + 1 topping y helado frito sabor a elección",
    "precio": "S/27.00",
    "URL de imagen": ""
},
{
    "categoría": "Ensalada de frutas",
    "nombre del plato": "Ensalada de frutas",
    "descripción": "La mejor selección de frutas de estación + yogurt + cereales",
    "precio": "S/17.00",
    "URL de imagen": ""
},
{
    "categoría": "Frozen",
    "nombre del plato": "Limonada Clásica",
    "descripción": "Fruta natural",
    "precio": "s/10.50",
    "URL de imagen": ""
},
{
    "categoría": "Frozen",
    "nombre del plato": "Limonada de Fresa",
    "descripción": "Fruta natural",
    "precio": "s/10.50",
    "URL de imagen": ""
},
{
    "categoría": "Frozen",
    "nombre del plato": "Maracumango",
    "descripción": "Fruta natural",
    "precio": "s/10.50",
    "URL de imagen": ""
},
{
    "categoría": "Frozen",
    "nombre del plato": "Maracuyá",
    "descripción": "Fruta natural",
    "precio": "s/10.50",
    "URL de imagen": ""
},
{
    "categoría": "Frozen",
    "nombre del plato": "Limonada",
    "descripción": "Fruta natural",
    "precio": "s/10.50",
    "URL de imagen": ""
},
{
    "categoría": "Frozen",
    "nombre del plato": "Durazno",
    "descripción": "Fruta natural",
    "precio": "s/10.50",
    "URL de imagen": ""
},
{
    "categoría": "Frozen",
    "nombre del plato": "Sandia",
    "descripción": "Fruta natural",
    "precio": "s/10.50",
    "URL de imagen": ""
},
{
    "categoría": "Frozen",
    "nombre del plato": "Mango",
    "descripción": "Fruta natural",
    "precio": "s/10.50",
    "URL de imagen": ""
},
{
    "categoría": "Frozen",
    "nombre del plato": "Piña",
    "descripción": "Fruta natural",
    "precio": "s/10.50",
    "URL de imagen": ""
},
{
    "categoría": "Frozen",
    "nombre del plato": "Fresa",
    "descripción": "Fruta natural",
    "precio": "s/10.50",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Juice",
    "nombre del plato": "Fresa",
    "descripción": "Bebidas a base de frutas naturales",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Juice",
    "nombre del plato": "Piña",
    "descripción": "Bebidas a base de frutas naturales",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Juice",
    "nombre del plato": "Fresa + papaya + piña",
    "descripción": "Bebidas a base de frutas naturales",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Juice",
    "nombre del plato": "Papaya + piña + naranja",
    "descripción": "Bebidas a base de frutas naturales",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Juice",
    "nombre del plato": "Granadilla + naranja + ...",
    "descripción": "Bebidas a base de frutas naturales",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Teas",
    "nombre del plato": "Bubble Tea de Fresa",
    "descripción": "Jazmine green tea",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Teas",
    "nombre del plato": "Bubble Tea de Mango",
    "descripción": "Jazmine green tea",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Teas",
    "nombre del plato": "Bubble Tea de Piña",
    "descripción": "Jazmine green tea",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Teas",
    "nombre del plato": "Bubble Tea de Uva",
    "descripción": "Jazmine green tea",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Teas",
    "nombre del plato": "Bubble Tea de Maracuyá",
    "descripción": "Jazmine green tea",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Teas",
    "nombre del plato": "Bubble Tea de Fresa + maracuyá",
    "descripción": "Jazmine green tea",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Teas",
    "nombre del plato": "Bubble Tea de Mango + maracuyá",
    "descripción": "Jazmine green tea",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Teas",
    "nombre del plato": "Bubble Tea de Maracuyá + Sandia",
    "descripción": "Jazmine green tea",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Lattes",
    "nombre del plato": "Taro",
    "descripción": "Latte con leche. Incluye tapioca",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Lattes",
    "nombre del plato": "Brown sugar",
    "descripción": "Latte con leche. Incluye tapioca",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Lattes",
    "nombre del plato": "Matcha",
    "descripción": "Latte con leche. Incluye tapioca",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Lattes",
    "nombre del plato": "Matcha fresa",
    "descripción": "Latte con leche. Incluye tapioca",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bubble Lattes",
    "nombre del plato": "Taro oreo",
    "descripción": "Latte con leche. Incluye tapioca",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bebidas Especiales",
    "nombre del plato": "Piña Colada",
    "descripción": "Bebida Tropical",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bebidas Especiales",
    "nombre del plato": "Coconut",
    "descripción": "Bebida Tropical",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Bebidas Especiales",
    "nombre del plato": "Strawberry matcha",
    "descripción": "Especialidad. Incluye complemento tapioca",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de café",
    "descripción": "Incluye café, crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de oreo",
    "descripción": "Incluye café, crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de caramelo",
    "descripción": "Incluye café, crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de manjar blanco",
    "descripción": "Incluye café, crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de moka",
    "descripción": "Incluye café, crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de Nutella",
    "descripción": "Incluye café, crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de Algarrobina",
    "descripción": "Incluye café, crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de Mocha Blanco",
    "descripción": "Incluye café, crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de Baileys",
    "descripción": "Incluye café, crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de Choco lúcuma",
    "descripción": "No Incluye café, incluye crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de Pie de limón",
    "descripción": "No Incluye café, incluye crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappé de Fresa",
    "descripción": "No Incluye café, incluye crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappe de Matcha",
    "descripción": "No Incluye café, incluye crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappe de maracuyá",
    "descripción": "No Incluye café, incluye crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappe de Choco Menta",
    "descripción": "No Incluye café, incluye crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappe de Cookies and Cream",
    "descripción": "No Incluye café, incluye crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Frappé",
    "nombre del plato": "Frappe de Pistacho",
    "descripción": "No Incluye café, incluye crema batida y topping",
    "precio": "s/15.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Oreo",
    "descripción": "Base Galletas",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Casino menta",
    "descripción": "Base Galletas",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Vainilla",
    "descripción": "Base Galletas",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Morochas",
    "descripción": "Base Galletas",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Pícaras",
    "descripción": "Base Galletas",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Nutella",
    "descripción": "Base Chocolates",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Chocman",
    "descripción": "Base Chocolates",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Beso de moza",
    "descripción": "Base Chocolates",
    "precio": "s/10.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Baileys",
    "descripción": "Base Licores",
    "precio": "s/14.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Ron c/n pasas",
    "descripción": "Base Licores",
    "precio": "s/14.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Piña Colada",
    "descripción": "Base Licores",
    "precio": "s/14.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Café",
    "descripción": "Otros sabores",
    "precio": "s/12.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Algarrobina",
    "descripción": "Otros sabores",
    "precio": "s/12.00",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Fresa",
    "descripción": "Base Frutas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Lúcuma",
    "descripción": "Base Frutas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Mango",
    "descripción": "Base Frutas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Arándanos",
    "descripción": "Base Frutas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Coco",
    "descripción": "Base Frutas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Aguaymanto",
    "descripción": "Base Frutas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Plátano",
    "descripción": "Base Frutas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Limón",
    "descripción": "Base Frutas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Kiwi",
    "descripción": "Base Frutas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Helados Frito",
    "nombre del plato": "Helado de Maracuyá",
    "descripción": "Base Frutas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Mango",
    "descripción": "Complemento extra",
    "precio": "+S/3.00",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Tapioca",
    "descripción": "Complemento extra",
    "precio": "+S/3.00",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Arándanos",
    "descripción": "Complemento extra",
    "precio": "+S/3.00",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Fresa",
    "descripción": "Complemento extra",
    "precio": "+S/3.00",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Maracuyá",
    "descripción": "Complemento extra",
    "precio": "+S/3.00",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Manzana Verde",
    "descripción": "Complemento extra",
    "precio": "+S/3.00",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Popping Boba",
    "descripción": "Topping para helados o bebidas",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Pecanas",
    "descripción": "Topping para helado frito",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Chispas de chocolate",
    "descripción": "Topping para helado frito",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Malvaviscos",
    "descripción": "Topping para helado frito",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Chin-chin",
    "descripción": "Topping para helado frito",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Gomitas",
    "descripción": "Topping para helado frito",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Oreo",
    "descripción": "Topping para helado frito",
    "precio": "",
    "URL de imagen": ""
},
{
    "categoría": "Complementos",
    "nombre del plato": "Barquillos",
    "descripción": "Topping para helado frito",
    "precio": "",
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
    "descripción": "Sabores: Naranja Chocolate, Zanahoria, Platano",
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

// Configuración estética de categorías de Arcoiris
const CATEGORY_THEMES: Record<string, {
  icon: string;
  bgLight: string;
  bgActive: string;
  text: string;
  border: string;
  accent: string;
}> = {
  "Bebidas Calientes": { icon: "☕", bgLight: "bg-amber-50/70", bgActive: "bg-amber-500", text: "text-amber-800", border: "border-amber-100", accent: "amber" },
  "Bebidas Frías": { icon: "🥤", bgLight: "bg-cyan-50/70", bgActive: "bg-cyan-500", text: "text-cyan-800", border: "border-cyan-100", accent: "cyan" },
  "Jugos": { icon: "🍊", bgLight: "bg-orange-50/70", bgActive: "bg-orange-500", text: "text-orange-850", border: "border-orange-100", accent: "orange" },
  "Batidos": { icon: "🍓", bgLight: "bg-rose-50/70", bgActive: "bg-rose-500", text: "text-rose-800", border: "border-rose-100", accent: "rose" },
  "Wafles": { icon: "🧇", bgLight: "bg-yellow-50/70", bgActive: "bg-yellow-500", text: "text-yellow-850", border: "border-yellow-100", accent: "yellow" },
  "Ensalada de frutas": { icon: "🥣", bgLight: "bg-emerald-50/70", bgActive: "bg-emerald-500", text: "text-emerald-800", border: "border-emerald-100", accent: "emerald" },
  "Frozen": { icon: "🍧", bgLight: "bg-teal-50/70", bgActive: "bg-teal-500", text: "text-teal-800", border: "border-teal-100", accent: "teal" },
  "Bubble Juice": { icon: "🧃", bgLight: "bg-lime-50/70", bgActive: "bg-lime-500", text: "text-lime-850", border: "border-lime-100", accent: "lime" },
  "Bubble Teas": { icon: "🧋", bgLight: "bg-sky-50/70", bgActive: "bg-sky-500", text: "text-sky-850", border: "border-sky-100", accent: "sky" },
  "Bubble Lattes": { icon: "🧋", bgLight: "bg-indigo-50/70", bgActive: "bg-indigo-500", text: "text-indigo-850", border: "border-indigo-100", accent: "indigo" },
  "Bebidas Especiales": { icon: "✨", bgLight: "bg-violet-50/70", bgActive: "bg-violet-500", text: "text-violet-850", border: "border-violet-100", accent: "violet" },
  "Frappé": { icon: "🍧", bgLight: "bg-rose-50/70", bgActive: "bg-rose-500", text: "text-rose-800", border: "border-rose-100", accent: "rose" },
  "Helados Frito": { icon: "🍦", bgLight: "bg-pink-50/70", bgActive: "bg-pink-500", text: "text-pink-850", border: "border-pink-100", accent: "pink" },
  "Complementos": { icon: "🍫", bgLight: "bg-yellow-50/70", bgActive: "bg-yellow-600", text: "text-yellow-900", border: "border-yellow-200", accent: "yellow" },
  "Sandwich": { icon: "🥪", bgLight: "bg-amber-100/70", bgActive: "bg-amber-600", text: "text-amber-950", border: "border-amber-200", accent: "amber" },
  "Postres": { icon: "🍰", bgLight: "bg-purple-50/70", bgActive: "bg-purple-500", text: "text-purple-850", border: "border-purple-100", accent: "purple" }
};

const DEFAULT_THEME = { icon: "✨", bgLight: "bg-primary/5", bgActive: "bg-primary", text: "text-primary", border: "border-primary/10", accent: "primary" };

const getCategoryTheme = (name: string) => {
  return CATEGORY_THEMES[name] || DEFAULT_THEME;
};

// Formateador de precios oficial S/. XX.XX
const formatPrice = (p: string) => {
  if (!p) return 'S/. 0.00';
  const clean = p.toUpperCase().replace('S/', '').replace('. ', '.').trim();
  if (clean.startsWith('.')) {
    return `S/${clean}`;
  }
  return `S/. ${clean}`;
};

// Renderizador dinámico de vectores SVG para platos sin imagen
const RenderPlaceholderSVG = ({ category, name }: { category: string, name: string }) => {
  const theme = getCategoryTheme(category);
  const strokeColor = "currentColor";
  
  const getSVGPath = () => {
    switch (category) {
      case "Bebidas Calientes":
        return (
          <g>
            <path d="M12 24 C 6 24, 6 12, 12 12 L 28 12 C 34 12, 34 24, 28 24 Z" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M28 15 C 33 15, 33 21, 28 21" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M15 9 C 15 7, 17 7, 17 5" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M20 9 C 20 7, 22 7, 22 5" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M25 9 C 25 7, 27 7, 27 5" fill="none" stroke={strokeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M8 27 L 32 27" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
          </g>
        );
      case "Wafles":
      case "Ensalada de frutas":
        return (
          <g>
            <rect x="8" y="8" width="24" height="24" rx="4" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <line x1="14" y1="8" x2="14" y2="32" stroke={strokeColor} strokeWidth="2" />
            <line x1="20" y1="8" x2="20" y2="32" stroke={strokeColor} strokeWidth="2" />
            <line x1="26" y1="8" x2="26" y2="32" stroke={strokeColor} strokeWidth="2" />
            <line x1="8" y1="14" x2="32" y2="14" stroke={strokeColor} strokeWidth="2" />
            <line x1="8" y1="20" x2="32" y2="20" stroke={strokeColor} strokeWidth="2" />
            <line x1="8" y1="26" x2="32" y2="26" stroke={strokeColor} strokeWidth="2" />
            <circle cx="20" cy="20" r="3" fill="#ff4d6d" opacity="0.8" />
          </g>
        );
      case "Helados Frito":
        return (
          <g>
            <path d="M8 18 C 8 28, 32 28, 32 18 Z" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <path d="M20 25 L 20 30" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <path d="M14 30 L 26 30" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="15" cy="14" r="5" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="25" cy="14" r="5" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="20" cy="11" r="5" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <circle cx="20" cy="5" r="2.5" fill="#ff4d6d" />
            <path d="M20 5 C 21 2, 23 2, 24 3" fill="none" stroke={strokeColor} strokeWidth="1.5" />
          </g>
        );
      case "Bubble Juice":
      case "Bubble Teas":
      case "Bubble Lattes":
      case "Bebidas Especiales":
      case "Frappé":
      case "Frozen":
        return (
          <g>
            <path d="M10 8 L 13 28 C 13 30, 15 31, 18 31 L 22 31 C 25 31, 27 30, 27 28 L 30 8 Z" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M8 8 L 32 8" fill="none" stroke={strokeColor} strokeWidth="3" strokeLinecap="round" />
            <path d="M24 2 L 24 16 L 21 28" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="15" cy="22" r="2" fill="currentColor" />
            <circle cx="19" cy="25" r="2" fill="currentColor" />
            <circle cx="23" cy="21" r="2" fill="currentColor" />
            <circle cx="25" cy="26" r="2" fill="currentColor" />
            <circle cx="16" cy="27" r="2" fill="currentColor" />
          </g>
        );
      case "Postres":
        return (
          <g>
            <path d="M5 26 L 31 26 L 27 15 L 5 15 Z" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M27 15 L 18 8 L 5 15" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
            <line x1="5" y1="20" x2="29" y2="20" stroke={strokeColor} strokeWidth="1.5" />
            <circle cx="18" cy="5" r="2" fill="#ff4d6d" />
          </g>
        );
      case "Sandwich":
        return (
          <g>
            <path d="M6 26 L 26 26 L 6 6 Z" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M12 28 L 32 28 L 32 8 Z" fill="none" stroke={strokeColor} strokeWidth="2.5" strokeLinejoin="round" />
            <path d="M6 18 C 8 16, 12 20, 16 18" fill="none" stroke="#06d6a0" strokeWidth="2" />
          </g>
        );
      default:
        return (
          <g>
            <circle cx="20" cy="18" r="9" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <path d="M15 27 C 15 22, 25 22, 25 27 Z" fill="none" stroke={strokeColor} strokeWidth="2.5" />
            <path d="M28 8 L 30 6" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
            <path d="M28 6 L 30 8" fill="none" stroke={strokeColor} strokeWidth="1.5" strokeLinecap="round" />
          </g>
        );
    }
  };

  return (
    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${theme.bgLight} ${theme.text} relative`}>
      <svg width="36" height="36" viewBox="0 0 40 40" className="opacity-90">
        {getSVGPath()}
      </svg>
      <span className="absolute -top-1 -right-1 text-[10px] animate-pulse">✨</span>
    </div>
  );
};

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
    <div className="max-w-md mx-auto bg-bg min-h-screen relative shadow-2xl overflow-hidden flex flex-col font-sans">
      <div className="sprinkles-pattern"></div>
      <header className="sticky top-0 bg-bg/90 backdrop-blur-md z-50 px-4 py-3 flex justify-between items-center border-b border-primary/5">
        <div className="flex items-center">
          <img 
            src="/logo.png" 
            alt="Arcoiris Logo" 
            className="h-10 sm:h-11 w-auto object-contain select-none"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const parent = e.currentTarget.parentElement;
              if (parent) {
                const fallback = document.createElement('span');
                fallback.className = "font-logo text-2xl text-primary";
                fallback.innerText = "Arcoiris 🌈";
                parent.appendChild(fallback);
              }
            }}
          />
        </div>
        <div className="flex items-center gap-2">
          {FACEBOOK_URL && (
            <motion.a
              href={FACEBOOK_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors"
            >
              <Facebook size={20} />
            </motion.a>
          )}
          {MAPS_URL && (
            <motion.a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary cursor-pointer hover:bg-primary hover:text-white transition-colors"
            >
              <MapPin size={20} />
            </motion.a>
          )}
          <motion.div
            onClick={() => cartCount > 0 && setShowSummary(true)}
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center relative cursor-pointer hover:bg-primary hover:text-white group transition-colors"
          >
            <ShoppingBag size={20} className="text-primary group-hover:text-white transition-colors" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-4.5 bg-secondary text-white rounded-full text-[9px] font-black flex items-center justify-center px-1 border border-white">
                {cartCount}
              </span>
            )}
          </motion.div>
        </div>
      </header>

      <div className="w-full bg-gradient-to-r from-primary via-secondary to-primary py-2 overflow-hidden flex items-center">
        <div className="animate-marquee flex gap-6 text-white font-slogan font-bold text-[11px] tracking-widest uppercase whitespace-nowrap">
          {[...Array(10)].map((_, i) => (
            <span key={i}>{MARQUEE_TEXT}</span>
          ))}
        </div>
      </div>

      <div className="px-5 pt-4">
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          animate={{ 
            boxShadow: ["0px 0px 0px 0px rgba(255,77,109,0.4)", "0px 0px 20px 8px rgba(255,77,109,0)", "0px 0px 0px 0px rgba(255,77,109,0)"] 
          }}
          transition={{ repeat: Infinity, duration: 2 }}
          onClick={() => setShowBirthdayForm(true)}
          className="w-full bg-gradient-to-r from-primary via-secondary to-primary text-white py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-[11px] sm:text-xs uppercase tracking-wider border border-white/20 relative overflow-hidden group shadow-md cursor-pointer"
        >
          <div className="absolute inset-0 shimmer opacity-20 mix-blend-overlay"></div>
          <Gift size={18} className="animate-bounce" />
          <span>¡Registra tu cumpleaños <span className="underline decoration-wavy text-yellow-100 font-extrabold">aquí</span> y recibe una sorpresa! 🎁</span>
        </motion.button>
      </div>

      <div className="px-5 pt-4 pb-3">
        <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-md aspect-[2/1] bg-gray-50 flex items-center justify-center border border-primary/5">
          <img 
            src="/banner.png" 
            alt={BUSINESS_NAME} 
            className="w-full h-full object-cover"
            onError={(e) => {
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
        <div className="flex gap-2 w-max py-1">
          {categories.map(cat => {
            const theme = getCategoryTheme(cat.nombre);
            const isActive = activeCategory === cat.id;
            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => scrollToCategory(cat.id)}
                className={`px-4 py-2.5 rounded-full text-[10px] font-title font-black uppercase tracking-wider whitespace-nowrap transition-all duration-200 border flex items-center gap-1.5 cursor-pointer shadow-sm
                  ${isActive
                    ? `${theme.bgActive} text-white border-transparent shadow-md scale-105`
                    : `bg-white/80 backdrop-blur-sm text-dark ${theme.border} hover:border-primary/40`
                  }`}
              >
                <span className="text-xs">{theme.icon.trim()}</span>
                {cat.nombre}
              </motion.button>
            );
          })}
        </div>
      </div>

      <main className="flex-1 overflow-y-auto pb-32 px-5">
        {categories.map(cat => {
          const theme = getCategoryTheme(cat.nombre);
          return (
            <section key={cat.id} id={`cat-${cat.id}`} className="mb-10 scroll-mt-28">
              <div className="mb-6 pt-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-3xl wave-icon select-none">{theme.icon.trim()}</span>
                  <h3 className="font-title text-primary text-[25px] sm:text-[27px] font-black tracking-wide leading-none uppercase category-underline">
                    {cat.nombre}
                  </h3>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {cat.items.map((dish, idx) => {
                  const isPopular = idx % 5 === 0;
                  const isNew = idx % 7 === 3;
                  return (
                    <motion.div
                      key={idx}
                      whileHover={{ y: -6, boxShadow: "0 12px 20px -8px rgba(255, 77, 109, 0.15)" }}
                      className="bg-white/90 backdrop-blur-sm rounded-[2rem] overflow-hidden flex flex-col shadow-sm border border-gray-100/80 hover:border-primary/20 transition-all duration-300 relative group"
                    >
                      {isPopular && (
                        <span className="absolute top-2.5 left-2.5 z-10 bg-secondary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm select-none">
                          ⭐ TOP
                        </span>
                      )}
                      {isNew && (
                        <span className="absolute top-2.5 left-2.5 z-10 bg-primary text-white text-[8px] font-black uppercase px-2 py-0.5 rounded-full shadow-sm select-none">
                          🍦 NUEVO
                        </span>
                      )}
                      
                      <div 
                        className="bg-gray-50/50 aspect-square flex items-center justify-center relative overflow-hidden cursor-pointer group p-2"
                        onClick={() => dish.imagen && setSelectedImage(dish.imagen.startsWith('http') ? dish.imagen : `/${dish.imagen}`)}
                      >
                        {dish.imagen ? (
                          <img 
                            src={dish.imagen.startsWith('http') ? dish.imagen : `/${dish.imagen}`} 
                            alt={dish.nombre} 
                            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 rounded-2xl" 
                          />
                        ) : (
                          <RenderPlaceholderSVG category={cat.nombre} name={dish.nombre} />
                        )}
                      </div>
                      
                      <div className="p-4 flex flex-col flex-1">
                        <h4 className="font-title text-dark text-[13px] leading-tight mb-1 font-bold group-hover:text-primary transition-colors">
                          {dish.nombre}
                        </h4>
                        {dish.descripcion && (
                          <p className="text-[10px] text-gray-500 leading-tight mb-2 line-clamp-2">
                            {dish.descripcion}
                          </p>
                        )}
                        <div className="flex-1"></div>
                        <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-50">
                          <span className="font-title text-primary text-[15px] font-black">
                            {formatPrice(dish.precio)}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.8 }}
                            whileHover={{ scale: 1.1 }}
                            onClick={() => addToCart(dish)}
                            className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-all duration-200 shrink-0 cursor-pointer"
                          >
                            <Plus size={16} strokeWidth={3} />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}

        <section className="mt-8 mb-4 border border-primary/10 bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 rounded-[2.5rem] p-6 text-center shadow-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-8 h-8 bg-primary/10 rounded-full blur-sm -translate-x-3 -translate-y-3"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-secondary/10 rounded-full blur-sm translate-x-4 translate-y-4"></div>
          
          <h3 className="font-title text-primary text-[22px] leading-tight mb-1.5 flex items-center justify-center gap-1.5">
            <span>¿Qué tan dulce fue tu visita?</span>
            <span className="animate-bounce">🍭</span>
          </h3>
          <p className="text-[11px] text-gray-500 mb-4 px-4 leading-normal">Cuéntanos tu experiencia y ayúdanos a llenar el mundo de sabor</p>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowReviewForm(true)}
            className="bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-md shadow-primary/20 flex items-center justify-center gap-2 mx-auto w-full max-w-xs cursor-pointer"
          >
            <Star size={18} className="fill-white" />
            Califica tu experiencia
          </motion.button>
        </section>

        <footer className="mt-10 pt-8 pb-10 border-t border-primary/10 flex flex-col items-center justify-center">
          <div className="h-12 mb-6 flex items-center justify-center animate-float">
            <img 
              src="/logo.png" 
              alt="Arcoiris Logo" 
              className="h-full object-contain select-none"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
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
                  <p className="font-title text-[9px] font-bold text-gray-400 uppercase tracking-widest">Tu Pedido</p>
                  <p className="font-title font-black text-dark text-lg leading-tight">{cartCount} Artículos</p>
                </div>
              </div>
              <button
                onClick={() => setShowSummary(true)}
                className="bg-primary hover:bg-primary/95 text-white px-6 py-3 rounded-2xl flex items-center gap-2 shadow-lg shadow-primary/30 font-title font-black text-xs uppercase tracking-wider cursor-pointer transition-colors"
              >
                Ver Pedido
                <ChevronRight size={16} className="animate-[float_1.5s_infinite]" />
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
            onClick={() => setShowSummary(false)}
          >
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="bg-white w-full max-w-md rounded-t-[3rem] p-6 pb-12 max-h-[85vh] overflow-y-auto ticket-edge shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-title text-2xl font-bold tracking-tight text-primary flex items-center gap-2">
                  <span>Tu Pedido Dulce</span>
                  <span className="animate-bounce">🧁</span>
                </h2>
                <button
                  onClick={() => setShowSummary(false)}
                  className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors cursor-pointer"
                >
                  <X size={20} className="text-gray-400" />
                </button>
              </div>
              <div className="space-y-3 mb-8">
                {cart.map(item => (
                  <div
                    key={`${item.nombre}-${item.precio}`}
                    className="flex items-center gap-4 bg-gray-50/70 p-4 rounded-2xl border border-gray-100/65"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="font-title text-dark text-sm font-semibold tracking-wide truncate">{item.nombre}</h4>
                      <p className="font-title text-xs font-bold text-primary mt-1">{formatPrice(item.precio)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-xl border border-gray-150">
                      <button onClick={() => updateQuantity(item.nombre, item.precio, -1)} className="text-gray-400 hover:text-primary cursor-pointer transition-colors">
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="font-title font-bold text-sm w-4 text-center text-dark">{item.cantidad}</span>
                      <button onClick={() => updateQuantity(item.nombre, item.precio, 1)} className="text-primary hover:text-secondary cursor-pointer transition-colors">
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>
                    <button
                      onClick={() => updateQuantity(item.nombre, item.precio, -item.cantidad)}
                      className="text-red-400 hover:text-red-600 ml-1 cursor-pointer transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
              <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center">
                  <h3 className="font-title text-sm font-bold text-gray-500 uppercase tracking-wider">Total del Pedido:</h3>
                  <h3 className="font-title text-2xl font-black text-primary tracking-tight">S/. {calculateTotal().toFixed(2)}</h3>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={sendToWhatsApp}
                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white py-4 rounded-2xl flex items-center justify-center gap-2.5 shadow-lg shadow-green-150 transition-colors font-title font-black text-sm uppercase tracking-wider cursor-pointer"
              >
                <span>Enviar Pedido a WhatsApp</span>
                <ChevronRight size={18} className="animate-[float_1.5s_infinite]" />
              </motion.button>
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
            onClick={() => setShowBirthdayForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowBirthdayForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
 
              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-14 h-14 bg-gradient-to-tr from-secondary to-primary/80 rounded-full flex items-center justify-center mb-3 shadow-md animate-float">
                  <Gift size={26} className="text-white" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-2">¡Tu Cumpleaños!</h2>
                <p className="text-xs text-gray-500 leading-relaxed px-4">Déjanos tus datos para enviarte una dulce sorpresa en tu día especial. 🧁</p>
              </div>
 
              {birthdaySuccess ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-center text-sm font-bold border border-green-100 animate-bounce">
                  ¡Gracias! Tus datos han sido guardados. 🎉
                </div>
              ) : (
                <form onSubmit={handleBirthdaySubmit} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Nombre Completo</label>
                    <input required type="text" value={birthdayData.nombre} onChange={e => setBirthdayData({...birthdayData, nombre: e.target.value})} className="w-full bg-gray-50/50 border border-gray-150 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Teléfono</label>
                    <input required type="tel" minLength={9} maxLength={11} pattern="[0-9]*" value={birthdayData.telefono} onChange={e => {
                      const val = e.target.value.replace(/\D/g, '');
                      setBirthdayData({...birthdayData, telefono: val});
                    }} className="w-full bg-gray-50/50 border border-gray-150 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" placeholder="Ej. 987654321" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Fecha de Nacimiento</label>
                    <input required type="date" value={birthdayData.fechaNacimiento} onChange={e => setBirthdayData({...birthdayData, fechaNacimiento: e.target.value})} className="w-full bg-gray-50/50 border border-gray-150 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all text-gray-700 font-medium" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Distrito</label>
                    <input required type="text" value={birthdayData.distrito} onChange={e => setBirthdayData({...birthdayData, distrito: e.target.value})} className="w-full bg-gray-50/50 border border-gray-150 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" placeholder="Ej. Miraflores" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase ml-1">Correo Electrónico (Opcional)</label>
                    <input type="email" value={birthdayData.correo} onChange={e => setBirthdayData({...birthdayData, correo: e.target.value})} className="w-full bg-gray-50/50 border border-gray-150 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/20 focus:border-secondary transition-all" placeholder="correo@ejemplo.com" />
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmittingBirthday} 
                    type="submit" 
                    className="w-full bg-secondary text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-secondary/20 mt-2 disabled:opacity-70 flex justify-center items-center cursor-pointer"
                  >
                    {isSubmittingBirthday ? <Loader2 size={18} className="animate-spin" /> : "Guardar mis datos"}
                  </motion.button>
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
            onClick={() => setShowReviewForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowReviewForm(false)}
                className="absolute top-4 right-4 w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
              >
                <X size={18} className="text-gray-400" />
              </button>
 
              <div className="flex flex-col items-center text-center mb-5 mt-2">
                <div className="w-14 h-14 bg-pink-100 rounded-full flex items-center justify-center mb-3 animate-float">
                  <Star size={26} className="text-primary fill-primary" />
                </div>
                <h2 className="font-title text-2xl text-dark leading-none mb-2">¡Tu Opinión!</h2>
                <p className="text-xs text-gray-500 leading-relaxed px-4">Califica tu experiencia para seguir endulzando tus momentos.</p>
              </div>
 
              {reviewSuccess ? (
                <div className="bg-green-50 text-green-600 p-4 rounded-2xl text-center text-sm font-bold border border-green-100 animate-bounce">
                  ¡Gracias por tu reseña! Nos ayuda muchísimo. 💖
                </div>
              ) : (
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  
                  <div className="bg-gray-50/50 p-4 rounded-[1.5rem] border border-gray-100 flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-500 mb-2 font-title uppercase tracking-wider">Atención del Mozo</p>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setReviewData({...reviewData, estrellasMozo: star})}
                          className="p-1 transition-transform hover:scale-120 cursor-pointer"
                        >
                          <Star size={28} className={reviewData.estrellasMozo >= star ? "text-yellow-400 fill-yellow-400 filter drop-shadow-sm" : "text-gray-200"} />
                        </button>
                      ))}
                    </div>
                  </div>
 
                  <div className="bg-gray-50/50 p-4 rounded-[1.5rem] border border-gray-100 flex flex-col items-center">
                    <p className="text-xs font-bold text-gray-500 mb-2 font-title uppercase tracking-wider">Calidad de la Comida</p>
                    <div className="flex gap-1.5">
                      {[1,2,3,4,5].map(star => (
                        <button 
                          key={star} type="button" 
                          onClick={() => setReviewData({...reviewData, estrellasComida: star})}
                          className="p-1 transition-transform hover:scale-120 cursor-pointer"
                        >
                          <Star size={28} className={reviewData.estrellasComida >= star ? "text-yellow-400 fill-yellow-400 filter drop-shadow-sm" : "text-gray-200"} />
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
                      className="w-full bg-gray-50/50 border border-gray-150 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none mt-1" 
                      placeholder="Cuéntanos más sobre tu experiencia..." 
                    />
                  </div>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmittingReview} 
                    type="submit" 
                    className="w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-sm shadow-md shadow-primary/20 mt-2 disabled:opacity-70 flex justify-center items-center cursor-pointer"
                  >
                    {isSubmittingReview ? <Loader2 size={18} className="animate-spin" /> : "Enviar Reseña"}
                  </motion.button>
                </form>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
