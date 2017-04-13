<?php

$mc = new Memcached();
$mc->addServer('127.0.0.1', 11212);
var_dump($mc->set($argv[1], $argv[2], 300));
