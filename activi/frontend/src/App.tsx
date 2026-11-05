import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ActividadesPage from './pages/ActividadesPage';
import HistorialPage from './pages/HistorialPage';
import EvidenciasPage from './pages/EvidenciasPage';
import HerramientasPage from './pages/HerramientasPage';
import ResponsablesPage from './pages/ResponsablesPage';
import ServiciosPage from './pages/ServiciosPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/actividades" replace />} />
          <Route path="actividades" element={<ActividadesPage />} />
          <Route path="historial" element={<HistorialPage />} />
          <Route path="evidencias" element={<EvidenciasPage />} />
          <Route path="herramientas" element={<HerramientasPage />} />
          <Route path="responsables" element={<ResponsablesPage />} />
          <Route path="servicios" element={<ServiciosPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
