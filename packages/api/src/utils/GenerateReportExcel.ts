import * as xl from "excel4node";

interface Props {
  titles: any;
  data: any;
  reportName: string;
}

export function generateReportExcel({ titles, data, reportName }: Props) {
  const wb = new xl.Workbook();
  const ws = wb.addWorksheet(reportName);
  const style = wb.createStyle({
    font: {
      bold: true,
      size: 12,
    },
    fill: {
      type: "pattern",
      patternType: "solid",
      bgColor: "#cccccc",
      fgColor: "#cccccc",
    },
    alignment: {
      horizontal: "center",
    },
  });

  let headingColumnIndex = 1;
  titles.forEach((heading) => {
    ws.cell(1, headingColumnIndex++)
      .string(heading)
      .style(style);
  });

  let rowIndex = 2;
  data.forEach((record) => {
    let columnIndex = 1;
    Object.keys(record).forEach((columnName) => {
      ws.cell(rowIndex, columnIndex++).string(record[columnName]);
    });
    rowIndex++;
  });

  const fileName = new Date()
    .toISOString()
    .replace(".", "")
    .replace(":", "-")
    .replace(":", "-");

  wb.write(`./uploads/reports/${fileName}.xlsx`);

  return fileName;
}
