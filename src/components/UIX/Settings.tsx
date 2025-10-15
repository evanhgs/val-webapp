import React, {useEffect, useState} from 'react';
import {Logout} from "./Logout.tsx";
import UseOutsideClickDetector from './OutsideClickDetector.tsx'
import {SearchProps} from '../../types/SearchProps.ts';
import {AxiosInstance, Config, REACT_APP_GIT_VERSION} from "../../config/config.ts";


const Settings: React.FC<SearchProps> = ({ setIsSetting, isCompact }) => {

  const settingContainerRef = UseOutsideClickDetector(() => {
    setIsSetting(false);
  });

  const [apiVersion, setApiVersion] = useState<string>('');


  useEffect(() => {
      const fetchApiVersion = async () => {
          const resp = await AxiosInstance.get(Config.version.getVersion());
          setApiVersion(resp.data.version);
      };
      fetchApiVersion()
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 z-40">
      <div className={`search-container fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-50`}
        ref={settingContainerRef}>
        <div className={`bg-gray-800 p-4 rounded-lg shadow-lg ${isCompact ? 'w-[250px]' : 'w-[350px]'}`}>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Paramètres</h3>
            <button
              onClick={() => setIsSetting(false)}
              className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
            <div className="mb-4 px-3 py-2 bg-gray-700 rounded text-white flex items-center justify-between">
                <span className="font-medium">Version de l&#39;api :</span>
                <span className="ml-2 text-sm text-gray-300">{apiVersion}</span>
            </div>
            <div className="mb-4 px-3 py-2 bg-gray-700 rounded text-white flex items-center justify-between">
                <span className="font-medium">Version de l'application :</span>
                <span className="ml-2 text-sm text-gray-300">{REACT_APP_GIT_VERSION}</span>
            </div>
          <div className="relative">
            <Logout />
          </div>

        </div>
      </div>
    </div>
  );
};

export default Settings;
