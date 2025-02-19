// pages/api/downloadImages.js

import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { imageUrls } = req.body;

    if (!imageUrls || !Array.isArray(imageUrls)) {
      res.status(400).json({ message: "Invalid image URLs provided" });
      return;
    }

    try {
      // Ensure the public/images directory exists
      const imagesDirectory = path.join(process.cwd(), "public", "images");
      if (!fs.existsSync(imagesDirectory)) {
        fs.mkdirSync(imagesDirectory, { recursive: true });
      }

      // Download each image if it does not already exist in the public/images folder
      for (const url of imageUrls) {
        try {
          const fileName = path.basename(url); // Extract only the file name from the URL
          const filePath = path.join(imagesDirectory, fileName);

          // Check if the file already exists
          if (fs.existsSync(filePath)) {
            console.log(
              `Image already exists: ${fileName}, skipping download.`
            );
            continue; // Skip to the next image if this one already exists
          }

          // Fetch and save the image if it does not exist
          const response = await fetch(url);
          if (!response.ok) {
            console.error(`Failed to fetch image: ${url}`);
            continue; // Skip to the next image if this one fails to fetch
          }

          const buffer = await response.arrayBuffer();
          fs.writeFileSync(filePath, Buffer.from(buffer));
          console.log(`Image downloaded and saved: ${fileName}`);
        } catch (err) {
          console.error(`Error saving image ${url}:`, err);
        }
      }

      res.status(200).json({ message: "Images processed successfully!" });
    } catch (error) {
      console.error("Error processing images:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
