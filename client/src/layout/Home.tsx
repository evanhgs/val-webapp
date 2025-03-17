import { Footer } from "../components/FooterComp";
import { Header } from "../components/Header";
import { Stories } from "../components/Stories";
import { Feed } from "../components/Feed";
import { Suggestions } from "../components/Suggestions";
import { Logout } from "../components/Logout"; 
import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../components/AuthContext";
import config from "../config";

interface UserProfile {
  username: string;
  profile_picture: string;
}

const Home = () => {
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext) || {};
  const token = user?.token;
  const [userData, setUserData] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!token) {
          setError("Vous devez être connecté pour voir votre profil.");
          navigate("/login");
          return;
        }

        const response = await axios.post(
          `${config.serverUrl}/user/profile`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData({
          username: response.data.username,
          profile_picture: response.data.profile_picture || "default.jpg",
        });
      } catch (error) {
        console.error("Erreur lors de la récupération du compte: ", error);
        setError("Impossible de récupérer les infos du compte.");
      }
    };
    fetchProfile();
  }, [token, navigate]);

  return (
    <div className="flex flex-col flex-grow ml-[250px]">
      <div className="mt-16 p-4 flex justify-center">
        <div className="max-w-[900px] w-full flex">
          <Header />
          <div className="flex-grow">
            <div className="mb-8">
              <Stories username={userData?.username} profile_picture={userData?.profile_picture}/> 
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