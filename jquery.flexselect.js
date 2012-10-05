/**
 * flexselect: a jQuery plugin, version: %RELEASE_VERSION% (%RELEASE_DATE%)
 * @requires jQuery v1.3 or later
 *
 * FlexSelect is a jQuery plugin that makes it easy to convert a select box into
 * a Quicksilver-style, autocompleting, flex matching selection tool.
 *
 * For usage and examples, visit:
 * http://rmm5t.github.com/jquery-flexselect/
 *
 * Licensed under the MIT:
 * http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright (c) 2009-2012, Ryan McGeary (ryan -[at]- mcgeary [*dot*] org)
 */
(function($) {
  $.flexselect = function(select, options) { this.init(select, options); };

  $.extend($.flexselect.prototype, {
    settings: {
      allowMismatch: false,
      allowMismatchBlank: true, // If "true" a user can backspace such that the value is nothing (even if no blank value was provided in the original criteria)
      sortBy: 'score', // 'score' || 'name'
      preSelection: true,
      selectedClass: "flexselect_selected",
      dropdownClass: "flexselect_dropdown",
      inputIdTransform:    function(id)   { return id + "_flexselect"; },
      inputNameTransform:  function(name) { return; },
      dropdownIdTransform: function(id)   { return id + "_flexselect_dropdown"; }
    },
    select: null,
    input: null,
    dropdown: null,
    dropdownList: null,
    cache: [],
    results: [],
    lastAbbreviation: null,
    abbreviationBeforeFocus: null,
    selectedIndex: 0,
    picked: false,
    allowMouseMove: true,
    dropdownMouseover: false, // Workaround for poor IE behaviors

    init: function(select, options) {
      this.settings = $.extend({}, this.settings, options);
      this.select = $(select);
      this.preloadCache();
      this.renderControls();
      this.wire();
    },

    preloadCache: function() {
      this.cache = this.select.children("option").map(function() {
        return { name: $.trim($(this).text()), value: $(this).val(), score: 0.0 };
      });
    },

    renderControls: function() {
      var selected = this.settings.preSelection ? this.select.children("option:selected") : null;

      this.input = $("<input type='text' autocomplete='off' />").attr({
        id: this.settings.inputIdTransform(this.select.attr("id")),
        name: this.settings.inputNameTransform(this.select.attr("name")),
        accesskey: this.select.attr("accesskey"),
        tabindex: this.select.attr("tabindex"),
        style: this.select.attr("style"),
        placeholder: this.select.attr("data-placeholder")
      }).addClass(this.select.attr("class")).val($.trim(selected ? selected.text():  '')).css({
        visibility: 'visible'
      });

      this.dropdown = $("<div></div>").attr({
        id: this.settings.dropdownIdTransform(this.select.attr("id"))
      }).addClass(this.settings.dropdownClass);
      this.dropdownList = $("<ul></ul>");
      this.dropdown.append(this.dropdownList);

      this.select.after(this.input).hide();
      $("body").append(this.dropdown);
    },

    wire: function() {
      var self = this;

      this.input.click(function() {
        self.lastAbbreviation = null;
        self.focus();
      });

      this.input.mouseup(function(event) {
        // This is so Safari selection actually occurs.
        event.preventDefault();
      });

      this.input.focus(function() {
        self.abbreviationBeforeFocus = self.input.val();
        self.input.select();
        if (!self.picked) self.filterResults();
      });

      this.input.blur(function() {
        if (!self.dropdownMouseover) {
          self.hide();
          if (self.settings.allowMismatchBlank && $.trim($(this).val()) == '')
            return this.setValue('');
          if (!self.settings.allowMismatch && !self.picked)
            self.reset();
        }
      });

      this.dropdownList.mouseover(function(event) {
        if (!self.allowMouseMove) {
          self.allowMouseMove = true;
    	  return;
        }

    	if (event.target.tagName == "LI") {
          var rows = self.dropdown.find("li");
          self.markSelected(rows.index($(event.target)));
        }
      });
      this.dropdownList.mouseleave(function() {
        self.markSelected(-1);
      });
      this.dropdownList.mouseup(function(event) {
        self.pickSelected();
        self.focusAndHide();
      });
      this.dropdown.mouseover(function(event) {
        self.dropdownMouseover = true;
      });
      this.dropdown.mouseleave(function(event) {
        self.dropdownMouseover = false;
      });
      this.dropdown.mousedown(function(event) {
        event.preventDefault();
      });

      this.input.keyup(function(event) {
        switch (event.keyCode) {
          case 13: // return
            event.preventDefault();
            self.pickSelected();
            self.focusAndHide();
            break;
          case 27: // esc
            event.preventDefault();
            self.reset();
            self.focusAndHide();
            break;
          default:
            self.filterResults();
            break;
        }
      });

      this.input.keydown(function(event) {
        switch (event.keyCode) {
          case 9:  // tab
            self.pickSelected();
            self.hide();
            break;
          case 33: // pgup
            event.preventDefault();
            self.markFirst();
            break;
          case 34: // pgedown
            event.preventDefault();
            self.markLast();
            break;
          case 38: // up
            event.preventDefault();
            self.moveSelected(-1);
            break;
          case 40: // down
            event.preventDefault();
            self.moveSelected(1);
            break;
          case 13: // return
          case 27: // esc
            event.preventDefault();
            event.stopPropagation();
            break;
        }
      });

      if (this.settings.preSelection) {
        var input = this.input;
        this.select.change(function () {
          input.val($.trim($(this).children('option:selected').text()));
        });
      }
    },

    filterResults: function() {
      var abbreviation = this.input.val();
      if (abbreviation == this.lastAbbreviation) return;

      var results = [];
      $.each(this.cache, function() {
        this.score = LiquidMetal.score(this.name, abbreviation);
        if (this.score > 0.0) results.push(this);
      });
      this.results = results;

      if (this.settings.sortBy == 'score')
        this.sortResultsByScore();
      else if (this.settings.sortBy == 'name')
        this.sortResultsByName();

      this.renderDropdown();
      this.markFirst();
      this.lastAbbreviation = abbreviation;
      this.picked = false;
      this.allowMouseMove = false;
    },

    sortResultsByScore: function() {
      this.results.sort(function(a, b) { return b.score - a.score; });
    },
    
    sortResultsByName: function() {
      this.results.sort(function(a, b) { return a.name < b.name ? -1 : (a.name > b.name ? 1 : 0); });
    },

    renderDropdown: function() {
      var dropdownBorderWidth = this.dropdown.outerWidth() - this.dropdown.innerWidth();
      var inputOffset = this.input.offset();
      this.dropdown.css({
        width: (this.input.outerWidth() - dropdownBorderWidth) + "px",
        top: (inputOffset.top + this.input.outerHeight()) + "px",
        left: inputOffset.left + "px",
        maxHeight: ''
      });

      var html = '';
      $.each(this.results, function() {
        //html += '<li>' + this.name + ' <small>[' + Math.round(this.score*100)/100 + ']</small></li>';
        html += '<li>' + this.name + '</li>';
      });
      this.dropdownList.html(html);
      this.adjustMaxHeight();
      this.dropdown.show();
    },
    
    adjustMaxHeight: function() {
      var maxTop = $(window).height() + $(window).scrollTop() - this.dropdown.outerHeight();
      var top = parseInt(this.dropdown.css('top'), 10);
      this.dropdown.css('max-height', top > maxTop ? (Math.max(0, maxTop - top + this.dropdown.innerHeight()) + 'px') : '');
    },

    markSelected: function(n) {
      if (n < 0 || n >= this.results.length) return;

      var rows = this.dropdown.find("li");
      rows.removeClass(this.settings.selectedClass);
      this.selectedIndex = n;

      var row = $(rows[n]).addClass(this.settings.selectedClass);
      var top = row.position().top;
      var delta = top + row.outerHeight() - this.dropdown.height();
      if (delta > 0) {
        this.allowMouseMove = false;
        this.dropdown.scrollTop(this.dropdown.scrollTop() + delta);
      } else if (top < 0) {
        this.allowMouseMove = false;
        this.dropdown.scrollTop(Math.max(0, this.dropdown.scrollTop() + top));
      }
    },

    pickSelected: function() {
      var selected = this.results[this.selectedIndex];
      if (selected) {
        this.input.val(selected.name);
        this.setValue(selected.value);
        this.picked = true;
      } else if (this.settings.allowMismatch) {
        this.setValue.val("");
      } else {
        this.reset();
      }
    },
    
    setValue: function(val) {
      if (this.select.val() === val) return;
      this.select.val(val).change();
    },

    hide: function() {
      this.dropdown.hide();
      this.lastAbbreviation = null;
    },

    moveSelected: function(n) { this.markSelected(this.selectedIndex+n); },
    markFirst:    function()  { this.markSelected(0); },
    markLast:     function()  { this.markSelected(this.results.length - 1); },
    reset:        function()  { this.input.val(this.abbreviationBeforeFocus); },
    focus:        function()  { this.input.focus(); },
    focusAndHide: function()  { this.focus(); this.hide(); }
  });

  $.fn.flexselect = function(options) {
    this.each(function() {
      if (this.tagName == "SELECT") new $.flexselect(this, options);
    });
    return this;
  };
})(jQuery);