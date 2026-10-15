import { NextResponse } from "next/server";

export async function GET() {
  // Replace this line with the exact text line provided by your ad network dashboard (e.g., GameMonetize)
  const adsTxtContent = "gamemonetize.com, PUB-12345, DIRECT, f08c47fec0942fa0"; 

  return new NextResponse(adsTxtContent, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}