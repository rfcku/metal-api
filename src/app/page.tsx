import ItemList from './components/ItemList';

export default function Home() {
  return (
    <main>
      <section className="relative overflow-hidden bg-black/80 py-24 sm:py-32 flex items-center justify-center min-h-[40vh] border-b border-gray-800">
        {/* Background texture / gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#0F0F0F] z-10 pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.4)_0%,transparent_60%)] pointer-events-none"></div>
        
        <div className="relative z-20 container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-oswald font-bold tracking-tighter text-white uppercase drop-shadow-lg mb-6">
            The World&apos;s Heaviest <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-800">Metal Database</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Explore thousands of bands across every subgenre. From classic heavy metal to the deepest abysses of black and death metal.
          </p>
        </div>
      </section>
      
      <section className="py-12">
        <ItemList />
      </section>
    </main>
  );
}
