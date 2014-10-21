$(document).ready(function () {
		
	var	path=window.location.pathname.toString(),
	    arrPath=path.split('/'),
		id=(arrPath[1])?arrPath[1]:'panel';

	function activityTime () {
		$.ajax({
			type: "POST",
			url: "/panel/updatestatus",
			async: false
			});
	}
	
	$('#'+id+'').addClass('active');
		
	$('.sidebar-menu li a').click (function(){
		$('.sidebar-menu li a').removeClass('active');
		$(this).addClass('active');
	});
	
	$( ".sidebar-menu" ).accordion({
		active: false,	
    	collapsible: true,
		heightStyle: "content",
    });
	
	 $( ".sidebar-menu li a" ).removeClass( 'ui-corner-all');
	 $( ".sidebar-menu li a" ).removeClass( 'ui-state-default');
	 $( ".sidebar-menu li a" ).removeClass( 'ui-accordion-icons');
	 $( ".sidebar-menu li a" ).removeClass( 'ui-state-hover');
	 $( ".sidebar-menu li a" ).removeClass( 'ui-state-focus');
	 
	 $('a[href^="#"]').on('click',function (e) {
	    e.preventDefault();

	    var target = this.hash,
	    $target = $(target);

	    $('html, body').stop().animate({
	        'scrollTop': $target.offset().top
	    }, 900, 'swing', function () {
	        window.location.hash = target;
	    });
	});
	
	 $('.user-list').slimScroll({
        height: '720px'
    });
	
	activityTime();
	setInterval(activityTime,300000);
	
});
