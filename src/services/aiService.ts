export async function generateTasks(apiKey: string, prompt: string, fileContent?: string) {
  const systemPrompt = `You are a task list generator that creates structured tasks with descriptions and code examples.
  Generate a comprehensive task list in the following JSON structure:
  {
    "name": "Task List Name",
    "data": [
      {
        "id": "unique-uuid",
        "text": "Task title or description",
        "completed": false,
        "isHeadline": false,
        "createdAt": "2024-03-20T12:00:00.000Z",
        "codeBlock": {
          "language": "javascript",
          "code": "console.log('Example code');"
        },
        "richText": "<p>Detailed description with <strong>formatting</strong> and <ul><li>bullet points</li></ul></p>",
        "optional": false
      }
    ]
  }

  Guidelines:
  - Create clear, actionable tasks
  - Use headlines (isHeadline: true) to group related tasks
  - Include code examples when relevant
  - Add rich text descriptions for complex tasks
  - Mark optional tasks appropriately
  - Ensure logical task ordering
  - Include all necessary steps
  - Use descriptive task titles
  - Add helpful code comments
  - Break down complex tasks into subtasks`;

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: systemPrompt },
          { text: `\n\nCreate a task list for: ${prompt}` },
          ...(fileContent ? [{ text: `\n\nUse this additional context:\n${fileContent}` }] : []),
          { text: "\n\nRespond ONLY with the JSON, no additional text or markdown formatting." }
        ]
      }]
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`Failed to generate content: ${response.statusText} - ${errorData.error?.message || 'No details provided'}`);
  }

  return response.json();
} 