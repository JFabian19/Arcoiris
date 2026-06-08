import Papa from 'papaparse';

// Coloca aquí tu nuevo ID de Google Sheets (puedes extraerlo de la URL de tu hoja de cálculo)
const SHEET_ID = '1q8yT7bFO-bycbNcb4pxah63lt4xzUCLEU0hHpIXqelY';

export interface SheetDish {
  nombres: string;
  'nombre del plato': string;
  descripción: string;
  precio: string;
  'URL de imagen': string;
}

export interface SheetCategory {
  nombres: string;
}

export const fetchSheetData = async <T>(sheetName: string): Promise<T[]> => {
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  
  try {
    const response = await fetch(url);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => resolve(results.data as T[]),
        error: (error: any) => reject(error),
      });
    });
  } catch (error) {
    console.error(`Error fetching sheet ${sheetName}:`, error);
    return [];
  }
};

// Configura aquí la URL de tu Google Apps Script Web App para poder registrar respuestas (Fidelización)
// Instrucciones: Crea un proyecto de Google Apps Script, pega el código de integración, impleméntalo como Aplicación Web y pega la URL resultante aquí.
export const WEB_APP_URL = '';

export const submitSheetData = async (sheetName: string, data: any): Promise<boolean> => {
  if (!WEB_APP_URL) {
    console.warn('Falta configurar WEB_APP_URL. Simulando envío a:', sheetName, data);
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  }

  try {
    const response = await fetch(WEB_APP_URL, {
      method: 'POST',
      mode: 'no-cors', // Importante para evitar problemas de CORS con Apps Script
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sheetName,
        data,
      }),
    });
    
    return true;
  } catch (error) {
    console.error(`Error submitting to sheet ${sheetName}:`, error);
    return false;
  }
};
