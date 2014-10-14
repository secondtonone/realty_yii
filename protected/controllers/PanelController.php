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
	
	public function actionCheckLogin()
    {
		$system = new SystemOption();
		$system->checkLogin($_POST['login']);
    }
	public function actionCheckObject()
    {
		$arguments = array();
		
		foreach ($_POST as $key=>$value)
		{
        	$arguments[$key]=$value;
    	}
		
		$system = new SystemOption();
		$system->checkObject($arguments);
    }
	public function actionCheckClient()
    {
		$arguments = array();
		
		foreach ($_POST as $key=>$value)
		{
        	$arguments[$key]=$value;
    	}

		$system = new SystemOption();
		$system->checkClient($arguments);
    }      
	
	public function actionUpdateStatus()
    {
		$system = new SystemOption();
		$system->updateStatus();
    }
	public function actionAutocomplete()
    {
		$arguments = array();
		
		foreach ($_POST as $key=>$value)
		{
        	$arguments[$key]=$value;
    	}
		
		$system = new SystemOption();
	
		$system->autocomplete($arguments);

    }
	public function actionNotes()
    {
		$system = new SystemOption();
		$system->notes();
    }
	public function actionLists()
    {
		$system = new SystemOption();
		$system->userLists();
    }      
	/**
	 * This is the action to handle external exceptions.
	 */
}