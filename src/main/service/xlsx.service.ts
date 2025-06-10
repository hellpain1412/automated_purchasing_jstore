import { join } from "path";
import { v4 as uuidv4 } from "uuid";
import * as XLSX from "xlsx-js-style";
import path from "node:path";

export interface IData {
  sheetName: string;
  sheetData: any[];
}

function toSafeFilename(input: string, maxLength = 100) {
  // Tên file bị cấm trong Windows
  const reservedNames = [
    "CON",
    "PRN",
    "AUX",
    "NUL",
    "COM1",
    "COM2",
    "COM3",
    "COM4",
    "COM5",
    "COM6",
    "COM7",
    "COM8",
    "COM9",
    "LPT1",
    "LPT2",
    "LPT3",
    "LPT4",
    "LPT5",
    "LPT6",
    "LPT7",
    "LPT8",
    "LPT9",
  ];

  // Loại bỏ ký tự không hợp lệ
  let filename = input
    .replace(/[\x00-\x1f<>:"/\\|?*]/g, "") // Ký tự điều khiển + cấm
    .replace(/\s+/g, " ") // Nhiều khoảng trắng → 1 khoảng trắng
    .trim();

  // Cắt độ dài
  if (filename.length > maxLength) {
    filename = filename.slice(0, maxLength).trim();
  }

  // Nếu là tên bị cấm → thêm hậu tố để tránh
  if (reservedNames.includes(filename.toUpperCase())) {
    filename += "_file";
  }

  // Nếu rỗng → đặt tên mặc định
  if (!filename) {
    filename = "untitled";
  }

  return filename;
}

export class XlsxHandlerService {
  private workbook: XLSX.WorkBook;
  private dataJSON: IData[];
  private path: string;

  constructor(path: string) {
    this.path = path;
  }

  static init(path: string) {
    const init = new XlsxHandlerService(path);
    init.parseData();
    return init;
  }

  private resetSheet(workSheet: XLSX.WorkSheet) {
    const range = XLSX.utils.decode_range(workSheet["!ref"]);
    const {
      s: { c: minCol, r: minRow },
      e: { c: maxCol, r: maxRow },
    } = range;

    for (let c = minCol + 1; c <= maxCol; ++c) {
      for (let r = minRow + 1; r <= maxRow; ++r) {
        if (!workSheet || !workSheet[r] || !workSheet[r][c]) continue;
        if (workSheet[r][c].t == "z") continue;
        workSheet[r][c].c = undefined;
      }
    }
  }

  private parseData() {
    const workbook = XLSX.read(this.path, {
      type: "file",
      dense: true,
      cellStyles: true,
      cellFormula: false,
      cellHTML: true,
      sheetStubs: true,
    });

    const result = workbook.SheetNames.map((sheetName, index) => {
      const workSheet = workbook.Sheets[workbook.SheetNames[index]];
      this.resetSheet(workSheet);
      const sheetData = XLSX.utils.sheet_to_json(workSheet, { raw: false });
      return {
        sheetName,
        sheetData,
      };
    });

    this.workbook = workbook;
    this.dataJSON = result;
  }

  private createComment(comments: string[]) {
    return {
      a: "System Admin",
      t: comments.reduce(
        (acc, el, i) =>
          `${acc}${i + 1}.${el?.trim().replace(/^(\d+\.)/, "")}\n`,
        ""
      ),
    };
  }

  deleteRow(row: number, sheetName: string) {
    const workSheet = this.workbook.Sheets[sheetName];
    const range = XLSX.utils.decode_range(workSheet["!ref"]);
    const {
      s: { c: minCol, r: minRow },
      e: { c: maxCol, r: maxRow },
    } = range;

    for (let r = row; r <= maxRow; ++r) {
      if (!workSheet || !workSheet[r]) workSheet[r] = [];
      if (!workSheet || !workSheet[r + 1]) workSheet[r + 1] = [];
      for (let c = minCol; c <= maxCol; ++c) {
        workSheet[r][c] = workSheet[r + 1][c];
      }
    }
    range.e.r--;
    workSheet["!ref"] = XLSX.utils.encode_range(range.s, range.e);
  }

  getColumnByHeader(str: string, sheetName: string) {
    const workSheet = this.workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(workSheet, {
      raw: false,
      header: "A",
    });

    const sheetHeader = sheetData[0];
    if (sheetHeader) {
      const AStyleCol = Object.values(sheetHeader).find(
        (val: string) =>
          val?.toLowerCase()?.trim() === str?.toLowerCase()?.trim()
      );
      return sheetHeader && AStyleCol ? XLSX.utils.decode_col(AStyleCol) : -1;
    }
    return -1;
  }

  getSheets(): string[] {
    return this.workbook.SheetNames;
  }

  getColumnNames(sheetName: string) {
    const workSheet = this.workbook.Sheets[sheetName];
    const sheetData = XLSX.utils.sheet_to_json(workSheet, {
      raw: false,
      header: "A",
    });
    const sheetHeader = sheetData[0];
    return Object.values(sheetHeader);
  }

  getData(): IData[] {
    return this.dataJSON;
  }

  saveCellComment(note: [[number, number], string[]], sheetName: string) {
    const [[row, column], comments] = note;

    const ws = this.workbook.Sheets[sheetName];
    if (!ws[row]) ws[row] = [];
    if (!ws[row][column] || ws[row][column]?.t == "z") {
      XLSX.utils.sheet_add_aoa(ws, [[""]], {
        origin: { r: row, c: column },
      });
    }

    ws[row][column].s = {
      font: { bold: true, color: { rgb: "FF0000" } },
      fill: { fgColor: { rgb: "ffff00" } },
    };
    const existedComment = ws[row][column]?.c?.[0]?.t;
    ws[row][column].c = [];
    ws[row][column].c.hidden = true;
    ws[row][column].c.push(
      this.createComment([
        ...comments,
        ...(existedComment ? [existedComment] : []),
      ])
    );
  }

  generateUniqueFileName() {
    const time = new Date().getTime();
    const name = time + "-" + uuidv4();
    return name;
  }

  saveToFile(filename?: string) {
    return XLSX.writeFile(
      this.workbook,
      join(process.cwd(), "import-error-files", `${filename}.xlsx`),
      { type: "file" }
    );
  }

  static exportXLSX(JSON_Data: any, filePath: string, email: string) {
    const worksheet = XLSX.utils.json_to_sheet(JSON_Data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

    return XLSX.writeFile(
      workbook,
      join(filePath, toSafeFilename(`${email}-result-${Date.now()}.xlsx`)),
      { type: "file" }
    );
  }
}
