<?php
class User extends CActiveRecord
{
	public $rememberMe;
	            
    public static function model($className=__CLASS__)
    {
        return parent::model($className);
    }
	
    public function tableName()
    {
        return 'users';
    }
	public function rules()
    {
         return array(
		 	
            array('login, password', 'length', 'max'=>20, 'min' => 6),
            // логин, пароль не должны быть пустыми
            array('login, password', 'required'),
   
            array('password', 'authenticate', 'on' => 'login'),
            array('login', 'match', 'pattern' => '/^[A-Za-z0-9\s,]+$/u','message' => 'Логин содержит недопустимые символы.'),
			array('password', 'match', 'pattern' => '/^[A-Za-z0-9\s,]+$/u','message' => 'Пароль содержит недопустимые символы.')
       );
    }
	public function authenticate($attribute,$params) 
    {
        // Проверяем были ли ошибки в других правилах валидации.
        // если были - нет смысла выполнять проверку
        if(!$this->hasErrors())
        {
            // Создаем экземпляр класса UserIdentity
            // и передаем в его конструктор введенный пользователем логин и пароль (с формы)
            $identity= new UserIdentity($this->login, $this->password);
			
			$identity->authenticate();
             // Выполняем метод authenticate (о котором мы с вами говорили пару абзацев назад)
            // Он у нас проверяет существует ли такой пользователь и возвращает ошибку (если она есть)
            // в $identity->errorCode
      
                // Теперь мы проверяем есть ли ошибка..    
                switch($identity->errorCode)
                {
                    // Если ошибки нету...
                     case UserIdentity::ERROR_NONE: {
                        // Данная строчка говорит что надо выдать пользователю
                        // соответствующие куки о том что он зарегистрирован, срок действий
                         // у которых указан вторым параметром.
						$duration=$this->rememberMe ? 3600*24*7 : 0; 
                        Yii::app()->user->login($identity, $duration);
                        break;
                    }
                    case UserIdentity::ERROR_USERNAME_INVALID: {
                         // Если логин был указан наверно - создаем ошибку
                        $this->addError('login','Такого пользователя не существует!');
                        break;
                    }
                     case UserIdentity::ERROR_PASSWORD_INVALID: {
                        // Если пароль был указан наверно - создаем ошибку
                        $this->addError('password','Вы указали неверный пароль!');
                         break;
                    }
                }
        }
    }
}