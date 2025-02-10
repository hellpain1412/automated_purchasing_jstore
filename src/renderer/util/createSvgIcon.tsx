"use client";
import { SvgIcon, SvgIconProps } from "@mui/joy";
import * as React from "react";

/**
 * Private module reserved for @mui packages.
 */
export function createSvgIcon(path: React.ReactNode, displayName: string) {
  function Component(props: SvgIconProps, ref: any) {
    return (
      <SvgIcon data-testid={`${displayName}Icon`} ref={ref} {...props}>
        {path}
      </SvgIcon>
    );
  }

  if (process.env.NODE_ENV !== "production") {
    // Need to set `displayName` on the inner component for React.memo.
    // React prior to 16.14 ignores `displayName` on the wrapper.
    Component.displayName = `${displayName}`;
  }

  return React.memo(React.forwardRef(Component));
}
