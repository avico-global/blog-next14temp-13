import React from "react";
import Image from "next/image";
import FullContainer from "../common/FullContainer";
import Container from "../common/Container";
import { sanitizeUrl } from "@/lib/myFun";
import Link from "next/link";

export default function Banner({ image, data, blog_list }) {
  return (
    <FullContainer className="relative bg-gradient-to-tr from-slate-50 via-white to-rose-50 overflow-hidden pt-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-rose-100 rounded-full filter blur-[100px] opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-purple-100 rounded-full filter blur-[80px] opacity-60"></div>
        <div className="absolute w-full h-full bg-grid-pattern opacity-[0.03]"></div>
      </div>

      <Container className="py-20 md:py-14 relative z-10">
        {/* Hero Section */}
        <div className="flex flex-col lg:flex-row items-center gap-16 w-full mb-8">
          {/* Main content */}
          <div className="flex-1 space-y-6 max-w-2xl">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2"></span>
              {data?.subtitle || "Featured Content"}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              {data?.title}
            </h1>

            {data?.tagline && (
              <p className="text-lg text-gray-600 leading-relaxed">
                {data?.tagline}
              </p>
            )}

            <div className="pt-4 flex flex-wrap gap-4">
              {data?.cta && (
                <Link
                  href={data.ctaLink || "#"}
                  className="px-6 py-3 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-all duration-300 shadow-lg hover:shadow-rose-200/50 font-medium flex items-center group"
                >
                  {data.cta}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </Link>
              )}

              {data?.secondaryCta && (
                <Link
                  href={data.secondaryCtaLink || "#"}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium"
                >
                  {data.secondaryCta}
                </Link>
              )}
            </div>
          </div>

          {/* Image container */}
          <div className="relative w-full lg:w-2/5 aspect-square max-w-[500px] mx-auto">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-rose-50 to-purple-50 transform rotate-3"></div>
            <div className="absolute inset-0 rounded-2xl overflow-hidden transform -rotate-3 shadow-xl">
              <Image
                src={image}
                title={data?.imageTitle || data?.title || "Banner"}
                alt={data?.altImage || data?.tagline || "No Banner Found"}
                priority={true}
                fill={true}
                loading="eager"
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 500px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>

        {/* Articles Section */}
        {blog_list?.length > 0 && (
          <div className="relative">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-2xl font-bold text-gray-900">
                Latest Articles
              </h2>
              {/* <Link
                href="/blog"
                className="text-rose-600 hover:text-rose-700 font-medium flex items-center"
              >
                View all
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 ml-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link> */}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {blog_list
                ?.slice(-3)
                .reverse()
                .map((item, index) => (
                  <BlogCard
                    key={index}
                    title={item.title}
                    href={`/${sanitizeUrl(item?.title)}`}
                    index={index}
                    category={item.article_category}
                  />
                ))}
            </div>
          </div>
        )}
      </Container>
    </FullContainer>
  );
}

function BlogCard({ title, href, index, category }) {
  return (
    <Link
      href={href || "#"}
      className="group block bg-white rounded-xl overflow-hidden border border-gray-100 shadow hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <span className="text-xs font-semibold px-3 py-1 bg-rose-50 text-rose-600 rounded-full">
            {category || "Article"}
          </span>
          <span className="ml-auto text-sm text-gray-400">0{index + 1}</span>
        </div>

        <h3 className="text-xl font-semibold text-gray-800 group-hover:text-rose-600 transition-colors line-clamp-2">
          {title}
        </h3>

        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span className="flex items-center">
            Read more
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}
