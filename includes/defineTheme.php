<?php
$themeId = $_SESSION['theme_id'] ?? '2';

$themeAttr = 'dark';
if ($themeId == '1') {
    $themeAttr = 'light';
} elseif ($themeId == '3') {
    $themeAttr = 'system';
}