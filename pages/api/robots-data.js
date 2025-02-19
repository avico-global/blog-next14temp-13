export default async function handler(req, res) {
  const robotsData = `
    User-agent: *
    Disallow: /api/
    Allow: /
  `;

  res.status(200).json({ data: robotsData });
}
