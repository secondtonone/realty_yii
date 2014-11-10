<?php
$webRoot=dirname(__FILE__);
// change the following paths if necessary
if($_SERVER['HTTP_HOST']=='example.com'){
    define('YII_DEBUG', true);
    require_once($webRoot.'/framework/yiilite.php');
    $configFile=$webRoot.'/protected/config/dev.php';
}
// Иначе выключаем режим отладки и подключаем рабочую конфигурацию
else {
    define('YII_DEBUG', false);
    require_once($webRoot.'/framework/yiilite.php');
    $configFile=$webRoot.'/protected/config/production.php';
}
Yii::createWebApplication($configFile)->run();