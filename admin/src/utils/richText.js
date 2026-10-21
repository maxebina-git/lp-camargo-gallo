const BASE_ALLOWED_TAGS = new Set([
    'p',
    'div',
    'span',
    'strong',
    'b',
    'u',
    'ul',
    'li',
    'blockquote',
    'br',
    'a'
]);

const TABLE_TAGS = new Set(['table', 'thead', 'tbody', 'tr', 'th', 'td']);
const REMOVED_TAGS = new Set(['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'textarea', 'button', 'svg', 'math']);

export function normalizeRichTextHref(value) {
    const href = String(value || '').trim();
    if (!href || /^\s*(?:javascript|data|vbscript):/i.test(href) || href.startsWith('//')) return '';

    try {
        const parsed = new URL(href, window.location.origin);
        if (!['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) return '';
        if (/^(?:https?:)?\/\//i.test(href) || href.startsWith('/') || href.startsWith('#') || href.startsWith('./') || href.startsWith('../') || /^(?:mailto|tel):/i.test(href)) {
            return href;
        }
    } catch (error) {
        return '';
    }

    return '';
}

function cleanRichTextNode(node, allowedTags) {
    if (node.nodeType === Node.TEXT_NODE) {
        return document.createTextNode(node.nodeValue || '');
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return null;

    const tag = node.tagName.toLowerCase();
    if (REMOVED_TAGS.has(tag)) return null;

    const children = Array.from(node.childNodes)
        .map((child) => cleanRichTextNode(child, allowedTags))
        .filter(Boolean);

    if (tag === 'a') {
        const href = normalizeRichTextHref(node.getAttribute('href'));
        if (!href) {
            const fragment = document.createDocumentFragment();
            children.forEach((child) => fragment.appendChild(child));
            return fragment;
        }

        const clean = document.createElement('a');
        clean.setAttribute('href', href);
        if (node.getAttribute('target') === '_blank') {
            clean.target = '_blank';
            clean.rel = 'noopener noreferrer';
        }
        children.forEach((child) => clean.appendChild(child));
        return clean;
    }

    if (allowedTags.has(tag)) {
        const clean = document.createElement(tag);
        children.forEach((child) => clean.appendChild(child));
        return clean;
    }

    const fragment = document.createDocumentFragment();
    children.forEach((child) => fragment.appendChild(child));
    return fragment;
}

export function sanitizeRichTextHtml(value, options = {}) {
    const allowedTags = new Set(BASE_ALLOWED_TAGS);
    if (options.allowTables) TABLE_TAGS.forEach((tag) => allowedTags.add(tag));

    const template = document.createElement('template');
    template.innerHTML = String(value || '');

    const clean = document.createElement('div');
    Array.from(template.content.childNodes)
        .map((child) => cleanRichTextNode(child, allowedTags))
        .filter(Boolean)
        .forEach((child) => clean.appendChild(child));

    return clean.innerHTML.trim();
}

export function hasRichTextContent(value) {
    const container = document.createElement('div');
    container.innerHTML = String(value || '');
    return (container.textContent || '').replace(/\u00a0/g, ' ').trim() !== '';
}
