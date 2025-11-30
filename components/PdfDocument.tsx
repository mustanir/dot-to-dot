import React from 'react';
import { BookDetails, GeneratedImage } from '../types';

interface PdfDocumentProps {
    bookDetails: BookDetails;
    images: GeneratedImage[];
}

const PdfDocument: React.FC<PdfDocumentProps> = ({ bookDetails, images }) => {
    // KDP standard size is 8.5 x 11 inches. 
    // At 96 DPI (standard screen), this is 816x1056 pixels.
    // We render into this container for html2canvas.
    const pageStyle: React.CSSProperties = {
        width: '816px',
        height: '1056px',
        backgroundColor: 'white',
        pageBreakAfter: 'always',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
    };

    return (
        <div>
            {/* Front Cover Page */}
            <div className="pdf-page" style={pageStyle}>
                <img src={bookDetails.coverImage} alt="Book Cover" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', padding: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <h1 style={{ fontSize: '60px', fontWeight: 'bold', color: 'white', textTransform: 'capitalize', textShadow: '3px 3px 6px rgba(0,0,0,0.7)', maxWidth: '90%' }}>
                        {bookDetails.title}
                    </h1>
                </div>
            </div>

            {/* Dot-to-Dot Image Pages */}
            {images.map((image, index) => (
                <div key={image.id} className="pdf-page" style={{...pageStyle, position: 'static'}}>
                    <div style={{ padding: '40px', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
                            <img src={image.url} alt={`Dot-to-dot page ${index + 1}`} style={{ maxWidth: '100%', maxHeight: '80%', objectFit: 'contain' }} />
                            <p style={{ fontSize: '24px', color: '#333', marginTop: '20px', textTransform: 'capitalize' }}>{image.name}</p>
                        </div>
                        <p style={{ fontSize: '14px', color: '#555' }}>{index + 1}</p>
                    </div>
                </div>
            ))}
            
            {/* Back Cover Page */}
            <div className="pdf-page" style={{...pageStyle, justifyContent: 'flex-start', position: 'static'}}>
                <div style={{ padding: '80px', textAlign: 'center' }}>
                     <h2 style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: '40px' }}>About This Book</h2>
                    <p style={{ fontSize: '18px', lineHeight: '1.6', textAlign: 'left' }}>
                        {bookDetails.description}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PdfDocument;