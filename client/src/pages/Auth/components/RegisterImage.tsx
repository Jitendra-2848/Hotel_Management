import React, { useState } from "react";
import RegisterSkeleton from "../skeleton/Register_skeleton";

const RegisterImage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full h-full relative min-h-[260px] md:min-h-[540px] bg-[#2A2A2A] overflow-hidden">
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
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-brand-white transition-opacity duration-500 z-20 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      >
        <h2 className="text-2xl font-bold font-syne tracking-tight">Join Crafters'Haven Reserve</h2>
        <p className="text-[#FFF5F5]/90 text-xs mt-1 leading-relaxed">
          Personalized alpine retreats crafted for discerning travelers and sanctuary hosts.
        </p>
      </div>
    </div>
  );
};

export default RegisterImage;
