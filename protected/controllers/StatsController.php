<?php

class StatsController extends CController
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
		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'
		/*if (!Yii::app()->user->isGuest)
		{
			if (Yii::app()->user->right == 'admin')
			{*/
			/*if (проверка на доступ)*/
				Yii::app()->getClientScript()->registerPackage('mainjs');
				Yii::app()->getClientScript()->registerPackage('jqgridjs');
				Yii::app()->getClientScript()->registerPackage('statsjs');
				Yii::app()->getClientScript()->registerPackage('tooltip');
				$this->render('index');
			/*}
			else
			{
				$this->redirect(Yii::app()->homeUrl);
			}
		}
		else
		{
			$this->redirect(array('enter/index'));
		}*/
	}
	public function actionYearSellsObjects()
	{
		$stats = new StatsGetDataset();
		$stats->yearSellsObjects($_POST['year']);
	}
	public function actionYearSellsObjectsPie()
	{
		$stats = new StatsGetDataset();
		$stats->yearSellsObjectsPie($_POST['year']);
	}
	public function actionYearSellsObjectsRadar()
	{
		$stats = new StatsGetDataset();
		$stats->yearSellsObjectsRadar($_POST['year']);
	}
	public function actionMonthSellsObjectsPie()
	{
		$stats = new StatsGetDataset();
		$stats->monthSellsObjectsPie($_POST['year'],$_POST['month']);
	}
	public function actionYearPriceObjects()
	{
		$stats = new StatsGetDataset();
		$stats->yearPriceObjects($_POST['year']);
	}
	public function actionYearDynamicDB()
	{
		$stats = new StatsGetDataset();
		$stats->yearDynamicDB($_POST['year']);
	}
	public function actionSystemStats()
	{
		$stats = new StatsGetDataset();
		$stats->systemStats();
	}
	/**
	 * This is the action to handle external exceptions.
	 */

}