export function Footer() {
  return (
    <footer className="border-t bg-muted/40 py-8">
      <div className="container mx-auto px-4 text-center text-sm text-muted-foreground md:px-6">
        <p>© {new Date().getFullYear()} EduFind. College discovery for Indian students.</p>
      </div>
    </footer>
  );
}
