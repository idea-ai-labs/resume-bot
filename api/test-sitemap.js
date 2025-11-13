import fs from "fs";
import path from "path";

export default function handler(req, res) {
  res.setHeader("Content-Type", "application/xml");

  const baseUrl = "https://resume-samurai.vercel.app";
  const rootDir = process.cwd(); // scan project root

  // Function to recursively get all .html files
  function getHtmlFiles(dir) {
    const files = fs.readdirSync(dir);
    let urls = [];

    files.forEach((file) => {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        urls = urls.concat(getHtmlFiles(fullPath));
      } else if (file.endsWith(".html")) {
        let relative = fullPath.replace(rootDir, "").replace(/\\/g, "/");
        if (!relative.startsWith("/")) relative = "/" + relative;
        urls.push(`${baseUrl}${relative}`);
      }
    });

    return urls;
  }

  // Scan root and /blog folder
  const rootUrls = getHtmlFiles(rootDir);
  const blogDir = path.join(rootDir, "blog");
  let blogUrls = [];
  if (fs.existsSync(blogDir)) {
    blogUrls = getHtmlFiles(blogDir);
  }

  const allUrls = [...new Set([...rootUrls, ...blogUrls])]; // remove duplicates

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls.map((u) => `  <url><loc>${u}</loc></url>`).join("\n")}
</urlset>`;

  res.status(200).send(xml);
}
