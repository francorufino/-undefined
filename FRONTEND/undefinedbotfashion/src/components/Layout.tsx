import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">{children}</main>
      <footer className="bg-gray-900 text-white text-center py-4">
        <p>&copy; 2025 My App</p>
      </footer>
    </div>
  );
}
