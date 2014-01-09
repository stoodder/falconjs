(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Test View Methods", function() {
    var ViewA, ViewB, ViewC, ViewD, ViewE, ViewF, ViewG, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
    ViewA = (function(_super) {
      __extends(ViewA, _super);

      function ViewA() {
        _ref = ViewA.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ViewA.prototype.url = 'view_a';

      return ViewA;

    })(Falcon.View);
    ViewB = (function(_super) {
      __extends(ViewB, _super);

      function ViewB() {
        _ref1 = ViewB.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      ViewB.prototype.url = function() {
        return 'view_b';
      };

      return ViewB;

    })(Falcon.View);
    ViewC = (function(_super) {
      __extends(ViewC, _super);

      function ViewC() {
        _ref2 = ViewC.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      ViewC.prototype.url = '#view_c';

      return ViewC;

    })(Falcon.View);
    ViewD = (function(_super) {
      __extends(ViewD, _super);

      function ViewD() {
        _ref3 = ViewD.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      ViewD.prototype.url = function() {
        return '#view_d';
      };

      return ViewD;

    })(Falcon.View);
    ViewE = (function(_super) {
      __extends(ViewE, _super);

      function ViewE() {
        _ref4 = ViewE.__super__.constructor.apply(this, arguments);
        return _ref4;
      }

      ViewE.prototype.url = '/view_e';

      return ViewE;

    })(Falcon.View);
    ViewF = (function(_super) {
      __extends(ViewF, _super);

      function ViewF() {
        _ref5 = ViewF.__super__.constructor.apply(this, arguments);
        return _ref5;
      }

      ViewF.prototype.url = function() {
        return '/view_f';
      };

      return ViewF;

    })(Falcon.View);
    ViewG = (function(_super) {
      __extends(ViewG, _super);

      function ViewG() {
        _ref6 = ViewG.__super__.constructor.apply(this, arguments);
        return _ref6;
      }

      return ViewG;

    })(Falcon.View);
    beforeEach(function() {
      Falcon.baseTemplateUrl = "";
      Falcon.cache = false;
      return Falcon.View.resetCache();
    });
    describe("Test the constructor method", function() {
      var ajax_stub, init_stub, jquery_stub;
      init_stub = ajax_stub = jquery_stub = null;
      afterEach(function() {
        if (init_stub) {
          init_stub.restore();
        }
        if (ajax_stub) {
          ajax_stub.restore();
        }
        if (jquery_stub) {
          return jquery_stub.restore();
        }
      });
      it("Should call the initialize and ajax methods with the correct arguments", function() {
        var view;
        init_stub = sinon.stub(ViewA.prototype, "initialize");
        ajax_stub = sinon.stub($, "ajax");
        jquery_stub = sinon.stub(window, '$');
        view = new ViewA("Hello", 123);
        expect(view.is_loaded()).to.be["false"];
        expect(view._is_rendered).to.be["false"];
        expect(init_stub).to.have.been.calledOnce;
        expect(init_stub).to.have.been.calledWith("Hello", 123);
        expect(init_stub).to.have.been.calledOn(view);
        expect(ajax_stub).to.have.been.calledOnce;
        expect(ajax_stub).to.have.been.calledAfter(init_stub);
        expect(ajax_stub.firstCall.args[0]).not.to.be.undefined;
        return jquery_stub.should.not.have.been.called;
      });
      it("Should call the initialize and jquery methods with the correct arguments", function() {
        var view;
        init_stub = sinon.stub(ViewC.prototype, "initialize");
        ajax_stub = sinon.stub($, "ajax");
        jquery_stub = sinon.stub(window, '$').returns(window.jQuery("<div>"));
        view = new ViewC("Hello", 123);
        expect(view.is_loaded()).to.be["true"];
        expect(view._is_rendered).to.be["false"];
        expect(init_stub).to.have.been.calledOnce;
        expect(init_stub).to.have.been.calledWith("Hello", 123);
        expect(init_stub).to.have.been.calledOn(view);
        expect(jquery_stub).to.have.been.calledOnce;
        expect(jquery_stub).to.have.been.calledAfter(init_stub);
        return ajax_stub.should.not.have.been.called;
      });
      it("Should call the ajax method only once", function() {
        var view;
        ajax_stub = sinon.stub($, "ajax");
        jquery_stub = sinon.stub(window, '$');
        view = new ViewA();
        expect(view.is_loaded()).to.be["false"];
        expect(ajax_stub).to.have.been.calledOnce;
        expect(ajax_stub.firstCall.args[0]).not.to.be.undefined;
        ajax_stub.firstCall.args[0].success("Hello World");
        expect(view.is_loaded()).to.be["true"];
        expect(jquery_stub).to.not.have.been.called;
        ajax_stub.reset();
        view = new ViewA();
        expect(view.is_loaded()).to.be["true"];
        expect(ajax_stub).to.not.have.been.called;
        expect(jquery_stub).to.not.have.been.called;
        ajax_stub.reset();
        view = new ViewB();
        expect(view.is_loaded()).to.be["false"];
        expect(ajax_stub).to.have.been.calledOnce;
        expect(ajax_stub.firstCall.args[0]).not.to.be.undefined;
        ajax_stub.firstCall.args[0].success("Hello World");
        expect(view.is_loaded()).to.be["true"];
        return expect(jquery_stub).to.not.have.been.called;
      });
      it("Should call the jquery method only once", function() {
        var view;
        ajax_stub = sinon.stub($, "ajax");
        jquery_stub = sinon.stub(window, '$').returns(window.jQuery("<div>"));
        view = new ViewC();
        expect(view.is_loaded()).to.be["true"];
        expect(jquery_stub).to.have.been.calledOnce;
        expect(ajax_stub).to.not.have.been.called;
        jquery_stub.reset();
        view = new ViewC();
        expect(view.is_loaded()).to.be["true"];
        expect(jquery_stub).to.not.have.been.called;
        expect(ajax_stub).to.not.have.been.called;
        jquery_stub.reset();
        view = new ViewD();
        expect(view.is_loaded()).to.be["true"];
        expect(jquery_stub).to.have.been.calledOnce;
        return expect(ajax_stub).to.not.have.been.called;
      });
      return it("Should not have a template if one is not defined", function() {
        var view;
        ajax_stub = sinon.stub($, "ajax");
        jquery_stub = sinon.stub(window, '$').returns(window.jQuery("<div>"));
        view = new ViewG();
        expect(view.is_loaded()).to.be["true"];
        expect(jquery_stub).to.not.have.been.called;
        return expect(ajax_stub).to.not.have.been.called;
      });
    });
    describe("Testing the 'defaults' implementation", function() {
      it("Should create RawrView with defaults that have correct arguments", function() {
        var RawrView, hello_spy, rawr_class, _ref7;
        hello_spy = null;
        RawrView = (function(_super) {
          __extends(RawrView, _super);

          function RawrView() {
            _ref7 = RawrView.__super__.constructor.apply(this, arguments);
            return _ref7;
          }

          RawrView.prototype.defaults = {
            'hello': (hello_spy = sinon.spy())
          };

          return RawrView;

        })(Falcon.View);
        expect(hello_spy).to.not.have.been.called;
        rawr_class = new RawrView("one", "two", "three");
        expect(hello_spy).to.have.been.called;
        expect(hello_spy.callCount).to.equal(1);
        expect(hello_spy.firstCall.args.length).to.equal(3);
        expect(hello_spy.firstCall.args[0]).to.equal("one");
        expect(hello_spy.firstCall.args[1]).to.equal("two");
        return expect(hello_spy.firstCall.args[2]).to.equal("three");
      });
      return it("Should create RawrVIew with defaults that are numbers", function() {
        var RawrView, hello_spy, rawr_class, _ref7;
        hello_spy = null;
        RawrView = (function(_super) {
          __extends(RawrView, _super);

          function RawrView() {
            _ref7 = RawrView.__super__.constructor.apply(this, arguments);
            return _ref7;
          }

          RawrView.prototype.defaults = {
            'hello': (hello_spy = sinon.spy())
          };

          return RawrView;

        })(Falcon.View);
        expect(hello_spy).to.not.have.been.called;
        rawr_class = new RawrView(1234);
        expect(hello_spy).to.have.been.called;
        expect(hello_spy.callCount).to.equal(1);
        expect(hello_spy.firstCall.args.length).to.equal(1);
        return expect(hello_spy.firstCall.args[0]).to.equal(1234);
      });
    });
    describe("Test the makeUrl() method", function() {
      var ajax_stub;
      ajax_stub = null;
      beforeEach(function() {
        return ajax_stub = sinon.stub($, 'ajax');
      });
      afterEach(function() {
        return ajax_stub.restore();
      });
      it("Should generate the correct relative url from string", function() {
        return expect(new ViewA().makeUrl()).to.equal("/view_a");
      });
      it("Should generate the correct relative url from function", function() {
        return expect(new ViewB().makeUrl()).to.equal("/view_b");
      });
      it("Should generate the correct element id from string", function() {
        return expect(new ViewC().makeUrl()).to.equal("#view_c");
      });
      it("Should generate the correct element id from function", function() {
        return expect(new ViewD().makeUrl()).to.equal("#view_d");
      });
      it("Should generate the correct relative url from string beginning with '/'", function() {
        return expect(new ViewE().makeUrl()).to.equal("/view_e");
      });
      it("Should generate the correct relative url from function beginning with '/'", function() {
        return expect(new ViewF().makeUrl()).to.equal("/view_f");
      });
      it("Should generate the correct relative url from string with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewA().makeUrl()).to.equal("http://www.falconjs.com/view_a");
      });
      it("Should generate the correct relative url from function with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewB().makeUrl()).to.equal("http://www.falconjs.com/view_b");
      });
      it("Should generate the correct element id from string with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewC().makeUrl()).to.equal("#view_c");
      });
      it("Should generate the correct element id from function with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewD().makeUrl()).to.equal("#view_d");
      });
      it("Should generate the correct relative url from string beginning with '/' with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewE().makeUrl()).to.equal("http://www.falconjs.com/view_e");
      });
      it("Should generate the correct relative url from function beginning with '/' with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewF().makeUrl()).to.equal("http://www.falconjs.com/view_f");
      });
      it("Should generate the correct relative url from string with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewA().makeUrl()).to.equal("http://www.falconjs.com/view_a");
      });
      it("Should generate the correct relative url from function with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewB().makeUrl()).to.equal("http://www.falconjs.com/view_b");
      });
      it("Should generate the correct element id from string with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewC().makeUrl()).to.equal("#view_c");
      });
      it("Should generate the correct element id from function with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewD().makeUrl()).to.equal("#view_d");
      });
      it("Should generate the correct relative url from string beginning with '/' with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewE().makeUrl()).to.equal("http://www.falconjs.com/view_e");
      });
      it("Should generate the correct relative url from function beginning with '/' with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewF().makeUrl()).to.equal("http://www.falconjs.com/view_f");
      });
      return it("Should not make a url for a 'null' url defined", function() {
        expect(new ViewG().makeUrl()).to.equal(null);
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewG().makeUrl()).to.equal(null);
      });
    });
    return describe("Test the viewModel() method", function() {
      var FullView, ajax_stub, _ref7;
      FullView = (function(_super) {
        __extends(FullView, _super);

        function FullView() {
          _ref7 = FullView.__super__.constructor.apply(this, arguments);
          return _ref7;
        }

        FullView.prototype.url = 'full_view';

        FullView.prototype.observables = {
          'hello': 'world',
          'foo': function() {
            return 'bar';
          },
          'small': function() {
            return this.hello() + " " + this.foo();
          }
        };

        FullView.prototype['test'] = function() {
          return 'things';
        };

        FullView.prototype['another'] = function(something, newer) {
          return this.test() + " " + something + " " + newer;
        };

        return FullView;

      })(Falcon.View);
      ajax_stub = null;
      beforeEach(function() {
        return ajax_stub = sinon.stub($, 'ajax');
      });
      afterEach(function() {
        return ajax_stub.restore();
      });
      it("Should create a valid view model", function() {
        var another_stub, test_stub, view, viewModel;
        view = new FullView;
        test_stub = sinon.stub(view, 'test');
        another_stub = sinon.stub(view, 'another');
        expect(ko.isObservable(view.hello)).to.be["true"];
        expect(view.hello()).to.be.equal('world');
        expect(ko.isComputed(view.foo)).to.be["true"];
        expect(view.foo()).to.be.equal('bar');
        expect(ko.isComputed(view.small)).to.be["true"];
        expect(view.small()).to.be.equal('world bar');
        expect(view.test).to.be.a('function');
        expect(view.another).to.be.a('function');
        viewModel = view.viewModel();
        expect(ko.isObservable(viewModel.hello)).to.be["true"];
        expect(viewModel.hello()).to.be.equal('world');
        expect(ko.isComputed(viewModel.foo)).to.be["true"];
        expect(viewModel.foo()).to.be.equal('bar');
        expect(ko.isComputed(viewModel.small)).to.be["true"];
        expect(viewModel.small()).to.be.equal('world bar');
        expect(viewModel.test).to.be.a('function');
        expect(viewModel.test).to.not.equal(view.test);
        expect(viewModel.another).to.be.a('function');
        expect(viewModel.another).to.not.equal(view.another);
        expect(test_stub).to.not.have.been.called;
        expect(another_stub).to.not.have.been.called;
        viewModel.test();
        viewModel.another('hello', 'world');
        expect(test_stub).to.have.been.calledOnce;
        expect(test_stub).to.have.been.calledOn(view);
        expect(another_stub).to.have.been.calledOnce;
        expect(another_stub).to.have.been.calledWith('hello', 'world');
        expect(another_stub).to.have.been.calledOn(view);
        test_stub.restore();
        return another_stub.restore();
      });
      return it("Should create equal viewModels after the first has been generated", function() {
        var model1, model2, view;
        view = new FullView;
        model1 = view.viewModel();
        model2 = view.viewModel();
        return expect(model1).to.equal(model2);
      });
    });
  });

}).call(this);
