import type { Metadata } from "next";
import ProfileView from "@/components/ProfileView";

export const metadata: Metadata = {
  title: "My Profile – Level, XP & Daily Challenge",
  robots: { index: false, follow: true },
};

export default function ProfilePage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 font-display text-3xl font-black tracking-tight text-fg">👤 My Profile</h1>
      <ProfileView />
    </div>
  );
}
