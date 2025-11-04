'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function FusionPage() {
  const [archivo, setArchivo] = useState<File | null>(null)
  const [cargando, setCargando] = useState(false)
  const [resultado, setResultado] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setArchivo(e.target.files[0])
      setError(null)
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setArchivo(e.dataTransfer.files[0])
      setError(null)
    }
  }

  const handleProcesar = async () => {
    if (!archivo) {
      setError('Por favor selecciona un archivo CSV')
      return
    }

    setCargando(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', archivo)

      const response = await fetch('/api/fusion/procesar', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al procesar el archivo')
      }

      const data = await response.json()
      setResultado(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
            ← Volver al inicio
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📁 Procesar Fusion
          </h1>
          <p className="text-gray-600">
            Carga el archivo CSV del sistema Fusion para procesarlo automáticamente
          </p>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Upload Section */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-xl font-semibold mb-6">Subir Archivo CSV</h2>

            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={(e) => e.preventDefault()}
              className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-blue-500 transition-colors cursor-pointer"
            >
              <input
                type="file"
                accept=".csv"
                onChange={handleArchivoChange}
                className="hidden"
                id="file-input"
              />
              <label htmlFor="file-input" className="cursor-pointer">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="mt-4 text-sm text-gray-600">
                  <span className="font-semibold text-blue-600">
                    Haz clic para seleccionar
                  </span>{' '}
                  o arrastra el archivo aquí
                </p>
                <p className="mt-2 text-xs text-gray-500">
                  Solo archivos CSV del sistema Fusion
                </p>
              </label>
            </div>

            {/* Selected File */}
            {archivo && (
              <div className="mt-4 p-4 bg-blue-50 rounded-lg flex items-center justify-between">
                <div className="flex items-center">
                  <svg
                    className="w-6 h-6 text-blue-600 mr-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <div>
                    <p className="font-medium text-gray-900">{archivo.name}</p>
                    <p className="text-sm text-gray-600">
                      {(archivo.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setArchivo(null)}
                  className="text-red-600 hover:text-red-800"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-800">{error}</p>
              </div>
            )}

            {/* Process Button */}
            <button
              onClick={handleProcesar}
              disabled={!archivo || cargando}
              className="mt-6 w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {cargando ? 'Procesando...' : 'Procesar Archivo'}
            </button>
          </div>

          {/* Results */}
          {resultado && (
            <div className="mt-8 bg-white rounded-lg shadow-md p-8">
              <h2 className="text-xl font-semibold mb-6 text-green-600">
                ✓ Archivo Procesado Exitosamente
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Transacciones</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {resultado.transaccionesGuardadas}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600">Turnos</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {resultado.turnos?.length || 0}
                    </p>
                  </div>
                </div>

                {resultado.turnos && (
                  <div className="mt-6">
                    <h3 className="font-semibold mb-4">Totales por Turno:</h3>
                    <div className="space-y-2">
                      {resultado.turnos.map((turno: any) => (
                        <div
                          key={turno.numeroTurno}
                          className="flex justify-between items-center p-3 bg-blue-50 rounded"
                        >
                          <span className="font-medium">
                            Turno {turno.numeroTurno} (ID Fusion: {turno.idFusion})
                          </span>
                          <span className="font-bold text-blue-600">
                            ${turno.totales.monto.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex gap-4">
                  <Link
                    href="/cuadres/estacion"
                    className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 text-center"
                  >
                    Ir a Cuadres Estación
                  </Link>
                  <button
                    onClick={() => {
                      setArchivo(null)
                      setResultado(null)
                    }}
                    className="flex-1 bg-gray-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-700"
                  >
                    Procesar Otro Archivo
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
