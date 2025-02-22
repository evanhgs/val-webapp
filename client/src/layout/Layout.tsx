import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

const Layout = () => {
  return (
    <div className="flex bg-black min-h-screen text-white">
      <Sidebar />

      {/* Contenu principal dynamique */}
      <div className="flex flex-col flex-grow">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout;
