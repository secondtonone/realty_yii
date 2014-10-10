<!DOCTYPE html>
<head>
    <meta CHARSET="utf-8">
    <link href="<?php echo Yii::app()->request->baseUrl;?>/img/realty.png" rel="shortcut icon" type="image/vnd.microsoft.icon"/>
    <?php Yii::app()->clientScript->registerPackage('maincss');?>
    <script src="http://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
	<title><?php echo CHtml::encode($this->pageTitle);?></title>
</head>
<body>
	<div class="header">
    	<div class="navbar">
        	<div class="container">
            	<ul class="nav">
                	<li>
                    	<?php echo CHtml::link('<div id="panel"><i class="icon icon-panel"></i>Рабочий стол</div>',array('panel/index'));?>
                    </li>
                    <li>
                        <?php echo CHtml::link('<div id="help"><i class="icon icon-help"></i>Помощь</div>',array('help/index'));?>
                    </li>
                </ul>
                <?php echo CHtml::link('<div class="exit"><i class="icon icon-exit"></i>Выход</div>',array('enter/logout'));?>
            </div>
        </div>
    </div>
	<?php echo $content;?>
</body>
</html>
