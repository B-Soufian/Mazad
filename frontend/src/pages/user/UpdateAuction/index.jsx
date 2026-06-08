import { useNavigate, useParams } from 'react-router-dom';
import { ChevronLeft, Check, Loader2, Gavel, Calendar, AlertCircle } from 'lucide-react';
import { useUpdateAuction } from './hooks/useUpdateAuction';
import { SectionTitle, Input, Select } from '../CreateAuction/components/FormUI';
import SpecificationsEditor from '../CreateAuction/components/SpecificationsEditor';
import MarketingHighlights from '../CreateAuction/components/MarketingHighlights';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function UpdateAuction() {
  const { id }   = useParams();
  const navigate = useNavigate();

  const {
    loading, isSubmitting, errors, categories, auction, formData,
    updateField,
    handleSpecChange, addSpecification, removeSpecification,
    toggleMarketing, handleSubmit,
  } = useUpdateAuction(id);

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans">
      {/* Header */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={() => navigate('/profile')}
          className="p-2 rounded-xl border border-gray-200 text-gray-400 hover:text-[#d71939] hover:border-[#d71939] transition"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-[#111827] tracking-tight">Update Auction</h1>
          <p className="text-[#64748b] text-[15px] mt-0.5">
            Editing: <span className="font-bold text-[#111827]">{auction?.asset?.title}</span>
          </p>
        </div>
      </div>

      {/* Status banner */}
      {auction?.status && (
        <div className={`mb-6 flex items-center gap-3 px-5 py-3.5 rounded-xl border text-[14px] font-semibold ${
          auction.status === 'live'
            ? 'bg-[#fef2f2] border-[#fee2e2] text-[#d71939]'
            : 'bg-gray-50 border-gray-200 text-gray-600'
        }`}>
          <AlertCircle size={18} />
          Auction is currently <span className="font-bold uppercase ml-1">{auction.status}</span>
          {auction.status === 'live' && ' — some fields may be restricted while bidding is active.'}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 sm:p-12 space-y-10">

        {/* Asset details */}
        <section>
          <SectionTitle icon={<Gavel size={22} />} title="Asset Details" subtitle="Update the core information for this asset." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="md:col-span-2">
              <Input
                error={errors.title}
                label="Asset Title"
                value={formData.title}
                onChange={e => updateField('title', e.target.value)}
              />
            </div>
            <Select
              label="Category"
              options={categories}
              value={formData.categoryId}
              onChange={e => updateField('categoryId', e.target.value)}
            />
            <Select
              label="Condition"
              options={[
                { id: 'new',       name: 'Brand New' },
                { id: 'excellent', name: 'Excellent' },
                { id: 'good',      name: 'Good' },
                { id: 'fair',      name: 'Fair' },
              ]}
              value={formData.conditionStatus}
              onChange={e => updateField('conditionStatus', e.target.value)}
            />
          </div>
        </section>

        {/* Specifications */}
        <SpecificationsEditor
          specifications={formData.specifications}
          onAdd={addSpecification}
          onRemove={removeSpecification}
          onChange={handleSpecChange}
        />

        {/* Marketing */}
        <MarketingHighlights
          marketing={formData.marketing}
          onToggle={toggleMarketing}
        />

        {/* Pricing */}
        <section>
          <SectionTitle icon={<Gavel size={22} />} title="Pricing Strategy" subtitle="Adjust your bid parameters." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input error={errors.startingPrice} type="number" label="Starting Bid (MAD)"       value={formData.startingPrice}    onChange={e => updateField('startingPrice',    e.target.value)} placeholder="0.00" />
            <Input error={errors.reservePrice}  type="number" label="Reserve Price (MAD)"      value={formData.reservePrice}     onChange={e => updateField('reservePrice',     e.target.value)} placeholder="0.00" />
            <Input                              type="number" label="Buy Now Price (Optional)"  value={formData.buyNowPrice}      onChange={e => updateField('buyNowPrice',      e.target.value)} placeholder="0.00" />
            <Input                              type="number" label="Min Bid Increment (MAD)"   value={formData.minimumIncrement} onChange={e => updateField('minimumIncrement', e.target.value)} placeholder="500" />
          </div>
        </section>

        {/* Timeline */}
        <section>
          <SectionTitle icon={<Calendar size={22} />} title="Timeline" subtitle="Adjust the auction schedule." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Input error={errors.startsAt} type="datetime-local" label="Start Date & Time" value={formData.startsAt} onChange={e => updateField('startsAt', e.target.value)} />
            <Input error={errors.endsAt}   type="datetime-local" label="End Date & Time"   value={formData.endsAt}   onChange={e => updateField('endsAt',   e.target.value)} />
          </div>
        </section>

        {/* Actions */}
        <div className="flex items-center justify-between pt-8 border-t border-gray-100">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 font-bold px-6 py-3 rounded-xl text-[#64748b] hover:bg-gray-100 hover:text-[#111827] transition-all"
          >
            <ChevronLeft size={20} /> Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-[#d71939] hover:bg-[#b5142e] disabled:opacity-70 text-white px-10 py-3.5 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-red-900/20 transition-all"
          >
            {isSubmitting ? (
              <><Loader2 size={20} className="animate-spin" /> Saving Changes...</>
            ) : (
              <><Check size={20} strokeWidth={3} /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
