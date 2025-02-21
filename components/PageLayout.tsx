import React from "react";

const PageLayout = ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <div className="h-full flex flex-col container pb-20 pt-4 max-w-md mx-auto">
      {children}
    </div>
  );
};

export default PageLayout;
