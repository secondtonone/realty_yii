<?php

class JournalController extends CController
{
	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public $layout = 'mainadmin';
	
	public function actionIndex()
	{
		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'
		if (!Yii::app()->user->isGuest)
		{
			if (Yii::app()->user->right == 'admin')
			{
				Yii::app()->getClientScript()->registerPackage('mainjs');
				Yii::app()->getClientScript()->registerPackage('jqgridjs');
				Yii::app()->getClientScript()->registerPackage('journaljs');
				Yii::app()->getClientScript()->registerPackage('tooltip');
				$this->render('index');
			}
			else
			{
				$this->redirect(Yii::app()->homeUrl);
			}
		}
		else
		{
			$this->redirect(array('enter/index'));
		}
	}
	
	public function actionGetEvents()
	{
		if (empty($_POST['filters']))
		{
			$filters='';
		}
		else
		{
			$filters=$_POST['filters'];
		}
		
		$admin = new AdminGetData();
		$admin->getEvents($_POST['page'],$_POST['rows'],$_POST['sidx'],$_POST['sord'],$_POST['_search'],$filters);
	}
	public function actionGetNotifications()
	{
		if (empty($_POST['filters']))
		{
			$filters='';
		}
		else
		{
			$filters=$_POST['filters'];
		}
		
		$admin = new AdminGetData();
		$admin->getNotifications($_POST['page'],$_POST['rows'],$_POST['sidx'],$_POST['sord'],$_POST['_search'],$filters);
	}
	public function actionGetOnlineUsers()
	{
		$admin = new AdminGetData();
		$admin->getOnlineUsers();
	}
	public function actionAdminModifyNotes()
	{
		$arguments = array();
		
		foreach ($_POST as $key=>$value)
		{
        	$arguments[$key]=$value;
    	}
		
		$user = new AdminModifyData();
		
		switch ($arguments['oper'])
		{
			case "add":
			{
				$user->addNote($arguments);
				break;
			}
			case "edit":
			{
				$user->editNote($arguments);
				break;
			}
			case "del":
			{
				$user->deleteNote($arguments);
				break;
			}
			case "activestatus":
			{
				$user->editNoteActiveStatus($arguments);
				break;
			}
		}
	}

	/**
	 * This is the action to handle external exceptions.
	 */
	
}