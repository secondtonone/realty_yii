$(document).ready(function () {

	$('.login').attr('style', '');
	$.backstretch(['/img/page-4.jpg','/img/page-7.jpg'],{fade: 2000,duration: 800});


	$('#enter-form').submit(function(){

		var	formData=$(this).serialize(),
			site=window.location.hostname;

		$('#entering').hide();
		$(".enter-preloader").css({'display' : 'inline-block'});
		$("#execute").css({'display' : 'inline-block'});

		$.ajax({
			type: "POST",
			url: "/enter/login",
			data: formData,
			success: function(msg){

				var response=JSON.parse(msg),
					error=response.error,
					redirect=response.redirect;

				if (error)
				{
					$(".enter-preloader").hide();
					$("#execute").hide();
					$('#entering').css({'display' : 'inline-block'});
					$(".display-error").show();
					$(".message").html(error);
				}
				else
				{
					window.location = redirect;
				}

			}
       });
	   return false;
	});

	$('.login').on('click','.close-button', function() {
		$(".display-error").hide();
	});
});