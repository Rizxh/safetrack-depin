import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Syne, JetBrains_Mono } from "next/font/google";
import "maplibre-gl/dist/maplibre-gl.css";
import { Web3Provider } from "@/providers/WagmiProvider";

const syne = Syne({
  weight: ["400", "700", "800"],
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <Web3Provider>
      <div className={`${syne.variable} ${jetbrainsMono.variable} font-mono`}>
        <Component {...pageProps} />
      </div>
    </Web3Provider>
  );
}
