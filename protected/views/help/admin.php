<div class="page-content">
    <div class="nav-page-content">
        <ul class="sidebar-menu">
            <li>
                <a href="#about" class="header"><i class="icon icon-common"></i>Общие сведения</a>
                <ul class="sub-menu">
                    <li><a href="#limits">Ограничения</a></li>
                    <li><a href="#options">Базовые возможности</a></li>
                </ul>
            </li>
            <li>
                <a href="#manipulate"><i class="icon icon-edit"></i>Работа с данными</a>
                <ul class="sub-menu">
                    <li><a href="#add">Добавление данных</a></li>
                    <li><a href="#edit">Редактирование данных</a></li>
                    <li><a href="#fastedit">Быстрое редактирование</a></li>
                    <li><a href="#subedit">Редактирование в подтаблицах</a></li>
                </ul>
            </li>
            <li>
                <a href="#search"><i class="icon icon-search"></i>Поиск</a>
                <ul class="sub-menu">
                    <li><a href="#multisearch">Мультипоиск</a></li>
                    <li><a href="#filter">Фильтры</a></li>
                </ul>
            </li>
            <li>
                <a href="#export"><i class="icon icon-excel"></i>Экспорт данных</a>
                <ul class="sub-menu">
                    <li><a href="#excel">В Excel</a></li>
                    <li><a href="#charts">Экспорт графиков</a></li>
                </ul>
            </li>
        </ul>
    </div>
    <div class="help-page-content">
        <div class="title">
            <h1>Общие сведения</h1>
            <span class="anchor-target" id="about"></span>
            <a class="title" href="#about"></a>
        </div>
        <div class="content">
            <span class="anchor-target" id="limits"></span>
            <h2>Ограничения</h2>
            <p>Для корректной работы сайта лучше всего использовать последние версии браузеров: <b>Opera</b>, <b>Google Chrome</b>, <b>Mozilla Firefox</b>.</p>
            <span class="anchor-target" id="options"></span>
            <h2>Базовые возможности</h2>
            <p>Информация, полученная из базы данных, представляется в виде таблиц, что дает возможность легче воспринимать и работать с информацией. Одна из них это <em>сортировка данных</em> в прямом и обратном алфавитном порядке. Для этого выберите поле, по которому нужно отсортировать, и нажмите на его шапку и появится иконка <button class="keyboard"><span class="ui-icon ui-icon-triangle-2-n-s"/></button>, например, отсортировать улицы в порядке убывания:</p>
            <img src="/img/sort.png" width="90%" align="middle">
            <p>Информация не загружается полностью, она разделена на страницы по 20 записей, для их перелистывания существует <em>панель навигации</em>, где вы можете листать в начало <button class="keyboard"><span class="ui-icon ui-icon-seek-first"/></button>, в конец <button class="keyboard"><span class="ui-icon ui-icon-seek-end"/></button>, на следующую <button class="keyboard"><span class="ui-icon ui-icon-seek-next"/></button> и на предыдущую <button class="keyboard"><span class="ui-icon ui-icon-seek-prev"/></button> страницу. Так же можно вписать в поле определённую страницу, и по нажатию на клавишу <button class="keyboard">Enter</button> перейти на эту страницу. Справа в панели навигации присутствует информация о количестве записей на странице и их общем количестве.</p>
            <img src="/img/nav.png" width="90%" align="middle">
            <p>Слева на панели навигации есть <em>панель управления</em>, где находятся все основные кнопки для манипуляции с данными.</p>
            <blockquote>
                <p>Вернуть таблицу в первоначальное состояние после сортировки или поиска можно при помощи кнопки <button class="keyboard"><span class="ui-icon ui-icon-refresh"/></button>, после чего таблица обновится.</p>
            </blockquote>
            <p>В некоторых таблицах у записей могут присутствовать свои подтаблицы, увидеть их можно нажав на кнопку <button class="keyboard"><span class="ui-icon ui-icon-plus"/></button>, а закрыть, нажав на <button class="keyboard"><span class="ui-icon ui-icon-minus"/></button>.</p>
            <img src="/img/sub.png" width="70%" align="middle">
        </div>
        <div class="title">
            <h1>Работа с данными</h1>
            <span class="anchor-target" id="manipulate"></span>
            <a class="title" href="#manipulate"></a>
        </div>
        <div class="content">
            <span class="anchor-target" id="add"></span>
            <h2>Добавление данных</h2>
            <p>Нажав на кнопку, <button class="keyboard"><span class="ui-icon ui-icon-plus"/></button> перед вами появится диалоговое окно, где вы сможете добавить запись. При активности поля для заполнения, справа от него появляется подсказка, где представлен правильный формат данных для этого поля. Закончив ввод данных, нажмите <button class="keyboard">Сохранить</button>.</p>
            <img src="/img/add.png" width="50%" align="middle">
            <blockquote>
                <p>Если в списке нет подходящих значений выберите <em>"не выбрано"</em>. Это особенно важно для таблицы <em>"Покупатели"</em>, если там выбрать в полях значение <em>"не выбрано"</em>, то поиск двойным нажатием будет производится по всем доступным значениям. Заполняйте поля как указано, от этого зависит корректная работа системы.</p>
            </blockquote>
            <span class="anchor-target" id="edit"></span>
            <h2>Редактирование данных</h2>
            <p>Для редактирования записи нужно её выделить, нажав левой кнопкой мыши на ней. При этом запись будет выделена и помечена галочкой.</p>
            <img src="/img/select.png" width="95%" align="middle">
            <p>После этого, нажав на кнопку <button class="keyboard"><span class="ui-icon ui-icon-pencil"/></button>, перед вами появится диалоговое окно, где вы сможете редактировать запись. Закончив редактирование данных, нажмите <button class="keyboard">Сохранить</button>.</p>
            <img src="/img/edit.png" width="30%" align="middle">
            <span class="anchor-target" id="fastedit"></span>
            <h2>Быстрое редактирование</h2>
            <p>Для быстрого редактирования записи существуют специальные поля на панели управления, для этого так же нужно выделить запись, нажав левой кнопкой мыши на ней. При этом запись будет выделена и помечена галочкой. После этого выбрать вариант из списка и нажать на него, в этот момент запись будет изменена.</p>
            <img src="/img/fastedit.png" width="40%" align="middle">
            <blockquote>
                <p>Есть возможность редактировать сразу несколько записей, перед этим выделив их.</p>
            </blockquote>
            <span class="anchor-target" id="subedit"></span>
            <h2>Редактирование в подтаблицах</h2>
            <p>Для этого нужно один раз нажать на записи левой клавишей мыши, после чего она будет доступна для редактирования. Для сохранения отредактированной записи нажмите на клавишу <button class="keyboard">Enter</button>, а для выхода из режима редактирования без сохранения нажмите на клавишу <button class="keyboard">Esc</button>.</p>
        </div>
        <div class="title">
            <h1>Поиск</h1>
            <span class="anchor-target" id="search"></span>
            <a class="title" href="#search"></a>
        </div>
        <div class="content">
            <span class="anchor-target" id="multisearch"></span>
            <h2>Мультипоиск</h2>
            <p>Нажав на кнопку, <button class="keyboard"><span class="ui-icon ui-icon-search"/></button> перед вами появится диалоговое окно, где вы сможете осуществить поиск. Можно выбрать поле и условие для поиска, также добавить ещё дополнительные поля для поиск с помощью кнопки <button class="keyboard"> + </button>.Так же существует два режима поиска <em>"И"</em> и <em>"ИЛИ"</em>. Закончив ввод условий нажмите <button class="keyboard">Найти</button>.</p>
            <img src="/img/search.png" width="40%" align="middle">
            <p>Режим "И" является стандартным режимом, предназначен для поиска по нескольким полям, но есть ограничение - поля не должны повторятся.</p>
            <img src="/img/searchand.png" width="40%" align="middle">
            <p>Режим "ИЛИ" как раз предназначен для поиска по нескольким одинаковым полям.</p>
            <img src="/img/searchor.png" width="40%" align="middle">
            <span class="anchor-target" id="filter"></span>
            <h2>Фильтры</h2>
            <p>Для быстрого поиска существуют фильтры, расположены они в шапке таблиц. При нажатии на них активизируется поиск по полям, для которых они предназначены.</p>
            <img src="/img/filter.png" width="40%" align="middle">
            <blockquote>
                <p>Для быстрого поиска объектов, подходящих покупателю, вы можете в таблице <em>"Покупатели"</em> двойным нажатием левой клавишей мыши по его записи вывести варианты объектов, которые будут показаны в таблице <em>"Объекты недвижимости"</em>. Если варианты неудовлетворительны, то нажмите на кнопку <button class="keyboard"><span class="ui-icon ui-icon-search"/></button>, где уже будут подготовлены поля для дальнейшего поиска.</p>
            </blockquote>
        </div>
        <div class="title">
            <h1>Экспорт данных</h1>
            <span class="anchor-target" id="export"></span>
            <a class="title" href="#export"></a>
        </div>
        <div class="content">
            <span class="anchor-target" id="excel"></span>
            <h2>В Excel</h2>
            <p>Для экспорта данных представленных в таблице нажмите на кнопку <button class="keyboard"><span class="ui-icon ui-icon-document"/></button> на панели управления. И после этого в зависимости от браузера вам предложат скачать файл, где будут находиться экспортированные данные.</p>
            <blockquote>
                <p>В файл данные будут экспортироваться постранично, то есть, так как вы видели их в таблице. Если данные находятся на нескольких страницах, тогда переходите на каждую страницу и делайте экспорт.</p>
            </blockquote>
        </div>
        <div class="content">
            <span class="anchor-target" id="charts"></span>
            <h2>Экспорт графиков</h2>
            <p>Для экспорта графиков, нужно нажать на правую кнопку мыши на нужном вам графике и вызвать контекстное меню, где в зависимости от браузера, выбрать пункт "Сохранить картинку как...".</p>
            <img src="/img/charts.png" width="40%" align="middle">
            <p>И начнется загрузка графика в виде картинки.</p>
        </div>
    </div>
</div>