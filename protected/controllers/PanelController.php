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
	//---------------------------SystemOption-------------------------------
	public function actionAutocomplete()
    {
		$arguments = array();
		
		foreach ($_GET as $key=>$value)
		{
        	$arguments[$key]=$value;
    	}
		
		$system = new SystemOption();
	
		$system->autocomplete($arguments);

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
	public function actionLists()
    {
		$system = new SystemOption();
		$system->userLists();
    }   
	public function actionNotes()
    {
		$system = new SystemOption();
		$system->notes();
    }
	public function actionUpdateStatus()
    {
		$system = new SystemOption();
		$system->updateStatus();
    }
	//---------------------------admin/userGetData-------------------------------
	public function actionGetClients()
	{
		if(Yii::app()->user->right == 'admin')
		{
			if (!isset($_GET['filters']))
			{
				$filters='';
			}
			else
			{
				$filters=$_GET['filters'];
			}
				
			$admin = new AdminGetData();
			$admin->getClients($_GET['page'],$_GET['rows'],$_GET['sidx'],$_GET['sord'],$_GET['_search'],$filters,$_GET['id_user']);
		}
		else if (Yii::app()->user->right == 'user')
		{
			if (!isset($_POST['filters']))
			{
				$filters='';
			}
			else
			{
				$filters=$_POST['filters'];
			}
			
			$user = new UserGetData();
			$user->getClients($_POST['page'],$_POST['rows'],$_POST['sidx'],$_POST['sord'],$_POST['_search'],$filters);
		}
	}
	public function actionGetObjects()
	{
		if (!isset($_POST['filters']))
		{
			$filters='';
		}
		else
		{
			$filters=$_POST['filters'];
		}
		if(Yii::app()->user->right == 'admin')
		{
			$admin = new AdminGetData();
			$admin->getObjects($_POST['page'],$_POST['rows'],$_POST['sidx'],$_POST['sord'],$_POST['_search'],$filters);
		}
		else if (Yii::app()->user->right == 'user')
		{
			$user = new UserGetData();
			$user->getObjects($_POST['page'],$_POST['rows'],$_POST['sidx'],$_POST['sord'],$_POST['_search'],$filters);
		}
	}
	public function actionGetUsers()
	{
		if (!isset($_POST['filters']))
		{
			$filters='';
		}
		else
		{
			$filters=$_POST['filters'];
		}
			
		$admin = new AdminGetData();
		$admin->getUsers($_POST['page'],$_POST['rows'],$_POST['sidx'],$_POST['sord'],$_POST['_search'],$filters);
	}
	public function actionGetSubObjects()
	{
		$user = new UserGetData();
		$user->getSubObjects($_GET['id_object']);
	}
	//---------------------------SystemOption-------------------------------
	public function actionUserModifyClients()
	{
		$arguments = array();
		
		foreach ($_POST as $key=>$value)
		{
        	$arguments[$key]=$value;
    	}
		
		$user = new UserModifyData();
		
		switch ($arguments['oper'])
		{
			case "add":
			{
				$user->addClient($arguments);
				break;
			}
			case "edit":
			{
				$user->editClient($arguments);
				break;
			}
			case "activestatus":
			{
				$user->editActiveStatus($arguments);
				break;
			}
			case "timestatus":
			{
				$user->editClientTimeStatus($arguments);
				break;
			}
		}
	}
	public function actionUserModifyObjects()
	{
		$arguments = array();
		
		foreach ($_POST as $key=>$value)
		{
        	$arguments[$key]=$value;
    	}
		
		$user = new UserModifyData();
		
		switch ($arguments['oper'])
		{
			case "add":
			{
				$user->addObject($arguments);
				break;
			}
			case "edit":
			{
				$user->editObject($arguments);
				break;
			}
			case "selloutstatus":
			{
				$user->editSellOutStatus($arguments);
				break;
			}
			case "timestatus":
			{
				$user->editTimeStatus($arguments);
				break;
			}
		}
	}
	public function actionUserModifySubObject()
	{
		$arguments = array('id_object'=>$_GET['id_object']);
		
		foreach ($_POST as $key=>$value)
		{
        	$arguments[$key]=$value;
    	}
		
		$user = new UserModifyData();
		$user->editSubObject($arguments);
	}
}