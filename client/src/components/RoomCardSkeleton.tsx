import React from "react";

export const RoomCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col gap-2.5 w-full min-w-0 max-w-full animate-pulse">
      {/* Image Skeleton */}
      <div className="w-full aspect-[4/3] rounded-2xl bg-[#F7D6D0]/30 overflow-hidden relative border border-[#E2B4BD]/20">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>

      {/* Title & Badge */}
      <div className="space-y-1.5 px-0.5">
        <div className="flex items-center justify-between gap-2">
          <div className="h-4 bg-[#F7D6D0]/40 rounded-md w-3/4" />
          <div className="h-4 bg-[#F7D6D0]/30 rounded-md w-8" />
        </div>

        {/* Subtitle / Features */}
        <div className="h-3 bg-[#F7D6D0]/25 rounded-md w-1/2" />

        {/* Price Row */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-4 bg-[#F7D6D0]/40 rounded-md w-24" />
          <div className="h-3 bg-[#F7D6D0]/20 rounded-md w-16" />
        </div>
      </div>
    </div>
  );
};

export default RoomCardSkeleton;
