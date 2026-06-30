import Nav from "../nav";

function Footer() {
  return (
    <footer className="border-t border-border mt-auto">
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-8 gap-4">
        <p className="text-[11px] tracking-[0.15em] uppercase text-muted">
          &copy; {new Date().getFullYear()} Veli̇ İhsan Uysal
        </p>
      </div>
    </footer>
  );
}

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
