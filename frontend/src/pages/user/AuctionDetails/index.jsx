import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { auctionApi } from '../../../api/auctionApi';
import echo from '../../../echo'; // Import configured Echo instance
import AuctionHeader from './components/AuctionHeader';
import VehicleGallery from './components/VehicleGallery';
import VehicleSpecs from './components/VehicleSpecs';
import BiddingCard from './components/BiddingCard';
import HowToBid from './components/HowToBid';
import Similar from './components/Similar';
import HighlightsSection from './components/HighlightsSection';

const AuctionPage = () => {
  const { id } = useParams();
  const [carData, setCarData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch initial auction data
  const fetchAuction = useCallback(async () => {
    try {
      const data = await auctionApi.getById(id);
      setCarData({ asset: data.asset, auction: data });
    } catch (err) {
      console.error('Failed to fetch auction details:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchAuction(); }, [fetchAuction]);

  // WebSocket Listener
  useEffect(() => {
    if (!id) return;

    // Listen on the 'auction.{id}' public channel
    const channel = echo.channel(`auction.${id}`);

    channel.listen('.BidPlaced', (e) => {
      console.log('New Bid Received via WebSockets!', e);
      
      // Update local state without refreshing the page!
      setCarData(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          auction: {
            ...prev.auction,
            current_price: e.current_price,
            bid_count: e.bid_count,
            // If you display the latest bid history, you could append e.latest_bid here
          }
        };
      });
    });

    // Cleanup when leaving the page
    return () => {
      channel.stopListening('.BidPlaced');
      echo.leaveChannel(`auction.${id}`);
    };
  }, [id]);

  if (loading) return <div className="p-12 text-center text-gray-500 animate-pulse font-bold">Loading auction details...</div>;
  if (!carData) return <div className="p-12 text-center text-gray-500 font-bold">Auction not found.</div>;

  return (
    <div className="max-w-[1400px] mx-auto p-4 md:p-8 bg-white text-[#111827]">
      <AuctionHeader car={carData} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-8">
          <VehicleGallery car={carData} />
          <HighlightsSection car={carData} />
          <VehicleSpecs car={carData} />
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* onBidSuccess → re-fetches the page so price + bid count update live */}
          <BiddingCard car={carData} onBidSuccess={fetchAuction} />
          <HowToBid />
        </div>
      </div>

      <Similar car={carData} />
    </div>
  );
};

export default AuctionPage;