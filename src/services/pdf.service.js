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

class PdfService {
  generarReporte(titulo, subtitulo, tabla, fechaDesde, fechaHasta) {
    const docDefinition = {
      pageSize: 'A4',
      pageMargins: [40, 60, 40, 60],
      defaultStyle: {
        font: 'Helvetica',
        fontSize: 9
      },
      header: (currentPage, pageCount) => ({
        text: `Narvales Azules - ${titulo}`,
        alignment: 'right',
        margin: [40, 10, 40, 0],
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
            widths: tabla.widths,
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
            paddingLeft: () => 6,
            paddingRight: () => 6,
            paddingTop: () => 4,
            paddingBottom: () => 4
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
    return doc;
  }
}

export default new PdfService();
