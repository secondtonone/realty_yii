$(document).ready(function(){
	
	$(document).tooltip({show: {
		effect: "fadeIn",
		delay: 150},
		hide:{
		effect: "fadeOut",
		delay: 100},
		position: { my: "left+15", at: "right center"},
		open: function (event, ui) {
            setTimeout(function () {
                $(ui.tooltip).hide();
            }, 5000);
        }
		});	
		
});