import { NextResponse } from "next/server";
import { sendWebinarReminders } from "@/lib/campaigns";

/**
 * Rappels de webinaires (24 h avant la session).
 * À déclencher une fois par heure :
 *   curl -X POST https://tradingeducationpro.com/api/cron/rappels-webinaires \
 *     -H "x-cron-secret: $CRON_SECRET"
 */
function isAuthorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = request.headers.get("x-cron-secret");
  const query = new URL(request.url).searchParams.get("secret");
  return header === secret || query === secret;
}

async function run(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Non autorisé." }, { status: 401 });
  }
  const result = await sendWebinarReminders();
  return NextResponse.json({ ok: true, ...result });
}

export async function POST(request: Request) {
  return run(request);
}

export async function GET(request: Request) {
  return run(request);
}
