<div class="login">
	<div class="header">
    	<a class="logo" href="#"></a>
    </div>
	<div class="login-wrapper">
    <div class="content">
    	<form id="enter-form">
        	<h3 class="form-title">Вход</h3>
            <div class="control-group">
               	<div class="controls">
                    <div class="input-icon left">
                        <i class="icon-user"></i>
                        <input class="input" type="text" placeholder="Логин" name="login" value="" required="required" maxlength="15" pattern="^[a-zA-Z0-9]+$"/>
                    </div>
                </div>
            </div>
            <div class="control-group">
            	<div class="controls">
                	<div class="input-icon left">
                        <i class="icon-lock"></i>
                        <input class="input" type="password" placeholder="Пароль" name="password" value="" required="required" maxlength="15" pattern="^[a-zA-Z0-9]+$"/>
                    </div>
                </div>
            </div>
            <div class="form-actions">
                <label class="checkbox">
                    <div class="checker">
                           <input type="checkbox" name="remeberMe" value="1"/>
                    </div>
                     Запомнить меня
                </label>
                <button type="submit" class="btn">
                    <i class="enter-preloader"></i>
                    <div id="execute">Выполняется</div>
                    <div id="entering">Войти</div>
                    <i class="icon-white"></i>
                </button>
            </div>
            <?php echo CHtml::hiddenField(Yii::app()->getRequest()->csrfTokenName, Yii::app()->getRequest()->getCsrfToken()); ?>
        </form>
    </div>
    <div class="display-error">
    	<button class="close-button">×</button>
        <div class="message"></div>
    </div>
    </div>
    <footer><div class="text-box">REALTY | Риелторcкая информационная система &copy; Кузнецов Максим <?php echo date('Y'); ?></div></footer>
</div>