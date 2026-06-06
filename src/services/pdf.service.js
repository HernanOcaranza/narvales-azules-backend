import pdfmake from 'pdfmake';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const PdfPrinter = require('pdfmake/js/index.js');

const fonts = {
  Helvetica: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique'
  }
};

const A4_WIDTH_PT = 841.89;
const MARGIN_LEFT = 40;
const MARGIN_RIGHT = 40;
const MAX_CONTENT_WIDTH = Math.floor(A4_WIDTH_PT - MARGIN_LEFT - MARGIN_RIGHT);

class PdfService {
  getMaxContentWidth() {
    return MAX_CONTENT_WIDTH;
  }

  generarReporte(titulo, subtitulo, tabla, fechaDesde, fechaHasta) {
    const fixedTotal = tabla.widths
      .filter(w => typeof w === 'number')
      .reduce((s, w) => s + w, 0);
    const starCount = tabla.widths.filter(w => w === '*' || w === 'auto').length;

    let safeWidths;
    if (starCount > 0) {
      const remaining = Math.max(0, MAX_CONTENT_WIDTH - fixedTotal);
      const starWidth = Math.floor(remaining / starCount);
      safeWidths = tabla.widths.map(w => {
        if (typeof w === 'number') return w;
        if (w === '*' || w === 'auto') return Math.max(starWidth, 30);
        return 60;
      });
      const safeTotal = safeWidths.reduce((s, w) => s + w, 0);
      if (safeTotal > MAX_CONTENT_WIDTH) {
        const scale = MAX_CONTENT_WIDTH / safeTotal;
        safeWidths = safeWidths.map(w => Math.max(Math.floor(w * scale), 20));
      }
    } else if (fixedTotal > MAX_CONTENT_WIDTH) {
      const scale = MAX_CONTENT_WIDTH / fixedTotal;
      safeWidths = tabla.widths.map(w => Math.floor(w * scale));
    } else {
      safeWidths = [...tabla.widths];
    }

    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [MARGIN_LEFT, 40, MARGIN_RIGHT, 40],
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 9
      },
      header: (currentPage, pageCount) => ({
        text: `Narvales Azules - ${titulo}`,
        alignment: 'right',
        margin: [MARGIN_LEFT, 10, MARGIN_RIGHT, 0],
        fontSize: 7,
        color: '#888888'
      }),
      footer: (currentPage, pageCount) => ({
        text: `Página ${currentPage} de ${pageCount}`,
        alignment: 'center',
        fontSize: 7,
        color: '#888888'
      }),
      content: [
        {
          text: 'Narvales Azules',
          style: 'headerTitle'
        },
        {
          text: titulo,
          style: 'subheader'
        },
        ...(subtitulo ? [{ text: subtitulo, style: 'description', margin: [0, 0, 0, 10] }] : []),
        ...(fechaDesde || fechaHasta ? [
          {
            text: `Período: ${fechaDesde || '—'} al ${fechaHasta || '—'}`,
            style: 'description',
            margin: [0, 0, 0, 10]
          }
        ] : []),
        {
          table: {
            headerRows: 1,
            widths: safeWidths,
            body: [
              tabla.headers.map(h => ({
                text: h,
                style: 'tableHeader'
              })),
              ...tabla.rows
            ]
          },
          layout: {
            hLineWidth: (i, node) => (i === 0 || i === node.table.body.length) ? 1 : 0.5,
            vLineWidth: () => 0.5,
            hLineColor: (i) => i === 0 ? '#1e40af' : '#d1d5db',
            vLineColor: () => '#d1d5db',
            paddingLeft: () => 0,
            paddingRight: () => 0,
            paddingTop: () => 2,
            paddingBottom: () => 2
          }
        },
        {
          text: `Generado el ${new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}`,
          style: 'footerNote'
        }
      ],
      styles: {
        headerTitle: {
          fontSize: 20,
          bold: true,
          color: '#1e40af',
          margin: [0, 0, 0, 4]
        },
        subheader: {
          fontSize: 13,
          color: '#374151',
          margin: [0, 0, 0, 2]
        },
        description: {
          fontSize: 9,
          color: '#6b7280',
          italics: true
        },
        tableHeader: {
          bold: true,
          fontSize: 9,
          color: '#ffffff',
          fillColor: '#1e40af',
          alignment: 'center'
        },
        footerNote: {
          fontSize: 7,
          color: '#9ca3af',
          alignment: 'center',
          margin: [0, 20, 0, 0]
        }
      }
    };

    PdfPrinter.fonts = fonts;
    const doc = PdfPrinter.createPdf(docDefinition);
    doc.docDefinition = docDefinition;
    return doc;
  }
}

export default new PdfService();
