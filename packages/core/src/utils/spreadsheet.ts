import ExcelJS from 'exceljs';
import fs from 'fs';

export interface TestCaseRow {
  testCaseId: string;
  module: string;
  priority?: string;
  automationCandidate?: string;
  status?: string;
  actualResult?: string;
}

export async function readWorkbook(filePath: string): Promise<TestCaseRow[]> {
  if (!fs.existsSync(filePath)) {
    return [];
  }

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);

  const rows: TestCaseRow[] = [];
  workbook.eachSheet((worksheet) => {
    const sheetName = worksheet.name;
    worksheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header
      const idCell = row.getCell(1).text?.trim();
      if (idCell) {
        rows.push({
          testCaseId: idCell,
          module: sheetName,
          priority: row.getCell(2).text?.trim(),
          automationCandidate: row.getCell(3).text?.trim(),
          status: row.getCell(4).text?.trim(),
          actualResult: row.getCell(5).text?.trim(),
        });
      }
    });
  });

  return rows;
}
