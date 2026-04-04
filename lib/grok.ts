// Grok API integration for real-time interview questions

export interface GeneratedQuestion {
  id: string;
  question: string;
  answer: string;
  code?: string;
  difficulty: "easy" | "medium" | "hard";
  topic: string;
}

export async function generateInterviewQuestions(
  company: string,
  topic: string,
  difficulty: "easy" | "medium" | "hard" | "mixed" = "mixed",
  count: number = 3
): Promise<GeneratedQuestion[]> {
  const res = await fetch("/api/grok", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, topic, difficulty, count }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to generate questions");
  }

  const data = await res.json();
  return data.questions ?? [];
}

export async function getRealTimeQuestion(
  company: string,
  topic?: string
): Promise<GeneratedQuestion> {
  const res = await fetch("/api/grok/single", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ company, topic }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Failed to get question");
  }

  const data = await res.json();
  return data.question;
}
