'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface CuadreData {
  depositos: number
  remanente: number
  visanet: number
  credomatic: number
  bacFlota: number
  versatec: number
  flotaUno: number
  cupones: number
  valesPrepago: number
  valesDiarios: number
  anticipos: number
  faltantes: number
}

const TURNOS = [
  { numero: 1, nombre: 'Turno 1 - Madrugada', horario: '00:00 - 05:00' },
  { numero: 2, nombre: 'Turno 2 - Mañana', horario: '05:00 - 06:30' },
  { numero: 3, nombre: 'Turno 3 - Día', horario: '06:30 - 22:00' },
  { numero: 4, nombre: 'Turno 4 - Noche', horario: '22:00 - 00:00' },
]

const CONCEPTOS = [
  { key: 'depositos', label: 'Depósitos' },
  { key: 'remanente', label: 'Remanente' },
  { key: 'visanet', label: 'Visanet' },
  { key: 'credomatic', label: 'Credomatic' },
  { key: 'bacFlota', label: 'BAC Flota' },
  { key: 'versatec', label: 'Versatec' },
  { key: 'flotaUno', label: 'Flota Uno' },
  { key: 'cupones', label: 'Cupones' },
  { key: 'valesPrepago', label: 'Vales Prepago' },
  { key: 'valesDiarios', label: 'Vales Diarios' },
  { key: 'anticipos', label: 'Anticipos' },
  { key: 'faltantes', label: 'Faltantes' },
]

export default function CuadresEstacionPage() {
  const searchParams = useSearchParams()
  const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0]
  
  const [turnoActivo, setTurnoActivo] = useState(1)
  const [cuadres, setCuadres] = useState<Record<number, CuadreData>>({})
  const [totalesSistema, setTotalesSistema] = useState<Record<number, number>>({})
  const [cargando, setCargando] = useState(false)

  useEffect(() => {
    cargarTotalesSistema()
  }, [fecha])

  const cargarTotalesSistema = async () => {
    try {
      const response = await fetch(`/api/cuadres/sistema-total?fecha=${fecha}&tipo=estacion`)
      if (response.ok) {
        const data = await response.json()
        setTotalesSistema(data.totales || {})
      }
    } catch (error) {
      console.error('Error cargando totales:', error)
    }
  }

  const handleInputChange = (turno: number, concepto: string, valor: string) => {
    const valorNumerico = parseFloat(valor) || 0
    setCuadres(prev => ({
      ...prev,
      [turno]: {
        ...(prev[turno] || {
          depositos: 0,
          remanente: 0,
          visanet: 0,
          credomatic: 0,
          bacFlota: 0,
          versatec: 0,
          flotaUno: 0,
          cupones: 0,
          valesPrepago: 0,
          valesDiarios: 0,
          anticipos: 0,
          faltantes: 0,
        }),
        [concepto]: valorNumerico,
      },
    }))
  }

  const calcularTotalManual = (turno: number): number => {
    const cuadre = cuadres[turno]
    if (!cuadre) return 0
    return Object.values(cuadre).reduce((sum, val) => sum + val, 0)
  }

  const calcularDiferencia = (turno: number): number => {
    const totalManual = calcularTotalManual(turno)
    const totalSistema = totalesSistema[turno] || 0
    return totalManual - totalSistema
  }

  const handleGuardar = async () => {
    setCargando(true)
    try {
      const response = await fetch('/api/cuadres/estacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha,
          cuadres,
          totalesSistema,
          usuario: 'admin',
        }),
      })

      if (response.ok) {
        alert('✓ Cuadres guardados exitosamente')
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
    bacFlota: 0,
    versatec: 0,
    flotaUno: 0,
    cupones: 0,
    valesPrepago: 0,
    valesDiarios: 0,
    anticipos: 0,
    faltantes: 0,
  }

  const totalManual = calcularTotalManual(turnoActivo)
  const totalSistema = totalesSistema[turnoActivo] || 0
  const diferencia = calcularDiferencia(turnoActivo)

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⛽ Cuadres de Estación
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
                key={turno.numero}
                onClick={() => setTurnoActivo(turno.numero)}
                className={`flex-1 py-4 px-6 font-semibold transition-colors ${
                  turnoActivo === turno.numero
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div>{turno.nombre}</div>
                <div className="text-sm font-normal mt-1">{turno.horario}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Formulario del Turno Activo */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formulario de Conceptos */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Conceptos de Entrada</h2>
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
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panel de Totales */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Totales</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Total Manual</div>
                  <div className="text-2xl font-bold text-blue-600">
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
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
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
