import React from "react";
import { PageHeader, PageHeaderProps } from "./page-header";
import FloatingButton, { FloatingButtonProps } from "./ui/floating-button";

const PageLayout = ({
  children,
  headerProps,
  floatingButtonProps,
}: Readonly<{
  children: React.ReactNode;
  headerProps?: PageHeaderProps;
  floatingButtonProps?: FloatingButtonProps;
}>) => {
  return (
    <div className="h-full flex flex-col container pb-20 px-4 max-w-md mx-auto">
      {!!headerProps && <PageHeader {...headerProps} />}
      {children}
      {floatingButtonProps && <FloatingButton {...floatingButtonProps} />}
    </div>
  );
};

export default PageLayout;
