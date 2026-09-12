import React, { useState } from "react";
import RegisterSkeleton from "../skeleton/Register_skeleton";

const RegisterImage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full h-full relative min-h-[260px] md:min-h-[540px] bg-gray-900 overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <RegisterSkeleton />
        </div>
      )}

      <img
        src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80"
        alt="Luxury Hotel Interior"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      />

      <div
        className={`absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white transition-opacity duration-500 z-20 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      >
        <h2 className="text-2xl font-bold tracking-tight">Join Crafters'Haven Suites</h2>
        <p className="text-gray-200 text-sm mt-1">
          Personalized experiences crafted for guests, staff, and management.
        </p>
      </div>
    </div>
  );
};

export default RegisterImage;
