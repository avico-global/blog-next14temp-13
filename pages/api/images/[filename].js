// pages/api/static/[...path].js

import fs from "fs";
import path from "path";
import mime from "mime-types";

export default async function handler(req, res) {
  const { filename } = req.query;
  const domain = req.headers.host.replace(/^www\./, "");

  const filePath = `./public/static_images/${domain}`;

  // Add timeout and request limiting to prevent infinite loops
  const requestTimeout = setTimeout(() => {
    if (!res.headersSent) {
      res.status(408).send("Request timeout");
    }
  }, 5000); // 5 second timeout

  try {
    if (!fs.existsSync(filePath)) {
      // If domain folder doesn't exist, create it
      fs.mkdirSync(filePath, { recursive: true });

      // Prevent infinite loops by checking if we're already processing this domain
      const lockFile = path.resolve(filePath, '.processing');
      if (fs.existsSync(lockFile)) {
        clearTimeout(requestTimeout);
        return res.status(429).send("Already processing images for this domain");
      }

      // Create lock file
      fs.writeFileSync(lockFile, new Date().toISOString());

      try {
        // Now copy all the files from the project directory to this domain folder by calling the project api
        const projectApiUrl = `${process.env.NEXT_PUBLIC_SITE_MANAGER}/api/public/project_images/${domain}`;

        const projectImages = await fetch(projectApiUrl, {
          timeout: 10000, // 10 second timeout for external API
        });
        
        if (projectImages.ok) {
          const projectImagesData = await projectImages.json();

          // Now copy all the files from the project directory to this domain folder
          for (const item of projectImagesData.data) {
            const { name, type } = item;

            // Get the image from this url: https://api.sitebuilderz.com/images/project_images/6812467a4719355dec57d86b/name
            if (type === "file") {
              const imageUrl = `${process.env.NEXT_PUBLIC_SITE_MANAGER}/images/project_images/${projectImagesData.project_id}/${name}`;
              const imageResponse = await fetch(imageUrl, {
                timeout: 10000, // 10 second timeout per image
              });
              if (imageResponse.ok) {
                const imageBuffer = await imageResponse.arrayBuffer();
                fs.writeFileSync(path.resolve(filePath, name), Buffer.from(imageBuffer));
              }
            }
          }

          // Now call backend api to restart the app 
          const restartAppUrl = `${process.env.NEXT_PUBLIC_SITE_MANAGER}/api/public/restart_app/${projectImagesData.project_id}`;
          const restartAppResponse = await fetch(restartAppUrl, {
            timeout: 5000, // 5 second timeout for restart
          });
          if (restartAppResponse.ok) {
            // App restarted successfully
          }
        }
      } finally {
        // Always remove lock file
        if (fs.existsSync(lockFile)) {
          fs.unlinkSync(lockFile);
        }
      }
    }
  } catch (error) {
    clearTimeout(requestTimeout);
    if (!res.headersSent) {
      return res.status(500).send("Internal Server Error");
    }
  }

  // Resolve the file path from the static_images directory
  const fullPath = path.resolve(filePath, filename);

  try {
    // Check if the file exists
    if (fs.existsSync(fullPath)) {
      const file = fs.readFileSync(fullPath);
      const mimeType = mime.lookup(fullPath) || "application/octet-stream";
      res.setHeader("Content-Type", mimeType);
      res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
      res.send(file);
    } else {
      res.status(404).send("File not found");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  } finally {
    clearTimeout(requestTimeout);
  }
}
