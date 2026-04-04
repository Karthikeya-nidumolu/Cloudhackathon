export async function askGemini(prompt: string): Promise<string> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to get response");
  }

  const data = await res.json();
  return data.text ?? "No response";
}