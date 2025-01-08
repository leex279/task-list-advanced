const URL_REGEX = /https?:\/\/[^\s<]+[^<.,:;"')\]\s]/g;

export function processLinks(text: string): string {
  return text.replace(
    URL_REGEX,
    (url) => `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline">${url}</a>`
  );
}
