import React, { useState } from "react";
import { X, Sparkles, Image as ImageIcon, Check } from "lucide-react";
import { NewRoomFormData, CURATED_UNSPLASH_PRESETS } from "../types";

interface AddRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: NewRoomFormData) => Promise<void>;
  hostEmail: string;
  hostName: string;
}

export const AddRoomModal: React.FC<AddRoomModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  hostEmail,
  hostName,
}) => {
  const [formData, setFormData] = useState<NewRoomFormData>({
    name: "",
    category: "chalet",
    price: 490,
    size: "1,200 sq ft",
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    bed: "1 King Plush Bed",
    tagline: "High alpine timber sanctuary with heated cedar hot tub and mountain panorama",
    description:
      "Architectural timber sanctuary crafted with Douglas fir beams, floor-to-ceiling panoramic glass, hand-cut river stone hearth, and private heated cedar spa tub.",
    featuredImage: CURATED_UNSPLASH_PRESETS[0].url,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (url: string, category: any) => {
    setFormData((prev) => ({
      ...prev,
      featuredImage: url,
      category,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setErrorMessage("Please provide a name for the sanctuary.");
      return;
    }
    if (formData.price <= 0) {
      setErrorMessage("Price must be greater than zero.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      await onSubmit(formData);
      onClose();
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create sanctuary listing. Please verify inputs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-[#EBEBEB] space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#EBEBEB]">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-bold font-syne text-[#222222]">
                List a New Alpine Sanctuary
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-[#FFF0F2] text-[#FF385C] text-[10px] font-bold">
                Host Verified
              </span>
            </div>
            <p className="text-xs text-[#717171] mt-0.5">
              Publishing under host account: <strong className="text-[#222222]">{hostEmail}</strong> ({hostName})
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#F2F2F2] text-[#717171] hover:text-[#222222] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          {/* SECTION 1: CURATED UNSPLASH PHOTOGRAPHY SELECTOR */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-[11px] font-bold text-[#222222]">
                Select Curated Alpine Architecture Photography (Unsplash)
              </label>
              <span className="text-[10px] text-[#717171] flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#FF385C]" />
                Bespoke High-Res
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {CURATED_UNSPLASH_PRESETS.map((preset) => {
                const isSelected = formData.featuredImage === preset.url;
                return (
                  <div
                    key={preset.id}
                    onClick={() => handleSelectPreset(preset.url, preset.category)}
                    className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition group ${
                      isSelected ? "border-[#FF385C] shadow-sm" : "border-transparent hover:border-[#E5E5E5]"
                    }`}
                  >
                    <img
                      src={preset.url}
                      alt={preset.title}
                      className="w-full h-20 object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-2">
                      <span className="text-[10px] font-bold text-white leading-tight line-clamp-1">
                        {preset.title}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#FF385C] text-white flex items-center justify-center">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CUSTOM IMAGE URL WITH LIVE PREVIEW */}
          <div>
            <label className="block text-[11px] font-bold text-[#222222] mb-1">
              Or Enter Custom Unsplash Image URL
            </label>
            <div className="flex gap-3 items-center">
              <div className="relative flex-1">
                <ImageIcon className="w-4 h-4 text-[#999999] absolute left-3 top-2.5" />
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.featuredImage}
                  onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#222222] text-xs"
                />
              </div>
              {formData.featuredImage && (
                <div className="w-12 h-10 rounded-lg overflow-hidden border border-[#EBEBEB] shrink-0 bg-[#F5F5F5]">
                  <img
                    src={formData.featuredImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback on invalid image
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* SANCTUARY NAME & CATEGORY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#222222] mb-1">
                Sanctuary Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Matterhorn Stargazer Alpine Chalet"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#222222]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#222222] mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-2.5 rounded-xl border border-[#E5E5E5] bg-white focus:outline-none focus:border-[#222222]"
              >
                <option value="chalet">Alpine Chalet</option>
                <option value="villa">Forest & Stream Villa</option>
                <option value="penthouse">Summit Penthouse</option>
                <option value="loft">Artisan Ski Loft</option>
                <option value="dome">Celestial Stargazing Dome</option>
              </select>
            </div>
          </div>

          {/* NIGHTLY RATE & SPECS */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#222222] mb-1">
                Nightly Rate ($ USD) *
              </label>
              <input
                type="number"
                min="50"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#222222]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#222222] mb-1">
                Max Guests
              </label>
              <input
                type="number"
                min="1"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#222222] mb-1">
                Bedrooms
              </label>
              <input
                type="number"
                min="1"
                value={formData.bedrooms}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#222222] mb-1">
                Bathrooms
              </label>
              <input
                type="number"
                min="1"
                value={formData.bathrooms}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
                className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none"
              />
            </div>
          </div>

          {/* BEDDING CONFIGURATION & TAGLINE */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-[#222222] mb-1">
                Bedding Configuration
              </label>
              <input
                type="text"
                placeholder="e.g. 1 King Plush Bed + 1 Queen Loft"
                value={formData.bed}
                onChange={(e) => setFormData({ ...formData, bed: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#222222]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#222222] mb-1">
                Tagline / Catchphrase
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#222222]"
              />
            </div>
          </div>

          {/* EDITORIAL DESCRIPTION */}
          <div>
            <label className="block text-[11px] font-bold text-[#222222] mb-1">
              Architectural & Experience Description
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-2.5 rounded-xl border border-[#E5E5E5] focus:outline-none focus:border-[#222222] resize-none"
            />
          </div>

          {/* ACTIONS */}
          <div className="pt-3 border-t border-[#EBEBEB] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-full border border-[#E5E5E5] hover:bg-[#F7F7F8] text-[#4A4A4A] text-xs font-semibold transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 rounded-full bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold shadow-md shadow-[#FF385C]/20 transition cursor-pointer active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? "Publishing..." : "Publish Sanctuary"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;
