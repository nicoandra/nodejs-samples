<?php

$backendId = mt_rand(1,2);
$key = md5(mt_rand(1,9999999)) . $backendId;
$value = sha1($key);

$mc = new Memcached();
$mc->addServer('127.0.0.1', 11215);
var_dump($mc->set($key, $value, 300));



$mc = new Memcached();
$mc->addServer('127.0.0.1', 11215);
var_dump($mc->get($key) === $value);

