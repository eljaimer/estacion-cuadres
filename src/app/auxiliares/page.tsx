'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

export default function AuxiliaresPage() {
  const searchParams = useSearchParams()
  const fecha = searchParams.get('fecha') || new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ⚙️ Módulos Auxiliares
          </h1>
          <p className="text-gray-600">
            Fecha: <strong>{fecha}</strong>
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Módulos Disponibles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cajas Chicas */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                Cajas Chicas
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Gestión de gastos menores, facturas y comprobantes
            </p>
            <div className="text-yellow-600 font-medium text-sm">
              Próximamente
            </div>
          </div>

          {/* Faltantes Empleados */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-orange-100 rounded-lg">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                Faltantes
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Control de faltantes de caja, cuentas por cobrar a empleados
            </p>
            <div className="text-orange-600 font-medium text-sm">
              Próximamente
            </div>
          </div>

          {/* Préstamos Empleados */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-500">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-gray-900">
                Préstamos
              </h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Gestión de préstamos y abonos de empleados
            </p>
            <div className="text-indigo-600 font-medium text-sm">
              Próximamente
            </div>
          </div>
        </div>

        {/* Información */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-2">
            📌 Módulos Auxiliares - MVP
          </h3>
          <p className="text-blue-800">
            Estos módulos serán implementados en la siguiente fase del proyecto.
            Por ahora, el MVP se enfoca en los cuadres principales (Fusion, Estación, Tienda, Depósitos y Consolidado).
          </p>
        </div>
      </main>
    </div>
  )
}
