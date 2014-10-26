<div class="page-content">
    <div class="stat-container">
        <div class="caption"><i class="icon line-chart"></i>Динамика продаж объектов по категориям за весь год</div>
        <div class="canvas-holder" id="year-sells-objects-canvas-wrapper">
            <canvas id="year-sells-objects"></canvas>
        </div>
        <div class="legend-warapper">
            <div id="legend-year-sells-objects"></div>
            <div class="stat-control">
                <label>Год: 
                    <select id="change-year-sells-objects" class="year">
                    </select>
                </label>
            </div>
        </div>
    </div>
        <div class="stat-container">
        	<div class="caption"><i class="icon bar-chart"></i>Кол-во продаж объектов по категориям</div>
            <div class="canvas-holder-pie">
                <h4>За весь год</h4>
                <div id="year-sells-objects-pie-canvas-wrapper">
                    <canvas  id="year-sells-objects-pie"></canvas>
                </div>
                <div class="stat-control">
                    <label>Год: 
                        <select id="change-year-sells-objects-pie" class="year">
                        </select>
                    </label>
                </div>
            </div>
            <div class="canvas-holder-pie">
                <h4>За месяц</h4>
                <div id="month-sells-objects-pie-canvas-wrapper">
                    <canvas  id="month-sells-objects-pie"></canvas>
                </div>
                <div class="stat-control">
                    <label>Месяц: 
                        <select id="change-month-sells-objects-pie" class="month">
                            <option value="1">Январь</option>
                            <option value="2">Февраль</option>
                            <option value="3">Март</option>
                            <option value="4">Апрель</option>
                            <option value="5">Май</option>
                            <option value="6">Июнь</option>
                            <option value="7">Июль</option>
                            <option value="8">Август</option>
                            <option value="9">Сентябрь</option>
                            <option value="10">Октябрь</option>
                            <option value="11">Ноябрь</option>
                            <option value="12">Декабрь</option>
                        </select>
                    </label>
                </div>
            </div>
            <div class="legend-warapper">
                <div id="legend-sells-objects-pie"></div>
            </div>
        </div>
        <div class="stat-container">
            <div class="caption"><i class="icon area-chart"></i>Динамика цен объектов по категориям</div>
        	<div class="canvas-holder" id="year-price-objects-canvas-wrapper">
                <canvas id="year-price-objects"></canvas>
            </div>
            <div class="legend-warapper">
                <div id="legend-year-price-objects"></div>
                <div class="stat-control">
                    <label>Год: 
                        <select id="change-year-price-objects" class="year">
                        </select>
                    </label>
                </div>
            </div>
        </div>
        <div class="stat-container">
            <div class="caption"><i class="icon area-chart"></i>Статистика системы</div>
                <div class="table-wrapper">
                    <h4>Всего записей в БД</h4>
                    <table>
                        <tbody>
                            <tr><td>Объекы недвижимости</td><td></td></tr>
                            <tr><td>Всего</td><td>23</td></tr>
                            <tr><td>В продаже</td><td>332</td></tr>
                            <tr><td>Продано</td><td>323</td></tr>
                            <tr><td>Снято с продажи</td><td>233</td></tr>
                            <tr><td>Покупателей</td><td></td></tr>
                            <tr><td>Всего</td><td>323</td></tr>
                            <tr><td>Активных</td><td>33</td></tr>
                            <tr><td>Не активных</td><td>23</td></tr>
                            <tr><td>Пользователей</td><td></td></tr>
                            <tr><td>Всего</td><td>343</td></tr>
                            <tr><td>Активных</td><td>34</td></tr>
                            <tr><td>Не активных</td><td>3443</td></td>
                        </tbody>
                    </table>
                </div>
                <div class="table-wrapper">
                    <h4>Активность пользователей</h4>
                    <table>
                        <tbody>
                            <tr><td>Записей в день</td><td></td></tr>
                            <tr><td>Объекты:</td><td>344</td></tr>
                            <tr><td>Покупатели:</td><td>234</td></tr>
                            <tr><td>Продажи</td><td></td></tr>
                            <tr><td>В неделю:</td><td>3434</td></tr>
                            <tr><td>За месяц:</td><td>344</td></tr>
                            <tr><td>В год:</td><td>242</td></tr>
                            <tr><td></td><td></td></tr>
                        </tbody>
                    </table>
                </div>
                <div class="canvas-holder-pie">
                    <h4>Динамика роста БД</h4>
                    <div id="year-sells-objects-pie-canvas-wrapper1">
                        <canvas  id="year-sells-objects-pie1"></canvas>
                    </div>
                    <div class="stat-control">
                        <label>Год: 
                            <select id="change-year-sells-objects-pie1" class="year">
                            </select>
                        </label>
                    </div>
                </div>
            </div>
        </div>      
	</div>