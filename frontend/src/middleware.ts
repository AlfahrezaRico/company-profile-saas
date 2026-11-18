import { NextRequest, NextResponse } from "next/server";

const CANONICAL_HOST = "www.ptalkarimjayaabadi.com";
const LEGACY_HOST = "company-profile-saas-j3an.vercel.app";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";
  if (host === LEGACY_HOST) {    const url = request.nextUrl.clone();
    url.host = CANONICAL_HOST;

    url.protocol = "https";   url.port = "";
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}
export const config = {
  matcher: "/:path*",
};