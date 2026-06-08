import { ChevronLeft, ChevronRight, Check, Loader2 } from 'lucide-react';

export default function StepNavigation({ step, totalSteps = 3, isSubmitting, onPrev, onNext, onSubmit }) {
  return (
    <div className="mt-14 flex items-center justify-between pt-8 border-t border-gray-100">
      {/* Back */}
      <button
        onClick={onPrev}
        disabled={step === 1 || isSubmitting}
        className={`flex items-center gap-2 font-bold px-6 py-3 rounded-xl transition-all ${
          step === 1
            ? 'opacity-0 pointer-events-none'
            : 'text-[#64748b] hover:bg-gray-100 hover:text-[#111827]'
        }`}
      >
        <ChevronLeft size={20} /> Go Back
      </button>

      {/* Next / Submit */}
      {step < totalSteps ? (
        <button
          onClick={onNext}
          className="bg-[#111827] text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg hover:bg-black transition-all"
        >
          Continue to {step === 1 ? 'Pricing' : 'Review'} <ChevronRight size={20} />
        </button>
      ) : (
        <button
          onClick={onSubmit}
          disabled={isSubmitting}
          className="bg-[#d71939] hover:bg-[#b5142e] disabled:opacity-70 text-white px-10 py-3.5 rounded-xl font-bold flex items-center gap-3 shadow-lg shadow-red-900/20 transition-all"
        >
          {isSubmitting ? (
            <><Loader2 size={20} className="animate-spin" /> Publishing Auction...</>
          ) : (
            <><Check size={20} strokeWidth={3} /> Launch Auction Now</>
          )}
        </button>
      )}
    </div>
  );
}
