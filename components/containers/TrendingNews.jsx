import React from "react";
import Image from "next/image";
import Link from "next/link";
import { sanitizeUrl } from "@/lib/myFun";
import Container from "../common/Container";
import FullContainer from "../common/FullContainer";

export default function TrendingNews({ blog_list = [], imagePath }) {
  const trendingBlogs = blog_list.filter((item) => item.trendingNews);

  return (
    <FullContainer className="py-12 bg-gray-50">
    <Container className="py-12 bg-gray-50">
      <div className="">
        <div className="mb-10 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Trending News
          </h2>
          <div className="w-20 h-1 bg-rose-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            Stay updated with the latest insights and news from the automotive
            industry
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Featured Article (Larger) */}
          {trendingBlogs.length > 0 && (
            <div className="lg:col-span-2 lg:row-span-2 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1 h-full">
              <Link
                title={trendingBlogs[0]?.title || "Article Link"}
                href={`/${sanitizeUrl(trendingBlogs[0]?.title)}`}
                className="block h-full"
              >
                <div className="relative w-full h-full">
                  <Image
                    src={`${imagePath}/${
                      trendingBlogs[0].image || "no-image.png"
                    }`}
                    alt={trendingBlogs[0].imageAltText}
                    title={trendingBlogs[0].image || "Article Thumbnail"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <span className="bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full mb-3 inline-block">
                      {trendingBlogs[0].article_category}
                    </span>
                    <h3 className="text-2xl font-bold mb-2">
                      {trendingBlogs[0].title}
                    </h3>
                    <p className="text-sm text-gray-200 mb-2">
                      {trendingBlogs[0].tagline}
                    </p>
                    <div className="flex items-center mt-3">
                      <span className="text-xs">
                        {new Date(
                          trendingBlogs[0].published_at
                        ).toLocaleDateString()}
                      </span>
                      <span className="mx-2">•</span>
                      <span className="text-xs">
                        By {trendingBlogs[0].author}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* Regular Articles */}
          {trendingBlogs.slice(1).map((blog, index) => (
            <div
              key={blog._id}
              className="rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <Link
                title={blog?.title || "Article Link"}
               href={`/${sanitizeUrl(blog?.title)}`}>
                <div className="relative h-48 w-full">
                  <Image
                    title={blog.image || "Article Thumbnail"}
                    src={`${imagePath}/${blog.image || "no-image.png"}`}
                    alt={blog.imageAltText}
                    layout="fill"
                    objectFit="cover"
                    className="transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute top-3 left-3">
                    <span className="bg-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
                      {blog.article_category}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-2 line-clamp-2">
                    {blog.title}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                    {blog.tagline}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <span>
                      {new Date(blog.published_at).toLocaleDateString()}
                    </span>
                    <span className="mx-2">•</span>
                    <span>By {blog.author}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </Container>
    </FullContainer>
  );
}
