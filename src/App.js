// src/App.js mejorado
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'https://backend-dmd2.onrender.com';  // Para producción


function App() {
  const [alimentos, setAlimentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [nuevoAlimento, setNuevoAlimento] = useState({
    nombre: '',
    descripcion: '',
    calorias: '',
    disponible: true,
    categoria: ''
  });
  const [nuevaCategoria, setNuevaCategoria] = useState({ nombre: '', descripcion: '' });
  const [loading, setLoading] = useState(true);
  const [mensaje, setMensaje] = useState({ texto: '', tipo: '' });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const [alimentosRes, categoriasRes] = await Promise.all([
        axios.get(`${API_URL}/alimentos`),
        axios.get(`${API_URL}/categorias`)
      ]);
      setAlimentos(alimentosRes.data);
      setCategorias(categoriasRes.data);
    } catch (error) {
      console.error("Error al cargar datos:", error);
      mostrarMensaje("Error al cargar los datos", "error");
    } finally {
      setLoading(false);
    }
  };

  const obtenerAlimentos = async () => {
    try {
      const res = await axios.get(`${API_URL}/alimentos`);
      setAlimentos(res.data);
    } catch (error) {
      mostrarMensaje("Error al obtener alimentos", "error");
    }
  };

  const obtenerCategorias = async () => {
    try {
      const res = await axios.get(`${API_URL}/categorias`);
      setCategorias(res.data);
    } catch (error) {
      mostrarMensaje("Error al obtener categorías", "error");
    }
  };

  const agregarAlimento = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/alimentos`, nuevoAlimento);
      setNuevoAlimento({ nombre: '', descripcion: '', calorias: '', disponible: true, categoria: '' });
      obtenerAlimentos();
      mostrarMensaje("Alimento agregado correctamente", "exito");
    } catch (error) {
      mostrarMensaje("Error al agregar alimento", "error");
    }
  };

  const agregarCategoria = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/categorias`, nuevaCategoria);
      setNuevaCategoria({ nombre: '', descripcion: '' });
      obtenerCategorias();
      mostrarMensaje("Categoría agregada correctamente", "exito");
    } catch (error) {
      mostrarMensaje("Error al agregar categoría", "error");
    }
  };

  const mostrarMensaje = (texto, tipo) => {
    setMensaje({ texto, tipo });
    setTimeout(() => setMensaje({ texto: '', tipo: '' }), 3000);
  };

  return (
    <div className="container">
      <h1>Gestión de Alimentos</h1>

      {mensaje.texto && (
        <div className={`mensaje ${mensaje.tipo}`}>
          {mensaje.texto}
        </div>
      )}

      <div className="form-container">
        <form onSubmit={agregarCategoria} className="form">
          <h2>Agregar Categoría</h2>
          <div className="input-group">
            <label htmlFor="cat-nombre">Nombre</label>
            <input 
              id="cat-nombre"
              type="text" 
              placeholder="Nombre de la categoría" 
              value={nuevaCategoria.nombre} 
              onChange={e => setNuevaCategoria({ ...nuevaCategoria, nombre: e.target.value })} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="cat-desc">Descripción</label>
            <input 
              id="cat-desc"
              type="text" 
              placeholder="Descripción de la categoría" 
              value={nuevaCategoria.descripcion} 
              onChange={e => setNuevaCategoria({ ...nuevaCategoria, descripcion: e.target.value })} 
            />
          </div>
          <button type="submit" className="btn-primary">
            <i className="icon-save"></i> Guardar Categoría
          </button>
        </form>

        <form onSubmit={agregarAlimento} className="form">
          <h2>Agregar Alimento</h2>
          <div className="input-group">
            <label htmlFor="alim-nombre">Nombre</label>
            <input 
              id="alim-nombre"
              type="text" 
              placeholder="Nombre del alimento" 
              value={nuevoAlimento.nombre} 
              onChange={e => setNuevoAlimento({ ...nuevoAlimento, nombre: e.target.value })} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="alim-desc">Descripción</label>
            <input 
              id="alim-desc"
              type="text" 
              placeholder="Descripción del alimento" 
              value={nuevoAlimento.descripcion} 
              onChange={e => setNuevoAlimento({ ...nuevoAlimento, descripcion: e.target.value })} 
            />
          </div>
          <div className="input-group">
            <label htmlFor="alim-cal">Calorías</label>
            <input 
              id="alim-cal"
              type="number" 
              placeholder="Calorías del alimento" 
              value={nuevoAlimento.calorias} 
              onChange={e => setNuevoAlimento({ ...nuevoAlimento, calorias: e.target.value })} 
            />
          </div>
          <div className="input-group">
            <label htmlFor="alim-cat">Categoría</label>
            <select 
              id="alim-cat"
              value={nuevoAlimento.categoria} 
              onChange={e => setNuevoAlimento({ ...nuevoAlimento, categoria: e.target.value })} 
              required
            >
              <option value="">Selecciona una categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.nombre}</option>
              ))}
            </select>
          </div>
          <div className="checkbox-group">
            <label>
              <input 
                type="checkbox" 
                checked={nuevoAlimento.disponible} 
                onChange={e => setNuevoAlimento({ ...nuevoAlimento, disponible: e.target.checked })} 
              /> 
              <span>Disponible</span>
            </label>
          </div>
          <button type="submit" className="btn-primary">
            <i className="icon-save"></i> Guardar Alimento
          </button>
        </form>
      </div>

      <div className="table-section">
        <h2>Lista de Alimentos</h2>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : alimentos.length === 0 ? (
          <div className="empty-state">No hay alimentos registrados</div>
        ) : (
          <div className="table-responsive">
            <table>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Descripción</th>
                  <th>Calorías</th>
                  <th>Categoría</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {alimentos.map(alim => (
                  <tr key={alim.id}>
                    <td>{alim.nombre}</td>
                    <td>{alim.descripcion || '-'}</td>
                    <td>{alim.calorias || '-'}</td>
                    <td>{alim.categoria?.nombre || 'Sin categoría'}</td>
                    <td>
                      <span className={`badge ${alim.disponible ? 'disponible' : 'no-disponible'}`}>
                        {alim.disponible ? 'Disponible' : 'No disponible'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;