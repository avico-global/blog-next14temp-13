import React, { useEffect } from "react";
import { useRouter } from "next/router";
import JsonLd from "@/components/json/JsonLd";
import useBreadcrumbs from "@/lib/useBreadcrumbs";
import Breadcrumbs from "@/components/common/Breadcrumbs";

// Components
import MarkdownIt from "markdown-it";
import Navbar from "@/components/containers/Navbar";
import Footer from "@/components/containers/Footer";
import GoogleTagManager from "@/lib/GoogleTagManager";
import Container from "@/components/common/Container";
import FullContainer from "@/components/common/FullContainer";
import { callBackendApi, getDomain, getImagePath } from "@/lib/myFun";

import Head from "next/head";

// Font
import { Raleway } from "next/font/google";
const myFont = Raleway({
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
});

export default function PriavcyPolicy({
  imagePath,
  nav_type,
  favicon,
  domain,
  logo,
  page,
  meta,
  policy,
  blog_list,
  categories,
}) {
  const markdownIt = new MarkdownIt();
  const content = markdownIt.render(policy || "");
  const breadcrumbs = useBreadcrumbs();
  const router = useRouter();
  const currentPath = router.pathname;

  useEffect(() => {
    if (currentPath.includes("%20") || currentPath.includes(" ")) {
      router.replace("/privacy-policy");
    }
  }, [currentPath, router]);

  return (
    page?.enable && (
      <div
        className={`min-h-screen flex flex-col justify-between ${myFont.className}`}
      >
        <Head>
          <meta charSet="UTF-8" />
          <title>{meta?.title}</title>
          <meta name="description" content={meta?.description} />
          <link rel="author" href={`https://${domain}`} />
          <link rel="publisher" href={`https://${domain}`} />
          <link rel="canonical" href={`https://${domain}/privacy-policy`} />
          {/* <meta name="robots" content="noindex" /> */}
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
            title={favicon || "Favicon"}
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${favicon}`}
          />
            <link
            title={favicon || "Favicon"}
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${favicon}`}
          />
          <link
            title={favicon || "Favicon"}
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${favicon}`}
          />
        </Head>

        <Navbar
          logo={logo}
          nav_type={nav_type}
          imagePath={imagePath}
          blog_list={blog_list}
          categories={categories}
        />
        <FullContainer className="bg-gray-100">
          <div className="  text-start  w-full py-14 mb-8   ">
            <div className=" mx-auto max-w-[1200px] ">
              <h1 className="text-4xl font-semibold capitalize pb-8 pt-5 w-full">
                Privacy & Policy
              </h1>
              <Breadcrumbs className=" gap-2  " breadcrumbs={breadcrumbs} />
            </div>
          </div>
        </FullContainer>

        <FullContainer className="mx-auto max-w-[1200px]">
          <div
            className="prose max-w-full w-full my-5"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </FullContainer>

        <Footer
          blog_list={blog_list}
          categories={categories}
          copyright=""
          logo={logo}
          imagePath={imagePath}
        />

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `https://${domain}/privacy-policy`,
                url: `https://${domain}/privacy-policy`,
                name: meta?.title,
                description: meta?.description,
                isPartOf: {
                  "@id": `https://${domain}`,
                },
                inLanguage: "en-US",
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: breadcrumbs.map((breadcrumb, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  name: breadcrumb.label,
                  item: `https://${domain}${breadcrumb.url}`,
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

  const meta = await callBackendApi({ domain, type: "meta_privacy" });
  const favicon = await callBackendApi({ domain, type: "favicon" });
  const categories = await callBackendApi({ domain, type: "categories" });
  const blog_list = await callBackendApi({ domain, type: "blog_list" });
  const nav_type = await callBackendApi({ domain, type: "nav_type" });
  const policy = await callBackendApi({ domain, type: "policy" });
  const terms = await callBackendApi({ domain, type: "terms" });
  const logo = await callBackendApi({ domain, type: "logo" });

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
  let imagePath = null;
  imagePath = await getImagePath(project_id, domain);

  return {
    props: {
      page,
      domain,
      imagePath,
      favicon: favicon?.data[0]?.file_name || null,
      logo: logo?.data[0] || null,
      blog_list: blog_list?.data[0]?.value || [],
      categories: categories?.data[0]?.value || null,
      meta: meta?.data[0]?.value || null,
      contact_details: contact_details?.data[0]?.value || null,
      terms: terms?.data[0]?.value || "",
      policy: policy?.data[0]?.value || "",
      nav_type: nav_type?.data[0]?.value || {},
    },
  };
}
