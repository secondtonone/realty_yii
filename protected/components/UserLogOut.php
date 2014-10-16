<?php
class UserLogOut
{
	public function unauthenticate()
    {
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
		
		$journal = new Journal;
		$journal->id_user=Yii::app()->user->getId();
		$journal->id_type_event=2;
		$journal->time_event=$date;
		$journal->save();
		
		$update = User::model()->updateAll(array('browser'=>$_SERVER['HTTP_USER_AGENT'],'online'=>'offline','time_activity'=>$date),'id_user=:id_user',array(':id_user'=>Yii::app()->user->getId()));
		
		Yii::app()->user->logout();
		Yii::app()->request->redirect(Yii::app()->user->returnUrl);
		
	}
}