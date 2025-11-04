// src/layouts/MainLayout.tsx
import Navbar from "../components/Navbar";
import Footer from "../components/Footer"; // crie um simples
import "./MainLayout.css";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="main-layout">
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
    </div>
  );
}
