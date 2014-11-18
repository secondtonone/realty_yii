<?php
class ClearEventsCommand extends CConsoleCommand
{
	/*запускать на первое число месяца*/
    public function run($args)
	{
		$now = new CDbExpression('(MONTH(NOW())');
		$month_event = new CDbExpression('MONTH(`time_event`))');
		Yii::app()->db->createCommand()->delete('users_journal',$now.'-'.$month_event.'>:value', array(
			':value'=> 2,
		));

		echo "Журнал событий очищен.";
    }
}