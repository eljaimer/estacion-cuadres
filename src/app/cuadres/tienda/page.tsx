'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface CuadreData {
  depositos: number
  remanente: number
  visanet: number
  credomatic: number
  cheques: number
  cupones: number
  versatec: number
  cajaChica: number
  ventasHugoApp: number
  pedidosYa: number
  uberEats: number
  promociones: number
  faltantes: number
  anticipos: number
  totalSistema: number
}

const TURNOS = [
  { id: 'NOCHE', nombre: 'Turno Noche', horario: '00:00 - 06:30' },
  { id: 'DIA', nombre: 'Turno Día', horario: '06:30 - 23:59' },
]

const CONCEPTOS = [
  { key: 'depositos', label: 'Depósitos' },
  { key: 'remanente', label: 'Remanente' },
  { key: 'visanet', label: 'Visanet' },
  { key: 'credomatic', label: 'Credomatic' },
  { key: 'cheques', label: 'Cheques' },
  { key: 'cupones', label: 'Cupones' },
  { key: 'versatec', label: 'Versatec' },
  { key: 'cajaChica', label: 'Caja Chica' },
  { key: 'ventasHugoApp', label: 'Ventas Hugo App' },
  { key: 'pedidosYa', label: 'Pedidos Ya' },
  { key: 'uberEats', label: 'Uber Eats' },
  { key: 'promociones', label: 'Promociones' },
  { key: 'faltantes', label: 'Faltantes' },
  { key: 'anticipos', label: 'Anticipos' },
]

export default function CuadresTiendaPage() {
  const searchParams = useSearchParams()
  const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0]
  
  const [turnoActivo, setTurnoActivo] = useState('NOCHE')
  const [cuadres, setCuadres] = useState<Record<string, CuadreData>>({})
  const [cargando, setCargando] = useState(false)

  const handleInputChange = (turno: string, concepto: string, valor: string) => {
    const valorNumerico = parseFloat(valor) || 0
    setCuadres(prev => ({
      ...prev,
      [turno]: {
        ...(prev[turno] || {
          depositos: 0,
          remanente: 0,
          visanet: 0,
          credomatic: 0,
          cheques: 0,
          cupones: 0,
          versatec: 0,
          cajaChica: 0,
          ventasHugoApp: 0,
          pedidosYa: 0,
          uberEats: 0,
          promociones: 0,
          faltantes: 0,
          anticipos: 0,
          totalSistema: 0,
        }),
        [concepto]: valorNumerico,
      },
    }))
  }

  const calcularTotalManual = (turno: string): number => {
    const cuadre = cuadres[turno]
    if (!cuadre) return 0
    return CONCEPTOS.reduce((sum, c) => sum + (cuadre[c.key as keyof CuadreData] || 0), 0)
  }

  const calcularDiferencia = (turno: string): number => {
    const totalManual = calcularTotalManual(turno)
    const totalSistema = cuadres[turno]?.totalSistema || 0
    return totalManual - totalSistema
  }

  const handleGuardar = async () => {
    setCargando(true)
    try {
      const response = await fetch('/api/cuadres/tienda', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha,
          cuadres,
          usuario: 'admin',
        }),
      })

      if (response.ok) {
        alert('✓ Cuadres de tienda guardados exitosamente')
      } else {
        throw new Error('Error al guardar')
      }
    } catch (error) {
      alert('Error al guardar los cuadres')
    } finally {
      setCargando(false)
    }
  }

  const cuadreActual = cuadres[turnoActivo] || {
    depositos: 0,
    remanente: 0,
    visanet: 0,
    credomatic: 0,
    cheques: 0,
    cupones: 0,
    versatec: 0,
    cajaChica: 0,
    ventasHugoApp: 0,
    pedidosYa: 0,
    uberEats: 0,
    promociones: 0,
    faltantes: 0,
    anticipos: 0,
    totalSistema: 0,
  }

  const totalManual = calcularTotalManual(turnoActivo)
  const totalSistema = cuadreActual.totalSistema
  const diferencia = calcularDiferencia(turnoActivo)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏪 Cuadres de Tienda
          </h1>
          <p className="text-gray-600">
            Fecha: <strong>{fecha}</strong>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Tabs de Turnos */}
        <div className="bg-white rounded-lg shadow-md mb-6">
          <div className="flex border-b border-gray-200">
            {TURNOS.map((turno) => (
              <button
                key={turno.id}
                onClick={() => setTurnoActivo(turno.id)}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  turnoActivo === turno.id
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div>{turno.nombre}</div>
                <div className="text-sm font-normal mt-1">{turno.horario}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Conceptos de Entrada</h2>
              
              {/* Total Sistema Manual */}
              <div className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Total del Sistema (manual)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={cuadreActual.totalSistema || ''}
                  onChange={(e) =>
                    handleInputChange(turnoActivo, 'totalSistema', e.target.value)
                  }
                  className="w-full px-4 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-bold text-lg"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {CONCEPTOS.map((concepto) => (
                  <div key={concepto.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {concepto.label}
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={cuadreActual[concepto.key as keyof CuadreData] || ''}
                      onChange={(e) =>
                        handleInputChange(turnoActivo, concepto.key, e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Totales */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Totales</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Total Manual</div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${totalManual.toFixed(2)}
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Total Sistema</div>
                  <div className="text-2xl font-bold text-green-600">
                    ${totalSistema.toFixed(2)}
                  </div>
                </div>

                <div
                  className={`p-4 rounded-lg ${
                    Math.abs(diferencia) < 0.01
                      ? 'bg-green-100'
                      : diferencia > 0
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                  }`}
                >
                  <div className="text-sm text-gray-600 mb-1">Diferencia</div>
                  <div
                    className={`text-2xl font-bold ${
                      Math.abs(diferencia) < 0.01
                        ? 'text-green-600'
                        : diferencia > 0
                        ? 'text-yellow-600'
                        : 'text-red-600'
                    }`}
                  >
                    ${diferencia.toFixed(2)}
                  </div>
                  {Math.abs(diferencia) < 0.01 && (
                    <div className="text-sm text-green-600 mt-2">✓ Cuadrado</div>
                  )}
                </div>
              </div>

              <button
                onClick={handleGuardar}
                disabled={cargando}
                className="w-full mt-6 bg-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-purple-700 disabled:bg-gray-400 transition-colors"
              >
                {cargando ? 'Guardando...' : 'Guardar Cuadres'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
