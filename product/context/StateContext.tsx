"use client";

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

const Context = createContext<cartContext | undefined>(undefined);

export interface CartItem {
  _id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface cartContext {
    //states
  showCart: boolean;
  cartItems: CartItem[];
  totalPrice: number;
  totalQty: number;
  qty: number;

    //functions for the states
  setShowCart: (show: boolean) => void;
  setCartItems: (items: CartItem[]) => void;
  setTotalPrice: (price: number) => void;
  setTotalQty: (qty: number) => void;
  setQty: (qty: number) => void;

  //aditional functions
  incQty: () => void;
  decQty: () => void;
  onAdd: (product: CartItem, quantity: number) => void;
}

//context provoder component
interface StateContextProps {
  children: ReactNode;
}

export const StateContext = ({ children }: StateContextProps) => {
    //initialise all states
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQty, setTotalQty] = useState(0);
    const [qty, setQty] = useState(1);

    //add functions here

    const onAdd = (product: CartItem, quantity: number) => {
        const checkProductInCart = cartItems.find((item) => item._id === product._id);
        //checks if addes item is already in cart just increase qty

        setTotalPrice((prevTotalPrice) => prevTotalPrice + product.price * quantity);
        setTotalQty((prevTotalQty) => prevTotalQty + quantity);
        //can set these form the begining 

        if (checkProductInCart) {
            const updatedCartItems = cartItems.map((cartProduct) => {
                if (cartProduct._id === product._id) {
                    return {
                        ...cartProduct,
                        quantity: cartProduct.quantity + quantity
                    };
                    //increase quanity if product already in cart
                }
                //return product if its not
                return cartProduct;  });
            setCartItems(updatedCartItems);
        } else {
            setCartItems([...cartItems, { ...product, quantity: quantity }]);
        }

        setQty(1);
        
        toast.success(`${quantity} ${product.name} added to cart!`);
        setShowCart(true);
        //notif message
    };

    //for qty button counters

    const incQty = () => {
        setQty(prevQty => prevQty + 1);
    };

    const decQty = () => {
        setQty(prevQty => {
            if (prevQty - 1 < 1) return 1;
            return prevQty - 1;
        });
        //check to not go bellow 1
    };

    //export everything so it can be used

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
    };

    return (
        <Context.Provider value={value}>
            {children}
        </Context.Provider>
        //wrap with context provider
    );
};

export const useStateContext = (): cartContext => {
    const context = useContext(Context);
    if (context === undefined) {
        throw new Error('useStateContext must be used ');
    }
    return context;
};