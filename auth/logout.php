<?php

require_once '../includes/Session.php';

Session::logout();
header('Location: login.php');

?>
