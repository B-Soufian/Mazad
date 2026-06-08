import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Tag, Search, Car, Users, Gavel, ShieldCheck, ChevronDown, MapPin } from 'lucide-react';
import { categoryApi } from '../../../../api/categoryApi';

export default function HeroSection() {
  const navigate = useNavigate();
  
  // Search State
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [location, setLocation] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryApi.getAll()
      .then(data => setCategories(data.data || data))
      .catch(err => console.error("Failed to load categories", err));
  }, []);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (selectedCategory) params.append('category', selectedCategory);
    if (location) params.append('location', location);
    if (minPrice) params.append('min_price', minPrice);
    if (maxPrice) params.append('max_price', maxPrice);
    
    navigate(`/catalog?${params.toString()}`);
  };
  return (
    <div className="relative w-full flex flex-col items-center">
      
      <div className="w-full bg-[#0B0E14] text-white w-screen h-[calc(100vh-63px)] py-5 px-5 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-2 items-center relative z-10">
          <div className="flex flex-col gap-6">
            <h1 className=" text-5xl md:text-6xl font-bold leading-[1.1] tracking-tight">
              Bid on<br />
              <span className="text-[#d71939]">Excellence</span> <br />
              Own the <br />
              Extraordinary.
            </h1>
            <p className="text-gray-400 text-lg max-w-md leading-relaxed">
              Join thousands of smart buyers and sellers in the Middle East's most trusted auction marketplace.
            </p>
            <div className="flex flex-wrap gap-4 mt-2">
              <Link to="/auctions" className="bg-[#d71939] hover:bg-[#b5142e] transition-colors text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 shadow-lg shadow-red-500/20">
                Browse Auctions <ArrowRight size={18} strokeWidth={2.5} />
              </Link>
              <Link to="/sell" className="bg-[#1a1f24] hover:bg-black border border-white/5 transition-colors text-white font-bold py-3.5 px-8 rounded-xl flex items-center gap-2 shadow-lg">
                Sell Your Vehicle <Tag size={18} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <div className="relative flex justify-center lg:justify-start lg:pl-12  ">
            <img 
              src="/images/car.png" 
              alt="Luxury SUV" 
              className="w-full max-w-[800px] object-contain drop-shadow-2xl relative z-0 transform scale-110 lg:scale-125 lg:-translate-x-8"
            />
            
            
          </div>

        </div>

      </div>

     

    
    

    </div>
  );
}