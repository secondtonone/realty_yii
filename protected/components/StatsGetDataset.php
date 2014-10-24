<?php

class StatsGetDataset
{
	public function yearSellsObjects($current_year)
	{
		$response=array();
		$connection=Yii::app()->db; 
		$year = new CDbExpression('YEAR(date)');
		$month = new CDbExpression('MONTH(date)');
		
		for ($i=1;$i<15;$i++)
		{
			if ($i==12 or $i==13) {
				continue;	
			}
			
			$sql='SELECT (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=1 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jan,(SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=2 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS feb, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=3 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS mar, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=4 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS apr, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=5 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS may, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=6 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jun, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=7 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS jul, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=8 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS aug, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=9 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS sep,(SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=10 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS oct, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=11 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS nov, (SELECT COUNT(id_object) FROM  objects WHERE '.$month.'=12 AND id_sell_out_status=2 AND '.$year.'='.$current_year.' AND id_category='.$i.') AS decem FROM objects LIMIT 1';
			$command=$connection->createCommand($sql);
			$row=$command->queryRow();

			$response[$i]=$row;
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

			$response[$i]=$value;
		}
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

			$response[$i]=$value;
		}
		echo json_encode($response);
	}

}