import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import html2canvas from 'html2canvas';

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  constructor() {}

  async generatePdf(formElement: HTMLElement): Promise<Uint8Array | null> {
    if (!formElement) {
      console.error("❌ Form element not found! Ensure `id=formContainer` is set.");
      return null;
    }

    console.log("📸 Capturing form as an image...");

    try {
      const canvas = await html2canvas(formElement, {
        scale: 0.8,
        allowTaint: true,
        backgroundColor: '#FFFFFF'
      });

      console.log("✅ Form captured successfully!");

      const imgData = canvas.toDataURL('image/png');

      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]);

      try {
        const imageBytes = await fetch(imgData).then(res => res.arrayBuffer());
        const image = await pdfDoc.embedPng(imageBytes);

        const pageWidth = page.getWidth();
        const pageHeight = page.getHeight();
        const scale = Math.min(pageWidth / image.width, pageHeight / image.height);

        const scaledWidth = image.width * scale;
        const scaledHeight = image.height * scale;
        const x = (pageWidth - scaledWidth) / 2;
        const y = pageHeight - scaledHeight - 10;

        page.drawImage(image, { x, y, width: scaledWidth, height: scaledHeight });
      } catch (imageError) {
        console.error("❌ Error embedding image:", imageError);
        return null;
      }

      const pdfBytes = await pdfDoc.save();
      console.log("✅ PDF generated successfully");
      return pdfBytes;

    } catch (error) {
      console.error("❌ Error generating PDF:", error);
      return null;
    }
  }
}
