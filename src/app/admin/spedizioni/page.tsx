'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Send, LogIn } from 'lucide-react';

const shipmentFormSchema = z.object({
  email: z.string().email("Inserisci un'email valida."),
  name: z.string().min(2, "Il nome è obbligatorio."),
  trackingCode: z.string().min(1, "Il codice di tracking è obbligatorio."),
  courier: z.string().min(2, "Il corriere è obbligatorio (es. SDA, GLS)."),
  courierLink: z.string().url("Inserisci un link valido (es. https://...).").optional().or(z.literal('')),
});

type ShipmentFormData = z.infer<typeof shipmentFormSchema>;

export default function SpedizioniAdminPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [verifiedPassword, setVerifiedPassword] = useState('');

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: {
      email: '',
      name: '',
      trackingCode: '',
      courier: '',
      courierLink: '',
    },
    mode: 'onBlur',
  });

  const handlePasswordCheck = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');
      try {
        // We do a "fake" check here just to see if the password is correct.
        // The real check is on the server when submitting the form.
        const response = await fetch('/api/shipment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ password, checkAuthOnly: true }),
        });

        if (response.status === 401) {
            throw new Error("Password non autorizzata.");
        }
         if (!response.ok && response.status !== 400) { // 400 is for validation error which is fine here
            throw new Error("Errore durante la verifica.");
        }
        
        setVerifiedPassword(password);
        setIsAuthenticated(true);

      } catch (error: any) {
        setAuthError(error.message || "Password errata o errore di verifica.");
      }
  }

  const onSubmit = async (data: ShipmentFormData) => {
    if (!isAuthenticated) {
        toast({ variant: 'destructive', title: 'Errore', description: 'Autenticazione richiesta.' });
        return;
    }
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/shipment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, password: verifiedPassword }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Qualcosa è andato storto.');
      }
      
      toast({
        title: 'Successo!',
        description: `Email di spedizione inviata a ${data.name}.`,
      });
      form.reset();

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Errore',
        description: error.message || "Impossibile inviare l'email. Controlla i dati e riprova.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl px-4 py-16 md:px-6 lg:py-24">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Invia Notifica di Spedizione</CardTitle>
          <CardDescription>
            Usa questo pannello per inviare manualmente l'email di avvenuta spedizione al cliente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!isAuthenticated ? (
            <form onSubmit={handlePasswordCheck} className="space-y-4">
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
                <Button type="submit" className="w-full">
                    <LogIn className="mr-2 h-4 w-4" />
                    Accedi
                </Button>
            </form>
          ) : (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Cliente</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="cliente@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome Cliente</FormLabel>
                    <FormControl>
                      <Input placeholder="Mario Rossi" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="trackingCode" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Codice di Tracciamento</FormLabel>
                    <FormControl>
                      <Input placeholder="ABC123456789" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                
                 <FormField control={form.control} name="courier" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Corriere</FormLabel>
                    <FormControl>
                      <Input placeholder="SDA / Bartolini / GLS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField control={form.control} name="courierLink" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Link di Tracciamento (Opzionale)</FormLabel>
                    <FormControl>
                      <Input type="url" placeholder="https://www.corriere.it/tracking/..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <Button type="submit" disabled={isSubmitting} className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Invio in corso...' : 'Invia Notifica'}
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
