import React, { useEffect } from "react";
import Head from "next/head";
import Footer from "@/components/containers/Footer";
import {
  callBackendApi,
  getDomain,
  getImagePath,
  sanitizeUrl,
} from "@/lib/myFun";
import GoogleTagManager from "@/lib/GoogleTagManager";
import JsonLd from "@/components/json/JsonLd";
import Image from "next/image";
import FullContainer from "@/components/common/FullContainer";
import Container from "@/components/common/Container";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import Link from "next/link";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import Rightbar from "@/components/containers/Rightbar";
import Navbar from "@/components/containers/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import useBreadcrumbs from "@/lib/useBreadcrumbs";

export default function Categories({
  categories,
  blog_list,
  imagePath,
  tag_list,
  domain,
  logo,
  meta,
  page,
  nav_type,
  about_me,
  copyright,
  contact_details,
}) {
  const router = useRouter();
  const { categoryPage } = router.query;

  const breadcrumbs = useBreadcrumbs();

  const filteredBlogList = blog_list.filter((item) => {
    const searchContent = sanitizeUrl(categoryPage);
    return sanitizeUrl(item.article_category) === searchContent;
  });

  useEffect(() => {
    const currentPath = router.asPath;

    if (categoryPage && (categoryPage.includes("%20") || categoryPage.includes(" "))) {
      const newCategory = categoryPage.replace(/%20/g, "-").replace(/ /g, "-");
      router.replace(`/${newCategory}`);
    }

    if (currentPath.includes("contact-us")) {
      router.replace("/contact");
    }
    if (currentPath.includes("about-us")) {
      router.replace("/about");
    }
  }, [categoryPage, router]);

  return (
    page?.enable && (
      <div className="flex flex-col min-h-screen justify-between">
        <Head>
          <meta charSet="UTF-8" />
          <title>
            {meta?.title?.replaceAll(
              "##category##",
              categoryPage
                ?.replaceAll("-", " ")
                .split(" ")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")
            )}
          </title>
          <meta
            name="description"
            content={meta?.description.replaceAll(
              "##category##",
              categoryPage?.replaceAll("-", " ")
            )}
          />
          <link rel="author" href={`http://${domain}`} />
          <link rel="publisher" href={`http://${domain}`} />
          <link rel="canonical" href={`http://${domain}`} />
          <meta name="theme-color" content="#008DE5" />
          <GoogleTagManager />
        </Head>

        <Navbar
          categoryPage={categoryPage}
          blog_list={blog_list}
          categories={categories}
          logo={logo}
          nav_type={nav_type}
          imagePath={imagePath}
          contact_details={contact_details}
        />

        <FullContainer className="py-10 mb-10  ">
          <div className="  text-start bg-gray-100 w-full py-14 mb-8   ">
            <div className=" mx-auto max-w-[1200px] ">
              <h1 className="text-4xl font-semibold capitalize pb-8 pt-5 w-full">
                Exploring: {categoryPage?.replace("-", " ")}
              </h1>
              <Breadcrumbs
                className=" gap-2  "
                breadcrumbs={[{ label: "Home", url: "/" }, { label: categoryPage }]}
              />
            </div>
          </div>
          <Container className=" mx-auto max-w-[1200px] ">
            <div className="grid grid-cols-1 md:grid-cols-home gap-12 w-full">
              <div className="w-full flex flex-col gap-14">
                {filteredBlogList.map((item, index) => (
                  <div key={index} className="group flex flex-col gap-4">
                    <Link
                      title={`View ${item?.title || "Article"}`}
                      href={`/${sanitizeUrl(
                        item?.title
                      )}`}
                    >
                      <div className="overflow-hidden relative min-h-40 rounded lg:min-h-[400px] w-full bg-black flex-1">
                        <Image
                          title={
                            item.imageTitle || item.title || "Article Thumbnail"
                          }
                          alt={
                            item.altImage ||
                            item.tagline ||
                            "No Thumbnail Found"
                          }
                          src={
                            item.image
                              ? `${imagePath}/${item.image}`
                              : "/no-image.png"
                          }
                          fill={true}
                          loading="lazy"
                          className="w-full h-full object-cover absolute top-0 group-hover:scale-125 duration-1000 transition-all"
                        />
                      </div>
                    </Link>

                    <div className="relative -mt-20 bg-white max-w-2xl mx-auto p-6 rounded-lg shadow-lg text-center w-full">
                      <Badge className="mb-4">{item.article_category}</Badge>
                      <Link
                        title={`Read more about ${item?.title || "Article"}`}
                        href={`/${sanitizeUrl(
                          item?.title
                        )}`}
                        className="font-bold text-3xl hover:text-primary duration-200 block"
                      >
                        {item.title}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
              <Rightbar
                widgets={page?.widgets}
                about_me={about_me}
                tag_list={tag_list}
                blog_list={blog_list}
                imagePath={imagePath}
                categories={categories}
                contact_details={contact_details}
              />
            </div>
          </Container>
        </FullContainer>

        <Footer
          blog_list={blog_list}
          categories={categories}
          logo={logo}
          imagePath={imagePath}
          about_me={about_me}
          contact_details={contact_details}
          copyright={copyright}
        />

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "BreadcrumbList",
                itemListElement: breadcrumbs.map((breadcrumb, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: breadcrumb.label,
                  item: `https://${domain}${breadcrumb.url}`,
                })),
              },
              {
                "@type": "WebPage",
                "@id": `https://${domain}/${categoryPage}`,
                url: `https://${domain}/${categoryPage}`,
                name: meta?.title?.replaceAll(
                  "##category##",
                  categoryPage?.replaceAll("-", " ")
                ),
                description: meta?.description?.replaceAll(
                  "##category##",
                  categoryPage?.replaceAll("-", " ")
                ),
                inLanguage: "en-US",
                publisher: {
                  "@type": "Organization",
                  "@id": `https://${domain}`,
                },
              },
              {
                "@type": "ItemList",
                url: `https://${domain}/${categoryPage}`,
                name: "blog",
                itemListElement: blog_list?.map((blog, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  item: {
                    "@type": "Article",
                    url: `https://${domain}/${sanitizeUrl(
                      blog?.article_category.replaceAll(" ", "-")
                    )}/${sanitizeUrl(blog?.title)}`,
                    name: blog.title,
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

export async function getServerSideProps({ req, query }) {
  const domain = getDomain(req?.headers?.host);
  const { categoryPage } = query;

  let layoutPages = await callBackendApi({
    domain,
    type: "layout",
  });

  const categories = await callBackendApi({ domain, type: "categories" });
  const copyright = await callBackendApi({ domain, type: "copyright" });
  const blog_list = await callBackendApi({ domain, type: "blog_list" });
  const nav_type = await callBackendApi({ domain, type: "nav_type" });
  const tag_list = await callBackendApi({ domain, type: "tag_list" });
  const about_me = await callBackendApi({ domain, type: "about_me" });
  const logo = await callBackendApi({ domain, type: "logo" });
  const meta = await callBackendApi({ domain, type: "meta_category" });

  const contact_details = await callBackendApi({
    domain,
    type: "contact_details",
  });

  let project_id = logo?.data[0]?.project_id || null;
  let imagePath = await getImagePath(project_id, domain);

  let page = null;
  if (Array.isArray(layoutPages?.data) && layoutPages.data.length > 0) {
    const valueData = layoutPages.data[0].value;
    page = valueData?.find((page) => page.page === "category");
  }

  if (!page?.enable) {
    return {
      notFound: true,
    };
  }

  const categoryExists = categories?.data[0]?.value?.some(
    (cat) =>
      cat?.title?.toLowerCase() === categoryPage?.replaceAll("-", " ").toLowerCase()
  );

  if (!categoryExists) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      domain,
      imagePath,
      meta: meta?.data[0]?.value || null,
      logo: logo?.data[0] || null,
      blog_list: blog_list?.data[0]?.value || [],
      categories: categories?.data[0]?.value || null,
      about_me: about_me.data[0] || null,
      contact_details: contact_details?.data[0]?.value || null,
      copyright: copyright?.data[0]?.value || null,
      tag_list: tag_list?.data[0]?.value || null,
      nav_type: nav_type?.data[0]?.value || {},
    },
  };
}
