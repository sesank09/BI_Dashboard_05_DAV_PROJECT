import api from './api';

/**
 * Downloads a report file (CSV, Excel XLSX, or PDF) dynamically using Blob
 * @param {'csv'|'excel'|'pdf'} format 
 * @param {string} dataset 
 * @returns {Promise<{success: boolean, message?: string}>}
 */
export const downloadReport = async (format = 'csv', dataset = 'sales') => {
  try {
    const mimeTypes = {
      csv: 'text/csv',
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      pdf: 'application/pdf',
    };

    const extensions = {
      csv: 'csv',
      excel: 'xlsx',
      pdf: 'pdf',
    };

    const res = await api.get(`/export/${format}?dataset=${dataset}`, {
      responseType: 'blob',
    });

    const blob = new Blob([res.data], {
      type: mimeTypes[format] || 'application/octet-stream',
    });

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `bi_report_${dataset}_${new Date().toISOString().slice(0, 10)}.${extensions[format] || format}`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.error(`Export download error for ${dataset} in format ${format}:`, error);
    return {
      success: false,
      message: error.response?.data?.detail || error.message || 'Failed to download report.',
    };
  }
};
