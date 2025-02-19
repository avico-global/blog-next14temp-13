import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";

export default function Breadcrumbs({ breadcrumbs, className }) {
  return (
    <div
      className={cn(
        "w-full flex items-center flex-wrap py-2 font-semibold text-gray-500",
        className
      )}
    >
      {breadcrumbs.map((breadcrumb, index) => (
        <span key={index} className="flex items-center gap-2">
          {index > 0 && <span className="w-1 h-1 rounded-full bg-gray-500" />}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-black">
              {breadcrumb.label
                ?.replaceAll("%20", " ")
                ?.replaceAll("%E2%80%99", "'")
                ?.replaceAll("%E2%80%93", "-")}
            </span>
          ) : (
            <Link
              title={breadcrumb.label
                ?.replaceAll(" ", "-")
                ?.replaceAll("%20", "-")
                ?.replaceAll("%E2%80%99", "'")
                ?.replaceAll("%E2%80%93", "-")}
              href={breadcrumb.url}
              className="hover:underline transition-all"
            >
              {breadcrumb.label
                ?.replaceAll("%20", " ")
                ?.replaceAll("%E2%80%99", "'")}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
