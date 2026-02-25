export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-[#0F0F0F] py-8 mt-12">
      <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <div className="mb-4 md:mb-0">
          <span className="font-oswald text-lg text-white">METAL<span className="text-red-600">ARCHIVE</span></span>
          <p className="mt-1">The ultimate heavy metal band catalog.</p>
        </div>
        <div className="flex space-x-6">
          <a href="#" className="hover:text-white transition-colors">Privacy</a>
          <a href="#" className="hover:text-white transition-colors">Terms</a>
          <a href="#" className="hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
}
