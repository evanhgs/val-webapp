import {ApiEndpoints} from "@/lib/endpoints";
import {NavPostsProps} from "@/types/Post";
import Link from "next/link";


export const NavPosts = ({ post }: NavPostsProps) => {
    return (
        <div className="mt-10 px-4">

            {post.length > 0 ? (
                <div className="grid grid-cols-3 gap-2">
                    {post.map((p, index) => (
                        <Link
                            key={`post-${index}`}
                            href={`/post/${p.id}`}
                            className="relative aspect-square rounded-xl overflow-hidden
                       bg-zinc-900 border border-white/5
                       shadow-[0_10px_25px_rgba(0,0,0,0.4)]
                       group"
                        >
                            <img
                                src={ApiEndpoints.user.picture(p.image_url)}
                                alt={p.caption}
                                className="w-full h-full object-cover transition-transform duration-300
                         group-hover:scale-[1.05]"
                            />

                            {/* Overlay stats */}
                            <div className="absolute inset-0 bg-zinc-950/60 opacity-0
                            group-hover:opacity-100 transition
                            flex items-center justify-center">
                                <div className="flex items-center gap-6 text-white font-semibold text-sm">
                                    <div className="flex items-center gap-1">
                                        <span>❤️</span>
                                        <span>{p.likes?.count}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span>💬</span>
                                        <span>{p.comments?.count}</span>
                                    </div>
                                </div>
                            </div>

                        </Link>
                    ))}
                </div>
            ) : (
                <div className="mt-16 text-center bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900
                      border border-white/5 rounded-2xl p-10
                      shadow-[0_0_40px_rgba(255,255,255,0.05)]">

                    <h3 className="text-2xl font-semibold text-white">
                        Partage tes photos
                    </h3>

                    <p className="text-zinc-400 mt-3 max-w-sm mx-auto">
                        Quand tu partages des photos et vidéos, elles apparaissent sur ton profil.
                    </p>

                    <Link
                        href="/upload"
                        className="inline-block mt-6 px-6 py-3 rounded-xl bg-white text-zinc-900 font-semibold
                     shadow-[0_10px_30px_rgba(255,255,255,0.25)]
                     hover:shadow-[0_15px_40px_rgba(255,255,255,0.35)]
                     active:scale-[0.98] transition"
                    >
                        Partager ta première photo
                    </Link>
                </div>
            )}

        </div>
    );
}
