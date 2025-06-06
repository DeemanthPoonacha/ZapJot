"use client";
import { useRef, useState } from "react";
import JoditEditor from "jodit-react";
import "./wysiwyg.css";

type Props = {
  initialValue?: string;
  onChange: (value: string) => void;
};

const WysiwygEditor: React.FC<Props> = ({ initialValue = "", onChange }) => {
  const editor = useRef(null);
  const [content, setContent] = useState(initialValue);

  return (
    <JoditEditor
      ref={editor}
      value={content}
      config={{
        readonly: false,
        minHeight: 400,
        theme: "default",
        width: "100%",
        maxWidth: "100%",
        style: {},
      }}
      onBlur={(newContent) => {
        setContent(newContent);
        onChange(newContent);
      }}
    />
  );
};

export default WysiwygEditor;
