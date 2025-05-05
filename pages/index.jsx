import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import JsonLd from "@/components/json/JsonLd";
import GoogleTagManager from "@/lib/GoogleTagManager";

// Font
import dayjs from "dayjs";
import Link from "next/link";
import Image from "next/image";
import { Raleway, Roboto } from "next/font/google";

// Components
import Navbar from "@/components/containers/Navbar";
import Footer from "@/components/containers/Footer";
import Banner from "@/components/containers/Banner";
import Container from "@/components/common/Container";
import Rightbar from "@/components/containers/Rightbar";
import FullContainer from "@/components/common/FullContainer";
import TrendingNews from "@/components/containers/TrendingNews";

import {
  getDomain,
  robotsTxt,
  sanitizeUrl,
  getImagePath,
  callBackendApi,
} from "@/lib/myFun";

const myFont = Raleway({
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
});

export default function Home({
  logo,
  blog_list,
  imagePath,
  categories,
  domain,
  meta,
  about_me,
  nav_type,
  banner,
  favicon,
  tag_list,
  page,
}) {
  useEffect(() => {
    fetch("/api/get-images")
      .then((response) => response.json())
      .then((data) => {
        console.log("Image files:", data.images);
      })
      .catch((error) => {
        console.error("Error fetching image files:", error);
      });
  }, []);
  const router = useRouter();
  const { category } = router.query;

  const handleNavigation = (page) => {
    router.push(page);
  };

  useEffect(() => {
    const currentPath = router.asPath;

    if (category && (category.includes("%20") || category.includes(" "))) {
      const newCategory = category.replace(/%20/g, "-").replace(/ /g, "-");
      router.replace(`/${newCategory}`);
    }

    if (currentPath.includes("contact-us")) {
      router.replace("/contact");
    }
    if (currentPath.includes("about-us")) {
      router.replace("/about");
    }
  }, [category, router]);

  const popularBlogs = blog_list.filter((item) => item.isPopular);

  const isfeatureexist = blog_list.some((item) => item.isFeatured);
  const ispopularexist = blog_list.some((item) => item.isPopular);
  const ismustreadexist = blog_list.some((item) => item.isMustRead);

  return (
    page?.enable && (
      <div className={`min-h-screen ${myFont.className}`}>
        <Head>
          <meta charSet="UTF-8" />
          <title>{meta?.title}</title>
          <meta name="description" content={meta?.description} />
          <link rel="author" href={`https://${domain}`} />
          <link rel="publisher" href={`https://${domain}`} />
          <link rel="canonical" href={`https://${domain}`} />
          <meta name="theme-color" content="#008DE5" />
          <link rel="manifest" href="/manifest.json" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <GoogleTagManager />
          <meta
            name="google-site-verification"
            content="zbriSQArMtpCR3s5simGqO5aZTDqEZZi9qwinSrsRPk"
          />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${imagePath}/${favicon}`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${imagePath}/${favicon}`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${imagePath}/${favicon}`}
          />
        </Head>

        <Navbar
          logo={logo}
          categories={categories}
          blog_list={blog_list}
          imagePath={imagePath}
          nav_type={nav_type}
        />

        <Banner
          data={banner?.value}
          image={`${imagePath}/${banner?.file_name}`}
          blog_list={blog_list}
          imagePath={imagePath}
        />

        <TrendingNews blog_list={blog_list} imagePath={imagePath} />

        <FullContainer className="py-20">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
              <div className="col-span-1 md:col-span-2 flex flex-col gap-10">
                {/* Featured Post Section */}
                {isfeatureexist && (
                  <div>
                    <div className="mb-8 w-full relative">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Featured Posts
                    </h2>
                    <div className="w-20 h-1 bg-rose-600 mb-6"></div>
                    <p className="mt-4 text-gray-600 max-w-2xl mb-8">
                      Explore our handpicked selection of exceptional articles
                      that showcase the best insights and stories.
                    </p>
                  </div>

                  <div className="space-y-12">
                    {blog_list?.map(
                      (item, index) =>
                        item.isFeatured && (
                          <div
                            key={index}
                            className="group cursor-pointer overflow-hidden rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 bg-white relative"
                          >
                            <div className="absolute top-6 left-6 z-20">
                              <span className="bg-rose-600 text-white text-sm uppercase tracking-wider py-2 px-4 rounded-full font-semibold">
                                Featured
                              </span>
                            </div>

                            <div className="relative h-[500px] overflow-hidden">
                              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/80 z-10"></div>
                              <Link
                                href={`/${encodeURI(sanitizeUrl(item.title))}`}
                                title={item.title}
                                className="relative block w-full h-full"
                              >
                                <Image
                                  src={`${imagePath}/${
                                    item.image || "no-image.png"
                                  }`}
                                  title={item.title || "Article Image"}
                                  alt={item.altImage || item.tagline}
                                  priority={true}
                                  width={1200}
                                  height={700}
                                  loading="eager"
                                  sizes="100vw"
                                  className="h-full w-full object-cover group-hover:scale-105 transition-all duration-700 ease-in-out"
                                />
                              </Link>

                              <div className="absolute bottom-0 left-0 right-0 p-8 z-20 text-white">
                                <div className="flex items-center gap-4 mb-4">
                                  <span className="uppercase text-sm font-semibold px-3 py-1 bg-primary/80 text-white rounded-md">
                                    {item.article_category}
                                  </span>
                                  <span className="text-sm opacity-80">
                                    {item.published_at
                                      ? dayjs(item.published_at).format(
                                          "MMM D, YYYY"
                                        )
                                      : ""}
                                  </span>
                                </div>

                                <Link
                                  href={`/${encodeURI(
                                    sanitizeUrl(item.title)
                                  )}`}
                                  title={item.title}
                                  className="font-bold text-3xl hover:text-primary/90 transition-colors duration-200 mb-4 block"
                                >
                                  {item.title}
                                </Link>

                                <p className="text-white/80 text-lg mb-6 line-clamp-2 max-w-3xl">
                                  {item.tagline}
                                </p>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4">
                                    {item.author && (
                                      <>
                                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                                          <span className="text-primary font-bold">
                                            {item.author.charAt(0)}
                                          </span>
                                        </div>
                                        <span className="font-medium">
                                          By {item.author}
                                        </span>
                                      </>
                                    )}
                                  </div>

                                  <Link
                                    href={`/${encodeURI(
                                      sanitizeUrl(item.title)
                                    )}`}
                                    className="inline-flex items-center bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors group-hover:translate-x-1 duration-300"
                                  >
                                    Read Article
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="h-5 w-5 ml-2"
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
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                    )}
                  </div>
                </div>
                )}

                {/* Popular Posts Section */}
                {ispopularexist && (
                <div>
                  <div className="mb-10 mt-10 w-full">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      Popular Posts
                    </h2>
                    <div className="w-20 h-1 bg-rose-600 mb-6"></div>
                    <p className="mt-4 text-gray-600 max-w-2xl mb-8">
                      Discover our most-read articles, expert insights, and
                      in-depth coverage of the latest automotive trends and
                      developments.
                    </p>
                  </div>

                  <div className="space-y-6">
                    {popularBlogs?.map((item, index) => (
                      <div
                        key={index}
                        className="flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                      >
                        <div className="relative w-full md:w-2/5 h-64 md:h-auto overflow-hidden">
                          <span className="absolute top-4 left-4 z-10 bg-primary/90 text-white text-xs uppercase py-1 px-3 rounded-full font-medium tracking-wider">
                            Popular
                          </span>
                          <Link
                            href={`/${encodeURI(sanitizeUrl(item.title))}`}
                            className="block h-full"
                          >
                            <Image
                              src={
                                item.image
                                  ? `${imagePath}/${item.image}`
                                  : "/no-image.png"
                              }
                              alt={
                                item.altImage ||
                                item.tagline ||
                                "Article Thumbnail"
                              }
                              className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                              title={
                                item.imageTitle ||
                                item.title ||
                                "Blog Image Title"
                              }
                              width={600}
                              height={400}
                              priority={false}
                              loading="lazy"
                              sizes="(max-width: 768px) 100vw, 40vw"
                            />
                          </Link>
                        </div>

                        <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="uppercase text-xs font-semibold px-2 py-1 bg-gray-100 text-primary rounded-md">
                              {item.article_category}
                            </span>
                            <span className="text-sm text-gray-500 flex items-center">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 mr-1"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                              </svg>
                              {dayjs(item?.published_at)?.format("MMM D, YYYY")}
                            </span>
                          </div>

                          <Link
                            href={`/${encodeURI(sanitizeUrl(item.title))}`}
                            title={item.title}
                            className="text-2xl font-bold hover:text-primary duration-200 mb-3 line-clamp-2"
                          >
                            {item.title}
                          </Link>

                          <p className="text-gray-600 mb-4 line-clamp-3">
                            {item.tagline}
                          </p>

                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                                <span className="font-bold text-primary">
                                  {item.author?.charAt(0) || "E"}
                                </span>
                              </div>
                              <span className="text-sm font-medium">
                                {item.author}
                              </span>
                            </div>

                            <Link
                              href={`/${encodeURI(sanitizeUrl(item.title))}`}
                              title={`Read more about ${item.title}`}
                              className="inline-flex items-center text-primary font-medium hover:underline"
                            >
                              Read Article
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform duration-300"
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
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                )}

                {/* Must Read Section */}
                {ismustreadexist && (
                <div>
                  <div className="mb-10 w-full">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                      Must Read
                    </h2>
                    <div className="w-20 h-1 bg-rose-600 mb-6"></div>
                    <p className="mt-4 text-gray-600 max-w-2xl mb-8">
                      Essential articles that provide valuable insights and
                      information you shouldn&apos;t miss.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {blog_list
                      ?.reverse()
                      .slice(4, 8)
                      .map((item, index) => (
                        <div
                          key={index}
                          className="group rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 bg-white flex flex-col h-full"
                        >
                          {/* Image Section */}
                          <div className="relative">
                            <Link
                              href={`/${encodeURI(sanitizeUrl(item.title))}`}
                              title={item.title}
                              className="block relative h-56 overflow-hidden"
                            >
                              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10"></div>
                              <Image
                                src={
                                  item.image
                                    ? `${imagePath}/${item.image}`
                                    : "/no-image.png"
                                }
                                alt={
                                  item.altImage ||
                                  item.tagline ||
                                  "Article Thumbnail"
                                }
                                title={item.title || "Article Image"}
                                className="w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
                                width={600}
                                height={400}
                                priority={false}
                                loading="lazy"
                                sizes="(max-width: 768px) 100vw, 50vw"
                              />
                            </Link>

                            <div className="absolute bottom-0 left-0 z-20 p-4">
                              <span className="bg-primary text-white text-xs uppercase py-1 px-3 rounded-full font-medium">
                                {item.article_category}
                              </span>
                            </div>

                            {index === 0 && (
                              <div className="absolute top-4 right-4 z-20">
                                <span className="bg-rose-600 text-white text-xs uppercase py-1 px-3 rounded-full font-medium">
                                  Editor&apos;s Choice
                                </span>
                              </div>
                            )}
                          </div>

                          {/* Content Section */}
                          <div className="p-6 flex-grow flex flex-col">
                            <Link
                              href={`/${encodeURI(sanitizeUrl(item.title))}`}
                              title={item.title}
                              className="block text-xl font-bold hover:text-primary duration-200 mb-3 line-clamp-2"
                            >
                              {item.title}
                            </Link>

                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {item.tagline}
                            </p>

                            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
                              <div className="text-sm text-gray-500 flex items-center">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-4 w-4 mr-1"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                {dayjs(item?.published_at)?.format(
                                  "MMM D, YYYY"
                                )}
                              </div>

                              <Link
                                href={`/${encodeURI(sanitizeUrl(item.title))}`}
                                className="text-primary font-medium text-sm hover:underline inline-flex items-center"
                              >
                                Read More
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-3 w-3 ml-1"
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
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
                )}
              </div>

              {/* Sidebar */}
              <div className="block">
                <Rightbar
                  widgets={page?.widgets}
                  about_me={about_me}
                  imagePath={imagePath}
                  categories={categories}
                  tag_list={tag_list}
                  blog_list={blog_list}
                />
              </div>
            </div>
          </Container>
        </FullContainer>

        <Footer logo={logo} imagePath={imagePath} />

        <JsonLd
          data={{
            "@context": "https://www.schema.org",
            "@graph": [
              {
                "@type": "WebSite",
                "@id": `https://${domain}/`,
                url: `https://${domain}/`,
                name: meta?.title,
                isPartOf: {
                  "@id": `https://${domain}`,
                },
                description: meta?.description,
                inLanguage: "en-US",
                primaryImageOfPage: {
                  "@type": "ImageObject",
                  url: `${imagePath}/${banner?.file_name}`,
                  width: 1920,
                  height: 1080,
                },
              },
              {
                "@type": "Organization",
                "@id": `https://${domain}`,
                name: domain,
                url: `https://${domain}`,
                logo: {
                  "@type": "ImageObject",
                  url: `${imagePath}/${logo?.file_name}`,
                  width: logo?.width || 100,
                  height: logo?.height || 100,
                },
                sameAs: [
                  "https://www.facebook.com",
                  "https://www.twitter.com",
                  "https://instagram.com",
                ],
              },
              {
                "@type": "ItemList",
                url: `https://${domain}`,
                name: "blog",
                itemListElement: blog_list?.map((blog, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "Article",
                    url: `https://${domain}/${sanitizeUrl(
                      blog?.article_category
                    )}/${sanitizeUrl(blog?.title)}`,
                    name: blog?.title,
                  },
                })),
              },
            ],
          }}
        />
      </div>
    )
  );
}

export async function getServerSideProps({ req }) {
  const domain = getDomain(req?.headers?.host);

  let layoutPages = await callBackendApi({
    domain,
    type: "layout",
  });

  const meta = await callBackendApi({ domain, type: "meta_home" });
  const logo = await callBackendApi({ domain, type: "logo" });
  const favicon = await callBackendApi({ domain, type: "favicon" });
  const blog_list = await callBackendApi({ domain, type: "blog_list" });
  const categories = await callBackendApi({ domain, type: "categories" });
  const contact_details = await callBackendApi({
    domain,
    type: "contact_details",
  });

  let page = null;
  if (Array.isArray(layoutPages?.data) && layoutPages.data.length > 0) {
    const valueData = layoutPages.data[0].value;
    page = valueData?.find((page) => page.page === "home");
  }

  if (!page?.enable) {
    return {
      notFound: true,
    };
  }

  let project_id = logo?.data[0]?.project_id || null;
  const about_me = await callBackendApi({ domain, type: "about_me" });
  const copyright = await callBackendApi({ domain, type: "copyright" });
  const banner = await callBackendApi({ domain, type: "banner" });
  const tag_list = await callBackendApi({ domain, type: "tag_list" });
  const nav_type = await callBackendApi({ domain, type: "nav_type" });
  let imagePath = null;
  imagePath = await getImagePath(project_id, domain);

  robotsTxt({ domain });

  return {
    props: {
      page,
      domain,
      imagePath,
      meta: meta?.data[0]?.value || null,
      favicon: favicon?.data[0]?.file_name || null,
      logo: logo?.data[0] || null,
      blog_list: blog_list?.data[0]?.value || [],
      categories: categories?.data[0]?.value || null,
      copyright: copyright?.data[0]?.value || null,
      about_me: about_me?.data[0] || null,
      banner: banner?.data[0] || null,
      contact_details: contact_details?.data[0]?.value || null,
      nav_type: nav_type?.data[0]?.value || {},
      tag_list: tag_list?.data[0]?.value || null,
    },
  };
}
