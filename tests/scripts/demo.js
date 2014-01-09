(function() {
  var $root, ContentView, LayoutView, OtherView, SomeSubView, layout_view, _ref, _ref1, _ref2, _ref3,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  LayoutView = (function(_super) {
    __extends(LayoutView, _super);

    function LayoutView() {
      _ref = LayoutView.__super__.constructor.apply(this, arguments);
      return _ref;
    }

    LayoutView.prototype.url = "#layout-tmpl";

    LayoutView.prototype.observables = {
      "current_view": null
    };

    LayoutView.prototype.showContentView = function() {
      return this.current_view(new ContentView);
    };

    LayoutView.prototype.showOtherView = function() {
      return this.current_view(new OtherView);
    };

    LayoutView.prototype.display = function() {
      return alert("LAYOUT IN");
    };

    LayoutView.prototype.dispose = function() {
      return alert("LAYOUT OUT");
    };

    return LayoutView;

  })(Falcon.View);

  OtherView = (function(_super) {
    __extends(OtherView, _super);

    function OtherView() {
      _ref1 = OtherView.__super__.constructor.apply(this, arguments);
      return _ref1;
    }

    OtherView.prototype.url = "#other-tmpl";

    return OtherView;

  })(Falcon.View);

  ContentView = (function(_super) {
    __extends(ContentView, _super);

    function ContentView() {
      _ref2 = ContentView.__super__.constructor.apply(this, arguments);
      return _ref2;
    }

    ContentView.prototype.url = "#content-tmpl";

    ContentView.prototype.defaults = {
      'sub_view': function() {
        return new SomeSubView;
      }
    };

    ContentView.prototype.observables = {
      the_text: "No Worries",
      a_list: []
    };

    ContentView.prototype.initialize = function() {
      var i, _i, _results;
      _results = [];
      for (i = _i = 0; _i <= 3; i = ++_i) {
        _results.push(this.addItem());
      }
      return _results;
    };

    ContentView.prototype.display = function() {
      return alert("Hello! I am content view");
    };

    ContentView.prototype.dispose = function() {
      return alert("Good Bye! This has been content view");
    };

    ContentView.prototype.addItem = function() {
      return this.a_list.push(new Date);
    };

    ContentView.prototype.removeItem = function(item) {
      return this.a_list.remove(item);
    };

    ContentView.prototype.beHappy = function() {
      this.the_text("Be Happy");
      return console.log(this instanceof ContentView);
    };

    return ContentView;

  })(Falcon.View);

  SomeSubView = (function(_super) {
    __extends(SomeSubView, _super);

    function SomeSubView() {
      _ref3 = SomeSubView.__super__.constructor.apply(this, arguments);
      return _ref3;
    }

    SomeSubView.prototype.url = "#subview-tmpl";

    SomeSubView.prototype.display = function() {
      return alert("Hello! I am sub view");
    };

    SomeSubView.prototype.dispose = function() {
      return alert("Good Bye! This has been sub view");
    };

    return SomeSubView;

  })(Falcon.View);

  $root = ko.observable();

  Falcon.apply($root);

  layout_view = new LayoutView;

  window.hideView = function() {
    return $root(null);
  };

  window.showView = function() {
    return $root(layout_view);
  };

}).call(this);
