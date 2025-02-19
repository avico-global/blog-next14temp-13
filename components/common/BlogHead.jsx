import React from "react";
import { cn } from "@/lib/utils";
import { Cormorant } from "next/font/google";

const myFont = Cormorant({ subsets: ["cyrillic"] });

export default function BlogHead({ title, date, author }) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      <p className="italic text-xs w-fit text-gray-400">
        in
        <span className="uppercase text-yellow-600 font-medium ml-2 text-xs">
          Lifestyle
        </span>
      </p>
      <h2 className={cn("font-bold text-5xl", myFont.className)}>{title}</h2>
      <p className="text-xs uppercase">
        By <span className="text-xs underline">{author}</span> -
        <span className="text-gray-500 text-xs"> {date}</span>
      </p>
    </div>
  );
}
