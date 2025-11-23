import { MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

const WhatsAppIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M16.75 13.96c.25.13.41.2.52.34.11.14.11.33.01.55-.11.22-.71.83-1.03.99-.31.16-1.42.13-2.4-.33-.98-.46-2.03-1.12-3.13-2.22-1.1-1.1-1.76-2.15-2.22-3.13-.46-1.01-.49-2.09-.33-2.4.16-.32.77-.93.99-1.03.22-.11.41-.11.55.01.14.11.2.27.34.52l.49.87c.25.44.19.98-.09 1.3l-.63.76c-.27.33-.13.75.14 1.01.76.76 1.63 1.42 2.65 1.95.27.13.69.01.99-.25l.63-.76c.33-.27.87-.33 1.3-.09l.87.49zM12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2z"></path>
    </svg>
);


export default function ContattiPage() {
    return (
        <div className="w-full bg-background">
            <div className="container mx-auto flex min-h-[calc(80vh)] flex-col items-center justify-center space-y-12 px-4 py-16 text-center md:px-6">
                
                <div className="space-y-4">
                    <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl">
                        Vieni a trovarci in Bottega
                    </h1>
                    <Card className="mx-auto max-w-md border-primary/20 bg-card pt-6 shadow-lg">
                        <CardContent className="flex flex-col items-center justify-center gap-4">
                            <MapPin className="h-10 w-10 text-primary" />
                            <p className="text-xl font-medium text-foreground">
                                Siamo a Erchie (BR)
                            </p>
                            <p className="text-2xl font-bold text-primary">
                                Via Santa Lucia, 69
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <div className="w-full max-w-2xl space-y-6 rounded-lg bg-secondary/50 p-8 shadow-inner">
                    <h2 className="font-headline text-3xl font-bold text-primary">Non fare la fila!</h2>
                    <p className="text-xl text-foreground/80">
                        Prenota la tua spesa su WhatsApp e passa solo a ritirare. Semplice, veloce e senza attese.
                    </p>
                    <Link href="https://wa.me/390123456789" target="_blank" rel="noopener noreferrer">
                        <Button size="lg" className="h-14 bg-[#25D366] px-8 text-lg text-white hover:bg-[#1EBE57]">
                            <WhatsAppIcon className="mr-3 h-7 w-7" />
                            Prenota su WhatsApp
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}
