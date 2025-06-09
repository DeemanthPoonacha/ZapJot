import "./wysiwyg.css";

export const WysiwygViewer = ({ html }: { html: string }) => {
  return <div className="content" dangerouslySetInnerHTML={{ __html: html }} />;
};
