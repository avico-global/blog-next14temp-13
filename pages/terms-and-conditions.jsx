import React, { useEffect } from "react";

// Components
import Container from "@/components/common/Container";
import FullContainer from "@/components/common/FullContainer";
import Navbar from "@/components/containers/Navbar";
import Footer from "@/components/containers/Footer";
import GoogleTagManager from "@/lib/GoogleTagManager";
import MarkdownIt from "markdown-it";
import useBreadcrumbs from "@/lib/useBreadcrumbs";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import { callBackendApi, getDomain, getImagePath } from "@/lib/myFun";

import Head from "next/head";
import { Raleway } from "next/font/google";
import JsonLd from "@/components/json/JsonLd";
import { useRouter } from "next/router";
const myFont = Raleway({
  subsets: ["cyrillic", "cyrillic-ext", "latin", "latin-ext"],
});

export default function Terms({
  domain,
  imagePath,
  logo,
  favicon,
  blog_list,
  categories,
  meta,
  contact_details,
  terms,
  nav_type,
  page,
}) {
  const markdownIt = new MarkdownIt();
  const content = markdownIt?.render(terms || "");
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
          <link
            rel="canonical"
            href={`https://${domain}/terms-and-conditions`}
          />
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
            href={`${imagePath}/${favicon}`}
          />
            <link
            title={favicon || "Favicon"}
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${imagePath}/${favicon}`}
          />
          <link
            title={favicon || "Favicon"}
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={`${imagePath}/${favicon}`}
          />
        </Head>

        <Navbar
          logo={logo}
          nav_type={nav_type}
          imagePath={imagePath}
          blog_list={blog_list}
          categories={categories}
          contact_details={contact_details}
        />

<FullContainer className="bg-gray-100">
          <div className="  text-start  w-full py-14 mb-8   " >
          <div  className=" mx-auto max-w-[1200px] " >
            <Breadcrumbs
            className=" gap-2  "
              breadcrumbs={breadcrumbs}
            />
          </div>

            
            </div>
        </FullContainer>

        <FullContainer className=" mx-auto max-w-[1200px] " >
            <div
              className="prose max-w-full w-full my-5"
              dangerouslySetInnerHTML={{ __html: content }}
            />
        </FullContainer>

        <Footer
          blog_list={blog_list}
          categories={categories}
          logo={logo}
          imagePath={imagePath}
        />

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `https://${domain}/terms-and-conditions`,
                url: `https://${domain}/terms-and-conditions`,
                name: meta?.title,
                description: meta?.description,
                inLanguage: "en-US",
                publisher: {
                  "@type": "Organization",
                  "@id": `https://${domain}`,
                },
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

  const logo = await callBackendApi({ domain, type: "logo" });
  const favicon = await callBackendApi({ domain, type: "favicon" });
  const blog_list = await callBackendApi({ domain, type: "blog_list" });
  const categories = await callBackendApi({ domain, type: "categories" });
  const nav_type = await callBackendApi({ domain, type: "nav_type" });
  const terms = await callBackendApi({ domain, type: "terms" });
  const meta = await callBackendApi({ domain, type: "meta_terms" });

  const contact_details = await callBackendApi({
    domain,
    type: "contact_details",
  });

  let page = null;
  if (Array.isArray(layoutPages?.data) && layoutPages.data.length > 0) {
    const valueData = layoutPages.data[0].value;
    page = valueData?.find((page) => page.page === "terms");
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
      logo: logo?.data[0] || null,
      favicon: favicon?.data[0]?.file_name || null,
      blog_list: blog_list?.data[0]?.value || [],
      categories: categories?.data[0]?.value || null,
      meta: meta?.data[0]?.value || null,
      contact_details: contact_details?.data[0]?.value || null,
      terms: terms?.data[0]?.value || "",
      nav_type: nav_type?.data[0]?.value || {},
    },
  };
}
