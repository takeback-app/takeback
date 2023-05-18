import { DateTime } from "luxon";
import PdfPrinter from "pdfmake";

export class Pdf {
  constructor(protected title: string) {}

  public static make({ title }: { title: string }) {
    return new Pdf(title);
  }

  create(titles: string[], data: { text: string; style: string }[][]) {
    const fonts = {
      Helvetica: {
        normal: "Helvetica",
        bold: "Helvetica-Bold",
        italics: "Helvetica-Oblique",
        bolditalics: "Helvetica-BoldOblique",
      },
    };

    const printer = new PdfPrinter(fonts);

    return printer.createPdfKitDocument({
      defaultStyle: {
        font: "Helvetica",
      },
      pageMargins: [5, 10, 5, 10],
      pageOrientation: "landscape",
      content: [
        { text: `${this.title}\n`, style: "header" },
        {
          text: `Relatório gerado ${DateTime.now().toFormat(
            "dd/MM/yyyy HH:mm"
          )}\n\n\n\n`,
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
    });
  }
}
