import React, { useState, useEffect, useRef, useCallback } from "react";
import Logo from "./Logo";
import Link from "next/link";
import Image from "next/image";
import { sanitizeUrl } from "@/lib/myFun";
import { Search, X } from "lucide-react";
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
  const [isInBannerArea, setIsInBannerArea] = useState(true);

  const lastThreeBlogs = blog_list.slice(-3);

  // Add scroll event listener
  useEffect(() => {
    const handleScroll = () => {
      // Get banner height (adjust this value based on your actual banner height)
      const bannerHeight = 600; // Approximate height of banner

      // Check if we're still in the banner area
      setIsInBannerArea(window.scrollY < bannerHeight);
      // Also track general scrolling for other effects
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
        className={`
          fixed top-0 w-full z-20 transition-all duration-300
          ${isScrolled ? "shadow-md" : ""}
          ${
            isInBannerArea
              ? "bg-transparent text-gray-900"
              : "bg-white text-black"
          }
        `}
      >
        <Container>
          <div className="flex items-center justify-between gap-3 mx-auto py-2.5 w-full">
            <div className="flex items-start">
              <Logo logo={logo} imagePath={imagePath} />
            </div>
            <div className="flex">
              <nav className="hidden lg:flex items-center gap-5 uppercase text-sm mr-3">
                <Link href="/" title="Home" className="hover:text-primary">
                  Home
                </Link>
                <div
                  className="relative group"
                  onMouseEnter={() => setIsDropdownOpen(true)}
                  onMouseLeave={() => setIsDropdownOpen(false)}
                >
                  <button
                    className="hover:text-primary uppercase text-sm flex items-center gap-1"
                    aria-expanded={isDropdownOpen}
                    aria-controls="categoriesDropdown"
                  >
                    Categories
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={`transition-transform duration-300 ${
                        isDropdownOpen ? "rotate-180" : ""
                      }`}
                    >
                      <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <div
                      id="categoriesDropdown"
                      className="absolute left-1/2 -translate-x-1/2 top-[calc(30%+1rem)] bg-white/95 backdrop-blur-md 
                        text-black shadow-2xl rounded-2xl z-50 p-6 w-[500px] grid grid-cols-2
                        border border-gray-100 transform transition-all duration-300 animate-fadeIn"
                    >
                      <div className="col-span-2 mb-2 pb-2 border-b border-gray-100">
                        <h3 className="text-lg font-medium text-primary">
                          Browse Categories
                        </h3>
                        <p className="text-sm text-gray-500">
                          Explore our content by topic
                        </p>
                      </div>

                      {categories.map((category, index) => (
                        <Link
                          key={index}
                          href={`/category/${sanitizeUrl(category.title)}`}
                          className="group relative overflow-hidden rounded-xl hover:shadow-md transition-all duration-300"
                          title={category.title}
                        >
                          <div
                            className="relative flex items-center gap-4 p-4 hover:bg-primary/5 transition-all duration-300
                            border border-transparent hover:border-primary/10 rounded-xl"
                          >
                            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-sm flex-shrink-0">
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
                              <div className="flex items-center text-sm text-gray-500 group-hover:text-primary/70 transition-colors mt-1">
                                <span className="inline-block mr-2 text-xs">
                                  Explore
                                </span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="transform group-hover:translate-x-1 transition-transform duration-300"
                                >
                                  <line x1="5" y1="12" x2="19" y2="12"></line>
                                  <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                              </div>
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
                      <X
                        className="w-4 h-4 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    ) : (
                      <Search
                        className="w-4 h-4 transition-transform duration-300"
                        aria-hidden="true"
                      />
                    )}
                  </button>

                  <div
                    className={`absolute right-0 top-1/2 -translate-y-1/2 transition-all duration-300 
                    ${
                      isSearchOpen
                        ? "w-64 opacity-100 visible"
                        : "w-0 opacity-0 invisible"
                    }`}
                  >
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
                  <div
                    className="absolute right-0 top-[calc(100%+1rem)] bg-white/95 backdrop-blur-sm 
                    shadow-lg rounded-xl z-40 w-[300px] border border-gray-100 overflow-hidden"
                  >
                    {filteredBlogs.length > 0 ? (
                      filteredBlogs.map((item, index) => (
                        <Link
                          key={index}
                          href={`/${sanitizeUrl(
                            item.article_category
                          )}/${sanitizeUrl(item?.title)}`}
                          title={item.title}
                        >
                          <div className="p-3 hover:bg-gray-50 border-b border-gray-100 transition-colors">
                            <div className="flex items-center gap-2">
                              <Search className="w-3 h-3 text-primary/60" />
                              <span className="text-gray-700 text-sm">
                                {item.title}
                              </span>
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
        </Container>
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
          imagePath={imagePath}
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
  imagePath,
}) => (
  <div className="flex lg:hidden text-2xl flex-col gap-6 mt-16">
    <Link href="/" title="Home">
      Home
    </Link>
    <div className="relative">
      <button
        className="cursor-pointer flex items-center gap-2"
        onClick={toggleDropdown}
        aria-expanded={isDropdownOpen}
      >
        Categories
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`transition-transform duration-300 ${
            isDropdownOpen ? "rotate-180" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </button>

      {isDropdownOpen && (
        <div className="mt-4 bg-white/10 backdrop-blur-sm text-white rounded-xl z-50 p-4 grid grid-cols-1 gap-3 border border-white/20">
          {categories.map((category, index) => (
            <Link
              key={index}
              href={`/category/${sanitizeUrl(category.title)}`}
              title={category.title}
            >
              <div className="flex items-center gap-3 hover:bg-white/10 p-3 rounded-lg transition-all duration-300 group">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                  {category.image && (
                    <Image
                      src={`${imagePath}/${category.image}`}
                      alt={category.title}
                      width={40}
                      height={40}
                      className="object-cover rounded-full"
                    />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="font-medium">{category.title}</span>
                  <span className="text-sm text-white/70 flex items-center group-hover:translate-x-1 transition-transform duration-300">
                    View
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-1"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>

    <Link href="/contact" title="Contact">
      Contact Us
    </Link>
    <Link href="/about" title="About">
      About Us
    </Link>
  </div>
);
