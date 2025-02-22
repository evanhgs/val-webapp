import { Header } from "../components/Header";

const Profile = () => {
  return (
    <div>
      <Header />
      <div className="mt-16 p-4 text-center">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <p className="mt-4">Ici s'affichera le profil de l'utilisateur.</p>
      </div>
    </div>
  );
};

export default Profile;
