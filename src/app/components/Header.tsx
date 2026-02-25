import Link from 'next/link';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-800 bg-[#0F0F0F]/90 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 group">
          <span className="text-2xl font-bold font-oswald tracking-wider text-white group-hover:text-red-600 transition-colors">
            METAL<span className="text-red-600 group-hover:text-white transition-colors">ARCHIVE</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium text-gray-300">
          <Link href="/" className="hover:text-white transition-colors">Directory</Link>
          <Link href="#" className="hover:text-white transition-colors">Genres</Link>
          <Link href="#" className="hover:text-white transition-colors">About</Link>
        </nav>
      </div>
    </header>
  );
}
