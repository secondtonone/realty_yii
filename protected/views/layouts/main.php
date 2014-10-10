<!DOCTYPE html>
<head>
    <meta CHARSET="utf-8">
    <link href="<?php echo Yii::app()->request->baseUrl; ?>/img/realty.png" rel="shortcut icon" type="image/vnd.microsoft.icon"/>
    <?php Yii::app()->clientScript->registerPackage('maincss');?>
    <script src="http://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>
<body><?php echo $content; ?>
</body>
</html>
