import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const REVERSE_MARKETING = Object.fromEntries(
  Object.entries(MARKETING_MAP).map(([k, v]) => [v, k])
);

const EMPTY_MARKETING = Object.fromEntries(
  Object.keys(MARKETING_MAP).map(k => [k, false])
);

const toDatetimeLocal = (dt) => dt ? new Date(dt).toISOString().slice(0, 16) : '';

export function useUpdateAuction(id) {
  const navigate = useNavigate();

  const [loading, setLoading]           = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors]             = useState({});
  const [categories, setCategories]     = useState([]);
  const [auction, setAuction]           = useState(null);
  const [formData, setFormData]         = useState({
    title:            '',
    categoryId:       '',
    conditionStatus:  'excellent',
    specifications:   [],
    marketing:        { ...EMPTY_MARKETING },
    startingPrice:    '',
    reservePrice:     '',
    buyNowPrice:      '',
    minimumIncrement: '500',
    startsAt:         '',
    endsAt:           '',
  });

  // ── Load auction + categories ──────────────────────────────────────────────
  useEffect(() => {
    if (!localStorage.getItem('token')) { navigate('/login'); return; }

    const load = async () => {
      try {
        const [auctionRes, catRes] = await Promise.all([
          auctionApi.getById(id),
          categoryApi.getAll(),
        ]);

        const a     = auctionRes.data || auctionRes;
        const asset = a.asset || {};

        setAuction(a);
        setCategories(catRes.data || catRes);

        // Hydrate marketing checkboxes
        const highlights = asset.marketing?.highlights || [];
        const marketing  = { ...EMPTY_MARKETING };
        highlights.forEach(label => {
          const key = REVERSE_MARKETING[label];
          if (key) marketing[key] = true;
        });

        // Hydrate specifications (fall back to 3 defaults if none stored)
        const raw = asset.specifications || [];
        const specs = raw.length > 0
          ? raw.map((s, i) => ({ id: i + 1, label: s.label || s.name || '', value: s.value || '' }))
          : [
              { id: 1, label: 'Mileage',      value: '' },
              { id: 2, label: 'Color',         value: '' },
              { id: 3, label: 'Transmission',  value: '' },
            ];

        setFormData({
          title:            asset.title            || '',
          categoryId:       asset.category_id      || asset.category?.id || '',
          conditionStatus:  asset.condition_status || 'excellent',
          specifications:   specs,
          marketing,
          startingPrice:    a.starting_price    || '',
          reservePrice:     a.reserve_price     || '',
          buyNowPrice:      a.buy_now_price     || '',
          minimumIncrement: a.minimum_increment || '500',
          startsAt:         toDatetimeLocal(a.starts_at),
          endsAt:           toDatetimeLocal(a.ends_at),
        });
      } catch (err) {
        console.error('Failed to load auction:', err);
        alert('Could not load auction data.');
        navigate('/profile');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  // ── Field helpers ──────────────────────────────────────────────────────────
  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }));
  };

  const handleSpecChange = (specId, field, value) =>
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.map(s =>
        s.id === specId ? { ...s, [field]: value } : s
      ),
    }));

  const addSpecification = () =>
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { id: Date.now(), label: '', value: '' }],
    }));

  const removeSpecification = (specId) =>
    setFormData(prev => ({
      ...prev,
      specifications: prev.specifications.filter(s => s.id !== specId),
    }));

  const toggleMarketing = (key) =>
    setFormData(prev => ({
      ...prev,
      marketing: { ...prev.marketing, [key]: !prev.marketing[key] },
    }));

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!formData.title.trim())
      e.title = 'Title is required';
    if (!formData.startingPrice || Number(formData.startingPrice) <= 0)
      e.startingPrice = 'Valid starting price required';
    if (!formData.reservePrice || Number(formData.reservePrice) < Number(formData.startingPrice))
      e.reservePrice = 'Reserve must be ≥ Starting Price';
    if (!formData.startsAt) e.startsAt = 'Start date is required';
    if (!formData.endsAt)   e.endsAt   = 'End date is required';
    if (formData.startsAt && formData.endsAt &&
        new Date(formData.endsAt) <= new Date(formData.startsAt))
      e.endsAt = 'End date must be after start date';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!validate()) return;
    setIsSubmitting(true);
    try {
      const validSpecs = formData.specifications
        .filter(s => s.label.trim() && s.value.trim())
        .map(s => ({ label: s.label.trim(), value: s.value.trim() }));

      const highlights = Object.entries(formData.marketing)
        .filter(([, v]) => v)
        .map(([k]) => MARKETING_MAP[k]);

      await auctionApi.update(id, {
        title:             formData.title,
        category_id:       formData.categoryId,
        condition_status:  formData.conditionStatus,
        specifications:    validSpecs,
        marketing:         { highlights },
        starting_price:    Number(formData.startingPrice),
        reserve_price:     Number(formData.reservePrice),
        buy_now_price:     formData.buyNowPrice ? Number(formData.buyNowPrice) : null,
        minimum_increment: Number(formData.minimumIncrement),
        starts_at:         formData.startsAt,
        ends_at:           formData.endsAt,
      });

      navigate('/profile');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    // state
    loading, isSubmitting, errors, categories, auction, formData,
    // actions
    updateField,
    handleSpecChange, addSpecification, removeSpecification,
    toggleMarketing,
    handleSubmit,
  };
}
