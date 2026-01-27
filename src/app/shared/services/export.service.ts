import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  /**
   * Exporta dados para CSV
   * @param data Array de objetos para exportar
   * @param filename Nome do arquivo (sem extensão)
   * @param columns Colunas a exportar (por padrão todas)
   */
  exportToCSV(data: any[], filename: string, columns?: string[]): void {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar');
      return;
    }

    // Define colunas a exportar
    const keysToExport = columns || Object.keys(data[0]);

    // Cria header do CSV
    const headers = keysToExport.join(',');

    // Cria linhas do CSV
    const rows = data.map(item =>
      keysToExport.map(key => {
        const value = item[key];
        // Escapa aspas e quebras de linha
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value || '';
      }).join(',')
    );

    // Combina header e linhas
    const csv = [headers, ...rows].join('\n');

    // Download do arquivo
    this.downloadFile(csv, `${filename}.csv`, 'text/csv;charset=utf-8;');
  }

  /**
   * Exporta dados para Excel XLSX (profissional)
   * @param data Array de objetos para exportar
   * @param filename Nome do arquivo (sem extensão)
   * @param sheetName Nome da aba
   * @param columns Colunas a exportar
   */
  exportToExcel(data: any[], filename: string, sheetName: string = 'Dados', columns?: string[]): void {
    if (!data || data.length === 0) {
      console.warn('Nenhum dado para exportar');
      return;
    }

    const keysToExport = columns || Object.keys(data[0]);

    // Prepara dados para o SheetJS
    const exportData = data.map(item => {
      const row: any = {};
      keysToExport.forEach(key => {
        // Formata valores
        let value = item[key];
        if (value instanceof Date) {
          value = value.toLocaleDateString('pt-BR');
        } else if (typeof value === 'boolean') {
          value = value ? 'Sim' : 'Não';
        }
        row[key] = value || '';
      });
      return row;
    });

    // Cria worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData);

    // Ajusta largura das colunas
    const columnWidths = keysToExport.map(key => ({
      wch: Math.max(key.length, 12)
    }));
    worksheet['!cols'] = columnWidths;

    // Formata header (primeira linha)
    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const address = XLSX.utils.encode_col(C) + '1';
      if (!worksheet[address]) continue;
      worksheet[address].s = {
        font: { bold: true, color: { rgb: 'FFFFFF' } },
        fill: { fgColor: { rgb: '4472C4' } },
        alignment: { horizontal: 'center', vertical: 'center' }
      };
    }

    // Cria workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

    // Faz download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  }

  /**
   * Faz download de um arquivo
   * @param content Conteúdo do arquivo
   * @param filename Nome do arquivo
   * @param mimeType Tipo MIME do arquivo
   */
  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
