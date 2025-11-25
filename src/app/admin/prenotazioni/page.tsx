
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormLabel } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LogIn, RefreshCw, CheckCircle, Phone, Calendar, Clock, ShoppingBasket } from 'lucide-react';
import { client } from '@/sanity/client';
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

interface Reservation {
  _id: string;
  customerName: string;
  customerPhone: string;
  productList: string;
  pickupDate: string;
  pickupTime: string;
  createdAt: string;
}

export default function PrenotazioniAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pendingReservations, setPendingReservations] = useState<Reservation[]>([]);
  
  const form = useForm();

  const fetchPendingReservations = useCallback(async () => {
    setIsLoading(true);
    setAuthError('');
    try {
      const reservations = await client.fetch('*[_type == "reservation" && status == "pending"] | order(pickupDate asc, pickupTime asc)');
      setPendingReservations(reservations);
      setIsAuthenticated(true);
    } catch (error) {
      setAuthError("Impossibile caricare le prenotazioni.");
      toast({ variant: 'destructive', title: 'Errore', description: 'Caricamento prenotazioni fallito.' });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      fetchPendingReservations();
    } else {
      setAuthError("Password errata.");
    }
  };
  
  // Replace direct env access with NEXT_PUBLIC_ for client-side password check
  useEffect(() => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        fetchPendingReservations();
    }
  }, [password, fetchPendingReservations]);


  const markAsCompleted = async (reservationId: string) => {
    setIsSubmitting(reservationId);
    try {
      await client
        .patch(reservationId)
        .set({ status: 'completed' })
        .commit();
      
      toast({
        title: 'Successo!',
        description: 'Prenotazione segnata come completata.',
      });

      setPendingReservations(prev => prev.filter(r => r._id !== reservationId));

    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: "Impossibile aggiornare la prenotazione.",
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
              <CardTitle className="font-headline text-3xl">Pannello Prenotazioni</CardTitle>
              <CardDescription>
                Gestisci le prenotazioni per il ritiro in negozio.
              </CardDescription>
            </div>
             {isAuthenticated && (
              <Button onClick={fetchPendingReservations} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
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
                  <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogIn className="mr-2 h-4 w-4" />}
                      Accedi
                  </Button>
              </form>
            ) : (
              isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : pendingReservations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pendingReservations.map((res) => (
                        <Card key={res._id} className="flex flex-col">
                            <CardHeader>
                                <CardTitle>{res.customerName}</CardTitle>
                                <CardDescription className="flex items-center gap-2 pt-1">
                                    <Phone className="h-4 w-4" />
                                    <a href={`tel:${res.customerPhone}`} className="hover:underline">{res.customerPhone}</a>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex-grow space-y-4">
                               <div className="flex items-center gap-3 text-sm">
                                   <Calendar className="h-5 w-5 text-primary"/>
                                   <span>{format(new Date(res.pickupDate), 'EEEE dd/MM/yy', { locale: it })}</span>
                               </div>
                                <div className="flex items-center gap-3 text-sm">
                                   <Clock className="h-5 w-5 text-primary"/>
                                   <span>Ore: <strong>{res.pickupTime}</strong></span>
                               </div>
                               <div className="space-y-2">
                                    <h4 className="flex items-center gap-2 font-medium text-sm">
                                        <ShoppingBasket className="h-5 w-5 text-primary"/>
                                        Lista Spesa
                                    </h4>
                                    <p className="text-sm text-muted-foreground whitespace-pre-wrap p-3 bg-muted/50 rounded-md max-h-40 overflow-y-auto">{res.productList}</p>
                               </div>
                            </CardContent>
                            <CardFooter>
                                 <Button
                                    className="w-full"
                                    onClick={() => markAsCompleted(res._id)}
                                    disabled={isSubmitting === res._id}
                                >
                                    {isSubmitting === res._id ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                    )}
                                    Segna come Ritirato
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
              ) : (
                 <div className="text-center py-12">
                  <CardTitle className="font-headline text-2xl">Nessuna prenotazione in attesa</CardTitle>
                  <CardDescription className="mt-2">Tutto in ordine! Non ci sono nuove prenotazioni.</CardDescription>
                </div>
              )
            )}
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
