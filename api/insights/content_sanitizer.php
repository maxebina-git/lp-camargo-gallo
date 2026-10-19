<?php

/**
 * Keep insight content limited to the tags supported by the admin editor.
 * Attributes are intentionally removed so event handlers and inline URLs
 * cannot be persisted as part of a public article.
 */
function cg_sanitize_insight_content($value)
{
    if (!is_string($value)) {
        return '';
    }

    $allowedTags = ['p', 'div', 'span', 'strong', 'b', 'u', 'ul', 'li', 'blockquote', 'br'];
    $allowedMarkup = '<' . implode('><', $allowedTags) . '>';
    $clean = strip_tags($value, $allowedMarkup);

    $clean = preg_replace_callback(
        '/<\s*([a-z][a-z0-9]*)\b[^>]*>/i',
        function ($match) use ($allowedTags) {
            $tag = strtolower($match[1]);
            if (!in_array($tag, $allowedTags, true)) {
                return '';
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
