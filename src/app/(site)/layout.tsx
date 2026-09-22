import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeliveryButton from "@/components/DeliveryButton";
import { getFranquiaUrl } from "@/lib/queries";

// Public site chrome (header, footer, floating delivery button).
export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const franquiaUrl = await getFranquiaUrl();
  return (
    <div className="flex min-h-screen flex-col">
      <Header franquiaUrl={franquiaUrl} />
      <main className="flex-1">{children}</main>
      <Footer franquiaUrl={franquiaUrl} />
      <DeliveryButton />
    </div>
  );
}
