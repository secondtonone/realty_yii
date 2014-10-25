$(document).ready(function () {

	var today = new Date(),
		year = today.getFullYear(),
		month = today.getMonth()+1,
		categoryObjectsTempelate = [
			{label:'1-комнатная',color:'rgba(255, 0, 0,1)',highlightColor:'rgba(255, 0, 0,0.7)',fillColor:'rgba(255, 0, 0,0.2)'},
			{label:'1,5-комнатная',color:'rgba(255, 127, 0,1)',highlightColor:'rgba(255, 127, 0,0.7)',fillColor:'rgba(255, 127, 0,0.2)'},
			{label:'2-комнатная',color:'rgba(205, 205, 44,1)',highlightColor:'rgba(205, 205, 44,0.7)',fillColor:'rgba(205, 205, 44,0.2)'},
			{label:'3-комнатная',color:'rgba( 0, 255, 0,1)',highlightColor:'rgba( 0, 255, 0,0.7)',fillColor:'rgba( 0, 255, 0,0.2)'},
			{label:'4-комнатная',color:'rgba( 0, 0, 255,1)',highlightColor:'rgba( 0, 0, 255,0.7)',fillColor:'rgba( 0, 0, 255,0.2)'},
			{label:'Гостинка',color:'rgba(75, 0, 130,1)',highlightColor:'rgba(75, 0, 130,0.7)',fillColor:'rgba(75, 0, 130,0.2)'},
			{label:'Дача',color:'rgba(143, 0, 255,1)',highlightColor:'rgba(143, 0, 255,0.7)',fillColor:'rgba(143, 0, 255,0.2)'},
			{label:'Дом',color:'rgba(164,164,164,1)',highlightColor:'rgba(164,164,164,0.7)',fillColor:'rgba(164,164,164,0.2)'},
			{label:'Земельный участок',color:'rgba(254,5,54,1)',highlightColor:'rgba(254,5,54,0.7)',fillColor:'rgba(254,5,54,0.2)'},
			{label:'Комната',color:'rgba(210,150,100,1)',highlightColor:'rgba(210,150,100,0.7)',fillColor:'rgba(210,150,100,0.2)'},
			{label:'Коттедж',color:'rgba(111,181,205,1)',highlightColor:'rgba(111,181,205,0.7)',fillColor:'rgba(111,181,205,0.2)'},
			{label:'Многокомнатная',color:'rgba(15,18,25,1)',highlightColor:'rgba(15,18,25,0.7)',fillColor:'rgba(15,18,25,0.2)'}
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
					yearSellsObjectsPie = document.getElementById("year-sells-objects-pie").getContext("2d"),
					dataYearSellsObjectsPie = [
					   {
					        value: parseInt(response[1]),
					        color:categoryObjectsTempelate[0].color,
					        highlight: categoryObjectsTempelate[0].highlightColor,
					        label: categoryObjectsTempelate[0].label
					    },
					    {
					        value: parseInt(response[2]),
					        color:categoryObjectsTempelate[1].color,
					        highlight: categoryObjectsTempelate[1].highlightColor,
					        label: categoryObjectsTempelate[1].label
					    },
					    {
					        value: parseInt(response[3]),
					        color:categoryObjectsTempelate[2].color,
					        highlight: categoryObjectsTempelate[2].highlightColor,
					        label: categoryObjectsTempelate[2].label
					    },
					    {
					        value: parseInt(response[4]),
					        color:categoryObjectsTempelate[3].color,
					        highlight: categoryObjectsTempelate[3].highlightColor,
					        label: categoryObjectsTempelate[3].label
					    },
					    {
					        value: parseInt(response[5]),
					        color:categoryObjectsTempelate[4].color,
					        highlight: categoryObjectsTempelate[4].highlightColor,
					        label: categoryObjectsTempelate[4].label
					    },
					    {
					        value: parseInt(response[6]),
					        color:categoryObjectsTempelate[5].color,
					        highlight: categoryObjectsTempelate[5].highlightColor,
					        label: categoryObjectsTempelate[5].label
					    },
					    {
					        value: parseInt(response[7]),
					        color:categoryObjectsTempelate[6].color,
					        highlight: categoryObjectsTempelate[6].highlightColor,
					        label: categoryObjectsTempelate[6].label
					    },
					    {
					        value: parseInt(response[8]),
					        color:categoryObjectsTempelate[7].color,
					        highlight: categoryObjectsTempelate[7].highlightColor,
					        label: categoryObjectsTempelate[7].label
					    },
					    {
					        value: parseInt(response[9]),
					        color:categoryObjectsTempelate[8].color,
					        highlight: categoryObjectsTempelate[8].highlightColor,
					        label: categoryObjectsTempelate[8].label
					    },
					    {
					        value: parseInt(response[10]),
					        color:categoryObjectsTempelate[9].color,
					        highlight: categoryObjectsTempelate[9].highlightColor,
					        label: categoryObjectsTempelate[9].label
					    },
					    {
					        value: parseInt(response[11]),
					        color:categoryObjectsTempelate[10].color,
					        highlight: categoryObjectsTempelate[10].highlightColor,
					        label: categoryObjectsTempelate[10].label
					    },
					    {
					        value: parseInt(response[14]),
					        color:categoryObjectsTempelate[11].color,
					        highlight: categoryObjectsTempelate[11].highlightColor,
					        label: categoryObjectsTempelate[11].label
					    }
					];
				new Chart(yearSellsObjectsPie).Pie(dataYearSellsObjectsPie,{
					responsive:true
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
					monthSellsObjectsPie = document.getElementById("month-sells-objects-pie").getContext("2d"),
					legendMonthSellsObjectsPie=document.getElementById("legend-sells-objects-pie"),
					dataMonthSellsObjectsPie  = [
					   {
					        value: parseInt(response[1]),
					        color:categoryObjectsTempelate[0].color,
					        highlight: categoryObjectsTempelate[0].highlightColor,
					        label: categoryObjectsTempelate[0].label
					    },
					    {
					        value: parseInt(response[2]),
					        color:categoryObjectsTempelate[1].color,
					        highlight: categoryObjectsTempelate[1].highlightColor,
					        label: categoryObjectsTempelate[1].label
					    },
					    {
					        value: parseInt(response[3]),
					        color:categoryObjectsTempelate[2].color,
					        highlight: categoryObjectsTempelate[2].highlightColor,
					        label: categoryObjectsTempelate[2].label
					    },
					    {
					        value: parseInt(response[4]),
					        color:categoryObjectsTempelate[3].color,
					        highlight: categoryObjectsTempelate[3].highlightColor,
					        label: categoryObjectsTempelate[3].label
					    },
					    {
					        value: parseInt(response[5]),
					        color:categoryObjectsTempelate[4].color,
					        highlight: categoryObjectsTempelate[4].highlightColor,
					        label: categoryObjectsTempelate[4].label
					    },
					    {
					        value: parseInt(response[6]),
					        color:categoryObjectsTempelate[5].color,
					        highlight: categoryObjectsTempelate[5].highlightColor,
					        label: categoryObjectsTempelate[5].label
					    },
					    {
					        value: parseInt(response[7]),
					        color:categoryObjectsTempelate[6].color,
					        highlight: categoryObjectsTempelate[6].highlightColor,
					        label: categoryObjectsTempelate[6].label
					    },
					    {
					        value: parseInt(response[8]),
					        color:categoryObjectsTempelate[7].color,
					        highlight: categoryObjectsTempelate[7].highlightColor,
					        label: categoryObjectsTempelate[7].label
					    },
					    {
					        value: parseInt(response[9]),
					        color:categoryObjectsTempelate[8].color,
					        highlight: categoryObjectsTempelate[8].highlightColor,
					        label: categoryObjectsTempelate[8].label
					    },
					    {
					        value: parseInt(response[10]),
					        color:categoryObjectsTempelate[9].color,
					        highlight: categoryObjectsTempelate[9].highlightColor,
					        label: categoryObjectsTempelate[9].label
					    },
					    {
					        value: parseInt(response[11]),
					        color:categoryObjectsTempelate[10].color,
					        highlight: categoryObjectsTempelate[10].highlightColor,
					        label: categoryObjectsTempelate[10].label
					    },
					    {
					        value: parseInt(response[14]),
					        color:categoryObjectsTempelate[11].color,
					        highlight: categoryObjectsTempelate[11].highlightColor,
					        label: categoryObjectsTempelate[11].label
					    }
					];
				new Chart(monthSellsObjectsPie).Pie(dataMonthSellsObjectsPie ,{
					responsive:true
				});

				legend(legendMonthSellsObjectsPie, dataMonthSellsObjectsPie);
			}
		});

	}

	function setYearSelect (year) {
		var selectOptions='';
		
		for (var i=2014;i<year;i++)//сменить на 2014
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
					
});