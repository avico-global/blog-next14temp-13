import React from "react";
import Link from "next/link";
import Image from "next/image";
import Container from "../common/Container";
import FullContainer from "../common/FullContainer";
import { sanitizeUrl } from "@/lib/myFun";

export default function TrendingNews({ blog_list = [], imagePath }) {
  const mustReadBlogs = blog_list.filter((item) => item.isMustRead).slice(0, 3);
  return (
    mustReadBlogs?.length > 0 && (
      <FullContainer className="py-24">
        <Container className=" mx-auto max-w-[1200px]  ">
          <div className="pt-5 text-center w-full flex flex-col items-center text-black">
            <div className="  w-fit border-b-8 border-primary/45  " >

            <h2 className=" text-4xl font-bold -mb-3 ">
              Trending Posts
            </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full mt-16">
              <div className="grid grid-cols-1 gap-8">
                {mustReadBlogs.slice(0, 2).map((item, index) => (
                  <SimpleBlogCard
                    key={item.id || index}
                    title={item.title}
                    author={item.author}
                    date={item.published_at}
                    tagline={item.tagline}
                    href={`/${sanitizeUrl(item.article_category)}/${sanitizeUrl(
                      item?.title
                    )}`}
                    category={item.article_category}
                  />
                ))}
              </div>
              {mustReadBlogs[2] && (
                <div>
                  <FeaturedBlogCard
                    title={mustReadBlogs[2].title}
                    altTitle={mustReadBlogs[2].imageTitle}
                    author={mustReadBlogs[2].author}
                    date={mustReadBlogs[2].published_at}
                    image={`${imagePath}/${
                      mustReadBlogs[2].image || "no-image.png"
                    }`}
                    href={`/${sanitizeUrl(
                      mustReadBlogs[2].article_category
                    )}/${sanitizeUrl(mustReadBlogs[2]?.title)}`}
                    category={mustReadBlogs[2].article_category}
                    imageTitle={mustReadBlogs[2].imageTitle}
                    altImage={mustReadBlogs[2].altImage}
                  />
                </div>
              )}
            </div>
          </div>
        </Container>
      </FullContainer>
    )
  );
}

function SimpleBlogCard({ title, href, category, tagline, date, author }) {
  return (
    <div className="flex flex-col gap-4 bg-white p-6 rounded-lg">
      <p className="text-start text-lg capitalize text-primary  duration-200">
        {category}
      </p>

      <Link
        title={title}
        href={href || ""}
        className="font-medium text-left leading-2 text-2xl hover:text-primary duration-200"
      >
        {title}
      </Link>

      <div className="flex gap-4 ">
        <p className="text-start text-gray-400 text-normal">{author}</p>
        <span>.</span>
        <p className="text-start text-gray-400 text-normal">{date}</p>
      </div>
      <p className="text-start text-gray-600">{tagline}</p>
    </div>
  );
}

function FeaturedBlogCard({
  title,
  image,
  href,
  category,
  imageTitle,
  altImage,
  date,
  author,
}) {
  return (
    <div className="relative h-full min-h-[400px] group">
      <Link
        href={href || "#"}
        title={imageTitle}
        className="absolute inset-0 w-full h-full  hover:scale-100 "
      >
        <Image
          src={image}
          title={imageTitle}
          alt={altImage}
          fill
          priority={false}
          className="object-cover brightness-50 hover:scale-100 "
        />
      </Link>

      <div className="relative h-full flex flex-col justify-center items-center text-white p-6 gap-4">
        <p className="text-lg capitalize text-primary duration-200">
          {category}
        </p>

        <h3 className="font-medium text-center text-3xl  duration-200">
          <Link href={href || ""}>{title}</Link>
        </h3>

        <div className="flex gap-4 ">
          <p className="text-start text-gray-300 text-normal">{author}</p>
          <span>.</span>
          <p className="text-start text-gray-300 text-normal">{date}</p>
        </div>
      </div>
    </div>
  );
}
