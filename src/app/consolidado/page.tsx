'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

interface ConceptoConsolidado {
  concepto: string
  estacion: number
  tienda: number
  total: number
}

export default function ConsolidadoPage() {
  const searchParams = useSearchParams()
  const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0]
  
  const [cargando, setCargando] = useState(false)
  const [conceptos, setConceptos] = useState<ConceptoConsolidado[]>([])

  useEffect(() => {
    cargarConsolidado()
  }, [fecha])

  const cargarConsolidado = async () => {
    setCargando(true)
    try {
      const response = await fetch(`/api/consolidado?fecha=${fecha}`)
      if (response.ok) {
        const data = await response.json()
        setConceptos(data.conceptos || [])
      }
    } catch (error) {
      console.error('Error cargando consolidado:', error)
    } finally {
      setCargando(false)
    }
  }

  const totalEstacion = conceptos.reduce((sum, c) => sum + c.estacion, 0)
  const totalTienda = conceptos.reduce((sum, c) => sum + c.tienda, 0)
  const granTotal = conceptos.reduce((sum, c) => sum + c.total, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📊 Consolidado Diario
          </h1>
          <p className="text-gray-600">
            Fecha: <strong>{fecha}</strong>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
            <div className="text-green-600 text-sm font-medium">Total Estación</div>
            <div className="text-3xl font-bold text-green-900">${totalEstacion.toFixed(2)}</div>
          </div>
          <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-4">
            <div className="text-purple-600 text-sm font-medium">Total Tienda</div>
            <div className="text-3xl font-bold text-purple-900">${totalTienda.toFixed(2)}</div>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="text-blue-600 text-sm font-medium">Gran Total</div>
            <div className="text-3xl font-bold text-blue-900">${granTotal.toFixed(2)}</div>
          </div>
        </div>

        {/* Tabla Consolidada */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Detalle por Concepto</h2>
          </div>
          
          {cargando ? (
            <div className="p-8 text-center text-gray-500">
              Cargando consolidado...
            </div>
          ) : conceptos.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-gray-600 font-medium">No hay datos disponibles</p>
              <p className="text-gray-500 text-sm mt-2">
                Completa los cuadres de estación y tienda para ver el consolidado
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Concepto
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Estación
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Tienda
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {conceptos.map((concepto, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {concepto.concepto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        ${concepto.estacion.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 text-right">
                        ${concepto.tienda.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                        ${concepto.total.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-gray-100 font-bold">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      TOTALES
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${totalEstacion.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${totalTienda.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 text-right">
                      ${granTotal.toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={() => window.print()}
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            🖨️ Imprimir
          </button>
          <button
            onClick={cargarConsolidado}
            className="px-6 py-3 border-2 border-blue-500 text-blue-600 rounded-lg hover:bg-blue-50 font-medium"
          >
            🔄 Actualizar
          </button>
        </div>
      </main>
    </div>
  )
}
