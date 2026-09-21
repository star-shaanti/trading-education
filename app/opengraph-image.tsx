import { ImageResponse } from "next/og";

/**
 * Image Open Graph par défaut (1200×630) : elle alimente `og:image` et
 * `twitter:image` sur toutes les pages qui n'en définissent pas (accueil, listes,
 * pages historiques). Les visuels Discover/nouvelles viendront ensuite par page.
 */
export const alt = "Trading Education — analyses, rapports et webinaires gratuits";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
/**
 * Runtime edge : la génération d'image embarque correctement sa police
 * (le runtime Node rencontre un problème de chemin de police sous Windows).
 */
export const runtime = "edge";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px",
          background: "linear-gradient(135deg, #0B132B 0%, #1E1B4B 55%, #0E7490 100%)",
          color: "#F8FAFC",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ width: 18, height: 96, background: "#16A34A", borderRadius: 6 }} />
            <div style={{ width: 18, height: 60, background: "#DC2626", borderRadius: 6 }} />
            <div style={{ width: 18, height: 120, background: "#22D3EE", borderRadius: 6 }} />
            <div style={{ width: 18, height: 78, background: "#F59E0B", borderRadius: 6 }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 26, letterSpacing: 4, color: "#A5B4FC", textTransform: "uppercase" }}>
              Plateforme éducative
            </span>
            <span style={{ fontSize: 56, fontWeight: 700 }}>Trading Education</span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <span style={{ fontSize: 66, fontWeight: 800, lineHeight: 1.1 }}>
            Analyses, rapports &amp; webinaires
          </span>
          <span style={{ fontSize: 34, color: "#C7D2FE" }}>
            100 % gratuit · sans paywall · sans donnée bancaire
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#94A3B8" }}>
          <span>tradingeducationpro.com</span>
          <span>FR · EN · ES · DE · IT · HI · AR · RU</span>
        </div>
      </div>
    ),
    size
  );
}
