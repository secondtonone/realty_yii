<?php

class UserGetData
{
	public function getClients($page,$rows,$sidx,$sord,$search,$filters)
	{
		$connection=Yii::app()->db;
		
		$curPage = $page;
		$rowsPerPage = $rows;
		$sortingField = $sidx;
		$sortingOrder = $sord;
			
		$array_id = '';
		$qWhere = '';
		//определяем команду (поиск или просто запрос на вывод данных)
		//если поиск, конструируем WHERE часть запроса
							
		if (isset($search) && $search == 'true') {
			$allowedFields = array('clname','name','id_city','name_city','number','id_category','id_planning','id_floor_status','price', 'id_time_status','id_status','date');
			$allowedOperations = array('AND', 'OR');

			$searchData = json_decode($filters);
			
			$qWhere = ' AND ';
			$firstElem = true;
			
			//объединяем все полученные условия
			foreach ($searchData->rules as $rule) {
				if (!$firstElem) {
				//объединяем условия (с помощью AND или OR)
					if (in_array($searchData->groupOp, $allowedOperations)) {
						$qWhere .= ' '.$searchData->groupOp.' ';
					}
					else {
						//если получили не существующее условие - возвращаем описание ошибки
						throw new Exception('Cool hacker is here!!! :)');
					}
				}
				else
				{
					$firstElem = false;
				}
							
				//вставляем условия
				if (in_array($rule->field, $allowedFields)) {
						
					$field=$rule->field;
						
					if ($rule->field=='name')
					{
						 $field='u.name';
					}
					if ($rule->field=='clname')
					{
						 $field='c.name';
					}
					if ($rule->field=='number')
					{
						 $field='c.number';
					}
					if ($rule->field=='name_city')
					{
						 $field='ct.name_city';
					}
					if ($rule->field=='id_city')
					{
						$field='c.id_city';
					}
					
					switch ($rule->op) {
							
						case 'lt': $qWhere .= $field.' < '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'le': $qWhere .= $field.' <= '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'gt': $qWhere .= $field.' > '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'ge': $qWhere .= $field.' >= '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'eq': $qWhere .= $field.' = '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'ne': $qWhere .= $field.' <> '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'bw': $qWhere .= $field.' LIKE '.$connection->getPdoInstance()->quote($rule->data.'%'); break;
						case 'cn': $qWhere .= $field.' LIKE '.$connection->getPdoInstance()->quote('%'.$rule->data.'%'); break;
						default: throw new Exception('Cool hacker is here!!! :)');
					}
				}
				else {
				//если получили не существующее условие - возвращаем описание ошибки
					throw new Exception('Cool hacker is here!!! :)');
				}
			}
		}
						 
			//определяем количество записей в таблице
		$sql='SELECT COUNT(*) AS count FROM `clients` c WHERE c.`id_status`=1 '.$qWhere;
		$command=$connection->createCommand($sql);
		$totalRows = $command->queryScalar();
		
		$command->reset();
		/*$rows = $dbh->prepare('SELECT COUNT(*) AS count FROM `clients` c WHERE c.`id_status`=? '.$qWhere);
		$rows->execute(array(1));
			
		$totalRows = $rows->fetch(PDO::FETCH_ASSOC);*/
		$sql='SELECT `id_user` FROM `users` WHERE `id_user`<>:id_user AND `id_right`=:id_right';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_user',Yii::app()->user->getId(),PDO::PARAM_STR);
		$command->bindValue(':id_right','user',PDO::PARAM_STR);
		$rows=$command->queryAll();
		
		$command->reset();
					
		/*$rows = $dbh->prepare('SELECT `id_user` FROM `users` WHERE `id_user`<>? AND `id_right`=?');
		$rows->execute(array($_SESSION["id_user"],'user'));*/
			
		foreach($rows as $id_user)
		{
			$array_id.=$id_user["id_user"].',';
		}

		$array_id = rtrim($array_id, ",");
					
		$firstRowIndex = $curPage * $rowsPerPage - $rowsPerPage;
		//получаем список из базы
		/*$res = $dbh->prepare('SELECT c.`id_client`, c.`name` as clname, c.`number`,c.`id_city`,ct.`name_city`, c.`id_category`, c.`id_planning`, c.`id_floor_status`,c.`price`, c.`id_time_status`,c.`id_status`, c.`id_user`,u.`name`, c.`date` FROM `clients` c LEFT JOIN `users` u ON c.`id_user`= u.`id_user` LEFT JOIN `geo_city` ct ON c.`id_city`= ct.`id_city` WHERE c.`id_status`=? '.$qWhere.' ORDER BY FIELD( c.`id_user` ,'.$array_id.'), '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage);
		$res->execute(array(1));*/
		
		$sql='SELECT c.`id_client`, c.`name` as clname, c.`number`,c.`id_city`,ct.`name_city`, c.`id_category`, c.`id_planning`, c.`id_floor_status`,c.`price`, c.`id_time_status`,c.`id_status`, c.`id_user`,u.`name`, c.`date` FROM `clients` c LEFT JOIN `users` u ON c.`id_user`= u.`id_user` LEFT JOIN `geo_city` ct ON c.`id_city`= ct.`id_city` WHERE c.`id_status`=1 '.$qWhere.' ORDER BY FIELD( c.`id_user` ,'.$array_id.'), '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage;
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();
			
		//сохраняем номер текущей страницы, общее количество страниц и общее количество записей
		$response = new stdClass();
		$response->page = $curPage;
		$response->total = ceil($totalRows / $rowsPerPage);
		$response->records = $totalRows;
			
		$i=0;
		foreach($rows as $row)  
		{
			if ($row['id_user']==Yii::app()->user->getId()) 
			{
				$number=$row['number'];
				$enable="1";
			}
			else
			{
				$number="[скрыт]";
				$enable="0";
			}
						
			$response->rows[$i]['id']=$row['id_client'];
			$response->rows[$i]['cell']=array($row['id_client'],$row['clname'],$number, $row['id_city'],$row['name_city'],$row['id_category'],$row['id_planning'],$row['id_floor_status'],$row['price'],$row['id_time_status'],$row['id_status'],$row['id_user'],$row['name'],$row['date'],$enable);					
			$i++;
		}
		echo json_encode($response); 
	}
	
	public function getObjects($page,$rows,$sidx,$sord,$search,$filters)
	{
		$connection=Yii::app()->db;
		
		$curPage = $page;
		$rowsPerPage = $rows;
		$sortingField = $sidx;
		$sortingOrder = $sord;
			
		$array_id = '';
		$qWhere = '';
		
		if (isset($search) && $search == 'true') {
			
			$allowedFields = array('name_owner','number','name_city','id_city', 'name_street', 'house_number' ,'id_category' ,'room_count' , 'id_planning','id_building' , 'floor','number_of_floor' , 'space' ,'id_renovation','id_floor_status','id_window' ,'id_counter','id_sell_out_status', 'id_time_status' , 'price' , 'market_price' ,'name' , 'date');
			$allowedOperations = array('AND', 'OR');
						
			$searchData = json_decode($filters);
		
			$qWhere = ' AND ';
			$firstElem = true;
		
			//объединяем все полученные условия
			foreach ($searchData->rules as $rule) {
				if (!$firstElem) {
				//объединяем условия (с помощью AND или OR)
					if (in_array($searchData->groupOp, $allowedOperations)) {
						$qWhere .= ' '.$searchData->groupOp.' ';
					}
					else {
					//если получили не существующее условие - возвращаем описание ошибки
						throw new Exception('Cool hacker is here!!! :)');
					}
				}
				else {
					$firstElem = false;
				}
								
				//вставляем условия
				if (in_array($rule->field, $allowedFields)) {
					
					$field='o.'.$rule->field;
						
					if ($rule->field=='name')
					{
						$field='u.name';
					}
					if ($rule->field=='number')
					{
						$field='ow.number';
					}
					if ($rule->field=='name_owner')
					{
						$field='ow.name_owner';
					}
					if ($rule->field=='name_street')
					{
						$field='st.name_street';
					}
					if ($rule->field=='name_city')
					{
						$field='ct.name_city';
					}
					if ($rule->field=='id_city')
					{
						$field='o.id_city';
					}
					
					switch ($rule->op) {
						case 'lt': $qWhere .= $field.' < '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'le': $qWhere .= $field.' <= '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'gt': $qWhere .= $field.' > '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'ge': $qWhere .= $field.' >= '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'eq': $qWhere .= $field.' = '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'ne': $qWhere .= $field.' <> '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'bw': $qWhere .= $field.' LIKE '.$connection->getPdoInstance()->quote($rule->data.'%'); break;
						case 'cn': $qWhere .= $field.' LIKE '.$connection->getPdoInstance()->quote('%'.$rule->data.'%'); break;
						default: throw new Exception('Cool hacker is here!!! :)');
					}
				}
				else {
				//если получили не существующее условие - возвращаем описание ошибки
					throw new Exception('Cool hacker is here!!! :)');
				}
			}
		}
					 
		//определяем количество записей в таблице
		/*$rows = $dbh->prepare('SELECT COUNT(`id_object`) AS count FROM `objects` o WHERE (o.`id_sell_out_status`=1 OR o.`id_sell_out_status`=4)'.$qWhere);
		$rows->execute(array());
			
		$totalRows = $rows->fetch(PDO::FETCH_ASSOC);*/
		
		$sql='SELECT COUNT(`id_object`) AS count FROM `objects` o WHERE (o.`id_sell_out_status`=1 OR o.`id_sell_out_status`=4)'.$qWhere;
		$command=$connection->createCommand($sql);
		$totalRows = $command->queryScalar();

		$command->reset();
		
		$sql='SELECT `id_user` FROM `users` WHERE `id_user`<>:id_user AND `id_right`=:id_right';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_user',Yii::app()->user->getId(),PDO::PARAM_STR);
		$command->bindValue(':id_right','user',PDO::PARAM_STR);
		$rows=$command->queryAll();
		
		$command->reset();
		
		/*$rows = $dbh->prepare('SELECT `id_user` FROM `users` WHERE `id_user`<>? AND `id_right`=?');
		$rows->execute(array($_SESSION["id_user"],'user'));*/
			
		foreach($rows as $id_user)
		{
			$array_id.=$id_user["id_user"].',';
		}

		$array_id = rtrim($array_id, ",");
			
		$firstRowIndex = $curPage * $rowsPerPage - $rowsPerPage;
		//получаем список из базы
		/*$res = $dbh->prepare('SELECT o.`id_object`, o.`id_owner`, ow.`name_owner`,ow.`number`, o.`id_city`,ct.`name_city`,o.`id_street`, o.`id_floor_status`,st.`name_street` , o.`house_number` ,o.`id_building`, o.`id_category`, o.`room_count` , o.`id_planning` , o.`floor`,o.`number_of_floor` , o.`space` , o.`id_renovation` , o.`id_window`, o.`id_counter`, o.`id_sell_out_status`, o.`id_time_status`, o.`price`, o.`market_price` ,o.`id_user`,u.`name` , o.`date` FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` LEFT JOIN `objects_street` st ON o.`id_street`= st.`id_street` LEFT JOIN `geo_city` ct ON o.`id_city`= ct.`id_city` LEFT JOIN `users` u ON o.`id_user`= u.`id_user` WHERE (o.`id_sell_out_status`=1 OR o.`id_sell_out_status`=4) '.$qWhere.' ORDER BY FIELD( o.`id_user` ,'.$array_id.'), '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage);
		$res->execute(array());*/
		$sql='SELECT o.`id_object`, o.`id_owner`, ow.`name_owner`,ow.`number`, o.`id_city`,ct.`name_city`,o.`id_street`, o.`id_floor_status`,st.`name_street` , o.`house_number` ,o.`id_building`, o.`id_category`, o.`room_count` , o.`id_planning` , o.`floor`,o.`number_of_floor` , o.`space` , o.`id_renovation` , o.`id_window`, o.`id_counter`, o.`id_sell_out_status`, o.`id_time_status`, o.`price`, o.`market_price` ,o.`id_user`,u.`name` , o.`date` FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` LEFT JOIN `objects_street` st ON o.`id_street`= st.`id_street` LEFT JOIN `geo_city` ct ON o.`id_city`= ct.`id_city` LEFT JOIN `users` u ON o.`id_user`= u.`id_user` WHERE (o.`id_sell_out_status`=1 OR o.`id_sell_out_status`=4) '.$qWhere.' ORDER BY FIELD( o.`id_user` ,'.$array_id.'), '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage;
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();
		
			//сохраняем номер текущей страницы, общее количество страниц и общее количество записей
		$response = new stdClass();
		$response->page = $curPage;
		$response->total = ceil($totalRows / $rowsPerPage);
		$response->records = $totalRows;
		
		$i=0;
		
		foreach($rows as $row) 
		{
			if ($row['id_user']==Yii::app()->user->getId()) 
			{
				$number=$row['number'];
				$enable="1";
			}
			else
			{
				$number="[скрыт]";
				$enable="0";
			}
				
				
			$response->rows[$i]['id']=$row['id_object'];
			$response->rows[$i]['cell']=array($row['id_object'] , $row['id_owner'], $row['name_owner'],$number, $row['id_city'],$row['name_city'],$row['id_street'], $row['name_street'] , $row['house_number'],$row['id_building'],$row['id_category'], $row['room_count'] , $row['id_planning'], $row['floor'], $row['number_of_floor'],$row['id_floor_status'] , $row['space'], $row['id_sell_out_status'], $row['id_time_status'], $row['price'] , $row['market_price'] ,$row['id_user'],$row['name'],$row['date'],$enable);
					
			$i++;
		}
		echo json_encode($response);	
	}
	public function getSubObjects($id_object)
	{
		$connection=Yii::app()->db;
		
		$sql='SELECT o.`id_renovation`, o.`id_window`, o.`id_counter`,o.`id_user`,o.`date_change` FROM `objects` o WHERE o.`id_object`=:id_object';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_object',$id_object,PDO::PARAM_STR);
		$rows=$command->queryAll();
		
		/*$res = $dbh->prepare('SELECT o.`id_renovation`, o.`id_window`, o.`id_counter`,o.`id_user`,o.`date_change` FROM `objects` o WHERE o.`id_object`=?');
		$res->execute(array($id_object));*/
		
		//сохраняем номер текущей страницы, общее количество страниц и общее количество записей
		$response = new stdClass();
		
		$i=0;
		
		foreach($rows as $row) 
		{
			if ($row['id_user']==Yii::app()->user->getId()) 
			{
				$enable="1";
			}
			else
			{		
				$enable="0";
			}

			$response->rows[$i]['cell']=array($row['id_renovation'], $row['id_window'],$row['id_counter'],$row['date_change'],$row['id_user'],$enable);
					
			$i++;
		}
		echo json_encode($response);
	}
	
}