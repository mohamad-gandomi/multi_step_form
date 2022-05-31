//jQuery time
var current_fs, next_fs, previous_fs; //fieldsets
var left, opacity, scale; //fieldset properties which we will animate
var animating; //flag to prevent quick multi-click glitches
var no_validate = false;

$('.select2').select2({
	searchInputPlaceholder: 'جستجو...'
});

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
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			right = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'right': right, 'opacity': opacity});
		}, 
		duration: 500, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeOutQuint'
	});

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
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			right = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'right': right, 'opacity': opacity});
		}, 
		duration: 500, 
		complete: function(){
			current_fs.hide();
			animating = false;
			no_validate = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeOutQuint'
	});
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
	
	//show the previous fieldset
	previous_fs.show();
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale previous_fs from 80% to 100%
			scale = 0.8 + (1 - now) * 0.2;
			//2. take current_fs to the right(50%) - from 0%
			right = ((1-now) * 50)+"%";
			//3. increase opacity of previous_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'right': right});
			previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
		}, 
		duration: 500, 
		complete: function(){
			current_fs.hide();
			animating = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeOutQuint'
	});
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
	
	//show the next fieldset
	next_fs.show(); 
	//hide the current fieldset with style
	current_fs.animate({opacity: 0}, {
		step: function(now, mx) {
			//as the opacity of current_fs reduces to 0 - stored in "now"
			//1. scale current_fs down to 80%
			scale = 1 - (1 - now) * 0.2;
			//2. bring next_fs from the right(50%)
			right = (now * 50)+"%";
			//3. increase opacity of next_fs to 1 as it moves in
			opacity = 1 - now;
			current_fs.css({'transform': 'scale('+scale+')'});
			next_fs.css({'right': right, 'opacity': opacity});
		}, 
		duration: 500, 
		complete: function(){
			current_fs.hide();
			animating = false;
			no_validate = false;
		}, 
		//this comes from the custom easing plugin
		easing: 'easeOutQuint'
	});
});

$(".submit").click(function(){
	return false;
})