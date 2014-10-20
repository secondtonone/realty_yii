<?php

class PanelController extends CController
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
                'actions'=>array('index','autocomplete','checkclient','checklogin','checkobject','lists','notes','updatestatus','getclients','getobjects','getsubobjects'),
                'roles'=>array(				
					User::ROLE_ADMIN,
					User::ROLE_USER
				),
            ),
			array('allow',
                'actions'=>array('getusers','adminmodifyobjects','adminmodifysubobject','adminmodifyclients','adminmodifyusers','adminexport'),
                'roles'=>array(				
					User::ROLE_ADMIN
				),
			),
			array('allow',
                'actions'=>array('usermodifyclients','usermodifyobjects','usermodifysubobject','userexport'),
                'roles'=>array(				
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
		Yii::app()->getClientScript()->registerPackage('mainjs');
		Yii::app()->getClientScript()->registerPackage('jqgridjs');

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
	//---------------------------SystemOption-------------------------------
	public function actionAutocomplete()
    {
		$system = new SystemOption();
		$system->autocomplete($_GET);
    }
	public function actionCheckClient()
    {
		$system = new SystemOption();
		$system->checkClient($_POST);
    } 
	public function actionCheckLogin()
    {
		$system = new SystemOption();
		$system->checkLogin($_POST['login']);
    }
	public function actionCheckObject()
    {
		$system = new SystemOption();
		$system->checkObject($_POST);
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
			$admin = new AdminGetData();
			$admin->getClients($_GET);
		}
		else if (Yii::app()->user->right == 'user')
		{		
			$user = new UserGetData();
			$user->getClients($_POST);
		}
	}
	public function actionGetObjects()
	{
		if(Yii::app()->user->right == 'admin')
		{
			$admin = new AdminGetData();
			$admin->getObjects($_POST);
		}
		else if (Yii::app()->user->right == 'user')
		{
			$user = new UserGetData();
			$user->getObjects($_POST);
		}
	}
	public function actionGetUsers()
	{
		$admin = new AdminGetData();
		$admin->getUsers($_POST);
	}
	public function actionGetSubObjects()
	{
		$user = new UserGetData();
		$user->getSubObjects($_GET['id_object']);
	}
	//---------------------------User modify data------------------------------
	public function actionUserModifyClients()
	{
		$user = new UserModifyData();
		
		switch ($_POST['oper'])
		{
			case "add":
			{
				$user->addClient($_POST);
				break;
			}
			case "edit":
			{
				$user->editClient($_POST);
				break;
			}
			case "activestatus":
			{
				$user->editActiveStatus($_POST);
				break;
			}
			case "timestatus":
			{
				$user->editClientTimeStatus($_POST);
				break;
			}
		}
	}
	public function actionUserModifyObjects()
	{
		$user = new UserModifyData();
		
		switch ($_POST['oper'])
		{
			case "add":
			{
				$user->addObject($_POST);
				break;
			}
			case "edit":
			{
				$user->editObject($_POST);
				break;
			}
			case "selloutstatus":
			{
				$user->editSellOutStatus($_POST);
				break;
			}
			case "timestatus":
			{
				$user->editTimeStatus($_POST);
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
	//-------------------------------Admin modify data-------------------------------------
	public function actionAdminModifyObjects()
	{
		$arguments = array();
		
		foreach ($_POST as $key=>$value)
		{
        	$arguments[$key]=$value;
    	}
		
		$user = new AdminModifyData();
		
		switch ($_POST['oper'])
		{
			case "edit":
			{
				$user->editObject($_POST);
				break;
			}
			case "handobj":
			{
				$user->handOverObject($_POST);
				break;
			}
		}
	}
	public function actionAdminModifySubObject()
	{
		$arguments = array('id_object'=>$_GET['id_object']);
		
		foreach ($_POST as $key=>$value)
		{
        	$arguments[$key]=$value;
    	}
		
		$user = new AdminModifyData();
		$user->editSubObject($arguments);
	}
	public function actionAdminModifyClients()
	{
		$user = new AdminModifyData();
		$user->editClient($_POST);
	}
	public function actionAdminModifyUsers()
	{	
		$user = new AdminModifyData();
		
		switch ($_POST['oper'])
		{
			case "add":
			{
				$user->addUser($_POST);
				break;
			}
			case "edit":
			{
				$user->editUser($_POST);
				break;
			}
			case "activestatus":
			{
				$user->editActiveStatus($_POST);
				break;
			}
			case "handcl":
			{
				$user->handOverClient($_POST);
				break;
			}
		}
	}
	//-------------------------------Export data-------------------------------------
	public function actionAdminExport()
	{
		$export = new ExcelExport();
		$export->adminObjects($_GET);
	}
	public function actionUserExport()
	{
		$export = new ExcelExport();
		
		switch ($_GET['q'])
		{
			case "objects":
			{
				$export->userObjects($_GET);
				break;
			}
			case "clients":
			{
				$export->userClients($_GET);
				break;
			}
		}
	}
}