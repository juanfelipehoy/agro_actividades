import { Outlet } from 'react-router-dom';
import BarraLateral from '../components/BarraLateral';

const MainLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f8faf8]">
      <BarraLateral />
      <main className="flex-1 overflow-hidden">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
