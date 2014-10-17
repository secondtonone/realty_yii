<?php
class AdminModifyData 
{
	//-------------------------------For Object----------------------------------
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
	public function editSubObject($arguments)
	{
		$connection=Yii::app()->db; 
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
		
		$sql='UPDATE `objects` SET `id_renovation`=:id_renovation,`id_window`=:id_window,`id_counter`=:id_counter,`date`=:date WHERE `id_object`=:id_object';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_renovation',$arguments['id_renovation'],PDO::PARAM_STR);
		$command->bindParam(':id_window',$arguments['id_window'],PDO::PARAM_STR);
		$command->bindParam(':id_counter',$arguments['id_counter'],PDO::PARAM_STR);
		$command->bindParam(':date',$date,PDO::PARAM_STR);
		$command->bindParam(':id_object',$arguments['id_object'],PDO::PARAM_STR);
		$command->execute();
	}
	public function handOverObject($arguments)
	{
		$connection=Yii::app()->db; 
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
		
		$sql='UPDATE `objects` SET `id_user`=:id_user,`date`=:date WHERE `id_object`=:id_object';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_user',$arguments['id_user'],PDO::PARAM_STR);
		$command->bindParam(':date',$date,PDO::PARAM_STR);
		$command->bindParam(':id_object',$arguments['id_object'],PDO::PARAM_STR);
		$command->execute();
		
		echo "Объект передан!";	
	}
	//----------------------------For User----------------------------------
	public function addUser($arguments)
    {
		$connection=Yii::app()->db; 
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
		
		$sql='SELECT `id_user` FROM `users` WHERE `login`=:login';
		
		$command=$connection->createCommand($sql);
		$command->bindParam(':login',$arguments['login'],PDO::PARAM_STR);
		$row=$command->queryRow();
							
		if (!empty($row)) 
		{
			return false;
		}
		else
		{
			if(strlen($arguments['password'])<6 or strlen($arguments['login'])<6)
			{
				echo "less6";
			}
			else if(!preg_match("/^[a-zA-Z0-9]+$/",$arguments['password']) or !preg_match("/^[a-zA-Z0-9]+$/",$arguments['login']))
			{
				echo "nomatch";
			}
			else
			{
				$command->reset();
				
				$hash=CPasswordHelper::hashPassword($arguments['password']);
				
				$sql='INSERT INTO `users`(`login`, `password`, `id_right`, `active`, `name`, `number`, `online`) VALUES (:login,:password,:id_right,:active,:name,:number,:online)';
		
				$command=$connection->createCommand($sql);
				$command->bindParam(':login',$arguments['login'],PDO::PARAM_STR);
				$command->bindParam(':password',$hash,PDO::PARAM_STR);
				$command->bindParam(':id_right',$arguments['id_right'],PDO::PARAM_STR);
				$command->bindParam(':active',$arguments['active'],PDO::PARAM_STR);
				$command->bindParam(':name',$arguments['name'],PDO::PARAM_STR);
				$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
				$command->bindValue(':online','offline',PDO::PARAM_STR);
				$command->execute();
					
				$journal = new EventJournaling;
				$journal->userAddUser(Yii::app()->user->getId());		
					
				echo 'Запись добавлена.';
			}
		}
	}
	public function editUser($arguments)
    {
		$connection=Yii::app()->db; 
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
		
		if (!empty($arguments['password']))
		{
			if(strlen($arguments['password'])<6 or strlen($arguments['login'])<6)
			{
				echo "less6";
			}
			elseif(!preg_match("/^[a-zA-Z0-9]+$/",$arguments['password']) or !preg_match("/^[a-zA-Z0-9]+$/",$arguments['login']))
			{
				echo "nomatch";
			}
			else
			{
				$hash=CPasswordHelper::hashPassword($arguments['password']);
				
				$sql='UPDATE `users` SET `login`=:login,`password`=:password,`id_right`=:id_right,`active`=:active,`name`=:name,`number`=:number WHERE `id_user`=:id_user';
		
				$command=$connection->createCommand($sql);
				$command->bindParam(':login',$arguments['login'],PDO::PARAM_STR);
				$command->bindParam(':password',$hash,PDO::PARAM_STR);
				$command->bindParam(':id_right',$arguments['id_right'],PDO::PARAM_STR);
				$command->bindParam(':active',$arguments['active'],PDO::PARAM_STR);
				$command->bindParam(':name',$arguments['name'],PDO::PARAM_STR);
				$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
				$command->bindParam(':id_user',$arguments['id'],PDO::PARAM_STR);
				$command->execute();
					
				/*$query=$dbh->prepare('UPDATE `users` SET `login`=?,`password`=?,`id_right`=?,`active`=?,`name`=?,`number`=? WHERE `id_user`=?');
				$query->execute(array($arguments['login'],$pass,$arguments['id_right'],$arguments['active'],$arguments['name'],$arguments['number'],$arguments['id']));*/
					
				echo "Запись отредактирована!";	
			}
		}
		else
		{
			if(strlen($arguments['login'])<6)
			{
				echo "less6";
			}
			elseif(!preg_match("/^[a-zA-Z0-9]+$/",$arguments['login']))
			{
				echo "nomatch";
			}
			else
			{
				$sql='UPDATE `users` SET `login`=:login,`id_right`=:id_right,`active`=:active,`name`=:name,`number`=:number WHERE `id_user`=:id_user';
		
				$command=$connection->createCommand($sql);
				$command->bindParam(':login',$arguments['login'],PDO::PARAM_STR);
				$command->bindParam(':id_right',$arguments['id_right'],PDO::PARAM_STR);
				$command->bindParam(':active',$arguments['active'],PDO::PARAM_STR);
				$command->bindParam(':name',$arguments['name'],PDO::PARAM_STR);
				$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
				$command->bindParam(':id_user',$arguments['id'],PDO::PARAM_STR);
				$command->execute();
					
				echo "Запись отредактирована!";	
			}
		}
	}
	public function editActiveStatus($arguments)
    {
		$connection=Yii::app()->db; 
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
			
		$sql='UPDATE `users` SET `active`=:active WHERE `id_user`=:id_user';
		$command=$connection->createCommand($sql);
		$command->bindParam(':active',$arguments['active'],PDO::PARAM_STR);
		$command->bindParam(':id_user',$arguments['id_user'],PDO::PARAM_STR);
		$command->execute();
											
		echo "Статус изменен!";
	}
	public function editClient($arguments)
    {
		$connection=Yii::app()->db; 
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));					

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
	public function handOverClient($arguments)
	{
		$connection=Yii::app()->db; 
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
		
		$sql='UPDATE `clients` SET `id_user`=:id_user,`date`=:date WHERE `id_client`=:id_client';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_user',$arguments['id_user'],PDO::PARAM_STR);
		$command->bindParam(':date',$date,PDO::PARAM_STR);
		$command->bindParam(':id_client',$arguments['id_client'],PDO::PARAM_STR);
		$command->execute();
			
		echo "Покупатель передан!";	
	}
	//-----------------------------------For Notes--------------------------------
	public function addNote($arguments)
    {
		$connection=Yii::app()->db; 
		
		if(strlen($_POST['text_notification'])>300)
		{
			echo "bigger";
		}
		else
		{
			$sql='INSERT INTO `notifications`(`text_notification`, `id_status`) VALUES (:text_notification,:id_status)';
			$command=$connection->createCommand($sql);
			$command->bindParam(':text_notification',$arguments['text_notification'],PDO::PARAM_STR);
			$command->bindParam(':id_status',$arguments['id_status'],PDO::PARAM_STR);
			$command->execute();
					
			echo 'Запись добавлена.';
		}
	}
	public function editNote($arguments)
    {
		$connection=Yii::app()->db; 
		
		if(strlen($_POST['text_notification'])>300)
		{
			echo "bigger";
		}
		else
		{			
			$sql='UPDATE `notifications` SET `text_notification`=:text_notification,`id_status`=:id_status WHERE `id_notification`=:id_notification';
			$command=$connection->createCommand($sql);
			$command->bindParam(':text_notification',$arguments['text_notification'],PDO::PARAM_STR);
			$command->bindParam(':id_status',$arguments['id_status'],PDO::PARAM_STR);
			$command->bindParam(':id_notification',$arguments['id'],PDO::PARAM_STR);
			$command->execute();
				
			echo "Запись отредактирована!";
		}
	}
	public function deleteNote($arguments)
    {
		$connection=Yii::app()->db; 	
		$sql='DELETE FROM `notifications` WHERE `id_notification`=:id_notification';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_notification',$arguments['id'],PDO::PARAM_STR);
		$command->execute();
			
		echo "Запись удалена!";	
	}
	public function editNoteActiveStatus($arguments)
    {
		$connection=Yii::app()->db; 
			
		$sql='UPDATE `notifications` SET `id_status`=:id_status WHERE `id_notification`=:id_notification';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_status',$arguments['id_status'],PDO::PARAM_STR);
		$command->bindParam(':id_notification',$arguments['id_notification'],PDO::PARAM_STR);
		$command->execute();
											
		echo "Статус изменен!";
	}
}