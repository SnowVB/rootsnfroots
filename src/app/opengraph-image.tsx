import { ImageResponse } from "next/og";

export const alt = "Дерево Опоры — Опора не ресурс, а ресурс не цель";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const TITLE = "Дерево Опоры";
const SUBTITLE = "Опора — не ресурс, а ресурс — не цель";

// Satori (the renderer behind ImageResponse) has no built-in Cyrillic
// glyphs — text renders as tofu boxes unless a font buffer covering those
// characters is passed explicitly. Fetching only the glyphs we actually use
// (via Google Fonts' `text` param) keeps this fast instead of pulling a
// full font file.
async function loadTitleFont(text: string) {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Literata:wght@500&text=${encodeURIComponent(text)}`,
  ).then((res) => res.text());
  const fontUrl = css.match(/src: url\(([^)]+)\)/)?.[1];
  if (!fontUrl) throw new Error("Could not resolve Literata font URL for OG image");
  return fetch(fontUrl).then((res) => res.arrayBuffer());
}

export default async function Image() {
  const fontData = await loadTitleFont(TITLE + SUBTITLE);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#FDFBF7",
        }}
      >
        <div style={{ display: "flex", fontFamily: "Literata", fontSize: 72, color: "#2B2A26" }}>
          {TITLE}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontFamily: "Literata",
            fontSize: 28,
            color: "#8B6344",
          }}
        >
          {SUBTITLE}
        </div>
      </div>
    ),
    { ...size, fonts: [{ name: "Literata", data: fontData, style: "normal", weight: 500 }] },
  );
}
