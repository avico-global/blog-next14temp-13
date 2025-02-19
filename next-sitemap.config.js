const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

module.exports = {
  siteUrl: siteUrl || "http://localhost:3000", // Default to localhost if not set
  generateRobotsTxt: true, // (Optional) Generate a robots.txt file
  // ...other options
};
