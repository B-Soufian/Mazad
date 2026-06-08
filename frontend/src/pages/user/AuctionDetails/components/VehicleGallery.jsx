import { useState, useEffect } from 'react';
import { getImageUrl } from '../../../../utils/getImageUrl';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function VehicleGallery({ car }) {
    const { asset } = car || {};
    const gallery = (asset?.media?.gallery || []).map(getImageUrl);
    const defaultImg = getImageUrl(asset?.media?.thumbnail);

    const [mainImg, setMainImg] = useState(defaultImg);
    const [sliderOpen, setSliderOpen] = useState(false);
    const [sliderIndex, setSliderIndex] = useState(0);

    const allImages = [defaultImg, ...gallery].filter(Boolean);

    useEffect(() => {
        if (asset?.media?.thumbnail) {
            setMainImg(getImageUrl(asset.media.thumbnail));
        }
    }, [asset]);

    const openSlider = (imgUrl) => {
        const idx = allImages.indexOf(imgUrl);
        setSliderIndex(idx !== -1 ? idx : 0);
        setSliderOpen(true);
    };

    const nextSlide = (e) => {
        e.stopPropagation();
        setSliderIndex((prev) => (prev + 1) % allImages.length);
    };

    const prevSlide = (e) => {
        e.stopPropagation();
        setSliderIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1));
    };

    return (
        <>
            <div className="flex gap-4 mb-10 h-[300px] md:h-[500px]">
                {/* Main View */}
                <div 
                    className="bg-gray-100 rounded-2xl flex-grow relative overflow-hidden border border-gray-200 cursor-pointer"
                    onClick={() => openSlider(mainImg)}
                >
                    <img 
                        key={mainImg}
                        src={mainImg} 
                        alt="Main view" 
                        className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-500 hover:scale-105 transition-transform" 
                    />
                </div>
                  
                {/* Gallery List (only if there are gallery images) */}
                {gallery.length > 0 && (
                    <div className="w-1/4 hidden md:flex flex-col gap-4">
                        {gallery.slice(0, 4).map((img, i) => {
                            const isLast = i === 3;
                            const hasMore = gallery.length > 4;
                            return (
                              <div 
                                key={i} 
                                onClick={() => openSlider(img)}
                                className={`flex-1 rounded-xl overflow-hidden relative cursor-pointer group border-2 border-transparent hover:border-[#D71939] transition-all`}
                              >
                                 <img 
                                    src={img} 
                                    alt={`Gallery ${i}`} 
                                    className={`absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-500`} 
                                 />
                                 {isLast && hasMore && (
                                     <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-2xl backdrop-blur-[2px]">
                                         +{gallery.length - 4}
                                     </div>
                                 )}
                              </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Fullscreen Slider Modal */}
            {sliderOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center">
                    <button 
                        onClick={() => setSliderOpen(false)}
                        className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2"
                    >
                        <X size={32} />
                    </button>

                    <button 
                        onClick={prevSlide}
                        className="absolute left-6 text-white/50 hover:text-white transition-colors p-4"
                    >
                        <ChevronLeft size={48} strokeWidth={1} />
                    </button>

                    <div className="w-full max-w-5xl px-16 h-[80vh] flex items-center justify-center outline-none">
                        <img 
                            src={allImages[sliderIndex]} 
                            alt={`Slide ${sliderIndex}`} 
                            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
                        />
                    </div>

                    <button 
                        onClick={nextSlide}
                        className="absolute right-6 text-white/50 hover:text-white transition-colors p-4"
                    >
                        <ChevronRight size={48} strokeWidth={1} />
                    </button>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/70 font-medium tracking-widest text-sm">
                        {sliderIndex + 1} / {allImages.length}
                    </div>
                </div>
            )}
        </>
    )
}