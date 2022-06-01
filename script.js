(function($){
	$( document ).ready(function(){
		
		var animating; //flag to prevent quick multi-click glitches
		$('.select2').select2();

		const validateFieldset = () => {
			let elements = [];
			let errors = [];
			elements = $('input,textarea,select').filter('[required]:visible');
			elements.each(function() {
				if (!$(this).val()) {
					errors.push('required');
				}
			});
			if (errors.length) {
				return false;
			} else {
				$('button').filter('[disabled]:visible').removeAttr('disabled');
				return true;
			}
		}
		
		const goToNextFieldset = (next_fs, duration = 500) => {
			if (!validateFieldset()) {
				animating = false;
				return false;
			}
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
			goToNextFieldset (next_fs, 500);
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
			goToNextFieldset (next_fs, 500);
		});
		
		$(document).on('click', 'input[data-btn]', function(e){
			e.preventDefault();
			if(animating) return false;
			animating = true;
			next_fs = $( 'fieldset[data-fs='+ $(this).attr('data-btn') + ']' );
			$('input').filter('[data-btn]:visible').removeClass('selected');
			$(this).addClass('selected');
			goToNextFieldset (next_fs, 500);
		})

	});
}(jQuery));
