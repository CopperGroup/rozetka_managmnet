import { NextRequest, NextResponse } from "next/server";
import JSZip from "jszip";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const { name, files } = await req.json();

    if (!name || !files || !Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const zip = new JSZip();

    const componentUploads = [
      "Header.tsx",
      "BannerHero.tsx",
      "AboutUs.tsx",
      "Brand.tsx",
      "Categories.tsx",
      "History.tsx",
      "Footer.tsx",
      "BurgerMenu.tsx",
      "ProductCard.tsx",
    ];

    const imageUploads = [
      "banner-hero.jpg",
      "1.jpg",
      "2.jpg",
      "3.jpg",
      "about-us.jpeg",
      "history-image.jpg",
      "loginbackground.jpg",
    ];

    // Function to determine the correct filename and folder path
    const getFileNameAndFolder = (url: string) => {
      const originalName = url.split("/").pop() || "file";
      const extension = originalName.substring(originalName.lastIndexOf("."));

      // Determine file type and folder structure
      if (componentUploads.includes(originalName)) {
        if (originalName === "ProductCard.tsx") {
          return { filename: "ProductCard.tsx", folder: "components/cards" };
        }
        if (originalName === "BannerHero.tsx") {
          return { filename: "BannerHero.tsx", folder: "components/banners" };
        }
        if (["AboutUs.tsx", "Brand.tsx", "History.tsx", "Categories.tsx"].includes(originalName)) {
          return { filename: originalName, folder: "components/landing" };
        }
        if (["Header.tsx", "BurgerMenu.tsx", "Footer.tsx"].includes(originalName)) {
          return { filename: originalName, folder: "components/shared" };
        }
      }

      if (imageUploads.includes(originalName)) {
        return { filename: originalName, folder: "public/assets" };
      }

      return { filename: originalName, folder: "others" }; // Default folder for unknown types
    };

    // Download each file and add it to the appropriate folder
    const filePromises = files.map(async (fileUrl: string) => {
      const response = await axios.get(fileUrl, { responseType: "arraybuffer" });
      const { filename, folder } = getFileNameAndFolder(fileUrl);

      // Add file to the ZIP under the correct folder
      zip.folder(folder).file(filename, response.data);
    });

    await Promise.all(filePromises);

    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: "nodebuffer" });

    return new Response(zipBlob, {
      headers: {
        "Content-Disposition": `attachment; filename="${name}.zip"`,
        "Content-Type": "application/zip",
      },
    });
  } catch (error) {
    console.error("Error generating ZIP:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
