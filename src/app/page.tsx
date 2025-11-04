import Link from 'next/link'

export default function Home() {
  const fecha = new Date().toLocaleDateString('es-CR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🏪 Estación Vista Hermosa
              </h1>
              <p className="text-gray-600 mt-1">Sistema de Cuadres Automatizado</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Fecha</p>
              <p className="text-lg font-semibold text-gray-900 capitalize">{fecha}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Bienvenido al Sistema de Cuadres
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Digitaliza y automatiza tus cuadres diarios, ahorra tiempo y reduce errores
          </p>
        </div>

        {/* Module Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Módulo 1: Fusion */}
          <Link href="/fusion" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-blue-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 rounded-lg group-hover:bg-blue-500 transition-colors">
                  <svg className="w-8 h-8 text-blue-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Procesar Fusion
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Carga y procesa reportes del sistema Fusion. Totaliza automáticamente por turno.
              </p>
              <div className="flex items-center text-blue-600 group-hover:text-blue-700 font-semibold">
                Abrir módulo
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Módulo 2: Cuadres Estación */}
          <Link href="/cuadres/estacion" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-green-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-green-100 rounded-lg group-hover:bg-green-500 transition-colors">
                  <svg className="w-8 h-8 text-green-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="ml-4 text-xl font-bold text-gray-900 group-hover:text-green-600">
                  Cuadres Estación
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Registra cuadres de estación por turno (4 turnos). Validación automática contra sistema.
              </p>
              <div className="flex items-center text-green-600 group-hover:text-green-700 font-semibold">
                Abrir módulo
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Módulo 3: Cuadres Tienda */}
          <Link href="/cuadres/tienda" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-purple-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 rounded-lg group-hover:bg-purple-500 transition-colors">
                  <svg className="w-8 h-8 text-purple-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-xl font-bold text-gray-900 group-hover:text-purple-600">
                  Cuadres Tienda
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Gestiona cuadres de tienda (2 turnos). Incluye apps de delivery y conceptos especiales.
              </p>
              <div className="flex items-center text-purple-600 group-hover:text-purple-700 font-semibold">
                Abrir módulo
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Módulo 4: Depósitos */}
          <Link href="/depositos" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-yellow-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-yellow-100 rounded-lg group-hover:bg-yellow-500 transition-colors">
                  <svg className="w-8 h-8 text-yellow-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-xl font-bold text-gray-900 group-hover:text-yellow-600">
                  Depósitos
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Control de depósitos bancarios. 4 boletas diarias con agrupación por turnos.
              </p>
              <div className="flex items-center text-yellow-600 group-hover:text-yellow-700 font-semibold">
                Abrir módulo
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Módulo 5: Consolidado */}
          <Link href="/consolidado" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-indigo-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg group-hover:bg-indigo-500 transition-colors">
                  <svg className="w-8 h-8 text-indigo-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-xl font-bold text-gray-900 group-hover:text-indigo-600">
                  Consolidado
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Vista unificada del día. Totales por concepto: Estación, Tienda y Total general.
              </p>
              <div className="flex items-center text-indigo-600 group-hover:text-indigo-700 font-semibold">
                Abrir módulo
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          {/* Módulo 6: Auxiliares */}
          <Link href="/auxiliares" className="group">
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-8 border-2 border-transparent hover:border-gray-500 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-500 transition-colors">
                  <svg className="w-8 h-8 text-gray-600 group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="ml-4 text-xl font-bold text-gray-900 group-hover:text-gray-600">
                  Auxiliares
                </h3>
              </div>
              <p className="text-gray-600 mb-4">
                Cajas chicas, faltantes, préstamos y otros controles complementarios.
              </p>
              <div className="flex items-center text-gray-600 group-hover:text-gray-700 font-semibold">
                Abrir módulo
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">60%</div>
            <p className="text-gray-700">Ahorro de tiempo vs. proceso manual</p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">100%</div>
            <p className="text-gray-700">Datos digitalizados y respaldados</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">0</div>
            <p className="text-gray-700">Errores de transcripción manual</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600">
          <p>Sistema de Cuadres Automatizado • Estación Vista Hermosa</p>
          <p className="text-sm mt-2">MVP v0.1.0 • Droid-assisted</p>
        </div>
      </footer>
    </div>
  )
}
