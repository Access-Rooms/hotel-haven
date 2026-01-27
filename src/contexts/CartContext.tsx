import { createContext, useContext, useState, useMemo, ReactNode, useCallback } from 'react';
import { CartItem } from '@/types/booking';
import { mockCartItems } from '@/data/mockBookings';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  totalAmount: number;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export function CartProvider({ children }: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(mockCartItems);
  const [isOpen, setIsOpen] = useState(false);

  const itemCount = useMemo(() => items.length, [items]);
  
  const totalAmount = useMemo(() => 
    items.reduce((sum, item) => sum + item.totalPrice, 0), 
    [items]
  );

  const addItem = useCallback((item: CartItem) => {
    setItems(prev => [...prev, { ...item, id: `cart-${Date.now()}`, addedAt: new Date() }]);
  }, []);

  const removeItem = useCallback((itemId: string) => {
    setItems(prev => prev.filter(item => item.id !== itemId));
  }, []);

  const updateItem = useCallback((itemId: string, updates: Partial<CartItem>) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const value: CartContextType = useMemo(() => ({
    items,
    itemCount,
    totalAmount,
    isOpen,
    setIsOpen,
    addItem,
    removeItem,
    updateItem,
    clearCart,
  }), [items, itemCount, totalAmount, isOpen, addItem, removeItem, updateItem, clearCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
