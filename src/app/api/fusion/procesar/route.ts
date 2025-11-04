import { NextRequest, NextResponse } from 'next/server'
import { FusionProcessor } from '@/lib/fusion-processor'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json({ error: 'No se proporcionó archivo' }, { status: 400 })
    }

    // Leer contenido del archivo
    const contenidoCSV = await file.text()

    // Procesar con FusionProcessor
    const resultado = await FusionProcessor.procesarArchivo(contenidoCSV)

    // Guardar transacciones en la base de datos
    const transaccionesGuardadas = await prisma.fusionTransaction.createMany({
      data: resultado.transacciones.map(t => ({
        fecha: t.fecha,
        idTurnoFusion: t.idTurnoFusion,
        numeroTurno: t.numeroTurno,
        bomba: t.bomba,
        manguera: t.manguera,
        combustible: t.combustible,
        modoServicio: t.modoServicio,
        volumen: t.volumen,
        total: t.total,
        precioUnitario: t.precioUnitario,
        tipoPago: t.tipoPago,
        hora: t.hora,
        correlativo: t.correlativo,
        estado: t.estado,
      })),
      skipDuplicates: true,
    })

    return NextResponse.json({
      success: true,
      transaccionesGuardadas: transaccionesGuardadas.count,
      fecha: resultado.fecha,
      turnos: resultado.turnos,
      resumenDia: resultado.resumenDia,
    })
  } catch (error) {
    console.error('Error procesando archivo Fusion:', error)
    return NextResponse.json(
      { error: 'Error al procesar el archivo', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
