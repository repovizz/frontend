// This is like a Backbone View, but made from scratch
// We are using custom DOM events, so the built-in View is rather useless

define(['entities', 'jquery-ui'], function(Entities) {

	var Widget = function(id, context) {
		var self = this;

		id = this.id = id || new Date().getTime();
		var model = this.model = Entities.widget.create({
			id: this.id,
			'class': 'generic'
		});
		this.$el = $('<div id="'+this.id+'" class="widget"></div>');
		this.$el.dialog({
			stack: '.widget',
			appendTo: context,
			resize: function(event,ui) {
				model.off('change:width', setWidth, self);
				model.off('change:height', setHeight, self);
				model.off('change:position', setPosition, self);
				model.set({
					width: ui.size.width,
					height: ui.size.height,
					position: JSON.stringify(ui.position)
				});
				model.on('change:width', setWidth, self);
				model.on('change:height', setHeight, self);
				model.on('change:position', setPosition, self);
			},
			drag: function(event,ui) {
				model.off('change:position', setPosition, self);
				model.set('position', JSON.stringify(ui.position));
				model.on('change:position', setPosition, self);
			},
			focus: function(event,ui) {
				model.off('change:lastFocus', setLayer, self);
				model.set('lastFocus', new Date().getTime());
				model.on('change:lastFocus', setLayer, self);
			}
		});
		model.on('change:position', setPosition, this);
		model.on('change:width', setWidth, this);
		model.on('change:height', setHeight, this);
		model.on('change:lastFocus', setLayer, this);

		return this;
	};

	// Private methods instantiated only once

	var setPosition = function(model, position) {
		position = JSON.parse(position);
		this.$el.dialog('option','position', [position.left, position.top]);
	};

	var setWidth = function(model, width) {
		this.$el.dialog('option','width', width);
	};

	var setHeight = function(model, height) {
		this.$el.dialog('option','height', height);
	};

	var setLayer = function(model, index) {
		this.$el.dialog('moveToTop');
	};

	return Widget;

});