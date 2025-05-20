import fs from "fs";
import path from "path";
import { remark } from "remark";
import html from "remark-html";

export default async function Page() {
  const filePath = path.join(process.cwd(), "contents", "privacy-policy.md");
  const markdown = fs.readFileSync(filePath, "utf-8");
  const processed = await remark().use(html).process(markdown);
  const contentHtml = processed.toString();

  return <article dangerouslySetInnerHTML={{ __html: contentHtml }} />;
}
