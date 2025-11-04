import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get('fecha')
    const tipo = searchParams.get('tipo') // 'estacion' o 'tienda'

    if (!fecha) {
      return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
    }

    if (tipo === 'estacion') {
      // Obtener totales del sistema Fusion por turno
      const transacciones = await prisma.fusionTransaction.findMany({
        where: {
          fecha: new Date(fecha),
        },
      })

      // Agrupar por turno
      const totalesPorTurno: Record<number, number> = {}
      transacciones.forEach(tx => {
        if (!totalesPorTurno[tx.numeroTurno]) {
          totalesPorTurno[tx.numeroTurno] = 0
        }
        totalesPorTurno[tx.numeroTurno] += Number(tx.total)
      })

      return NextResponse.json({ totales: totalesPorTurno })
    }

    // Para tienda, devolver vacío por ahora (se ingresa manualmente)
    return NextResponse.json({ totales: {} })
  } catch (error) {
    console.error('Error obteniendo totales del sistema:', error)
    return NextResponse.json(
      { error: 'Error al obtener totales', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
