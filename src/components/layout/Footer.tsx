export default function Footer() {
  return (
    <footer className="bg-muted border-t border-border py-6 text-center text-muted-foreground">
      <div className="container mx-auto px-4">
        <p>&copy; {new Date().getFullYear()} FieldAssist. All rights reserved.</p>
        <p className="text-sm mt-1">Your reliable partner for field and home services.</p>
      </div>
    </footer>
  );
}
