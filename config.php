<?php
$isLocal = in_array($_SERVER['SERVER_NAME'] ?? '', ['localhost', '127.0.0.1']);

define('BASE_PATH', $isLocal
    ? 'C:/xampp/htdocs/together'
    : '/var/www/together'
);

define('BASE_URL', $isLocal
    ? '/Together'
    : ''
);