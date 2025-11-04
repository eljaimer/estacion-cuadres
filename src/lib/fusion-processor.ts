/**
 * Procesador de Reportes Fusion
 * Procesa archivos CSV del sistema Fusion y genera totalizaciones por turno
 */

import { parse } from 'csv-parse/sync';

export interface FusionTransaction {
  fecha: Date;
  idTurnoFusion: number;
  numeroTurno: number;
  bomba: number;
  manguera: number;
  combustible: string;
  modoServicio: 'FULL' | 'SELF';
  volumen: number;
  total: number;
  precioUnitario: number;
  tipoPago: string;
  hora: string;
  correlativo: string;
  estado: string;
}

export interface TotalizacionTurno {
  numeroTurno: number;
  idFusion: number;
  porTipoServicio: {
    servicioCompleto: TotalizacionDetallada;
    autoservicio: TotalizacionDetallada;
  };
  porBomba: Record<number, TotalizacionBomba>;
  totales: {
    volumen: number;
    monto: number;
    transacciones: number;
  };
}

export interface TotalizacionDetallada {
  volumen: number;
  monto: number;
  transacciones: number;
  porProducto: Record<string, { volumen: number; monto: number }>;
}

export interface TotalizacionBomba {
  bomba: number;
  volumen: number;
  monto: number;
  transacciones: number;
  servicioCompleto: number;
  autoservicio: number;
  porProducto: Record<string, { volumen: number; monto: number }>;
}

export class FusionProcessor {
  /**
   * Procesa un archivo CSV de Fusion
   */
  static async procesarArchivo(contenidoCSV: string): Promise<{
    transacciones: FusionTransaction[];
    fecha: Date;
    turnos: TotalizacionTurno[];
    resumenDia: any;
  }> {
    // Parse CSV
    const records = parse(contenidoCSV, {
      columns: true,
      skip_empty_lines: true,
      delimiter: ',',
    });

    // Convertir a transacciones
    const transacciones: FusionTransaction[] = records.map((row: any) => ({
      fecha: new Date(row['Fecha de inicio']),
      idTurnoFusion: parseInt(row['Id Turno Fusion']),
      bomba: parseInt(row['Bomba']),
      manguera: parseInt(row['Manguera']),
      combustible: row['Combustible'],
      modoServicio: row['Modo Servicio'] as 'FULL' | 'SELF',
      volumen: parseFloat(row['Volumen']),
      total: parseFloat(row['Total']),
      precioUnitario: parseFloat(row['Precio Unitario']),
      tipoPago: row['Tipo Pago'],
      hora: row['Hora de fin'],
      correlativo: row['Correlativo'],
      estado: row['Estado'],
      numeroTurno: 0, // Se asigna después
    }));

    // Mapear IDs Fusion a números de turno (1-4)
    const idsFusion = Array.from(new Set(transacciones.map(t => t.idTurnoFusion))).sort((a, b) => a - b);
    const mapeoTurnos: Record<number, number> = {};
    idsFusion.forEach((idFusion, index) => {
      mapeoTurnos[idFusion] = index + 1;
    });

    // Asignar números de turno
    transacciones.forEach(t => {
      t.numeroTurno = mapeoTurnos[t.idTurnoFusion];
    });

    // Totalizar por turno
    const turnos = this.totalizarPorTurnos(transacciones, mapeoTurnos);

    // Resumen del día
    const resumenDia = this.generarResumenDia(transacciones);

    return {
      transacciones,
      fecha: transacciones[0]?.fecha || new Date(),
      turnos,
      resumenDia,
    };
  }

  /**
   * Totaliza transacciones agrupadas por turno
   */
  private static totalizarPorTurnos(
    transacciones: FusionTransaction[],
    mapeoTurnos: Record<number, number>
  ): TotalizacionTurno[] {
    const turnosData: TotalizacionTurno[] = [];

    Object.entries(mapeoTurnos).forEach(([idFusion, numeroTurno]) => {
      const txDelTurno = transacciones.filter(t => t.idTurnoFusion === parseInt(idFusion));

      const totalizacion: TotalizacionTurno = {
        numeroTurno,
        idFusion: parseInt(idFusion),
        porTipoServicio: {
          servicioCompleto: this.totalizarPorTipoServicio(txDelTurno, 'FULL'),
          autoservicio: this.totalizarPorTipoServicio(txDelTurno, 'SELF'),
        },
        porBomba: this.totalizarPorBomba(txDelTurno),
        totales: {
          volumen: txDelTurno.reduce((sum, t) => sum + t.volumen, 0),
          monto: txDelTurno.reduce((sum, t) => sum + t.total, 0),
          transacciones: txDelTurno.length,
        },
      };

      turnosData.push(totalizacion);
    });

    return turnosData.sort((a, b) => a.numeroTurno - b.numeroTurno);
  }

  /**
   * Totaliza por tipo de servicio
   */
  private static totalizarPorTipoServicio(
    transacciones: FusionTransaction[],
    tipo: 'FULL' | 'SELF'
  ): TotalizacionDetallada {
    const filtradas = transacciones.filter(t => t.modoServicio === tipo);
    const porProducto: Record<string, { volumen: number; monto: number }> = {};

    filtradas.forEach(t => {
      if (!porProducto[t.combustible]) {
        porProducto[t.combustible] = { volumen: 0, monto: 0 };
      }
      porProducto[t.combustible].volumen += t.volumen;
      porProducto[t.combustible].monto += t.total;
    });

    return {
      volumen: filtradas.reduce((sum, t) => sum + t.volumen, 0),
      monto: filtradas.reduce((sum, t) => sum + t.total, 0),
      transacciones: filtradas.length,
      porProducto,
    };
  }

  /**
   * Totaliza por bomba individual
   */
  private static totalizarPorBomba(
    transacciones: FusionTransaction[]
  ): Record<number, TotalizacionBomba> {
    const porBomba: Record<number, TotalizacionBomba> = {};

    for (let numBomba = 1; numBomba <= 10; numBomba++) {
      const txBomba = transacciones.filter(t => t.bomba === numBomba);
      const porProducto: Record<string, { volumen: number; monto: number }> = {};

      txBomba.forEach(t => {
        if (!porProducto[t.combustible]) {
          porProducto[t.combustible] = { volumen: 0, monto: 0 };
        }
        porProducto[t.combustible].volumen += t.volumen;
        porProducto[t.combustible].monto += t.total;
      });

      porBomba[numBomba] = {
        bomba: numBomba,
        volumen: txBomba.reduce((sum, t) => sum + t.volumen, 0),
        monto: txBomba.reduce((sum, t) => sum + t.total, 0),
        transacciones: txBomba.length,
        servicioCompleto: txBomba.filter(t => t.modoServicio === 'FULL').reduce((sum, t) => sum + t.total, 0),
        autoservicio: txBomba.filter(t => t.modoServicio === 'SELF').reduce((sum, t) => sum + t.total, 0),
        porProducto,
      };
    }

    return porBomba;
  }

  /**
   * Genera resumen consolidado del día
   */
  private static generarResumenDia(transacciones: FusionTransaction[]) {
    return {
      porTipoServicio: {
        servicioCompleto: this.totalizarPorTipoServicio(transacciones, 'FULL'),
        autoservicio: this.totalizarPorTipoServicio(transacciones, 'SELF'),
      },
      porBomba: this.totalizarPorBomba(transacciones),
      totales: {
        volumen: transacciones.reduce((sum, t) => sum + t.volumen, 0),
        monto: transacciones.reduce((sum, t) => sum + t.total, 0),
        transacciones: transacciones.length,
      },
    };
  }
}
