import "@/styles/globals.css";
import { Roboto } from "next/font/google";

const myFont = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

export default function App({ Component, pageProps }) {
  return (
    <div className={`${myFont.className} bg-theme min-h-screen`}>
      <Component {...pageProps} />
    </div>
  );
}
