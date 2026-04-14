export default function VehicleGallery({ car }) {
    const { asset } = car || {};
    const gallery = asset?.media?.gallery || [];
    const mainImg = asset?.media?.thumbnail || "Main Vehicle Image";

    return (
        <div className="flex gap-4 mb-10 h-[300px] md:h-[500px]">
              <div className="bg-[#fcfcfc] rounded-2xl flex-grow relative overflow-hidden border border-gray-100 flex items-center justify-center">
                <div className="w-[85%] h-[70%] bg-[#E4E1D0] rounded-xl shadow-2xl border border-gray-200 flex items-center justify-center text-gray-400 font-bold text-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-transparent z-10"></div>
                    <span className="drop-shadow-sm z-20 relative px-4 text-center">{mainImg}</span>
                </div>
              </div>
              
              <div className="w-1/4 hidden md:flex flex-col gap-4">
                {gallery.length > 0 ? gallery.slice(0, 4).map((img, i) => (
                  <div key={i} className="flex-1 bg-[#fcfcfc] rounded-xl border border-gray-100 overflow-hidden relative flex items-center justify-center">
                     <div className="w-[80%] h-[60%] bg-[#E4E1D0] rounded shadow-md border border-gray-200 flex items-center justify-center text-[10px] text-gray-400 font-medium px-2 text-center">
                       {img}
                     </div>
                  </div>
                )) : [1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex-1 bg-[#fcfcfc] rounded-xl border border-gray-100 overflow-hidden relative flex items-center justify-center">
                     <div className="w-[80%] h-[60%] bg-[#E4E1D0] rounded shadow-md border border-gray-200"></div>
                  </div>
                ))}
              </div>
            </div>
    )}