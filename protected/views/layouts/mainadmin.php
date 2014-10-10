<!DOCTYPE html>
<head>
    <meta CHARSET="utf-8">
    <link href="<?php echo Yii::app()->request->baseUrl; ?>/img/realty.png" rel="shortcut icon" type="image/vnd.microsoft.icon"/>
    <?php Yii::app()->clientScript->registerPackage('maincss');?>
    <script src="http://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
	<title><?php echo CHtml::encode($this->pageTitle); ?></title>
</head>
<body>
	<div class="header">
    	<div class="navbar">
        	<div class="container">
            	<ul class="nav">
                	<li>
                        <?php echo CHtml::link('<div id="panel"><i class="icon icon-panel"></i>Панель управления</div>',array('panel/index')); ?>
                    </li>
                    <li>
                        <?php echo CHtml::link('<div id="journal"><i class="icon icon-journal"></i>Журнал событий</div>',array('journal/index')); ?>
                    </li>
                    <li>
                    	<?php echo CHtml::link('<div id="stats"><i class="icon icon-stats"></i>Бизнес-аналитика</div>',array('stats/index')); ?>
                    </li>
                    <li>
                        <?php echo CHtml::link('<div id="help"><i class="icon icon-help"></i>Помощь</div>',array('help/index')); ?>
                    </li>
                </ul>
                <div class="exit"><i class="icon icon-exit"></i>Выход</div>
            </div>
        </div>
    </div>
	<?php echo $content; ?>
</body>
</html>
