import React from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import FullContainer from "../common/FullContainer";
import Container from "../common/Container";
import Logo from "./Navbar/Logo";

export default function Footer({ logo, imagePath }) {
  const handleClick = (e) => {
    e.preventDefault();
    window.location.href = "/sitemap.xml";
  };

  return (
    <FullContainer className="bg-white text-black py-16">
      <Container>
        <div className="flex flex-col items-center">
          {/* Logo Section */}
          <Logo logo={logo} imagePath={imagePath} />

          {/* Social Icons */}
          <div className="flex items-center gap-4 my-8">
            {[Facebook, Twitter, Youtube, Instagram].map((Icon, index) => (
              <a
                key={index}
                href="#"
                title={`${Icon.name} Icon`}
                className="hover:bg-white/10 border border-white/20 rounded-full p-2 transition-all duration-300 hover:scale-110"
              >
                <Icon size={20} />
              </a>
            ))}
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap justify-center gap-6 w-full max-w-3xl">
            {[
              { title: "Home", href: "/" },
              { title: "About", href: "/about-us" },
              { title: "Contact", href: "/contact-us" },
              { title: "Terms & Conditions", href: "/terms-and-conditions" },
              { title: "Privacy Policy", href: "/privacy-policy" },
              { title: "Sitemap", href: "/sitemap.xml", onClick: handleClick },
            ].map((link) => (
              <Link
                key={link.title}
                href={link.href}
                title={link.title}
                onClick={link.onClick}
                className="text-sm uppercase hover:text-primary transition-colors duration-300"
              >
                {link.title}
              </Link>
            ))}
          </nav>
        </div>
      </Container>
    </FullContainer>
  );
}
