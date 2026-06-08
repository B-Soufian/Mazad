import { Gavel, Calendar } from 'lucide-react';
import { SectionTitle, Input } from './FormUI';

export default function StepAuctionTerms({ formData, errors, updateField }) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Pricing */}
      <div>
        <SectionTitle icon={<Gavel size={22} />} title="Pricing Strategy" subtitle="Set your financial parameters and reserve prices." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            error={errors.startingPrice}
            type="number"
            label="Starting Bid (MAD)"
            value={formData.startingPrice}
            onChange={e => updateField('startingPrice', e.target.value)}
            placeholder="0.00"
          />
          <Input
            error={errors.reservePrice}
            type="number"
            label="Reserve Price (MAD)"
            value={formData.reservePrice}
            onChange={e => updateField('reservePrice', e.target.value)}
            placeholder="0.00"
          />
          <Input
            type="number"
            label="Buy Now Price (Optional)"
            value={formData.buyNowPrice}
            onChange={e => updateField('buyNowPrice', e.target.value)}
            placeholder="0.00"
          />
          <Input
            type="number"
            label="Minimum Bid Increment (MAD)"
            value={formData.minimumIncrement}
            onChange={e => updateField('minimumIncrement', e.target.value)}
            placeholder="500"
          />
        </div>
      </div>

      {/* Timeline */}
      <div>
        <SectionTitle icon={<Calendar size={22} />} title="Timeline" subtitle="When should the auction start and end?" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Input
            error={errors.startsAt}
            type="datetime-local"
            label="Start Date & Time"
            value={formData.startsAt}
            onChange={e => updateField('startsAt', e.target.value)}
          />
          <Input
            error={errors.endsAt}
            type="datetime-local"
            label="End Date & Time"
            value={formData.endsAt}
            onChange={e => updateField('endsAt', e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
