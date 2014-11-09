<?php
class UserModifyData
{
	public function addClient($arguments)
    {
		$connection=Yii::app()->db;
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));

		$sql='SELECT `id_client` FROM `clients` WHERE `number`=:number AND `id_category`=:id_category AND `id_planning`=:id_planning AND `id_status`=:id_status';

		$command=$connection->createCommand($sql);
		$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
		$command->bindParam(':id_category',$arguments['id_category'],PDO::PARAM_STR);
		$command->bindParam(':id_planning',$arguments['id_planning'],PDO::PARAM_STR);
		$command->bindValue(':id_status',1,PDO::PARAM_STR);
		$row=$command->queryRow();

		if (!empty($row))
		{
			return false;
		}
		else
		{
			$command->reset();

			$sql='INSERT INTO `clients`(`name`, `number`,`id_city`, `id_category`, `id_planning`,`id_floor_status`, `price`,`id_time_status`, `id_status`, `id_user`, `date`) VALUES (:name,:number,:id_city,:id_category,:id_planning,:id_floor_status,:price,:id_time_status,:id_status,:id_user,:date)';

			$command=$connection->createCommand($sql);
			$command->bindParam(':name',$arguments['name'],PDO::PARAM_STR);
			$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
			$command->bindParam(':id_city',$arguments['id_city'],PDO::PARAM_STR);
			$command->bindParam(':id_category',$arguments['id_category'],PDO::PARAM_STR);
			$command->bindParam(':id_planning',$arguments['id_planning'],PDO::PARAM_STR);
			$command->bindParam(':id_floor_status',$arguments['id_floor_status'],PDO::PARAM_STR);
			$command->bindParam(':price',$arguments['cl_price'],PDO::PARAM_STR);
			$command->bindParam(':id_time_status',$arguments['id_time_status'],PDO::PARAM_STR);
			$command->bindParam(':id_status',$arguments['id_status'],PDO::PARAM_STR);
			$command->bindParam(':id_user',Yii::app()->user->getId(),PDO::PARAM_STR);
			$command->bindParam(':date',$date,PDO::PARAM_STR);
			$command->execute();

			$journal = new EventJournaling;
			$journal->userAddClient(Yii::app()->user->getId());

			echo 'Запись добавлена.';
		}
	}
	public function editClient($arguments)
    {
		$connection=Yii::app()->db;
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));

		if (Yii::app()->user->getId()==$arguments['id_user'])
		{
			$sql='UPDATE `clients` SET `name`=:name,`number`=:number,`id_city`=:id_city,`id_category`=:id_category,`id_planning`=:id_planning,`id_floor_status`=:id_floor_status,`price`=:price,`id_time_status`=:id_time_status,`id_status`=:id_status,`date`=:date WHERE `id_client`=:id_client';

			$command=$connection->createCommand($sql);
			$command->bindParam(':name',$arguments['name'],PDO::PARAM_STR);
			$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
			$command->bindParam(':id_city',$arguments['id_city'],PDO::PARAM_STR);
			$command->bindParam(':id_category',$arguments['id_category'],PDO::PARAM_STR);
			$command->bindParam(':id_planning',$arguments['id_planning'],PDO::PARAM_STR);
			$command->bindParam(':id_floor_status',$arguments['id_floor_status'],PDO::PARAM_STR);
			$command->bindParam(':price',$arguments['cl_price'],PDO::PARAM_STR);
			$command->bindParam(':id_time_status',$arguments['id_time_status'],PDO::PARAM_STR);
			$command->bindParam(':id_status',$arguments['id_status'],PDO::PARAM_STR);
			$command->bindParam(':date',$date,PDO::PARAM_STR);
			$command->bindParam(':id_client',$arguments['id'],PDO::PARAM_STR);
			$command->execute();

			echo "Запись отредактирована!";
		}
		else
		{
			return false;
		}
	}
	public function editActiveStatus($arguments)
    {
		$connection=Yii::app()->db;
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));

		foreach(json_decode($arguments['match']) as $id_client=>$id_user)
		{
			if (Yii::app()->user->getId()==$id_user)
			{
				$sql='UPDATE `clients` SET `id_status`=:id_status,`date`=:date WHERE `id_client`=:id_client';
				$command=$connection->createCommand($sql);
				$command->bindParam(':id_status',$arguments['id_status'],PDO::PARAM_STR);
				$command->bindParam(':date',$date,PDO::PARAM_STR);
				$command->bindParam(':id_client',$id_client,PDO::PARAM_STR);
				$command->execute();

				echo "Статус изменен!";
			}
		}
	}
	public function editClientTimeStatus($arguments)
    {
		$connection=Yii::app()->db;
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));

		foreach(json_decode($arguments['match']) as $id_client=>$id_user)
		{
			if (Yii::app()->user->getId()==$id_user)
			{
				$sql='UPDATE `clients` SET `id_time_status`=:id_time_status,`date`=:date WHERE `id_client`=:id_client';
				$command=$connection->createCommand($sql);
				$command->bindParam(':id_time_status',$arguments['id_status'],PDO::PARAM_STR);
				$command->bindParam(':date',$date,PDO::PARAM_STR);
				$command->bindParam(':id_client',$id_client,PDO::PARAM_STR);
				$command->execute();

				echo "Статус изменен!";
			}
		}
	}
	//-----------------------------For Object
	public function addObject($arguments)
    {
		$connection=Yii::app()->db;
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));

		if($arguments['floor']==1)
		{
			$id_floor_status=1;
		}
		if($arguments['floor']==$arguments['number_of_floor'] and $arguments['floor']!=1)
		{
			$id_floor_status=2;
		}
		if($arguments['floor']!=1 and $arguments['floor']!=$arguments['number_of_floor'])
		{
			$id_floor_status=3;
		}
		if($arguments['id_sell_out_status']==2)
		{
			$journal = new EventJournaling;
			$journal->userSellsObject(Yii::app()->user->getId());
		}

		$sql='SELECT o.`id_object` FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` WHERE o.`id_street`=:id_street AND o.`house_number`=:house_number AND o.`id_category`=:id_category AND o.`room_count`=:room_count AND o.`id_planning`=:id_planning AND o.`floor`=:floor AND ow.`number`=:number';

		$command=$connection->createCommand($sql);
		$command->bindParam(':id_street',$arguments['id_street'],PDO::PARAM_STR);
		$command->bindParam(':house_number',$arguments['house_number'],PDO::PARAM_STR);
		$command->bindParam(':id_category',$arguments['id_category'],PDO::PARAM_STR);
		$command->bindParam(':room_count',$arguments['room_count'],PDO::PARAM_STR);
		$command->bindParam(':id_planning',$arguments['id_planning'],PDO::PARAM_STR);
		$command->bindParam(':floor',$arguments['floor'],PDO::PARAM_STR);
		$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
		$row=$command->queryRow();

		if (!empty($row))
		{
			return false;
		}
		else
		{
			$command->reset();

			$sql='INSERT INTO `objects_owners`(`name_owner`, `number`) VALUES (:name_owner,:number)';

			$command=$connection->createCommand($sql);
			$command->bindParam(':name_owner',$arguments['name_owner'],PDO::PARAM_STR);
			$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
			$command->execute();

			$last_id=Yii::app()->db->lastInsertID;
			$command->reset();

			$sql='INSERT INTO `objects`(`id_owner`,`id_city`, `id_street`, `house_number`,`id_building`, `id_category`, `room_count`, `id_planning`, `floor`,`number_of_floor`,`id_floor_status`, `space`, `id_renovation`, `id_window`, `id_counter`,`comment`, `id_sell_out_status`, `id_time_status`, `price`, `market_price`, `id_user`, `date`,`date_change`) VALUES (:lastid,:id_city,:id_street,:house_number,:id_building,:id_category,:room_count,:id_planning,:floor,:number_of_floor,:id_floor_status,:space,:id_renovation,:id_window,:id_counter,:comment,:id_sell_out_status,:id_time_status,:price,:market_price,:id_user,:date,:date_change)';
			$command=$connection->createCommand($sql);
			$command->bindParam(':lastid',$last_id,PDO::PARAM_STR);
			$command->bindParam(':id_city',$arguments['id_city'],PDO::PARAM_STR);
			$command->bindParam(':id_street',$arguments['id_street'],PDO::PARAM_STR);
			$command->bindParam(':house_number',$arguments['house_number'],PDO::PARAM_STR);
			$command->bindParam(':id_building',$arguments['id_building'],PDO::PARAM_STR);
			$command->bindParam(':id_category',$arguments['id_category'],PDO::PARAM_STR);
			$command->bindParam(':room_count',$arguments['room_count'],PDO::PARAM_STR);
			$command->bindParam(':id_planning',$arguments['id_planning'],PDO::PARAM_STR);
			$command->bindParam(':floor',$arguments['floor'],PDO::PARAM_STR);
			$command->bindParam(':number_of_floor',$arguments['number_of_floor'],PDO::PARAM_STR);
			$command->bindParam(':id_floor_status',$id_floor_status,PDO::PARAM_STR);
			$command->bindParam(':space',$arguments['space'],PDO::PARAM_STR);
			$command->bindParam(':id_renovation',$arguments['id_renovation'],PDO::PARAM_STR);
			$command->bindParam(':id_window',$arguments['id_window'],PDO::PARAM_STR);
			$command->bindParam(':id_counter',$arguments['id_counter'],PDO::PARAM_STR);
			$command->bindParam(':comment',$arguments['comment'],PDO::PARAM_STR);
			$command->bindParam(':id_sell_out_status',$arguments['id_sell_out_status'],PDO::PARAM_STR);
			$command->bindParam(':id_time_status',$arguments['id_time_status'],PDO::PARAM_STR);
			$command->bindParam(':price',$arguments['price'],PDO::PARAM_STR);
			$command->bindParam(':market_price',$arguments['market_price'],PDO::PARAM_STR);
			$command->bindParam(':id_user',Yii::app()->user->getId(),PDO::PARAM_STR);
			$command->bindParam(':date',$date,PDO::PARAM_STR);
			$command->bindParam(':date_change',$date,PDO::PARAM_STR);
			$command->execute();

			$journal = new EventJournaling;
			$journal->userAddObject(Yii::app()->user->getId());

			echo 'Запись добавлена.';
		}
	}
	public function editObject($arguments)
    {
		$connection=Yii::app()->db;
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));

		if($arguments['floor']==1)
		{
			$id_floor_status=1;
		}
		if($arguments['floor']==$arguments['number_of_floor'] and $arguments['floor']!=1)
		{
			$id_floor_status=2;
		}
		if($arguments['floor']!=1 and $arguments['floor']!=$arguments['number_of_floor'])
		{
			$id_floor_status=3;
		}
		if($arguments['id_sell_out_status']==2)
		{

			$journal = new EventJournaling;
			$journal->userSellsObject(Yii::app()->user->getId());
		}

		if (Yii::app()->user->getId()==$arguments['id_user'])
		{
			$sql='SELECT o.`price`,o.`market_price`,o.`date_change` FROM `objects` o WHERE o.`id_object`=:id_object';

			$command=$connection->createCommand($sql);
			$command->bindParam(':id_object',$arguments['id'],PDO::PARAM_STR);
			$row=$command->queryRow();
			$command->reset();

			if ($row['price']!=$arguments['price'] or $row['market_price']!=$arguments['market_price'])
			{
				$sql='UPDATE `objects` SET `date_change`=:date WHERE `id_object`=:id_object';
				$command=$connection->createCommand($sql);
				$command->bindParam(':date',$date,PDO::PARAM_STR);
				$command->bindParam(':id_object',$arguments['id'],PDO::PARAM_STR);
				$command->execute();
				$command->reset();
			}

			$sql='UPDATE `objects_owners` SET `name_owner`=:name_owner,`number`=:number WHERE `id_owner`=:id_owner';
			$command=$connection->createCommand($sql);
			$command->bindParam(':name_owner',$arguments['name_owner'],PDO::PARAM_STR);
			$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
			$command->bindParam(':id_owner',$arguments['id_owner'],PDO::PARAM_STR);
			$command->execute();

			$command->reset();

			$sql='UPDATE `objects` SET `id_city`=:id_city,`id_street`=:id_street,`house_number`=:house_number,`id_building`=:id_building,`id_category`=:id_category,`room_count`=:room_count,`id_planning`=:id_planning,`floor`=:floor,`number_of_floor`=:number_of_floor,`id_floor_status`=:id_floor_status,`space`=:space,`id_sell_out_status`=:id_sell_out_status,`id_time_status`=:id_time_status,`price`=:price,`market_price`=:market_price,`date`=:date WHERE `id_object`=:id_object';
			$command=$connection->createCommand($sql);
			$command->bindParam(':id_city',$arguments['id_city'],PDO::PARAM_STR);
			$command->bindParam(':id_street',$arguments['id_street'],PDO::PARAM_STR);
			$command->bindParam(':house_number',$arguments['house_number'],PDO::PARAM_STR);
			$command->bindParam(':id_building',$arguments['id_building'],PDO::PARAM_STR);
			$command->bindParam(':id_category',$arguments['id_category'],PDO::PARAM_STR);
			$command->bindParam(':room_count',$arguments['room_count'],PDO::PARAM_STR);
			$command->bindParam(':id_planning',$arguments['id_planning'],PDO::PARAM_STR);
			$command->bindParam(':floor',$arguments['floor'],PDO::PARAM_STR);
			$command->bindParam(':number_of_floor',$arguments['number_of_floor'],PDO::PARAM_STR);
			$command->bindParam(':id_floor_status',$id_floor_status,PDO::PARAM_STR);
			$command->bindParam(':space',$arguments['space'],PDO::PARAM_STR);
			$command->bindParam(':id_sell_out_status',$arguments['id_sell_out_status'],PDO::PARAM_STR);
			$command->bindParam(':id_time_status',$arguments['id_time_status'],PDO::PARAM_STR);
			$command->bindParam(':price',$arguments['price'],PDO::PARAM_STR);
			$command->bindParam(':market_price',$arguments['market_price'],PDO::PARAM_STR);
			$command->bindParam(':date',$date,PDO::PARAM_STR);
			$command->bindParam(':id_object',$arguments['id'],PDO::PARAM_STR);
			$command->execute();

			echo "Запись отредактирована!";
		}
		else
		{
			return false;
		}
	}
	public function editSubObject($arguments)
	{
		$connection=Yii::app()->db;
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));

		if (Yii::app()->user->getId()==$arguments['id_user'])
		{
			$sql='UPDATE `objects` SET `id_renovation`=:id_renovation,`id_window`=:id_window,`id_counter`=:id_counter,`comment`=:comment,`date`=:date WHERE `id_object`=:id_object';
			$command=$connection->createCommand($sql);
			$command->bindParam(':id_renovation',$arguments['id_renovation'],PDO::PARAM_STR);
			$command->bindParam(':id_window',$arguments['id_window'],PDO::PARAM_STR);
			$command->bindParam(':id_counter',$arguments['id_counter'],PDO::PARAM_STR);
			$command->bindParam(':comment',$arguments['comment'],PDO::PARAM_STR);
			$command->bindParam(':date',$date,PDO::PARAM_STR);
			$command->bindParam(':id_object',$arguments['id_object'],PDO::PARAM_STR);
			$command->execute();
		}
		else
		{
			echo "Вы не можите редактировать эту запись!";
		}
	}
	public function editSellOutStatus($arguments)
    {
		$connection=Yii::app()->db;
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));

		foreach(json_decode($arguments['match']) as $id_object=>$id_user)
		{
			if (Yii::app()->user->getId()==$id_user)
			{
				$sql='UPDATE `objects` SET `id_sell_out_status`=:id_sell_out_status,`date`=:date WHERE `id_object`=:id_object';
				$command=$connection->createCommand($sql);
				$command->bindParam(':id_sell_out_status',$arguments['id_status'],PDO::PARAM_STR);
				$command->bindParam(':date',$date,PDO::PARAM_STR);
				$command->bindParam(':id_object',$id_object,PDO::PARAM_STR);
				$command->execute();

				if($arguments['id_status']==2)
				{
					$journal = new EventJournaling;
					$journal->userSellsObject(Yii::app()->user->getId());
				}
				echo "Статус изменен!";
			}
		}
	}
	public function editTimeStatus($arguments)
    {
		$connection=Yii::app()->db;
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));

		foreach(json_decode($arguments['match']) as $id_object=>$id_user)
		{
			if (Yii::app()->user->getId()==$id_user)
			{
				$sql='UPDATE `objects` SET `id_time_status`=:id_time_status,`date`=:date WHERE `id_object`=:id_object';
				$command=$connection->createCommand($sql);
				$command->bindParam(':id_time_status',$arguments['id_status'],PDO::PARAM_STR);
				$command->bindParam(':date',$date,PDO::PARAM_STR);
				$command->bindParam(':id_object',$id_object,PDO::PARAM_STR);
				$command->execute();

				echo "Статус изменен!";
			}
		}
	}
}
