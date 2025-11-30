import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export const generateKdpManuscript = async (
    element: HTMLElement,
    title: string,
    includeCover: boolean
): Promise<void> => {
    if (!element) {
        throw new Error("PDF generation failed: Root element not found.");
    }

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        format: [8.5, 11] // Standard KDP size
    });

    const allPages = Array.from(element.querySelectorAll<HTMLElement>('.pdf-page'));
    if (allPages.length === 0) {
        throw new Error("PDF generation failed: No pages found to render.");
    }

    // Conditionally exclude the front (first) and back (last) covers
    const pagesToRender = includeCover ? allPages : allPages.slice(1, -1);
    
    if (pagesToRender.length === 0) {
        throw new Error("PDF generation failed: No content pages found to render.");
    }
    
    for (let i = 0; i < pagesToRender.length; i++) {
        const page = pagesToRender[i];
        
        // OPTIMIZATION: Use high resolution for the cover and a smaller resolution for content pages.
        // The cover is only the first page when `includeCover` is true.
        const isCover = includeCover && i === 0;
        const scale = isCover ? 3 : 1.5; // ~300 DPI for cover, ~150 DPI for others

        const canvas = await html2canvas(page, {
            scale: scale,
            useCORS: true,
            logging: false,
        });

        // Use JPEG format with high quality instead of PNG.
        const imgData = canvas.toDataURL('image/jpeg', 0.9);
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        if (i > 0) {
            pdf.addPage();
        }
        
        // Add image as JPEG and apply medium compression within the PDF.
        pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'MEDIUM');
    }
    
    // Sanitize title for filename
    const sanitizedTitle = title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const fileName = includeCover ? `${sanitizedTitle}_manuscript.pdf` : `${sanitizedTitle}_interior.pdf`;
    pdf.save(fileName);
};
