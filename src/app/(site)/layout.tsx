import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DeliveryButton from "@/components/DeliveryButton";

// Public site chrome (header, footer, floating delivery button).
export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <DeliveryButton />
    </div>
  );
}
