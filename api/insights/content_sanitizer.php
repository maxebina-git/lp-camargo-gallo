<?php

require_once __DIR__ . '/../content_sanitizer.php';

function cg_normalize_insight_href($value)
{
    return cg_normalize_content_href($value);
}

function cg_sanitize_insight_content($value)
{
    return cg_sanitize_rich_content($value, true);
}

function cg_insight_content_is_empty($value)
{
    return cg_rich_content_is_empty($value);
}

?>
