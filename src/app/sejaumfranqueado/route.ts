import { NextResponse } from "next/server";
import { getFranquiaUrl } from "@/lib/queries";

// Kept for old links pointing at /sejaumfranqueado (carried over from the
// previous Bubble site). Redirects to the current franchise URL, read from
// the database instead of hardcoded, so it stays correct when that URL
// changes without needing a code deploy.
export async function GET() {
  const url = await getFranquiaUrl();
  return NextResponse.redirect(url, 308);
}
