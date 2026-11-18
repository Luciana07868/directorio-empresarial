import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';

// VISTA 1: El Directorio Principal (Ruta "/")
function Directorio({ empleados }) {
  const [busqueda, setBusqueda] = useState('');

  const filtrados = empleados.filter((emp) =>
    emp.name.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <input
        type="text"
        placeholder="Filtrar por nombre..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
        className="mb-6 px-4 py-2 border rounded-lg w-full md:w-80 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtrados.map((emp) => (
          <div key={emp.id} className="bg-white p-6 rounded-xl shadow border border-gray-200 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-blue-600 uppercase">{emp.company.name}</span>
              <h3 className="font-bold text-gray-800 text-lg mt-1">{emp.name}</h3>
              <p className="text-gray-500 text-sm mb-4">{emp.email}</p>
            </div>
            {/* Link de React Router: cambia la URL sin recargar el navegador */}
            <Link
              to={`/empleado/${emp.id}`}
              className="text-center bg-slate-800 hover:bg-slate-700 text-white text-sm py-2 px-4 rounded transition"
            >
              Ver perfil completo →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// VISTA 2: Perfil Detallado (Ruta "/empleado/:id")
function PerfilEmpleado({ empleados }) {
  const { id } = useParams(); // Lee el número de la URL
  const empleado = empleados.find((e) => e.id === Number(id));

  if (!empleado) return <p className="p-8 text-gray-500">Cargando perfil...</p>;

  return (
    <div className="p-8 max-w-xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
        <Link to="/" className="text-sm text-blue-600 hover:underline">← Volver al directorio</Link>
        <h2 className="text-2xl font-bold text-gray-800 mt-4">{empleado.name}</h2>
        <p className="text-gray-500 mb-4">@{empleado.username}</p>
        <div className="space-y-2 text-sm text-gray-700 border-t pt-4">
          <p><strong>Correo:</strong> {empleado.email}</p>
          <p><strong>Teléfono:</strong> {empleado.phone}</p>
          <p><strong>Sitio web:</strong> {empleado.website}</p>
          <p><strong>Empresa:</strong> {empleado.company.name} — <em>"{empleado.company.catchPhrase}"</em></p>
          <p><strong>Ciudad:</strong> {empleado.address.city}</p>
        </div>
      </div>
    </div>
  );
}

// COMPONENTE RAÍZ CON EL ENRUTADOR
export default function App() {
  const [empleados, setEmpleados] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((res) => res.json())
      .then((data) => setEmpleados(data));
  }, []);

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-slate-900 text-white px-8 py-4 shadow">
          <Link to="/" className="text-lg font-bold tracking-wide">Portal Corporativo SPA</Link>
        </nav>

        <Routes>
          <Route path="/" element={<Directorio empleados={empleados} />} />
          <Route path="/empleado/:id" element={<PerfilEmpleado empleados={empleados} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}