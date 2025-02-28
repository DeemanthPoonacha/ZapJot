import React from "react";
import { PageHeader, PageHeaderProps } from "./page-header";

const PageLayout = ({
  children,
  headerProps,
}: Readonly<{ children: React.ReactNode; headerProps?: PageHeaderProps }>) => {
  return (
    <div className="h-full flex flex-col container pb-20 px-4 max-w-md mx-auto">
      <PageHeader {...headerProps} />
      {children}
    </div>
  );
};

export default PageLayout;
