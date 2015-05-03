/*
*
* Author Karo Hakobyan
*
*/

"use strict";

$.widget("ui.selectWidget", {
	
	options: {
		change : function (changes) {
			return changes;
		},
		effect       : "slide",
		keyControl   : true,
		speed        : 200,
		scrollHeight : 250
	},
	
	_create: function(){
	
		this._selectFunctional();
	},
	
	_selectFunctional: function(){

		if (this.element.hasClass("installed")) { return false; }
		this.element.addClass("installed");
		
		var select        = this.element,
			mainBlock     = $("<div>").addClass("select-main"),
			selectedItem  = $("<div>").addClass("select-set"),
			selectArrow   = $("<div>").addClass("select-arrow"),
			selectBlock   = $("<div>").addClass("select-block"),
			selectList    = $("<ul>").addClass("select-list"),
			selected      = select.find("option[selected]").length,
			options       = $("option", select),
			itemPosition  = 0,
			reset         = $("input[type=reset]", select.parents("form")),
			speed         = this.options.speed,
			keyControl    = this.options.keyControl,
			effect        = this.options.effect,
			change        = this.options.change,
			scrollHeight  = this.options.scrollHeight;
		
		mainBlock.append( selectArrow );
		mainBlock.append( selectedItem );
		selectBlock.append( selectList );
		mainBlock.append( selectBlock );
		select.after( mainBlock );
		select.hide();
		selectBlock.hide();
		
		// Insert options
		options.each(function(i, elem){
			selectList.append( $("<li>").addClass("select-items").text( $(elem).text() ) );
		});
		
		reset.click(function(){
			$(options, $(this).parents("form")).each(function(i, elem) {
				if ($(elem).val() == "" && !$(elem).is(":selected")) {
					$(".select-items:first", selectList).click();
					return false;
				}
			});
		});

		if (select.attr("disabled")) { mainBlock.addClass("disabled"); }
		
		if (!selected) {
		
			select.val( options.first().val() );
			$("li:first", selectList).addClass("active");
			selectedItem.text( options.first().text() );
		} else {
		
			select.val( select.find("option[selected]").val() );			
			$("li", selectList).eq( select.find("option[selected]").index() ).addClass("active");
			selectedItem.text( select.find("option[selected]").text() );
		}
		
		itemPosition = $("option[selected]", select).index();
		
		$("li", selectList).click(function(){
			
			var id = $(this).index();			
			itemPosition = id;
			selectRepeatFunction(id);
		});
		
		if (scrollHeight) {
			
			if (selectBlock.height() > scrollHeight) {
				selectList.css("height", scrollHeight)
						  .css("overflow", "auto");
			}
		
		}
		
		selectArrow.click(function(){ selectedItem.click(); });

		selectedItem.click(function(){
			
			var self = $(this);
			
			if (self.parent(mainBlock).hasClass("disabled")) { return false; }
			
			if (!self.prev().hasClass("reverse")) {
			
				$(".select-arrow").removeClass("reverse");
				self.prev().addClass("reverse");
				self.parent().addClass("z-index");
			} else {
			
				self.parent().removeClass("z-index");
				self.prev().removeClass("reverse");
			}
			
			if (selectBlock.is(":hidden")) {
			
				if ($(".select-block").is(":visible")) {
					
					if (effect == "slide") {
					
						$(".select-block").slideUp(speed / 2);
						$(".select-main").removeClass("z-index");
					} else if (effect == "fade") {
					
						$(".select-block").fadeOut(speed / 2);
						$(".select-main").removeClass("z-index");
					}
					
					$(document).unbind("keydown");
				}
				
				$(document).bind("click", function(event){
					if (!$(event.target).is(".select-set") && !$(event.target).is(".select-arrow")) {
					
						if ($(".select-block").is(":visible")) {
						
							if (effect == "slide") {
								
								selectBlock.slideUp(speed / 2, function(){
									$(".select-main").removeClass("z-index");
								});
								
								$(".select-arrow").removeClass("reverse");
								
							} else if (effect == "fade") {
							
								selectBlock.fadeOut(speed / 2, function(){
									$(".select-main").removeClass("z-index");
								});
								
								$(".select-arrow").removeClass("reverse");
								
							}
							
							$(document).unbind("click keydown");
						}
					}
					
				});
				
				if (effect == "slide") {
				
					selectBlock.slideDown(speed);
					self.parent().addClass("z-index");
					selectAnimate();
				} else if (effect == "fade") {
				
					selectBlock.fadeIn(speed);
					self.parent().addClass("z-index");
					selectAnimate();
				}
				
				if (keyControl) {
			
					$(document).bind("keydown", function(event){
						
						var code = event.keyCode;
						
						if (code == 40) {
							if (itemPosition < options.length-1) {
								itemPosition = (itemPosition == -1) ? 0 : itemPosition;
								selectRepeatFunction( itemPosition+=1 );
								selectAnimate();
							}
							event.preventDefault();
						}

						if (code == 38) {
							if (itemPosition > 0) {
								selectRepeatFunction( itemPosition-=1 );
								selectAnimate();
							}
							event.preventDefault();
						}
						
						if (code == 13) {
							if (effect == "slide") {
								selectBlock.slideUp(speed / 2, function(){
									$(".select-main").removeClass("z-index");
								});
							} else if (effect == "fade") {
								selectBlock.fadeOut(speed / 2, function(){
									$(".select-main").removeClass("z-index");
								});
							}
							$(".select-arrow").removeClass("reverse");					
							$(document).unbind("keydown");
							event.preventDefault();
						}
						
					});
					
				}
				
			} else {
				if (effect == "slide") {
				
					selectBlock.slideUp(speed / 2, function(){
						$(".select-main").removeClass("z-index");
					});
					$(".select-arrow").removeClass("reverse");
				} else if (effect == "fade") {
				
					selectBlock.fadeOut(speed / 2, function(){
						$(".select-main").removeClass("z-index");
					});
					$(".select-arrow").removeClass("reverse");
				}
				
				$(document).unbind("keydown");
			}
			
		});
		
		function selectRepeatFunction( id ){
			
			$("li.active", selectList).removeClass("active");
			$("li", selectList).eq( id ).addClass("active");
			
			$("option[selected]", select).removeAttr("selected");
			options.eq( id ).prop("selected", true);
			select.val( options.eq( id ).val() );
			
			selectedItem.text( options.eq( id ).text() );
			itemPosition = id;
			
			if (change) {				
				select.change(options.eq( id ).val());
				change(select.val());
			}
			
			return id;
			
		}
		
		function selectAnimate() {
		
			var selectHeight = 0,
				currentSelect = $(".select-items", selectList);
				
			for (var i = 0, l = currentSelect.length; i < l; i++ ) {
				if($(currentSelect[i]).hasClass("active")) {
					break;
				}
				selectHeight += $(currentSelect[i]).outerHeight();
			}

			selectList.stop().animate({
				scrollTop: selectHeight
			}, speed);
			
		}
		
	}
	
});
