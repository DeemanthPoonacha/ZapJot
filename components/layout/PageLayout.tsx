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
    <div className="h-full flex flex-col container pb-20 px-4 mx-auto lg:max-w-5xl lg:pl-72 xl:pl-48 2xl:pl-4 lg:pb-10">
      {!!headerProps && <PageHeader {...headerProps} />}
      <div className="flex-1">{children}</div>
      {floatingButtonProps && <FloatingButton {...floatingButtonProps} />}
    </div>
  );
};

export default PageLayout;
