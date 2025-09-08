import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import Search from './Search';
import Settings from './Settings';


export const Sidebar: React.FC = () => {
  {/*
    détecter la taille des px en temps réel
    liste des items - icon: "🏠"
    liste des rendus selon la taille des px 
    parcours liste avec conditions
  */}

  const [isSearch, setIsSearch] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const [displayMode, setDisplayMode] = useState<'pc' | 'compact' | 'phone'>('pc'); // pc fait référence au grand écran, le compact en plus petit et le phone par le téléphone (logique)
  const [isExpanded, setIsExpanded] = useState(true);  // État d'expansion de la sidebar (ouverte/fermée)


  // check taille de l'écran et ajuste la variable
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setDisplayMode('phone');
      } else if (window.innerWidth < 1000) {
        setDisplayMode('compact');
      } else {
        setDisplayMode('pc');
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize); // écoute h24 le redimensionnement
    return () => window.removeEventListener('resize', handleResize); // nettoie le listener
  }, []);

  // Liste des éléments du menu avec leurs propriétés
  const menuItems = [
    { icon: "🏠", label: "Home", link: "/", isNavLink: true },
    { icon: "🔍", label: "Chercher", onClick: () => { setIsSetting(false); setIsSearch(true) }, isActive: isSearch },
    { icon: "🧭", label: "Explorer", link: "/explorer", isNavLink: true },
    { icon: "▶️", label: "Reels" },
    { icon: "📩", label: "Messages", link: "/messages", isNavLink: true },
    { icon: "❤️", label: "Notifications" },
    { icon: "➕", label: "Créer", link: "/upload", isNavLink: true },
    { icon: "👤", label: "Profil", link: "/profile", isNavLink: true },
    { icon: "⚙️", label: "Paramètres", onClick: () => { setIsSearch(false); setIsSetting(true) }, isActive: isSetting }
  ];

  // Classes CSS pour chaque mode d'affichage de la sidebar
  const sidebarClasses = {
    pc: `fixed left-0 top-0 h-screen ${isExpanded ? 'w-[250px]' : 'w-[70px]'} bg-black text-white p-4 border-r border-gray-800 overflow-y-auto`,
    compact: "fixed left-0 top-0 h-screen w-[70px] bg-black text-white p-4 border-r border-gray-800 overflow-y-auto",
    phone: "fixed bottom-0 left-0 w-full h-16 bg-black text-white px-2 py-1 border-t border-gray-800 z-50",
  };

  // Styles pour chaque élément du menu selon le mode d'affichage
  const menuItemStyles = {
    pc: {
      container: isExpanded ? "space-y-4" : "space-y-4",
      item: `flex items-center ${isExpanded ? 'space-x-3' : 'justify-center'} p-2 rounded-lg`,
      showLabel: isExpanded
    },
    compact: {
      container: "space-y-4",
      item: "flex items-center justify-center p-2 rounded-lg",
      showLabel: false
    },
    phone: {
      container: "flex justify-around",
      item: "flex flex-col items-center justify-center p-1 rounded-lg",
      showLabel: false
    }
  };

  // Fonction pour basculer l'expansion de la sidebar (uniquement en mode PC)
  const toggleSidebar = () => {
    if (displayMode === 'pc') {
      setIsExpanded(!isExpanded);
    }
  };

  // Fonction qui génère l'affichage de chaque élément du menu
  const renderMenuItem = (item: {
    icon: string;
    label: string;
    link?: string;
    isNavLink?: boolean;
    onClick?: () => void;
    isActive?: boolean;
  }, index: number) => {
    // Obtenir les styles correspondant au mode d'affichage actuel
    const currentStyle = menuItemStyles[displayMode];

    // Classes CSS pour les états actif et hover
    const activeClasses = "border border-white cursor-pointer";
    const hoverClasses = "hover:border hover:border-white cursor-pointer";

    // Contenu de l'élément (icône + label conditionnel)
    const content = (
      <>
        <span
          role="img"
          aria-label={item.label.toLowerCase()}
          className={`text-xl ${displayMode === 'phone' ? 'text-lg' : ''}`}
        >
          {item.icon}
        </span>
        {currentStyle.showLabel && <span>{item.label}</span>}
      </>
    );

    // les liens de navigation
    if (item.isNavLink) {
      return (
        <li key={index}>
          <NavLink
            to={item.link ?? "/"}
            className={({ isActive }) => `${currentStyle.item} ${isActive ? activeClasses : hoverClasses}`}
          >
            {content}
          </NavLink>
        </li>
      );
    }

    // les éléments normaux du menu
    return (
      <li key={index}>
        <div
          className={`${currentStyle.item} ${item.isActive ? activeClasses : hoverClasses}`}
          onClick={item.onClick}
        >
          {content}
        </div>
      </li>
    );
  };

  return (
    <>
      {/* Sidebar principale */}
      <div className={`transition-all duration-300 ${sidebarClasses[displayMode]}`}>
        {/* Bouton de toggle uniquement visible en mode PC ou compact, mais pas en phone */}
        {displayMode !== 'phone' && (
          <div className="flex justify-end mb-4">
            <button
              className="text-gray-400 hover:text-white focus:outline-none"
              onClick={toggleSidebar}
            >
              {isExpanded ? '←' : '→'}
            </button>
          </div>
        )}

        {/* Liste des éléments du menu avec styles adaptés au mode d'affichage */}
        <ul className={menuItemStyles[displayMode].container}>
          {menuItems.map(renderMenuItem)}
        </ul>
      </div>

      {/* Composants extérieurs à la sidebar (Search et Settings) */}
      <div className={`fixed transition-all duration-300 ${displayMode === 'phone'
          ? 'left-4 bottom-20'
          : displayMode === 'compact'
            ? 'left-[80px] top-4'
            : `left-[${isExpanded ? '260px' : '80px'}] top-4`
        } flex flex-col space-y-4`}>
        {isSearch && <Search setIsSearch={setIsSearch} setIsSetting={setIsSetting} isCompact={false} />}
        {isSetting && <Settings setIsSetting={setIsSetting} setIsSearch={setIsSearch} isCompact={false} />}
      </div>

      {/* Espace supplémentaire en bas pour éviter le chevauchement en mode téléphone */}
      {displayMode === 'phone' && (
        <div className="pb-16"></div> // Padding pour éviter que le contenu ne soit caché par la barre
      )}
    </>
  );
};
