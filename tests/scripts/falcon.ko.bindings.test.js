(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Test Knockout Bindings", function() {
    var $application, $body, application_index, applyApp;

    $application = null;
    application_index = 0;
    $body = $("body");
    applyApp = function(view) {
      application_index++;
      if ($application != null) {
        $application.remove();
      }
      $body.append($application = $("<div id='application_" + application_index + "'></div>"));
      return Falcon.apply(view, "#application_" + application_index);
    };
    describe("Test view binding", function() {
      var $content_template, $footer_template, $layout_template, ContentView, FooterView, LayoutView, view_binding, view_init_spy, view_update_spy, _ref, _ref1, _ref2;

      view_binding = ko.bindingHandlers['view'];
      LayoutView = (function(_super) {
        __extends(LayoutView, _super);

        function LayoutView() {
          _ref = LayoutView.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        LayoutView.prototype.url = '#layout-template';

        LayoutView.prototype.observables = {
          content_view: null,
          footer_view: null
        };

        LayoutView.prototype.initialize = function() {
          this.content_view(new ContentView);
          return this.footer_view(new FooterView);
        };

        return LayoutView;

      })(Falcon.View);
      $layout_template = $("			<template id='layout-template'>				<div data-bind='view: $view.content_view'>				</div>				<div data-bind='view: $view.footer_view'>				</div>			</template>		");
      ContentView = (function(_super) {
        __extends(ContentView, _super);

        function ContentView() {
          _ref1 = ContentView.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        ContentView.prototype.url = '#content-template';

        return ContentView;

      })(Falcon.View);
      $content_template = $("			<template id='content-template'>				The Content			</template>		");
      FooterView = (function(_super) {
        __extends(FooterView, _super);

        function FooterView() {
          _ref2 = FooterView.__super__.constructor.apply(this, arguments);
          return _ref2;
        }

        FooterView.prototype.url = '#footer-template';

        return FooterView;

      })(Falcon.View);
      $footer_template = $("			<template id='footer-template'>				The Footer			</template>		");
      view_init_spy = view_update_spy = null;
      before(function() {
        $body.append($layout_template);
        $body.append($footer_template);
        $body.append($content_template);
        view_init_spy = sinon.spy(view_binding, 'init');
        return view_update_spy = sinon.spy(view_binding, 'update');
      });
      after(function() {
        $layout_template.remove();
        $footer_template.remove();
        $content_template.remove();
        view_init_spy.restore();
        return view_update_spy.restore();
      });
      it("Should call the view binding on initialization without an observable", function() {
        var render_spy, unrender_spy, view;

        view = new ContentView;
        render_spy = sinon.spy(view, 'render');
        unrender_spy = sinon.spy(view, 'unrender');
        expect(view_init_spy).to.not.have.been.called;
        expect(view_update_spy).to.not.have.been.called;
        expect(render_spy).to.not.have.been.called;
        expect(unrender_spy).to.not.have.been.called;
        applyApp(view);
        expect(view_init_spy).to.have.been.calledOnce;
        expect(view_update_spy).to.have.been.calledOnce;
        expect(render_spy).to.have.been.calledOnce;
        return expect(unrender_spy).to.not.have.been.called;
      });
      return describe("Testing changes in views that are contained in observales", function() {
        var content_display_spy, content_dispose_spy, content_render_spy, content_unrender_spy, content_view, display_spy, dispose_spy, footer_display_spy, footer_dispose_spy, footer_render_spy, footer_unrender_spy, footer_view, obs, render_spy, unrender_spy, view;

        view = new LayoutView;
        content_view = view.content_view();
        footer_view = view.footer_view();
        obs = ko.observable(null);
        render_spy = sinon.spy(view, 'render');
        unrender_spy = sinon.spy(view, 'unrender');
        display_spy = sinon.spy(view, 'display');
        dispose_spy = sinon.spy(view, 'dispose');
        content_render_spy = sinon.spy(content_view, 'render');
        content_unrender_spy = sinon.spy(content_view, 'unrender');
        content_display_spy = sinon.spy(content_view, 'display');
        content_dispose_spy = sinon.spy(content_view, 'dispose');
        footer_render_spy = sinon.spy(footer_view, 'render');
        footer_unrender_spy = sinon.spy(footer_view, 'unrender');
        footer_display_spy = sinon.spy(footer_view, 'display');
        footer_dispose_spy = sinon.spy(footer_view, 'dispose');
        beforeEach(function() {
          view_init_spy.reset();
          view_update_spy.reset();
          render_spy.reset();
          content_render_spy.reset();
          footer_render_spy.reset();
          display_spy.reset();
          content_display_spy.reset();
          footer_display_spy.reset();
          unrender_spy.reset();
          content_unrender_spy.reset();
          footer_unrender_spy.reset();
          dispose_spy.reset();
          content_dispose_spy.reset();
          return footer_dispose_spy.reset();
        });
        it("Should not call any render or unrender methods on unassigned observable", function() {
          applyApp(obs);
          expect(view_init_spy).to.have.been.calledOnce;
          expect(view_update_spy).to.have.been.calledOnce;
          expect(render_spy).to.not.have.been.called;
          expect(content_render_spy).to.not.have.been.called;
          expect(footer_render_spy).to.not.have.been.called;
          expect(display_spy).to.not.have.been.called;
          expect(content_display_spy).to.not.have.been.called;
          expect(footer_display_spy).to.not.have.been.called;
          expect(unrender_spy).to.not.have.been.called;
          expect(content_render_spy).to.not.have.been.called;
          expect(footer_unrender_spy).to.not.have.been.called;
          expect(dispose_spy).to.not.have.been.called;
          expect(content_dispose_spy).to.not.have.been.called;
          return expect(footer_dispose_spy).to.not.have.been.called;
        });
        it("Should call init, update, and render the correct number of times", function() {
          obs(view);
          expect(view_init_spy).to.have.been.calledTwice;
          expect(view_update_spy).to.have.been.calledThrice;
          expect(render_spy).to.have.been.calledOnce;
          expect(content_render_spy).to.have.been.calledOnce;
          expect(footer_render_spy).to.have.been.calledOnce;
          expect(display_spy).to.have.been.calledOnce;
          expect(content_display_spy).to.have.been.calledOnce;
          expect(footer_display_spy).to.have.been.calledOnce;
          expect(unrender_spy).to.not.have.been.called;
          expect(content_unrender_spy).to.not.have.been.called;
          expect(footer_unrender_spy).to.not.have.been.called;
          expect(dispose_spy).to.not.have.been.called;
          expect(content_dispose_spy).to.not.have.been.called;
          return expect(footer_dispose_spy).to.not.have.been.called;
        });
        it("Should react to a child view being updated", function() {
          view.content_view(new ContentView);
          expect(view_init_spy).to.not.have.been.called;
          expect(view_update_spy).to.have.been.calledOnce;
          expect(render_spy).to.not.have.been.called;
          expect(content_render_spy).to.not.have.been.called;
          expect(footer_render_spy).to.not.have.been.called;
          expect(display_spy).to.not.have.been.called;
          expect(content_display_spy).to.not.have.been.called;
          expect(footer_display_spy).to.not.have.been.called;
          expect(unrender_spy).to.not.have.been.called;
          expect(content_unrender_spy).to.have.been.calledOnce;
          expect(footer_unrender_spy).to.not.have.been.called;
          expect(dispose_spy).to.not.have.been.called;
          expect(content_dispose_spy).to.have.been.calledOnce;
          return expect(footer_dispose_spy).to.not.have.been.called;
        });
        return it("Should react to the entire, root, view being updated", function() {
          obs(new ContentView);
          expect(view_init_spy).to.not.have.been.called;
          expect(view_update_spy).to.have.been.calledOnce;
          expect(render_spy).to.not.have.been.called;
          expect(content_render_spy).to.not.have.been.called;
          expect(footer_render_spy).to.not.have.been.called;
          expect(display_spy).to.not.have.been.called;
          expect(content_display_spy).to.not.have.been.called;
          expect(footer_display_spy).to.not.have.been.called;
          expect(unrender_spy).to.have.been.calledOnce;
          expect(content_unrender_spy).to.have.been.calledOnce;
          expect(footer_unrender_spy).to.have.been.calledTwice;
          expect(dispose_spy).to.have.been.calledOnce;
          expect(content_dispose_spy).to.have.not.been.called;
          return expect(footer_dispose_spy).to.have.been.calledOnce;
        });
      });
    });
    describe("Test updated foreach binding", function() {
      var CollectionA, ModelA, foreach_binding, foreach_init_spy, foreach_update_spy, _ref, _ref1;

      foreach_binding = ko.bindingHandlers['foreach'];
      foreach_init_spy = foreach_update_spy = null;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        ModelA.prototype.defaults = {
          'hello': 'world'
        };

        ModelA.prototype.observables = {
          'foo': 'bar'
        };

        return ModelA;

      })(Falcon.Model);
      CollectionA = (function(_super) {
        __extends(CollectionA, _super);

        function CollectionA() {
          _ref1 = CollectionA.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        CollectionA.prototype.model = ModelA;

        return CollectionA;

      })(Falcon.Collection);
      describe("Test flat bindings against arrays and collections", function() {
        var $array_list, $array_list_options, $collection_list, $collection_list_options, $layout_template, LayoutView, after_add_spy, before_remove_spy, view, view_observable, _ref2;

        LayoutView = (function(_super) {
          __extends(LayoutView, _super);

          function LayoutView() {
            _ref2 = LayoutView.__super__.constructor.apply(this, arguments);
            return _ref2;
          }

          LayoutView.prototype.url = '#layout-template';

          LayoutView.prototype.defaults = {
            'collection_list': function() {
              return new CollectionA;
            },
            'collection_list_options': function() {
              return new CollectionA;
            }
          };

          LayoutView.prototype.observables = {
            'array_list': [],
            'array_list_options': []
          };

          LayoutView.prototype.afterAdd = function() {};

          LayoutView.prototype.beforeRemove = function(element) {
            return element.remove();
          };

          return LayoutView;

        })(Falcon.View);
        $layout_template = $("				<template id='layout-template'>					<ul class='array_list' data-bind='foreach: $view.array_list'><li>An Item</li></ul>					<ul class='collection_list' data-bind='foreach: $view.collection_list'><li>An Item</li></ul>					<ul class='array_list_options' data-bind='foreach: {data: $view.array_list_options, afterAdd: $view.afterAdd, beforeRemove: $view.beforeRemove}'><li>An Item</li></ul>					<ul class='collection_list_options' data-bind='foreach: {data: $view.collection_list_options, afterAdd: $view.afterAdd, beforeRemove: $view.beforeRemove}'><li>An Item</li></ul>				</template>			");
        view = null;
        view_observable = ko.observable();
        $array_list = $collection_list = null;
        $array_list_options = $collection_list_options = null;
        after_add_spy = before_remove_spy = null;
        before(function() {
          $body.append($application);
          $body.append($layout_template);
          foreach_init_spy = sinon.spy(foreach_binding, 'init');
          foreach_update_spy = sinon.spy(foreach_binding, 'update');
          return applyApp(view_observable);
        });
        beforeEach(function() {
          var prev_array_list;

          view = new LayoutView;
          view_observable(view);
          after_add_spy = sinon.spy(view.viewModel(), 'afterAdd');
          before_remove_spy = sinon.spy(view.viewModel(), 'beforeRemove');
          prev_array_list = $array_list;
          $array_list = $(".array_list");
          $collection_list = $(".collection_list");
          $array_list_options = $(".array_list_options");
          return $collection_list_options = $(".collection_list_options");
        });
        afterEach(function() {
          $application.empty();
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          after_add_spy.restore();
          return before_remove_spy.restore();
        });
        after(function() {
          $application.remove();
          $layout_template.remove();
          foreach_init_spy.restore();
          return foreach_update_spy.restore();
        });
        it("Should properly list with an observable array", function() {
          expect(foreach_init_spy).to.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.not.have.been.called;
          expect(before_remove_spy).to.not.have.been.called;
          expect(foreach_init_spy.callCount).to.equal(4);
          expect(foreach_update_spy.callCount).to.equal(4);
          expect($array_list.children().length).to.equal(0);
          expect($collection_list.children().length).to.equal(0);
          expect($array_list_options.children().length).to.equal(0);
          expect($collection_list_options.children().length).to.equal(0);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.array_list.push("Hello");
          view.array_list.push("World", "Foo Bar");
          expect(foreach_init_spy).to.not.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.not.have.been.called;
          expect(before_remove_spy).to.not.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(2);
          expect($array_list.children().length).to.equal(3);
          expect($collection_list.children().length).to.equal(0);
          expect($array_list_options.children().length).to.equal(0);
          expect($collection_list_options.children().length).to.equal(0);
          foreach_update_spy.reset();
          view.array_list.pop();
          expect(foreach_init_spy).to.not.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.not.have.been.called;
          expect(before_remove_spy).to.not.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(1);
          expect($array_list.children().length).to.equal(2);
          expect($collection_list.children().length).to.equal(0);
          expect($array_list_options.children().length).to.equal(0);
          return expect($collection_list_options.children().length).to.equal(0);
        });
        it("Should properly list with a collection", function() {
          expect(foreach_init_spy).to.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.not.have.been.called;
          expect(before_remove_spy).to.not.have.been.called;
          expect(foreach_init_spy.callCount).to.equal(4);
          expect(foreach_update_spy.callCount).to.equal(4);
          expect($array_list.children().length).to.equal(0);
          expect($collection_list.children().length).to.equal(0);
          expect($array_list_options.children().length).to.equal(0);
          expect($collection_list_options.children().length).to.equal(0);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.collection_list.push(new ModelA);
          view.collection_list.push([new ModelA, new ModelA]);
          expect(foreach_init_spy).to.not.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.not.have.been.called;
          expect(before_remove_spy).to.not.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(2);
          expect($array_list.children().length).to.equal(0);
          expect($collection_list.children().length).to.equal(3);
          expect($array_list_options.children().length).to.equal(0);
          expect($collection_list_options.children().length).to.equal(0);
          foreach_update_spy.reset();
          view.collection_list.pop();
          expect(foreach_init_spy).to.not.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.not.have.been.called;
          expect(before_remove_spy).to.not.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(1);
          expect($array_list.children().length).to.equal(0);
          expect($collection_list.children().length).to.equal(2);
          expect($array_list_options.children().length).to.equal(0);
          return expect($collection_list_options.children().length).to.equal(0);
        });
        it("Should properly list with an observable array including options", function() {
          expect(foreach_init_spy).to.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.not.have.been.called;
          expect(before_remove_spy).to.not.have.been.called;
          expect(foreach_init_spy.callCount).to.equal(4);
          expect(foreach_update_spy.callCount).to.equal(4);
          expect($array_list.children().length).to.equal(0);
          expect($collection_list.children().length).to.equal(0);
          expect($array_list_options.children().length).to.equal(0);
          expect($collection_list_options.children().length).to.equal(0);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.array_list_options.push("Hello2");
          view.array_list_options.push("World2", "Foo Bar2");
          expect(foreach_init_spy).to.not.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.have.been.called;
          expect(before_remove_spy).to.not.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(2);
          expect(after_add_spy.callCount).to.equal(3);
          expect($array_list.children().length).to.equal(0);
          expect($collection_list.children().length).to.equal(0);
          expect($array_list_options.children().length).to.equal(3);
          expect($collection_list_options.children().length).to.equal(0);
          foreach_update_spy.reset();
          after_add_spy.reset();
          view.array_list_options.pop();
          view.array_list_options.pop();
          expect(foreach_init_spy).to.not.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.not.have.been.called;
          expect(before_remove_spy).to.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(2);
          expect(before_remove_spy.callCount).to.equal(2);
          expect($array_list.children().length).to.equal(0);
          expect($collection_list.children().length).to.equal(0);
          expect($array_list_options.children().length).to.equal(1);
          return expect($collection_list_options.children().length).to.equal(0);
        });
        return it("Should properly list with a collection including options", function() {
          expect(foreach_init_spy).to.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.not.have.been.called;
          expect(before_remove_spy).to.not.have.been.called;
          expect(foreach_init_spy.callCount).to.equal(4);
          expect(foreach_update_spy.callCount).to.equal(4);
          expect($array_list.children().length).to.equal(0);
          expect($collection_list.children().length).to.equal(0);
          expect($array_list_options.children().length).to.equal(0);
          expect($collection_list_options.children().length).to.equal(0);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.collection_list_options.push(new ModelA);
          view.collection_list_options.push([new ModelA, new ModelA]);
          expect(foreach_init_spy).to.not.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.have.been.called;
          expect(before_remove_spy).to.not.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(2);
          expect(after_add_spy.callCount).to.equal(3);
          expect($array_list.children().length).to.equal(0);
          expect($collection_list.children().length).to.equal(0);
          expect($array_list_options.children().length).to.equal(0);
          expect($collection_list_options.children().length).to.equal(3);
          foreach_update_spy.reset();
          after_add_spy.reset();
          view.collection_list_options.pop();
          view.collection_list_options.pop();
          expect(foreach_init_spy).to.not.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(after_add_spy).to.not.have.been.called;
          expect(before_remove_spy).to.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(2);
          expect(before_remove_spy.callCount).to.equal(2);
          expect($array_list.children().length).to.equal(0);
          expect($collection_list.children().length).to.equal(0);
          expect($array_list_options.children().length).to.equal(0);
          return expect($collection_list_options.children().length).to.equal(1);
        });
      });
      return describe("Test observable bindings against collections", function() {
        var $collection_list, $layout_template, LayoutView, after_add_spy, before_remove_spy, view, view_observable, _ref2;

        LayoutView = (function(_super) {
          __extends(LayoutView, _super);

          function LayoutView() {
            _ref2 = LayoutView.__super__.constructor.apply(this, arguments);
            return _ref2;
          }

          LayoutView.prototype.url = '#layout-template';

          LayoutView.prototype.defaults = {
            'collection_a1': function() {
              return new CollectionA;
            },
            'collection_a2': function() {
              return new CollectionA;
            }
          };

          LayoutView.prototype.observables = {
            'selected_number': 1,
            'selected_collection': function() {
              return (this.selected_number() === 1 ? this.collection_a1 : this.collection_a2);
            }
          };

          return LayoutView;

        })(Falcon.View);
        $layout_template = $("				<template id='layout-template'>					<ul class='collection_list' data-bind='foreach: $view.selected_collection'><li>An Item</li></ul>				</template>			");
        view = null;
        view_observable = ko.observable();
        $collection_list = null;
        after_add_spy = before_remove_spy = null;
        before(function() {
          $body.append($layout_template);
          foreach_init_spy = sinon.spy(foreach_binding, 'init');
          foreach_update_spy = sinon.spy(foreach_binding, 'update');
          return applyApp(view_observable);
        });
        beforeEach(function() {
          view = new LayoutView;
          view_observable(view);
          return $collection_list = $(".collection_list");
        });
        afterEach(function() {
          $application.empty();
          foreach_init_spy.reset();
          return foreach_update_spy.reset();
        });
        after(function() {
          $application.remove();
          $layout_template.remove();
          foreach_init_spy.restore();
          return foreach_update_spy.restore();
        });
        return it("Should properly update if collection is switched to another with same update count", function() {
          expect(foreach_init_spy).to.have.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(foreach_init_spy.callCount).to.equal(1);
          expect(foreach_update_spy.callCount).to.equal(1);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.collection_a1.fill([new ModelA, new ModelA]);
          view.collection_a2.fill([new ModelA, new ModelA, new ModelA, new ModelA, new ModelA]);
          expect(foreach_init_spy).to.have.not.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(1);
          expect($collection_list.children().length).to.equal(2);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.selected_number(2);
          expect(foreach_init_spy).to.have.not.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(1);
          expect($collection_list.children().length).to.equal(5);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.selected_number(1);
          expect(foreach_init_spy).to.have.not.been.called;
          expect(foreach_update_spy).to.have.been.called;
          expect(foreach_update_spy.callCount).to.equal(1);
          return expect($collection_list.children().length).to.equal(2);
        });
      });
    });
    describe("Test updated options binding", function() {});
    return describe("Test log binding", function() {});
  });

}).call(this);
