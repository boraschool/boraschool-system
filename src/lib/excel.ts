// src/lib/excel.ts
import ExcelJS from 'exceljs'

export async function exportStudents(students: any[]) {
  const workbook = new ExcelJS.Workbook()
  const sheet = workbook.addWorksheet('Students')

  sheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Name', key: 'name', width: 30 },
    { header: 'Grade', key: 'grade', width: 10 },
  ]

  students.forEach(student => sheet.addRow(student))

  // Save file (browser)
  const buffer = await workbook.xlsx.writeBuffer()
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = 'students.xlsx'
  link.click()
}