<?php

class JournalController extends CController
{
	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */
	public $layout = 'mainadmin';
	
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
					User::ROLE_ADMIN
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
		Yii::app()->getClientScript()->registerPackage('mainjs');
		Yii::app()->getClientScript()->registerPackage('jqgridjs');
		Yii::app()->getClientScript()->registerPackage('journaljs');
		Yii::app()->getClientScript()->registerPackage('tooltip');
		$this->render('index');
	}
	
	public function actionGetEvents()
	{
		$admin = new AdminGetData();
		$admin->getEvents($_POST);
	}
	public function actionGetNotifications()
	{
		$admin = new AdminGetData();
		$admin->getNotifications($_POST);
	}
	public function actionGetOnlineUsers()
	{
		$admin = new AdminGetData();
		$admin->getOnlineUsers();
	}
	public function actionAdminModifyNotes()
	{
		$user = new AdminModifyData();
		
		switch ($_POST['oper'])
		{
			case "add":
			{
				$user->addNote($_POST);
				break;
			}
			case "edit":
			{
				$user->editNote($_POST);
				break;
			}
			case "del":
			{
				$user->deleteNote($_POST);
				break;
			}
			case "activestatus":
			{
				$user->editNoteActiveStatus($_POST);
				break;
			}
		}
	}

	/**
	 * This is the action to handle external exceptions.
	 */
	
}