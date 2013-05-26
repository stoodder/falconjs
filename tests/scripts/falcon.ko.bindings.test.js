(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Test Knockout Bindings", function() {
    describe("Test view binding", function() {
      var $application, $body, $content_template, $footer_template, $layout_template, ContentView, FooterView, LayoutView, view_binding, view_init_spy, view_update_spy, _application, _conent_template, _footer_template, _layout_template, _ref, _ref1, _ref2;

      view_binding = ko.bindingHandlers['view'];
      $body = $("body");
      $application = $("<div id='application'></div>");
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
      _application = _layout_template = _footer_template = _conent_template = null;
      view_init_spy = view_update_spy = null;
      before(function() {
        $body.append($application);
        $body.append($layout_template);
        $body.append($footer_template);
        $body.append($content_template);
        view_init_spy = sinon.spy(view_binding, 'init');
        return view_update_spy = sinon.spy(view_binding, 'update');
      });
      after(function() {
        $application.remove();
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
        Falcon.apply(view, "#application");
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
          Falcon.apply(obs, "#application");
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
        it("Should call init, update, and render the correct number od times", function() {
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
    describe("Test updated foreach binding", function() {});
    describe("Test updated options binding", function() {});
    return describe("Test log binding", function() {});
  });

}).call(this);
