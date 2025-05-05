import React from "react";
import Head from "next/head";
import { cn } from "@/lib/utils";
import { Roboto } from "next/font/google";
import { Cormorant } from "next/font/google";

import Container from "@/components/common/Container";
import FullContainer from "@/components/common/FullContainer";
import AboutBanner from "@/components/containers/AboutBanner";
import Footer from "@/components/containers/Footer";
import Navbar from "@/components/containers/Navbar";
import Rightbar from "@/components/containers/Rightbar";
import MarkdownIt from "markdown-it";

import { callBackendApi, getDomain, getImagePath } from "@/lib/myFun";
import GoogleTagManager from "@/lib/GoogleTagManager";
import JsonLd from "@/components/json/JsonLd";
import useBreadcrumbs from "@/lib/useBreadcrumbs";
import Breadcrumbs from "@/components/common/Breadcrumbs";

const myFont = Roboto({
  subsets: ["cyrillic"],
  weight: ["400", "700"],
});
const font2 = Cormorant({ subsets: ["cyrillic"] });

export default function About({
  page,
  logo,
  meta,
  domain,
  favicon,
  about_me,
  nav_type,
  copyright,
  imagePath,
  blog_list,
  categories,
  contact_details,
}) {
  const markdownIt = new MarkdownIt();
  const content = markdownIt?.render(about_me?.value || "");

  const breadcrumbs = useBreadcrumbs();

  return (
    page?.enable && (
      <div className={myFont.className}>
        <Head>
          <meta charSet="UTF-8" />
          <title>{meta?.title}</title>
          <meta name="description" content={meta?.description} />
          <link rel="author" href={`https://${domain}`} />
          <link rel="publisher" href={`https://${domain}`} />
          <link rel="canonical" href={`https://${domain}/about-us`} />
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
            rel="apple-touch-icon"
            sizes="180x180"
            href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${favicon}`}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={`${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/${imagePath}/${favicon}`}
          />
          <link
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
          <div className="  text-start  w-full py-14 mb-8   " >
          <div  className=" mx-auto max-w-[1200px] " >

            <h1 className="text-4xl font-semibold capitalize pb-8 pt-5 w-full">
              About Us
            </h1>
            <Breadcrumbs
            className=" gap-2  "
              breadcrumbs={breadcrumbs}
            />
          </div>

            
            </div>
        </FullContainer>
        <AboutBanner image={`${imagePath}/${about_me?.file_name}`} />
        <FullContainer>
          <Container className="py-16 mx-auto max-w-[1200px]  ">
            <div className="grid  gap-16 w-full">
              <div className={font2?.className}>
                <div
                  className="prose-xl"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            </div>
          </Container>
        </FullContainer>
        <Footer
          blog_list={blog_list}
          categories={categories}
          logo={logo}
          imagePath={imagePath}
          contact_details={contact_details}
          copyright={copyright}
          about_me={about_me}
        />

        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "WebPage",
                "@id": `https://${domain}/about`,
                url: `https://${domain}/about`,
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
  const logo = await callBackendApi({ domain, type: "logo" });

  let layoutPages = await callBackendApi({
    domain,
    type: "layout",
  });

  const categories = await callBackendApi({ domain, type: "categories" });
  const copyright = await callBackendApi({ domain, type: "copyright" });
  const blog_list = await callBackendApi({ domain, type: "blog_list" });
  const about_me = await callBackendApi({ domain, type: "about_me" });
  const nav_type = await callBackendApi({ domain, type: "nav_type" });
  const meta = await callBackendApi({ domain, type: "meta_home" });

  const contact_details = await callBackendApi({
    domain,
    type: "contact_details",
  });

  let project_id = logo?.data[0]?.project_id || null;
  let imagePath = await getImagePath(project_id, domain);

  let page = null;
  if (Array.isArray(layoutPages?.data) && layoutPages.data.length > 0) {
    const valueData = layoutPages.data[0].value;
    page = valueData?.find((page) => page.page === "about");
  }

  if (!page?.enable) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      page,
      logo: logo.data[0] || null,
      about_me: about_me.data[0] || null,
      imagePath,
      blog_list: blog_list.data[0].value,
      categories: categories?.data[0]?.value || null,
      domain,
      meta: meta?.data[0]?.value || null,
      contact_details: contact_details?.data[0]?.value || null,
      copyright: copyright?.data[0]?.value || null,
      nav_type: nav_type?.data[0]?.value || {},
    },
  };
}
