<?php

$mc = new Memcached();
$mc->addServer('127.0.0.1', 11215);
var_dump($mc->get($argv[1]));
