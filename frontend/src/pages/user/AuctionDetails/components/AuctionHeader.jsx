export default function AuctionHeader({ car }) {
    const { asset } = car || {};
    if (!asset) return null;

    const title = asset?.title || 'Unknown Vehicle';
    const lotNumber = car?.asset?.lot_number|| 'N/A';
    
    const specs = asset?.specifications || [];
    const mileageSpec = specs.find(s => s.label === "Mileage");
    const specsSpec = specs.find(s => s.label === "Specs");

    return (<div className="mb-6">
          <div className="text-xs text-gray-400 mb-2 flex items-center gap-2">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path></svg>
            <span>/</span>
            <span>Vehicles & Machinery</span>
            <span>/</span>
            <span className="text-gray-900 font-bold">{title}</span>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mt-4">
            <div>
              <p className="text-sm text-gray-500 mb-1">Lot # {lotNumber}</p>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight uppercase text-gray-900 mb-4">
                {title.toUpperCase()}
              </h1>
              
              <div className="flex flex-wrap gap-3">
                {mileageSpec && (
                  <span className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 bg-white shadow-sm">
                    <svg className="w-3.5 h-3.5 text-[#D71939]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {mileageSpec.value}
                  </span>
                )}
                {specsSpec && (
                  <span className="flex items-center gap-1.5 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-bold text-gray-700 bg-white shadow-sm">
                    <svg className="w-3.5 h-3.5 text-[#D71939]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    {specsSpec.value}
                  </span>
                )}
              </div>
            </div>


            <div className="flex gap-2">
              {[
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"></path>,
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>,
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>,
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              ].map((path, index) => (
                <button key={index} className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-lg text-gray-500 hover:bg-gray-50 transition bg-white shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{path}</svg>
                </button>
              ))}
            </div>
          </div>
        </div>
    )}