import React, { useState, useEffect, useRef, useCallback } from "react";
import Logo from "./Logo";
import Link from "next/link";
import Image from "next/image";
import { sanitizeUrl } from "@/lib/myFun";
import { Menu, Search, X } from "lucide-react";
import Container from "@/components/common/Container";
import FullContainer from "@/components/common/FullContainer";

export default function Navbar({ logo, categories, imagePath, blog_list }) {
  const sidebarRef = useRef(null);
  const searchInputRef = useRef(null);
  const [sidebar, setSidebar] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const lastThreeBlogs = blog_list.slice(-3);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close sidebar if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setSidebar(false);
      }
    };

    if (sidebar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [sidebar]);

  // Update click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      const searchContainer = document.querySelector(".search-container");
      if (
        isSearchOpen &&
        searchContainer &&
        !searchContainer.contains(event.target)
      ) {
        setIsSearchOpen(false);
        setSearchQuery(""); // Clear search when closing
      }
    };

    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchOpen]);

  // Debounce search query
  const debounceSearch = useCallback(() => {
    if (searchQuery) {
      const filtered = blog_list.filter((blog) =>
        blog.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
    } else {
      setFilteredBlogs([]);
    }
  }, [searchQuery, blog_list]);

  useEffect(() => {
    const timeoutId = setTimeout(debounceSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, debounceSearch]);

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      // Focus the input when opening
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 100);
    }
  };

  return (
    <>
      <FullContainer
        className={`${
          isScrolled ? "bg-white" : "bg-theme"
        } text-black sticky top-0 z-20 transition-colors duration-300`}
      >
          <div className="flex items-center justify-between gap-3 mx-auto py-5 w-full lg:px-20 ">
            <div className="flex items-start ">
              <Logo logo={logo} imagePath={imagePath} />
            </div>
            <div className=" flex ">
              <nav className="hidden lg:flex items-center gap-5 uppercase">
                <Link href="/" title="Home" className="hover:text-primary">
                  Home
                </Link>
                <div
                  className="relative group"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                    className="hover:text-primary uppercase"
                    aria-expanded={isDropdownOpen}
                    aria-controls="categoriesDropdown"
                  >
                    Categories
                  </button>

                  {isDropdownOpen && (
                    <div
                      id="categoriesDropdown"
                      className="absolute left-1/2 -translate-x-1/2 top-[calc(30%+1rem)] bg-white/95 backdrop-blur-md 
                        text-black shadow-2xl rounded-2xl z-50 p-6 w-[500px] grid grid-cols-2 gap-4 
                        border border-gray-100 transform transition-all duration-300 animate-fadeIn"
                    >
                      {categories.map((category, index) => (
                        <Link
                          key={index}
                          href={`/${sanitizeUrl(category.title)}`}
                          className="group relative overflow-hidden rounded-xl"
                          title={category.title}
                        >
                          <div className="relative flex items-center gap-4 p-3 hover:bg-theme/5 transition-all duration-300
                            before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-primary 
                            before:transform before:scale-y-0 before:transition-transform before:duration-300
                            group-hover:before:scale-y-100"
                          >
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                              <Image
                                src={`${imagePath}/${category.image}`}
                                alt={category.title}
                                title={category.title}
                                fill
                                className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium capitalize text-lg group-hover:text-primary transition-colors">
                                {category.title}
                              </span>
                              <span className="text-sm text-gray-500 group-hover:text-primary/70 transition-colors">
                                View articles →
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                <Link
                  title="Contact"
                  href="/contact"
                  className="hover:text-primary"
                >
                  Contact Us
                </Link>
                <Link
                  title="About"
                  href="/about"
                  className="hover:text-primary"
                >
                  About Us
                </Link>
              </nav>

              {/* Search Section */}
              <div className="flex items-center justify-end gap-3 relative search-container">
                <div className="hidden lg:flex items-center rounded-full relative">
                  <button
                    onClick={toggleSearch}
                    className="p-2 hover:text-primary transition-all duration-300 relative z-10"
                    aria-label="Toggle search"
                  >
                    {isSearchOpen ? (
                      <X className="w-4 h-4 transition-transform duration-300" aria-hidden="true" />
                    ) : (
                      <Search className="w-4 h-4 transition-transform duration-300" aria-hidden="true" />
                    )}
                  </button>
                  
                  <div className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 
                    ${isSearchOpen ? 'w-64 opacity-100 visible' : 'w-0 opacity-0 invisible'}`}>
                    <input
                      ref={searchInputRef}
                      type="text"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      placeholder="Type to search..."
                      className="w-full pl-8 pr-4 py-2 bg-white/90 backdrop-blur-sm border-2 border-primary/20 
                        rounded-full focus:outline-none focus:border-primary/50 shadow-lg transition-all"
                      aria-label="Search input"
                    />
                    <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                  </div>
                </div>

                {searchQuery && (
                  <div className="absolute right-0 top-[calc(100%+1rem)] bg-white/95 backdrop-blur-sm 
                    shadow-lg rounded-xl mt-1 z-40 w-[300px] border border-gray-100 overflow-hidden">
                    {filteredBlogs.length > 0 ? (
                      filteredBlogs.map((item, index) => (
                        <Link
                          key={index}
                          href={`/${sanitizeUrl(item.article_category)}/${sanitizeUrl(item?.title)}`}
                          title={item.title}
                        >
                          <div className="p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors">
                            <div className="flex items-center gap-2">
                              <Search className="w-3 h-3 text-primary/60" />
                              <span className="text-gray-700 text-sm">{item.title}</span>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="p-4 text-gray-500 text-center text-sm">
                        No results found for &ldquo;{searchQuery}&rdquo;
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
      </FullContainer>

      {/* Sidebar for Mobile */}
      <div
        className={`sidebar fixed top-0 left-0 h-screen bg-primary text-white shadow-xl z-50 overflow-x-hidden p-10 lg:p-6 transition-transform transform ${
          sidebar ? "translate-x-0" : "-translate-x-full"
        }`}
        ref={sidebarRef}
      >
        <div className="flex items-center justify-between">
          <Logo logo={logo} imagePath={imagePath} />
          <X
            className="w-8 text-white cursor-pointer"
            onClick={() => setSidebar(false)}
            aria-label="Close Sidebar"
          />
        </div>

        <div className="pt-32 hidden lg:flex flex-col items-center p-2">
          {lastThreeBlogs.map((item, index) => (
            <SidebarBlogItem
              key={index}
              blog={item}
              imagePath={imagePath}
              sanitizeUrl={sanitizeUrl}
            />
          ))}
        </div>

        <SidebarLinks
          categories={categories}
          isDropdownOpen={isDropdownOpen}
          toggleDropdown={toggleDropdown}
          sanitizeUrl={sanitizeUrl}
        />
      </div>

      {/* Sidebar Styles */}
      <style jsx>{`
        .sidebar {
          width: 300px;
          transition: transform 0.3s ease;
        }
        @media only screen and (max-width: 600px) {
          .sidebar {
            width: 100%;
          }
        }
      `}</style>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translate(-50%, 10px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </>
  );
}

const SidebarBlogItem = ({ blog, imagePath, sanitizeUrl }) => (
  <div className="grid grid-cols-widget1 gap-4 py-3 border-b last:border-none">
    <Link
      href={`/${sanitizeUrl(blog.article_category)}/${sanitizeUrl(blog.title)}`}
      title={blog.title}
      className="relative overflow-hidden"
    >
      <Image
        src={blog.image ? `${imagePath}/${blog.image}` : "/no-image.png"}
        alt={blog.altText || "Article Thumbnail"}
        title={blog.imageTitle || blog.title || "Article Thumbnail"}
        fill
        className="object-cover hover:scale-125 transition-all"
        style={{ objectFit: "cover" }}
      />
    </Link>
    <Link
      href={`/${sanitizeUrl(blog.article_category)}/${sanitizeUrl(blog.title)}`}
      title={blog.title}
    >
      <p className="font-semibold leading-tight">{blog.title}</p>
    </Link>
  </div>
);

const SidebarLinks = ({
  categories,
  isDropdownOpen,
  toggleDropdown,
  sanitizeUrl,
}) => (
  <div className="flex lg:hidden text-2xl flex-col gap-6 mt-16">
    <Link href="/" title="Home">
      Home
    </Link>
    <div className="relative">
      <button
        className="cursor-pointer"
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
      >
        Categories
      </button>

      {isDropdownOpen && (
        <div className="absolute left-0 top-full bg-black text-white shadow-lg rounded-md z-50 p-4 w-[300px] grid grid-cols-1 gap-4">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/${sanitizeUrl(category.title)}`}
              title={category.title}
            >
              <div className="flex items-center gap-4 hover:bg-gray-900 p-2 transition">
                {/* <Image
                  src={`${category.image}`}
                  alt={category.title}
                  width={60}
                  height={100}
                  className="rounded-md"
                /> */}
                <span className="font-semibold">{category.title}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>

    <Link href="/contact" title="Contact">
      Contact Us
    </Link>
    <Link href="/about" title="About" className="uppercase text-sm mb-2">
      About
    </Link>
  </div>
);
