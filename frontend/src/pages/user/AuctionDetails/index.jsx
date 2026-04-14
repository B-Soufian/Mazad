import React, { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import AuctionHeader from './components/AuctionHeader';
import VehicleGallery from './components/VehicleGallery';
import VehicleSpecs from './components/VehicleSpecs';
import BiddingCard from './components/BiddingCard';
import HowToBid from './components/HowToBid';
import Similar from './components/Similar';
import HighlightsSection from './components/HighlightsSection';

// ... (your component imports)

const AuctionPage = () => {
  const { id } = useParams();
  const location = useLocation();
  
  // Use state from navigation if available, otherwise null
  const [carData, setCarData] = useState(location.state?.car || null);
  const [loading, setLoading] = useState(!location.state?.car);

  useEffect(() => {
    const fetchAuctionById = async () => {
      // If we already have the data from the catalog navigation, don't fetch again
      if (carData) return;
      
      try {
        setLoading(true);
        
        // 1. Fetch the specific auction from Laravel
        // Laravel handles the "Join" for us via the with('asset') relationship
        const response = await fetch(`http://localhost:8000/api/auctions/${id}`);
        
        if (!response.ok) throw new Error("Auction not found");
        
        const data = await response.json();

        // 2. Format the data to match the shape your components expect { asset, auction }
        setCarData({ 
          asset: data.asset, // The car/item details
          auction: data      // The pricing/timing details
        });
        console.log(carData)

      } catch (error) {
        console.error("Failed to fetch auction details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuctionById();
  }, [id, carData]);

  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse font-bold">Loading auction details...</div>;
  if (!carData) return <div className="p-12 text-center text-gray-500 font-bold">Auction not found.</div>;

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 bg-white text-[#111827]">
      <AuctionHeader car={carData} />
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column (Images & Details) */}
        <div className="lg:col-span-8">
          <VehicleGallery car={carData} />
          <HighlightsSection car={carData} />
          <VehicleSpecs car={carData} />
        </div>
        
        {/* Right Column (Cards) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <BiddingCard car={carData} />
          <HowToBid />
        </div>
      </div>
      
      <Similar car={carData} />
    </div>
  );
};

export default AuctionPage;