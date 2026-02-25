'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface Item {
  _id: string;
  name: string;
  country: string;
  genre: string;
  status: string;
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debouncedSearch = useDebounce(search, 500);
  const limit = 12; // Grid friendly

  const [letter, setLetter] = useState('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        let url = `/api/items?page=${page}&limit=${limit}`;
        if (letter) {
          url += `&startsWith=${letter}`;
        } else if (debouncedSearch) {
          url += `&search=${debouncedSearch}`;
        }
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error('Failed to fetch bands');
        }
        const data = await res.json();
        setItems(data.items);
        setTotal(data.total);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, [page, debouncedSearch, letter]);

  const handleLetterClick = (l: string) => {
    setLetter(letter === l ? '' : l); // Toggle off if clicked again
    setSearch('');
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setLetter('');
    setPage(1);
  };

  // Status color mapping
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'text-green-500 border-green-500/20 bg-green-500/10';
      case 'split-up': return 'text-red-500 border-red-500/20 bg-red-500/10';
      case 'on hold': return 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10';
      case 'changed name': return 'text-blue-500 border-blue-500/20 bg-blue-500/10';
      case 'unknown': return 'text-gray-400 border-gray-400/20 bg-gray-400/10';
      default: return 'text-gray-300 border-gray-700 bg-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4">
      {/* Search and Filters */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-8">
          <h2 className="text-3xl font-oswald font-bold text-white tracking-wide">
            EXPLORE THE <span className="text-red-600">ABYSS</span>
          </h2>
          <div className="relative w-full md:w-96">
            <input
              type="text"
              placeholder="Search by band name..."
              value={search}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-3 bg-[#1A1A1A] border border-gray-800 focus:border-red-600 focus:ring-1 focus:ring-red-600 rounded-none text-white placeholder-gray-500 transition-colors outline-none"
            />
            <svg className="absolute left-3 top-3.5 h-5 w-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
        </div>

        {/* Alphabet Filter (Horizontal Scroll on Mobile) */}
        <div className="flex overflow-x-auto pb-4 hide-scrollbar justify-start md:justify-center border-b border-gray-800">
          <div className="flex space-x-1 min-w-max">
            {alphabet.map((l) => (
              <button
                key={l}
                onClick={() => handleLetterClick(l)}
                className={`w-10 h-10 flex items-center justify-center font-bold font-oswald transition-all ${
                  letter === l
                    ? 'bg-red-600 text-white border-b-2 border-red-400'
                    : 'bg-transparent text-gray-400 hover:text-white hover:bg-[#1A1A1A]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {error ? (
        <div className="text-center py-20 text-red-500 border border-red-500/20 bg-red-500/5 p-8 rounded-none">
          <h3 className="text-xl font-oswald mb-2">System Failure</h3>
          <p>{error}</p>
        </div>
      ) : isLoading ? (
        /* Skeleton Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: limit }).map((_, i) => (
            <div key={i} className="bg-[#1A1A1A] border border-gray-800 h-48 p-6 flex flex-col justify-between">
              <div>
                <div className="h-6 bg-gray-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-800 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-800 rounded w-2/3"></div>
              </div>
              <div className="h-6 bg-gray-800 rounded w-1/4 self-end mt-4"></div>
            </div>
          ))}
        </div>
      ) : items.length === 0 ? (
        /* Empty State */
        <div className="text-center py-32 border border-gray-800 bg-[#1A1A1A]">
          <h3 className="text-2xl font-oswald text-gray-400 mb-2">THE ABYSS IS EMPTY...</h3>
          <p className="text-gray-500">No bands found matching your darkest rituals.</p>
        </div>
      ) : (
        /* Data Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-[#1A1A1A] border border-gray-800 p-6 flex flex-col justify-between group hover:border-red-600/50 hover:bg-[#202020] transition-all duration-300 relative overflow-hidden"
            >
              {/* Decorative accent */}
              <div className="absolute top-0 left-0 w-1 h-0 bg-red-600 group-hover:h-full transition-all duration-300"></div>
              
              <div className="mb-6">
                <h3 className="text-xl font-oswald font-bold text-white mb-3 tracking-wide truncate" title={item.name}>
                  {item.name}
                </h3>
                
                <div className="space-y-2 text-sm text-gray-400 font-sans">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="truncate">{item.country}</span>
                  </div>
                  <div className="flex items-start">
                    <svg className="w-4 h-4 mr-2 mt-0.5 text-gray-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" /></svg>
                    <span className="line-clamp-2" title={item.genre}>{item.genre}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-800/50">
                <span className={`text-xs font-bold uppercase px-2 py-1 border ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
                <button className="text-gray-500 group-hover:text-white transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {total > 0 && (
        <div className="mt-16 flex flex-col sm:flex-row justify-between items-center border-t border-gray-800 pt-8">
          <p className="text-sm text-gray-500 mb-4 sm:mb-0">
            Showing <span className="font-medium text-white">{(page - 1) * limit + 1}</span> to <span className="font-medium text-white">{Math.min(page * limit, total)}</span> of <span className="font-medium text-white">{total}</span> entries
          </p>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-800 bg-[#1A1A1A] text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-oswald uppercase text-sm tracking-wider"
            >
              PREV
            </button>
            <div className="flex items-center px-4 font-oswald text-white">
              PAGE {page}
            </div>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * limit >= total}
              className="px-4 py-2 border border-gray-800 bg-[#1A1A1A] text-gray-300 hover:bg-gray-800 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-oswald uppercase text-sm tracking-wider"
            >
              NEXT
            </button>
          </div>
        </div>
      )}
      
      {/* Hide Scrollbar CSS Utility for Alphabet Scroll */}
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}