
'use client';

import React, { useState, createContext, useContext, ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { MessageSquare, Send, User, Phone, ShoppingBasket, Calendar, Clock, Loader2 } from 'lucide-react';
import { Textarea } from './ui/textarea';
import { toast } from '@/hooks/use-toast';

// Orari di apertura
const openingHours = {
    1: [['08:00', '12:30'], ['17:00', '20:00']], // Lun
    2: [['08:00', '13:00'], ['17:00', '20:00']], // Mar
    3: [['08:00', '13:00'], ['17:00', '20:00']], // Mer
    4: [['08:00', '13:00']], // Gio
    5: [['07:30', '13:00'], ['16:30', '20:00']], // Ven
    6: [['07:30', '13:00'], ['16:30', '19:30']], // Sab
    0: [], // Dom (Chiuso)
};

type DayOfWeek = keyof typeof openingHours;

const isValidPickupTime = (dateStr: string, timeStr: string): boolean => {
    if (!dateStr || !timeStr) return false;

    const pickupDate = new Date(dateStr);
    const dayOfWeek = pickupDate.getUTCDay() as DayOfWeek;
    const hours = openingHours[dayOfWeek];

    if (!hours || hours.length === 0) return false; // Giorno di chiusura

    return hours.some(([start, end]) => timeStr >= start && timeStr <= end);
};


const bookingSchema = z.object({
    customerName: z.string().min(2, "Il nome è obbligatorio."),
    customerPhone: z.string().min(9, "Il numero di telefono non è valido."),
    productList: z.string().min(3, "La lista della spesa non può essere vuota."),
    pickupDate: z.string().nonempty("La data di ritiro è obbligatoria."),
    pickupTime: z.string().nonempty("L'ora di ritiro è obbligatoria."),
}).refine(data => isValidPickupTime(data.pickupDate, data.pickupTime), {
    message: "L'orario scelto non è valido. Controlla i nostri orari di apertura.",
    path: ["pickupTime"],
});

type BookingFormData = z.infer<typeof bookingSchema>;

const steps = [
    { id: 'customerName', label: 'Come ti chiami?', icon: User },
    { id: 'customerPhone', label: 'Qual è il tuo numero di telefono?', icon: Phone },
    { id: 'productList', label: 'Scrivimi l\'elenco della spesa (es. 1kg bombette, 5 hamburger).', icon: ShoppingBasket },
    { id: 'pickupDate', label: 'Che giorno vuoi passare a ritirare?', icon: Calendar },
    { id: 'pickupTime', label: 'E a che ora?', icon: Clock },
] as const;


interface BookingChatContextType {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const BookingChatContext = createContext<BookingChatContextType | undefined>(undefined);

export const useBookingChat = () => {
    const context = useContext(BookingChatContext);
    if (!context) {
        throw new Error('useBookingChat must be used within a BookingChat component');
    }
    return context;
};


export function BookingChat({ children }: { children?: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<BookingFormData>({
        resolver: zodResolver(bookingSchema),
        defaultValues: {
            customerName: '',
            customerPhone: '',
            productList: '',
            pickupDate: new Date().toISOString().split('T')[0],
            pickupTime: '',
        },
        mode: 'onBlur',
    });

    const handleNext = async () => {
        const currentField = steps[currentStep].id;
        const isValid = await form.trigger(currentField);
        if (isValid) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const onSubmit = async (data: BookingFormData) => {
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/reservation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Qualcosa è andato storto.');
            }
            
            toast({
                title: 'Prenotazione Inviata!',
                description: `Grazie ${data.customerName}, abbiamo ricevuto la tua prenotazione. A presto!`,
            });
            setIsOpen(false);
            form.reset();
            setCurrentStep(0);

        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Errore',
                description: error.message || "Impossibile inviare la prenotazione. Riprova.",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderField = (stepIndex: number) => {
        const fieldName = steps[stepIndex].id;
        const field = steps[stepIndex];
        const Icon = field.icon;
        
        return (
            <div key={fieldName} className="flex gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground mt-2">
                    <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 space-y-2 rounded-lg bg-muted p-4">
                     <FormField
                        control={form.control}
                        name={fieldName}
                        render={({ field: formField }) => (
                            <FormItem>
                                <FormLabel>{field.label}</FormLabel>
                                <FormControl>
                                    {fieldName === 'productList' ? (
                                        <Textarea placeholder="La tua lista..." {...formField} />
                                    ) : fieldName === 'pickupDate' ? (
                                        <Input type="date" {...formField} min={new Date().toISOString().split('T')[0]} />
                                    ) : fieldName === 'pickupTime' ? (
                                        <Input type="time" {...formField} />
                                    ) : (
                                        <Input {...formField} type={fieldName === 'customerPhone' ? 'tel' : 'text'} />
                                    )}
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </div>
        )
    };

    return (
        <BookingChatContext.Provider value={{ isOpen, setIsOpen }}>
            {children}
            <Button
                className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg z-50"
                onClick={() => setIsOpen(true)}
            >
                <MessageSquare className="h-8 w-8" />
                <span className="sr-only">Prenota la tua spesa</span>
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>Prenota il Ritiro in Negozio</DialogTitle>
                        <DialogDescription>
                            Rispondi a poche domande per preparare il tuo ordine. Semplice e veloce!
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                         <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[60vh] overflow-y-auto px-2">
                           {steps.map((_, index) => (
                               <div key={index} className={index <= currentStep ? 'opacity-100' : 'hidden'}>
                                   {renderField(index)}
                               </div>
                           ))}
                         </form>
                    </Form>
                    
                    <DialogFooter>
                         <div className="w-full flex justify-between">
                            {currentStep > 0 && (
                                <Button type="button" variant="outline" onClick={handleBack}>Indietro</Button>
                            )}
                            <div/>
                            {currentStep < steps.length - 1 ? (
                                <Button type="button" onClick={handleNext}>Avanti</Button>
                            ) : (
                                <Button type="button" onClick={form.handleSubmit(onSubmit)} disabled={isSubmitting}>
                                     {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                                    Invia Prenotazione
                                </Button>
                            )}
                         </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </BookingChatContext.Provider>
    );
}
