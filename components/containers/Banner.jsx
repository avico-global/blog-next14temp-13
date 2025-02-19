import React from "react";
import Image from "next/image";
import FullContainer from "../common/FullContainer";
import Container from "../common/Container";
import { sanitizeUrl } from "@/lib/myFun";
import Link from "next/link";

export default function Banner({ image, data, blog_list, imagePath }) {
  return (
    <FullContainer className="relative">
      <Container className="py-24">
        <div className="w-full grid md:grid-cols-2 gap-8">
          {/* Left side text content */}
          <div className="relative flex flex-col justify-center items-end">
            <h1 className="font-medium capitalize text-5xl md:text-4xl lg:text-5xl leading-tight text-gray-900 text-end  lg:ml-20 ">
              {data?.title}
            </h1>
            {data?.tagline && (
              <p className="leading-tight text-gray-600 mt-10 text-right">
                {data?.tagline}
              </p>
            )}
          </div>

          {/* Right side image */}
          <div className="relative aspect-square w-full max-w-[600px] mx-auto">
            <Image
              src={image}
              title={data?.imageTitle || data?.title || "Banner"}
              alt={data?.altImage || data?.tagline || "No Banner Found"}
              priority={true}
              fill={true}
              loading="eager"
              className="rounded-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
            />
          </div>
        </div>

        {/* Blog list section */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-10 mx-auto max-w-[1200px] ">
          {blog_list
            ?.slice(-3)
            .reverse()
            .map((item, index) => (
              <BlogCard
                key={index}
                title={item.title}
                href={`/${sanitizeUrl(item.article_category)}/${sanitizeUrl(
                  item?.title
                )}`}
                index={index}
              />
            ))}
        </div>
      </Container>
    </FullContainer>
  );
}

function BlogCard({ title, href, index }) {
  return (
    <div
      className="group animate-fadeIn"
      style={{ animationDelay: `${index * 200}ms` }}
    >
      <Link
        href={href || "#"}
        className="text-xl font-medium block text-gray-800 hover:text-gray-600 transition-colors"
      >
        {title}
      </Link>
      <div
        className="h-[2px] bg-gray-800 transition-all duration-300 mt-2 animate-lineGrow"
        style={{ animationDelay: `${index * 200 + 500}ms` }}
      ></div>
    </div>
  );
}
