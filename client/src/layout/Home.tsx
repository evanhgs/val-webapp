//import React from "react";
import { Footer } from "../components/FooterComp";
import { Sidebar } from "../components/Sidebar";
import { Header } from "../components/Header";
import { Stories } from "../components/Stories";
import { Feed } from "../components/Feed";
import { Suggestions } from "../components/Suggestions";


const Home = () => {
  return (
    <div className="flex bg-black min-h-screen text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-grow ml-[250px]">
        <Header />
        <div className="mt-16 p-4 flex justify-center">
          <div className="max-w-[900px] w-full flex">
            <div className="flex-grow">
              <Stories />
              <Feed />
            </div>
            <div className="w-[300px] hidden lg:block">
              <Suggestions />
              <Footer />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;