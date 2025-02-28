import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";



const Layout = () => {
  return (
    <div className="flex flex-wrap bg-black min-h-screen text-white">
      <Sidebar />

      {/* Contenu principal dynamique */}
      <div className="flex flex-col flex-grow margin-x-40">
        <Outlet /> 
      </div>
    </div>
  );
};

export default Layout;
