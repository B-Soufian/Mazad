import React from 'react';
import HeaderSection from './components/HeaderSection';
import VehicleCard from './components/VehicleCard';
import NotificationSection from './components/NotificationSection';
import FilterSection from './components/FilterSection';

const Catalog = () => {
  const [vehicles, setVehicles] = React.useState([]);

 React.useEffect(() => {
  const fetchData = async () => {
    try {
      // 1. Fetch only the auctions. 
      // Our Laravel backend already includes the asset inside the auction object!
      const response = await fetch('http://localhost:8000/api/auctions');
      const data = await response.json();

      // 2. Map the data so it matches the shape your UI components expect.
      // We transform the flat Laravel response into the { asset, auction } object.
      const formattedData = data.map(auctionItem => ({
        asset: auctionItem.asset, // This comes from Laravel's with('asset')
        auction: auctionItem      // This is the auction itself
      }))
      // Filter only for live auctions
      .filter(item => item.auction.status === "live");

      setVehicles(formattedData);
    } catch (error) {
      console.error("Failed to fetch vehicles:", error);
    }
  };
  
  fetchData();
}, []);

  return (
    <div className="bg-[#f8f9fa] min-h-screen font-sans text-[#333]">
     <HeaderSection />
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-6">
     <NotificationSection />
     <FilterSection />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {vehicles.map((car) => (
            <VehicleCard key={car.asset.id} car={car} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Catalog;