import { checkOrCreateSitemap } from "@/lib/createInitialFiles";
import { getDomain, getSitemaps } from "@/lib/myFun";

const Sitemap = () => {};

export const getServerSideProps = async ({ req, res, params,query }) => {
  try {
    const id = +params.id;
    const baseUrl = getDomain(req?.headers?.host);
    const xslContent = checkOrCreateSitemap({ DOMAIN: baseUrl });
  const sitemaps = await getSitemaps({ domain: baseUrl, query });
    const modifiedXslContent = xslContent
    ?.replaceAll(
      "%DOMAIN%",
      `${baseUrl.startsWith("https://") ? "" : "https://"}${baseUrl}`
    )
    ?.replaceAll("%TITLE%", "TITLE")

    if (!sitemaps[id - 1]) {
      res.setHeader("Location", "/");
      res.statusCode = 302;
      res.end();
    }
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
  <?xml-stylesheet type="text/xsl" href="data:text/xml;charset=utf-8;base64,${Buffer.from(
    modifiedXslContent
  ).toString("base64")}" ?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
    ${sitemaps[id - 1]
      .map(
        (url) =>
          `
            <url>
              <loc>
                ${
                  url.loc.startsWith("https://")
                    ? url.loc
                    : `https://${
                        url.loc.startsWith("www.") ? url.loc : `www.${url.loc}`
                      }`
                }
              </loc>
              <lastmod>${url.lastmod}</lastmod>
            </url>
          `
      )
      .join("")}
  </urlset>`;

    res.setHeader("Content-Type", "text/xml");
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (err) {
    return { props: {} };
  }
};

export default Sitemap;
