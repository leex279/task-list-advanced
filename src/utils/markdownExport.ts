import { Task } from '../types/task';

/**
 * Converts HTML content to Markdown format
 */
function htmlToMarkdown(html: string): string {
  if (!html) return '';
  
  return html
    // Headers
    .replace(/<h([1-6])([^>]*)>(.*?)<\/h[1-6]>/gi, (_, level, __, content) => {
      const hashes = '#'.repeat(parseInt(level));
      return `${hashes} ${content.replace(/<[^>]*>/g, '')}\n\n`;
    })
    // Bold
    .replace(/<(strong|b)([^>]*)>(.*?)<\/(strong|b)>/gi, '**$3**')
    // Italic
    .replace(/<(em|i)([^>]*)>(.*?)<\/(em|i)>/gi, '*$3*')
    // Underline (convert to bold since markdown doesn't have native underline)
    .replace(/<u([^>]*)>(.*?)<\/u>/gi, '**$2**')
    // Strikethrough
    .replace(/<(s|strike|del)([^>]*)>(.*?)<\/(s|strike|del)>/gi, '~~$3~~')
    // Links
    .replace(/<a\s+href="([^"]*)"([^>]*)>(.*?)<\/a>/gi, '[$3]($1)')
    // Images
    .replace(/<img\s+src="([^"]*)"([^>]*alt="([^"]*)"[^>]*)?\s*\/?>/gi, '![$3]($1)')
    .replace(/<img\s+src="([^"]*)"([^>]*)?\s*\/?>/gi, '![]($1)')
    // Unordered lists
    .replace(/<ul([^>]*)>(.*?)<\/ul>/gis, (_, __, content) => {
      return content.replace(/<li([^>]*)>(.*?)<\/li>/gis, '- $2\n') + '\n';
    })
    // Ordered lists
    .replace(/<ol([^>]*)>(.*?)<\/ol>/gis, (_, __, content) => {
      let counter = 1;
      return content.replace(/<li([^>]*)>(.*?)<\/li>/gis, () => {
        return `${counter++}. $2\n`;
      }) + '\n';
    })
    // Paragraphs
    .replace(/<p([^>]*)>(.*?)<\/p>/gi, '$2\n\n')
    // Line breaks
    .replace(/<br\s*\/?>/gi, '\n')
    // Code (inline)
    .replace(/<code([^>]*)>(.*?)<\/code>/gi, '`$2`')
    // Pre blocks (keep as code blocks)
    .replace(/<pre([^>]*)>(.*?)<\/pre>/gis, '```\n$2\n```\n\n')
    // Remove any remaining HTML tags
    .replace(/<[^>]*>/g, '')
    // Clean up extra whitespace and newlines
    .replace(/\n\s*\n\s*\n/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .trim();
}

/**
 * Converts tasks array to Markdown documentation format
 */
export function tasksToMarkdown(tasks: Task[], listName: string): string {
  if (!tasks || tasks.length === 0) {
    return `# ${listName}\n\nNo tasks available.\n`;
  }

  let markdown = `# ${listName}\n\n`;
  
  tasks.forEach((task) => {
    if (task.isHeadline) {
      // Headlines become h2 headers
      markdown += `## ${task.text}`;
      if (task.optional) {
        markdown += ' *(Optional)*';
      }
      markdown += '\n\n';
      
      // Add rich text description if available
      if (task.richText) {
        const richTextMarkdown = htmlToMarkdown(task.richText);
        if (richTextMarkdown) {
          markdown += `${richTextMarkdown}\n\n`;
        }
      }
    } else {
      // Regular tasks become checkboxes
      const checkbox = task.completed ? '- [x]' : '- [ ]';
      let taskText = task.text;
      
      if (task.optional) {
        taskText += ' *(Optional)*';
      }
      
      markdown += `${checkbox} ${taskText}\n`;
      
      // Add rich text description if available
      if (task.richText) {
        const richTextMarkdown = htmlToMarkdown(task.richText);
        if (richTextMarkdown) {
          // Indent the rich text content
          const indentedContent = richTextMarkdown
            .split('\n')
            .map(line => line ? `  ${line}` : '')
            .join('\n');
          markdown += `${indentedContent}\n\n`;
        }
      }
      
      // Add code block if available
      if (task.codeBlock && task.codeBlock.code) {
        const language = task.codeBlock.language || '';
        markdown += `  \`\`\`${language}\n`;
        // Indent each line of code
        const indentedCode = task.codeBlock.code
          .split('\n')
          .map(line => `  ${line}`)
          .join('\n');
        markdown += `${indentedCode}\n  \`\`\`\n\n`;
      } else if (!task.richText) {
        // Add extra line break only if there's no rich text (which already adds spacing)
        markdown += '\n';
      }
    }
  });
  
  // Add footer with export info
  const exportDate = new Date().toISOString().split('T')[0];
  markdown += `---\n\n*Exported from Task List Advanced on ${exportDate}*\n`;
  
  return markdown;
}

/**
 * Exports tasks as a markdown file download
 */
export function exportTasksAsMarkdown(tasks: Task[], listName: string): void {
  const markdown = tasksToMarkdown(tasks, listName);
  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  
  // Sanitize filename
  const sanitizedName = listName.replace(/[^a-z0-9\s]/gi, '').replace(/\s+/g, '_').toLowerCase();
  
  link.href = url;
  link.download = `${sanitizedName}.md`;
  link.click();
  
  URL.revokeObjectURL(url);
}