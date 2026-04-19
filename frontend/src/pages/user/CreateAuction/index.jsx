import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Trash2, Check, ChevronRight, ChevronLeft, 
  Package, Gavel, FileCheck, Image as ImageIcon, UploadCloud, Loader2
} from 'lucide-react';

const CreateAuction = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Check authentication on mount
  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
  }, [user, navigate]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
        // Fallback categories
        setCategories([
          { id: 'cat_01', name: 'Motors' },
          { id: 'cat_02', name: 'Watches' }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const [formData, setFormData] = useState({
    // Asset Data
    title: '',
    categoryId: 'cat_01',
    lotNumber: '',
    ownerId: user?.id || '', // Get from authenticated user
    conditionStatus: 'new',
    isHot: false,
    
    // NEW: File Objects instead of strings
    thumbnailFile: null, 
    galleryFiles: [], 
    
    highlights: [],
    specifications: [{ group: 'Overview', label: '', value: '' }],
    
    // Auction Data
    currency: 'AED',
    startingPrice: '',
    reservePrice: '',
    buyNowPrice: '',
    minimumIncrement: '5000',
    startsAt: '',
    endsAt: '',
  });

  // --- Handlers ---
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleFileChange = (e, field) => {
    if (field === 'thumbnail') {
      updateField('thumbnailFile', e.target.files[0]);
    } else {
      updateField('galleryFiles', Array.from(e.target.files));
    }
  };

  // --- Validation Logic ---
  const validateStep = () => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      if (!formData.lotNumber.trim()) newErrors.lotNumber = "Lot Number is required";
      if (!formData.thumbnailFile) newErrors.thumbnailFile = "Thumbnail image is required";
    }
    
    if (step === 2) {
      if (!formData.startingPrice || Number(formData.startingPrice) <= 0) newErrors.startingPrice = "Valid starting price required";
      if (!formData.reservePrice || Number(formData.reservePrice) < Number(formData.startingPrice)) newErrors.reservePrice = "Reserve must be >= Starting Price";
      if (!formData.startsAt) newErrors.startsAt = "Start date is required";
      if (!formData.endsAt) newErrors.endsAt = "End date is required";
      if (new Date(formData.endsAt) <= new Date(formData.startsAt)) newErrors.endsAt = "End date must be after start date";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if no errors
  };

  const handleNext = () => {
    if (validateStep()) setStep(s => s + 1);
  };

  // --- LARAVEL API SUBMISSION ---
  const handleFinalSubmit = async () => {
    if (!user) {
      alert('Please log in first');
      navigate('/auth/login');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const assetForm = new FormData();
      assetForm.append('owner_id', user.id); // Use authenticated user's ID
      assetForm.append('category_id', formData.categoryId);
      assetForm.append('lot_number', formData.lotNumber);
      assetForm.append('title', formData.title);
      assetForm.append('condition_status', formData.conditionStatus);
      
      assetForm.append('specifications', JSON.stringify(formData.specifications));
      assetForm.append('marketing', JSON.stringify({ isHot: formData.isHot, highlights: formData.highlights }));
      
      if (formData.thumbnailFile) assetForm.append('thumbnail', formData.thumbnailFile);
      formData.galleryFiles.forEach(file => {
        assetForm.append('gallery[]', file); // [] tells Laravel it's an array
      });

      const assetRes = await fetch('http://localhost:8000/api/assets', {
        method: 'POST',
        headers: { 'Accept': 'application/json' }, // Do NOT set Content-Type for FormData
        body: assetForm
      });

      if (!assetRes.ok) {
        const errorData = await assetRes.json();
        throw new Error(errorData.message || 'Asset creation failed');
      }
      
      const newAsset = await assetRes.json();

      // 3. Prepare Auction Data (Standard JSON is fine here)
      const auctionPayload = {
        asset_id: newAsset.data?.id || newAsset.id,
        status: "live",
        currency: formData.currency,
        starting_price: Number(formData.startingPrice),
        reserve_price: Number(formData.reservePrice),
        buy_now_price: formData.buyNowPrice ? Number(formData.buyNowPrice) : null,
        minimum_increment: Number(formData.minimumIncrement),
        starts_at: formData.startsAt,
        ends_at: formData.endsAt,
      };

      // 4. POST to Laravel Auctions endpoint
      const auctionRes = await fetch('http://localhost:8000/api/auctions', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(auctionPayload)
      });

      if (!auctionRes.ok) {
        const errorData = await auctionRes.json();
        throw new Error(errorData.message || 'Auction creation failed');
      }

      alert("Success! Auction is now live!");
      navigate('/');
      // window.location.href = '/admin/live-auctions';

    } catch (error) {
      console.error("Submission failed:", error);
      alert(error.message || "An error occurred connecting to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8 font-sans">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Create New Auction</h1>
        <p className="text-slate-500 mt-1">Step {step} of 3</p>
      </div>

      {/* STEP INDICATOR */}
      <div className="flex items-center justify-center mb-10">
        {[1, 2, 3].map((num) => (
          <React.Fragment key={num}>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all font-bold ${
              step >= num ? 'bg-[#D71939] border-[#D71939] text-white shadow-md shadow-red-900/20' : 'border-slate-200 text-slate-400 bg-white'
            }`}>
              {step > num ? <Check size={20} /> : num}
            </div>
            {num < 3 && <div className={`w-20 h-1 ${step > num ? 'bg-[#D71939]' : 'bg-slate-100'}`} />}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-8">
        
        {/* STEP 1: ASSET INFO */}
        {step === 1 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <SectionTitle icon={<Package size={20}/>} title="Asset Identity" />
            <div className="grid grid-cols-2 gap-6">
              <Input error={errors.title} label="Title" value={formData.title} onChange={e => updateField('title', e.target.value)} placeholder="e.g. 1967 Ferrari 275 GTB/4" />
              <Input error={errors.lotNumber} label="Lot Number" value={formData.lotNumber} onChange={e => updateField('lotNumber', e.target.value)} placeholder="FER-275-882" />
              <Select label="Category" options={[{id: 'cat_01', name: 'Motors'}, {id: 'cat_02', name: 'Watches'}]} value={formData.categoryId} onChange={e => updateField('categoryId', e.target.value)} />
              <Select label="Condition" options={[{id: 'new', name: 'New'}, {id: 'restored', name: 'Restored'}]} value={formData.conditionStatus} onChange={e => updateField('conditionStatus', e.target.value)} />
            </div>

            <SectionTitle icon={<ImageIcon size={20}/>} title="Media Upload" />
            <div className="grid grid-cols-2 gap-6">
              <FileUpload 
                label="Thumbnail Image" 
                error={errors.thumbnailFile}
                onChange={(e) => handleFileChange(e, 'thumbnail')} 
                fileName={formData.thumbnailFile?.name}
              />
              <FileUpload 
                label="Gallery (Multiple)" 
                multiple
                onChange={(e) => handleFileChange(e, 'gallery')} 
                fileName={formData.galleryFiles.length > 0 ? `${formData.galleryFiles.length} files selected` : null}
              />
            </div>
          </div>
        )}

        {/* STEP 2: AUCTION TERMS */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
            <SectionTitle icon={<Gavel size={20}/>} title="Pricing Strategy" />
            <div className="grid grid-cols-2 gap-6">
              <Input error={errors.startingPrice} type="number" label="Starting Price (AED)" value={formData.startingPrice} onChange={e => updateField('startingPrice', e.target.value)} />
              <Input error={errors.reservePrice} type="number" label="Reserve Price (AED)" value={formData.reservePrice} onChange={e => updateField('reservePrice', e.target.value)} />
              <Input type="number" label="Buy Now Price (Optional)" value={formData.buyNowPrice} onChange={e => updateField('buyNowPrice', e.target.value)} />
              <Input type="number" label="Min Increment" value={formData.minimumIncrement} onChange={e => updateField('minimumIncrement', e.target.value)} />
            </div>

            <SectionTitle icon={<Plus size={20}/>} title="Timeline" />
            <div className="grid grid-cols-2 gap-6">
              <Input error={errors.startsAt} type="datetime-local" label="Start Date & Time" value={formData.startsAt} onChange={e => updateField('startsAt', e.target.value)} />
              <Input error={errors.endsAt} type="datetime-local" label="End Date & Time" value={formData.endsAt} onChange={e => updateField('endsAt', e.target.value)} />
            </div>
          </div>
        )}

        {/* STEP 3: REVIEW */}
        {step === 3 && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
            <SectionTitle icon={<FileCheck size={20}/>} title="Review Details" />
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
              <ReviewRow label="Asset Title" value={formData.title} />
              <ReviewRow label="Thumbnail Attached" value={formData.thumbnailFile ? 'Yes' : 'No'} />
              <ReviewRow label="Starting Bid" value={`AED ${Number(formData.startingPrice).toLocaleString()}`} isPrice />
              <ReviewRow label="Reserve Price" value={`AED ${Number(formData.reservePrice).toLocaleString()}`} isPrice />
              <ReviewRow label="Launch Date" value={new Date(formData.startsAt).toLocaleString()} />
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between">
          <button 
            onClick={() => setStep(s => s - 1)}
            disabled={step === 1 || isSubmitting}
            className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all ${step === 1 ? 'opacity-0' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            <ChevronLeft size={20}/> Back
          </button>
          
          {step < 3 ? (
            <button 
              onClick={handleNext}
              className="bg-[#D71939] text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-red-900/20 hover:bg-[#b81530] transition-colors"
            >
              Next Step <ChevronRight size={20}/>
            </button>
          ) : (
            <button 
              onClick={handleFinalSubmit}
              disabled={isSubmitting}
              className="bg-[#0D6B64] hover:bg-[#0a524c] disabled:bg-slate-400 text-white px-10 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-teal-900/20 transition-colors"
            >
              {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Check size={20}/>}
              {isSubmitting ? 'Publishing...' : 'Launch Auction'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


const SectionTitle = ({ icon, title }) => (
  <div className="flex items-center gap-3 text-slate-900 border-b border-slate-50 pb-4">
    <div className="p-2.5 bg-slate-50 rounded-xl text-slate-400">{icon}</div>
    <h2 className="text-lg font-bold tracking-tight">{title}</h2>
  </div>
);

const Input = ({ label, error, ...props }) => (
  <div className="w-full">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
    <input 
      {...props} 
      className={`w-full bg-slate-50 border px-4 py-3 rounded-xl text-sm font-medium outline-none transition-all ${
        error ? 'border-red-500 focus:ring-red-200' : 'border-slate-200 focus:ring-[#D71939]/20 focus:border-[#D71939]'
      } focus:ring-2 focus:bg-white`}
    />
    {error && <p className="text-red-500 text-xs font-bold mt-1.5">{error}</p>}
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="w-full">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
    <select 
      {...props} 
      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-medium focus:ring-2 focus:ring-[#D71939]/20 focus:border-[#D71939] outline-none transition-all appearance-none"
    >
      {options.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
    </select>
  </div>
);

const FileUpload = ({ label, onChange, fileName, multiple, error }) => (
  <div className="w-full">
    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-2">{label}</label>
    <div className={`relative flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl transition-all ${error ? 'border-red-400 bg-red-50' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'}`}>
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <UploadCloud className={`w-8 h-8 mb-3 ${error ? 'text-red-400' : 'text-slate-400'}`} />
        <p className={`text-sm font-semibold ${error ? 'text-red-500' : 'text-slate-600'}`}>
          {fileName ? fileName : 'Click to upload'}
        </p>
      </div>
      <input type="file" multiple={multiple} onChange={onChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
    </div>
    {error && <p className="text-red-500 text-xs font-bold mt-1.5">{error}</p>}
  </div>
);

const ReviewRow = ({ label, value, isPrice }) => (
  <div className="flex justify-between border-b pb-4 border-slate-200 last:border-0 last:pb-0">
    <span className="text-slate-500 font-medium text-sm">{label}</span>
    <span className={`font-bold ${isPrice ? 'text-[#0D6B64] text-lg' : 'text-slate-900'}`}>{value || '---'}</span>
  </div>
);

export default CreateAuction;