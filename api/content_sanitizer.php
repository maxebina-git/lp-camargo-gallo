<?php

/**
 * Shared sanitizer for HTML content produced by the admin rich-text editors.
 *
 * The default policy is intentionally small enough for portfolio descriptions.
 * Insights can opt into table tags because its editor already supports them.
 */
function cg_content_allowed_tags($allowTables = false)
{
    $tags = ['p', 'div', 'span', 'strong', 'b', 'u', 'ul', 'li', 'blockquote', 'br', 'a'];

    if ($allowTables) {
        $tags = array_merge($tags, ['table', 'thead', 'tbody', 'tr', 'th', 'td']);
    }

    return $tags;
}

function cg_normalize_content_href($value)
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

function cg_remove_unsafe_content_blocks($value)
{
    $unsafe = 'script|style|iframe|object|embed|form|input|textarea|button|svg|math';
    $value = preg_replace('/<\s*(?:' . $unsafe . ')\b[^>]*>.*?<\s*\/\s*(?:' . $unsafe . ')\s*>/is', '', $value);
    return preg_replace('/<\s*(?:' . $unsafe . ')\b[^>]*\/?>/i', '', $value);
}

function cg_sanitize_rich_content($value, $allowTables = false)
{
    if (!is_string($value)) {
        return '';
    }

    $value = cg_remove_unsafe_content_blocks($value);
    $allowedTags = cg_content_allowed_tags($allowTables);
    $allowedLookup = array_fill_keys($allowedTags, true);

    if (!preg_match('/<\s*\/?\s*[a-z][^>]*>/i', $value)) {
        $plainText = html_entity_decode($value, ENT_QUOTES | ENT_HTML5, 'UTF-8');
        return nl2br(htmlspecialchars($plainText, ENT_QUOTES | ENT_HTML5, 'UTF-8'), false);
    }

    $allowedMarkup = '<' . implode('><', $allowedTags) . '>';
    $clean = strip_tags($value, $allowedMarkup);

    $clean = preg_replace_callback(
        '/<\s*([a-z][a-z0-9]*)\b[^>]*>/i',
        function ($match) use ($allowedLookup) {
            $tag = strtolower($match[1]);
            if (!isset($allowedLookup[$tag])) {
                return '';
            }

            if ($tag === 'a') {
                $href = '';
                if (preg_match('/\bhref\s*=\s*(["\'])(.*?)\1/is', $match[0], $hrefMatch)) {
                    $href = cg_normalize_content_href($hrefMatch[2]);
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
        function ($match) use ($allowedLookup) {
            $tag = strtolower($match[1]);
            if (!isset($allowedLookup[$tag]) || $tag === 'br') {
                return '';
            }
            return '</' . $tag . '>';
        },
        $clean
    );

    return trim($clean);
}

function cg_rich_content_is_empty($value)
{
    $text = html_entity_decode(strip_tags((string) $value), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace('/\x{00A0}/u', ' ', $text);
    return trim($text) === '';
}

function cg_rich_content_to_plain_text($value, $allowTables = false)
{
    $clean = cg_sanitize_rich_content($value, $allowTables);
    $clean = preg_replace('/<\s*br\s*\/?>/i', "\n", $clean);
    $clean = preg_replace('/<\s*\/\s*(?:p|div|li|blockquote|tr|th|td)\s*>/i', "\n", $clean);
    $text = html_entity_decode(strip_tags($clean), ENT_QUOTES | ENT_HTML5, 'UTF-8');
    $text = preg_replace('/[ \t]+\n/', "\n", $text);
    $text = preg_replace('/\n{3,}/', "\n\n", $text);
    return trim($text);
}

?>
