import { ProfileForm } from "../../components/ProfileForm";
import { ProfileSidebar } from "../../components/ProfileSidebar";

export function Perfil() {
  return (
    <main className="container flex min-h-[calc(100dvh-69px)] items-start gap-7 pt-8 pb-24">
      <ProfileSidebar />
      <ProfileForm />
    </main>
  );
}
