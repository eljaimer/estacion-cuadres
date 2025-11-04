import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fecha, cuadres, totalesSistema, usuario } = body

    // Guardar cada cuadre
    const resultados = await Promise.all(
      Object.entries(cuadres).map(async ([turno, datos]: [string, any]) => {
        const turnoNum = parseInt(turno)
        const totalManual = Object.values(datos).reduce((sum: number, val: any) => sum + Number(val), 0)
        const totalSistema = totalesSistema[turnoNum] || 0
        const diferencia = totalManual - totalSistema

        return prisma.cuadreEstacion.upsert({
          where: {
            fecha_turno: {
              fecha: new Date(fecha),
              turno: turnoNum,
            },
          },
          update: {
            depositos: datos.depositos,
            remanente: datos.remanente,
            visanet: datos.visanet,
            credomatic: datos.credomatic,
            bacFlota: datos.bacFlota,
            versatec: datos.versatec,
            flotaUno: datos.flotaUno,
            cupones: datos.cupones,
            valesPrepago: datos.valesPrepago,
            valesDiarios: datos.valesDiarios,
            anticipos: datos.anticipos,
            faltantes: datos.faltantes,
            totalManual,
            totalSistema,
            diferencia,
            usuario,
          },
          create: {
            fecha: new Date(fecha),
            turno: turnoNum,
            horarioInicio: getTurnoHorario(turnoNum).inicio,
            horarioFin: getTurnoHorario(turnoNum).fin,
            depositos: datos.depositos,
            remanente: datos.remanente,
            visanet: datos.visanet,
            credomatic: datos.credomatic,
            bacFlota: datos.bacFlota,
            versatec: datos.versatec,
            flotaUno: datos.flotaUno,
            cupones: datos.cupones,
            valesPrepago: datos.valesPrepago,
            valesDiarios: datos.valesDiarios,
            anticipos: datos.anticipos,
            faltantes: datos.faltantes,
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
    console.error('Error guardando cuadres:', error)
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

    const cuadres = await prisma.cuadreEstacion.findMany({
      where: {
        fecha: new Date(fecha),
      },
      orderBy: {
        turno: 'asc',
      },
    })

    return NextResponse.json({ cuadres })
  } catch (error) {
    console.error('Error obteniendo cuadres:', error)
    return NextResponse.json({ error: 'Error al obtener cuadres' }, { status: 500 })
  }
}

function getTurnoHorario(turno: number) {
  const horarios = {
    1: { inicio: '00:00', fin: '05:00' },
    2: { inicio: '05:00', fin: '06:30' },
    3: { inicio: '06:30', fin: '22:00' },
    4: { inicio: '22:00', fin: '00:00' },
  }
  return horarios[turno as keyof typeof horarios] || { inicio: '00:00', fin: '00:00' }
}
