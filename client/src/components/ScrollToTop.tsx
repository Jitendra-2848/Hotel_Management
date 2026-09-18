import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export const ScrollToTop = () => {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // If navigating to a hash (e.g. #wishlist), don't force scroll to top
    if (!hash) {
      window.scrollTo(0, 0);
    }
  }, [pathname, search, hash]);

  return null;
};

export default ScrollToTop;
