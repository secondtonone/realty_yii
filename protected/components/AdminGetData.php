<?php

class AdminGetData
{
	public function getClients($arguments/*$page,$rows,$sidx,$sord,$search,$filters,$id_user*/)
	{
		$connection=Yii::app()->db;

		$filters='';
		$curPage = $arguments['page'];
		$rowsPerPage = $arguments['rows'];
		$sortingField = $arguments['sidx'];
		$sortingOrder = $arguments['sord'];

		$enable="1";

		$qWhere = '';

		if (isset($arguments['filters']))
		{
			$filters=$arguments['filters'];
		}
		//определяем команду (поиск или просто запрос на вывод данных)
		//если поиск, конструируем WHERE часть запроса


		if (isset($arguments['_search']) && $arguments['_search'] == 'true') {
			$allowedFields = array('name','number','id_city','name_city','id_category','id_planning','id_floor_status','price', 'id_time_status','id_status','date');
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

		$sql='SELECT COUNT(*) FROM `clients` c LEFT JOIN `geo_city` ct ON c.`id_city`= ct.`id_city` WHERE c.`id_user`=:id_user'.$qWhere;
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_user',$arguments['id_user'],PDO::PARAM_STR);
		$totalRows = $command->queryScalar();

		$command->reset();

		$firstRowIndex = $curPage * $rowsPerPage - $rowsPerPage;

		$sql='SELECT c.`id_client`, c.`name`, c.`number`,c.`id_city`,ct.`name_city`, c.`id_category`, c.`id_planning`, c.`id_floor_status`,c.`price`, c.`id_time_status`,c.`id_status`, c.`id_user`, c.`date` FROM `clients` c LEFT JOIN `geo_city` ct ON c.`id_city`= ct.`id_city` WHERE c.`id_user`=:id_user '.$qWhere.' ORDER BY '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage;
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_user',$arguments['id_user'],PDO::PARAM_STR);
		$rows=$command->queryAll();

		//сохраняем номер текущей страницы, общее количество страниц и общее количество записей
		$response = new stdClass();
		$response->page = $curPage;
		$response->total = ceil($totalRows / $rowsPerPage);
		$response->records = $totalRows;

		$i=0;
		foreach($rows as $row)
		{
			$response->rows[$i]['id']=$row['id_client'];
			$response->rows[$i]['cell']=array($row['id_client'],$row['name'],$row['number'],$row['id_city'],$row['name_city'],$row['id_category'],$row['id_planning'],$row['id_floor_status'],$row['price'],$row['id_time_status'],$row['id_status'],$row['id_user'],$row['date'],$enable);
			$i++;
		}
		echo json_encode($response);
	}
	public function getEvents($arguments)
	{
		$connection=Yii::app()->db;

		$filters='';
		$curPage = $arguments['page'];
		$rowsPerPage = $arguments['rows'];
		$sortingField = $arguments['sidx'];
		$sortingOrder = $arguments['sord'];

		if (isset($arguments['filters']))
		{
			$filters=$arguments['filters'];
		}

		$qWhere = '';

		if (isset($arguments['_search']) && $arguments['_search'] == 'true') {
			$allowedFields = array('id_event','id_user', 'name', 'id_type_event', 'time_event');
			$allowedOperations = array('AND', 'OR');

			$searchData = json_decode($filters);

			$qWhere = ' WHERE ';
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

					$field='j.'.$rule->field;

					if ($rule->field=='name')
					{
						 $field='u.name';
					}
					if ($rule->field=='id_user')
					{
						 $field='u.id_user';
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

		$sql='SELECT COUNT(*) FROM `users_journal` j'.$qWhere;
		$command=$connection->createCommand($sql);
		$totalRows = $command->queryScalar();

		$firstRowIndex = $curPage * $rowsPerPage - $rowsPerPage;

		$command->reset();
			//получаем список из базы
		$sql='SELECT j.`id_event`,u.`id_user`, u.`name`, j.`id_type_event`, j.`time_event` FROM `users_journal` j LEFT JOIN `users` u ON j.`id_user`= u.`id_user` '.$qWhere.' ORDER BY '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage;
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
			$response->rows[$i]['id']=$row['id_event'];
			$response->rows[$i]['cell']=array($row['id_event'],$row['id_user'],$row['name'],$row['id_type_event'],$row['time_event']);

			$i++;
		}
		echo json_encode($response);
	}
	public function getNotifications($arguments)
	{
		$connection=Yii::app()->db;

		$filters='';
		$curPage = $arguments['page'];
		$rowsPerPage = $arguments['rows'];
		$sortingField = $arguments['sidx'];
		$sortingOrder = $arguments['sord'];

		if (isset($arguments['filters']))
		{
			$filters=$arguments['filters'];
		}


		$qWhere = '';
		//определяем команду (поиск или просто запрос на вывод данных)
		//если поиск, конструируем WHERE часть запроса


		if (isset($arguments['_search']) && $arguments['_search']== 'true') {
			$allowedFields = array('id_notification', 'text_notification', 'id_status');
			$allowedOperations = array('AND', 'OR');

			$searchData = json_decode($filters);

			$qWhere = ' WHERE ';
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
					switch ($rule->op) {
						case 'lt': $qWhere .= 'n.'.$rule->field.' < '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'le': $qWhere .= 'n.'.$rule->field.' <= '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'gt': $qWhere .= 'n.'.$rule->field.' > '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'ge': $qWhere .= 'n.'.$rule->field.' >= '.$connection->getPdoInstance()->quote($rule->data); break;
		 				case 'eq': $qWhere .= 'n.'.$rule->field.' = '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'ne': $qWhere .= 'n.'.$rule->field.' <> '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'bw': $qWhere .= 'n.'.$rule->field.' LIKE '.$connection->getPdoInstance()->quote($rule->data.'%'); break;
						case 'cn': $qWhere .= 'n.'.$rule->field.' LIKE '.$connection->getPdoInstance()->quote('%'.$rule->data.'%'); break;
						default: throw new Exception('Cool hacker is here!!! :)');
					}
				}
				else {
				//если получили не существующее условие - возвращаем описание ошибки
					throw new Exception('Cool hacker is here!!! :)');
				}
			}
		}


		$sql='SELECT COUNT(`id_notification`) FROM `notifications` n '.$qWhere;
		$command=$connection->createCommand($sql);
		$totalRows = $command->queryScalar();

		$firstRowIndex = $curPage * $rowsPerPage - $rowsPerPage;

		$command->reset();
			//получаем список из базы
		$sql='SELECT n.`id_notification`, n.`text_notification`, n.`id_status` FROM `notifications` n '.$qWhere.' ORDER BY '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage;
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
			$response->rows[$i]['id']=$row['id_notification'];
			$response->rows[$i]['cell']=array($row['id_notification'] , $row['text_notification'], $row['id_status']);

			$i++;
		}
		echo json_encode($response);
	}
	public function getObjects($arguments)
	{
		$connection=Yii::app()->db;

		$filters='';
		$curPage = $arguments['page'];
		$rowsPerPage = $arguments['rows'];
		$sortingField = $arguments['sidx'];
		$sortingOrder = $arguments['sord'];

		if (isset($arguments['filters']))
		{
			$filters=$arguments['filters'];
		}


		$enable="1";
		$qWhere = '';
		//определяем команду (поиск или просто запрос на вывод данных)
		//если поиск, конструируем WHERE часть запроса


		if (isset($arguments['_search']) && $arguments['_search'] == 'true') {
			$allowedFields = array('name_owner','number','name_city', 'name_street', 'house_number' ,'id_category' ,'room_count' , 'id_planning','id_building' , 'floor','number_of_floor' , 'space' ,'id_renovation','id_floor_status','comment','id_window' ,'id_counter','id_sell_out_status', 'id_time_status' , 'price' , 'market_price','id_user' ,'name' , 'date');
			$allowedOperations = array('AND', 'OR');

			$searchData = json_decode($filters);

			$qWhere = ' WHERE ';
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
						$field='c.name_city';
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
		$sql="SELECT COUNT(`id_object`) AS count FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` LEFT JOIN `objects_street` st ON o.`id_street`= st.`id_street` LEFT JOIN `geo_city` c ON o.`id_city`= c.`id_city` LEFT JOIN `users` u ON o.`id_user`= u.`id_user` ".$qWhere;
		$command=$connection->createCommand($sql);
		$totalRows = $command->queryScalar();

		$firstRowIndex = $curPage * $rowsPerPage - $rowsPerPage;

		$command->reset();
			//получаем список из базы
		$sql='SELECT  o.`id_object` , o.`id_owner`, ow.`name_owner`,ow.`number`,o.`id_city`,c.`name_city`, o.`id_floor_status`,o.`id_street`,st.`name_street` , o.`house_number` ,o.`id_building`, o.`id_category`, o.`room_count` , o.`id_planning` , o.`floor`,o.`number_of_floor` , o.`space` , o.`id_renovation` , o.`id_window`, o.`id_counter`,o.`comment`, o.`id_sell_out_status`, o.`id_time_status`, o.`price`, o.`market_price` ,o.`id_user`,u.`name` , o.`date` FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` LEFT JOIN `objects_street` st ON o.`id_street`= st.`id_street` LEFT JOIN `geo_city` c ON o.`id_city`= c.`id_city` LEFT JOIN `users` u ON o.`id_user`= u.`id_user` '.$qWhere.' ORDER BY '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage;

		$dependency = new CDbCacheDependency('SELECT  MAX(o.`date`) FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` LEFT JOIN `objects_street` st ON o.`id_street`= st.`id_street` LEFT JOIN `geo_city` c ON o.`id_city`= c.`id_city` LEFT JOIN `users` u ON o.`id_user`= u.`id_user` '.$qWhere.' ORDER BY '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage);
		$rows = $connection->cache(500, $dependency)->createCommand($sql)->queryAll();

		/*$command=$connection->createCommand($sql);
		$rows=$command->queryAll();*/

		//сохраняем номер текущей страницы, общее количество страниц и общее количество записей
		$response = new stdClass();
		$response->page = $curPage;
		$response->total = ceil($totalRows / $rowsPerPage);
		$response->records = $totalRows;

		$i=0;

		foreach($rows as $row)
		{
			$response->rows[$i]['id']=$row['id_object'];
			$response->rows[$i]['cell']=array($row['id_object'] , $row['id_owner'], $row['name_owner'],$row['number'], $row['id_city'], $row['name_city'],$row['id_street'], $row['name_street'] , $row['house_number'],$row['id_building'],$row['id_category'], $row['room_count'] , $row['id_planning'], $row['floor'], $row['number_of_floor'],$row['id_floor_status'] , $row['space'], $row['id_sell_out_status'], $row['id_time_status'], $row['price'] , $row['market_price'] ,$row['id_user'],$row['name'],$row['date'],$enable);

			$i++;
		}
		echo json_encode($response);
	}
	public function getOnlineUsers()
	{
		$connection=Yii::app()->db;

		$html_out='';

		$sql='SELECT u.`id_user`,u.`name` , u.`login` , u.`online`,u.`time_activity`, obj, client, objsell FROM `users` u LEFT JOIN (SELECT `id_user` AS uid, COUNT(`id_object`) AS obj FROM `objects` WHERE `id_sell_out_status`=1 OR `id_sell_out_status`=4 GROUP BY `id_user`) Q1 ON Q1.uid=u.`id_user` LEFT JOIN (SELECT `id_user` AS uid, COUNT(`id_client`) AS client FROM `clients` WHERE `id_status`=1 GROUP BY `id_user`) Q2 ON Q2.uid=u.`id_user` LEFT JOIN (SELECT `id_user` AS uid, COUNT(`id_object`) AS objsell FROM `objects` WHERE `id_sell_out_status`=2 GROUP BY `id_user`) Q3 ON Q3.uid=u.`id_user` ORDER BY `online` DESC, `login` asc';
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		foreach($rows as $row)
		{
			$object=$row['obj'];
			$obj_sell=$row['objsell'];
			$client=$row['client'];
			$time_activity=$row['time_activity'];
			$online=$row['online'];

			if (empty($object))
			{
				$object=0;
			}
			if (empty($obj_sell))
			{
				$obj_sell=0;
			}
			if (empty($client))
			{
				$client=0;
			}
			if (empty($time_activity))
			{
				$time_activity='-';
			}
			if (empty($online))
			{
				$online='offline';
			}

			$html_temp = '<div id="'.$row['id_user'].'" class="user '.$online.'" title="Всего активных объектов: '.$object.'<br>Объектов продано: '.$obj_sell.'<br>Всего активных покупателей: '.$client.'<br>Последняя активность: '.$time_activity.'">
							<div class="marker '.$online.'"></div>
							<div class="wrap">
								<div class="login">'.$row['login'].'</div>
								<div class="name">'.$row['name'].'</div>
							</div>
						</div>';

			$html_out .=$html_temp;
		}

		echo $html_out;
	}
	public function getUsers($arguments)
	{
		$connection=Yii::app()->db;

		$filters='';
		$curPage = $arguments['page'];
		$rowsPerPage = $arguments['rows'];
		$sortingField = $arguments['sidx'];
		$sortingOrder = $arguments['sord'];

		if (isset($arguments['filters']))
		{
			$filters=$arguments['filters'];
		}


		$qWhere = '';
					//определяем команду (поиск или просто запрос на вывод данных)
					//если поиск, конструируем WHERE часть запроса


		if (isset($arguments['_search']) && $arguments['_search'] == 'true') {
			$allowedFields = array('login','active','id_right','name','number','time_activity','online');
			$allowedOperations = array('AND', 'OR');

			$searchData = json_decode($filters);

			$qWhere = ' WHERE ';
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
					switch ($rule->op) {
						case 'eq': $qWhere .= $rule->field.' = '.$connection->getPdoInstance()->quote($rule->data); break;
						case 'ne': $qWhere .= $rule->field.' <> '.$connection->getPdoInstance()->quote($rule->data); break;
				 		case 'bw': $qWhere .= $rule->field.' LIKE '.$connection->getPdoInstance()->quote($rule->data.'%'); break;
						case 'cn': $qWhere .= $rule->field.' LIKE '.$connection->getPdoInstance()->quote('%'.$rule->data.'%'); break;
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
		$sql="SELECT COUNT(*) AS count FROM `users` ".$qWhere;
		$command=$connection->createCommand($sql);
		$totalRows = $command->queryScalar();

		$firstRowIndex = $curPage * $rowsPerPage - $rowsPerPage;
				//получаем список из базы
		$command->reset();

		$sql='SELECT `id_user`,`login`,`password`,`active`,`id_right`,`name`,`number`,`online`,`time_activity` FROM `users`'.$qWhere.' ORDER BY '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage;

		$dependency = new CDbCacheDependency('SELECT MAX(`time_activity`) FROM `users`'.$qWhere.' ORDER BY '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage);
		$rows = $connection->cache(500, $dependency)->createCommand($sql)->queryAll();

		/*$command=$connection->createCommand($sql);
		$rows=$command->queryAll();*/

		//сохраняем номер текущей страницы, общее количество страниц и общее количество записей
		$response = new stdClass();
		$response->page = $curPage;
		$response->total = ceil($totalRows / $rowsPerPage);
		$response->records = $totalRows;

		$i=0;

		foreach($rows as $row)
		{
			$row['password']="********************";
			$password='';

			$response->rows[$i]['id']=$row['id_user'];
			$response->rows[$i]['cell']=array($row['id_user'],$row['login'],$row['password'],$password,$row['active'],$row['id_right'],$row['name'],$row['number'],$row['online'],$row['time_activity']);

			$i++;
		}
		echo json_encode($response);
	}

}