<?php

class SystemOption
{
	public function adminCheckData($login) 
    {
		$record=User::model()->findByAttributes(array('login'=>$login));
		if ($record!==null) 
		{
			echo "Такой логин уже используется!";
		}
	}
	public function autocomplete($arguments) 
    {
		
		
		$connection=Yii::app()->db; 
		$response=array();
	
		switch (/*$arguments['r']*/'street')
		{
			case 'street':
			{
				$term='мат';
				$term="%$term%";
				$num=2461;
				$sql='SELECT `id_street`, `name_street` FROM `objects_street` WHERE `name_street` LIKE :term AND `city_id`=(SELECT `city_id` FROM `geo_city` WHERE `id_city`=:city)';
				$command=$connection->createCommand($sql);
				$command->bindParam(':term',/*$arguments['term']*/$term,PDO::PARAM_STR);
				$command->bindParam(':city',/*$arguments['param']*/$num,PDO::PARAM_INT);
				$rows=$command->queryAll();
		
				/*$res = $dbh->prepare("SELECT `id_street`, `name_street` FROM `objects_street` WHERE `name_street` LIKE ? AND `city_id`=(SELECT `city_id` FROM `geo_city` WHERE `id_city`=?)");
				$res->execute(array("%$term%",$_GET['id_city']));*/
				
				foreach($rows as $row) 
				{
					$response[]=array('value' => $row["id_street"],'label' =>$row["name_street"]);
				}
				echo json_encode($response);
				break;
			}
			case 'city':
			{
				$sql="SELECT `id_city`, `name_city` FROM `geo_city` WHERE `name_city` LIKE :term";
				$command=$connection->createCommand($sql);
				$command->bindParam(":term","%$term%",PDO::PARAM_STR);
				$rows=$command->queryAll();
		
				/*$res = $dbh->prepare("SELECT `id_city`, `name_city` FROM `geo_city` WHERE `name_city` LIKE ?");
				$res->execute(array("%$term%"));*/
				
				while($row = $rows->fetch(PDO::FETCH_ASSOC)) 
				{
					$response[]=array('value' => $row["id_city"],'label' =>$row["name_city"]);
				}
				echo json_encode($response);
				break;
			}
			case 'user':
			{
		
				$res = $dbh->prepare("SELECT `id_user`, `name` FROM `users` WHERE `name` LIKE ?");
				
				$res->execute(array("%$term%"));
				
				while($row = $res->fetch(PDO::FETCH_ASSOC)) 
				{
					$response[]=array('value' => $row["id_user"],'label' =>$row["name"]);
				}
				echo json_encode($response);
				break;
			}
		}
		
	}
	public function notes() 
    {
		
	}
	public function updateStatus() 
    {
		$date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
		
		$update = User::model()->updateAll(array('online'=>'online','time_activity'=>$date),'id_user=:id_user',array(':id_user'=>Yii::app()->user->id));	
	}
	public function userCheckData() 
    {
		
	}
	public function userLists() 
    {
		
	}
}