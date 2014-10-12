<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'REALTY | Риелторcкая информационная система',
	'defaultController'=>'panel/index',
	// preloading 'log' component
	'preload'=>array('log'),
	'sourceLanguage' => 'ru',

	// autoloading model and component classes
	'import'=>array(
		'application.models.*',
		'application.components.*',
	),

	'modules'=>array(
		// uncomment the following to enable the Gii tool
		/*
		'gii'=>array(
			'class'=>'system.gii.GiiModule',
			'password'=>'Enter Your Password Here',
			// If removed, Gii defaults to localhost only. Edit carefully to taste.
			'ipFilters'=>array('127.0.0.1','::1'),
		),
		*/
	),

	// application components
	'components'=>array(
		'user'=>array(
			// enable cookie-based authentication
			'allowAutoLogin'=>true,
			'loginUrl'=>array('enter/index')
		),
		// uncomment the following to enable URLs in path-format
		
		'urlManager'=>array(
			'urlFormat'=>'path',
			'showScriptName'=>false,
			'caseSensitive'=>false,
			'rules'=>array(
				'<controller:\w+>/<id:\d+>'=>'<controller>/view',
				'<controller:\w+>/<action:\w+>/<id:\d+>'=>'<controller>/<action>',
				'<controller:\w+>/<action:\w+>'=>'<controller>/<action>',
			),
		),
		
		/*'db'=>array(
			'connectionString' => 'sqlite:'.dirname(__FILE__).'/../data/testdrive.db',
		),*/
		// uncomment the following to use a MySQL database
		
		'db'=>array(
			'class'=>'CDbConnection',
			'connectionString' => 'mysql:host=localhost;dbname=u701794099_real',
			'emulatePrepare' => true,
			'username' => 'root',
			'password' => '',
			'charset' => 'utf8',
		),
		
		/*'errorHandler'=>array(
			// use 'site/error' action to display errors
			'errorAction'=>'enter/index',
		),*/
		'log'=>array(
			'class'=>'CLogRouter',
			'routes'=>array(
				array(
					'class'=>'CFileLogRoute',
					'levels'=>'error, warning',
				),
				// uncomment the following to show log messages on web pages
				/*
				array(
					'class'=>'CWebLogRoute',
				),
				*/
			),
		),
		'clientScript'=>array(
			'packages' => array(
			   // Уникальное имя пакета
			   'mainjs' => array(
					// Где искать подключаемые файлы JS и CSS
					'baseUrl' => '/js/',
					// Если включен дебаг-режим, то подключает /js/highcharts/highcharts.src.js
					// Иначе /js/highcharts/highcharts.js
					'js'=>array('jquery-1.10.2.js',/*'tooltip.js',*/'sticky.full.js','jquery.slimscroll.js'),
				  
				),
				'enterjs' => array(
					// Где искать подключаемые файлы JS и CSS
					'baseUrl' => '/js/',
					// Если включен дебаг-режим, то подключает /js/highcharts/highcharts.src.js
					// Иначе /js/highcharts/highcharts.js
					'js'=>array('jquery.backstretch.min.js','enter.js'),
				  
				),
				'jqgridjs' => array(
					// Где искать подключаемые файлы JS и CSS
					'baseUrl' => '/js/',
					// Если включен дебаг-режим, то подключает /js/highcharts/highcharts.src.js
					// Иначе /js/highcharts/highcharts.js
					'js'=>array('jqgrid/themes/jquery-ui-1.9.2.custom.js','jqgrid/js/jquery.jqGrid.js','jqgrid/js/grid.locale-ru.js'),
				  
				),
				'paneladminjs' => array(
					// Где искать подключаемые файлы JS и CSS
					'baseUrl' => '/js/',
					// Если включен дебаг-режим, то подключает /js/highcharts/highcharts.src.js
					// Иначе /js/highcharts/highcharts.js
					'js'=>array('jqgrid/tables/admin_panel_jqgrid.js','panel.js'),
				  
				),
				'paneluserjs' => array(
					// Где искать подключаемые файлы JS и CSS
					'baseUrl' => '/js/',
					// Если включен дебаг-режим, то подключает /js/highcharts/highcharts.src.js
					// Иначе /js/highcharts/highcharts.js
					'js'=>array('jqgrid/tables/user_panel_jqgrid.js','panel.js'),
				  
				),
				'journaljs' => array(
					// Где искать подключаемые файлы JS и CSS
					'baseUrl' => '/js/',
					// Если включен дебаг-режим, то подключает /js/highcharts/highcharts.src.js
					// Иначе /js/highcharts/highcharts.js
					'js'=>array('jqgrid/tables/admin_journal_jqgrid.js','panel.js'),
				  
				),
				'statsjs' => array(
					// Где искать подключаемые файлы JS и CSS
					'baseUrl' => '/js/',
					// Если включен дебаг-режим, то подключает /js/highcharts/highcharts.src.js
					// Иначе /js/highcharts/highcharts.js
					'js'=>array('panel.js','highcharts-custom.js','stats.js'),
				  
				),
				'helpjs' => array(
					// Где искать подключаемые файлы JS и CSS
					'baseUrl' => '/js/',
					// Если включен дебаг-режим, то подключает /js/highcharts/highcharts.src.js
					// Иначе /js/highcharts/highcharts.js
					'js'=>array('jqgrid/themes/jquery-ui-1.9.2.custom.js','panel.js'),
				  
				),
				'tooltip' => array(
					// Где искать подключаемые файлы JS и CSS
					'baseUrl' => '/js/',
					// Если включен дебаг-режим, то подключает /js/highcharts/highcharts.src.js
					// Иначе /js/highcharts/highcharts.js
					'js'=>array('tooltip.js'),
				  
				),
				'maincss' => array(
					// Где искать подключаемые файлы JS и CSS
					'baseUrl' => '/css/',
					// Подключает файл /js/highcharts/highcharts.css
					'css' => array('styles.css'),
				)
			),
		
		),
	),
	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params'=>array(
		// this is used in contact page
		'adminEmail'=>'webmaster@example.com',
	),
);