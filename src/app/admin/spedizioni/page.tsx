'use client';

import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, LogIn, Loader2, RefreshCw } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface Order {
  _id: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  total: number;
  createdAt: string;
}

const shipmentFormSchema = z.object({
  orders: z.array(z.object({
    orderDocumentId: z.string(),
    email: z.string().email(),
    name: z.string(),
    trackingCode: z.string().min(1, "Il codice di tracking è obbligatorio."),
    courier: z.string().min(2, "Il corriere è obbligatorio."),
    courierLink: z.string().url("Inserisci un link valido.").optional().or(z.literal('')),
  }))
});

type ShipmentFormData = z.infer<typeof shipmentFormSchema>;

export default function SpedizioniAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');
  const [pendingOrders, setPendingOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const form = useForm<ShipmentFormData>({
    defaultValues: {
      orders: [],
    },
    mode: 'onBlur',
  });

  const { fields, replace } = useFieldArray({
    control: form.control,
    name: "orders",
  });

  useEffect(() => {
    if (pendingOrders.length > 0) {
      const orderFields = pendingOrders.map(order => ({
        orderDocumentId: order._id,
        email: order.customerEmail,
        name: order.customerName,
        trackingCode: '',
        courier: '',
        courierLink: '',
      }));
      replace(orderFields);
    }
  }, [pendingOrders, replace]);

  const fetchPendingOrders = async (currentPassword: string) => {
    setIsLoadingOrders(true);
    setAuthError('');
    try {
      const response = await fetch('/api/shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: currentPassword, checkAuthOnly: true }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Password errata o errore di verifica.");
      }
      
      setPendingOrders(result.orders || []);
      setVerifiedPassword(currentPassword);
      setIsAuthenticated(true);

    } catch (error: any) {
      setAuthError(error.message);
      setIsAuthenticated(false);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPendingOrders(password);
  };

  const onSubmit = async (data: ShipmentFormData, orderIndex: number) => {
    if (!isAuthenticated) {
      toast({ variant: 'destructive', title: 'Errore', description: 'Autenticazione richiesta.' });
      return;
    }
    
    const orderToSend = data.orders[orderIndex];
    
    // Manual validation for the specific row
    if (!orderToSend.trackingCode || !orderToSend.courier) {
      toast({ variant: 'destructive', title: 'Dati mancanti', description: "Compila Tracking e Corriere per l'ordine selezionato."});
      form.trigger(`orders.${orderIndex}.trackingCode`);
      form.trigger(`orders.${orderIndex}.courier`);
      return;
    }

    setIsSubmitting(orderToSend.orderDocumentId);
    try {
      const response = await fetch('/api/shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...orderToSend, password: verifiedPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Qualcosa è andato storto.');
      }
      
      toast({
        title: 'Successo!',
        description: `Notifica di spedizione inviata per l'ordine di ${orderToSend.name}.`,
      });

      // Remove the shipped order from the list
      setPendingOrders(prev => prev.filter(o => o._id !== orderToSend.orderDocumentId));

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error.message || "Impossibile inviare la notifica. Controlla i dati e riprova.",
      });
    } finally {
      setIsSubmitting(null);
    }
  };

  return (
    <div className="container mx-auto max-w-7xl px-4 py-16 md:px-6 lg:py-24">
      <Card className="shadow-lg">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="font-headline text-3xl">Pannello Spedizioni</CardTitle>
              <CardDescription>
                Gestisci gli ordini in attesa e invia le notifiche di spedizione.
              </CardDescription>
            </div>
             {isAuthenticated && (
              <Button onClick={() => fetchPendingOrders(verifiedPassword)} disabled={isLoadingOrders}>
                {isLoadingOrders ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                Aggiorna Lista
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            {!isAuthenticated ? (
              <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-md mx-auto">
                  <div className="space-y-2">
                      <FormLabel htmlFor="password">Password Amministratore</FormLabel>
                      <Input
                          id="password"
                          type="password"
                          placeholder="Inserisci la password segreta"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                      />
                       {authError && <p className="text-sm font-medium text-destructive">{authError}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoadingOrders}>
                      {isLoadingOrders ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                      Accedi
                  </Button>
              </form>
            ) : (
              isLoadingOrders ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : pendingOrders.length > 0 ? (
                <form>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Ordine</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Tracking</TableHead>
                        <TableHead>Corriere</TableHead>
                        <TableHead>Link Corriere (Opz.)</TableHead>
                        <TableHead className="text-right">Azione</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fields.map((field, index) => (
                        <TableRow key={field.id}>
                          <TableCell>
                            <p className="font-mono text-xs">{pendingOrders[index]?.orderId.substring(0, 8)}</p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(pendingOrders[index]?.createdAt), 'dd/MM/yy HH:mm', { locale: it })}
                            </p>
                          </TableCell>
                          <TableCell>
                            <p className="font-medium">{field.name}</p>
                            <p className="text-xs text-muted-foreground">{field.email}</p>
                          </TableCell>
                          <TableCell>
                            <FormField control={form.control} name={`orders.${index}.trackingCode`} render={({ field }) => (
                              <FormItem><FormControl><Input placeholder="ABC12345" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </TableCell>
                          <TableCell>
                             <FormField control={form.control} name={`orders.${index}.courier`} render={({ field }) => (
                               <FormItem><FormControl><Input placeholder="SDA" {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </TableCell>
                           <TableCell>
                             <FormField control={form.control} name={`orders.${index}.courierLink`} render={({ field }) => (
                               <FormItem><FormControl><Input type="url" placeholder="https://..." {...field} /></FormControl><FormMessage /></FormItem>
                            )} />
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              type="button"
                              onClick={() => onSubmit(form.getValues(), index)}
                              disabled={isSubmitting === field.orderDocumentId}
                            >
                              {isSubmitting === field.orderDocumentId ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Send className="mr-2 h-4 w-4" />
                              )}
                              Invia
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </form>
              ) : (
                 <div className="text-center py-12">
                  <CardTitle className="font-headline text-2xl">Nessun ordine in attesa</CardTitle>
                  <CardDescription className="mt-2">Ottimo lavoro! Tutti gli ordini sono stati spediti.</CardDescription>
                </div>
              )
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
