import React from "react";
import { PageHeader, PageHeaderProps } from "./page-header";
import FloatingButton, { FloatingButtonProps } from "../ui/floating-button";

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
    <div className="h-full min-h-screen flex flex-col pb-24 px-4 md:px-8 lg:pl-[300px] lg:pr-8 mx-auto w-full max-w-6xl lg:pb-10 pt-4">
      {!!headerProps && <PageHeader {...headerProps} />}
      <div className="flex-1 mt-2">{children}</div>
      {floatingButtonProps && <FloatingButton {...floatingButtonProps} />}
    </div>
  );
};

export default PageLayout;
