
'use client';

import { useEffect, useState } from 'react';
import { useDebounce } from '../hooks/useDebounce';

interface Item {
  _id: string;
  name: string;
  country: string;
  genre: string;
  status: string;
  // Add other properties of your item here
}

export default function ItemList() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 500);
  const limit = 10;

  const [letter, setLetter] = useState('');
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    const fetchItems = async () => {
      let url = `/api/items?page=${page}&limit=${limit}`;
      if (letter) {
        url += `&startsWith=${letter}`;
      } else {
        url += `&search=${debouncedSearch}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      setItems(data.items);
      setTotal(data.total);
    };

    fetchItems();
  }, [page, debouncedSearch, letter]);


  const handleLetterClick = (l: string) => {
    setLetter(l);
    setSearch('');
    setPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setLetter('');
    setPage(1);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Metal Bands</h1>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={handleSearchChange}
          className="px-4 py-2 border border-gray-800 rounded-md"
        />
      </div>
      <div className="flex justify-center space-x-1 mb-4">
        {alphabet.map((l) => (
          <button
            key={l}
            onClick={() => handleLetterClick(l)}
            className={`px-2 py-1 rounded-md ${letter === l ? 'bg-red-500 text-white' : 'bg-gray-500'}`}>
            {l}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item._id} className="p-4 border border-gray-800 rounded-md shadow-sm">
            <b>{item.name}</b>
            <div className="text-sm text-gray-600">
              {item.country} | {item.genre} | {item.status}
            </div>
          </li>
        ))}
      </ul>
      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
          className="px-4 py-2 bg-gray-200 text-black rounded-md disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {Math.ceil(total / limit)}
        </span>
        <button
          onClick={() => setPage(page + 1)}
          disabled={page * limit >= total}
          className="px-4 py-2 bg-gray-200 text-black rounded-md disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
