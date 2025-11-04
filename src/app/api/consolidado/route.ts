import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const fecha = searchParams.get('fecha')

    if (!fecha) {
      return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
    }

    const fechaDate = new Date(fecha)

    // Obtener cuadres de estación
    const cuadresEstacion = await prisma.cuadreEstacion.findMany({
      where: { fecha: fechaDate },
    })

    // Obtener cuadres de tienda
    const cuadresTienda = await prisma.cuadreTienda.findMany({
      where: { fecha: fechaDate },
    })

    // Consolidar por concepto
    const conceptos: Record<string, { estacion: number; tienda: number }> = {}

    // Procesar estación
    cuadresEstacion.forEach((cuadre) => {
      const campos = [
        { nombre: 'Depósitos', valor: Number(cuadre.depositos) },
        { nombre: 'Remanente', valor: Number(cuadre.remanente) },
        { nombre: 'Visanet', valor: Number(cuadre.visanet) },
        { nombre: 'Credomatic', valor: Number(cuadre.credomatic) },
        { nombre: 'BAC Flota', valor: Number(cuadre.bacFlota) },
        { nombre: 'Versatec', valor: Number(cuadre.versatec) },
        { nombre: 'Flota Uno', valor: Number(cuadre.flotaUno) },
        { nombre: 'Cupones', valor: Number(cuadre.cupones) },
        { nombre: 'Vales Prepago', valor: Number(cuadre.valesPrepago) },
        { nombre: 'Vales Diarios', valor: Number(cuadre.valesDiarios) },
        { nombre: 'Anticipos', valor: Number(cuadre.anticipos) },
        { nombre: 'Faltantes', valor: Number(cuadre.faltantes) },
      ]

      campos.forEach(({ nombre, valor }) => {
        if (!conceptos[nombre]) {
          conceptos[nombre] = { estacion: 0, tienda: 0 }
        }
        conceptos[nombre].estacion += valor
      })
    })

    // Procesar tienda
    cuadresTienda.forEach((cuadre) => {
      const campos = [
        { nombre: 'Depósitos', valor: Number(cuadre.depositos) },
        { nombre: 'Remanente', valor: Number(cuadre.remanente) },
        { nombre: 'Visanet', valor: Number(cuadre.visanet) },
        { nombre: 'Credomatic', valor: Number(cuadre.credomatic) },
        { nombre: 'Cheques', valor: Number(cuadre.cheques) },
        { nombre: 'Cupones', valor: Number(cuadre.cupones) },
        { nombre: 'Versatec', valor: Number(cuadre.versatec) },
        { nombre: 'Caja Chica', valor: Number(cuadre.cajaChica) },
        { nombre: 'Ventas Hugo App', valor: Number(cuadre.ventasHugoApp) },
        { nombre: 'Pedidos Ya', valor: Number(cuadre.pedidosYa) },
        { nombre: 'Uber Eats', valor: Number(cuadre.uberEats) },
        { nombre: 'Promociones', valor: Number(cuadre.promociones) },
        { nombre: 'Faltantes', valor: Number(cuadre.faltantes) },
        { nombre: 'Anticipos', valor: Number(cuadre.anticipos) },
      ]

      campos.forEach(({ nombre, valor }) => {
        if (!conceptos[nombre]) {
          conceptos[nombre] = { estacion: 0, tienda: 0 }
        }
        conceptos[nombre].tienda += valor
      })
    })

    // Convertir a array
    const conceptosArray = Object.entries(conceptos).map(([concepto, valores]) => ({
      concepto,
      estacion: valores.estacion,
      tienda: valores.tienda,
      total: valores.estacion + valores.tienda,
    }))

    return NextResponse.json({ conceptos: conceptosArray })
  } catch (error) {
    console.error('Error generando consolidado:', error)
    return NextResponse.json(
      { error: 'Error al generar consolidado', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
