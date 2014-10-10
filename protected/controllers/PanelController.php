<?php

class PanelController extends Controller
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
	
	public function actionLogin()
    {
		 /*$form = new User();
         
        // Проверяем является ли пользователь гостем
        // ведь если он уже зарегистрирован - формы он не должен увидеть.
        if (!Yii::app()->user->isGuest) {
            throw new CException('Вы уже зарегистрированы!');
         } else {
            if (!empty($_POST['User'])) {
                $form->attributes = $_POST['User'];
                $form->verifyCode = $_POST['User']['verifyCode'];
 
                    // Проверяем правильность данных
                    if($form->validate('login')) {
                        // если всё ок - кидаем на главную страницу
                        $this->redirect(Yii::app()->homeUrl);
                     } 
            } 
            $this->render('login', array('form' => $form));
        }*/
    }    

	/**
	 * This is the action to handle external exceptions.
	 */
	
}