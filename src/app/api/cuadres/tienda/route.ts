import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fecha, cuadres, usuario } = body

    // Guardar cada cuadre de tienda
    const resultados = await Promise.all(
      Object.entries(cuadres).map(async ([turno, datos]: [string, any]) => {
        const totalManual = 
          Number(datos.depositos) +
          Number(datos.remanente) +
          Number(datos.visanet) +
          Number(datos.credomatic) +
          Number(datos.cheques) +
          Number(datos.cupones) +
          Number(datos.versatec) +
          Number(datos.cajaChica) +
          Number(datos.ventasHugoApp) +
          Number(datos.pedidosYa) +
          Number(datos.uberEats) +
          Number(datos.promociones) +
          Number(datos.faltantes) +
          Number(datos.anticipos)

        const totalSistema = Number(datos.totalSistema) || 0
        const diferencia = totalManual - totalSistema

        return prisma.cuadreTienda.upsert({
          where: {
            fecha_turno: {
              fecha: new Date(fecha),
              turno: turno,
            },
          },
          update: {
            depositos: datos.depositos,
            remanente: datos.remanente,
            visanet: datos.visanet,
            credomatic: datos.credomatic,
            cheques: datos.cheques,
            cupones: datos.cupones,
            versatec: datos.versatec,
            cajaChica: datos.cajaChica,
            ventasHugoApp: datos.ventasHugoApp,
            pedidosYa: datos.pedidosYa,
            uberEats: datos.uberEats,
            promociones: datos.promociones,
            faltantes: datos.faltantes,
            anticipos: datos.anticipos,
            totalManual,
            totalSistema,
            diferencia,
            usuario,
          },
          create: {
            fecha: new Date(fecha),
            turno: turno,
            horarioInicio: turno === 'NOCHE' ? '00:00' : '06:30',
            horarioFin: turno === 'NOCHE' ? '06:30' : '23:59',
            depositos: datos.depositos,
            remanente: datos.remanente,
            visanet: datos.visanet,
            credomatic: datos.credomatic,
            cheques: datos.cheques,
            cupones: datos.cupones,
            versatec: datos.versatec,
            cajaChica: datos.cajaChica,
            ventasHugoApp: datos.ventasHugoApp,
            pedidosYa: datos.pedidosYa,
            uberEats: datos.uberEats,
            promociones: datos.promociones,
            faltantes: datos.faltantes,
            anticipos: datos.anticipos,
            totalManual,
            totalSistema,
            diferencia,
            usuario,
          },
        })
      })
    )

    return NextResponse.json({ success: true, cuadres: resultados })
  } catch (error) {
    console.error('Error guardando cuadres de tienda:', error)
    return NextResponse.json(
      { error: 'Error al guardar cuadres', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get('fecha')

    if (!fecha) {
      return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
    }

    const cuadres = await prisma.cuadreTienda.findMany({
      where: {
        fecha: new Date(fecha),
      },
      orderBy: {
        turno: 'asc',
      },
    })

    return NextResponse.json({ cuadres })
  } catch (error) {
    console.error('Error obteniendo cuadres de tienda:', error)
    return NextResponse.json({ error: 'Error al obtener cuadres' }, { status: 500 })
  }
}
