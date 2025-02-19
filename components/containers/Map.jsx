import React from "react";
import LazyIframe from "./LazyIframe";

export default function Map() {
  return (
    <LazyIframe
      title="United States"
      className="w-full h-96"
      url="https://maps.google.com/maps?width=520&amp;height=400&amp;hl=en&amp;q=%20Los%20Angeles+(Los%20Angeles%20California)&amp;t=&amp;z=12&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
    />
  );
}
