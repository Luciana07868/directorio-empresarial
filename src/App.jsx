import { useEffect, useState } from 'react'

const EMPLEADOS_STORAGE = 'portal-corporativo-empleados'

function TarjetaEmpleado({ empleado }) {
  const nombre = `${empleado.name.first} ${empleado.name.last}`

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-4 p-5">
        <img
          src={empleado.picture.large}
          alt={nombre}
          className="h-20 w-20 rounded-full object-cover ring-4 ring-slate-100"
        />
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-slate-900">{nombre}</h2>
          <p className="mt-1 text-sm font-medium text-indigo-600">
            {empleado.location.country}
          </p>
          <p className="mt-1 text-sm text-slate-500">ID {empleado.login.uuid.slice(0, 8)}</p>
        </div>
      </div>

      <div className="border-t border-slate-100 px-5 py-4 text-sm">
        <a
          href={`mailto:${empleado.email}`}
          className="block truncate text-slate-600 transition hover:text-indigo-600"
        >
          {empleado.email}
        </a>
        <p className="mt-2 text-slate-500">Tel. {empleado.phone}</p>
      </div>
    </article>
  )
}

function App() {
  const [empleados, setEmpleados] = useState([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const empleadosGuardados = localStorage.getItem(EMPLEADOS_STORAGE)

    if (empleadosGuardados) {
      setEmpleados(JSON.parse(empleadosGuardados))
      setCargando(false)
      return
    }

    const controlador = new AbortController()

    async function cargarEmpleados() {
      try {
        setCargando(true)
        setError('')

        const respuesta = await fetch('https://randomuser.me/api/?results=12&seed=corporativo', {
          signal: controlador.signal,
        })

        if (!respuesta.ok) {
          throw new Error('No se pudo obtener el directorio')
        }

        const datos = await respuesta.json()
        setEmpleados(datos.results)
        localStorage.setItem(EMPLEADOS_STORAGE, JSON.stringify(datos.results))
      } catch (errorDeCarga) {
        if (errorDeCarga.name !== 'AbortError') {
          setError('No fue posible cargar los empleados.')
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false)
        }
      }
    }

    cargarEmpleados()
    return () => controlador.abort()
  }, [])

  const empleadosFiltrados = empleados.filter((empleado) => {
    const nombreCompleto = `${empleado.name.first} ${empleado.name.last}`.toLowerCase()
    return nombreCompleto.includes(busqueda.toLowerCase())
  })

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              DC
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Portal corporativo
              </p>
              <h1 className="text-xl font-bold">Directorio de empleados</h1>
            </div>
          </div>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-semibold text-emerald-700">
            En línea
          </span>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Equipo de la organización</p>
            <h2 className="mt-1 text-3xl font-bold">Directorio interno</h2>
          </div>

          <label className="block w-full sm:w-80">
            <span className="sr-only">Buscar empleado</span>
            <input
              type="search"
              value={busqueda}
              onChange={(evento) => setBusqueda(evento.target.value)}
              placeholder="Buscar por nombre..."
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
            />
          </label>
        </div>

        {cargando && (
          <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
            Cargando empleados...
          </p>
        )}

        {error && (
          <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-center font-medium text-red-700">
            {error}
          </p>
        )}

        {!cargando && !error && (
          <>
            <p className="mb-4 text-sm text-slate-500">
              {empleadosFiltrados.length} empleado{empleadosFiltrados.length !== 1 ? 's' : ''}
            </p>

            {empleadosFiltrados.length > 0 ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {empleadosFiltrados.map((empleado) => (
                  <TarjetaEmpleado key={empleado.login.uuid} empleado={empleado} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
                No se encontraron empleados.
              </p>
            )}
          </>
        )}
      </section>
    </main>
  )
}

export default App
