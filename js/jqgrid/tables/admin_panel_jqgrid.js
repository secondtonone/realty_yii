$(document).ready(function(){
	
	function getList()
	{	
		var lists = $.ajax({
					type: "POST",
					url: "/app/scripts/lists/user_lists.php",
					data: "q=1",
					async: false
				}).responseText,
			list = JSON.parse(lists);
		return list;
	}
	
	function getNotification()
	{	
		return $.ajax({
					type: "POST",
					url: "/app/scripts/lists/notes.php",
					data: "q=1",
					async: false
				}).responseText;
	}
	function getStreet(e) {
		  $(e).autocomplete({
          source: function(request, response) {
				$.ajax({
					url: "/app/scripts/lists/autocomplete.php?q=street",
					dataType: "json",
					data: {
						term : request.term,
						id_city : $("input#id_city").val()
					},
					success: function(data) {
						response(data);
					}
				});
			},
          minLength: 1,
          focus: function (event, ui) {
            $(e).val(ui.item.label);
			return false;
          },
          select: function (event, ui) {
            $(e).val(ui.item.label);
            $("input#id_street").val(ui.item.value);
			return false;
          }
        });
	}
	function getCity(e) {
        $(e).autocomplete({
          source: "/app/scripts/lists/autocomplete.php?q=city",
          minLength: 1,
          focus: function (event, ui) {
            $(e).val(ui.item.label);
			return false;
          },
          select: function (event, ui) {
            $(e).val(ui.item.label);
            $("input#id_city").val(ui.item.value);
			return false;
          }
        });
	}
	function stikyGenerate()
	{
		var notes=getNotification(),
		    note=JSON.parse(notes);
		
		if(note.total=='0')
		{
			return false;
		}
		else
		{
			for (var i=0; i<note.total; i++) 
			{
				$.sticky(note.rows[i].text);
			}
		}
	}
	function initMap(object) {
		var myMap = new ymaps.Map('yandexmap', {
				center: [55.753994, 37.622093],
				zoom: 25
			});
							
		ymaps.geocode(object, {results: 1 }).then(function (res) {
										
		var firstGeoObject = res.geoObjects.get(0),
			coords = firstGeoObject.geometry.getCoordinates(),
			bounds = firstGeoObject.properties.get('boundedBy');
			myMap.geoObjects.add(firstGeoObject);
			myMap.setBounds(bounds, {
			checkZoomRange: true 
			});
		});
	}
	function showErrorDialog(str)
	{	
		$(document.body).append('<div id="dialog-message" title="Внимание!"><div style="padding: 10px;margin-top:15px;" class="ui-state-error ui-corner-all"><span class="ui-icon  ui-icon-alert" style="float:left; margin:0 7px 50px 0;"></span>'+str+'</div></div>');
		$( "#dialog-message" ).dialog({
  			close: function( event, ui ) {
				$("#dialog-message").empty();
				$("#dialog-message").remove();
			}
		});
		setTimeout(function () {
					$("#dialog-message").empty();
					$("#dialog-message").remove();
				}, 7000);
		return false;
	}

	stikyGenerate();
	
	var selectList=getList(),
		selectСategory={value:selectList.rows.category,sopt:['eq']},
		selectBuilding={value:selectList.rows.building,sopt:['eq']},
		selectPlanning={value:selectList.rows.planning,sopt:['eq']},
		selectSellOutStatus={value:selectList.rows.sellstatus,sopt:['eq']},
		selectTimeStatus={value:selectList.rows.timestatus,sopt:['eq']},
		selectDistrict={value:selectList.rows.district,sopt:['eq']},
		selectFloor={value:selectList.rows.floor,sopt:['eq'],searchhidden: true},
		selectRenovation={value:selectList.rows.renovation,sopt:['eq'],searchhidden: true},
		selectWindow={value:selectList.rows.window,sopt:['eq'],searchhidden: true},
		selectCounter={value:selectList.rows.counter,sopt:['eq'],searchhidden: true};
		
	$(".preloader").hide();
	
$("#objects").jqGrid({
            url:"/app/scripts/jqgrid/admin_getdata.php?q=1",
            datatype: 'json',
            mtype: 'POST',
            colNames:['#','','Собственник','Телефон','Город','Город','Улица','Улица','№ дома','Тип здания','Категория','Кол-во комнат','Планировка','Этаж','Этажность','Тип этажности','Площадь, м. кв.','Статус','Статус по времени','Цена','Цена с комиссией','ID Менеджера','Менеджер','Дата','','Ремонт','Окна','Счетчики'],
            colModel :[
                {name:'id_object', index:'id_object', width:45, align:'left',editable: false,edittype: "text",search:false},
				{name: "id_owner",index: "id_owner",editable: true,edittype: "text",hidden:true},
				{name:'name_owner', index:'name_owner', width:150, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn']},editrules:{required:true},editoptions: {maxlength: 150}},
				{name:'number', index:'number', width:140, align:'center', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn']},editrules:{required:true,integer:true},editoptions: {maxlength: 11}},
				{name: 'id_city',index: 'id_city',editable: true,edittype: "text",hidden:true,editrules:{required:true}},
				{name:'name_city', index:'name_city', width:200, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn']}, editoptions:{size: 20,dataInit: getCity}},
				{name: "id_street",index: "id_street",editable: true,edittype: "text",hidden:true,editrules:{required:true}},
				{name:'name_street', index:'name_street', width:200, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn']}, editoptions:{size: 20,
      dataInit: getStreet}},
				{name:'house_number', index:'house_number', width:70, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn']},editrules:{required:true},editoptions: {maxlength: 8}},
				{name: 'id_building',index: 'id_building',editable: true,width:150, align:'left',edittype:"select",formatter:"select",editoptions:selectBuilding,stype:"select",searchoptions:selectBuilding,editrules:{required:true}},
				{name: 'id_category',index: 'id_category',editable: true,width:150, align:'left',edittype:"select",formatter:"select",editoptions:selectСategory,stype:"select",searchoptions:selectСategory,editrules:{required:true}},
				{name:'room_count', index:'room_count', width:90, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn'],clearSearch:true},editrules:{required:true,integer:true},editoptions: {maxlength: 2}},
				{name:'id_planning', index:'id_planning',editable: true,width:150, align:'left',edittype:"select",formatter:"select",editoptions:selectPlanning,stype:"select",searchoptions:selectPlanning,editrules:{required:true}},
				{name:'floor', index:'floor', width:70, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['le','lt','gt','ge','bw','eq','ne']},editrules:{required:true,number:true},editoptions: {maxlength: 2}},
				{name:'number_of_floor', index:'number_of_floor', width:70, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['le','lt','gt','ge','bw','eq','ne']},editrules:{required:true,number:true},editoptions: {maxlength: 2}},
				{name:'id_floor_status', index:'id_floor_status',editable: false,hidden:true,edittype:"select",formatter:"select",editoptions:selectFloor,stype:"select",searchoptions:selectFloor},
				{name:'space', index:'space', width:90, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['le','lt','gt','ge','bw','eq','ne']},editrules:{required:true},editoptions: {maxlength: 7}},
				{name:'id_sell_out_status', index:'id_sell_out_status',editable: true,width:150, align:'left',edittype:"select",formatter:"select",editoptions:selectSellOutStatus,stype:"select",searchoptions:selectSellOutStatus},
				{name:'id_time_status', index:'id_time_status',editable: true,width:150, align:'left',edittype:"select",formatter:"select",editoptions:selectTimeStatus,stype:"select",searchoptions:selectTimeStatus},
				{name:'price', index:'price', width:110, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['le','lt','gt','ge','bw','eq','ne']},editrules:{required:true,number:true},editoptions: {maxlength: 10}},
				{name:'market_price', index:'market_price', width:110, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['le','lt','gt','ge','bw','eq','ne']},editrules:{required:true,number:true},editoptions: {maxlength: 10}},
				{name:'id_user', index:'id_user',editable: true,edittype: "text",hidden:true,searchoptions:{sopt:['eq'],searchhidden: true}},
				{name:'name', index:'name', width:150, align:'left', edittype:"text",editable:false,searchoptions:{sopt:['bw','eq','ne','cn']}},
				{name:'date', index:'date', width:220, align:'left', edittype:"text",editable:false,searchoptions:{sopt:['bw','eq','ne','cn']}},
				{name:'edit_enable', index:'edit_enable',editable: true,edittype: "text",hidden:true},
				{name:'id_renovation', index:'id_renovation',edittype:"select",formatter:"select",editable: true, editrules: { edithidden: true }, hidedlg: false,stype:"select",hidden:true,editoptions:selectRenovation,searchoptions:selectRenovation},
				{name:'id_window', index:'id_window',edittype:"select",formatter:"select",editable: true, editrules: { edithidden: true }, hidedlg: false,stype:"select",hidden:true,editoptions:selectWindow,searchoptions:selectWindow},
				{name:'id_counter', index:'id_counter',edittype:"select",formatter:"select",editable: true, editrules: { edithidden: true }, hidedlg: false,stype:"select",hidden:true,editoptions:selectCounter,searchoptions:selectCounter}
				],
            pager: '#pager',
			autowidth:true,
            height:378,
			rowNum:20,
            rowList:[20,50,100],
            sortname: 'id_object',
            sortorder: "desc",
            caption: '<i class="icon-table icon-object"></i>Объекты недвижимости',
			viewrecords: true,
			subGrid: true,
			multiselect: true,
			editurl: '/app/scripts/jqgrid/admin_modifydata.php?q=2',
			subGridRowExpanded: function(subgrid_id, row_id) {
			
				var lastSel,subgrid_table_id, pager_id, object
					rowData = $("#objects").jqGrid('getRowData',row_id),
					name_city = rowData.name_city,
					name_street = rowData.name_street,
					house_number = rowData.house_number;
					
				subgrid_table_id = subgrid_id+"_t";
				pager_id = "p_"+subgrid_table_id;
				
				object = name_city+', '+name_street+' '+house_number;
				
				$("#"+subgrid_id).html("<div class='subgridformobj'><table id='"+subgrid_table_id+"' class='scroll'></table></div><div id='yandexmap'></div>");
				
				initMap(object);
				
				$("#"+subgrid_table_id).jqGrid({
				url:"/app/scripts/jqgrid/user_getdata.php?q=3&id_object="+row_id,
				datatype: "json",
				mtype: 'GET',
				colNames: ['Ремонт','Окна','Счетчики','Дата изменения цены','',''],
				colModel: [
					{name:'id_renovation', index:'id_renovation',edittype:"select",formatter:"select",editable: true, width:100,editrules: selectRenovation, editoptions:selectRenovation},
					{name:'id_window', index:'id_window',edittype:"select",formatter:"select",editable: true, width:100,editrules:selectWindow, editoptions:selectWindow},
					{name:'id_counter', index:'id_counter',edittype:"select",formatter:"select",editable: true,width:100, editrules:selectCounter,editoptions:selectCounter},
					{name:'date_change', index:'date_change', width:150, align:'left', edittype:"text",editable:false,searchoptions:{sopt:['bw','eq','ne','cn']}},
					{name:'id_user', index:'id_user',editable: true,edittype: "text",hidden:true},
					{name:'edit_enable', index:'edit_enable',editable: true,edittype: "text",hidden:true}	
				],
				rowNum:20,
				sortname: 'id_renovation',
				sortorder: "asc",
				editurl: '/app/scripts/jqgrid/admin_modifydata.php?q=3&id_object='+row_id,
				onSelectRow: function(id) {
					
					var rowData = $(this).jqGrid('getRowData',id);
					
					if (id && id!==lastSel) {
						$("#"+subgrid_table_id).jqGrid('restoreRow',lastSel);
						
					
					
							$("#"+subgrid_table_id).jqGrid('editRow',id, true);
							lastSel = id;
		
						
					}
				},
				height: '100%'
				});			
		
			}
        }).navGrid('#pager',{edit:true,add:false,del:false,search:true},{width:380,reloadAfterSubmit:true,zIndex:99, beforeShowForm: function(form) { 
									$('#tr_id_renovation', form).hide();
									$('#tr_id_window', form).hide();
									$('#tr_id_counter', form).hide();
									
									$('#name_owner', form).attr({"title":"ФИО в формате: Иванов Иван Иванович"});
									$('#number', form).attr({"title":"Номер в формате: 89011123456 (только цифры)"}); 
									$('#name_city', form).attr({"title":"Введите первые буквы города, выберите из вариантов"});   
									$('#name_street', form).attr({"title":"Введите первые буквы улицы, выберите из вариантов"});
									$('#house_number', form).attr({"title":"Номер в формате: 34,7а,55/57"}); 
									
									$('#space', form).attr({"title":"Площадь в формате: 34, 34.5"}); 
									$('#price', form).attr({"title":"Цена в формате: 1000000 (только цифры без сокращений)"});
									$('#market_price', form).attr({"title":"Цена в формате: 1000000 (только цифры без сокращений)"});
			                      },
	afterSubmit: function (response) {
			if(response.responseText=="")
			{
				showErrorDialog('Вы не можите редактировать эту запись!');
				return false;
			}
			else
			{
				var myInfo = '<div class="ui-state-highlight ui-corner-all">'+
							 '<span class="ui-icon ui-icon-info" ' +
								 'style="float: left; margin-right: .3em;"></span>' +
							 response.responseText +
							 '</div>',
					$infoTr = $("#TblGrid_" + $.jgrid.jqID(this.id) + ">tbody>tr.tinfo"),
					$infoTd = $infoTr.children("td.topinfo");
				$infoTd.html(myInfo);
				$infoTr.show();
			
				setTimeout(function () {
					$infoTr.slideUp("slow");
				}, 3000);
				return [true, "", ""];
			}
			},},{width:380,reloadAfterSubmit:true,zIndex:99, beforeShowForm: function(form) { 
			$('#tr_id_renovation', form).show();
			$('#tr_id_window', form).show();
			$('#tr_id_counter', form).show(); 
			},afterSubmit: function (response) {
		
				var myInfo = '<div class="ui-state-highlight ui-corner-all">'+
							 '<span class="ui-icon ui-icon-info" ' +
								 'style="float: left; margin-right: .3em;"></span>' +
							 response.responseText +
							 '</div>',
					$infoTr = $("#TblGrid_" + $.jgrid.jqID(this.id) + ">tbody>tr.tinfo"),
					$infoTd = $infoTr.children("td.topinfo");
				$infoTd.html(myInfo);
				$infoTr.show();
			
				setTimeout(function () {
					$infoTr.slideUp("slow");
				}, 3000);
				return [true, "", ""];
			
			}},{width:380,reloadAfterSubmit:true,zIndex:99},{width:490,reloadAfterSubmit:true,multipleSearch:true,zIndex:99,closeAfterSearch:true},{width:380,reloadAfterSubmit:true,zIndex:99}).navSeparatorAdd("#pager",{sepclass:"ui-separator",sepcontent: ''}).navButtonAdd("#pager",{caption:"",buttonicon:"ui-icon-document", onClickButton:
	                         function () { 
          $("#objects").jqGrid('excelExport',{"url":"/app/scripts/jqgrid/admin_exportdata.php?q=1"});
       } , position: "last", title:"Экспорт в Excel", cursor: "pointer"}).navSeparatorAdd("#pager",{sepclass:"ui-separator",sepcontent: ''});
	   
	   $("#objects").jqGrid('gridResize', { minWidth: 1150,maxWidth: 1800});
	    
	   
$("#pager_left table.navtable tbody tr").append ('Передача объектов: <input id="id_user" type="hidden"/><input id="name_user" type="text" placeholder="Кому" name="user"/><button id="hand-over" title="Передать объекты другому менеджеру">Передать</button>');

$("#users").jqGrid({
            url:"/app/scripts/jqgrid/admin_getdata.php?q=2",
            datatype: 'json',
            mtype: 'POST',
            colNames:['#','Логин','Пароль','Пароль','Статус','Уровень прав','Пользователь','Телефон','Активность','Время последней активности'],
            colModel :[
                {name:'id_user', index:'id_user', width:35, align:'right',editable:false, search:false},
				{name:'login', index:'login', width:150, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn']},editrules:{required:true},editoptions:{maxlength: 15}},
				{name:'pass', index:'pass', width:150, align:'left', edittype:"text",editable:false,search:false},
				{name:'password', index:'password', width:150, align:'left', edittype:"text",editable:true,search:false,hidden:true,editoptions: {maxlength:15}},
				{name: "active",index: "active", width:100, align:'left',edittype:"select",formatter:"select",search:true,editoptions:{value:"1:Активен;2:Не активен"},editable:true,stype:"select", searchoptions:{value:"1:Активен;2:Не активен",sopt:['eq']}},
				{name:'id_right', index:'id_right', width:150, align:'left',edittype:"select",formatter:"select",search:true,editoptions:{value:"user:Пользователь;admin:Администратор"},editable:true,stype:"select", searchoptions:{value:"user:Пользователь;admin:Администратор",sopt:['eq']}},
				{name:'name', index:'name', width:190, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn']},editoptions: {maxlength: 150}},
				{name:'number', index:'number', width:150, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn']},editoptions: {maxlength: 11}},
				{name:'online', index:'online', width:100, align:'center',editable:false, search:false,searchoptions:{sopt:['bw','eq','ne','cn']},},
				{name:'time_activity', index:'time_activity', width:220, align:'left', edittype:"text",editable:false,searchoptions:{sopt:['bw','eq','ne','cn']}}		
				],
            pager: '#pager2',
			autowidth:true,
            height:328,
			rowNum:40,
            rowList:[40,60,100],
            sortname: 'id_user',
            sortorder: "asc",
			multiselect: true,
            caption: '<i class="icon-table icon-users"></i>Пользователи системы',
			viewrecords: true,
			editurl: '/app/scripts/jqgrid/admin_modifydata.php?q=1',
			subGrid: true,
			onSelectRow: function(id) {
				var rowData = $("#users").jqGrid('getRowData',id),
					id_user = rowData.id_user,
					name_user = rowData.name;
				
				$('#id_user_sub').val(id_user);
				$('#name_user_sub').val(name_user);
				$('#pager_left #id_user').val(id_user);
				$('#pager_left #name_user').val(name_user);

			},
			ondblClickRow: function (id){
				var mypostdata = $("#objects").jqGrid('getGridParam', 'postData');
					
				mypostdata.filters='{"groupOp":"AND","rules":[{"field":"id_user","op":"eq","data":"'+id+'"}]}';
				$("#objects").jqGrid('setGridParam', {postData: mypostdata, search:true});
				$("#objects").trigger("reloadGrid");
				},
			subGridRowExpanded: function(subgrid_id, row_id) {
			
				var lastSel,
					subgrid_table_id = subgrid_id+"_t",
					pager_id = "p_"+subgrid_table_id;
				
				$("#"+subgrid_id).html("<div class='subgridform'><table id='"+subgrid_table_id+"' class='scroll'></table><div id='"+pager_id+"' class='scroll'></div></div>");
				
				$("#"+subgrid_table_id).jqGrid({
				url:"/app/scripts/jqgrid/admin_getdata.php?q=3&id_user="+row_id,
				datatype: "json",
				mtype: 'GET',
				colNames: ['#','Покупатель','Телефон','ID Город','Город','Категория','Планировка','Этажность','Цена','Статус по времени','Статус','','Дата',''],
				colModel: [
                 {name:'id_client', index:'id_client', width:15, align:'right',editable:false, search:false},
				{name:'name', index:'name', width:150, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn'],clearSearch:true},editrules:{required:true},editoptions: {maxlength: 150}},
				{name:'number', index:'number', width:150, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn'],clearSearch:true},editrules:{required:true,number:true},editoptions: {maxlength: 11}},
				{name: 'id_city',index: 'id_city',editable: true,edittype: "text",hidden:true,editrules:{required:true},searchoptions:{sopt:['eq'],searchhidden: true}},
				{name:'name_city', index:'name_city', width:200, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['bw','eq','ne','cn']}, editoptions:{size: 20,dataInit: getCity}},
				{name: 'id_category',index: 'id_category',editable: true,width:150, align:'left',edittype:"select",formatter:"select",editoptions:selectСategory,stype:"select",searchoptions:selectСategory,editrules:{required:true}},
				{name:'id_planning', index:'id_planning',editable: true,width:150, align:'left',edittype:"select",formatter:"select",editoptions:selectPlanning,stype:"select",searchoptions:selectPlanning,editrules:{required:true}},
				{name:'id_floor_status', index:'id_floor_status',editable: true,width:150, align:'left',edittype:"select",formatter:"select",editoptions:selectFloor,stype:"select",searchoptions:selectFloor},
				{name:'cl_price', index:'price', width:150, align:'left', edittype:"text",editable:true,searchoptions:{sopt:['le','lt','gt','ge','bw','eq','ne']},editrules:{required:true,number:true},editoptions: {maxlength: 10}},
				{name:'id_time_status', index:'id_time_status',editable: true,width:150, align:'left',edittype:"select",formatter:"select",editoptions:selectTimeStatus,stype:"select",searchoptions:selectTimeStatus},
				{name:'id_status', index:'id_status',editable: true,width:150, align:'left',edittype:"select",formatter:"select",editoptions:{value:"1:Активен;2:Не активен"},stype:"select",searchoptions:{value:"1:Активен;2:Не активен",sopt:['eq']}},
				{name:'id_user', index:'id_user',editable: true,edittype: "text",hidden:true},
				{name:'date', index:'date', width:150, align:'left', edittype:"text",editable:false,searchoptions:{sopt:['bw','eq','ne','cn'],clearSearch:true}},
				{name:'cl_edit_enable', index:'cl_edit_enable',editable: true,edittype: "text",hidden:true}		
				],
				rowNum:30,
				rowList:[30,45,90],
				sortname: 'id_status',
				sortorder: "asc",
				pager: "#"+pager_id,
				viewrecords: true,
				autowidth:true,
				multiselect: true,
				height: '100%',
				editurl: '/app/scripts/jqgrid/admin_modifydata.php?q=4',
				});
				$("#"+subgrid_table_id).jqGrid('navGrid',"#"+pager_id,{edit:true,add:false,del:false, search:true},{width:390,reloadAfterSubmit:true, beforeShowForm: function(form) { 
		
			$('#name', form).attr({"title":"ФИО в формате: Иванов Иван Иванович"});
			$('#number', form).attr({"title":"Номер в формате: 89011123456 (только цифры)"});  
			$('#name_city', form).attr({"title":"Введите первые буквы города, выберите из вариантов"}); 
			$('#cl_price', form).attr({"title":"Цена в формате: 1000000 (только цифры без сокращений)"});  
			},afterSubmit: function (response) {
				if(response.responseText=="")
				{
					showErrorDialog('Вы не можите редактировать эту запись!');				
					return false;
				}
				else
				{
					var myInfo = '<div class="ui-state-highlight ui-corner-all">'+
								 '<span class="ui-icon ui-icon-info" ' +
									 'style="float: left; margin-right: .3em;"></span>' +
								 response.responseText +
								 '</div>',
						$infoTr = $("#TblGrid_" + $.jgrid.jqID(this.id) + ">tbody>tr.tinfo"),
						$infoTd = $infoTr.children("td.topinfo");
					$infoTd.html(myInfo);
					$infoTr.show();
				
					setTimeout(function () {
						$infoTr.slideUp("slow");
					}, 3000);
					return [true, "", ""];
				}
			}},{width:390,reloadAfterSubmit:true, beforeShowForm: function(form) { 
						
			$('#name', form).attr({"title":"ФИО в формате: Иванов Иван Иванович"});
			$('#number', form).attr({"title":"Номер в формате: 89011123456 (только цифры)"});  
			$('#name_city', form).attr({"title":"Введите первые буквы города, выберите из вариантов"}); 
			$('#cl_price', form).attr({"title":"Цена в формате: 1000000 (только цифры без сокращений)"});    
			},afterSubmit: function (response) {
			if(response.responseText=="")
			{
				showErrorDialog('Вы не можите добавить эту запись!');				
				return false;
			}
			else
			{
				var myInfo = '<div class="ui-state-highlight ui-corner-all">'+
							 '<span class="ui-icon ui-icon-info" ' +
								 'style="float: left; margin-right: .3em;"></span>' +
							 response.responseText +
							 '</div>',
					$infoTr = $("#TblGrid_" + $.jgrid.jqID(this.id) + ">tbody>tr.tinfo"),
					$infoTd = $infoTr.children("td.topinfo");
				$infoTd.html(myInfo);
				$infoTr.show();
		
				setTimeout(function () {
					$infoTr.slideUp("slow");
				}, 3000);
				return [true, "", ""];
			}
			}},{width:390,reloadAfterSubmit:true},{width:525,reloadAfterSubmit:true,multipleSearch:true,closeAfterSearch:true},{width:390,reloadAfterSubmit:true}).navSeparatorAdd("#pager2",{sepclass:"ui-separator",sepcontent: ''}).navSeparatorAdd("#"+pager_id,{sepclass:"ui-separator",sepcontent: ''});
							
		$("#"+pager_id+"_left table.navtable tbody tr").append ('Передача покупателей: <input id="id_user_sub" type="hidden"/><input id="name_user_sub" type="text" placeholder="Кому" name="user"/><button id="hand-over-sub" title="Передать покупателей другому менеджеру">Передать</button>');
		
		 $('#name_user_sub').autocomplete({
          source: "/app/scripts/lists/autocomplete.php?q=user",
          minLength: 1,
          focus: function (event, ui) {
            $(e).val(ui.item.label);
			return false;
          },
          select: function (event, ui) {
            $('#name_user_sub').val(ui.item.label);
            $("#id_user_sub").val(ui.item.value);
			return false;
          }
		});
		
		$("#hand-over-sub").click(function() {
				
				var s= $("#"+subgrid_table_id).jqGrid('getGridParam','selarrrow'),
				id_user=$("#id_user_sub").val();
				
				if (id_user==0) 
				{
					showErrorDialog('Выберите значение!');
					
				}
				
				else if (s==false){ 
					showErrorDialog('Поля не отмечены!');
				}
				else 
				{
					for(var i=0;i<s.length;i++)
					{
						var cl = s[i];
						$.ajax({  
						type: "POST",  
						url: "/app/scripts/jqgrid/admin_modifydata.php?q=1",  
						data: 'oper=handcl&id_client='+cl+'&id_user='+id_user,
						success: function(msg){
									if(msg.length == 0)
									{
										showErrorDialog('Вы не можите редактировать эту запись!');
									}
								}
						});
					}
					$("#"+subgrid_table_id).trigger("reloadGrid");
				}
		
		});
			}
        }).navGrid('#pager2',{edit:true,add:true,del:false,search:true},{width:350,reloadAfterSubmit:true,zIndex:99, beforeShowForm: function(form) { 
									$('#tr_password', form).show();
									$('#tr_pass', form).hide();
									
									$('#login', form).attr({"title":"Логин должен содержать от 6 до 20 символов, только буквы латинского алфовита и цифры без других символов и пробелов."});
									$('#password', form).attr({"title":"Оставьте поле пустым, если не хотите изменить пароль, пароль должен содержать от 6 до 20 символов, только буквы латинского алфовита и цифры без других символов и пробелов. "});
									$('#name', form).attr({"title":"ФИО в формате: Иванов Иван Иванович"});
									$('#number', form).attr({"title":"Номер в формате: 89011123456 (только цифры)"}); 
								
			                      },
	afterSubmit: function (response) {
			if(response.responseText=="")
			{
				showErrorDialog('Вы не можите редактировать эту запись!');
				return false;
			}
			else if (response.responseText=="less6")
			{
				showErrorDialog('Логин или пароль содержит меньше 6 символов!');
				return false;
			}
			else if (response.responseText=="nomatch")
			{
				showErrorDialog('Логин или пароль должен содержать только буквы латинского алфовита и цифры без других символов и пробелов!');
				return false;
			}
			else
			{
				var myInfo = '<div class="ui-state-highlight ui-corner-all">'+
							 '<span class="ui-icon ui-icon-info" ' +
								 'style="float: left; margin-right: .3em;"></span>' +
							 response.responseText +
							 '</div>',
					$infoTr = $("#TblGrid_" + $.jgrid.jqID(this.id) + ">tbody>tr.tinfo"),
					$infoTd = $infoTr.children("td.topinfo");
				$infoTd.html(myInfo);
				$infoTr.show();
			
				setTimeout(function () {
					$infoTr.slideUp("slow");
				}, 3000);
				return [true, "", ""];
			}
			},},{width:350,reloadAfterSubmit:true,zIndex:99, beforeShowForm: function(form) { 
			$('#tr_password', form).show();
			$('#tr_pass', form).hide();
			
			$('#login', form).attr({"title":"Логин должен содержать от 6 до 20 символов, только буквы латинского алфовита и цифры без других символов и пробелов."});
			$('#password', form).attr({"title":"Пароль должен содержать от 6 до 20 символов, только буквы латинского алфовита и цифры без других символов и пробелов."});
			$('#name', form).attr({"title":"ФИО в формате: Иванов Иван Иванович"});
			$('#number', form).attr({"title":"Номер в формате: 89011123456 (только цифры)"}); 
			},afterSubmit: function (response) {
			if(response.responseText=="")
			{
				showErrorDialog('Такой логин уже используется!');				
				return false;
			}
			else if (response.responseText=="less6")
			{
				showErrorDialog('Логин или пароль содержит меньше 6 символов!');
				return false;
			}
			else if (response.responseText=="nomatch")
			{
				showErrorDialog('Логин или пароль должен содержать только буквы латинского алфовита и цифры без других символов и пробелов!');
				return false;
			}
			else
			{
				var myInfo = '<div class="ui-state-highlight ui-corner-all">'+
							 '<span class="ui-icon ui-icon-info" ' +
								 'style="float: left; margin-right: .3em;"></span>' +
							 response.responseText +
							 '</div>',
					$infoTr = $("#TblGrid_" + $.jgrid.jqID(this.id) + ">tbody>tr.tinfo"),
					$infoTd = $infoTr.children("td.topinfo");
				$infoTd.html(myInfo);
				$infoTr.show();
			
				setTimeout(function () {
					$infoTr.slideUp("slow");
				}, 3000);
				return [true, "", ""];
			}
			}},{width:350,reloadAfterSubmit:true,zIndex:99},{width:460,reloadAfterSubmit:true,multipleSearch:true,zIndex:99},{width:350,reloadAfterSubmit:true,zIndex:99,closeAfterSearch:true}).navSeparatorAdd("#pager2",{sepclass:"ui-separator",sepcontent: ''});

$("#users").jqGrid('gridResize', { minWidth: 1150,maxWidth: 1800});

$("#pager2_left table.navtable tbody tr").append('Статус: <select class="active-status"><option value="0" selected="selected">выбрать...</option><option value="1">Активен</option><option value="2">Не активен</option></select>');

 $(".active-status").change(function() {
			
			$("option:selected", $(this)).each(function() {
				
				var s= $("#users").jqGrid('getGridParam','selarrrow'),
				id_status=$(".active-status :selected").val();
				
				if (id_status==0) 
				{
					showErrorDialog('Выберите значение!');
					
				}
				
				else if (s==false){ 
					showErrorDialog('Поля не отмечены!');
				}
				else 
				{
					for(var i=0;i<s.length;i++)
					{
						var cl = s[i];
						$.ajax({  
						type: "POST",  
						url: "/app/scripts/jqgrid/admin_modifydata.php?q=1",  
						data: 'oper=activestatus&id_user='+cl+'&active='+id_status,
						success: function(msg){
									if(msg.length == 0)
									{
										showErrorDialog('Вы не можите редактировать эту запись!');
									}
									
								}
						});
					}
					$('#users').trigger("reloadGrid");
					$('.active-status option').prop('selected', function() {
							return this.defaultSelected;
						});
				}	
			});
		});
		
 $('#pager_left #name_user').autocomplete({
          source: "/app/scripts/lists/autocomplete.php?q=user",
          minLength: 1,
          focus: function (event, ui) {
            $(e).val(ui.item.label);
			return false;
          },
          select: function (event, ui) {
            $('#pager_left #name_user').val(ui.item.label);
            $("#pager_left #id_user").val(ui.item.value);
			return false;
          }
});
$("#hand-over").click(function() {
				
				var s= $("#objects").jqGrid('getGridParam','selarrrow'),
				id_user=$("#pager_left #id_user").val();
				
				if (id_user==0) 
				{
					showErrorDialog('Выберите значение!');
					
				}
				
				else if (s==false){ 
					showErrorDialog('Поля не отмечены!');
				}
				else 
				{
					for(var i=0;i<s.length;i++)
					{
						var cl = s[i];
						$.ajax({  
						type: "POST",  
						url: "/app/scripts/jqgrid/admin_modifydata.php?q=1",  
						data: 'oper=handobj&id_object='+cl+'&id_user='+id_user,
						success: function(msg){
									if(msg.length == 0)
									{
										showErrorDialog('Вы не можите редактировать эту запись!');
									}
							}
						});
					}
					$('#objects').trigger("reloadGrid");
				}
		
		});
$(document.body).on('keyup','#login', function() {
		
		var login=$("#login").val();
		
		if(login.length > 5){
			$.ajax({  
					type: "POST",  
					url: "/app/scripts/lists/admin_checkdata.php",  
					data: 'q=1&login='+login,
					success: function(msg){
						if (msg.length!=0)
						{
							showErrorDialog(msg);	
						}	 
					}
			});
		}
	});

});

  
