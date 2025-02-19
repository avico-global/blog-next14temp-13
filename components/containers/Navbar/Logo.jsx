import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const Logo = ({ logo, imagePath }) => {
  const [hostName, setHostName] = useState("");
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHostName(window.location.hostname);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("resize", handleResize);
      };
    }
  }, []);

  if (!logo || !logo.value) {
    return null;
  }

  const {
    logoType,
    logoText,
    logoHeight,
    logoWidth,
    fontSize,
    isBold,
    isItalic,
  } = logo.value;

  const imageSrc = `${imagePath}/${logo.file_name}`;

  // Calculate dynamic height for different screen sizes
  const dynamicLogoHeight = windowWidth < 768 
    ? Math.min(40, logoHeight)
    : windowWidth < 1200 
    ? Math.min(Math.floor(logoHeight * 0.85), logoHeight)
    : logoHeight;

  // Calculate width while maintaining aspect ratio
  const aspectRatio = logoWidth / logoHeight;
  const dynamicLogoWidth = Math.floor(dynamicLogoHeight * aspectRatio * 2);

  // Inline style with proper aspect ratio maintenance
  const logoStyle = {
    height: `${dynamicLogoHeight}px`,
    width: `${dynamicLogoWidth}px`,
    objectFit: 'contain',
    maxWidth: '120%',
  };

  return (
    <Link
      title={`Logo - ${hostName}` || "logo"}
      href="/"
      className="flex items-center justify-center mr-10"
    >
      {logoType === "image" ? (
        <Image
          height={dynamicLogoHeight}
          width={dynamicLogoWidth}
          src={imageSrc}
          title={`Logo - ${hostName}` || "logo"}
          alt={`${logoText || "logo"} - ${hostName}`}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          style={logoStyle}
        />
      ) : logoType === "text" ? (
        <h2
          className="text-4xl font-extrabold py-1 whitespace-nowrap"
          style={{
            fontSize: `${fontSize}px`,
            fontWeight: isBold ? "bold" : "normal",
            fontStyle: isItalic ? "italic" : "normal",
          }}
        >
          {logoText}
        </h2>
      ) : null}
    </Link>
  );
};

export default Logo;
