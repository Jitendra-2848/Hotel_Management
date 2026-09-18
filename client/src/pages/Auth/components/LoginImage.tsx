import React, { useState } from "react";
import LoginSkeleton from "../skeleton/Login_skeleton";

const LoginImage: React.FC = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="w-full h-full relative min-h-[260px] md:min-h-[520px] bg-[#2A2A2A] overflow-hidden">
      {!isLoaded && (
        <div className="absolute inset-0 z-10">
          <LoginSkeleton />
        </div>
      )}

      <img
        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80"
        alt="Hotel Resort"
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      />

      <div
        className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-8 text-brand-white transition-opacity duration-500 z-20 ${isLoaded ? "opacity-100" : "opacity-0"
          }`}
      >
        <h2 className="text-2xl font-bold font-syne tracking-tight">Crafters'Haven Reserve</h2>
        <p className="text-[#FFF5F5]/90 text-xs mt-1 leading-relaxed">
          Experience seamless hospitality management and sanctuary comfort.
        </p>
      </div>
    </div>
  );
};

export default LoginImage;
