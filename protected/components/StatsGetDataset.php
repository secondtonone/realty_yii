<?php

class StatsGetDataset
{
	public function yearSellsObjects($current_year)
	{
		$response=array();
		$rowJSON=array();
		$connection=Yii::app()->db;
		$year = new CDbExpression('YEAR(date)');
		$month = new CDbExpression('MONTH(date)');

		for ($i=1;$i<15;$i++)
		{
			$j = 0;

			if ($i==12 or $i==13) {
				continue;
			}

			$sql='SELECT (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=1 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jan,(SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=2 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS feb, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=3 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS mar, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=4 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS apr, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=5 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS may, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=6 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jun, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=7 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jul, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=8 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS aug, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=9 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS sep,(SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=10 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS oct, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=11 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS nov, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=12 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS decem FROM objects LIMIT 1';
			$command=$connection->createCommand($sql);
			$row=$command->queryRow();

			foreach ($row as $key=>$value)
			{
				$rowJSON[$j]=$value;
				$j++;
			}


			$response[]=$rowJSON;
		}

		echo json_encode($response);
	}

	public function yearSellsObjectsPie($current_year)
	{
		$response=array();
		$connection=Yii::app()->db;
		$year = new CDbExpression('YEAR(date)');

		for ($i=1;$i<15;$i++)
		{
			if ($i==12 or $i==13) {
				continue;
			}

			$sql='SELECT (SELECT COUNT(id_object) FROM  objects WHERE id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jan FROM objects LIMIT 1';
			$command=$connection->createCommand($sql);
			$value=$command->queryScalar();

			$response[]=$value;
		}

		echo json_encode($response);
	}
	public function yearSellsObjectsRadar($current_year)
	{
		$response=array();
		$rowJSON=array();
		$connection=Yii::app()->db;
		$year = new CDbExpression('YEAR(date)');
		$month = new CDbExpression('MONTH(date)');

		$sql='SELECT (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=1 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS jan,(SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=2 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS feb, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=3 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS mar, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=4 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS apr, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=5 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS may, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=6 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS jun, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=7 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS jul, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=8 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS aug, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=9 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS sep,(SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=10 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS oct, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=11 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS nov, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=12 AND id_sell_out_status<>3 AND '.$year.'='.$current_year.' ) AS decem FROM objects LIMIT 1';
		$command=$connection->createCommand($sql);
		$row=$command->queryRow();

		$j=0;

		foreach ($row as $key=>$value)
		{
			$rowJSON[$j]=$value;
			$j++;
		}
		$response[]=$rowJSON;

		$command->reset();

		$sql='SELECT (SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=1 AND id_status=1 AND '.$year.'='.$current_year.' ) AS jan,(SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=2 AND id_status=1 AND '.$year.'='.$current_year.' ) AS feb, (SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=3 AND id_status=1 AND '.$year.'='.$current_year.' ) AS mar, (SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=4 AND id_status=1 AND '.$year.'='.$current_year.' ) AS apr, (SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=5 AND id_status=1 AND '.$year.'='.$current_year.' ) AS may, (SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=6 AND id_status=1 AND '.$year.'='.$current_year.' ) AS jun, (SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=7 AND id_status=1 AND '.$year.'='.$current_year.' ) AS jul, (SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=8 AND id_status=1 AND '.$year.'='.$current_year.' ) AS aug, (SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=9 AND id_status=1 AND '.$year.'='.$current_year.' ) AS sep,(SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=10 AND id_status=1 AND '.$year.'='.$current_year.' ) AS oct, (SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=11 AND id_status=1 AND '.$year.'='.$current_year.' ) AS nov, (SELECT COUNT(id_client) FROM  clients WHERE '.$month.'=12 AND id_status=1 AND '.$year.'='.$current_year.' ) AS decem FROM clients LIMIT 1';
		$command=$connection->createCommand($sql);
		$row=$command->queryRow();

		$j=0;

		foreach ($row as $key=>$value)
		{
			$rowJSON[$j]=$value;
			$j++;
		}
		$response[]=$rowJSON;


		echo json_encode($response);
	}
	public function monthSellsObjectsPie($current_year,$current_month)
	{
		$response=array();
		$connection=Yii::app()->db;
		$month = new CDbExpression('MONTH(date)');
		$year = new CDbExpression('YEAR(date)');

		for ($i=1;$i<15;$i++)
		{
			if ($i==12 or $i==13) {
				continue;
			}

			$sql='SELECT (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'='.$current_month.' AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jan FROM objects LIMIT 1';
			$command=$connection->createCommand($sql);
			$value=$command->queryScalar();

			$response[]=$value;
		}

		echo json_encode($response);
	}
	public function yearPriceObjects($current_year)
	{
		$response=array();
		$rowJSON=array();
		$connection=Yii::app()->db;
		$year = new CDbExpression('YEAR(date)');
		$month = new CDbExpression('MONTH(date)');

		for ($i=1;$i<15;$i++)
		{
			$j=0;

			if ($i==12 or $i==13) {
				continue;
			}

			$sql='SELECT (SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=1 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jan,(SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS feb, (SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=3 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS mar, (SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=4 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS apr, (SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=5 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS may, (SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=6 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jun, (SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=7 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jul, (SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=8 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS aug, (SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=9 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS sep,(SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=10 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS oct, (SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=11 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS nov, (SELECT ROUND(AVG(price)) FROM  objects WHERE '.$month.'=12 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS decem FROM objects LIMIT 1';
			$command=$connection->createCommand($sql);
			$row=$command->queryRow();

			foreach ($row as $value)
			{
				$rowJSON[$j]=$value;
				++$j;
			}


			$response[]=$rowJSON;
		}

		echo json_encode($response);
	}
	public function yearDynamicDB($current_year)
	{
		$response=array();
		$rowJSON=array();
		$connection=Yii::app()->db;
		$month = new CDbExpression('MONTH(date)');
		$year = new CDbExpression('YEAR(date)');
		$j=0;

		$sql = 'SELECT ((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=1 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=1 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=2 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=2 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=3 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=3 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=4 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=4 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=5 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=5 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=6 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=6 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=7 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=7 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=8 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=8 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=9 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=9 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=10 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=10 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=11 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=11 AND '.$year.'='.$current_year.')),((SELECT COUNT(id_object) FROM objects WHERE '.$month.'=12 AND '.$year.'='.$current_year.')+(SELECT COUNT(id_client) FROM clients WHERE '.$month.'=12 AND '.$year.'='.$current_year.')) FROM objects LIMIT 1';

		$command=$connection->createCommand($sql);
		$row=$command->queryRow();

		$response[]=$row;


		echo json_encode($response);
	}
	public function systemStats()
	{
		$response=new stdClass();
		$rowJSON=array();
		$connection=Yii::app()->db;
		$now = new CDbExpression('NOW()');
		$current_month = new CDbExpression('MONTH('.$now.')');
		$event_month = new CDbExpression('MONTH(time_event)');
		$current_day = new CDbExpression('DAYOFMONTH('.$now.')');
		$day_of_year_time_event = new CDbExpression('DAYOFYEAR(time_event)');
		$day_of_year_now = new CDbExpression('DAYOFYEAR('.$now.')');

		$sql = 'SELECT (SELECT COUNT(id_object) FROM  objects) as count_all,(SELECT COUNT(id_object) FROM  objects WHERE id_sell_out_status=1) as selling,(SELECT COUNT(id_object) FROM  objects WHERE id_sell_out_status=2) as sells_out,(SELECT COUNT(id_object) FROM  objects WHERE id_sell_out_status=3 AND id_sell_out_status=4) as hide_out,(SELECT COUNT(id_object) FROM  objects o JOIN users u ON o.id_user=u.id_user WHERE id_sell_out_status=1 AND u.active=2) as unattached FROM  objects LIMIT 1';
		$command=$connection->createCommand($sql);
		$row=$command->queryRow();
		$response->objects=$row;
		$command->reset();

		$sql = 'SELECT (SELECT COUNT(id_client) FROM  clients) as count_all,(SELECT COUNT(id_client) FROM  clients WHERE id_status=1) as active,(SELECT COUNT(id_client) FROM  clients WHERE id_status=2) as disactive,(SELECT COUNT(id_client) FROM  clients c JOIN users u ON c.id_user=u.id_user WHERE c.id_status=1 AND u.active=2) as unattached FROM  clients LIMIT 1';
		$command=$connection->createCommand($sql);
		$row=$command->queryRow();
		$response->clients=$row;
		$command->reset();

		$sql = 'SELECT (SELECT COUNT(id_user) FROM  users) as count_all,(SELECT COUNT(id_user) FROM  users WHERE active=1) as active,(SELECT COUNT(id_user) FROM  users WHERE active=2) as disactive FROM  users LIMIT 1';
		$command=$connection->createCommand($sql);
		$row=$command->queryRow();
		$response->users=$row;
		$command->reset();

		$sql = 'SELECT (SELECT COUNT(id_user) FROM  users) as count_all,(SELECT COUNT(id_user) FROM  users WHERE active=1) as active,(SELECT COUNT(id_user) FROM  users WHERE active=2) as disactive FROM  users LIMIT 1';
		$command=$connection->createCommand($sql);
		$row=$command->queryRow();
		$response->users=$row;
		$command->reset();

		$sql = 'SELECT (SELECT COUNT(id_event)/'.$current_day.' FROM  users_journal WHERE '.$event_month.'='.$current_month.' AND (id_type_event=6 OR id_type_event=5)) as count_all,(SELECT COUNT(id_event)/'.$current_day.' FROM  users_journal WHERE id_type_event=5 AND '.$event_month.'='.$current_month.') as objects,(SELECT COUNT(id_event)/'.$current_day.' FROM  users_journal WHERE id_type_event=6 AND '.$event_month.'='.$current_month.') as clients FROM users_journal LIMIT 1';
		$command=$connection->createCommand($sql);
		$row=$command->queryRow();
		$response->records=$row;
		$command->reset();

		$sql = 'SELECT (SELECT COUNT(id_event)/7 FROM  users_journal WHERE '.$day_of_year_time_event.'>'.$day_of_year_now.'-7 AND id_type_event=3) as week,(SELECT COUNT(id_event)/30 FROM  users_journal WHERE id_type_event=3 AND '.$day_of_year_time_event.'>'.$day_of_year_now.'-30) as month,(SELECT COUNT(id_event)/60 FROM  users_journal WHERE id_type_event=3 AND '.$day_of_year_time_event.'>'.$day_of_year_now.'-60) as monthplus FROM users_journal LIMIT 1';
		$command=$connection->createCommand($sql);
		$row=$command->queryRow();
		$response->sellouts=$row;
		$command->reset();

		$sql = 'SELECT (SELECT COUNT(id_event) FROM  users_journal WHERE '.$day_of_year_time_event.'='.$day_of_year_now.' AND (id_type_event=2 OR id_type_event=4)) as today,(SELECT COUNT(id_event) FROM  users_journal WHERE (id_type_event=2 OR id_type_event=4) AND '.$day_of_year_time_event.'>'.$day_of_year_now.'-7) as week,(SELECT COUNT(id_event) FROM  users_journal WHERE (id_type_event=2 OR id_type_event=4) AND '.$day_of_year_time_event.'>'.$day_of_year_now.'-30) as month FROM users_journal LIMIT 1';
		$command=$connection->createCommand($sql);
		$row=$command->queryRow();
		$response->visits=$row;

		echo json_encode($response);
	}

}