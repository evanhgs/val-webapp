'use client';

import { useParams } from "next/navigation";
import ProfilePage from "@/components/ui/ProfilePage";

export default function UserProfilePage() {
    const params = useParams<{ username: string }>();
    const username = params.username;

    return <ProfilePage targetUsername={username} />;
}
