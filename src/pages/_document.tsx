import { Html, Head, Main, NextScript } from "next/document";
import { PROJECT_DISPLAY_NAME } from "@/config/brand";

export default function Document() {
  return (
    <Html lang="en" className="dark">
      <Head>
        <title>{PROJECT_DISPLAY_NAME}</title>
        <meta name="application-name" content={PROJECT_DISPLAY_NAME} />
        <meta property="og:title" content={PROJECT_DISPLAY_NAME} />
        <link rel="icon" href="/icon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
