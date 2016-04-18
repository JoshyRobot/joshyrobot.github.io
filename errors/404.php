<?php

if (file_exists(strtolower($_SERVER['REQUEST_URI']))) {
	header('Location: http://joshyrobot.github.io' . strtolower($_SERVER['REQUEST_URI']));
}

?>

404