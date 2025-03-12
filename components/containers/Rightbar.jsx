import { Circle, Facebook, Instagram, Twitter } from "lucide-react";
import Image from "next/image";
import React from "react";
import Link from "next/link";
import MarkdownIt from "markdown-it";
import { cn } from "@/lib/utils";
import { useRouter } from "next/router";
import { sanitizeUrl } from "@/lib/myFun";

const md = new MarkdownIt();

export default function Rightbar({
  widgets = [],
  about_me = {},
  category,
  tag_list = [],
  blog_list = [],
  imagePath,
  categories = [],
}) {
  const content = md.render(about_me?.value || "");
  const router = useRouter();
  const currentPath = router.asPath;

  const isActive = (path) => currentPath === path;
  const lastFourBlogs = blog_list.slice(-4);

  const renderAbout = () => (
    <Link
      title="About"
      href="/about"
      className="flex flex-col items-center text-center bg-white shadow-md group overflow-hidden"
    >
      <div className="relative w-full">
        <div className="relative h-[300px] overflow-hidden p-10 ">
          <Image
            src={`${imagePath}/${about_me?.file_name}`}
            title={`${content.slice(0, 100)}...`}
            alt={`${content.slice(0, 100)}...`}
            priority
            width={500}
            height={500}
            loading="eager"
            className="w-full h-full object-cover group-hover:scale-125 transition-all duration-1000"
          />
        </div>

        <div className="p-8 relative  mx-6  z-10">
          <h2 className="text-black font-extrabold text-3xl mb-4">About Us</h2>
          <div
            className="text-gray-600 text-sm line-clamp-3"
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </div>
      </div>
    </Link>
  );

  const renderCategories = () => (
    <div className="border p-5 flex flex-col items-start bg-white text-start mt-4">
      <h2 className="bg-secondary px-5 font-bold text-lg ">Categories</h2>
      <div className="flex flex-col w-full text-left px-2 py-4">
        {categories.map((item, index) => (
          <Link
            key={index}
            title={item?.title}
            href={`/${encodeURI(sanitizeUrl(item?.title))}`}
            className={cn(
              "text-gray-500 capitalize w-full flex items-center gap-2 hover:text-primary transition-all p-2 border-b-2 border-gray-100 hover:border-primary",
              (category === item?.title || isActive(`/${item?.title}`)) &&
                "border-primary text-black"
            )}
          >
            <Circle className="w-2 h-2 text-blue-800" />
            {item?.title}
          </Link>
        ))}
      </div>
    </div>
  );

  const renderLatestPosts = () => (
    <div className="pt-5 flex flex-col bg-white p-2">
      <h2 className="bg-secondary px-5 font-bold text-lg  text-start">
        EDITOR&apos;S CHOICE
      </h2>
      <div className="flex flex-col mt-6 gap-4 w-full">
        {lastFourBlogs.map((item, index) => (
          <Link
            key={index}
            href={`${sanitizeUrl(
              item?.title
            )}`}
            className="flex items-center gap-4 group p-2 transition-all"
          >
            <div className="relative overflow-hidden w-20 h-20 flex-shrink-0">
              <Image
                src={`${imagePath}/${item.image}`}
                title={item.imageTitle || item.title || "Article Thumbnail"}
                alt={item.tagline || item.altText}
                priority={false}
                width={80}
                height={80}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
              />
            </div>

            <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
          </Link>
        ))}
      </div>
    </div>
  );

  return (
    <div className="h-fit sticky top-36 flex flex-col gap-14">
      {renderAbout()}
      {renderCategories()}
      {renderLatestPosts()}
    </div>
  );
}
