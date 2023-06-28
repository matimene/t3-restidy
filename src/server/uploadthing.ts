import type { NextApiRequest, NextApiResponse } from "next";
// import { currentUser } from "@clerk/nextjs";

import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  products: f({ image: { maxFileSize: "1MB" } }) //max count for e/ entity?
    // Set permissions and file types for this FileRoute
    // .middleware(({ req, res }) => {
    // This code runs on your server before upload
    // const { user } = await currentUser();
    // // If you throw, the user will not be able to upload
    // if (!user) throw new Error("Unauthorized");
    // // Whatever is returned here is accessible in onUploadComplete as `metadata`
    // return { userId: user.id };
    // })
    .onUploadComplete(({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for file:", file.name);
      console.log("file url", file.url);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
