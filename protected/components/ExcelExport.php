<?php
class ExcelExport
{
	public function adminObjects($arguments)
	{
		$connection=Yii::app()->db;

		$journal = new EventJournaling;
		$journal->userDataExport(Yii::app()->user->getId());

		$curPage = $arguments['page'];
		$rowsPerPage = $arguments['rows'];
		$sortingField = $arguments['sidx'];
		$sortingOrder = $arguments['sord'];

		$qWhere = '';
		//определяем команду (поиск или просто запрос на вывод данных)
		//если поиск, конструируем WHERE часть запроса


		if (isset($arguments['_search']) && $arguments['_search'] == 'true') {
			$allowedFields = array('name_owner','number','name_city','id_city', 'name_street', 'house_number' ,'id_category' ,'room_count' , 'id_planning','id_building' , 'floor','number_of_floor' , 'space' ,'id_renovation','id_floor_status','id_window' ,'id_counter','id_sell_out_status', 'id_time_status' , 'price' , 'market_price' ,'name' , 'date','comment');
			$allowedOperations = array('AND', 'OR');

			$searchData = json_decode($arguments['filters']);

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
						$field='ct.name_city';
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

		$sql="SELECT COUNT(`id_object`) AS count FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` LEFT JOIN `objects_street` st ON o.`id_street`= st.`id_street` LEFT JOIN `geo_city` ct ON o.`id_city`= ct.`id_city` LEFT JOIN `objects_building` b ON o.`id_building`= b.`id_building` LEFT JOIN `objects_category` cat ON o.`id_category`= cat.`id_category` LEFT JOIN `objects_planning` p ON  o.`id_planning`= p.`id_planning` LEFT JOIN `objects_renovation` r ON o.`id_renovation`=r.`id_renovation` LEFT JOIN `objects_window` w ON o.`id_window`=w.`id_window` LEFT JOIN `objects_counter` c ON o.`id_counter`= c.`id_counter` LEFT JOIN `objects_sell_out_status` s ON o.`id_sell_out_status`=s.`id_sell_out_status` LEFT JOIN `objects_time_status` t ON  o.`id_time_status`= t.`id_time_status` LEFT JOIN `users` u ON o.`id_user`= u.`id_user` ".$qWhere;
		$command=$connection->createCommand($sql);
		$totalRows = $command->queryScalar();


		$firstRowIndex = $curPage * $rowsPerPage - $rowsPerPage;
		//получаем список из базы
		$sql='SELECT o.`id_object` , ow.`name_owner`,ow.`number`,ct.`name_city`, st.`name_street` , o.`house_number`,b.`name_building`, cat.`name_category` , o.`room_count` , p.`name_planning` , o.`floor`,o.`number_of_floor` , o.`space`,r.`name_renovation` ,w.`name_window`,o.`comment` , c.`name_counter`,s.`name_sell_out_status`, t.`name_time_status` , o.`price` , o.`market_price`,o.`id_user`,u.`name` , o.`date` FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` LEFT JOIN `objects_street` st ON o.`id_street`= st.`id_street` LEFT JOIN `geo_city` ct ON o.`id_city`= ct.`id_city` LEFT JOIN `objects_building` b ON o.`id_building`= b.`id_building` LEFT JOIN `objects_category` cat ON o.`id_category`= cat.`id_category` LEFT JOIN `objects_planning` p ON  o.`id_planning`= p.`id_planning` LEFT JOIN `objects_renovation` r ON o.`id_renovation`=r.`id_renovation` LEFT JOIN `objects_window` w ON o.`id_window`=w.`id_window` LEFT JOIN `objects_counter` c ON o.`id_counter`= c.`id_counter` LEFT JOIN `objects_sell_out_status` s ON o.`id_sell_out_status`=s.`id_sell_out_status` LEFT JOIN `objects_time_status` t ON  o.`id_time_status`= t.`id_time_status` LEFT JOIN `users` u ON o.`id_user`= u.`id_user` '.$qWhere.' ORDER BY '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage;
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();
		//сохраняем номер текущей страницы, общее количество страниц и общее количество записей
		$response = new stdClass();
		$response->page = $curPage;
		$response->total = ceil($totalRows / $rowsPerPage);
		$response->records = $totalRows;

	  	$filename = "Данные об объектах " . date('Y-m-d') . ".xls";

		header("Content-Disposition: attachment; filename=\"$filename\"");
		header("Content-Type: application/vnd.ms-excel");
		echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head>';
	 	echo '<table width="1000" border="1">
				  <tr>
					<td>№</td>
					<td>Собственник</td>
					<td>Телефон</td>
					<td>Город</td>
					<td>Улица</td>
					<td>№ дома</td>
					<td>Тип здания</td>
					<td>Категория</td>
					<td>Кол-во комнат</td>
					<td>Планировка</td>
					<td>Этаж</td>
					<td>Этажность</td>
					<td>Площадь, м. кв.</td>
					<td>Статус</td>
					<td>Статус по времени</td>
					<td>Цена</td>
					<td>Цена с комиссией</td>
					<td>Менеджер</td>
					<td>Ремонт</td>
					<td>Окна</td>
					<td>Счетчики</td>
					<td>Коментарий</td>
					<td>Дата</td>
				 </tr>';
		foreach($rows as $row)
	    {
			echo  '<tr>
					<td>'.$row['id_object'].'</td>
					<td>'.$row['name_owner'].'</td>
					<td>'.$row['number'].'</td>
					<td>'.$row['name_city'].'</td>
					<td>'.$row['name_street'].'</td>
					<td>'.$row['house_number'].'</td>
					<td>'.$row['name_building'].'</td>
					<td>'.$row['name_category'].'</td>
					<td>'.$row['room_count'].'</td>
					<td>'.$row['name_planning'].'</td>
					<td>'.$row['floor'].'</td>
					<td>'.$row['number_of_floor'].'</td>
					<td>'.$row['space'].'</td>
					<td>'.$row['name_sell_out_status'].'</td>
					<td>'.$row['name_time_status'].'</td>
					<td>'.$row['price'].'</td>
					<td>'.$row['market_price'].'</td>
					<td>'.$row['name'].'</td>
					<td>'.$row['name_renovation'].'</td>
					<td>'.$row['name_window'].'</td>
					<td>'.$row['name_counter'].'</td>
					<td>'.$row['comment'].'</td>
					<td>'.$row['date'].'</td>
			  </tr>';
		 }
		 echo '</table>';
	}
	public function userObjects($arguments)
	{
		$connection=Yii::app()->db;

		$journal = new EventJournaling;
		$journal->userDataExport(Yii::app()->user->getId());

		$curPage = $arguments['page'];
		$rowsPerPage = $arguments['rows'];
		$sortingField = $arguments['sidx'];
		$sortingOrder = $arguments['sord'];
		$array_id = '';

		$qWhere = '';
		//определяем команду (поиск или просто запрос на вывод данных)
		//если поиск, конструируем WHERE часть запроса


		if (isset($arguments['_search']) && $arguments['_search'] == 'true') {
			$allowedFields = array('name_owner','number','name_city','id_city', 'name_street', 'house_number' ,'id_category' ,'room_count' , 'id_planning','id_building' , 'floor','number_of_floor' , 'space' ,'id_renovation','id_floor_status','id_window' ,'id_counter','id_sell_out_status', 'id_time_status' , 'price' , 'market_price' ,'name' ,'comment', 'date');
			$allowedOperations = array('AND', 'OR');

			$searchData = json_decode($arguments['filters']);

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

		$sql='SELECT COUNT(`id_object`) AS count FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` LEFT JOIN `objects_street` st ON o.`id_street`= st.`id_street` LEFT JOIN `geo_city` ct ON o.`id_city`= ct.`id_city` LEFT JOIN `objects_building` b ON o.`id_building`= b.`id_building` LEFT JOIN `objects_category` cat ON o.`id_category`= cat.`id_category` LEFT JOIN `objects_planning` p ON  o.`id_planning`= p.`id_planning` LEFT JOIN `objects_renovation` r ON o.`id_renovation`=r.`id_renovation` LEFT JOIN `objects_window` w ON o.`id_window`=w.`id_window` LEFT JOIN `objects_counter` c ON o.`id_counter`= c.`id_counter` LEFT JOIN `objects_sell_out_status` s ON o.`id_sell_out_status`=s.`id_sell_out_status` LEFT JOIN `objects_time_status` t ON  o.`id_time_status`= t.`id_time_status` LEFT JOIN `users` u ON o.`id_user`= u.`id_user` WHERE (o.`id_sell_out_status`=1 OR o.`id_sell_out_status`=4)'.$qWhere;
		$command=$connection->createCommand($sql);
		$totalRows = $command->queryScalar();


		$command->reset();

		$sql='SELECT `id_user` FROM `users` WHERE `id_user`<>:id_user AND `id_right`=:id_right';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_user',Yii::app()->user->getId(),PDO::PARAM_STR);
		$command->bindValue(':id_right','user',PDO::PARAM_STR);
		$rows=$command->queryAll();

		$command->reset();

		foreach($rows as $id_user)
		{
			$array_id.=$id_user["id_user"].',';
		}

		$array_id = rtrim($array_id, ",");


		$firstRowIndex = $curPage * $rowsPerPage - $rowsPerPage;
		//получаем список из базы
		$sql='SELECT o.`id_object`, ow.`name_owner`,ow.`number`,ct.`name_city`, st.`name_street`, o.`house_number`,b.`name_building`, cat.`name_category` , o.`room_count` , p.`name_planning` , o.`floor`,o.`number_of_floor` , o.`space`,r.`name_renovation` ,w.`name_window` , c.`name_counter`,s.`name_sell_out_status`, t.`name_time_status` , o.`price` , o.`market_price`,o.`id_user`,u.`name`,o.`comment`, o.`date` FROM `objects` o LEFT JOIN `objects_owners` ow ON o.`id_owner`= ow.`id_owner` LEFT JOIN `objects_street` st ON o.`id_street`= st.`id_street` LEFT JOIN `geo_city` ct ON o.`id_city`= ct.`id_city` LEFT JOIN `objects_building` b ON o.`id_building`= b.`id_building` LEFT JOIN `objects_category` cat ON o.`id_category`= cat.`id_category` LEFT JOIN `objects_planning` p ON  o.`id_planning`= p.`id_planning` LEFT JOIN `objects_renovation` r ON o.`id_renovation`=r.`id_renovation` LEFT JOIN `objects_window` w ON o.`id_window`=w.`id_window` LEFT JOIN `objects_counter` c ON o.`id_counter`= c.`id_counter` LEFT JOIN `objects_sell_out_status` s ON o.`id_sell_out_status`=s.`id_sell_out_status` LEFT JOIN `objects_time_status` t ON  o.`id_time_status`= t.`id_time_status` LEFT JOIN `users` u ON o.`id_user`= u.`id_user` WHERE (o.`id_sell_out_status`=1 OR o.`id_sell_out_status`=4) '.$qWhere.' ORDER BY FIELD( o.`id_user` ,'.$array_id.'), '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage;
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();
		//сохраняем номер текущей страницы, общее количество страниц и общее количество записей
		$response = new stdClass();
		$response->page = $curPage;
		$response->total = ceil($totalRows / $rowsPerPage);
		$response->records = $totalRows;

	  	$filename = "Данные об объектах " . date('Y-m-d') . ".xls";

		header("Content-Disposition: attachment; filename=\"$filename\"");
		header("Content-Type: application/vnd.ms-excel");
		echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd"><html xmlns="http://www.w3.org/1999/xhtml"><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8" /></head>';
		 echo '<table width="1000" border="1">
				  <tr>
					<td>№</td>
					<td>Собственник</td>
					<td>Телефон</td>
					<td>Город</td>
					<td>Улица</td>
					<td>№ дома</td>
					<td>Тип здания</td>
					<td>Категория</td>
					<td>Кол-во комнат</td>
					<td>Планировка</td>
					<td>Этаж</td>
					<td>Этажность</td>
					<td>Площадь, м. кв.</td>
					<td>Статус</td>
					<td>Статус по времени</td>
					<td>Цена</td>
					<td>Цена с комиссией</td>
					<td>Менеджер</td>
					<td>Ремонт</td>
					<td>Окна</td>
					<td>Счетчики</td>
					<td>Комментарий</td>
					<td>Дата</td>
				 </tr>';
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
			echo  '<tr>
					<td>'.$row['id_object'].'</td>
					<td>'.$row['name_owner'].'</td>
					<td>'.$number.'</td>
					<td>'.$row['name_city'].'</td>
					<td>'.$row['name_street'].'</td>
					<td>'.$row['house_number'].'</td>
					<td>'.$row['name_building'].'</td>
					<td>'.$row['name_category'].'</td>
					<td>'.$row['room_count'].'</td>
					<td>'.$row['name_planning'].'</td>
					<td>'.$row['floor'].'</td>
					<td>'.$row['number_of_floor'].'</td>
					<td>'.$row['space'].'</td>
					<td>'.$row['name_sell_out_status'].'</td>
					<td>'.$row['name_time_status'].'</td>
					<td>'.$row['price'].'</td>
					<td>'.$row['market_price'].'</td>
					<td>'.$row['name'].'</td>
					<td>'.$row['name_renovation'].'</td>
					<td>'.$row['name_window'].'</td>
					<td>'.$row['name_counter'].'</td>
					<td>'.$row['comment'].'</td>
					<td>'.$row['date'].'</td>
				  </tr>';
		}
		echo '</table>';
	}
	public function userClients($arguments)
	{
		$connection=Yii::app()->db;

		$journal = new EventJournaling;
		$journal->userDataExport(Yii::app()->user->getId());

		$curPage = $arguments['page'];
		$rowsPerPage = $arguments['rows'];
		$sortingField = $arguments['sidx'];
		$sortingOrder = $arguments['sord'];
		$array_id = '';

		$qWhere = '';
		//определяем команду (поиск или просто запрос на вывод данных)
		//если поиск, конструируем WHERE часть запроса


		if (isset($arguments['_search']) && $arguments['_search'] == 'true') {
			$allowedFields = array('clname','name','id_city','name_city','number','id_category','id_planning','id_floor_status','price', 'id_time_status','id_status','date');
			$allowedOperations = array('AND', 'OR');

			$searchData = json_decode($arguments['filters']);

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

					$field='c.'.$rule->field;

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

		$sql='SELECT COUNT(*) AS count FROM `clients` c LEFT JOIN `objects_planning` p ON c.`id_planning` = p.`id_planning` LEFT JOIN `clients_status` s ON c.`id_status` = s.`id_status` LEFT JOIN `objects_category` cat ON c.`id_category` = cat.`id_category` LEFT JOIN `geo_city` ct ON c.`id_city`= ct.`id_city` LEFT JOIN `clients_floor_status` f ON c.`id_floor_status` = f.`id_floor_status` LEFT JOIN `clients_time_status` t ON c.`id_time_status` = t.`id_time_status` LEFT JOIN `users` u ON c.`id_user`= u.`id_user` WHERE c.`id_status`=1 '.$qWhere;
		$command=$connection->createCommand($sql);
		$totalRows = $command->queryScalar();

		$command->reset();

		$sql='SELECT `id_user` FROM `users` WHERE `id_user`<>:id_user AND `id_right`=:id_right';
		$command=$connection->createCommand($sql);
		$command->bindParam(':id_user',Yii::app()->user->getId(),PDO::PARAM_STR);
		$command->bindValue(':id_right','user',PDO::PARAM_STR);
		$rows=$command->queryAll();

		$command->reset();

		foreach($rows as $id_user)
		{
			$array_id.=$id_user["id_user"].',';
		}

		$array_id = rtrim($array_id, ",");

		$firstRowIndex = $curPage * $rowsPerPage - $rowsPerPage;

		$sql='SELECT c.`id_client` , c.`name` as clname, c.`number`, c.`id_city`,ct.`name_city`, cat.`name_category` , p.`name_planning`,f.`name_floor_status`,t.`name_time_status`, c.`price` , s.`name_status`,c.`id_user`,u.`name`, c.`date` FROM `clients` c LEFT JOIN `objects_planning` p ON c.`id_planning` = p.`id_planning` LEFT JOIN `clients_status` s ON c.`id_status` = s.`id_status` LEFT JOIN `objects_category` cat ON c.`id_category` = cat.`id_category` LEFT JOIN `geo_city` ct ON c.`id_city`= ct.`id_city` LEFT JOIN `clients_floor_status` f ON c.`id_floor_status` = f.`id_floor_status` LEFT JOIN `clients_time_status` t ON c.`id_time_status` = t.`id_time_status` LEFT JOIN `users` u ON c.`id_user`= u.`id_user` WHERE c.`id_status` =1 '.$qWhere.' ORDER BY FIELD( c.`id_user` ,'.$array_id.'), '.$sortingField.' '.$sortingOrder.' LIMIT '.$firstRowIndex.', '.$rowsPerPage;
		$command=$connection->createCommand($sql);
		$rows=$command->queryAll();

		//сохраняем номер текущей страницы, общее количество страниц и общее количество записей
		$response = new stdClass();
		$response->page = $curPage;
		$response->total = ceil($totalRows / $rowsPerPage);
		$response->records = $totalRows;

	    $filename = "Данные о покупателях " . date('Y-m-d') . ".xls";

		header("Content-Disposition: attachment; filename=\"$filename\"");
		header("Content-Type: application/vnd.ms-excel");
		echo '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
		<html xmlns="http://www.w3.org/1999/xhtml">
		<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
		</head>';
		 echo '<table width="800" border="1">
				  <tr>
					<td>№</td>
					<td>Покупатель</td>
					<td>Телефон</td>
					<td>Город</td>
					<td>Категория</td>
					<td>Планировка</td>
					<td>Этажность</td>
					<td>Цена</td>
					<td>Статус по времени</td>
					<td>Статус</td>
					<td>Менеджер</td>
					<td>Дата</td>
				 </tr>';
	  	foreach($rows as $row)
		{
			if ($row['id_user']==Yii::app()->user->getId())
			{
				$number=$row['number'];

			}
			else
			{
				$number="[скрыт]";
			}

			echo  '<tr>
					<td>'.$row['id_client'].'</td>
					<td>'.$row['clname'].'</td>
					<td>'.$number.'</td>
					<td>'.$row['name_city'].'</td>
					<td>'.$row['name_category'].'</td>
					<td>'.$row['name_planning'].'</td>
					<td>'.$row['name_floor_status'].'</td>
					<td>'.$row['price'].'</td>
					<td>'.$row['name_time_status'].'</td>
					<td>'.$row['name_status'].'</td>
					<td>'.$row['name'].'</td>
					<td>'.$row['date'].'</td>
				  </tr>';
	 	}
	 	echo '</table>';
	}
}