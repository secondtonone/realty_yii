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