import { FileCheck } from 'lucide-react';
import { SectionTitle, ReviewRow } from './FormUI';

export default function StepReview({ formData }) {
  const activeHighlights = Object.entries(formData.marketing)
    .filter(([, val]) => val)
    .map(([key]) => key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()));

  const validSpecs = formData.specifications.filter(s => s.label.trim() && s.value.trim());

  return (
    <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
      <SectionTitle icon={<FileCheck size={22} />} title="Review & Publish" subtitle="Verify all details before launching your auction to the public." />

      {/* Preview thumbnail */}
      {formData.thumbnailFile && (
        <div className="rounded-2xl overflow-hidden h-52 border border-gray-100 shadow-sm">
          <img src={URL.createObjectURL(formData.thumbnailFile)} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="bg-gray-50/50 p-8 rounded-2xl border border-gray-100 space-y-5">
        <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">Asset Details</p>
        <ReviewRow label="Asset Title" value={formData.title} />
        <ReviewRow label="Condition" value={formData.conditionStatus.toUpperCase()} />
        <ReviewRow label="Gallery Images" value={`${formData.galleryFiles.length} photo(s)`} />
        {validSpecs.length > 0 && (
          <div className="pt-2">
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest mb-3">Specifications</p>
            <div className="grid grid-cols-2 gap-x-8 gap-y-2">
              {validSpecs.map(s => (
                <ReviewRow key={s.id} label={s.label} value={s.value} />
              ))}
            </div>
          </div>
        )}
        {activeHighlights.length > 0 && (
          <div className="pt-2">
            <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest mb-3">Marketing Highlights</p>
            <div className="flex flex-wrap gap-2">
              {activeHighlights.map(h => (
                <span key={h} className="bg-[#d71939]/10 text-[#d71939] text-[12px] font-bold px-3 py-1 rounded-full">{h}</span>
              ))}
            </div>
          </div>
        )}

        <div className="h-px w-full bg-gray-200 my-2" />

        <p className="text-[11px] font-bold text-[#64748b] uppercase tracking-widest">Auction Terms</p>
        <ReviewRow label="Starting Bid"  value={`MAD ${Number(formData.startingPrice || 0).toLocaleString()}`} isPrice />
        <ReviewRow label="Reserve Price" value={`MAD ${Number(formData.reservePrice  || 0).toLocaleString()}`} isPrice />
        {formData.buyNowPrice && (
          <ReviewRow label="Buy Now Price" value={`MAD ${Number(formData.buyNowPrice).toLocaleString()}`} isPrice />
        )}
        <ReviewRow
          label="Auction Timeline"
          value={formData.startsAt && formData.endsAt
            ? `${new Date(formData.startsAt).toLocaleString()} — ${new Date(formData.endsAt).toLocaleString()}`
            : '—'
          }
        />
      </div>
    </div>
  );
}
