<?php
class SystemOption extends ModifyComponent
{
	public function checkLogin($login)
    {
		$record=User::model()->findByAttributes(array('login'=>$login));
		if ($record!==null)
		{
			echo "Такой логин уже используется!";
		}
	}
	public function checkClient($arguments)
    {
		$connection=Yii::app()->db;

		$status=1;

		$sql='SELECT `id_client` FROM `clients` WHERE `number`=:number AND `id_category`=:id_category AND `id_planning`=:id_planning AND `id_status`=:id_status';
		$command=$connection->createCommand($sql);
		$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
		$command->bindParam(':id_category',$arguments['id_category'],PDO::PARAM_STR);
		$command->bindParam(':id_planning',$arguments['id_planning'],PDO::PARAM_STR);
		$command->bindParam(':id_status',$status,PDO::PARAM_STR);
		$rows=$command->queryAll();

		if (!empty($rows))
		{
			echo "Такой покупатель уже занесен!";
		}

    }
	public function checkObject($arguments)
    {
		$connection=Yii::app()->db;

		$sql='SELECT o.`id_object` FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` WHERE o.`id_street`=:id_street AND o.`house_number`=:house_number AND o.`id_category`=:id_category AND o.`room_count`=:room_count AND o.`id_planning`=:id_planning AND o.`floor`=:floor AND ow.`number`=:number';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_street',$arguments['id_street'],PDO::PARAM_STR);
		$command->bindParam(':house_number',$arguments['house_number'],PDO::PARAM_STR);
		$command->bindParam(':id_category',$arguments['id_category'],PDO::PARAM_STR);
		$command->bindParam(':room_count',$arguments['room_count'],PDO::PARAM_STR);
		$command->bindParam(':id_planning',$arguments['id_planning'],PDO::PARAM_STR);
		$command->bindParam(':floor',$arguments['floor'],PDO::PARAM_STR);
		$command->bindParam(':number',$arguments['number'],PDO::PARAM_STR);
		$rows=$command->queryAll();

		if (!empty($rows))
		{
			echo "Такой объект уже занесен!";
		}
    }

	public function autocomplete($arguments)
    {
		$connection=Yii::app()->db;

		$response=array();
		$term=$arguments['term'];
		$term = "%$term%";

		switch ($arguments['q'])
		{
			case 'street':
			{
				$param = $arguments['param'];

				$sql='SELECT `id_street`, `name_street` FROM `objects_street` WHERE `name_street` LIKE :term AND `city_id`=(SELECT `city_id` FROM `geo_city` WHERE `id_city`=:city)';
				$command=$connection->createCommand($sql);
				$command->bindParam(':term',$term,PDO::PARAM_STR);
				$command->bindParam(':city',$param,PDO::PARAM_INT);
				$rows=$command->queryAll();

				foreach($rows as $row)
				{
					$response[]=array('value' => $row["id_street"],'label' =>$row["name_street"]);
				}
				break;
			}
			case 'city':
			{
				$sql="SELECT `id_city`, `name_city` FROM `geo_city` WHERE `name_city` LIKE :term";
				$command=$connection->createCommand($sql);
				$command->bindParam(":term",$term,PDO::PARAM_STR);
				$rows=$command->queryAll();

				foreach($rows as $row)
				{
					$response[]=array('value' => $row["id_city"],'label' =>$row["name_city"]);
				}
				break;
			}
			case 'user':
			{
				$sql="SELECT `id_user`, `name` FROM `users` WHERE `id_right`=:id_right AND `name` LIKE :term";
				$command=$connection->createCommand($sql);
				$command->bindValue(":id_right",'user',PDO::PARAM_STR);
				$command->bindParam(":term",$term,PDO::PARAM_STR);
				$rows=$command->queryAll();

				foreach($rows as $row)
				{
					$response[]=array('value' => $row["id_user"],'label' =>$row["name"]);
				}
				break;
			}
		}

		echo json_encode($response);
	}
	public function notes()
    {
		$connection=Yii::app()->db;
		$status = 1;
		$response = new stdClass();
		$i = 0;

		$sql="SELECT COUNT(`id_notification`) FROM `notifications` WHERE `id_status`=:status";
		$command=$connection->createCommand($sql);
		$command->bindParam(":status",$status,PDO::PARAM_STR);
		$count=$command->queryScalar();

		$response->total = $count;

		$command->reset();

		$sql="SELECT `text_notification` FROM `notifications` WHERE `id_status`=:status";
		$command=$connection->createCommand($sql);
		$command->bindParam(":status",$status,PDO::PARAM_STR);
		$rows=$command->queryAll();

		foreach($rows as $row)
		{
			$response->rows[$i]['text']=$row['text_notification'];
			$i++;
		}

		echo json_encode($response);

	}
	public function updateStatus()
    {
		$date=$this->date;

		$update = User::model()->updateAll(array('online'=>'online','time_activity'=>$date),'id_user=:id_user',array(':id_user'=>Yii::app()->user->getId()));
	}
	public function userLists()
    {
		$connection=Yii::app()->db;
		$result='';
		$response = new stdClass();

		$sql="SELECT `id_building`, `name_building` FROM `objects_building`";
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		$result=':выбрать...';

		foreach($rows as $row)
		{
			$result.=';'.$row['id_building'].':'.$row['name_building'];
		}

		$response->rows['building']=$result;

		$command->reset();

		$sql="SELECT `id_category`, `name_category` FROM `objects_category` ORDER BY `name_category`";
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		$result=':выбрать...';

		foreach($rows as $row)
		{
			$result.=';'.$row['id_category'].':'.$row['name_category'];
		}

		$response->rows['category']=$result;
		$command->reset();

		$sql="SELECT `id_planning`, `name_planning` FROM `objects_planning`";
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		$result=':выбрать...';

		foreach($rows as $row)
		{
			$result.=';'.$row['id_planning'].':'.$row['name_planning'];
		}

		$response->rows['planning']=$result;
		$command->reset();


		$sql="SELECT `id_sell_out_status`, `name_sell_out_status` FROM `objects_sell_out_status`";
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		$result='';

		foreach($rows as $row)
		{
			$result.=';'.$row['id_sell_out_status'].':'.$row['name_sell_out_status'];
		}

		$response->rows['sellstatus']=trim($result,';');
		$command->reset();

		$sql="SELECT `id_time_status`, `name_time_status` FROM `objects_time_status`";
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		$result='';

		foreach($rows as $row)
		{
			$result.=';'.$row['id_time_status'].':'.$row['name_time_status'];
		}

		$response->rows['timestatus']=trim($result,';');
		$command->reset();

		$sql="SELECT `id_renovation`, `name_renovation` FROM `objects_renovation`";
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		$result='';

		foreach($rows as $row)
		{
			$result.=';'.$row['id_renovation'].':'.$row['name_renovation'];
		}

		$response->rows['renovation']=trim($result,';');
		$command->reset();

		$sql="SELECT `id_window`, `name_window` FROM `objects_window`";
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		$result='';

		foreach($rows as $row)
		{
			$result.=';'.$row['id_window'].':'.$row['name_window'];
		}

		$response->rows['window']=trim($result,';');
		$command->reset();


		$sql="SELECT `id_counter`, `name_counter` FROM `objects_counter`";
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		$result='';

		foreach($rows as $row)
		{
			$result.=';'.$row['id_counter'].':'.$row['name_counter'];
		}

		$response->rows['counter']=trim($result,';');
		$command->reset();

		$sql="SELECT `id_floor_status`, `name_floor_status` FROM `clients_floor_status`";
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		$result='';

		foreach($rows as $row)
		{
			$result.=';'.$row['id_floor_status'].':'.$row['name_floor_status'];
		}

		$response->rows['floor']=trim($result,';');
		$command->reset();

		$sql="SELECT `id_type_event`, `name_type_event` FROM `users_type_event`";
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		$result='';

		foreach($rows as $row)
		{
			$result.=';'.$row['id_type_event'].':'.$row['name_type_event'];
		}

		$response->rows['type']=trim($result,';');

		echo json_encode($response);
	}
}