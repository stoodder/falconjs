(function() {
  var LayoutView, ListItemView, ListView, SettingsView,
    __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  LayoutView = (function(_super) {

    __extends(LayoutView, _super);

    function LayoutView() {
      LayoutView.__super__.constructor.apply(this, arguments);
    }

    LayoutView.prototype.url = "#layout-view";

    LayoutView.prototype.initialize = function() {
      console.log("INIT");
      return this.current_view = ko.observable();
    };

    LayoutView.prototype.showSettings = function() {
      return this.current_view(new SettingsView);
    };

    LayoutView.prototype.showList = function() {
      return this.current_view(new ListView);
    };

    return LayoutView;

  })(Falcon.View);

  SettingsView = (function(_super) {

    __extends(SettingsView, _super);

    function SettingsView() {
      SettingsView.__super__.constructor.apply(this, arguments);
    }

    SettingsView.prototype.url = "#settings-view";

    SettingsView.prototype.dispose = function() {
      return console.log("Settings View Gone");
    };

    return SettingsView;

  })(Falcon.View);

  ListView = (function(_super) {

    __extends(ListView, _super);

    function ListView() {
      ListView.__super__.constructor.apply(this, arguments);
    }

    ListView.prototype.url = "#list-view";

    ListView.prototype.initialize = function() {
      this.itemA = new ListItemView("A");
      return this.itemB = new ListItemView("B");
    };

    ListView.prototype.dispose = function() {
      return console.log("List View Gone");
    };

    return ListView;

  })(Falcon.View);

  ListItemView = (function(_super) {

    __extends(ListItemView, _super);

    function ListItemView() {
      ListItemView.__super__.constructor.apply(this, arguments);
    }

    ListItemView.prototype.url = "#list-item-view";

    ListItemView.prototype.initialize = function(name) {
      return this.name = name;
    };

    ListItemView.prototype.dispose = function() {
      return console.log("Disposed of list item " + this.name);
    };

    return ListItemView;

  })(Falcon.View);

  Falcon.apply("#application", function() {
    return new LayoutView;
  });

}).call(this);
