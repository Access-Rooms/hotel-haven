import { useNavigate } from 'react-router-dom';
import { ShoppingCart, X, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/contexts/CartContext';
import { CartItemCard, CartEmpty } from './CartItemCard';
import { cn } from '@/lib/utils';

export function FloatingCart() {
  const { items, itemCount, totalAmount, isOpen, setIsOpen, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  const handleBrowse = () => {
    setIsOpen(false);
    navigate('/rooms');
  };

  const handleCheckout = () => {
    setIsOpen(false);
    // Navigate to checkout or first item's reservation page
    if (items.length > 0) {
      navigate(`/reservation/${items[0].roomId}?hotelId=${items[0].hotelId}`);
    }
  };

  const availableItems = items.filter(item => item.isAvailable);
  const unavailableItems = items.filter(item => !item.isAvailable);
  const availableTotal = availableItems.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-24 z-50 w-14 h-14 rounded-full flex items-center justify-center',
          'bg-primary text-primary-foreground shadow-elevated',
          'transition-transform duration-200 hover:scale-110 active:scale-95'
        )}
        aria-label="Open cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {itemCount > 0 && (
          <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
            {itemCount}
          </span>
        )}
      </button>

      {/* Cart Sheet */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md flex flex-col">
          <SheetHeader className="flex-shrink-0">
            <SheetTitle className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5" />
              Your Cart
              {itemCount > 0 && (
                <span className="text-sm font-normal text-muted-foreground">
                  ({itemCount} {itemCount === 1 ? 'item' : 'items'})
                </span>
              )}
            </SheetTitle>
          </SheetHeader>

          {items.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <CartEmpty onBrowse={handleBrowse} />
            </div>
          ) : (
            <>
              <ScrollArea className="flex-1 -mx-6 px-6">
                <div className="space-y-3 py-4">
                  {items.map((item) => (
                    <CartItemCard
                      key={item.id}
                      item={item}
                      onRemove={removeItem}
                    />
                  ))}
                </div>
              </ScrollArea>

              <div className="flex-shrink-0 pt-4 border-t border-border space-y-4">
                {/* Warnings */}
                {unavailableItems.length > 0 && (
                  <p className="text-sm text-destructive">
                    {unavailableItems.length} item(s) unavailable and will be removed at checkout
                  </p>
                )}

                {/* Price Summary */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal ({availableItems.length} items)</span>
                    <span className="font-medium">₹{availableTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Taxes & Fees</span>
                    <span className="text-muted-foreground">Calculated at checkout</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="font-semibold">Estimated Total</span>
                    <span className="font-semibold text-lg">₹{availableTotal.toLocaleString()}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg" 
                    onClick={handleCheckout}
                    disabled={availableItems.length === 0}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full text-muted-foreground"
                    onClick={clearCart}
                  >
                    Clear Cart
                  </Button>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
