import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-gray-100 bg-primary text-secondary">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <p className="text-secondary/60 text-sm font-medium tracking-wide uppercase">
          All rights reserved. Casa Di Moda © 2025.
        </p>
        <div className="mt-4 flex justify-center gap-6 text-xs text-accent uppercase tracking-widest font-bold">
          <a href="#" className="hover:text-white transition-colors">
            Privacy
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Terms
          </a>
          <a href="#" className="hover:text-white transition-colors">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
