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

const Context = createContext<cartContext | undefined>(undefined);

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

// added for wishlist feature
export interface WishlistItem {
  _id: string;
  name: string;
  price: number;
  image?: string;
  slug: string;
}

interface cartContext {
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

  //wishlist stuff
  wishlistItems: WishlistItem[];
  addToWishlist: (product: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  moveToCart: (product: WishlistItem) => void;
}

//context provider component
interface StateContextProps {
  children: ReactNode;
}

export const StateContext = ({ children }: StateContextProps) => {
  const { user } = useUser();

  //initialise all states
  const [showCart, setShowCart] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalQty, setTotalQty] = useState(0);
  const [qty, setQty] = useState(1);
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);

  /**
   * Adds product to cart or updates quantity if already exists
   * Uses optimistic updates with rollback on error
   *
   * @async
   * @function onAdd
   * @param {CartItem} product - Product to add to cart
   * @param {number} quantity - Quantity to add
   * @returns {Promise<void>}
   *
   * @example
   * await onAdd(product, 2); // Adds 2 of product to cart
   *
   * @sideeffects
   * - Updates cartItems, totalPrice, totalQty state
   * - Shows cart popup
   * - Displays success/error toast
   * - Resets quantity selector to 1
   */
  const onAdd = async (product: CartItem, quantity: number) => {
    //saves current state as prev(used for rollback)
    const prevCartItems = [...cartItems]; //creates copy of the whole cart array
    const prevTotalQty = totalQty;
    const prevTotalPrice = totalPrice;

    const checkProductInCart = cartItems.find(
      (item) => item._id === product._id
    );
    //checks if addes item is already in cart just increase qty

    setTotalPrice(
      (prevTotalPrice) => prevTotalPrice + product.price * quantity
    );
    setTotalQty((prevTotalQty) => prevTotalQty + quantity);
    //can set these form the begining

    if (checkProductInCart) {
      const updatedCartItems = cartItems.map((cartProduct) => {
        if (cartProduct._id === product._id) {
          return {
            ...cartProduct,
            quantity: cartProduct.quantity + quantity,
          };
          //increase quanity if product already in cart
        }
        //return product if its not
        return cartProduct;
      });
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { ...product, quantity: quantity }]);
    }

    setQty(1);

    setShowCart(true);

    try {
      //0.5s delay for server call so it looks cleaner

      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success(`${quantity} ${product.name} added to cart!`);
    } catch (error) {
      //rollback on error
      setCartItems(prevCartItems);
      setTotalPrice(prevTotalPrice);
      setTotalPrice(prevTotalQty);

      toast.error(`failed to add ${product.name} please try again`);
    }
  };

  /**
   * Removes product from cart and updates totals
   *
   * @function onRemove
   * @param {CartItem} product - Product to remove from cart
   * @returns {void}
   *
   * @example
   * onRemove(product); // Removes product from cart
   */

  const onRemove = (product: CartItem) => {
    const selectedProduct = cartItems.find((item) => item._id === product._id);
    const newCartItems = cartItems.filter((item) => item._id !== product._id);

    if (selectedProduct) {
      setCartItems(newCartItems);
      //set items without that product
      setTotalPrice(
        (prevTotalPrice) =>
          prevTotalPrice - selectedProduct.price * selectedProduct.quantity
      );
      //reset qty to correct counter after product is removed
      setTotalQty((prevTotalQty) => prevTotalQty - selectedProduct.quantity);
    }
    toast.success(`${product.name} removed item from cart!`);
  };

  //for qty button counters
  /**
   * Increments quantity selector value
   *
   * @function incQty
   * @returns {void}
   */
  const incQty = () => {
    setQty((prevQty) => prevQty + 1);
  };

  /**
   * Decrements quantity selector value with minimum of 1
   *
   * @function decQty
   * @returns {void}
   */

  const decQty = () => {
    setQty((prevQty) => {
      if (prevQty - 1 < 1) return 1;
      return prevQty - 1;
    });
    //check to not go bellow 1
  };

  // wishlist funcyions
  // key is per user so wishlists dont bleed between accounts, guest fallback just in case
  const wishlistKey = user ? `wishlist_${user.id}` : "wishlist_guest";

  //load this user's wishlist from localStorage when the user changes
  useEffect(() => {
    const saved = localStorage.getItem(wishlistKey);
    if (saved) {
      try {
        setWishlistItems(JSON.parse(saved));
      } catch {
        //if the saved data is corrupted just ignore it
        localStorage.removeItem(wishlistKey);
      }
    } else {
      //clear wishlist when switching to a user who has none saved
      setWishlistItems([]);
    }
  }, [wishlistKey]);

  //save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(wishlistKey, JSON.stringify(wishlistItems));
  }, [wishlistItems, wishlistKey]);

  function addToWishlist(product: WishlistItem) {
    //check if already in wishlist so we dont add duplicates
    if (wishlistItems.find((item) => item._id === product._id)) {
      toast.error(`${product.name} is already in your wishlist`);
      return;
    }
    setWishlistItems([...wishlistItems, product]);
    toast.success(`${product.name} added to wishlist!`);
  }

  function removeFromWishlist(productId: string) {
    const product = wishlistItems.find((item) => item._id === productId);
    setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
    if (product) toast.success(`${product.name} removed from wishlist`);
  }

  //quick check used by the heart icon to know if its filled or not
  function isInWishlist(productId: string) {
    return wishlistItems.some((item) => item._id === productId);
  }

  //moves item from wishlist to cart and removes it from wishlist
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

  //export everything so it can be used

  /**
   * Context value containing all state and actions
   * @constant {cartContext} value
   */
  const value: cartContext = {
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

  return (
    <Context.Provider value={value}>{children}</Context.Provider>
    //wrap with context provider
  );
};

export const useStateContext = (): cartContext => {
  const context = useContext(Context);
  if (context === undefined) {
    throw new Error("context  has to be used");
  }
  return context;
};