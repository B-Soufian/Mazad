import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../hooks/useAuth';
import { assetApi } from '../../../../api/assetApi';
import { auctionApi } from '../../../../api/auctionApi';
import { categoryApi } from '../../../../api/categoryApi';

const MARKETING_MAP = {
  singleOwner:        'Single Owner',
  noAccidents:        'No Accidents',
  fullServiceHistory: 'Full Service History',
  warranty:           'Warranty',
  gccSpecs:           'GCC Specs',
  dealerMaintained:   'Dealer Maintained',
  pristineCondition:  'Pristine Condition',
  lowMileage:         'Low Mileage',
  originalPaint:      'Original Paint',
};

const INITIAL_FORM = {
  title:           '',
  categoryId:      '',
  conditionStatus: 'new',
  thumbnailFile:   null,
  galleryFiles:    [],
  specifications: [
    { id: 1, label: 'Mileage',      value: '' },
    { id: 2, label: 'Color',        value: '' },
    { id: 3, label: 'Transmission', value: '' },
  ],
  marketing: {
    singleOwner: false, noAccidents: false, fullServiceHistory: false,
    warranty: false, gccSpecs: false, dealerMaintained: false,
    pristineCondition: false, lowMileage: false, originalPaint: false,
  },
  startingPrice:    '',
  reservePrice:     '',
  buyNowPrice:      '',
  minimumIncrement: '500',
  startsAt:         '',
  endsAt:           '',
};

export function useAuctionForm() {
  const navigate      = useNavigate();
  const { user }      = useAuth();
  const [step, setStep]           = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors]       = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [formData, setFormData]   = useState(INITIAL_FORM);

  // Auth guard
  useEffect(() => {
    if (!localStorage.getItem('token')) navigate('/login');
  }, [navigate]);

  // Load categories
  useEffect(() => {
    categoryApi.getAll()
      .then(data => setCategories(data.data || data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Auto-select first category
  useEffect(() => {
    if (categories.length > 0 && !formData.categoryId) {
      setFormData(prev => ({ ...prev, categoryId: categories[0].id }));
    }
  }, [categories]);

  // ── Generic field updater ──────────────────────────────────────────────────
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  // ── File handlers ──────────────────────────────────────────────────────────
  const handleFileChange = (e, field) => {
    if (field === 'thumbnail') {
      updateField('thumbnailFile', e.target.files[0]);
    } else {
      const newFiles = Array.from(e.target.files); // capture BEFORE clearing
      setFormData(prev => {
        const existingNames = new Set(prev.galleryFiles.map(f => f.name));
        return {
          ...prev,
          galleryFiles: [
            ...prev.galleryFiles,
            ...newFiles.filter(f => !existingNames.has(f.name)),
          ],
        };
      });
    }
    e.target.value = null;
  };

  // ── Specification handlers ─────────────────────────────────────────────────
  const handleSpecChange = (id, field, value) =>
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map(s =>
        s.id === id ? { ...s, [field]: value } : s
      ),
    }));

  const addSpecification = () =>
    setFormData(prev => ({
      ...prev,
      specifications: [
        ...prev.specifications,
        { id: Date.now(), label: '', value: '' },
      ],
    }));

  const removeSpecification = (id) =>
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter(s => s.id !== id),
    }));

  // ── Marketing handler ──────────────────────────────────────────────────────
  const toggleMarketing = (key) =>
    setFormData(prev => ({
      ...prev,
      marketing: { ...prev.marketing, [key]: !prev.marketing[key] },
    }));

  // ── Per-step validation ────────────────────────────────────────────────────
  const validateStep = () => {
    const e = {};
    if (step === 1) {
      if (!formData.title.trim())    e.title         = 'Title is required';
      if (!formData.categoryId)      e.categoryId    = 'Category is required';
      if (!formData.thumbnailFile)   e.thumbnailFile = 'Thumbnail image is required';
    }
    if (step === 2) {
      if (!formData.startingPrice || Number(formData.startingPrice) <= 0)
        e.startingPrice = 'Valid starting price required';
      if (!formData.reservePrice || Number(formData.reservePrice) < Number(formData.startingPrice))
        e.reservePrice = 'Reserve must be ≥ Starting Price';
      if (!formData.startsAt) e.startsAt = 'Start date is required';
      if (!formData.endsAt)   e.endsAt   = 'End date is required';
      if (formData.startsAt && formData.endsAt &&
          new Date(formData.endsAt) <= new Date(formData.startsAt))
        e.endsAt = 'End date must be after start date';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goNext = () => { if (validateStep()) setStep(s => s + 1); };
  const goPrev = () => setStep(s => s - 1);

  // ── Final submit ───────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    setIsSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('category_id',      formData.categoryId);
      fd.append('title',            formData.title);
      fd.append('condition_status', formData.conditionStatus);

      if (formData.thumbnailFile) fd.append('thumbnail', formData.thumbnailFile);
      formData.galleryFiles.forEach(f => fd.append('gallery[]', f));

      const validSpecs = formData.specifications
        .filter(s => s.label.trim() && s.value.trim())
        .map(s => ({ label: s.label.trim(), value: s.value.trim() }));
      fd.append('specifications', JSON.stringify(validSpecs));

      const highlights = Object.entries(formData.marketing)
        .filter(([, v]) => v)
        .map(([k]) => MARKETING_MAP[k]);
      fd.append('marketing', JSON.stringify({ highlights }));

      const assetRes = await assetApi.createWithMedia(fd);

      await auctionApi.create({
        asset_id:          assetRes.asset?.id || assetRes.data?.id,
        starting_price:    Number(formData.startingPrice),
        reserve_price:     Number(formData.reservePrice),
        buy_now_price:     formData.buyNowPrice ? Number(formData.buyNowPrice) : null,
        minimum_increment: Number(formData.minimumIncrement),
        starts_at:         formData.startsAt,
        ends_at:           formData.endsAt,
      });

      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'An error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // state
    step, loading, isSubmitting, errors, categories, formData,
    // actions
    updateField, handleFileChange,
    handleSpecChange, addSpecification, removeSpecification,
    toggleMarketing,
    goNext, goPrev, handleSubmit,
  };
}
