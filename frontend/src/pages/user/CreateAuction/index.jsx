import { Loader2 } from 'lucide-react';
import { useAuctionForm } from './hooks/useAuctionForm';
import { StepIndicator } from './components/FormUI';
import StepNavigation from './components/StepNavigation';
import StepAssetInfo from './components/StepAssetInfo';
import StepAuctionTerms from './components/StepAuctionTerms';
import StepReview from './components/StepReview';
import LoadingSpinner from '../../../components/common/LoadingSpinner';

export default function CreateAuction() {
  const {
    step, loading, isSubmitting, errors, categories, formData,
    updateField, handleFileChange,
    handleSpecChange, addSpecification, removeSpecification,
    toggleMarketing, goNext, goPrev, handleSubmit,
  } = useAuctionForm();

  if (loading) {
    return (
      <div className="min-h-screen pt-20">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 font-sans animate-[fadeIn_0.3s_ease-out]">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-[#111827] tracking-tight">Create New Auction</h1>
        <p className="text-[#64748b] mt-2 font-medium">List your premium asset on Mazad in three simple steps.</p>
      </div>

      <StepIndicator step={step} />

      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-8 sm:p-12">
        {step === 1 && (
          <StepAssetInfo
            formData={formData}
            errors={errors}
            categories={categories}
            updateField={updateField}
            handleFileChange={handleFileChange}
            handleSpecChange={handleSpecChange}
            addSpecification={addSpecification}
            removeSpecification={removeSpecification}
            toggleMarketing={toggleMarketing}
          />
        )}

        {step === 2 && (
          <StepAuctionTerms
            formData={formData}
            errors={errors}
            updateField={updateField}
          />
        )}

        {step === 3 && (
          <StepReview formData={formData} />
        )}

        <StepNavigation
          step={step}
          isSubmitting={isSubmitting}
          onPrev={goPrev}
          onNext={goNext}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}