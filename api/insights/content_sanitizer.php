<?php

/**
 * Keep insight content limited to the tags supported by the admin editor.
 * Attributes are removed except for validated link attributes, so event
 * handlers and unsafe URLs cannot be persisted as part of a public article.
 */
function cg_normalize_insight_href($value)
{
    $href = trim(html_entity_decode((string) $value, ENT_QUOTES | ENT_HTML5, 'UTF-8'));
    if ($href === '' || preg_match('/[\x00-\x1F\x7F]/', $href)) {
        return '';
    }

    if (preg_match('/^(?:javascript|data|vbscript):/i', $href) || substr($href, 0, 2) === '//') {
        return '';
    }

    if (preg_match('/^(?:https?|mailto|tel):\S+$/i', $href)) {
        return $href;
    }

    if ($href[0] === '/' || $href[0] === '#' || substr($href, 0, 2) === './' || substr($href, 0, 3) === '../') {
        return $href;
    }

    return '';
}

function cg_sanitize_insight_content($value)
{
    if (!is_string($value)) {
        return '';
    }

    $allowedTags = ['p', 'div', 'span', 'strong', 'b', 'u', 'ul', 'li', 'blockquote', 'br', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a'];
    $allowedMarkup = '<' . implode('><', $allowedTags) . '>';
    $clean = strip_tags($value, $allowedMarkup);

    $clean = preg_replace_callback(
        '/<\s*([a-z][a-z0-9]*)\b[^>]*>/i',
        function ($match) use ($allowedTags) {
            $tag = strtolower($match[1]);
            if (!in_array($tag, $allowedTags, true)) {
                return '';
            }
            if ($tag === 'a') {
                $href = '';
                if (preg_match('/\bhref\s*=\s*(["\'])(.*?)\1/is', $match[0], $hrefMatch)) {
                    $href = cg_normalize_insight_href($hrefMatch[2]);
                }
                if ($href === '') {
                    return '';
                }

                $safeHref = htmlspecialchars($href, ENT_QUOTES | ENT_HTML5, 'UTF-8');
                $target = preg_match('/\btarget\s*=\s*(["\'])_blank\1/i', $match[0])
                    ? ' target="_blank" rel="noopener noreferrer"'
                    : '';
                return '<a href="' . $safeHref . '"' . $target . '>';
            }
            return $tag === 'br' ? '<br>' : '<' . $tag . '>';
        },
        $clean
    );

    $clean = preg_replace_callback(
        '/<\s*\/\s*([a-z][a-z0-9]*)\s*>/i',
        function ($match) use ($allowedTags) {
            $tag = strtolower($match[1]);
            if (!in_array($tag, $allowedTags, true) || $tag === 'br') {
                return '';
            }
            return '</' . $tag . '>';
        },
        $clean
    );

    return trim($clean);
}

function cg_insight_content_is_empty($value)
{
    $text = html_entity_decode(strip_tags((string) $value), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace('/\x{00A0}/u', ' ', $text);
    return trim($text) === '';
}

?>
