import sanitizeHtml from 'sanitize-html';

export const sanitize = (html: string) => {
  return sanitizeHtml(html, {
	// allowedTags: [],
	// allowedAttributes: {},
  });
}