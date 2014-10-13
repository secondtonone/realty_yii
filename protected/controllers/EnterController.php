<?php
class EnterController extends CController
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
		if (!Yii::app()->user->isGuest)
		{
			$this->redirect(array('panel/index'));
		}
		else
		{
			Yii::app()->getClientScript()->registerPackage('mainjs');
			Yii::app()->getClientScript()->registerPackage('enterjs');
			$this->render('index');
		}
	}
	
	public function actionLogin()
    {
		 $form = new User('login');
         
        // Проверяем является ли пользователь гостем
        // ведь если он уже зарегистрирован - формы он не должен увидеть.
       /* if (!Yii::app()->user->isGuest) {
            throw new CException('Вы уже зарегистрированы!');
         } else {*/
         if (!empty($_POST['login'])) {
				
				
                /*$form->attributes = array('login' => $_POST['login'],'password' => $_POST['password']);*/
			$form->login = $_POST['login'];
			$form->password = $_POST['password'];
				
			if (isset($_POST['rememberMe']))
			{
				$form->rememberMe = $_POST['rememberMe'];
			}
 
                    // Проверяем правильность данных
            if($form->validate()) {
                        // если всё ок - кидаем на панель
                      //


				$response=array('redirect' => '/panel/index','error' =>'');			
				echo json_encode($response);


            } 
			else {
				$this->renderPartial('/enter/error', array('form' => $form));
			}
        }
    }
	public function actionLogout()
    {
		$logout= new UserLogOut;
		$logout->unauthenticate();
    }    

	/**
	 * This is the action to handle external exceptions.
	 */
	
}