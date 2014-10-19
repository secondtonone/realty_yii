<?php

class HelpController extends CController
{
	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public $layout = 'main';
	
	public function filters()
    {
        return array(
            'accessControl',
        );
    }
	
	public function accessRules()
    {
        return array(
			array('allow',
                'actions'=>array(),
                'roles'=>array(				
					User::ROLE_ADMIN,
					User::ROLE_USER
				),
			),
            array('deny',
                'actions'=>array(),
                'users'=>array('*'),
            ),
        );
    }
	
	public function actionIndex()
	{
		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'
		/*if (проверка на доступ)*/
		Yii::app()->getClientScript()->registerPackage('mainjs');
		Yii::app()->getClientScript()->registerPackage('helpjs');
		Yii::app()->getClientScript()->registerPackage('tooltip');
		/*if (!Yii::app()->user->isGuest)
		{*/
			if(Yii::app()->user->right == 'admin')
			{
				$this->layout = 'mainadmin';
				$this->render('admin');
			}
			else if (Yii::app()->user->right == 'user')
			{
				$this->layout = 'mainuser';
				$this->render('user');
			}
		/*}
		else
		{
			$this->redirect(array('enter/index'));
		}*/
	}
}