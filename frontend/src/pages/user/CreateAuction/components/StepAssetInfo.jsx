import { Package, Image as ImageIcon } from 'lucide-react';
import { SectionTitle, Input, Select } from './FormUI';
import MediaUpload from './MediaUpload';
import SpecificationsEditor from './SpecificationsEditor';
import MarketingHighlights from './MarketingHighlights';

export default function StepAssetInfo({
  formData, errors, categories,
  updateField, handleFileChange,
  handleSpecChange, addSpecification, removeSpecification,
  toggleMarketing,
}) {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Asset Identity */}
      <div>
        <SectionTitle icon={<Package size={22} />} title="Asset Identity" subtitle="Basic details about the item you are auctioning." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2">
            <Input
              error={errors.title}
              label="Asset Title"
              value={formData.title}
              onChange={e => updateField('title', e.target.value)}
              placeholder="e.g. 2021 Range Rover Sport HSE"
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
      </div>

      {/* Media Upload */}
      <div>
        <SectionTitle icon={<ImageIcon size={22} />} title="Media Upload" subtitle="High-quality images attract more premium bidders." />
        <MediaUpload
          formData={formData}
          errors={errors}
          onFileChange={handleFileChange}
          onRemoveThumbnail={() => updateField('thumbnailFile', null)}
          onRemoveGallery={(i) =>
            updateField('galleryFiles', formData.galleryFiles.filter((_, idx) => idx !== i))
          }
          onClearGallery={() => updateField('galleryFiles', [])}
        />
      </div>

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
    </div>
  );
}
