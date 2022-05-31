//jQuery time
var animating; //flag to prevent quick multi-click glitches
var no_validate = false;

const goToNextFieldset = (current_fs, next_fs, duration = 500) => {
	next_fs.show();
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			scale = 1 - (1 - now) * 0.2;
			right = (now * 50)+"%";
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'right': right, 'opacity': opacity});
		}, 
		duration: duration, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		easing: 'easeOutQuint'
	});
}

const goToPreviousFieldset = (current_fs, previous_fs, duration = 500) => {
	previous_fs.show();
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			scale = 0.8 + (1 - now) * 0.2;
			right = ((1-now) * 50)+"%";
			opacity = 1 - now;
			current_fs.css({'right': right});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: duration, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		easing: 'easeOutQuint'
	});
}

$('.select2').select2();

$(".input-btn").click(function(e){
	e.preventDefault();
	if(animating) return false;
	animating = true;

	$('.input-btn').removeClass('selected');
	$(this).addClass('selected');
	$(this).parent().find('.next').removeAttr("disabled");
	current_fs = $(this).parent();
	next_fs = $( 'fieldset[data-fs='+ $(this).attr('data-btn') + ']' ); 

	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

	//add this fieldset data-fs to next_fs previous button data-btn
	next_fs.find('.previous').attr('data-btn', current_fs.attr('data-fs'));
	current_fs.find('.next').attr('data-btn', next_fs.attr('data-fs'));
	
	goToNextFieldset (current_fs, next_fs, 500);

});

$(".next").click(function(e){

	e.preventDefault();

	if(animating) return false;

	$(this).parent().parent().find('.required').each(function(){
		if (!$(this).val()) {
			no_validate = true;
		} else {
			no_validate = false;
		}
	});

	if (no_validate) return;

	current_fs = $(this).parent().parent();
	next_fs = $( 'fieldset[data-fs='+ $(this).attr('data-btn') + ']' );
	if(!next_fs.length) next_fs = $(this).parent().parent().next();

	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	goToNextFieldset (current_fs, next_fs, 500);
});

$(".previous").click(function(e){

	e.preventDefault();

	if(animating) return false;
	animating = true;
	
	current_fs = $(this).parent().parent();
	previous_fs = $( 'fieldset[data-fs='+ $(this).attr('data-btn') + ']' );
	if(!previous_fs.length) previous_fs = $(this).parent().parent().prev();
	
	//de-activate current step on progressbar
	$("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

	goToPreviousFieldset (current_fs, previous_fs, 500);
	
});

$('select').on('change', function() {

	if(animating) return false;

	$(this).parent().parent().find('.required').each(function(){
		if(!$(this).val()){
			no_validate = true;
			$(this).parent().parent().find('.next').attr('disabled', 'disabled');
			$(this).parent().parent().find('.next').removeAttr('data-btn');
			return;
		} else {
			no_validate = false;
		}
	});

	if($('.select2').find(':selected').length) {
		$(this).next().addClass('has-option');
	} else {
		$(this).next().removeClass('has-option');
	}

	if (no_validate) return;

	animating = true;


	$(this).parent().parent().find('.next').removeAttr("disabled");
	
	current_fs = $(this).parent().parent();
	next_fs = $( 'fieldset[data-fs='+ $(this).find(':selected').attr('data-option') + ']' );
	if(!next_fs.length) next_fs = $(this).parent().parent().next();

	next_fs.find('.previous').attr('data-btn', current_fs.attr('data-fs'));
	current_fs.find('.next').attr('data-btn', next_fs.attr('data-fs'));

	
	//activate next step on progressbar using the index of next_fs
	$("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");
	
	goToNextFieldset (current_fs, next_fs, 500);
});
