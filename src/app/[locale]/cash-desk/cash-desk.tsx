'use client';

import { useState } from 'react';
import {
  Grid2X2,
  Minus,
  Plus,
  Receipt,
  Search,
  ShoppingCart,
  Trash2,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  category: string;
}

export default function CashDesk() {
  const [cart, setCart] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('fruits');
  const [mobileView, setMobileView] = useState<'products' | 'cart' | 'payment'>(
    'products'
  );
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const categories = [
    {
      id: 'fruits',
      name: 'Fruits',
      items: [
        { id: 1, name: 'Apple', price: 0.5 },
        { id: 2, name: 'Banana', price: 0.3 },
        { id: 3, name: 'Orange', price: 0.6 },
      ],
    },
    {
      id: 'vegetables',
      name: 'Vegetables',
      items: [
        { id: 4, name: 'Carrot', price: 0.4 },
        { id: 5, name: 'Potato', price: 0.8 },
        { id: 6, name: 'Tomato', price: 0.7 },
      ],
    },
    {
      id: 'dairy',
      name: 'Dairy',
      items: [
        { id: 7, name: 'Milk', price: 2.5 },
        { id: 8, name: 'Cheese', price: 3.0 },
        { id: 9, name: 'Yogurt', price: 1.5 },
      ],
    },
  ];

  const addToCart = (item: { id: number; name: string; price: number }) => {
    setCart((currentCart) => {
      const existingItem = currentCart.find(
        (cartItem) => cartItem.id === item.id
      );
      if (existingItem) {
        return currentCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [
        ...currentCart,
        { ...item, quantity: 1, category: activeCategory },
      ];
    });
  };

  const removeFromCart = (itemId: number) => {
    setCart((currentCart) => currentCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const ProductsSection = () => (
    <div className="h-full flex flex-col">
      <div className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            className="pl-9 h-12 text-base bg-gray-50/50 border-gray-200 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>
      <Tabs defaultValue={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full justify-start rounded-none px-6 h-12 bg-transparent border-b overflow-auto">
          {categories.map((category) => (
            <TabsTrigger
              key={category.id}
              value={category.id}
              className="data-[state=active]:bg-primary/10 data-[state=active]:text-primary rounded-full px-4 min-w-fit"
            >
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {categories.map((category) => (
          <TabsContent
            key={category.id}
            value={category.id}
            className="flex-1 m-0"
          >
            <ScrollArea className="h-full">
              <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-4 p-6">
                {category.items.map((item) => (
                  <Button
                    key={item.id}
                    variant="outline"
                    className="h-24 flex flex-col items-center justify-center border-2 hover:border-primary hover:bg-primary/5 transition-all duration-200 group"
                    onClick={() => addToCart(item)}
                  >
                    <span className="font-medium group-hover:text-primary transition-colors">
                      {item.name}
                    </span>
                    <span className="text-sm text-muted-foreground mt-1">
                      ${item.price.toFixed(2)}
                    </span>
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  const CartSection = () => (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 px-6 py-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mb-4 text-gray-300" />
            <p>Your cart is empty</p>
          </div>
        ) : (
          cart.map((item) => (
            <Card
              key={item.id}
              className="mb-4 border-2 hover:border-gray-300 transition-all duration-200"
            >
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-medium">
                  {item.name}
                </CardTitle>
                <Badge
                  variant="secondary"
                  className="bg-primary/10 text-primary hover:bg-primary/20"
                >
                  {item.category}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </ScrollArea>
    </div>
  );

  const PaymentSection = () => (
    <Card className="h-full rounded-none border-0">
      <CardHeader className="px-6 pb-4">
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>Review your order details</CardDescription>
      </CardHeader>
      <CardContent className="px-6">
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span>${(total * 0.1).toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium text-lg">
            <span>Total</span>
            <span className="text-primary">${(total * 1.1).toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
      <div className="mt-auto">
        <CardFooter className="px-6 py-4 border-t">
          <Button
            className="w-full h-12 text-base font-medium"
            disabled={cart.length === 0}
          >
            Proceed to Payment
          </Button>
        </CardFooter>
      </div>
    </Card>
  );

  // Mobile Navigation
  const MobileNav = () => (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
      <div className="flex justify-around p-2">
        <Button
          variant="ghost"
          className={`flex-1 flex flex-col items-center gap-1 h-16 ${mobileView === 'products' ? 'text-primary' : ''}`}
          onClick={() => setMobileView('products')}
        >
          <Grid2X2 className="h-5 w-5" />
          <span className="text-xs">Products</span>
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 flex flex-col items-center gap-1 h-16 ${mobileView === 'cart' ? 'text-primary' : ''}`}
          onClick={() => setMobileView('cart')}
        >
          <ShoppingCart className="h-5 w-5" />
          <span className="text-xs">Cart</span>
          {cart.length > 0 && (
            <Badge className="absolute top-2 right-1/4 bg-primary text-white">
              {cart.length}
            </Badge>
          )}
        </Button>
        <Button
          variant="ghost"
          className={`flex-1 flex flex-col items-center gap-1 h-16 ${mobileView === 'payment' ? 'text-primary' : ''}`}
          onClick={() => setMobileView('payment')}
        >
          <Receipt className="h-5 w-5" />
          <span className="text-xs">Payment</span>
        </Button>
      </div>
    </div>
  );

  // Desktop Layout
  const DesktopLayout = () => (
    <div className="hidden md:flex h-screen bg-gray-50/50">
      <div className="w-1/4 bg-white border-r border-gray-200 shadow-sm">
        <ProductsSection />
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-6 bg-white border-b border-gray-200 shadow-sm">
          <h1 className="text-2xl font-bold flex items-center gap-3 text-gray-800">
            <ShoppingCart className="h-7 w-7 text-primary" />
            Cash Desk
          </h1>
        </div>
        <CartSection />
      </div>
      <div className="w-1/4 bg-white border-l border-gray-200 shadow-sm">
        <PaymentSection />
      </div>
    </div>
  );

  // Mobile Layout
  const MobileLayout = () => (
    <div className="md:hidden h-screen bg-white">
      <div className="h-16 flex items-center justify-between px-4 border-b">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ShoppingCart className="h-6 w-6 text-primary" />
          Cash Desk
        </h1>
      </div>
      <div className="h-[calc(100vh-8rem)]">
        {mobileView === 'products' && <ProductsSection />}
        {mobileView === 'cart' && <CartSection />}
        {mobileView === 'payment' && <PaymentSection />}
      </div>
      <MobileNav />
    </div>
  );

  return (
    <>
      <MobileLayout />
      <DesktopLayout />
    </>
  );
}
