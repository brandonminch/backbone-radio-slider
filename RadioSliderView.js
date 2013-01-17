/**
 * @module RadioSliderView
 */


var RadioSliderView = Backbone.View.extend({

	'events': {
		'click .segment': 'handleSegmentClick',
		'mousedown .toggle': 'handleToggleClick',
		'mouseup': 'handleToggleRelease',
		'mouseleave': 'handleToggleRelease'
	},

	'initialize': function (options) {

		_.bindAll(this);

		this.$radios = this.$el.find('input[type="radio"]');
		this.$radioSlider = $(_.template($('#radio-slider-template').html().trim(), {'segments': this.$radios.length}));
		this.$segments = this.$radioSlider.find('.segment'),
		this.$toggle = this.$radioSlider.find('.toggle');

		this.isMouseDown = false;
		this.originMouseX = 0;

		this.render();
	},

	'render': function () {
		this.$el.prepend(this.$radioSlider);
		this.setSliderWidth();
		this.snapToggle(4);
	},

	'handleToggleClick': function (e) {
		e.preventDefault();

		this.isMouseDown = true;
		this.originMouseX = e.pageX;

		this.$el.on('mousemove', this.handleToggleDrag);
	},

	'handleSegmentClick': function (e) {
		e.preventDefault();

		this.snapToggle($(e.currentTarget).index());
	},

	'handleToggleRelease': function (e) {
		this.isMouseDown = false;

		this.$el.off('mousemove', this.handleToggleDrag);

		this.snapToggle();
	},

	'handleToggleDrag': function (e) {
		var mouseX = e.pageX,
			deltaMouseX = mouseX - this.originMouseX,
			toggleLeft = this.$toggle.position().left,
			newToggleLeft = toggleLeft + deltaMouseX;

		if (newToggleLeft < 0) {
			this.$toggle.css({'left': 0});
		} else if (newToggleLeft + this.toggleWidth > this.sliderWidth) {
			this.$toggle.css({'left': this.sliderWidth - this.toggleWidth});
		} else {
			this.$toggle.css({'left': toggleLeft + deltaMouseX});
		}

		this.originMouseX = mouseX;
	},

	'setSliderWidth': function () {
		this.segmentWidth = this.$segments.outerWidth(true);
		this.sliderWidth = this.segmentWidth * this.$segments.length;
		this.toggleWidth = this.$toggle.width();
		this.$radioSlider.css({'width': this.sliderWidth});
	},

	'snapToggle': function (segment) {
		var toggleLeft = this.$toggle.position().left,
			nearestSegment = (!_.isUndefined(segment)) ? segment : Math.round(toggleLeft / this.segmentWidth);

		this.$toggle.css({'left': nearestSegment * this.segmentWidth});
		this.updateSourceInputs(nearestSegment);
	},

	'updateSourceInputs': function (selected) {
		var $selectedRadio = this.$radios.eq(selected);
		if($selectedRadio.is(':checked') === false) {
			$selectedRadio.attr('checked', true);
		}
	}

});