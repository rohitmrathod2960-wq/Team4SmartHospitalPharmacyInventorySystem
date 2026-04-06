import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // free model
        messages: [
          {
            role: "system",
            content: `
You are a pharmacy assistant.
Explain medicine with:
- Uses
- Dosage
- Side effects
- Storage
            `,
          },
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });

    const data = await res.json();

    return NextResponse.json({
      reply: data.choices[0].message.content,
    });

  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}