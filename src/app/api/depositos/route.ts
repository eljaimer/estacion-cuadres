import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fecha, depositos, usuario } = body

    // Guardar cada depósito
    const results = await Promise.all(
      depositos.map((deposito: any) =>
        prisma.depositoBancario.create({
          data: {
            fecha: new Date(fecha),
            numeroBoleta: deposito.numeroBoleta,
            tipo: deposito.tipo,
            turnosIncluidos: deposito.turnosIncluidos,
            montoEfectivo: deposito.montoEfectivo,
            fechaDeposito: new Date(fecha),
            observaciones: deposito.observaciones || null,
            usuario: usuario || 'admin',
          },
        })
      )
    )

    return NextResponse.json({ success: true, depositos: results })
  } catch (error) {
    console.error('Error guardando depósitos:', error)
    return NextResponse.json(
      { error: 'Error al guardar depósitos', details: error instanceof Error ? error.message : 'Unknown error' },
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

    const depositos = await prisma.depositoBancario.findMany({
      where: {
        fecha: new Date(fecha),
      },
      orderBy: {
        tipo: 'asc',
      },
    })

    return NextResponse.json({ depositos })
  } catch (error) {
    console.error('Error obteniendo depósitos:', error)
    return NextResponse.json(
      { error: 'Error al obtener depósitos' },
      { status: 500 }
    )
  }
}
