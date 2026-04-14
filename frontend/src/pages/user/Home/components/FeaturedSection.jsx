import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedSection() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/auctions');
                const data = await response.json();
                
                // Get only first 4 live auctions
                const featured = data
                    .filter(a => a.status === 'live')
                    .slice(0, 4);
                
                setItems(featured);
                console.log(featured)
            } catch (error) {
                console.error("Error fetching featured auctions:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchFeatured();
    }, []);

    // Helper to find a specific specification value by label
    const getSpec = (specs, label) => {
        const spec = specs?.find(s => s.label.toLowerCase() === label.toLowerCase());
        return spec ? spec.value : '';
    };

    if (loading) return <div className="h-96 flex items-center justify-center text-slate-400">Loading featured...</div>;
    if (items.length < 4) return null; // Or show a simplified grid

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. LARGE ITEM (Index 0) */}
                <div 
                    onClick={() => navigate(`/auction/${items[0].id}`)}
                    className="md:col-span-2 relative rounded-2xl overflow-hidden h-[400px] bg-gray-100 group cursor-pointer"
                >
                    <img src={items[0].asset?.media?.thumbnail} alt={items[0].asset?.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded text-white text-xs font-semibold uppercase tracking-wider">
                        LOT {items[0].asset?.lot_number} - {getSpec(items[0].asset?.specifications, 'Specs') || 'Verified'}
                    </div>
                    <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                        <div>
                            <h3 className="text-white text-3xl font-bold mb-2 uppercase">{items[0].asset?.title}</h3>
                            <div className="flex gap-4 text-gray-300 text-sm font-medium">
                                <span>{getSpec(items[0].asset?.specifications, 'Mileage')}</span>
                                <span>{getSpec(items[0].asset?.specifications, 'Body Type')}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-white font-bold text-2xl mb-2">AED {Number(items[0].current_price).toLocaleString()}</div>
                            <button className="bg-[#D70B27] text-white px-6 py-2 rounded-full font-semibold text-sm hover:bg-red-800 transition shadow-lg">Bid Now</button>
                        </div>
                    </div>
                </div>

                {/* 2. TALL VERTICAL ITEM (Index 1) */}
                <div 
                    onClick={() => navigate(`/auction/${items[1].id}`)}
                    className="md:col-span-1 relative rounded-2xl overflow-hidden h-[400px] bg-gray-100 group cursor-pointer"
                >
                    <img src={items[1].asset?.media?.thumbnail} alt={items[1].asset?.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute bottom-0 w-full bg-white p-5">
                        <div className="text-xs text-gray-500 font-bold mb-1 uppercase tracking-widest">LOT {items[1].asset?.lot_number}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 uppercase truncate">{items[1].asset?.title}</h3>
                        <div className="flex gap-3 text-gray-500 text-xs mb-4">
                            <span>{getSpec(items[1].asset?.specifications, 'Mileage')}</span>
                            <span>{getSpec(items[1].asset?.specifications, 'Exterior Color')}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="font-bold text-lg text-slate-900">AED {Number(items[1].current_price).toLocaleString()}</div>
                            <button className="text-[#D70B27] text-sm font-bold hover:underline">Place Bid &rarr;</button>
                        </div>
                    </div>
                </div>

                {/* 3. SMALL SQUARE ITEM (Index 2) */}
                <div 
                    onClick={() => navigate(`/auction/${items[2].id}`)}
                    className="md:col-span-1 relative rounded-2xl overflow-hidden h-[300px] bg-gray-100 group cursor-pointer"
                >
                    <img src={items[2].asset?.media?.thumbnail} alt={items[2].asset?.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition duration-700" />
                    <div className="absolute bottom-0 w-full bg-white p-5 border-t border-slate-100">
                        <div className="text-xs text-gray-400 font-bold mb-1">LOT {items[2].asset?.lot_number}</div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 uppercase truncate">{items[2].asset?.title}</h3>
                        <div className="flex justify-between items-center mt-3">
                            <div className="font-bold text-lg text-slate-900">AED {Number(items[2].current_price).toLocaleString()}</div>
                            <button className="text-[#D70B27] text-sm font-bold hover:underline">Place Bid &rarr;</button>
                        </div>
                    </div>
                </div>

                {/* 4. PREMIUM WIDE ITEM (Index 3) */}
                <div 
                    onClick={() => navigate(`/auction/${items[3].id}`)}
                    className="md:col-span-2 relative rounded-2xl overflow-hidden h-[300px] bg-gray-900 group cursor-pointer shadow-inner"
                >
                    <img src={items[3].asset?.media?.thumbnail} alt={items[3].asset?.title} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent"></div>
                    <div className="absolute top-6 left-6">
                        <span className="bg-[#D70B27] text-white text-[10px] font-black px-3 py-1 rounded-sm tracking-widest uppercase">PREMIUM LISTING</span>
                    </div>
                    <div className="absolute top-1/2 -translate-y-1/2 left-8 max-w-sm">
                        <h3 className="text-white text-3xl font-bold mb-2 uppercase leading-tight tracking-tight">
                            {items[3].asset?.title}
                        </h3>
                        <p className="text-gray-400 text-sm mb-6 line-clamp-2">
                            A rare opportunity to acquire this {items[3].asset?.condition_status} masterpiece. 
                            Fully verified and ready for transfer.
                        </p>
                        <div className="flex gap-8">
                            <div>
                                <div className="text-gray-500 font-bold text-[10px] tracking-widest mb-1">CURRENT BID</div>
                                <div className="text-white font-bold text-2xl">AED {Number(items[3].current_price).toLocaleString()}</div>
                            </div>
                            <button className="self-end bg-white text-gray-900 px-8 py-2.5 rounded-full font-bold text-xs hover:bg-gray-200 transition shadow-lg">Place Your Bid</button>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    )
}