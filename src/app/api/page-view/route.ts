import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { markPageViewNotified, recordUniquePageView } from "@/firebase";
import { sendEmail } from "@/lib/mailTransport";

export const runtime = "nodejs";

function escapeHtml(value: string) {
  return value.replace(/[&<>\"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '\"': "&quot;",
      "'": "&#39;",
    };
    return entities[character];
  });
}

function limited(value: unknown, length: number) {
  return typeof value === "string" ? value.slice(0, length) : "";
}

function getDevice(userAgent: string) {
  if (/ipad|tablet|kindle|silk/i.test(userAgent)) return "Tablet";
  if (/android/i.test(userAgent) && !/mobile/i.test(userAgent)) return "Tablet";
  if (/mobile|iphone|ipod|android/i.test(userAgent)) return "Mobile";
  return "Desktop or unknown";
}

function getBrowser(userAgent: string) {
  if (/edg\//i.test(userAgent)) return "Microsoft Edge";
  if (/firefox\//i.test(userAgent)) return "Firefox";
  if (/opr\//i.test(userAgent)) return "Opera";
  if (/chrome\//i.test(userAgent)) return "Chrome";
  if (/safari\//i.test(userAgent)) return "Safari";
  return "Unknown";
}

function getOperatingSystem(userAgent: string) {
  if (/windows/i.test(userAgent)) return "Windows";
  if (/android/i.test(userAgent)) return "Android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS/iPadOS";
  if (/mac os|macintosh/i.test(userAgent)) return "macOS";
  if (/linux/i.test(userAgent)) return "Linux";
  return "Unknown";
}

function cleanReferrer(value: string) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return "";
  }
}

function getIpAddress(request: Request) {
  const headers = request.headers;
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    headers.get("cf-connecting-ip") ||
    headers.get("x-vercel-forwarded-for") ||
    "Unavailable"
  ).slice(0, 100);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const sessionId = limited(body?.sessionId, 50);
    const path = limited(body?.path, 500);
    if (
      !/^[0-9a-f-]{36}$/i.test(sessionId) ||
      !path.startsWith("/") ||
      path.startsWith("//") ||
      /[?#\r\n]/.test(path)
    ) {
      return NextResponse.json({ error: "Invalid page view" }, { status: 400 });
    }

    const headers = request.headers;
    const userAgent = (headers.get("user-agent") || "Unknown").slice(0, 1000);
    const screen = body?.screen && typeof body.screen === "object" ? body.screen : {};
    const id = createHash("sha256").update(`${sessionId}:${path}`).digest("hex");
    const { created, data } = await recordUniquePageView(id, {
      id,
      sessionId,
      pagePath: path,
      pageTitle: limited(body?.title, 300),
      referrer: cleanReferrer(limited(body?.referrer, 1000)),
      ipAddress: getIpAddress(request),
      country: headers.get("x-vercel-ip-country") || headers.get("cf-ipcountry") || "Unknown",
      device: getDevice(userAgent),
      browser: getBrowser(userAgent),
      operatingSystem: getOperatingSystem(userAgent),
      userAgent,
      language: limited(body?.language, 80),
      timeZone: limited(body?.timeZone, 100),
      screen: {
        width: Number(screen.width) || 0,
        height: Number(screen.height) || 0,
        viewportWidth: Number(screen.viewportWidth) || 0,
        viewportHeight: Number(screen.viewportHeight) || 0,
      },
      host: (headers.get("x-forwarded-host") || headers.get("host") || "Unknown").slice(0, 255),
    });

    if (data.notificationSent) {
      return NextResponse.json({ unique: created, notified: true });
    }

    const details: Array<[string, unknown]> = [
      ["Page", data.pagePath],
      ["Title", data.pageTitle || "Unknown"],
      ["Time", new Date().toISOString()],
      ["IP address", data.ipAddress],
      ["Country", data.country],
      ["Device", data.device],
      ["Browser", data.browser],
      ["Operating system", data.operatingSystem],
      ["Language", data.language || "Unknown"],
      ["Time zone", data.timeZone || "Unknown"],
      [
        "Screen / viewport",
        `${data.screen.width}x${data.screen.height} / ${data.screen.viewportWidth}x${data.screen.viewportHeight}`,
      ],
      ["Referrer", data.referrer || "Direct / unavailable"],
      ["Session ID", data.sessionId],
      ["Host", data.host],
      ["User agent", data.userAgent],
    ];

    try {
      await sendEmail({
        to: "wesiudev@gmail.com",
        subject: `Stickerka page view: ${data.pagePath}`,
        text: details.map(([label, value]) => `${label}: ${value}`).join("\n"),
        html: `<h2>Unique page view</h2><table>${details
          .map(
            ([label, value]) =>
              `<tr><th align="left">${escapeHtml(String(label))}</th><td>${escapeHtml(String(value ?? ""))}</td></tr>`
          )
          .join("")}</table>`,
      });
      await markPageViewNotified(id);
    } catch (error) {
      console.error("Page-view email notification failed:", error);
      return NextResponse.json({ unique: created, notified: false }, { status: 202 });
    }

    return NextResponse.json({ unique: created, notified: true }, { status: 201 });
  } catch (error) {
    console.error("Page-view processing failed:", error);
    return NextResponse.json({ error: "Could not save page view" }, { status: 500 });
  }
}
