import fs from "fs";
import PDFPrinter from "pdfmake";
import { TDocumentDefinitions } from "pdfmake/interfaces";
import { format } from "./DateFormat";

interface Props {
  titles: any;
  data: any;
  reportName: string;
}

function generateReportPDF({ data, titles, reportName }: Props) {
  const fonts = {
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PDFPrinter(fonts);

  const docsDefination: TDocumentDefinitions = {
    defaultStyle: {
      font: "Helvetica",
    },
    pageMargins: [5, 10, 5, 10],
    pageOrientation: "landscape",
    content: [
      { text: `${reportName}\n`, style: "header" },
      {
        text: `Relatório gerado ${format(new Date())}\n\n\n\n`,
        style: "label",
      },
      {
        table: {
          body: [titles, ...data],
        },
        layout: {
          hLineWidth: function (i, node) {
            return 0.5;
          },
          vLineWidth: function (i, node) {
            return 0.5;
          },
          hLineColor: function (i, node) {
            return "#b3b3b3";
          },
          vLineColor: function (i, node) {
            return "#b3b3b3";
          },
        },
      },
    ],
    footer: function (currentPage, pageCount) {
      return [
        {
          columns: [
            [
              {
                text: "Desencoder - Transformando ideias em realidade!\n",
                style: "footerLabels",
                link: "https://desencoder.com.br",
              },
              {
                text: "www.desencoder.com.br",
                style: "footerLabels",
                link: "https://desencoder.com.br",
              },
            ],
            {
              text: `Página ${currentPage.toString()}/${pageCount}`,
              style: "footerLabels",
              alignment: "right",
            },
          ],
        },
      ];
    },
    styles: {
      header: {
        fontSize: 20,
        alignment: "center",
      },
      label: {
        fontSize: 10,
        alignment: "center",
      },
      tableHeader: {
        fontSize: 8,
        bold: true,
        fillColor: "#bfbfbf",
        margin: [0, 3],
      },
      content: {
        fontSize: 8,
        bold: false,
        margin: [0, 3],
      },
      footerLabels: {
        fontSize: 8,
        margin: [40, 0],
      },
    },
  };

  const pdfDoc = printer.createPdfKitDocument(docsDefination);

  const fileName = new Date()
    .toISOString()
    .replace(".", "")
    .replace(":", "-")
    .replace(":", "-");

  pdfDoc.pipe(fs.createWriteStream(`./uploads/reports/${fileName}.pdf`));

  pdfDoc.end();

  return fileName;
}

export { generateReportPDF };
