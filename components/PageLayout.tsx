import React from "react";

const PageLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return <div className="h-full flex flex-col">{children}</div>;
};

export default PageLayout;
