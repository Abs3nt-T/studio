'use client';

import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CartContext, CartItem } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Trash2 } from 'lucide-react';

const formSchema = z.object({
    name: z.string().min(2, "Il nome è obbligatorio"),
    address: z.string().min(5, "L'indirizzo è obbligatorio"),
    city: z.string().min(2, "La città è obbligatoria"),
    zip: z.string().min(5, "Il CAP è obbligatorio").max(5, "Il CAP deve essere di 5 cifre"),
    email: z.string().email("Inserisci un'email valida"),
    phone: z.string().min(9, "Il numero di telefono non è valido"),
});

type FormData = z.infer<typeof formSchema>;

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
};

export default function CheckoutPage() {
    const { cart, getCartTotal, clearCart, addToCart, decreaseQuantity } = useContext(CartContext);
    const router = useRouter();
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            address: '',
            city: '',
            zip: '',
            email: '',
            phone: '',
        },
    });

    const onSubmit = (data: FormData) => {
        // This is handled by onApprove in PayPalButtons
        console.log("Form data submitted:", data);
    };

    if (!paypalClientId) {
        return <div className="container mx-auto py-24 text-center text-red-500">La configurazione di PayPal non è completa.</div>
    }

    if (cart.length === 0) {
        return (
            <div className="container mx-auto py-24 text-center">
                <h1 className="text-2xl font-bold">Il tuo carrello è vuoto</h1>
                <p className="mt-4 text-muted-foreground">Torna allo shop per aggiungere prodotti.</p>
                <Button onClick={() => router.push('/shop')} className="mt-6">Vai allo Shop</Button>
            </div>
        )
    }

    return (
        <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "EUR" }}>
            <div className="container mx-auto px-4 py-16 md:px-6 lg:py-24">
                <header className="text-center mb-12">
                    <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                        Checkout
                    </h1>
                </header>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                        {/* Shipping Details Column */}
                        <div className="flex flex-col gap-8">
                            <h2 className="font-headline text-2xl font-bold">Dati di Spedizione</h2>
                            <div className="grid grid-cols-1 gap-6">
                                <FormField control={form.control} name="name" render={({ field }) => (
                                    <FormItem><FormLabel>Nome e Cognome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="address" render={({ field }) => (
                                    <FormItem><FormLabel>Indirizzo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField control={form.control} name="city" render={({ field }) => (
                                        <FormItem><FormLabel>Città</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="zip" render={({ field }) => (
                                        <FormItem><FormLabel>CAP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                                <FormField control={form.control} name="email" render={({ field }) => (
                                    <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField control={form.control} name="phone" render={({ field }) => (
                                    <FormItem><FormLabel>Telefono</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                            </div>
                        </div>

                        {/* Order Summary Column */}
                        <div>
                            <Card className="shadow-lg">
                                <CardHeader>
                                    <CardTitle className="font-headline text-2xl">Riepilogo Ordine</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="space-y-4">
                                        {cart.map(item => (
                                            <div key={item.id} className="flex justify-between items-center text-sm">
                                                <div className="flex-grow">
                                                    <p className="font-medium">{item.name}</p>
                                                    <p className="text-muted-foreground">{formatPrice(item.offerPrice)} cad.</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => decreaseQuantity(item.id)}><Minus className="h-4 w-4" /></Button>
                                                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                                                     <Button variant="outline" size="icon" className="h-6 w-6" onClick={() => addToCart(item)}><Plus className="h-4 w-4" /></Button>
                                                </div>
                                                <span className="font-medium w-20 text-right">{formatPrice(item.offerPrice * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="border-t pt-4 flex justify-between items-center text-xl font-bold">
                                        <span>Totale</span>
                                        <span>{formatPrice(getCartTotal())}</span>
                                    </div>

                                    {cart.length > 0 && (
                                        <div className="flex justify-end">
                                            <Button variant="outline" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Svuota Carrello
                                            </Button>
                                        </div>
                                    )}
                                    
                                    <div className="pt-4">
                                         <PayPalButtons
                                            style={{ layout: "vertical" }}
                                            createOrder={async (data, actions) => {
                                                const isFormValid = await form.trigger();
                                                if (!isFormValid) {
                                                    toast({
                                                        title: "Errore nel form",
                                                        description: "Per favore, compila tutti i campi richiesti prima di procedere.",
                                                        variant: "destructive",
                                                    });
                                                    return "";
                                                }
                                                return actions.order.create({
                                                    purchase_units: [{
                                                        amount: {
                                                            value: getCartTotal().toFixed(2),
                                                            currency_code: 'EUR'
                                                        }
                                                    }]
                                                });
                                            }}
                                            onApprove={async (data, actions) => {
                                                if (!actions.order) return;
                                                const details = await actions.order.capture();
                                                const customerData = form.getValues();
                                                
                                                try {
                                                    const response = await fetch('/api/order', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({
                                                            customer: customerData,
                                                            products: cart,
                                                            total: getCartTotal()
                                                        })
                                                    });

                                                    if (!response.ok) throw new Error('Errore invio email');

                                                    toast({
                                                        title: "Ordine completato!",
                                                        description: "Grazie per il tuo acquisto. Riceverai una mail di conferma a breve.",
                                                    });

                                                    clearCart();
                                                    router.push('/shop');

                                                } catch (error) {
                                                     toast({
                                                        title: "Errore",
                                                        description: "C'è stato un problema durante l'invio della conferma d'ordine. Contattaci per assistenza.",
                                                        variant: "destructive",
                                                    });
                                                }
                                            }}
                                            onError={(err) => {
                                                console.error("PayPal Error:", err);
                                                toast({
                                                    title: "Errore di pagamento",
                                                    description: "C'è stato un problema con il pagamento. Riprova o contatta l'assistenza.",
                                                    variant: "destructive",
                                                });
                                            }}
                                        />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </form>
                </Form>
            </div>
        </PayPalScriptProvider>
    );
}
