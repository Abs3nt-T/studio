'use client';

import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { blockedProvinces, blockedZipCodes, blockedCities } from '@/lib/geography';

const normalizeString = (str: string) => 
    str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();


const shippingSchema = z.object({
    name: z.string().min(2, "Il nome e cognome sono obbligatori."),
    address: z.string().min(5, "L'indirizzo è obbligatorio."),
    city: z.string().min(2, "La città è obbligatoria.")
      .refine(val => {
          const normalizedVal = normalizeString(val);
          const normalizedBlockedCities = blockedCities.map(normalizeString);
          return !normalizedBlockedCities.includes(normalizedVal);
      }, {
          message: "Spiacenti, non spediamo in questo comune."
      }),
    province: z.string().length(2, "La provincia deve essere di 2 caratteri.").transform(val => val.toUpperCase())
      .refine(val => !blockedProvinces.includes(val), {
          message: "Spiacenti, non spediamo in questa provincia."
      }),
    zip: z.string().length(5, "Il CAP deve essere di 5 cifre.")
      .refine(val => !blockedZipCodes.some(prefix => val.startsWith(prefix)), {
          message: "Spiacenti, non spediamo a questo CAP."
      }),
    email: z.string().email("L'email non è valida."),
    phone: z.string().min(9, "Il numero di telefono non è valido."),
});

const formSchema = z.object({
    customer: shippingSchema,
    billingSameAsShipping: z.boolean().default(true),
    billing: shippingSchema.optional(),
}).refine(data => {
    if (!data.billingSameAsShipping) {
        return !!data.billing;
    }
    return true;
}, {
    message: "I dati di fatturazione sono obbligatori se diversi da quelli di spedizione.",
    path: ["billing"],
});


type FormData = z.infer<typeof formSchema>;

const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price);
};

export default function CheckoutPage() {
    const { cart, getCartTotal, clearCart, addToCart, decreaseQuantity } = useContext(CartContext);
    const router = useRouter();
    const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

    const { subtotal, shippingCost, total } = getCartTotal();

    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            customer: {
                name: '',
                address: '',
                city: '',
                province: '',
                zip: '',
                email: '',
                phone: '',
            },
            billingSameAsShipping: true,
            billing: undefined,
        },
        mode: "onBlur",
    });

    const watchBillingSameAsShipping = form.watch('billingSameAsShipping');

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
                    <form onSubmit={form.handleSubmit(() => {})} className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
                        {/* Shipping & Billing Details Column */}
                        <div className="flex flex-col gap-8">
                            <div>
                                <h2 className="font-headline text-2xl font-bold mb-6">Dati di Spedizione</h2>
                                <div className="grid grid-cols-1 gap-6">
                                    <FormField control={form.control} name="customer.name" render={({ field }) => (
                                        <FormItem><FormLabel>Nome e Cognome</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="customer.address" render={({ field }) => (
                                        <FormItem><FormLabel>Indirizzo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                                        <FormField control={form.control} name="customer.city" render={({ field }) => (
                                            <FormItem className="sm:col-span-3"><FormLabel>Città</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="customer.province" render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Provincia</FormLabel>
                                                <FormControl>
                                                    <Input 
                                                        {...field} 
                                                        maxLength={2} 
                                                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )} />
                                         <FormField control={form.control} name="customer.zip" render={({ field }) => (
                                            <FormItem><FormLabel>CAP</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                    </div>
                                    <FormField control={form.control} name="customer.email" render={({ field }) => (
                                        <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                    <FormField control={form.control} name="customer.phone" render={({ field }) => (
                                        <FormItem><FormLabel>Telefono</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem>
                                    )} />
                                </div>
                            </div>
                            
                            <div className="space-y-6">
                                <h2 className="font-headline text-2xl font-bold">Dati di Fatturazione</h2>
                                 <FormField
                                    control={form.control}
                                    name="billingSameAsShipping"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                            <FormControl>
                                                <Checkbox
                                                    checked={field.value}
                                                    onCheckedChange={field.onChange}
                                                />
                                            </FormControl>
                                            <div className="space-y-1 leading-none">
                                                <FormLabel>
                                                    L'indirizzo di fatturazione è uguale a quello di spedizione
                                                </FormLabel>
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                {!watchBillingSameAsShipping && (
                                     <div className="grid grid-cols-1 gap-6 border p-6 rounded-md">
                                        <FormField control={form.control} name="billing.name" render={({ field }) => (
                                            <FormItem><FormLabel>Nome e Cognome (Fatt.)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="billing.address" render={({ field }) => (
                                            <FormItem><FormLabel>Indirizzo (Fatt.)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                                            <FormField control={form.control} name="billing.city" render={({ field }) => (
                                               <FormItem className="sm:col-span-3"><FormLabel>Città (Fatt.)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                            <FormField control={form.control} name="billing.province" render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Prov. (Fatt.)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            {...field}
                                                            maxLength={2}
                                                            onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )} />
                                            <FormField control={form.control} name="billing.zip" render={({ field }) => (
                                                <FormItem><FormLabel>CAP (Fatt.)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                            )} />
                                        </div>
                                        <FormField control={form.control} name="billing.email" render={({ field }) => (
                                            <FormItem><FormLabel>Email (Fatt.)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>
                                        )} />
                                        <FormField control={form.control} name="billing.phone" render={({ field }) => (
                                            <FormItem><FormLabel>Telefono (Fatt.)</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormMessage>
                                        )} />
                                    </div>
                                )}
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
                                                    <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => decreaseQuantity(item.id)}><Minus className="h-4 w-4" /></Button>
                                                    <span className="font-bold w-4 text-center">{item.quantity}</span>
                                                     <Button type="button" variant="outline" size="icon" className="h-6 w-6" onClick={() => addToCart(item)}><Plus className="h-4 w-4" /></Button>
                                                </div>
                                                <span className="font-medium w-20 text-right">{formatPrice(item.offerPrice * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="border-t pt-4 space-y-2">
                                        <div className="flex justify-between items-center text-base">
                                            <span>Subtotale</span>
                                            <span>{formatPrice(subtotal)}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-base">
                                            <span>Spedizione</span>
                                            <span>{shippingCost > 0 ? formatPrice(shippingCost) : 'Gratuita'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-xl font-bold">
                                            <span>Totale</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                    </div>


                                    {cart.length > 0 && (
                                        <div className="flex justify-end">
                                            <Button type="button" variant="outline" size="sm" onClick={clearCart} className="text-red-500 hover:text-red-600">
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Svuota Carrello
                                            </Button>
                                        </div>
                                    )}
                                    
                                    <div className="pt-4">
                                         <PayPalButtons
                                            style={{ layout: "vertical" }}
                                            onClick={async (data, actions) => {
                                                const isFormValid = await form.trigger();
                                                if (!isFormValid) {
                                                    toast({
                                                        title: "Dati mancanti o non validi",
                                                        description: "Per favore, compila tutti i campi obbligatori e correggi gli errori prima di procedere.",
                                                        variant: "destructive",
                                                    });
                                                    return actions.reject();
                                                }
                                                return actions.resolve();
                                            }}
                                            createOrder={async (data, actions) => {
                                                const { total } = getCartTotal();
                                                return actions.order.create({
                                                    purchase_units: [{
                                                        amount: {
                                                            value: total.toFixed(2),
                                                            currency_code: 'EUR'
                                                        }
                                                    }]
                                                });
                                            }}
                                            onApprove={async (data, actions) => {
                                                if (!actions.order) return;
                                                const details = await actions.order.capture();
                                                const formData = form.getValues();
                                                const { total } = getCartTotal();
                                                
                                                const orderPayload = {
                                                    customer: formData.customer,
                                                    billing: formData.billingSameAsShipping ? undefined : formData.billing,
                                                    products: cart,
                                                    total: total,
                                                    transactionId: details.id
                                                };

                                                try {
                                                    const response = await fetch('/api/order', {
                                                        method: 'POST',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify(orderPayload)
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