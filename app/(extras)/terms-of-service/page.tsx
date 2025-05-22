import fs from "fs";
import { Metadata } from "next";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export const metadata: Metadata = {
  title: "Terms of Service",
};
export default async function Page() {
  const filePath = path.join(process.cwd(), "contents", "terms-of-service.md");
  const markdown = fs.readFileSync(filePath, "utf-8");
  const processed = await remark().use(html).process(markdown);
  const contentHtml = processed.toString();

  return <article dangerouslySetInnerHTML={{ __html: contentHtml }} />;
}
