'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface Deposito {
  tipo: string
  turnosIncluidos: string
  numeroBoleta: string
  montoEfectivo: number
  observaciones: string
}

const DEPOSITOS_CONFIG = [
  {
    tipo: 'ESTACION_T1T2',
    label: 'Estación - Turnos 1+2',
    turnosIncluidos: 'T1+T2 (00:00-06:30)',
    color: 'blue',
  },
  {
    tipo: 'ESTACION_T3T4',
    label: 'Estación - Turnos 3+4',
    turnosIncluidos: 'T3+T4 (06:30-00:00)',
    color: 'green',
  },
  {
    tipo: 'TIENDA_NOCHE',
    label: 'Tienda - Noche',
    turnosIncluidos: 'Noche (00:00-06:30)',
    color: 'purple',
  },
  {
    tipo: 'TIENDA_DIA',
    label: 'Tienda - Día',
    turnosIncluidos: 'Día (06:30-23:59)',
    color: 'yellow',
  },
]

export default function DepositosPage() {
  const searchParams = useSearchParams()
  const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0]
  
  const [depositos, setDepositos] = useState<Record<string, Deposito>>(
    Object.fromEntries(
      DEPOSITOS_CONFIG.map(config => [
        config.tipo,
        {
          tipo: config.tipo,
          turnosIncluidos: config.turnosIncluidos,
          numeroBoleta: '',
          montoEfectivo: 0,
          observaciones: '',
        },
      ])
    )
  )
  const [cargando, setCargando] = useState(false)

  const handleInputChange = (tipo: string, campo: string, valor: string | number) => {
    setDepositos(prev => ({
      ...prev,
      [tipo]: {
        ...prev[tipo],
        [campo]: campo === 'montoEfectivo' ? (parseFloat(valor as string) || 0) : valor,
      },
    }))
  }

  const calcularTotalEstacion = () => {
    return (depositos['ESTACION_T1T2']?.montoEfectivo || 0) +
           (depositos['ESTACION_T3T4']?.montoEfectivo || 0)
  }

  const calcularTotalTienda = () => {
    return (depositos['TIENDA_NOCHE']?.montoEfectivo || 0) +
           (depositos['TIENDA_DIA']?.montoEfectivo || 0)
  }

  const calcularTotalGeneral = () => {
    return calcularTotalEstacion() + calcularTotalTienda()
  }

  const handleGuardar = async () => {
    setCargando(true)
    try {
      const response = await fetch('/api/depositos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fecha,
          depositos: Object.values(depositos),
          usuario: 'admin',
        }),
      })

      if (response.ok) {
        alert('✓ Depósitos guardados exitosamente')
      } else {
        throw new Error('Error al guardar')
      }
    } catch (error) {
      alert('Error al guardar los depósitos')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🏦 Control de Depósitos Bancarios
          </h1>
          <p className="text-gray-600">
            Fecha: <strong>{fecha}</strong>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Formularios de Depósitos */}
          <div className="lg:col-span-2 space-y-6">
            {DEPOSITOS_CONFIG.map((config) => (
              <div
                key={config.tipo}
                className={`bg-white rounded-lg shadow-md p-6 border-l-4 border-${config.color}-500`}
              >
                <h2 className="text-lg font-semibold mb-4 text-gray-900">
                  {config.label}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {config.turnosIncluidos}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Número de Boleta
                    </label>
                    <input
                      type="text"
                      value={depositos[config.tipo]?.numeroBoleta || ''}
                      onChange={(e) =>
                        handleInputChange(config.tipo, 'numeroBoleta', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Ej: 001234"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Monto Efectivo
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={depositos[config.tipo]?.montoEfectivo || ''}
                      onChange={(e) =>
                        handleInputChange(config.tipo, 'montoEfectivo', e.target.value)
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Observaciones
                  </label>
                  <textarea
                    value={depositos[config.tipo]?.observaciones || ''}
                    onChange={(e) =>
                      handleInputChange(config.tipo, 'observaciones', e.target.value)
                    }
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Notas adicionales (opcional)"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Panel de Totales */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-6">Resumen de Depósitos</h2>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Total Estación</div>
                  <div className="text-2xl font-bold text-blue-600">
                    ${calcularTotalEstacion().toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    T1+T2 + T3+T4
                  </div>
                </div>

                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-sm text-gray-600 mb-1">Total Tienda</div>
                  <div className="text-2xl font-bold text-purple-600">
                    ${calcularTotalTienda().toFixed(2)}
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Noche + Día
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="text-sm text-gray-600 mb-1">Total General</div>
                  <div className="text-3xl font-bold text-green-600">
                    ${calcularTotalGeneral().toFixed(2)}
                  </div>
                </div>
              </div>

              <button
                onClick={handleGuardar}
                disabled={cargando}
                className="w-full mt-6 bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-colors"
              >
                {cargando ? 'Guardando...' : 'Guardar Depósitos'}
              </button>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>💡 Recordatorio:</strong> Verifica que los montos coincidan con los depósitos efectivos realizados.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
