$(document).ready(function () {

	var today = new Date(),
		year = today.getFullYear(),
		month = today.getMonth()+1,
		categoryObjectsTempelate = [
			{label:'Комната',color:'rgba(210,150,100,1)',highlightColor:'rgba(210,150,100,0.7)',fillColor:'rgba(210,150,100,0.2)'},
			{label:'Гостинка',color:'rgba(75, 0, 130,1)',highlightColor:'rgba(75, 0, 130,0.7)',fillColor:'rgba(75, 0, 130,0.2)'},
			{label:'1-комнатная',color:'rgba(255, 0, 0,1)',highlightColor:'rgba(255, 0, 0,0.7)',fillColor:'rgba(255, 0, 0,0.2)'},
			{label:'2-комнатная',color:'rgba(205, 205, 44,1)',highlightColor:'rgba(205, 205, 44,0.7)',fillColor:'rgba(205, 205, 44,0.2)'},
			{label:'3-комнатная',color:'rgba( 0, 255, 0,1)',highlightColor:'rgba( 0, 255, 0,0.7)',fillColor:'rgba( 0, 255, 0,0.2)'},
			{label:'4-комнатная',color:'rgba( 0, 0, 255,1)',highlightColor:'rgba( 0, 0, 255,0.7)',fillColor:'rgba( 0, 0, 255,0.2)'},
			{label:'Многокомнатная',color:'rgba(15,18,25,1)',highlightColor:'rgba(15,18,25,0.7)',fillColor:'rgba(15,18,25,0.2)'},
			{label:'Дом',color:'rgba(164,164,164,1)',highlightColor:'rgba(164,164,164,0.7)',fillColor:'rgba(164,164,164,0.2)'},
			{label:'Дача',color:'rgba(143, 0, 255,1)',highlightColor:'rgba(143, 0, 255,0.7)',fillColor:'rgba(143, 0, 255,0.2)'},
			{label:'Коттедж',color:'rgba(111,181,205,1)',highlightColor:'rgba(111,181,205,0.7)',fillColor:'rgba(111,181,205,0.2)'},
			{label:'Земельный участок',color:'rgba(231,150,164,1)',highlightColor:'rgba(231,150,164,0.7)',fillColor:'rgba(231,150,164,0.2)'},
			{label:'1,5-комнатная',color:'rgba(255, 127, 0,1)',highlightColor:'rgba(255, 127, 0,0.7)',fillColor:'rgba(255, 127, 0,0.2)'}			
	];
	
	function getYearSellsObjects(year) {
		
		$.ajax({
			type: "POST",
			async: false,
			url: "/stats/yearsellsobjects",  
			data: 'year='+year,
			success: function(data){
				var response=JSON.parse(data),
					datasets= [];

				$.each(categoryObjectsTempelate, function(i, item) {
				    datasets.push(
				        {
				            label: categoryObjectsTempelate[i].label,
				            fillColor: categoryObjectsTempelate[i].fillColor,
				            strokeColor: categoryObjectsTempelate[i].color,
				            pointColor: categoryObjectsTempelate[i].color,
				            pointStrokeColor: "#fff",
				            pointHighlightFill: "#fff",
				            pointHighlightStroke: categoryObjectsTempelate[i].color,
				            data: response[i]
				        }
				    );
				});

				var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
					dataYearSellsObjects = {
				    labels: months,
				    datasets: datasets
				};
				var context = document.getElementById("year-sells-objects"),
					yearSellsObjects = context.getContext("2d"),
					legendYearSellsObjects=document.getElementById("legend-year-sells-objects");

				new Chart(yearSellsObjects).Line(dataYearSellsObjects, {
					    bezierCurve: false,
						responsive:true,
						scaleGridLineWidth : 1,
						datasetFill : false,
						multiTooltipTemplate: function(valuesObject){
									  /*console.log(valuesObject);*/
									  // do different things here based on whatever you want;
						return valuesObject.datasetLabel+' - '+valuesObject.value+' об.';
						}
					});

				legend(legendYearSellsObjects, dataYearSellsObjects);	
			}	
		});
	}

	function getYearSellsObjectsPie(year) {
		$.ajax({
			type: "POST",
			async: false,
			url: "/stats/yearsellsobjectspie",  
			data: 'year='+year,
			success: function(data){

				var response=JSON.parse(data),
					datasets= [];

				$.each(categoryObjectsTempelate, function(i, item) {
				    datasets.push(
				        {
				            value: parseInt(response[i]),
					        color:categoryObjectsTempelate[i].color,
					        highlight: categoryObjectsTempelate[i].highlightColor,
					        label: categoryObjectsTempelate[i].label
				        }
				    );
				});

				var	yearSellsObjectsPie = document.getElementById("year-sells-objects-pie").getContext("2d"),
					dataYearSellsObjectsPie = datasets;

				new Chart(yearSellsObjectsPie).Doughnut(dataYearSellsObjectsPie,{
					responsive:true,
					animateScale: true
				});
			}
		});

	}

	function getMonthSellsObjectsPie(year,month) {
		$.ajax({
			type: "POST",
			async: false,
			url: "/stats/monthsellsobjectspie",  
			data: 'month='+month+'&year='+year,
			success: function(data){
				var response=JSON.parse(data),
					datasets= [];

				$.each(categoryObjectsTempelate, function(i, item) {
				    datasets.push(
				        {
				            value: parseInt(response[i]),
					        color:categoryObjectsTempelate[i].color,
					        highlight: categoryObjectsTempelate[i].highlightColor,
					        label: categoryObjectsTempelate[i].label
				        }
				    );
				});

				var	monthSellsObjectsPie = document.getElementById("month-sells-objects-pie").getContext("2d"),
					legendMonthSellsObjectsPie=document.getElementById("legend-sells-objects-pie"),
					dataMonthSellsObjectsPie  = datasets;

				new Chart(monthSellsObjectsPie).Doughnut(dataMonthSellsObjectsPie ,{
					responsive:true,
					animateScale: true
				});

				legend(legendMonthSellsObjectsPie, dataMonthSellsObjectsPie);
			}
		});

	}

	function getYearPriceObjects(year) {
		
		$.ajax({
			type: "POST",
			async: false,
			url: "/stats/yearpriceobjects",  
			data: 'year='+year,
			success: function(data){
				var response=JSON.parse(data),
					datasets= [];

				$.each(categoryObjectsTempelate, function(i, item) {
				    datasets.push(
				        {
				            label: categoryObjectsTempelate[i].label,
				            fillColor: categoryObjectsTempelate[i].fillColor,
				            strokeColor: categoryObjectsTempelate[i].color,
				            pointColor: categoryObjectsTempelate[i].color,
				            pointStrokeColor: "#fff",
				            pointHighlightFill: "#fff",
				            pointHighlightStroke: categoryObjectsTempelate[i].color,
				            data: response[i]
				        }
				    );
				});
				var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
					dataYearPriceObjects = {
				    labels: months,
				    datasets: datasets
				};
				var context = document.getElementById("year-price-objects"),
					yearPriceObjects = context.getContext("2d"),
					legendYearPriceObjects=document.getElementById("legend-year-price-objects");

				new Chart(yearPriceObjects).Line(dataYearPriceObjects, {
					    bezierCurve: true,
						responsive:true,
						scaleGridLineWidth : 1,
						datasetFill : false,
						multiTooltipTemplate: function(valuesObject){
									  /*console.log(valuesObject);*/
									  // do different things here based on whatever you want;
						return valuesObject.datasetLabel+' - '+valuesObject.value+' руб.';
						}
					});

				legend(legendYearPriceObjects, dataYearPriceObjects);	
			}	
		});
	}

	function getYearDynamicDB(year) {
		
		$.ajax({
			type: "POST",
			async: false,
			url: "/stats/yeardynamicdb",  
			data: 'year='+year,
			success: function(data){

				var response=JSON.parse(data),
					datasets= [
						{
				            label: categoryObjectsTempelate[9].label,
				            fillColor: categoryObjectsTempelate[9].fillColor,
				            strokeColor: categoryObjectsTempelate[9].color,
				            pointColor: categoryObjectsTempelate[9].color,
				            pointStrokeColor: "#fff",
				            pointHighlightFill: "#fff",
				            pointHighlightStroke: categoryObjectsTempelate[9].color,
				            data: response[0]
				        }
				    ];

				var months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
					dataYearDynamicDB = {
				    labels: months,
				    datasets: datasets
				};
				var context = document.getElementById("year-dynamic-db"),
					yearDynamicDB = context.getContext("2d");

				new Chart(yearDynamicDB).Line(dataYearDynamicDB, {
					    bezierCurve: true,
						responsive:true,
						scaleGridLineWidth : 1,
						datasetFill : true,
						tooltipTemplate: function(valuesObject){
									  /*console.log(valuesObject);*/
									  // do different things here based on whatever you want;
						return valuesObject.value+' записей';
						}
					});	
			}	
		});
	}

	function getSystemStats() {
		
		$.ajax({
			type: "POST",
			async: false,
			url: "/stats/systemstats",  
			success: function(data){

				var response=JSON.parse(data);

				$('#objects-all').html(response.objects.count_all);
				$('#objects-selling').html(response.objects.selling);
				$('#objects-sells-out').html(response.objects.sells_out);
				$('#objects-hide-out').html(response.objects.hide_out);

				$("#clients-all").html(response.clients.count_all);
				$("#clients-active").html(response.clients.active);
				$("#clients-disactive").html(response.clients.disactive);

				$("#users-all").html(response.users.count_all);
				$("#users-active").html(response.users.active);
				$("#users-disactive").html(response.users.disactive);

				$("#all-records").html(response.records.count_all);
				$("#objects-records").html(response.records.objects);
				$("#clients-records").html(response.records.clients);

				$("#week-sell-outs").html(response.sellouts.week);
				$("#month-sell-outs").html(response.sellouts.month);
				$("#monthplus-sell-outs").html(response.sellouts.monthplus);
			}	
		});
	}

	function setYearSelect (year) {
		var selectOptions='';
		
		for (var i=2014;i<year;i++)
		{
			selectOptions += '<option value="'+i+'">'+i+'</option>';		
		}
		
		selectOptions +='<option value="'+year+'" selected="selected">'+year+'</option>';
		
		$('.stat-control .year').html(selectOptions);
	}
	setYearSelect(year);
	$('.stat-control .month').val(month);

	// Get context with jQuery - using jQuery's .get() method.
/*	document.getElementById("container").setAttribute('width','1050');
	document.getElementById("container").setAttribute('height','400');*/
	
	// This will get the first returned node in the jQuery collection.
	// 
	getYearSellsObjects(year);
	getYearSellsObjectsPie(year);
	getMonthSellsObjectsPie(year,month); 
	getYearPriceObjects(year);
	getYearDynamicDB(year);
	getSystemStats();
	

	$("#change-year-sells-objects").change(function() {
			
		//$("option:selected", $(this)).each(function() {
			var year=$("#change-year-sells-objects :selected").val();
			$('#year-sells-objects').remove(); // this is my <canvas> element
  			$('#year-sells-objects-canvas-wrapper').append('<canvas id="year-sells-objects"><canvas>');			
			getYearSellsObjects(year);				
		//});
	});
	$("#change-year-sells-objects-pie").change(function() {
			
		//$("option:selected", $(this)).each(function() {
			var year=$("#change-year-sells-objects-pie :selected").val();
			$('#year-sells-objects-pie').remove(); // this is my <canvas> element
  			$('#year-sells-objects-pie-canvas-wrapper').append('<canvas id="year-sells-objects-pie"><canvas>');
			getYearSellsObjectsPie(year);			
		//});
	});
	$("#change-month-sells-objects-pie").change(function() {
			
		//$("option:selected", $(this)).each(function() {
			var year=$("#change-year-sells-objects-pie :selected").val(),
				month=$("#change-month-sells-objects-pie :selected").val();	
			$('#month-sells-objects-pie').remove(); // this is my <canvas> element
  			$('#month-sells-objects-pie-canvas-wrapper').append('<canvas id="month-sells-objects-pie"><canvas>');	
			getMonthSellsObjectsPie(year,month); 		
		//});
	});
	$("#change-year-price-objects").change(function() {
			
		//$("option:selected", $(this)).each(function() {
			var year=$("#change-year-price-objects :selected").val();
			$('#year-price-objects').remove(); // this is my <canvas> element
  			$('#year-price-objects-canvas-wrapper').append('<canvas id="year-price-objects"><canvas>');			
			getYearPriceObjects(year);				
		//});
	});
	$("#change-year-dynamic-db").change(function() {
			
		//$("option:selected", $(this)).each(function() {
			var year=$("#change-year-dynamic-db :selected").val();
			$('#year-dynamic-db').remove(); // this is my <canvas> element
  			$('#year-dynamic-db-canvas-wrapper').append('<canvas id="year-dynamic-db"><canvas>');			
			getYearDynamicDB(year);
	});
					
});