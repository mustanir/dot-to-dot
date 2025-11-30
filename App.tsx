
import React, { useState, useCallback, useRef } from 'react';
import { BookDetails, GeneratedImage, Difficulty } from './types';
import * as geminiService from './services/geminiService';
import { generateKdpManuscript } from './services/pdfService';
import GeneratorForm from './components/GeneratorForm';
import ResultsDisplay from './components/ResultsDisplay';
import PdfDocument from './components/PdfDocument';
import Header from './components/Header';
import { Loader2 } from 'lucide-react';

const App: React.FC = () => {
    const [bookDetails, setBookDetails] = useState<BookDetails | null>(null);
    const [images, setImages] = useState<GeneratedImage[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [progressMessage, setProgressMessage] = useState<string>('');
    const [error, setError] = useState<string | null>(null);

    const pdfDocumentRef = useRef<HTMLDivElement>(null);

    const handleGenerate = useCallback(async (category: string, count: number, difficulty: Difficulty) => {
        setIsLoading(true);
        setError(null);
        setBookDetails(null);
        setImages([]);

        try {
            setProgressMessage('Crafting book title and cover concept...');
            const [title, description, coverImage] = await Promise.all([
                geminiService.generateBookTitle(category, difficulty),
                geminiService.generateBookDescription(category),
                geminiService.generateCoverImage(category)
            ]);
            setBookDetails({ title, description, coverImage });

            setProgressMessage('Brainstorming dot-to-dot ideas...');
            const imageIdeas = await geminiService.generateImageIdeas(category, count);

            const generatedImages: GeneratedImage[] = [];
            for (let i = 0; i < imageIdeas.length; i++) {
                const idea = imageIdeas[i];
                setProgressMessage(`Generating dot-to-dot image ${i + 1} of ${imageIdeas.length}: ${idea}`);
                const imageUrl = await geminiService.generateDotToDotImage(idea, difficulty);
                generatedImages.push({ id: `page-${i + 1}`, url: imageUrl, name: idea });
            }
            setImages(generatedImages);

        } catch (e) {
            console.error(e);
            setError('An error occurred during generation. Please check the console and try again.');
        } finally {
            setIsLoading(false);
            setProgressMessage('');
        }
    }, []);

    const handleDownloadPdf = useCallback(async (includeCover: boolean) => {
        if (!pdfDocumentRef.current || !bookDetails) return;
        setIsLoading(true);
        setProgressMessage('Generating your KDP manuscript PDF...');
        try {
            await generateKdpManuscript(pdfDocumentRef.current, bookDetails.title, includeCover);
        } catch (e) {
            console.error(e);
            setError('Failed to generate PDF. Please try again.');
        } finally {
            setIsLoading(false);
            setProgressMessage('');
        }
    }, [bookDetails]);


    return (
        <div className="bg-slate-50 min-h-screen text-slate-800">
            <Header />
            <main className="container mx-auto p-4 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-4 xl:col-span-3">
                        <GeneratorForm onGenerate={handleGenerate} isLoading={isLoading} />
                    </div>
                    <div className="lg:col-span-8 xl:col-span-9">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-md border border-slate-200">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
                                <p className="text-lg font-semibold text-slate-700">{progressMessage}</p>
                                <p className="text-sm text-slate-500 mt-2">Please wait, AI is working its magic...</p>
                            </div>
                        )}
                        {error && (
                            <div className="flex items-center justify-center h-96 bg-red-50 rounded-lg shadow-md border border-red-200 p-4">
                                <p className="text-red-700 font-semibold">{error}</p>
                            </div>
                        )}

                        {!isLoading && !error && bookDetails && images.length > 0 && (
                            <ResultsDisplay
                                bookDetails={bookDetails}
                                images={images}
                                onDownloadPdf={handleDownloadPdf}
                            />
                        )}
                         {!isLoading && !error && !bookDetails && images.length === 0 && (
                             <div className="flex flex-col items-center justify-center h-96 bg-white rounded-lg shadow-md border border-slate-200 p-4 text-center">
                                <h2 className="text-2xl font-bold text-slate-700 mb-2">Welcome!</h2>
                                 <p className="text-slate-500">Enter a category and number of pages to start creating your dot-to-dot book.</p>
                             </div>
                        )}
                    </div>
                </div>

                {bookDetails && images.length > 0 && (
                    <div ref={pdfDocumentRef} className="absolute -left-[9999px] top-0 opacity-0" aria-hidden="true">
                        <PdfDocument bookDetails={bookDetails} images={images} />
                    </div>
                )}
            </main>
        </div>
    );
};

export default App;
