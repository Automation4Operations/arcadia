import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #7C3AED 0%, #4F46E5 55%, #06B6D4 100%)",
          borderRadius: "16px",
          border: "3px solid #22D3EE",
          color: "#FDE047",
          fontSize: 40,
          fontWeight: 900,
          fontFamily: "sans-serif",
        }}
      >
        A⚡
      </div>
    ),
    { ...size }
  );
}
