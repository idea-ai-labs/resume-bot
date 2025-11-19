export const config = {
  api: {
    bodyParser: false,
  },
};

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml");
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );

  const pages = [
    "/", // index.html
    "/about.html",
    "/terms.html",
    "/contact.html",
    "/privacy.html",
    "/testimonials.html",
    "/how-we-are-different.html",
    "/blog/post1.html",
    "/blog/post2.html",
    "/blog/post3.html"
  ];

  const urls = pages
    .map(
      (path) => `
<url>
  <loc>https://resume-samurai.vercel.app${path}</loc>
  <priority>0.8</priority>
</url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  res.status(200).send(xml);
}
