
import React, { useState } from 'react';
import { BookDetails, GeneratedImage } from '../types';
import { Download } from 'lucide-react';

interface ResultsDisplayProps {
    bookDetails: BookDetails;
    images: GeneratedImage[];
    onDownloadPdf: (includeCover: boolean) => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ bookDetails, images, onDownloadPdf }) => {
    const [includeCover, setIncludeCover] = useState(true);

    return (
        <div className="space-y-8">
            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">{bookDetails.title}</h2>
                        <p className="mt-2 text-slate-600 max-w-2xl">{bookDetails.description}</p>
                    </div>
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => onDownloadPdf(includeCover)}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                            <Download className="mr-2 h-4 w-4" />
                            Download PDF
                        </button>
                        <div className="flex items-center mt-3">
                            <input
                                type="checkbox"
                                id="includeCover"
                                checked={includeCover}
                                onChange={(e) => setIncludeCover(e.target.checked)}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="includeCover" className="ml-2 block text-sm text-slate-700">
                                Include front & back cover
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-slate-200">
                <h3 className="text-xl font-bold text-slate-800 border-b pb-3 mb-4">Generated Pages</h3>
                 <div className="space-y-6">
                    <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Front Cover</h4>
                         <div className="relative w-1/2 mx-auto rounded-md shadow-lg border overflow-hidden">
                            <img src={bookDetails.coverImage} alt="Generated Book Cover" className="w-full h-auto block"/>
                            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-30">
                                <h3 className="text-white text-3xl md:text-4xl font-bold text-center capitalize" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                                    {bookDetails.title}
                                </h3>
                            </div>
                        </div>
                    </div>
                     <div>
                        <h4 className="font-semibold text-slate-700 mb-2">Dot-to-Dot Pages</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {images.map((image, index) => (
                                <div key={image.id} className="border rounded-md p-2 bg-slate-50 flex flex-col">
                                    <img src={image.url} alt={`Dot to dot page ${index + 1}`} className="w-full h-auto rounded-sm" />
                                     <div className="mt-1 text-center">
                                        <p className="text-sm font-medium text-slate-700 capitalize">{image.name}</p>
                                        <p className="text-xs text-slate-500">Page {index + 1}</p>
                                     </div>
                                </div>
                            ))}
                        </div>
                     </div>
                 </div>
            </div>
        </div>
    );
};

export default ResultsDisplay;
