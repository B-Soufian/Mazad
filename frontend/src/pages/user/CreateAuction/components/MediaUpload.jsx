import { UploadCloud, Plus, Trash2 } from 'lucide-react';

export default function MediaUpload({ formData, errors, onFileChange, onRemoveGallery, onClearGallery, onRemoveThumbnail }) {
  return (
    <div className="space-y-6">
      {/* Thumbnail Upload */}
      <div>
        <label className="block text-[12px] font-bold text-[#64748b] uppercase tracking-wider mb-3">
          Primary Thumbnail <span className="text-red-500">*</span>
        </label>
        {formData.thumbnailFile ? (
          <div className="relative rounded-2xl overflow-hidden border-2 border-[#d71939] group">
            <img
              src={URL.createObjectURL(formData.thumbnailFile)}
              alt="Thumbnail preview"
              className="w-full h-56 object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
              <label className="bg-white text-[#111827] text-sm font-bold px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-100 transition">
                Change Image
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e, 'thumbnail')} />
              </label>
              <button
                onClick={onRemoveThumbnail}
                className="bg-red-500 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            </div>
            <div className="absolute top-3 left-3 bg-[#d71939] text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
              Main Photo
            </div>
          </div>
        ) : (
          <label className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-2xl cursor-pointer transition-all ${
            errors.thumbnailFile
              ? 'border-red-400 bg-red-50'
              : 'border-gray-300 bg-gray-50 hover:border-[#d71939] hover:bg-red-50/30'
          }`}>
            <UploadCloud className={`w-10 h-10 mb-3 ${errors.thumbnailFile ? 'text-red-400' : 'text-gray-400'}`} />
            <p className={`text-[14px] font-semibold ${errors.thumbnailFile ? 'text-red-600' : 'text-[#475569]'}`}>
              Click to upload main photo
            </p>
            <p className="text-[12px] text-gray-400 mt-1">PNG, JPG, WEBP up to 10MB</p>
            <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileChange(e, 'thumbnail')} />
          </label>
        )}
        {errors.thumbnailFile && (
          <p className="text-red-500 text-[13px] font-bold mt-2 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" />{errors.thumbnailFile}
          </p>
        )}
      </div>

      {/* Gallery Upload */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-[12px] font-bold text-[#64748b] uppercase tracking-wider">
            Gallery Images{' '}
            <span className="text-gray-400 font-medium normal-case">({formData.galleryFiles.length} added)</span>
          </label>
          {formData.galleryFiles.length > 0 && (
            <button onClick={onClearGallery} className="text-[12px] text-red-500 font-bold hover:underline">
              Clear All
            </button>
          )}
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {formData.galleryFiles.map((file, i) => (
            <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group shadow-sm">
              <img src={URL.createObjectURL(file)} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
              <button
                onClick={() => onRemoveGallery(i)}
                className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow-md"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-[#d71939] hover:bg-red-50/30 transition group">
            <Plus size={22} className="text-gray-400 group-hover:text-[#d71939] transition" />
            <span className="text-[11px] text-gray-400 mt-1 font-medium">Add</span>
            <input type="file" accept="image/*" multiple className="hidden" onChange={(e) => onFileChange(e, 'gallery')} />
          </label>
        </div>
      </div>
    </div>
  );
}
