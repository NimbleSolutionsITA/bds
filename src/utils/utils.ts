import sanitizeHtml from 'sanitize-html';

export const sanitize = (html: string) => {
  return sanitizeHtml(html, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ]),
	allowedAttributes: {
      '*': ['style'],
      'a': ['target', 'href', 'title'],
      'img': ['src', 'alt', 'width', 'height', 'title'],
    },
    allowedClasses: {
      '*': ['*']
    }
  });
}