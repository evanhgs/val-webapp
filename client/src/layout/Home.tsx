import { Footer } from "../components/FooterComp";
import { Header } from "../components/Header";
import { Stories } from "../components/Stories";
import { Feed } from "../components/Feed";
import { Suggestions } from "../components/Suggestions";
import { Logout } from "../components/Logout"; 


const Home = () => {
  return (
    <div className="flex flex-col flex-grow ml-[250px]">
      <Header />
      <div className="mt-16 p-4 flex justify-center">
        <div className="max-w-[900px] w-full flex">
          <div className="flex-grow">
            <div className="mb-8">
              <Stories /> 
            </div>
            <Feed />
          </div>
          <div className="w-[300px] hidden lg:block">
            <Suggestions />
            <Footer />
            <Logout />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;