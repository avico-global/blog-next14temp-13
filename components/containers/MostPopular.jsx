import React from "react";
import Image from "next/image";
import Link from "next/link";

export default function MostPopular({ blog_list = [], imagePath }) {
  const popularBlogs = blog_list.filter((item) => item.isPopular);
  return (
    popularBlogs?.length > 0 && (
      <div className="flex flex-col gap-10">
        {popularBlogs.map((item, index) => (
          <BlogCard
            key={item.id || index}
            title={item.title}
            author={item.author}
            date={item.published_at}
            tagline={item.tagline}
            description={item.articleContent}
            image={`${imagePath}/${item.image || "no-image.png"}`}
            href={`/${item?.article_category
              ?.toLowerCase()
              ?.replaceAll(" ", "-")}/${item?.title
              ?.replaceAll(" ", "-")
              ?.toLowerCase()}`}
            category={item.article_category}
            imageTitle={item.imageTitle}
            altImage={item.altImage}
          />
        ))}
      </div>
    )
  );
}

function BlogCard({
  title,
  image,
  href,
  imageTitle = "Article Thumbnail",
  altImage = "No Thumbnail Found",
  tagline,
  date,
}) {
  return (
    <div className="grid grid-cols-bblog gap-5">
      <Link
        href={href || "#"}
        title={imageTitle}
        className="relative overflow-hidden w-full h-28"
      >
        <Image
          src={image}
          title={imageTitle || "Image Title"}
          alt={altImage || tagline}
          priority={false}
          width={298}
          height={195}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (min-width: 768px) 50vw, 33vw"
          className="w-full h-full hover:scale-125 transition-all duration-300"
          style={{ objectFit: "cover" }}
        />
      </Link>

      <div className="flex flex-col justify-center">
        <Link href={href || ""}>
          <p className="">{title}</p>
        </Link>
        <p>{date}</p>
      </div>
    </div>
  );
}
