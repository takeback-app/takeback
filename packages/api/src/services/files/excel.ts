import * as xl from "excel4node";

export class Excel {
  protected workbook;
  protected worksheet;

  constructor() {
    this.workbook = new xl.Workbook();
  }

  public static make() {
    return new Excel();
  }

  addWorksheet(name: string) {
    this.worksheet = this.workbook.addWorksheet(name);

    return this;
  }

  setHeading(headers: string[]) {
    const style = this.workbook.createStyle({
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

    headers.forEach((header, index) =>
      this.worksheet
        .cell(1, index + 1)
        .string(header)
        .style(style)
    );

    return this;
  }

  setData(records: Record<string, any>[]) {
    const initialRow = 2;

    records.forEach((record, rowIndex) => {
      Object.keys(record).forEach((columnName, columnIndex) => {
        this.worksheet
          .cell(rowIndex + initialRow, columnIndex + 1)
          .string(record[columnName]);
      });
    });

    return this;
  }

  create() {
    return this.workbook;
  }
}
