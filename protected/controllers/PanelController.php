<?php

class PanelController extends CController
{
	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	 
	public $layout = 'main';
	
	public function actionIndex()
	{
		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'
		Yii::app()->getClientScript()->registerPackage('mainjs');
		Yii::app()->getClientScript()->registerPackage('jqgridjs');
		
		if (!Yii::app()->user->isGuest)
		{
			if(Yii::app()->user->right == 'admin')
			{
				Yii::app()->getClientScript()->registerPackage('paneladminjs');
				Yii::app()->getClientScript()->registerPackage('tooltip');
				$this->layout = 'mainadmin';
				$this->render('admin');
			}
			else if (Yii::app()->user->right == 'user')
			{
				Yii::app()->getClientScript()->registerPackage('paneluserjs');
				Yii::app()->getClientScript()->registerPackage('tooltip');
				$this->layout = 'mainuser';
				$this->render('user');
			}
		}
		else
		{
			$this->redirect(array('enter/index'));
		}
	}
	
	public function actionAdminCheckData()
    {
		$system = new SystemOption();
		$system->adminCheckData($_POST['login']);
    }  
	
	public function actionUpdateStatus()
    {
		$system = new SystemOption();
		$system->updateStatus();
    }
	public function actionAutocomplete()
    {
		$arguments = array('term'=>$_POST['term'],'r'=>$_POST['r'],'param'=>$_POST['param']);
		$system = new SystemOption();
	
		$system->autocomplete($arguments);

    }     
	/**
	 * This is the action to handle external exceptions.
	 */
}