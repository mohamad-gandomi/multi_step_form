(function($){
	$( document ).ready(function(){

		let animating; //flag to prevent quick multi-click glitches

		$('.select2').select2();

		const isFieldsetValid = () => {

			let validationPassed = true, elements;
			elements = $('input,textarea,select').filter('[required]:visible');

			if (!elements.length) {
				$('button').filter('[disabled]:visible').removeAttr('disabled');
				validationPassed= true;
				return;
			};

			elements.each(function() {
				if(!$(this).valid()) {
					validationPassed= false;
					$('button').filter('.next:visible').attr('disabled', true);
					return;
				}
			});

			if (validationPassed) {
				$('button').filter('[disabled]:visible').removeAttr('disabled');
			}

			return validationPassed;

		}
		
		const goToNextFieldset = (next_fs, duration = 500) => {

			let current_fs = $('fieldset').filter(':visible');
			next_fs.find('.previous').attr('data-btn', current_fs.attr('data-fs'));
			current_fs.find('.next').attr('data-btn', next_fs.attr('data-fs'));
 
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
		
		const goToPreviousFieldset = (previous_fs, duration = 500) => {
			let current_fs = $('fieldset').filter(':visible');
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
		
		$(document).on('click', '.previous', function(e){
			e.preventDefault();
			if(animating) return false;
			animating = true;
			previous_fs = $( 'fieldset[data-fs='+ $(this).attr('data-btn') + ']' );
			goToPreviousFieldset (previous_fs, 500);
		});
		
		$(document).on('click', '.next', function(e){
			e.preventDefault();
			if(animating) return false;
			animating = true;
			next_fs = $( 'fieldset[data-fs='+ $(this).attr('data-btn') + ']' );
			if(!next_fs.length) next_fs = $(this).parent().parent().next();
			if( false == isFieldsetValid() ){
				animating = false;
				return;
			} else {
				goToNextFieldset (next_fs, 500);
			}
		})
		
		$(document).on('change', 'select', function(){
			if(animating) return false;
			if($('.select2').find(':selected').length) {
				$(this).next().addClass('has-option');
			} else {
				$(this).next().removeClass('has-option');
			}
			animating = true;
			next_fs = $( 'fieldset[data-fs='+ $(this).find(':selected').attr('data-option') + ']' );
			if( false == isFieldsetValid() ){
				animating = false;
				return;
			} else {
				goToNextFieldset (next_fs, 500);
			}
		});
		
		$(document).on('click', 'input[data-btn]', function(e){
			e.preventDefault();
			if(animating) return false;
			animating = true;
			next_fs = $( 'fieldset[data-fs='+ $(this).attr('data-btn') + ']' );
			$('input').filter('[data-btn]:visible').removeClass('selected');
			$(this).addClass('selected');
			if( false == isFieldsetValid() ){
				animating = false;
				return;
			} else {
				goToNextFieldset (next_fs, 500);
			}
		});

		$(document).on('change', 'input', function(){
			$(this).val().length > 0 ? $(this).addClass('input-has-value') : $(this).removeClass('input-has-value');
			if( false == isFieldsetValid() ){
				animating = false;
				return;
			} else {
				goToNextFieldset (next_fs, 500);
			}
		});

	});
}(jQuery));
