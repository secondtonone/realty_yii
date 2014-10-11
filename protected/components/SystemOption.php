<?php

class SystemOption
{
	
	public function updateStatus() 
    {
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
		
		$update = User::model()->updateAll(array('online'=>'online','time_activity'=>$date),'id_user=:id_user',array(':id_user'=>Yii::app()->user->id));	
	}
}