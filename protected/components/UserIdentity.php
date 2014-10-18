<?php

/**
 * UserIdentity represents the data needed to identity a user.
 * It contains the authentication method that checks if the provided
 * data can identity the user.
 */
class UserIdentity extends CUserIdentity
{
	/**
	 * Authenticates a user.
	 * The example implementation makes sure if the username and password
	 * are both 'demo'.
	 * In practical applications, this should be changed to authenticate
	 * against some persistent user identity storage (e.g. database).
	 * @return boolean whether authentication succeeds.
	 */
	private $_id;
	
    public function authenticate()
    {
         // Есть ли указанный пользователь в базе данных
         $record=User::model()->findByAttributes(array('login'=>$this->username,'active'=>1));
         if($record===null)
             // Если нету - сохраняем в errorCode ошибку.
             $this->errorCode=self::ERROR_USERNAME_INVALID;
         else if(!CPasswordHelper::verifyPassword($this->password,$record->password))
             // Проверяем совпадает ли введенный пароль с тем что у нас в базе
             // Если не совпадает - сохраняем в errorCode ошибку.
             $this->errorCode=self::ERROR_PASSWORD_INVALID;
         else
         {
             // Если все действий выше успешно пройдены - значит
             // пользователь действительно существует и пароль был
             // указан верно. 
             $this->_id=$record->id_user;
			 $this->setState('right', $record->id_right);
			 $this->setState('login', $record->login);

			 $date=date('Y-m-d G:i:s', strtotime("+2 hours", strtotime(date('Y-m-d G:i:s'))));
			/* private $query = 'UPDATE `users` SET `browser`=?,`online`=?,`time_activity`=NOW()+INTERVAL 2 HOUR WHERE `id_user`=?';*/
			 $update = User::model()->updateAll(array('browser'=>$_SERVER['HTTP_USER_AGENT'],'online'=>'online','time_activity'=>$date),'id_user=:id_user',array(':id_user'=>$this->_id));
			 
			 $journal = new EventJournaling;
			 $journal->userEntering($this->_id);
			 
             // В errorCode сохраняем что ошибок нет
             $this->errorCode=self::ERROR_NONE;
         }
         return !$this->errorCode;
     }
	   
     public function getId()
     {
         return $this->_id;
     }
}