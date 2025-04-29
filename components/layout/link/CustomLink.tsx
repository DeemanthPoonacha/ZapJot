"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import NextLink from "next/link";
import { forwardRef } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

import { shouldTriggerStartEvent } from "./should-trigger-start-event";

NProgress.configure({ showSpinner: false });

export const Link = forwardRef<HTMLAnchorElement, React.ComponentProps<"a">>(
  function Link({ href, onClick, ...rest }, ref) {
    const useLink = href && href.startsWith("/");
    if (!useLink) return <a href={href} onClick={onClick} {...rest} />;

    return (
      <NextLink
        href={href}
        onClick={(event) => {
          if (shouldTriggerStartEvent(href, event)) NProgress.start();
          if (onClick) onClick(event);
        }}
        {...rest}
        ref={ref}
      />
    );
  }
);

export function NProgressDone() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => {
    NProgress.done();
  }, [pathname, searchParams]);
  return null;
}

import { useRouter } from "next/navigation";

export function useNProgressRouter() {
  const router = useRouter();

  const routerPush = (href: string) => {
    NProgress.start();
    router.push(href);
  };

  return { routerPush };
}
