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
import { Send } from 'lucide-react';

const shipmentFormSchema = z.object({
  password: z.string().min(1, "La password è obbligatoria."),
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

  const form = useForm<ShipmentFormData>({
    resolver: zodResolver(shipmentFormSchema),
    defaultValues: {
      password: '',
      email: '',
      name: '',
      trackingCode: '',
      courier: '',
      courierLink: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: ShipmentFormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/shipment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Qualcosa è andato storto.');
      }
      
      toast({
        title: 'Successo!',
        description: `Email di spedizione inviata a ${data.name}.`,
      });
      form.reset({ ...form.getValues(), email: '', name: '', trackingCode: '', courier: '', courierLink: '' });

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
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <FormField control={form.control} name="password" render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Amministratore</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="Inserisci la password segreta" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <hr />

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
        </CardContent>
      </Card>
    </div>
  );
}