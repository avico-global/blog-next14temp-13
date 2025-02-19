import fs from "fs";
import path from "path";

export default function handler(req, res) {
  // Define the path to the 'images' folder inside the 'public' directory
  const imagesDirectory = path.join(process.cwd(), "public/images");

  // Read the directory contents
  fs.readdir(imagesDirectory, (err, files) => {
    if (err) {
      return res.status(500).json({ error: "Failed to read images directory" });
    }
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|svg)$/i.test(file)
    );
    res.status(200).json({ images: imageFiles });
  });
}
