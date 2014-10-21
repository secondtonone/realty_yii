$(document).ready(function () {

	function setYearSelect () {
		var today = new Date(),
			year = today.getFullYear(),
			selectOptions='';
		
		for (var i=2014;i<year;i++)//сменить на 2014
		{
			selectOptions += '<option value="'+i+'">'+i+'</option>';		
		}
		
		selectOptions +='<option value="'+year+'" selected="selected">'+year+'</option>';
		
		$('.stat-control .year').html(selectOptions);
	}
	setYearSelect();
	// Get context with jQuery - using jQuery's .get() method.
	var yearSellsObjects = document.getElementById("year-sells-objects").getContext("2d");
	
/*	document.getElementById("container").setAttribute('width','1050');
	document.getElementById("container").setAttribute('height','400');*/
	var legendYearSellsObjects=document.getElementById("legend-year-sells-objects");
	// This will get the first returned node in the jQuery collection.
	var dataYearSellsObjects = {
	    labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
	    datasets: [
	        {
	            label: "1-комнатная",
	            fillColor: "rgba(210,150,100,0.2)",
	            strokeColor: "rgba(210,150,100,1)",
	            pointColor: "rgba(210,150,100,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: [6, 9, 0, 1, 5, 5, 0, 0, 8, 0, 10, 10]
	        },
	        {
	            label: "1,5-комнатная",
	            fillColor: "rgba(255,128,128,0.2)",
	            strokeColor: "rgba(255,128,128,1)",
	            pointColor: "rgba(255,128,128,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(255,128,128,1)",
	            data: [8, 8, 4, 19, 8, 2, 9, 0, 4, 8, 9, 4]
	        },
	        {
	            label: "2-комнатная",
	            fillColor: "rgba(151,123,205,0.2)",
	            strokeColor: "rgba(151,123,205,1)",
	            pointColor: "rgba(151,123,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [2, 3, 8, 11, 5, 1, 9, 8, 19, 6, 7, 9]
	        },
	        {
	            label: "3-комнатная",
	            fillColor: "rgba(254,5,54,0.2)",
	            strokeColor: "rgba(254,5,54,1)",
	            pointColor: "rgba(254,5,54,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [1, 2, 4, 6, 7, 9, 9, 0, 4, 4, 5, 14]
	        },
			{
	            label: "4-комнатная",
	            fillColor: "rgba(213,222,13,0.2)",
	            strokeColor: "rgba(213,222,13,1)",
	            pointColor: "rgba(213,222,13,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [19, 12, 3, 6, 9, 1, 9, 4, 3, 6, 7, 0]
	        },
			{
	            label: "Гостинка",
	            fillColor: "rgba(15,17,125,0.2)",
	            strokeColor: "rgba(15,17,125,1)",
	            pointColor: "rgba(15,17,125,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [12, 6, 8, 6, 8, 0, 0, 2, 4, 9,7, 0]
	        },
			{
	            label: "Дача",
	            fillColor: "rgba(1,18,205,0.2)",
	            strokeColor: "rgba(1,18,205,1)",
	            pointColor: "rgba(1,18,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [8, 4, 4, 1, 6, 2, 9, 3, 4, 4, 2, 4]
	        },
			{
	            label: "Дом",
	            fillColor: "rgba(151,187,2,0.2)",
	            strokeColor: "rgba(151,187,2,1)",
	            pointColor: "rgba(151,187,2,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [2, 4, 0, 1, 7, 7, 9, 3, 2, 4, 1, 0]
	        },
			{
	            label: "Земельный участок",
	            fillColor: "rgba(151,1,205,0.2)",
	            strokeColor: "rgba(151,1,205,1)",
	            pointColor: "rgba(151,1,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [2, 4, 4, 1, 5, 7, 9, 3, 4, 8, 2, 4]
	        },
			{
	            label: "Комната",
	            fillColor: "rgba(15,187,25,0.2)",
	            strokeColor: "rgba(15,187,25,1)",
	            pointColor: "rgba(15,187,25,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [5, 1, 4, 9, 8, 2, 9, 3, 4, 4, 2, 0]
	        },
			{
	            label: "Коттедж",
	            fillColor: "rgba(111,181,205,0.2)",
	            strokeColor: "rgba(111,181,205,1)",
	            pointColor: "rgba(111,181,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [2, 4, 4, 1, 6, 7, 3, 3, 4, 6, 7, 4]
	        },
			{
	            label: "Многокомнатная",
	            fillColor: "rgba(15,18,25,0.2)",
	            strokeColor: "rgba(15,18,25,1)",
	            pointColor: "rgba(15,18,25,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [8, 4, 0, 1,0, 6, 0,0,0,0,0,0]
	        },
	    ]
	};
	var yearSellsObjects = new Chart(yearSellsObjects).Line(dataYearSellsObjects, {
	    bezierCurve: false,
		responsive:true,
		scaleGridLineWidth : 1,
		datasetFill : false,
		multiTooltipTemplate: function(valuesObject){
		 /* console.log(valuesObject);*/
		  // do different things here based on whatever you want;
		  return valuesObject.datasetLabel+' - '+valuesObject.value+' об.';
		}
	});	
	
	legend(legendYearSellsObjects, dataYearSellsObjects);

});