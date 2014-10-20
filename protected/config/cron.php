<?php

// This is the configuration for yiic console application.
// Any writable CConsoleApplication properties can be configured here.
return array(
	'basePath'=>dirname(__FILE__).DIRECTORY_SEPARATOR.'..',
	'name'=>'REALTY | Риелторcкая информационная система',

	// preloading 'log' component
	'preload'=>array('log'),
	
	'import'=>array(
		'application.models.*',
		'application.components.*',
	),

	// application components
	'components'=>array(
		'log'=>array(
            'class'=>'CLogRouter',
            'routes'=>array(
                array(
                    'class'=>'CFileLogRoute',
                    'logFile'=>'cron.log',
                    'levels'=>'error, warning',
                ),
                array(
                    'class'=>'CFileLogRoute',
                    'logFile'=>'cron_trace.log',
                    'levels'=>'trace',
                ),
            ),
        ),
		// uncomment the following to use a MySQL database
		
		'db'=>array(
			'class'=>'CDbConnection',
			'connectionString' => 'mysql:host=localhost;dbname=u701794099_real',
			'emulatePrepare' => true,
			'username' => 'root',
			'password' => '',
			'charset' => 'utf8',
		),
		
	),
);