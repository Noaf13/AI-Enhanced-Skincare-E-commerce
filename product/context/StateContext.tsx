"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
// import { toast } from 'react-hot-toast';

interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface StateContextType {
  showCart: boolean;
  setShowCart: (show: boolean) => void;
  cartItems: CartItem[];
  setCartItems: (items: CartItem[]) => void;
  totalPrice: number;
  setTotalPrice: (price: number) => void;
  totalQty: number;
  setTotalQty: (qty: number) => void;
  qty: number;
  setQty: (qty: number) => void;
  incQty: () => void;
  decQty: () => void;
  onAdd: (product: CartItem, quantity: number) => void;
}

const Context = createContext<StateContextType | undefined>(undefined);

interface StateContextProps {
  children: ReactNode;
}

export const StateContext = ({ children }: StateContextProps) => {
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const [qty, setQty] = useState(1);

    const onAdd = (product: CartItem, quantity: number) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQty((prevTotalQty) => prevTotalQty + quantity);

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity
                    };
                }
                return cartProduct;
            });
            setCartItems(updatedCartItems);
        } else {
            setCartItems([...cartItems, { ...product, quantity: quantity }]);
        }

        // Reset quantity after adding to cart
        setQty(1);
        
        // toast.success(`${quantity} ${product.name} added to the cart.`);
    };

    const incQty = () => {
        setQty(prevQty => prevQty + 1);
    };

    const decQty = () => {
        setQty(prevQty => {
            if (prevQty - 1 < 1) return 1;
            return prevQty - 1;
        });
    };

    const value: StateContextType = {
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
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
    );
};

export const useStateContext = (): StateContextType => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error('useStateContext must be used within a StateContext provider');
    }
    return context;
};