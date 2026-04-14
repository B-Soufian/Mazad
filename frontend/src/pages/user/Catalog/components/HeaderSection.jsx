import { Search, Filter, LayoutGrid, List, Share2, Timer, Gauge, MapPin, ChevronLeft, ChevronRight, MessageCircle, ArrowUp } from 'lucide-react';

export default function HeaderSection(){
    return (
        <header className="bg-[#1a1a1a] text-white pt-12 pb-8 px-6 md:px-12">
                <div className="max-w-7xl mx-auto">
                  <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" /></svg>
                        <span>/</span> <span>Vehicles & Machinery</span>
                  </div>
                  <div className="flex flex-col md:flex-row justify-between items-end gap-6">
                    <div>
                      <h1 className="text-5xl font-bold mb-6">Vehicles & Machinery</h1>
                      <div className="flex gap-6 text-sm">
                        <span className="flex items-center gap-2"><List size={16} /> 673 Vehicles</span>
                        <span className="flex items-center gap-2 text-[#D71939]"><Timer size={16} /> Ending Now</span>
                        <span className="flex items-center gap-2"><LayoutGrid size={16} /> Auction Catalog</span>
                      </div>
                    </div>
                  </div>
                </div>
              </header>
    )
}