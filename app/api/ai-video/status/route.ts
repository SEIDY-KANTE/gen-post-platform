import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { taskId } = (await req.json()) as { taskId?: string };
    if (!taskId) {
      return NextResponse.json(
        { error: "taskId is required" },
        { status: 400 }
      );
    }

    const veo3ApiKey = process.env.VEO3_API_KEY;
    if (!veo3ApiKey) {
      return NextResponse.json({ error: "Veo3 key missing" }, { status: 500 });
    }

    const res = await fetch(`https://veo3api.com/tasks/${taskId}`, {
      headers: {
        Authorization: `Bearer ${veo3ApiKey}`,
      },
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Veo3 status error", text);
      return NextResponse.json(
        { error: "Status check failed" },
        { status: 502 }
      );
    }

    const data = await res.json();
    const status =
      data?.data?.status ||
      data?.status ||
      (data?.data?.video_url ? "completed" : "pending");
    const url = data?.data?.video_url || data?.data?.output_url || null;

    return NextResponse.json({ status, url, taskId });
  } catch (error) {
    console.error("Status check failed", error);
    return NextResponse.json({ error: "Status check failed" }, { status: 500 });
  }
}
