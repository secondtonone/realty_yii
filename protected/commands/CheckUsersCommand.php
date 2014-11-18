<?php
class CheckUsersCommand extends CConsoleCommand
{
    public function run($args)
	{
        /*запускаем каждые 5 минут с 6 до 23*/
        $connection=Yii::app()->db;
        $journal = new EventJournaling;

		$hour = new CDbExpression('(NOW()+INTERVAL 2 HOUR)-INTERVAL 5 MINUTE');

		$sql='SELECT id_user,time_activity FROM users WHERE (time_activity<'.$hour.') AND online="online" AND active=1';
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		foreach($rows as $row)
		{
			$update = User::model()->updateAll(array('online'=>'offline'),'id_user=:id_user',array(':id_user'=>$row['id_user']));

			$journal->userLastActivity($row['id_user'],$row['time_activity']);
		}
    }
}