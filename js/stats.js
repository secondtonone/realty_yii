$(document).ready(function () {
	// Get context with jQuery - using jQuery's .get() method.
	var ctx = document.getElementById("container").getContext("2d");

	document.getElementById("container").setAttribute('width','1150');
	document.getElementById("container").setAttribute('height','400');
	// This will get the first returned node in the jQuery collection.
	var data = {
	    labels: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"],
	    datasets: [
	        {
	            label: "Коттедж",
	            fillColor: "rgba(220,220,220,0.2)",
	            strokeColor: "rgba(220,220,220,1)",
	            pointColor: "rgba(220,220,220,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(220,220,220,1)",
	            data: [65, 59, 80, 81, 56, 55, 40, 86, 8, 50, 35, 10]
	        },
	        {
	            label: "Сталинка",
	            fillColor: "rgba(151,187,205,0.2)",
	            strokeColor: "rgba(151,187,205,1)",
	            pointColor: "rgba(151,187,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [28, 48, 40, 19, 86, 27, 9, 30, 49, 46, 27, 40]
	        },
	        {
	            label: "Брежневка",
	            fillColor: "rgba(151,123,205,0.2)",
	            strokeColor: "rgba(151,123,205,1)",
	            pointColor: "rgba(151,123,205,1)",
	            pointStrokeColor: "#fff",
	            pointHighlightFill: "#fff",
	            pointHighlightStroke: "rgba(151,187,205,1)",
	            data: [21, 43, 48, 11, 56, 21, 49, 88, 19, 36, 71, 99]
	        }
	    ]
	};
	var myNewChart = new Chart(ctx).Line(data, {
	    bezierCurve: false,
	    legendTemplate : '<ul>'
                  +'<% for (var i=0; i<datasets.length; i++) { %>'
                    +'<li>'
                    +'<span style=\"background-color:<%=datasets[i].lineColor%>\"></span>'
                    +'<% if (datasets[i].label) { %><%= datasets[i].label %><% } %>'
                  +'</li>'
                +'<% } %>'
              +'</ul>'
	});	
	$('.chart-legend').html(myNewChart.generateLegend());
});