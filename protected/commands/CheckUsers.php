<?php
class CheckUsers extends CConsoleCommand 
{
    public function run($args) 
	{
        // запускаем каждые 5 минут
		$time_activity = new CDbExpression('INTERVAL 5 MINUTE');
		$now = new CDbExpression('NOW()');
		$hour = new CDbExpression('INTERVAL 2 HOUR');
		
		$rows = Yii::app()->db->createCommand()    
			->select('id_user, time_activity')   
			->from('users')
			->where('(time_activity+'.$time_activity.')<('.$now.'+'.$hour.') and online=online and active=1')     
			->queryAll(); 
		
		foreach($rows as $row) 
		{
			$update = User::model()->updateAll(array('online'=>'offline'),'id_user=:id_user',array(':id_user'=>$row['id_user']));	
	
			$journal = new EventJournaling;
			$journal->userLastActivity($row['id_user'],$row['time_activity']);	
		}
    }
}