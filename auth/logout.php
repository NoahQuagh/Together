<?php

require_once __DIR__ . '/../includes/Session.php';

Session::logout();
header('Location: login.php');

?>
