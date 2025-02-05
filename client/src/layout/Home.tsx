import React from "react";
import { Footer } from "../components/FooterComp";


const Home: React.FC = () => {
  return (
    <div className="text-black">
      <h1 className="text-3xl font-bold">Bienvenue sur Valenstagram 🚀</h1>
      <p>Accédez à vos stories, messages et posts ici.</p>
      
      <Footer />
    </div>
  );
};

export default Home;