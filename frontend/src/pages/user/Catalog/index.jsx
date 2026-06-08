import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import HeaderSection from './components/HeaderSection';
import VehicleCard from './components/VehicleCard';
import FilterSection from './components/FilterSection';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import { auctionApi } from '../../../api/auctionApi';

const Catalog = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationInfo, setPaginationInfo] = useState({ total: 0, from: 0, to: 0, current_page: 1, last_page: 1 });
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get('search') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params = {
          search: search || undefined,
          category: category || undefined,
          min_price: minPrice || undefined,
          max_price: maxPrice || undefined,
          page: page,
        };

        const response = await auctionApi.getAll(params);
        
        // Handle Laravel pagination format
        const auctionList = response.data || response; 
        
        setPaginationInfo({
          total: response.total || 0,
          from: response.from || 0,
          to: response.to || 0,
          current_page: response.current_page || 1,
          last_page: response.last_page || 1
        });

        const formattedData = (Array.isArray(auctionList) ? auctionList : []).map(auctionItem => ({
          asset: auctionItem.asset, 
          auction: auctionItem      
        })).filter(item => item.auction.status === "live");

        setVehicles(formattedData);
      } catch (error) {
        console.error("Failed to fetch vehicles:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [search, category, minPrice, maxPrice, page]);

  const updateFilters = (newFilters) => {
    const newParams = new URLSearchParams(searchParams);
    
    Object.keys(newFilters).forEach(key => {
      if (newFilters[key]) {
        newParams.set(key, newFilters[key]);
      } else {
        newParams.delete(key);
      }
    });
    
    // Reset to page 1 on filter change
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= paginationInfo.last_page) {
      updateFilters({ page: newPage.toString() });
    }
  };

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#333]">
      <HeaderSection search={search} category={category} total={paginationInfo.total} />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6">
        <FilterSection 
          search={search}
          category={category}
          minPrice={minPrice}
          maxPrice={maxPrice}
          onFilterChange={updateFilters}
          pagination={paginationInfo}
          onPageChange={handlePageChange}
        />
        
        {loading ? (
          <LoadingSpinner />
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <p className="text-xl font-semibold">No vehicles found matching your criteria.</p>
            <button 
              onClick={() => setSearchParams({})}
              className="mt-4 text-[#D71939] hover:underline"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {vehicles.map((car) => (
              <VehicleCard key={car.asset.id} car={car} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Catalog;