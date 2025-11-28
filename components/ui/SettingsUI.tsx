import {SearchProps} from "@/types/searchProps";
import outsideClick from "@/components/ui/OutsideClick";
import {useEffect, useState} from "react";
import {ApiEndpoints, AxiosInstance, REACT_APP_GIT_VERSION} from "@/lib/endpoints";
import Link from "next/link";

export default function SettingsUI({ setIsSetting, isCompact }: SearchProps){

    const settingContainerRef = outsideClick(() => {
        setIsSetting(false);
    });

    const [apiVersion, setApiVersion] = useState<string>('');


    useEffect(() => {
        const fetchApiVersion = async () => {
            const resp = await AxiosInstance.get(ApiEndpoints.version.getVersion());
            setApiVersion(resp.data.version);
        };
        fetchApiVersion()
    }, []);

    return (
        <div className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm">

            <div
                ref={settingContainerRef}
                className="fixed top-1/2 left-1/2 z-50
                 -translate-x-1/2 -translate-y-1/2
                 w-[320px] rounded-2xl
                 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900
                 border border-white/5
                 shadow-[0_0_40px_rgba(255,255,255,0.08)]
                 p-5 transition-all"
            >

                {/* Header */}
                <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-semibold text-white">
                        Paramètres
                    </h3>

                    <button
                        onClick={() => setIsSetting(false)}
                        className="p-2 rounded-full text-zinc-400
                     hover:text-white hover:bg-white/10 transition"
                    >
                        ✕
                    </button>
                </div>

                {/* Versions */}
                <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between
                        rounded-xl bg-zinc-800 border border-white/10
                        px-4 py-2 text-sm text-white">
                        <span className="opacity-80">Version API</span>
                        <span className="text-zinc-400">{apiVersion}</span>
                    </div>

                    <div className="flex items-center justify-between
                        rounded-xl bg-zinc-800 border border-white/10
                        px-4 py-2 text-sm text-white">
                        <span className="opacity-80">Version App</span>
                        <span className="text-zinc-400">{REACT_APP_GIT_VERSION}</span>
                    </div>
                </div>

                {/* Logout */}
                <Link
                    href="/logout"
                    className="block w-full text-center
                   rounded-xl py-2 font-semibold
                   bg-red-500/10 text-red-400
                   hover:bg-red-500/20 hover:text-red-300
                   transition"
                >
                    Se déconnecter
                </Link>

            </div>

        </div>
    );
};