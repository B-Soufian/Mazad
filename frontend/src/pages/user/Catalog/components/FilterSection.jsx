import React, { useState, useEffect } from 'react';
import { categoryApi } from '../../../../api/categoryApi';

export default function FilterSection({ 
  search, 
  category, 
  minPrice, 
  maxPrice, 
  onFilterChange, 
  pagination, 
  onPageChange 
}) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        categoryApi.getAll()
          .then(data => setCategories(data.data || data))
          .catch(err => console.error("Failed to load categories", err));
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        onFilterChange({ [name]: value });
    };

    return ( 
    <>
    <div className="flex flex-col xl:flex-row justify-between gap-4 mb-6">
          {/* Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            <select 
              name="category"
              value={category}
              onChange={handleChange}
              className="flex items-center gap-8 bg-white border border-gray-200 px-4 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-50 shadow-sm cursor-pointer outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
            <select 
              name="min_price"
              value={minPrice}
              onChange={handleChange}
              className="flex items-center gap-8 bg-white border border-gray-200 px-4 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-50 shadow-sm cursor-pointer outline-none"
            >
              <option value="">Min Price</option>
              <option value="10000">10,000 MAD</option>
              <option value="50000">50,000 MAD</option>
              <option value="100000">100,000 MAD</option>
            </select>
            <select 
              name="max_price"
              value={maxPrice}
              onChange={handleChange}
              className="flex items-center gap-8 bg-white border border-gray-200 px-4 py-2.5 rounded-md text-sm text-gray-600 hover:bg-gray-50 shadow-sm cursor-pointer outline-none"
            >
              <option value="">Max Price</option>
              <option value="50000">50,000 MAD</option>
              <option value="100000">100,000 MAD</option>
              <option value="500000">500,000 MAD</option>
              <option value="1000000">1,000,000+ MAD</option>
            </select>
          </div>

          {/* Search */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 xl:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              </div>
              <input 
                type="text" 
                name="search"
                value={search}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#D71939] focus:border-[#D71939] sm:text-sm shadow-sm text-gray-900" 
                placeholder="Search vehicles..." 
              />
            </div>
          </div>
    </div>
    <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">
            {pagination?.total > 0 
              ? `Showing ${pagination.from}-${pagination.to} of ${pagination.total}`
              : 'No results found'
            }
          </p>
          {pagination?.last_page > 1 && (
            <div className="flex items-center gap-4 text-sm text-gray-600">
               <button 
                  onClick={() => onPageChange(pagination.current_page - 1)}
                  disabled={pagination.current_page === 1}
                  className={`font-bold ${pagination.current_page === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-800 hover:text-black'}`}
               >&lt;</button>
               <div className="flex items-center gap-2">
                   <input 
                      type="text" 
                      value={pagination.current_page || 1} 
                      readOnly 
                      className="w-8 h-8 text-center border border-gray-200 rounded-md bg-white shadow-sm" 
                    />
                   <span>of {pagination.last_page || 1}</span>
               </div>
               <button 
                  onClick={() => onPageChange(pagination.current_page + 1)}
                  disabled={pagination.current_page === pagination.last_page}
                  className={`font-bold ${pagination.current_page === pagination.last_page ? 'text-gray-300 cursor-not-allowed' : 'text-gray-800 hover:text-black'}`}
               >&gt;</button>
            </div>
          )}
    </div>
    
    </>
    )
}