/**
 * State Context Provider
 *
 * Global state management for shopping cart, quantity, and UI state.
 * Provides cart operations (add, remove, update), quantity management,
 * and toast notifications for user feedback.*
 * @module StateContext
 * @component StateContext
 * @hook useStateContext
 *
 * @example
 * // Wrap your app with StateContext
 * <StateContext>
 *   <App />
 * </StateContext>
 *
 * // Use in components
 * const { cartItems, onAdd, onRemove } = useStateContext();
 *
 * @features
 * - Cart state management (items, totals, quantities)
 * - Optimistic updates with rollback on error
 * - Toast notifications for user feedback
 * - Quantity management with constraints
 * - Cart visibility control
 *
 * @dependencies
 * - react-hot-toast: For user notifications
 * - react: Context API and hooks
 */
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "react-hot-toast";
import { useUser } from "@clerk/nextjs";

const Context = createContext<AppContext | undefined>(undefined);

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
}

interface AppContext {
  showCart: boolean;
  cartItems: CartItem[];
  totalPrice: number;
  totalQty: number;
  qty: number;
  setShowCart: (show: boolean) => void;
  setCartItems: (items: CartItem[]) => void;
  setTotalPrice: (price: number) => void;
  setTotalQty: (qty: number) => void;
  setQty: (qty: number) => void;
  incQty: () => void;
  decQty: () => void;
  onAdd: (product: CartItem, quantity: number) => void;
  onRemove: (product: CartItem) => void;
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (product: WishlistItem) => void;
}

interface StateContextProps {
  children: ReactNode;
}

export const StateContext = ({ children }: StateContextProps) => {
  const { user } = useUser();

  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  
  const onAdd = (product: CartItem, quantity: number) => {
    const alreadyInCart = cartItems.find((item) => item._id === product._id);

    setTotalPrice((prev) => prev + product.price * quantity);
    setTotalQty((prev) => prev + quantity);

    if (alreadyInCart) {
      setCartItems(
        cartItems.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity }]);
    }

    setQty(1);
    setShowCart(true);
    toast.success(`${quantity} ${product.name} added to cart!`);
  };

  const onRemove = (product: CartItem) => {
    const found = cartItems.find((item) => item._id === product._id);
    if (!found) return;

    setCartItems(cartItems.filter((item) => item._id !== product._id));
    setTotalPrice((prev) => prev - found.price * found.quantity);
    setTotalQty((prev) => prev - found.quantity);
    toast.success(`${product.name} removed from cart!`);
  };

  const incQty = () => setQty((prev) => prev + 1);
  const decQty = () => setQty((prev) => (prev <= 1 ? 1 : prev - 1));

// Wishlist logic
//uses guest if not linked in -shared local storage 
  const wishlistKey = user ? `wishlist_${user.id}` : "wishlist_guest";
  useEffect(() => {
    const saved = localStorage.getItem(wishlistKey);
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch {
        localStorage.removeItem(wishlistKey);
      }
    } else {
      //get rid of whislist when switching user
      setWishlistItems([]);
    }
  }, [wishlistKey]);

  useEffect(() => {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, wishlistKey]);


  function addToWishlist(product: WishlistItem) {
    if (wishlistItems.find((item) => item._id === product._id)) {
      toast.error(`${product.name} is already in your wishlist`);
      return;
    }

    setWishlistItems([...wishlistItems, product]);
    toast.success(`${product.name} added to wishlist!`);
  } 
  
  function isInWishlist(productId: string) {
    return wishlistItems.some((item) => item._id === productId);
  }

  function removeFromWishlist(productId: string) {
    const product = wishlistItems.find((item) => item._id === productId);
    setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
    if (product) toast.success(`${product.name} removed from wishlist`);
  }

 

  function moveToCart(product: WishlistItem) {
    const cartItem: CartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    };
    onAdd(cartItem, 1);
    removeFromWishlist(product._id);
  }

  const value: AppContext = {
    showCart,
    setShowCart,
    cartItems,
    setCartItems,
    totalPrice,
    setTotalPrice,
    totalQty,
    setTotalQty,
    qty,
    setQty,
    incQty,
    decQty,
    onAdd,
    onRemove,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    moveToCart,
  };

  return <Context.Provider value={value}>{children}</Context.Provider>;
};

export const useStateContext = (): AppContext => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("useStateContext must be used within StateContext");
  }
  return context;
};