import { useRef } from "react";
import useIntersectionObserver from "@react-hook/intersection-observer";

const LazyIframe = ({ url = "", title, className }) => {
  const containerRef = useRef();
  const lockRef = useRef(false);
  const { isIntersecting } = useIntersectionObserver(containerRef);

  if (isIntersecting) {
    lockRef.current = true;
  }

  // Safely construct the URL with the https protocol
  const safeUrl = url.startsWith("https://") ? url : `https://${url}`;

  return (
    <div className="w-full h-full relative overflow-hidden" ref={containerRef}>
      {lockRef.current && (
        <iframe
          title={title}
          className={className}
          src={safeUrl}
          frameBorder="0"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen="allowFullScreen"
        ></iframe>
      )}
    </div>
  );
};

export default LazyIframe;
