(function() {
  describe("Falcon", function() {
    describe("apply", function() {
      var view;
      view = null;
      beforeEach(function() {
        var observable_view;
        spyOn(ko, 'applyBindings');
        view = new Falcon.View;
        return observable_view = ko.observable(view);
      });
      it("Should find the correct element with an HTMLElement", function() {
        var callback, element, observable, ret;
        element = document.createElement("div");
        document.body.appendChild(element);
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, element, callback);
        expect(ko.applyBindings.calls.count()).toBe(1);
        expect(ko.applyBindings).toHaveBeenCalledWith(jasmine.any(Function), element);
        observable = ko.applyBindings.calls.mostRecent().args[0];
        expect(ko.isObservable(observable)).toBe(true);
        expect(observable()).toBe(view);
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should find the correct element by id", function() {
        var callback, element, observable, ret;
        element = document.createElement("div");
        element.setAttribute("id", "test");
        document.body.appendChild(element);
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, "#test", callback);
        expect(ko.applyBindings.calls.count()).toBe(1);
        expect(ko.applyBindings).toHaveBeenCalledWith(jasmine.any(Function), element);
        observable = ko.applyBindings.calls.mostRecent().args[0];
        expect(ko.isObservable(observable)).toBe(true);
        expect(observable()).toBe(view);
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should find the correct element using Falcon.applicationElement", function() {
        var callback, element, observable, ret;
        element = document.createElement("div");
        document.body.appendChild(element);
        Falcon.applicationElement = element;
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, callback);
        expect(ko.applyBindings.calls.count()).toBe(1);
        expect(ko.applyBindings).toHaveBeenCalledWith(jasmine.any(Function), element);
        observable = ko.applyBindings.calls.mostRecent().args[0];
        expect(ko.isObservable(observable)).toBe(true);
        expect(observable()).toBe(view);
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should find the correct element by id us Falcon.applicationElement", function() {
        var callback, element, observable, ret;
        element = document.createElement("div");
        element.setAttribute("id", "test");
        document.body.appendChild(element);
        Falcon.applicationElement = "#test";
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, callback);
        expect(ko.applyBindings.calls.count()).toBe(1);
        expect(ko.applyBindings).toHaveBeenCalledWith(jasmine.any(Function), element);
        observable = ko.applyBindings.calls.mostRecent().args[0];
        expect(ko.isObservable(observable)).toBe(true);
        expect(observable()).toBe(view);
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should allow for an HTMLElement as the applicationElement", function() {
        var callback, element, observable, ret;
        element = document.createElement("div");
        document.body.appendChild(element);
        Falcon.applicationElement = element;
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, callback);
        expect(ko.applyBindings.calls.count()).toBe(1);
        expect(ko.applyBindings).toHaveBeenCalledWith(jasmine.any(Function), element);
        observable = ko.applyBindings.calls.mostRecent().args[0];
        expect(ko.isObservable(observable)).toBe(true);
        expect(observable()).toBe(view);
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should find the correct element by id in the applicationEement", function() {
        var callback, element, observable, ret;
        element = document.createElement("div");
        element.setAttribute("id", "test");
        document.body.appendChild(element);
        Falcon.applicationElement = "#test";
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, callback);
        expect(ko.applyBindings.calls.count()).toBe(1);
        expect(ko.applyBindings).toHaveBeenCalledWith(jasmine.any(Function), element);
        observable = ko.applyBindings.calls.mostRecent().args[0];
        expect(ko.isObservable(observable)).toBe(true);
        expect(observable()).toBe(view);
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should not fail if no element can be found", function() {
        var callback, observable, ret;
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, "#notreal", callback);
        expect(ko.applyBindings.calls.count()).toBe(1);
        expect(ko.applyBindings).toHaveBeenCalledWith(jasmine.any(Function), document.body);
        observable = ko.applyBindings.calls.mostRecent().args[0];
        expect(ko.isObservable(observable)).toBe(true);
        expect(observable()).toBe(view);
        expect(callback.calls.count()).toBe(1);
        return expect(ret).toBe(Falcon);
      });
      return it("Should not fail if no applicationElement can be found", function() {
        var callback, observable, ret;
        Falcon.applicationElement = "#notreal";
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, callback);
        expect(ko.applyBindings.calls.count()).toBe(1);
        expect(ko.applyBindings).toHaveBeenCalledWith(jasmine.any(Function), document.body);
        observable = ko.applyBindings.calls.mostRecent().args[0];
        expect(ko.isObservable(observable)).toBe(true);
        expect(observable()).toBe(view);
        expect(callback.calls.count()).toBe(1);
        return expect(ret).toBe(Falcon);
      });
    });
    describe("isModel", function() {
      return it("Should correctly identify a model", function() {
        expect(Falcon.isModel(new Falcon.Model)).toBe(true);
        expect(Falcon.isModel(new Falcon.Collection)).toBe(false);
        expect(Falcon.isModel(new Falcon.View)).toBe(false);
        expect(Falcon.isModel(123)).toBe(false);
        return expect(Falcon.isModel()).toBe(false);
      });
    });
    describe("isCollection", function() {
      return it("Should correctly identify a collection", function() {
        expect(Falcon.isCollection(new Falcon.Model)).toBe(false);
        expect(Falcon.isCollection(new Falcon.Collection)).toBe(true);
        expect(Falcon.isCollection(new Falcon.View)).toBe(false);
        expect(Falcon.isCollection(123)).toBe(false);
        return expect(Falcon.isCollection()).toBe(false);
      });
    });
    describe("isView", function() {
      return it("Should correctly identify a view", function() {
        expect(Falcon.isView(new Falcon.Model)).toBe(false);
        expect(Falcon.isView(new Falcon.Collection)).toBe(false);
        expect(Falcon.isView(new Falcon.View)).toBe(true);
        expect(Falcon.isView(123)).toBe(false);
        return expect(Falcon.isView()).toBe(false);
      });
    });
    describe("isDataObject", function() {
      return it("Should correctly identify a data object", function() {
        expect(Falcon.isDataObject(new Falcon.Model)).toBe(true);
        expect(Falcon.isDataObject(new Falcon.Collection)).toBe(true);
        expect(Falcon.isDataObject(new Falcon.View)).toBe(false);
        expect(Falcon.isDataObject(123)).toBe(false);
        return expect(Falcon.isDataObject()).toBe(false);
      });
    });
    describe("isFalconObject", function() {
      return it("Should correctly identify a falcon related object", function() {
        expect(Falcon.isFalconObject(new Falcon.Model)).toBe(true);
        expect(Falcon.isFalconObject(new Falcon.Collection)).toBe(true);
        expect(Falcon.isFalconObject(new Falcon.View)).toBe(true);
        expect(Falcon.isFalconObject(123)).toBe(false);
        return expect(Falcon.isFalconObject()).toBe(false);
      });
    });
    describe("addBinding", function() {
      it("Should add a binding properly", function() {
        var definition, ret;
        expect(ko.bindingHandlers['new_binding']).not.toBeDefined();
        expect(ko.virtualElements.allowedBindings['new_binding']).not.toBeDefined();
        definition = {
          init: (function() {}),
          update: (function() {})
        };
        ret = Falcon.addBinding("new_binding", definition);
        expect(ko.bindingHandlers['new_binding']).toBe(definition);
        expect(ko.virtualElements.allowedBindings['new_binding']).not.toBeDefined();
        return expect(ret).toBe(definition);
      });
      it("Should allow for a function argument", function() {
        var method, ret;
        expect(ko.bindingHandlers['new_binding2']).not.toBeDefined();
        expect(ko.virtualElements.allowedBindings['new_binding2']).not.toBeDefined();
        method = (function() {});
        ret = Falcon.addBinding("new_binding2", method);
        expect(ko.bindingHandlers['new_binding2']).toEqual({
          update: method
        });
        expect(ko.virtualElements.allowedBindings['new_binding2']).not.toBeDefined();
        return expect(ret).toEqual({
          update: method
        });
      });
      it("Should allow for virtual bindings", function() {
        var definition, ret;
        expect(ko.bindingHandlers['new_binding3']).not.toBeDefined();
        expect(ko.virtualElements.allowedBindings['new_binding3']).not.toBeDefined();
        definition = {
          init: (function() {}),
          update: (function() {})
        };
        ret = Falcon.addBinding("new_binding3", true, definition);
        expect(ko.bindingHandlers['new_binding3']).toBe(definition);
        expect(ko.virtualElements.allowedBindings['new_binding3']).toBe(true);
        return expect(ret).toBe(definition);
      });
      return it("Should allow for virtual bindings with a function argument", function() {
        var method, ret;
        expect(ko.bindingHandlers['new_binding4']).not.toBeDefined();
        expect(ko.virtualElements.allowedBindings['new_binding4']).not.toBeDefined();
        method = (function() {});
        ret = Falcon.addBinding("new_binding4", true, method);
        expect(ko.bindingHandlers['new_binding4']).toEqual({
          update: method
        });
        expect(ko.virtualElements.allowedBindings['new_binding4']).toBe(true);
        return expect(ret).toEqual({
          update: method
        });
      });
    });
    return describe("getBinding", function() {
      return it("Should fetch a valid binding", function() {
        return expect(Falcon.getBinding('foreach')).toBe(ko.bindingHandlers['foreach']);
      });
    });
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Falcon.Object", function() {
    var klass;
    klass = null;
    beforeEach(function() {
      return klass = new Falcon.Object;
    });
    it("Should have correct method definitions", function() {
      expect(klass.on).toEqual(jasmine.any(Function));
      expect(klass.on.length).toBe(3);
      expect(klass.off).toEqual(jasmine.any(Function));
      expect(klass.off.length).toBe(2);
      expect(klass.has).toEqual(jasmine.any(Function));
      expect(klass.has.length).toBe(2);
      return expect(klass.trigger).toEqual(jasmine.any(Function));
    });
    it("Should test event methods", function() {
      var click_one, click_two, context_two, mouseover_one;
      klass.on("click", (click_one = sinon.spy()));
      klass.on("click", (click_two = sinon.spy()), (context_two = {}));
      klass.on("mouseover", (mouseover_one = sinon.spy()));
      expect(click_one).not.toHaveBeenCalled();
      expect(click_two).not.toHaveBeenCalled();
      expect(mouseover_one).not.toHaveBeenCalled();
      klass.trigger("click", 1, 2, 3);
      expect(click_one).toHaveBeenCalledOnce();
      expect(click_one).toHaveBeenCalledWith(1, 2, 3);
      expect(click_two).toHaveBeenCalledOnce();
      expect(click_two).toHaveBeenCalledWith(1, 2, 3);
      expect(click_two).toHaveBeenCalledOn(context_two);
      expect(mouseover_one).not.toHaveBeenCalled();
      klass.trigger("mouseover", "go", true, {});
      expect(click_one).toHaveBeenCalledOnce();
      expect(click_two).toHaveBeenCalledOnce();
      expect(mouseover_one).toHaveBeenCalledOnce();
      expect(mouseover_one).toHaveBeenCalledWith("go", true, {});
      expect(klass.has("click", click_one)).toBe(true);
      expect(klass.has("click", click_two)).toBe(true);
      expect(klass.has("click", mouseover_one)).toBe(false);
      expect(click_one).toHaveBeenCalledOnce();
      expect(click_two).toHaveBeenCalledOnce();
      expect(mouseover_one).toHaveBeenCalledOnce();
      expect(klass.has("mouseover", click_one)).toBe(false);
      expect(klass.has("mouseover", click_two)).toBe(false);
      expect(klass.has("mouseover", mouseover_one)).toBe(true);
      expect(click_one).toHaveBeenCalledOnce();
      expect(click_two).toHaveBeenCalledOnce();
      expect(mouseover_one).toHaveBeenCalledOnce();
      klass.off("click", click_one);
      klass.trigger("click", 4, 5, 6);
      expect(click_one).toHaveBeenCalledOnce();
      expect(click_two).toHaveBeenCalledTwice();
      expect(click_two).toHaveBeenCalledWith(4, 5, 6);
      return expect(mouseover_one).toHaveBeenCalledOnce();
    });
    describe("Test #observables and #defaults", function() {
      var Clazz, Klass, _ref, _ref1;
      Clazz = (function(_super) {
        __extends(Clazz, _super);

        function Clazz() {
          _ref = Clazz.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        Clazz.prototype.defaults = {
          'id': 'z',
          'im': function() {
            return 'here';
          }
        };

        return Clazz;

      })(Falcon.Object);
      Klass = (function(_super) {
        __extends(Klass, _super);

        function Klass() {
          _ref1 = Klass.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        Klass.prototype.defaults = {
          'id': -1,
          'foo': 'bar',
          'free': 'bird',
          'def_arr': [1, 2, 3],
          'clazz': function() {
            return new Clazz;
          }
        };

        Klass.prototype.observables = {
          'hello': 'world',
          'foo': 'baz',
          'arr': ['1', '2'],
          'test': function() {
            return 'method';
          },
          '_another': 'good',
          'another': {
            read: function() {
              return this._another() + ' ' + this.test();
            },
            write: function(value) {
              return this._another(value);
            }
          }
        };

        return Klass;

      })(Falcon.Object);
      klass = null;
      beforeEach(function() {
        return klass = new Klass;
      });
      it("Should have added the correct default attributes", function() {
        expect(klass['id']).toBeDefined();
        expect(klass['foo']).toBeDefined();
        expect(klass['free']).toBeDefined();
        expect(klass['def_arr']).toBeDefined();
        return expect(klass['clazz']).toBeDefined();
      });
      it("Should have added the correct observable attributes", function() {
        expect(klass['hello']).toBeDefined();
        expect(klass['foo']).toBeDefined();
        expect(klass['test']).toBeDefined();
        expect(klass['_another']).toBeDefined();
        return expect(klass['another']).toBeDefined();
      });
      it("Should have added the correct default values", function() {
        expect(klass.id).toBe(-1);
        expect(klass.foo).not.toBe('bar');
        expect(klass.free).toBe('bird');
        return expect(klass.clazz).toEqual(jasmine.any(Clazz));
      });
      it("Should have the correct values for a default array", function() {
        expect(klass.def_arr).toEqual([1, 2, 3]);
        return expect(klass.def_arr).not.toBe(Klass.prototype.defaults.def_arr);
      });
      it("Should have added the correct observable type", function() {
        expect(ko.isObservable(klass.hello)).toBe(true);
        expect(ko.isObservable(klass.foo)).toBe(true);
        expect(ko.isComputed(klass.test)).toBe(true);
        expect(ko.isObservable(klass._another)).toBe(true);
        return expect(ko.isComputed(klass.another)).toBe(true);
      });
      it("Should have added the correct writeable observable type", function() {
        expect(ko.isWriteableObservable(klass.hello)).toBe(true);
        expect(ko.isWriteableObservable(klass.foo)).toBe(true);
        expect(ko.isWriteableObservable(klass.test)).toBe(false);
        expect(ko.isWriteableObservable(klass._another)).toBe(true);
        return expect(ko.isWriteableObservable(klass.another)).toBe(true);
      });
      it("Should have assigned the correct values to observables", function() {
        expect(ko.utils.unwrapObservable(klass.hello)).toBe("world");
        expect(ko.utils.unwrapObservable(klass.foo)).toBe("baz");
        expect(ko.utils.unwrapObservable(klass.test)).toBe("method");
        expect(ko.utils.unwrapObservable(klass._another)).toBe("good");
        expect(ko.utils.unwrapObservable(klass.another)).toBe("good method");
        klass.another("great");
        return expect(ko.utils.unwrapObservable(klass.another)).toBe("great method");
      });
      it("Should have propogated defaults in the child class", function() {
        expect(klass.clazz.id).toBe('z');
        return expect(klass.clazz.im).toBe('here');
      });
      it("Should have an observable array", function() {
        expect(ko.isObservable(klass.arr)).toBe(true);
        expect(klass.arr()).toEqual(jasmine.any(Array));
        expect(klass.arr().length).toBe(2);
        return expect(klass.arr()).not.toBe(Klass.prototype.observables.arr);
      });
      return it("Should create RawrClass with defaults that have the correct arguments", function() {
        var RawrClass, hello_spy, rawr_class, _ref2;
        hello_spy = null;
        RawrClass = (function(_super) {
          __extends(RawrClass, _super);

          function RawrClass() {
            _ref2 = RawrClass.__super__.constructor.apply(this, arguments);
            return _ref2;
          }

          RawrClass.prototype.defaults = {
            'hello': (hello_spy = sinon.spy())
          };

          return RawrClass;

        })(Falcon.Object);
        expect(hello_spy).not.toHaveBeenCalled();
        rawr_class = new RawrClass("one", "two", "three");
        expect(hello_spy).toHaveBeenCalled();
        expect(hello_spy.callCount).toBe(1);
        expect(hello_spy.firstCall.args.length).toBe(3);
        expect(hello_spy.firstCall.args[0]).toBe("one");
        expect(hello_spy.firstCall.args[1]).toBe("two");
        return expect(hello_spy.firstCall.args[2]).toBe("three");
      });
    });
    return describe("Test the extend method on objects", function() {
      var ajax_stub;
      ajax_stub = null;
      beforeEach(function() {
        return ajax_stub = sinon.stub($, 'ajax');
      });
      afterEach(function() {
        return ajax_stub.restore();
      });
      it("Should extend Falcon.Object properly", function() {
        var Klass, custom_spy, my_klass, things_spy;
        custom_spy = sinon.spy();
        things_spy = sinon.spy();
        Klass = Falcon.Object.extend({
          'custom': function() {
            return custom_spy.call(this);
          },
          'text': 'test'
        }, {
          'things': function() {
            return things_spy.call(this);
          }
        });
        my_klass = new Klass;
        expect(my_klass).toEqual(jasmine.any(Falcon.Object));
        expect(my_klass).not.toEqual(jasmine.any(Falcon.Model));
        expect(my_klass).not.toEqual(jasmine.any(Falcon.Collection));
        expect(my_klass).not.toEqual(jasmine.any(Falcon.View));
        expect(Klass.prototype.custom).toEqual(jasmine.any(Function));
        expect(Klass.prototype.text).toEqual(jasmine.any(String));
        expect(Klass.things).toEqual(jasmine.any(Function));
        expect(my_klass.custom).toEqual(jasmine.any(Function));
        expect(my_klass.text).toEqual(jasmine.any(String));
        my_klass.custom();
        expect(custom_spy).toHaveBeenCalled();
        expect(custom_spy.firstCall).toHaveBeenCalledOn(my_klass);
        Klass.things();
        expect(things_spy).toHaveBeenCalled();
        return expect(things_spy.firstCall).toHaveBeenCalledOn(Klass);
      });
      it("Should extend Falcon.Model properly", function() {
        var Klass, custom_spy, init_spy, my_klass, things_spy;
        custom_spy = sinon.spy();
        things_spy = sinon.spy();
        init_spy = sinon.spy();
        Klass = Falcon.Model.extend({
          'initialize': function() {
            return init_spy.call(this);
          },
          'custom': function() {
            return custom_spy.call(this);
          },
          'text': 'test'
        }, {
          'things': function() {
            return things_spy.call(this);
          }
        });
        my_klass = new Klass;
        expect(my_klass).toEqual(jasmine.any(Falcon.Object));
        expect(my_klass).toEqual(jasmine.any(Falcon.Model));
        expect(my_klass).not.toEqual(jasmine.any(Falcon.Collection));
        expect(my_klass).not.toEqual(jasmine.any(Falcon.View));
        expect(Klass.prototype.initialize).toEqual(jasmine.any(Function));
        expect(Klass.prototype.custom).toEqual(jasmine.any(Function));
        expect(Klass.prototype.text).toEqual(jasmine.any(String));
        expect(Klass.things).toEqual(jasmine.any(Function));
        expect(my_klass.initialize).toEqual(jasmine.any(Function));
        expect(my_klass.custom).toEqual(jasmine.any(Function));
        expect(my_klass.text).toEqual(jasmine.any(String));
        expect(init_spy).toHaveBeenCalled();
        expect(init_spy.firstCall).toHaveBeenCalledOn(my_klass);
        my_klass.custom();
        expect(custom_spy).toHaveBeenCalled();
        expect(custom_spy.firstCall).toHaveBeenCalledOn(my_klass);
        Klass.things();
        expect(things_spy).toHaveBeenCalled();
        return expect(things_spy.firstCall).toHaveBeenCalledOn(Klass);
      });
      it("Should extend Falcon.Collection properly", function() {
        var Klass, custom_spy, init_spy, my_klass, things_spy;
        custom_spy = sinon.spy();
        things_spy = sinon.spy();
        init_spy = sinon.spy();
        Klass = Falcon.Collection.extend({
          'initialize': function() {
            return init_spy.call(this);
          },
          'custom': function() {
            return custom_spy.call(this);
          },
          'text': 'test'
        }, {
          'things': function() {
            return things_spy.call(this);
          }
        });
        my_klass = new Klass;
        expect(my_klass).toEqual(jasmine.any(Falcon.Object));
        expect(my_klass).not.toEqual(jasmine.any(Falcon.Model));
        expect(my_klass).toEqual(jasmine.any(Falcon.Collection));
        expect(my_klass).not.toEqual(jasmine.any(Falcon.View));
        expect(Klass.prototype.initialize).toEqual(jasmine.any(Function));
        expect(Klass.prototype.custom).toEqual(jasmine.any(Function));
        expect(Klass.prototype.text).toEqual(jasmine.any(String));
        expect(Klass.things).toEqual(jasmine.any(Function));
        expect(my_klass.initialize).toEqual(jasmine.any(Function));
        expect(my_klass.custom).toEqual(jasmine.any(Function));
        expect(my_klass.text).toEqual(jasmine.any(String));
        expect(init_spy).toHaveBeenCalled();
        expect(init_spy.firstCall).toHaveBeenCalledOn(my_klass);
        my_klass.custom();
        expect(custom_spy).toHaveBeenCalled();
        expect(custom_spy.firstCall).toHaveBeenCalledOn(my_klass);
        Klass.things();
        expect(things_spy).toHaveBeenCalled();
        return expect(things_spy.firstCall).toHaveBeenCalledOn(Klass);
      });
      it("Should extend Falcon.View properly", function() {
        var Klass, custom_spy, init_spy, my_klass, things_spy;
        custom_spy = sinon.spy();
        things_spy = sinon.spy();
        init_spy = sinon.spy();
        Klass = Falcon.View.extend({
          'initialize': function() {
            return init_spy.call(this);
          },
          'custom': function() {
            return custom_spy.call(this);
          },
          'text': 'test'
        }, {
          'things': function() {
            return things_spy.call(this);
          }
        });
        my_klass = new Klass;
        expect(my_klass).toEqual(jasmine.any(Falcon.Object));
        expect(my_klass).not.toEqual(jasmine.any(Falcon.Model));
        expect(my_klass).not.toEqual(jasmine.any(Falcon.Collection));
        expect(my_klass).toEqual(jasmine.any(Falcon.View));
        expect(Klass.prototype.initialize).toEqual(jasmine.any(Function));
        expect(Klass.prototype.custom).toEqual(jasmine.any(Function));
        expect(Klass.prototype.text).toEqual(jasmine.any(String));
        expect(Klass.things).toEqual(jasmine.any(Function));
        expect(my_klass.initialize).toEqual(jasmine.any(Function));
        expect(my_klass.custom).toEqual(jasmine.any(Function));
        expect(my_klass.text).toEqual(jasmine.any(String));
        expect(init_spy).toHaveBeenCalled();
        expect(init_spy.firstCall).toHaveBeenCalledOn(my_klass);
        my_klass.custom();
        expect(custom_spy).toHaveBeenCalled();
        expect(custom_spy.firstCall).toHaveBeenCalledOn(my_klass);
        Klass.things();
        expect(things_spy).toHaveBeenCalled();
        return expect(things_spy.firstCall).toHaveBeenCalledOn(Klass);
      });
      return it("Should allow for deep inheritence", function() {
        var ChildKlass, Klass, child_klass, custom_spy, things_spy;
        custom_spy = sinon.spy();
        things_spy = sinon.spy();
        Klass = Falcon.Object.extend({
          'custom': function() {
            return custom_spy.call(this);
          },
          'text': 'test'
        }, {
          'things': function() {
            return things_spy.call(this);
          }
        });
        ChildKlass = Klass.extend({
          'another': (function() {})
        }, {
          'foo': 'bar'
        });
        child_klass = new ChildKlass;
        expect(child_klass).toEqual(jasmine.any(Falcon.Object));
        expect(child_klass).toEqual(jasmine.any(Klass));
        expect(child_klass).not.toEqual(jasmine.any(Falcon.Model));
        expect(child_klass).not.toEqual(jasmine.any(Falcon.Collection));
        expect(child_klass).not.toEqual(jasmine.any(Falcon.View));
        expect(ChildKlass.prototype.custom).toEqual(jasmine.any(Function));
        expect(ChildKlass.prototype.text).toEqual(jasmine.any(String));
        expect(ChildKlass.prototype.another).toEqual(jasmine.any(Function));
        expect(ChildKlass.things).toEqual(jasmine.any(Function));
        expect(ChildKlass.foo).toEqual(jasmine.any(String));
        expect(child_klass.custom).toEqual(jasmine.any(Function));
        expect(child_klass.text).toEqual(jasmine.any(String));
        expect(child_klass.another).toEqual(jasmine.any(Function));
        child_klass.custom();
        expect(custom_spy).toHaveBeenCalled();
        expect(custom_spy.firstCall).toHaveBeenCalledOn(child_klass);
        ChildKlass.things();
        expect(things_spy).toHaveBeenCalled();
        return expect(things_spy.firstCall).toHaveBeenCalledOn(ChildKlass);
      });
    });
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Falcon.Model", function() {
    beforeEach(function() {
      Falcon.baseApiUrl = "";
      return Falcon.baseTemplateUrl = "";
    });
    it("Should initialize correctly", function() {
      var ModelA, ModelB, data, dataModel, init_stub, model, modelA, modelB, _ref, _ref1;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        return ModelA;

      })(Falcon.Model);
      ModelB = (function(_super) {
        __extends(ModelB, _super);

        function ModelB() {
          _ref1 = ModelB.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        return ModelB;

      })(Falcon.Model);
      init_stub = sinon.stub(ModelA.prototype, "initialize");
      model = new ModelA;
      expect(init_stub).toHaveBeenCalledOnce();
      init_stub.reset();
      modelA = new ModelA(modelB = new ModelB);
      expect(init_stub).toHaveBeenCalledOnce();
      expect(modelA.parent).toBe(modelB);
      init_stub.reset();
      modelA = new ModelA(data = {
        "hello": "world"
      });
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith(data);
      expect(modelA.parent).not.toBeDefined();
      init_stub.reset();
      modelA = new ModelA(data = {
        "hello": "world"
      }, modelB = new ModelB);
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith(data);
      expect(modelA.parent).toBe(modelB);
      init_stub.reset();
      modelA = new ModelA(modelB = new ModelB, data = {
        "hello": "world"
      });
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith(data);
      expect(modelA.parent).toBe(modelB);
      init_stub.reset();
      modelA = new ModelA(dataModel = new Falcon.Model({
        "hello": "world"
      }), modelB = new ModelB);
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith(dataModel);
      expect(modelA.parent).toBe(modelB);
      init_stub.reset();
      return init_stub.restore();
    });
    it("Should create RawrModel with defaults that have correct arguments", function() {
      var RawrModel, hello_spy, input_data, rawr_class, _ref;
      hello_spy = null;
      RawrModel = (function(_super) {
        __extends(RawrModel, _super);

        function RawrModel() {
          _ref = RawrModel.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        RawrModel.prototype.defaults = {
          'hello': (hello_spy = sinon.spy())
        };

        return RawrModel;

      })(Falcon.Model);
      expect(hello_spy).not.toHaveBeenCalled();
      rawr_class = new RawrModel(input_data = {
        "one": "one",
        "two": "two",
        "three": "three"
      });
      expect(hello_spy).toHaveBeenCalled();
      expect(hello_spy.callCount).toBe(1);
      expect(hello_spy.firstCall.args.length).toBe(1);
      return expect(hello_spy.firstCall.args[0]).toBe(input_data);
    });
    it("Should test the get, set, and toggle methods", function() {
      var ModelA, ModelB, modelA, modelB, _ref, _ref1;
      modelB = null;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        ModelA.prototype.initialize = function() {
          this.foo = ko.observable();
          return this.model_b = modelB = new ModelB;
        };

        return ModelA;

      })(Falcon.Model);
      ModelB = (function(_super) {
        __extends(ModelB, _super);

        function ModelB() {
          _ref1 = ModelB.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        return ModelB;

      })(Falcon.Model);
      modelA = new ModelA({
        "hello": "world",
        "foo": "bar",
        "truth": true,
        "model_b": {
          "something": "cool"
        }
      });
      expect(modelA["hello"]).toBe("world");
      expect(modelA["foo"]).toEqual(jasmine.any(Function));
      expect(modelA["truth"]).toBe(true);
      expect(modelA["model_b"]).toEqual(jasmine.any(ModelB));
      expect(modelA["model_b"]).toBe(modelB);
      expect(modelA.get("hello")).toBe("world");
      expect(modelA.get("foo")).toBe("bar");
      expect(modelA.get("truth")).toBe(true);
      expect(modelA["model_b"]).toEqual(jasmine.any(ModelB));
      expect(modelA["model_b"]).toBe(modelB);
      modelA.set("foo", "baz");
      modelA.set("hello", "goodbye");
      expect(modelA.get("hello")).toBe("goodbye");
      expect(modelA.get("foo")).toBe("baz");
      expect(modelA.get("truth")).toBe(true);
      expect(modelA["model_b"]).toEqual(jasmine.any(ModelB));
      expect(modelA["model_b"]).toEqual(jasmine.any(ModelB));
      expect(modelA["model_b"]).toBe(modelB);
      modelA.set({
        "foo": "bar",
        "hello": "world"
      });
      expect(modelA.get("hello")).toBe("world");
      expect(modelA.get("foo")).toBe("bar");
      expect(modelA.get("truth")).toBe(true);
      expect(modelA["model_b"]).toEqual(jasmine.any(ModelB));
      expect(modelA["model_b"]).toEqual(jasmine.any(ModelB));
      expect(modelA["model_b"]).toBe(modelB);
      modelA.toggle("truth");
      expect(modelA.get("hello")).toBe("world");
      expect(modelA.get("foo")).toBe("bar");
      expect(modelA.get("truth")).toBe(false);
      expect(modelA["model_b"]).toEqual(jasmine.any(ModelB));
      expect(modelA["model_b"]).toBe(modelB);
      return expect(modelB.get("something")).toBe("cool");
    });
    it("Should test the increment and decrement methods", function() {
      var ModelA, model_a, ret, _ref;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        ModelA.prototype.defaults = {
          'first': 1
        };

        ModelA.prototype.observables = {
          'second': 2
        };

        return ModelA;

      })(Falcon.Model);
      model_a = new ModelA;
      expect(model_a.get('first')).toBe(1);
      expect(model_a.get('second')).toBe(2);
      ret = model_a.increment('first');
      expect(ret).toBe(model_a);
      ret = model_a.increment('second');
      expect(ret).toBe(model_a);
      expect(model_a.get('first')).toBe(2);
      expect(model_a.get('second')).toBe(3);
      ret = model_a.decrement('first');
      expect(ret).toBe(model_a);
      ret = model_a.decrement('second');
      expect(ret).toBe(model_a);
      expect(model_a.get('first')).toBe(1);
      return expect(model_a.get('second')).toBe(2);
    });
    it("Should test the fill and serialize methods", function() {
      var CollectionC, ModelA, ModelB, ModelC, collectionC, data, key, modelA, modelB, modelB2, original_model_b3, serialized, value, _ref, _ref1, _ref2, _ref3, _results;
      modelB = null;
      modelB2 = null;
      collectionC = null;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        ModelA.prototype.url = "model_a";

        ModelA.prototype.initialize = function() {
          this._client = ko.observable();
          this.model_b = modelB = new ModelB;
          this.model_b2 = modelB2 = new ModelB;
          this.collection_c = collectionC = new CollectionC;
          return this.model_b3 = new ModelB;
        };

        return ModelA;

      })(Falcon.Model);
      ModelB = (function(_super) {
        __extends(ModelB, _super);

        function ModelB() {
          _ref1 = ModelB.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        ModelB.prototype.url = "model_b";

        return ModelB;

      })(Falcon.Model);
      ModelC = (function(_super) {
        __extends(ModelC, _super);

        function ModelC() {
          _ref2 = ModelC.__super__.constructor.apply(this, arguments);
          return _ref2;
        }

        return ModelC;

      })(Falcon.Model);
      CollectionC = (function(_super) {
        __extends(CollectionC, _super);

        function CollectionC() {
          _ref3 = CollectionC.__super__.constructor.apply(this, arguments);
          return _ref3;
        }

        CollectionC.prototype.model = ModelC;

        return CollectionC;

      })(Falcon.Collection);
      data = {
        "id": 33,
        "foo": "bar",
        "url": "MODEL_A2",
        "model_b": {
          "b_foo": "B BAR"
        },
        "model_b2": {
          "id": "test",
          "b_foo": "B BAR 2",
          "url": "model_b2"
        },
        "model_b3": new ModelB,
        "collection_c": [
          {
            "that": "That One"
          }, {
            "that": "That Two"
          }, {
            "that": "That Three"
          }
        ]
      };
      modelA = new ModelA();
      original_model_b3 = modelA.get("model_b3");
      modelA.fill(data);
      expect(modelA.get("id")).toBe(33);
      expect(modelA.get("foo")).toBe("bar");
      expect(modelA.get("url")).toBe("MODEL_A2");
      expect(modelA.get("model_b")).toBe(modelB);
      expect(modelA.get("model_b").get("b_foo")).toBe("B BAR");
      expect(modelA.get("model_b").get("url")).toBe("model_b");
      expect(modelA.get("model_b2")).toBe(modelB2);
      expect(modelA.get("model_b2").get("id")).toBe("test");
      expect(modelA.get("model_b2").get("b_foo")).toBe("B BAR 2");
      expect(modelA.get("model_b2").get("url")).toBe("model_b2");
      expect(original_model_b3).toEqual(jasmine.any(ModelB));
      expect(data.model_b3).toEqual(jasmine.any(ModelB));
      expect(data.model_b3).not.toBe(original_model_b3);
      expect(modelA.get("model_b3")).toBe(data.model_b3);
      expect(modelA.get("collection_c")).toBe(collectionC);
      expect(modelA.get("collection_c").length()).toBe(3);
      expect(modelA.get("collection_c").first()).toEqual(jasmine.any(ModelC));
      expect(modelA.get("collection_c").first().get("that")).toBe("That One");
      serialized = modelA.serialize();
      expect(serialized['id']).toBe(33);
      expect(serialized['foo']).toBe("bar");
      expect(serialized['model_b']).toEqual(jasmine.any(Object));
      expect(serialized['model_b']['id']).toBeNull();
      expect(serialized['model_b']['b_foo']).toBe("B BAR");
      expect(serialized['model_b2']).toEqual(jasmine.any(Object));
      expect(serialized['model_b2']['id']).toBe("test");
      expect(serialized['model_b2']['b_foo']).toBe("B BAR 2");
      expect(serialized['model_b3']).toEqual(jasmine.any(Object));
      expect(serialized['collection_c']).toEqual(jasmine.any(Array));
      expect(serialized['collection_c'].length).toBe(3);
      expect(serialized['collection_c'][0]).toEqual(jasmine.any(Object));
      expect(serialized['collection_c'][0]['that']).toBe("That One");
      serialized = modelA.serialize(["id", "foo"]);
      expect(serialized['id']).toBe(33);
      expect(serialized['foo']).toBe("bar");
      expect(serialized["model_b"]).not.toBeDefined();
      expect(serialized["model_b2"]).not.toBeDefined();
      expect(serialized["collection_c"]).not.toBeDefined();
      serialized = modelA.serialize(["foo"]);
      expect(serialized['foo']).toBe("bar");
      expect(serialized['id']).not.toBeDefined();
      expect(serialized["model_b"]).not.toBeDefined();
      expect(serialized["model_b2"]).not.toBeDefined();
      expect(serialized["model_b3"]).not.toBeDefined();
      expect(serialized["collection_c"]).not.toBeDefined();
      serialized = modelA.serialize({
        "id": null,
        "model_b2": {
          "b_foo": null,
          "url": null
        }
      });
      expect(serialized['id']).toBe(33);
      expect(serialized['model_b2']).toEqual(jasmine.any(Object));
      expect(serialized['model_b2']['b_foo']).toBe("B BAR 2");
      expect(serialized["model_b"]).not.toBeDefined();
      expect(serialized["model_b3"]).not.toBeDefined();
      expect(serialized["collection_c"]).not.toBeDefined();
      serialized = modelA.serialize();
      for (key in serialized) {
        value = serialized[key];
        expect(Falcon.Object.prototype[key]).not.toBeDefined();
      }
      serialized = modelA.serialize();
      _results = [];
      for (key in serialized) {
        value = serialized[key];
        if (key !== "id") {
          _results.push(expect(Falcon.Model.prototype[key]).not.toBeDefined());
        }
      }
      return _results;
    });
    it("Should test the unwrap method", function() {
      var CollectionC, ModelA, ModelB, ModelC, collectionC, modelA, modelB, unwrapped, _ref, _ref1, _ref2, _ref3;
      modelB = null;
      collectionC = null;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        ModelA.prototype.initialize = function() {
          this.foo = ko.observable();
          this.model_b = modelB = new ModelB;
          return this.collection_c = collectionC = new CollectionC;
        };

        return ModelA;

      })(Falcon.Model);
      ModelB = (function(_super) {
        __extends(ModelB, _super);

        function ModelB() {
          _ref1 = ModelB.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        ModelB.prototype.initialize = function() {
          return this.something = ko.observable();
        };

        return ModelB;

      })(Falcon.Model);
      ModelC = (function(_super) {
        __extends(ModelC, _super);

        function ModelC() {
          _ref2 = ModelC.__super__.constructor.apply(this, arguments);
          return _ref2;
        }

        ModelC.prototype.initialize = function() {
          return this.hello = "world";
        };

        return ModelC;

      })(Falcon.Model);
      CollectionC = (function(_super) {
        __extends(CollectionC, _super);

        function CollectionC() {
          _ref3 = CollectionC.__super__.constructor.apply(this, arguments);
          return _ref3;
        }

        CollectionC.prototype.model = ModelC;

        return CollectionC;

      })(Falcon.Collection);
      modelA = new ModelA({
        "foo": "bar",
        "model_b": {
          "something": "cool"
        },
        "collection_c": [
          {
            "hello": "world"
          }, {
            "hello": "world2"
          }
        ]
      });
      unwrapped = modelA.unwrap();
      expect(unwrapped['foo']).toEqual(jasmine.any(Function));
      expect(unwrapped['foo']()).toBe("bar");
      expect(unwrapped['model_b']).toEqual(jasmine.any(Object));
      expect(unwrapped['model_b']['something']).toEqual(jasmine.any(Function));
      expect(unwrapped['model_b']['something']()).toBe("cool");
      expect(unwrapped['collection_c']).toEqual(jasmine.any(Array));
      expect(unwrapped['collection_c'].length).toBe(2);
      expect(unwrapped['collection_c'][0]['hello']).toBe("world");
      expect(unwrapped['collection_c'][1]['hello']).toBe("world2");
      expect(unwrapped['id']).toBeNull();
      expect(unwrapped['parent']).not.toBeDefined();
      return expect(unwrapped['url']).not.toBeDefined();
    });
    describe("Testing makeUrl combinations", function() {
      var ModelA, ModelB, ModelC, ModelD, ModelE, _ref, _ref1, _ref2, _ref3, _ref4;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        ModelA.prototype.url = "model_a";

        return ModelA;

      })(Falcon.Model);
      ModelB = (function(_super) {
        __extends(ModelB, _super);

        function ModelB() {
          _ref1 = ModelB.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        ModelB.prototype.url = "/model_b";

        return ModelB;

      })(Falcon.Model);
      ModelC = (function(_super) {
        __extends(ModelC, _super);

        function ModelC() {
          _ref2 = ModelC.__super__.constructor.apply(this, arguments);
          return _ref2;
        }

        ModelC.prototype.url = "model_c.json";

        return ModelC;

      })(Falcon.Model);
      ModelD = (function(_super) {
        __extends(ModelD, _super);

        function ModelD() {
          _ref3 = ModelD.__super__.constructor.apply(this, arguments);
          return _ref3;
        }

        ModelD.prototype.url = "model_d.json";

        return ModelD;

      })(Falcon.Model);
      ModelE = (function(_super) {
        __extends(ModelE, _super);

        function ModelE() {
          _ref4 = ModelE.__super__.constructor.apply(this, arguments);
          return _ref4;
        }

        ModelE.prototype.url = function() {
          return "model_e";
        };

        return ModelE;

      })(Falcon.Model);
      beforeEach(function() {
        return Falcon.baseApiUrl = null;
      });
      it("Should test the makeUrl method, numeric id, no baseUrl, no parent, no extension", function() {
        var modelA;
        modelA = new ModelA({
          id: 1
        });
        expect(modelA.makeUrl("GET")).toBe("/model_a/1");
        expect(modelA.makeUrl("POST")).toBe("/model_a");
        expect(modelA.makeUrl("PUT")).toBe("/model_a/1");
        return expect(modelA.makeUrl("DELETE")).toBe("/model_a/1");
      });
      it("Should test the makeUrl method, string id, no baseUrl, no parent, no extension", function() {
        var modelB;
        modelB = new ModelB({
          id: "b"
        });
        expect(modelB.makeUrl("GET")).toBe("/model_b/b");
        expect(modelB.makeUrl("POST")).toBe("/model_b");
        expect(modelB.makeUrl("PUT")).toBe("/model_b/b");
        return expect(modelB.makeUrl("DELETE")).toBe("/model_b/b");
      });
      it("Should test the makeUrl method, numeric id, with shorter baseUrl, no parent, no extension", function() {
        var modelA;
        modelA = new ModelA({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(modelA.makeUrl("GET")).toBe("http://www.falconjs.com/model_a/1");
        expect(modelA.makeUrl("POST")).toBe("http://www.falconjs.com/model_a");
        expect(modelA.makeUrl("PUT")).toBe("http://www.falconjs.com/model_a/1");
        return expect(modelA.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_a/1");
      });
      it("Should test the makeUrl method, string id, with shorter baseUrl, no parent, no extension", function() {
        var modelB;
        modelB = new ModelB({
          id: "b"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(modelB.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/b");
        expect(modelB.makeUrl("POST")).toBe("http://www.falconjs.com/model_b");
        expect(modelB.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/b");
        return expect(modelB.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/b");
      });
      it("Should test the makeUrl method, numeric id, with baseUrl, no parent, no extension", function() {
        var modelA;
        modelA = new ModelA({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelA.makeUrl("GET")).toBe("http://www.falconjs.com/model_a/1");
        expect(modelA.makeUrl("POST")).toBe("http://www.falconjs.com/model_a");
        expect(modelA.makeUrl("PUT")).toBe("http://www.falconjs.com/model_a/1");
        return expect(modelA.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_a/1");
      });
      it("Should test the makeUrl method, string id, with baseUrl, no parent, no extension", function() {
        var modelB;
        modelB = new ModelB({
          id: "b"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelB.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/b");
        expect(modelB.makeUrl("POST")).toBe("http://www.falconjs.com/model_b");
        expect(modelB.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/b");
        return expect(modelB.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/b");
      });
      it("Should test the makeUrl method, no baseUrl, with parent, no extension", function() {
        var modelA, modelB;
        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 2
        }, modelB);
        expect(modelA.makeUrl("GET")).toBe("/model_b/b/model_a/2");
        expect(modelA.makeUrl("POST")).toBe("/model_b/b/model_a");
        expect(modelA.makeUrl("PUT")).toBe("/model_b/b/model_a/2");
        return expect(modelA.makeUrl("DELETE")).toBe("/model_b/b/model_a/2");
      });
      it("Should test the makeUrl method, with baseUrl, with parent, no extension", function() {
        var modelA, modelB;
        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 2
        }, modelB);
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelA.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/b/model_a/2");
        expect(modelA.makeUrl("POST")).toBe("http://www.falconjs.com/model_b/b/model_a");
        expect(modelA.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/b/model_a/2");
        return expect(modelA.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/b/model_a/2");
      });
      it("Should test the makeUrl method, no baseUrl, with explicit parent, no extension", function() {
        var modelA, modelB;
        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 3
        });
        expect(modelA.makeUrl("GET", modelB)).toBe("/model_b/b/model_a/3");
        expect(modelA.makeUrl("POST", modelB)).toBe("/model_b/b/model_a");
        expect(modelA.makeUrl("PUT", modelB)).toBe("/model_b/b/model_a/3");
        return expect(modelA.makeUrl("DELETE", modelB)).toBe("/model_b/b/model_a/3");
      });
      it("Should test the makeUrl method, with baseUrl, with explicit parent, no extension", function() {
        var modelA, modelB;
        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 3
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelA.makeUrl("GET", modelB)).toBe("http://www.falconjs.com/model_b/b/model_a/3");
        expect(modelA.makeUrl("POST", modelB)).toBe("http://www.falconjs.com/model_b/b/model_a");
        expect(modelA.makeUrl("PUT", modelB)).toBe("http://www.falconjs.com/model_b/b/model_a/3");
        return expect(modelA.makeUrl("DELETE", modelB)).toBe("http://www.falconjs.com/model_b/b/model_a/3");
      });
      it("Should test the makeUrl method, no baseUrl, with overriden parent, no extension", function() {
        var modelA, modelB;
        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 3
        }, modelB);
        expect(modelA.makeUrl("GET", null)).toBe("/model_a/3");
        expect(modelA.makeUrl("POST", null)).toBe("/model_a");
        expect(modelA.makeUrl("PUT", null)).toBe("/model_a/3");
        return expect(modelA.makeUrl("DELETE", null)).toBe("/model_a/3");
      });
      it("Should test the makeUrl method, with baseUrl, with overriden parent, no extension", function() {
        var modelA, modelB;
        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 3
        }, modelB);
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelA.makeUrl("GET", null)).toBe("http://www.falconjs.com/model_a/3");
        expect(modelA.makeUrl("POST", null)).toBe("http://www.falconjs.com/model_a");
        expect(modelA.makeUrl("PUT", null)).toBe("http://www.falconjs.com/model_a/3");
        return expect(modelA.makeUrl("DELETE", null)).toBe("http://www.falconjs.com/model_a/3");
      });
      it("Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", function() {
        var modelC;
        modelC = new ModelC({
          id: 1
        });
        expect(modelC.makeUrl("GET")).toBe("/model_c/1.json");
        expect(modelC.makeUrl("POST")).toBe("/model_c.json");
        expect(modelC.makeUrl("PUT")).toBe("/model_c/1.json");
        return expect(modelC.makeUrl("DELETE")).toBe("/model_c/1.json");
      });
      it("Should test the makeUrl method, numeric index, with shorter baseUrl, no parent, with extension", function() {
        var modelC;
        modelC = new ModelC({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(modelC.makeUrl("GET")).toBe("http://www.falconjs.com/model_c/1.json");
        expect(modelC.makeUrl("POST")).toBe("http://www.falconjs.com/model_c.json");
        expect(modelC.makeUrl("PUT")).toBe("http://www.falconjs.com/model_c/1.json");
        return expect(modelC.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_c/1.json");
      });
      it("Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", function() {
        var modelC;
        modelC = new ModelC({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelC.makeUrl("GET")).toBe("http://www.falconjs.com/model_c/1.json");
        expect(modelC.makeUrl("POST")).toBe("http://www.falconjs.com/model_c.json");
        expect(modelC.makeUrl("PUT")).toBe("http://www.falconjs.com/model_c/1.json");
        return expect(modelC.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_c/1.json");
      });
      it("Should test the makeUrl method, no baseUrl, with parent, with extension", function() {
        var modelB, modelC;
        modelB = new ModelB({
          id: "b"
        });
        modelC = new ModelC({
          id: 2
        }, modelB);
        expect(modelC.makeUrl("GET")).toBe("/model_b/b/model_c/2.json");
        expect(modelC.makeUrl("POST")).toBe("/model_b/b/model_c.json");
        expect(modelC.makeUrl("PUT")).toBe("/model_b/b/model_c/2.json");
        return expect(modelC.makeUrl("DELETE")).toBe("/model_b/b/model_c/2.json");
      });
      it("Should test the makeUrl method, with baseUrl, with parent, with extension", function() {
        var modelB, modelC;
        modelB = new ModelB({
          id: "b"
        });
        modelC = new ModelC({
          id: 2
        }, modelB);
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelC.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/b/model_c/2.json");
        expect(modelC.makeUrl("POST")).toBe("http://www.falconjs.com/model_b/b/model_c.json");
        expect(modelC.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/b/model_c/2.json");
        return expect(modelC.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/b/model_c/2.json");
      });
      it("Should test the makeUrl method, no baseUrl, with explicit parent, with extension", function() {
        var modelB, modelC;
        modelB = new ModelB({
          id: "b"
        });
        modelC = new ModelC({
          id: 3
        });
        expect(modelC.makeUrl("GET", modelB)).toBe("/model_b/b/model_c/3.json");
        expect(modelC.makeUrl("POST", modelB)).toBe("/model_b/b/model_c.json");
        expect(modelC.makeUrl("PUT", modelB)).toBe("/model_b/b/model_c/3.json");
        return expect(modelC.makeUrl("DELETE", modelB)).toBe("/model_b/b/model_c/3.json");
      });
      it("Should test the makeUrl method, with baseUrl, with  explicit parent, with extension", function() {
        var modelB, modelC;
        modelB = new ModelB({
          id: "b"
        });
        modelC = new ModelC({
          id: 3
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelC.makeUrl("GET", modelB)).toBe("http://www.falconjs.com/model_b/b/model_c/3.json");
        expect(modelC.makeUrl("POST", modelB)).toBe("http://www.falconjs.com/model_b/b/model_c.json");
        expect(modelC.makeUrl("PUT", modelB)).toBe("http://www.falconjs.com/model_b/b/model_c/3.json");
        return expect(modelC.makeUrl("DELETE", modelB)).toBe("http://www.falconjs.com/model_b/b/model_c/3.json");
      });
      it("Should test the makeUrl method, string index, no baseUrl, no parent, with extension", function() {
        var modelD;
        modelD = new ModelD({
          id: "d"
        });
        expect(modelD.makeUrl("GET")).toBe("/model_d/d.json");
        expect(modelD.makeUrl("POST")).toBe("/model_d.json");
        expect(modelD.makeUrl("PUT")).toBe("/model_d/d.json");
        return expect(modelD.makeUrl("DELETE")).toBe("/model_d/d.json");
      });
      it("Should test the makeUrl method, string index, with shorter baseUrl, no parent, with extension", function() {
        var modelD;
        modelD = new ModelD({
          id: "d"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(modelD.makeUrl("GET")).toBe("http://www.falconjs.com/model_d/d.json");
        expect(modelD.makeUrl("POST")).toBe("http://www.falconjs.com/model_d.json");
        expect(modelD.makeUrl("PUT")).toBe("http://www.falconjs.com/model_d/d.json");
        return expect(modelD.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_d/d.json");
      });
      it("Should test the makeUrl method, string index, with baseUrl, no parent, with extension", function() {
        var modelD;
        modelD = new ModelD({
          id: "d"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelD.makeUrl("GET")).toBe("http://www.falconjs.com/model_d/d.json");
        expect(modelD.makeUrl("POST")).toBe("http://www.falconjs.com/model_d.json");
        expect(modelD.makeUrl("PUT")).toBe("http://www.falconjs.com/model_d/d.json");
        return expect(modelD.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_d/d.json");
      });
      it("Should test the makeUrl method, no baseUrl, with non-ext. parent, with extension", function() {
        var modelA, modelD;
        modelD = new ModelD({
          id: "d"
        });
        modelA = new ModelA({
          id: 2
        }, modelD);
        expect(modelA.makeUrl("GET")).toBe("/model_d/d/model_a/2");
        expect(modelA.makeUrl("POST")).toBe("/model_d/d/model_a");
        expect(modelA.makeUrl("PUT")).toBe("/model_d/d/model_a/2");
        return expect(modelA.makeUrl("DELETE")).toBe("/model_d/d/model_a/2");
      });
      it("Should test the makeUrl method, with baseUrl, with non-ext. parent, with extension", function() {
        var modelA, modelD;
        modelD = new ModelD({
          id: "d"
        });
        modelA = new ModelA({
          id: 2
        }, modelD);
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelA.makeUrl("GET")).toBe("http://www.falconjs.com/model_d/d/model_a/2");
        expect(modelA.makeUrl("POST")).toBe("http://www.falconjs.com/model_d/d/model_a");
        expect(modelA.makeUrl("PUT")).toBe("http://www.falconjs.com/model_d/d/model_a/2");
        return expect(modelA.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_d/d/model_a/2");
      });
      it("Should test the makeUrl method, no baseUrl, with explicit non-ext. parent, with extension", function() {
        var modelA, modelD;
        modelD = new ModelD({
          id: "d"
        });
        modelA = new ModelA({
          id: 3
        });
        expect(modelA.makeUrl("GET", modelD)).toBe("/model_d/d/model_a/3");
        expect(modelA.makeUrl("POST", modelD)).toBe("/model_d/d/model_a");
        expect(modelA.makeUrl("PUT", modelD)).toBe("/model_d/d/model_a/3");
        return expect(modelA.makeUrl("DELETE", modelD)).toBe("/model_d/d/model_a/3");
      });
      it("Should test the makeUrl method, no baseUrl, with explicit non-ext. parent, with extension", function() {
        var modelA, modelD;
        modelD = new ModelD({
          id: "d"
        });
        modelA = new ModelA({
          id: 3
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelA.makeUrl("GET", modelD)).toBe("http://www.falconjs.com/model_d/d/model_a/3");
        expect(modelA.makeUrl("POST", modelD)).toBe("http://www.falconjs.com/model_d/d/model_a");
        expect(modelA.makeUrl("PUT", modelD)).toBe("http://www.falconjs.com/model_d/d/model_a/3");
        return expect(modelA.makeUrl("DELETE", modelD)).toBe("http://www.falconjs.com/model_d/d/model_a/3");
      });
      it("Should test the makeUrl method, no baseUrl, with parent, with extension", function() {
        var modelC, modelD;
        modelD = new ModelD({
          id: "d"
        });
        modelC = new ModelC({
          id: 2
        }, modelD);
        expect(modelC.makeUrl("GET")).toBe("/model_d/d/model_c/2.json");
        expect(modelC.makeUrl("POST")).toBe("/model_d/d/model_c.json");
        expect(modelC.makeUrl("PUT")).toBe("/model_d/d/model_c/2.json");
        return expect(modelC.makeUrl("DELETE")).toBe("/model_d/d/model_c/2.json");
      });
      it("Should test the makeUrl method, with baseUrl, with parent, with extension", function() {
        var modelC, modelD;
        modelD = new ModelD({
          id: "d"
        });
        modelC = new ModelC({
          id: 2
        }, modelD);
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelC.makeUrl("GET")).toBe("http://www.falconjs.com/model_d/d/model_c/2.json");
        expect(modelC.makeUrl("POST")).toBe("http://www.falconjs.com/model_d/d/model_c.json");
        expect(modelC.makeUrl("PUT")).toBe("http://www.falconjs.com/model_d/d/model_c/2.json");
        return expect(modelC.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_d/d/model_c/2.json");
      });
      it("Should test the makeUrl method, no baseUrl, with  explicit parent, with extension", function() {
        var modelC, modelD;
        modelD = new ModelD({
          id: "d"
        });
        modelC = new ModelC({
          id: 3
        });
        expect(modelC.makeUrl("GET", modelD)).toBe("/model_d/d/model_c/3.json");
        expect(modelC.makeUrl("POST", modelD)).toBe("/model_d/d/model_c.json");
        expect(modelC.makeUrl("PUT", modelD)).toBe("/model_d/d/model_c/3.json");
        return expect(modelC.makeUrl("DELETE", modelD)).toBe("/model_d/d/model_c/3.json");
      });
      it("Should test the makeUrl method, with baseUrl, with explicit parent, with extension", function() {
        var modelC, modelD;
        modelD = new ModelD({
          id: "d"
        });
        modelC = new ModelC({
          id: 3
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelC.makeUrl("GET", modelD)).toBe("http://www.falconjs.com/model_d/d/model_c/3.json");
        expect(modelC.makeUrl("POST", modelD)).toBe("http://www.falconjs.com/model_d/d/model_c.json");
        expect(modelC.makeUrl("PUT", modelD)).toBe("http://www.falconjs.com/model_d/d/model_c/3.json");
        return expect(modelC.makeUrl("DELETE", modelD)).toBe("http://www.falconjs.com/model_d/d/model_c/3.json");
      });
      it("Should be able to use url as a function, no parent", function() {
        var modelE;
        modelE = new ModelE({
          id: "e"
        });
        expect(modelE.makeUrl("GET")).toBe("/model_e/e");
        expect(modelE.makeUrl("POST")).toBe("/model_e");
        expect(modelE.makeUrl("PUT")).toBe("/model_e/e");
        return expect(modelE.makeUrl("DELETE")).toBe("/model_e/e");
      });
      it("Should be able to use url as a function, with parent", function() {
        var modelE;
        modelE = new ModelE({
          id: "e"
        }, new ModelB({
          id: "b"
        }));
        expect(modelE.makeUrl("GET")).toBe("/model_b/b/model_e/e");
        expect(modelE.makeUrl("POST")).toBe("/model_b/b/model_e");
        expect(modelE.makeUrl("PUT")).toBe("/model_b/b/model_e/e");
        return expect(modelE.makeUrl("DELETE")).toBe("/model_b/b/model_e/e");
      });
      it("Should be able to use override the url, no parent", function() {
        var modelE;
        modelE = new ModelE({
          id: "e",
          url: "model_e2"
        });
        expect(modelE.makeUrl("GET")).toBe("/model_e2/e");
        expect(modelE.makeUrl("POST")).toBe("/model_e2");
        expect(modelE.makeUrl("PUT")).toBe("/model_e2/e");
        return expect(modelE.makeUrl("DELETE")).toBe("/model_e2/e");
      });
      it("Should be able to use override the url,with parent", function() {
        var modelE;
        modelE = new ModelE({
          id: "e",
          url: "model_e3"
        }, new ModelB({
          id: "b"
        }));
        expect(modelE.makeUrl("GET")).toBe("/model_b/b/model_e3/e");
        expect(modelE.makeUrl("POST")).toBe("/model_b/b/model_e3");
        expect(modelE.makeUrl("PUT")).toBe("/model_b/b/model_e3/e");
        return expect(modelE.makeUrl("DELETE")).toBe("/model_b/b/model_e3/e");
      });
      it("Should be able to handle '/' baseApiUrl", function() {
        var modelA;
        modelA = new ModelA({
          id: 1
        });
        Falcon.baseApiUrl = "/";
        expect(modelA.makeUrl("GET")).toBe("/model_a/1");
        expect(modelA.makeUrl("POST")).toBe("/model_a");
        expect(modelA.makeUrl("PUT")).toBe("/model_a/1");
        return expect(modelA.makeUrl("DELETE")).toBe("/model_a/1");
      });
      it("Should be able to handle have id override", function() {
        var modelA;
        modelA = new ModelA({
          id: 1
        });
        expect(modelA.makeUrl("GET", null, "things")).toBe("/model_a/things");
        expect(modelA.makeUrl("POST", null, "things")).toBe("/model_a");
        expect(modelA.makeUrl("PUT", null, "things")).toBe("/model_a/things");
        return expect(modelA.makeUrl("DELETE", null, "things")).toBe("/model_a/things");
      });
      it("Should test the makeUrl method having id override with extension", function() {
        var modelC;
        modelC = new ModelC({
          id: 1
        });
        expect(modelC.makeUrl("GET", null, "things")).toBe("/model_c/things.json");
        expect(modelC.makeUrl("POST", null, "things")).toBe("/model_c.json");
        expect(modelC.makeUrl("PUT", null, "things")).toBe("/model_c/things.json");
        return expect(modelC.makeUrl("DELETE", null, "things")).toBe("/model_c/things.json");
      });
      it("Should be able to handle have id override", function() {
        var modelA;
        modelA = new ModelA({
          id: 1
        });
        expect(modelA.makeUrl("GET", "things")).toBe("/model_a/things");
        expect(modelA.makeUrl("POST", "things")).toBe("/model_a");
        expect(modelA.makeUrl("PUT", "things")).toBe("/model_a/things");
        return expect(modelA.makeUrl("DELETE", "things")).toBe("/model_a/things");
      });
      it("Should test the makeUrl method having id override with extension", function() {
        var modelC;
        modelC = new ModelC({
          id: 1
        });
        expect(modelC.makeUrl("GET", "things")).toBe("/model_c/things.json");
        expect(modelC.makeUrl("POST", "things")).toBe("/model_c.json");
        expect(modelC.makeUrl("PUT", "things")).toBe("/model_c/things.json");
        return expect(modelC.makeUrl("DELETE", "things")).toBe("/model_c/things.json");
      });
      it("Should be able to handle have id override with an undefined parent", function() {
        var modelA;
        modelA = new ModelA({
          id: 1
        });
        expect(modelA.makeUrl("GET", void 0, "things")).toBe("/model_a/things");
        expect(modelA.makeUrl("POST", void 0, "things")).toBe("/model_a");
        expect(modelA.makeUrl("PUT", void 0, "things")).toBe("/model_a/things");
        return expect(modelA.makeUrl("DELETE", void 0, "things")).toBe("/model_a/things");
      });
      return it("Should test the makeUrl method having id override with extension and an undefined parent", function() {
        var modelC;
        modelC = new ModelC({
          id: 1
        });
        expect(modelC.makeUrl("GET", void 0, "things")).toBe("/model_c/things.json");
        expect(modelC.makeUrl("POST", void 0, "things")).toBe("/model_c.json");
        expect(modelC.makeUrl("PUT", void 0, "things")).toBe("/model_c/things.json");
        return expect(modelC.makeUrl("DELETE", void 0, "things")).toBe("/model_c/things.json");
      });
    });
    describe("Tesing model sync methods", function() {
      describe("Testing Sync Method Aliases", function() {
        var ModelA, modelA, sync_stub, _ref;
        ModelA = (function(_super) {
          __extends(ModelA, _super);

          function ModelA() {
            _ref = ModelA.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          ModelA.prototype.url = "model_a";

          return ModelA;

        })(Falcon.Model);
        modelA = null;
        sync_stub = null;
        beforeEach(function() {
          sync_stub = sinon.stub(ModelA.prototype, "sync");
          return modelA = new ModelA;
        });
        afterEach(function() {
          return sync_stub.restore();
        });
        it("Should call sync correctly on fetch without options", function() {
          modelA.fetch();
          expect(sync_stub).toHaveBeenCalledOnce();
          return expect(sync_stub).toHaveBeenCalledWith("GET", void 0);
        });
        it("Should call sync correctly on fetch with options", function() {
          modelA.fetch({});
          expect(sync_stub).toHaveBeenCalledOnce();
          return expect(sync_stub).toHaveBeenCalledWith("GET", {});
        });
        it("Should call sync correctly on create without options", function() {
          modelA.create();
          expect(sync_stub).toHaveBeenCalledOnce();
          return expect(sync_stub).toHaveBeenCalledWith("POST", void 0);
        });
        it("Should call sync correctly on create with options", function() {
          modelA.create({});
          expect(sync_stub).toHaveBeenCalledOnce();
          return expect(sync_stub).toHaveBeenCalledWith("POST", {});
        });
        it("Should call sync correctly on save without options", function() {
          modelA.set('id', 1);
          modelA.save();
          expect(sync_stub).toHaveBeenCalledOnce();
          return expect(sync_stub).toHaveBeenCalledWith("PUT", void 0);
        });
        it("Should call sync correctly on save with options", function() {
          modelA.set('id', 1);
          modelA.save({});
          expect(sync_stub).toHaveBeenCalledOnce();
          return expect(sync_stub).toHaveBeenCalledWith("PUT", {});
        });
        it("Should call sync correctly on destroy without options", function() {
          modelA.destroy();
          expect(sync_stub).toHaveBeenCalledOnce();
          return expect(sync_stub).toHaveBeenCalledWith("DELETE", void 0);
        });
        return it("Should call sync correctly on destroy with options", function() {
          modelA.destroy({});
          expect(sync_stub).toHaveBeenCalledOnce();
          return expect(sync_stub).toHaveBeenCalledWith("DELETE", {});
        });
      });
      describe("Testing sync method $.ajax calls", function() {
        var ModelA, ajax_stub, _ref;
        ModelA = (function(_super) {
          __extends(ModelA, _super);

          function ModelA() {
            _ref = ModelA.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          ModelA.prototype.url = "model_a";

          return ModelA;

        })(Falcon.Model);
        ajax_stub = null;
        beforeEach(function() {
          ajax_stub = sinon.stub(jQuery, "ajax");
          return Falcon.cache = false;
        });
        afterEach(function() {
          return ajax_stub.restore();
        });
        it("Should fetch properly without options", function() {
          var modelA;
          modelA = new ModelA({
            id: 1
          });
          modelA.fetch();
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            type: "GET"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: modelA.makeUrl("GET")
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            data: ""
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            contentType: "application/json"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            cache: false
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            headers: {}
          }));
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          return expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
        });
        it("Should fetch properly with options", function() {
          var modelA, _complete, _error, _success;
          modelA = new ModelA({
            id: 1
          });
          Falcon.cache = true;
          modelA.fetch({
            url: "http://www.falconjs.com",
            data: {
              "hello": "world"
            },
            contentType: "text/html",
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            },
            success: (_success = function() {}),
            error: (_error = function() {}),
            complete: (_complete = function() {})
          });
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            type: "GET"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: "http://www.falconjs.com"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            data: JSON.stringify({
              "hello": "world"
            })
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            contentType: "text/html"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            cache: true
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            }
          }));
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].success).not.toBe(_success);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].error).not.toBe(_error);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
          return expect(ajax_stub.firstCall.args[0].complete).not.toBe(_complete);
        });
        it("Should save properly without options", function() {
          var modelA;
          modelA = new ModelA({
            id: 1
          });
          modelA.save();
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            type: "PUT"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: modelA.makeUrl("PUT")
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            data: JSON.stringify({
              "id": 1
            })
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            contentType: "application/json"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            cache: false
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            headers: {}
          }));
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          return expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
        });
        it("Should save properly with options", function() {
          var modelA, _complete, _error, _success;
          modelA = new ModelA({
            id: 1
          });
          Falcon.cache = true;
          modelA.save({
            url: "http://www.falconjs.com",
            data: {
              "hello": "world"
            },
            contentType: "text/html",
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            },
            success: (_success = function() {}),
            error: (_error = function() {}),
            complete: (_complete = function() {})
          });
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            type: "PUT"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: "http://www.falconjs.com"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            data: JSON.stringify({
              "hello": "world"
            })
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            contentType: "text/html"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            cache: true
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            }
          }));
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].success).not.toBe(_success);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].error).not.toBe(_error);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
          return expect(ajax_stub.firstCall.args[0].complete).not.toBe(_complete);
        });
        it("Should create properly without options", function() {
          var modelA;
          modelA = new ModelA({
            id: 1
          });
          modelA.create();
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            type: "POST"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: modelA.makeUrl("POST")
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            data: JSON.stringify({
              "id": 1
            })
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            contentType: "application/json"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            cache: false
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            headers: {}
          }));
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          return expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
        });
        it("Should create properly with options", function() {
          var modelA, _complete, _error, _success;
          modelA = new ModelA({
            id: 1
          });
          Falcon.cache = true;
          modelA.create({
            url: "http://www.falconjs.com",
            data: {
              "hello": "world"
            },
            contentType: "text/html",
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            },
            success: (_success = function() {}),
            error: (_error = function() {}),
            complete: (_complete = function() {})
          });
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            type: "POST"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: "http://www.falconjs.com"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            data: JSON.stringify({
              "hello": "world"
            })
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            contentType: "text/html"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            cache: true
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            }
          }));
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].success).not.toBe(_success);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].error).not.toBe(_error);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
          return expect(ajax_stub.firstCall.args[0].complete).not.toBe(_complete);
        });
        it("Should destroy properly without options", function() {
          var modelA;
          modelA = new ModelA({
            id: 1
          });
          modelA.destroy();
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            type: "DELETE"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: modelA.makeUrl("DELETE")
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            data: ""
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            contentType: "application/json"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            cache: false
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            headers: {}
          }));
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          return expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
        });
        return it("Should destroy properly with options", function() {
          var modelA, _complete, _error, _success;
          modelA = new ModelA({
            id: 1
          });
          Falcon.cache = true;
          modelA.destroy({
            url: "http://www.falconjs.com",
            data: {
              "hello": "world"
            },
            contentType: "text/html",
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            },
            success: (_success = function() {}),
            error: (_error = function() {}),
            complete: (_complete = function() {})
          });
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            type: "DELETE"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: "http://www.falconjs.com"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            data: JSON.stringify({
              "hello": "world"
            })
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            contentType: "text/html"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            cache: true
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            }
          }));
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].success).not.toBe(_success);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].error).not.toBe(_error);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
          return expect(ajax_stub.firstCall.args[0].complete).not.toBe(_complete);
        });
      });
      describe("Testing sync method XHR responses", function() {
        var ModelA, complete_spy, create_spy, data, destroy_spy, error_data, error_spy, fetch_spy, fill_stub, modelA, options, parse_stub, save_spy, server, success_data, success_spy, _ref;
        ModelA = (function(_super) {
          __extends(ModelA, _super);

          function ModelA() {
            _ref = ModelA.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          ModelA.prototype.url = "model_a";

          return ModelA;

        })(Falcon.Model);
        server = null;
        modelA = null;
        parse_stub = null;
        fill_stub = null;
        fetch_spy = null;
        create_spy = null;
        save_spy = null;
        destroy_spy = null;
        success_spy = null;
        error_spy = null;
        complete_spy = null;
        data = null;
        error_data = null;
        success_data = null;
        options = null;
        beforeEach(function() {
          server = sinon.fakeServer.create();
          modelA = new ModelA;
          data = {
            "hello": "world"
          };
          error_data = {
            "error": "Something Wrong"
          };
          success_data = {
            "foo": "bar"
          };
          parse_stub = sinon.stub(modelA, "parse").returns(success_data);
          fill_stub = sinon.stub(modelA, "fill");
          modelA.on("fetch", (fetch_spy = sinon.spy()));
          modelA.on("create", (create_spy = sinon.spy()));
          modelA.on("save", (save_spy = sinon.spy()));
          modelA.on("destroy", (destroy_spy = sinon.spy()));
          return options = {
            success: (success_spy = sinon.spy()),
            error: (error_spy = sinon.spy()),
            complete: (complete_spy = sinon.spy())
          };
        });
        afterEach(function() {
          return server.restore();
        });
        it("Should call the proper success method", function() {
          modelA.fetch(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).toBe(1);
          expect(parse_stub.firstCall.args[0]).toEqual(data);
          expect(fill_stub.callCount).toBe(1);
          expect(fill_stub.firstCall.args[0]).toEqual(success_data);
          expect(fill_stub).toHaveBeenCalledAfter(parse_stub);
          expect(fetch_spy).toHaveBeenCalledOnce();
          expect(create_spy).not.toHaveBeenCalled();
          expect(save_spy).not.toHaveBeenCalled();
          expect(destroy_spy).not.toHaveBeenCalled();
          expect(fetch_spy).toHaveBeenCalledAfter(fill_stub);
          expect(success_spy.callCount).toBe(1);
          expect(success_spy).toHaveBeenCalledOn(modelA);
          expect(success_spy.firstCall.args.length).toBe(4);
          expect(success_spy.firstCall.args[0]).toBe(modelA);
          expect(error_spy).not.toHaveBeenCalled();
          expect(complete_spy.callCount).toBe(1);
          expect(complete_spy).toHaveBeenCalledOn(modelA);
          expect(complete_spy.firstCall.args.length).toBe(3);
          expect(complete_spy.firstCall.args[0]).toBe(modelA);
          return expect(complete_spy).toHaveBeenCalledAfter(success_spy);
        });
        it("Should not fill when fill option is false on fetch", function() {
          options.fill = false;
          modelA.fetch(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).toBe(1);
          expect(parse_stub.firstCall.args[0]).toEqual(data);
          expect(fill_stub.callCount).toBe(0);
          expect(fetch_spy).toHaveBeenCalledOnce();
          expect(create_spy).not.toHaveBeenCalled();
          expect(save_spy).not.toHaveBeenCalled();
          expect(destroy_spy).not.toHaveBeenCalled();
          expect(fetch_spy).toHaveBeenCalledAfter(parse_stub);
          expect(success_spy.callCount).toBe(1);
          expect(success_spy).toHaveBeenCalledOn(modelA);
          expect(success_spy.firstCall.args.length).toBe(4);
          expect(success_spy.firstCall.args[0]).toBe(modelA);
          expect(error_spy).not.toHaveBeenCalled();
          expect(complete_spy.callCount).toBe(1);
          expect(complete_spy).toHaveBeenCalledOn(modelA);
          expect(complete_spy.firstCall.args.length).toBe(3);
          expect(complete_spy.firstCall.args[0]).toBe(modelA);
          return expect(complete_spy).toHaveBeenCalledAfter(success_spy);
        });
        it("Should call the error response on an errornous result", function() {
          modelA.fetch(options);
          server.respondWith([400, {}, JSON.stringify(error_data)]);
          server.respond();
          expect(parse_stub.callCount).toBe(0);
          expect(fill_stub.callCount).toBe(0);
          expect(fetch_spy).not.toHaveBeenCalled();
          expect(create_spy).not.toHaveBeenCalled();
          expect(save_spy).not.toHaveBeenCalled();
          expect(destroy_spy).not.toHaveBeenCalled();
          expect(success_spy.callCount).toBe(0);
          expect(error_spy.callCount).toBe(1);
          expect(error_spy.firstCall.args.length).toBe(3);
          expect(error_spy).toHaveBeenCalledOn(modelA);
          expect(complete_spy.firstCall.args[0]).toBe(modelA);
          expect(complete_spy.callCount).toBe(1);
          expect(complete_spy).toHaveBeenCalledOn(modelA);
          expect(complete_spy.firstCall.args.length).toBe(3);
          expect(complete_spy.firstCall.args[0]).toBe(modelA);
          return expect(complete_spy).toHaveBeenCalledAfter(error_spy);
        });
        it("Should call the success response on create", function() {
          modelA.create(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).toBe(1);
          expect(parse_stub.firstCall.args[0]).toEqual(data);
          expect(fill_stub.callCount).toBe(1);
          expect(fill_stub.firstCall.args[0]).toEqual(success_data);
          expect(fill_stub).toHaveBeenCalledAfter(parse_stub);
          expect(fetch_spy).not.toHaveBeenCalled();
          expect(create_spy.callCount).toBe(1);
          expect(save_spy).not.toHaveBeenCalled();
          expect(destroy_spy).not.toHaveBeenCalled();
          expect(success_spy.callCount).toBe(1);
          expect(success_spy).toHaveBeenCalledOn(modelA);
          expect(success_spy.firstCall.args.length).toBe(4);
          expect(success_spy.firstCall.args[0]).toBe(modelA);
          expect(error_spy).not.toHaveBeenCalled();
          expect(complete_spy.callCount).toBe(1);
          expect(complete_spy).toHaveBeenCalledOn(modelA);
          expect(complete_spy.firstCall.args.length).toBe(3);
          expect(complete_spy.firstCall.args[0]).toBe(modelA);
          return expect(complete_spy).toHaveBeenCalledAfter(success_spy);
        });
        it("Should call the success response on save", function() {
          modelA.set('id', 1);
          modelA.save(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).toBe(1);
          expect(parse_stub.firstCall.args[0]).toEqual(data);
          expect(fill_stub.callCount).toBe(1);
          expect(fill_stub.firstCall.args[0]).toEqual(success_data);
          expect(fill_stub).toHaveBeenCalledAfter(parse_stub);
          expect(fetch_spy).not.toHaveBeenCalled();
          expect(create_spy).not.toHaveBeenCalled();
          expect(save_spy.callCount).toBe(1);
          expect(destroy_spy).not.toHaveBeenCalled();
          expect(success_spy.callCount).toBe(1);
          expect(success_spy).toHaveBeenCalledOn(modelA);
          expect(success_spy.firstCall.args.length).toBe(4);
          expect(success_spy.firstCall.args[0]).toBe(modelA);
          expect(error_spy).not.toHaveBeenCalled();
          expect(complete_spy.callCount).toBe(1);
          expect(complete_spy).toHaveBeenCalledOn(modelA);
          expect(complete_spy.firstCall.args.length).toBe(3);
          expect(complete_spy.firstCall.args[0]).toBe(modelA);
          return expect(complete_spy).toHaveBeenCalledAfter(success_spy);
        });
        return it("Should call the success response on destroy", function() {
          modelA.destroy(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).toBe(1);
          expect(parse_stub.firstCall.args[0]).toEqual(data);
          expect(fill_stub.callCount).toBe(1);
          expect(fill_stub.firstCall.args[0]).toEqual(success_data);
          expect(fill_stub).toHaveBeenCalledAfter(parse_stub);
          expect(fetch_spy).not.toHaveBeenCalled();
          expect(create_spy).not.toHaveBeenCalled();
          expect(save_spy).not.toHaveBeenCalled();
          expect(destroy_spy.callCount).toBe(1);
          expect(success_spy.callCount).toBe(1);
          expect(success_spy).toHaveBeenCalledOn(modelA);
          expect(success_spy.firstCall.args.length).toBe(4);
          expect(success_spy.firstCall.args[0]).toBe(modelA);
          expect(error_spy).not.toHaveBeenCalled();
          expect(complete_spy.callCount).toBe(1);
          expect(complete_spy).toHaveBeenCalledOn(modelA);
          expect(complete_spy.firstCall.args.length).toBe(3);
          expect(complete_spy.firstCall.args[0]).toBe(modelA);
          return expect(complete_spy).toHaveBeenCalledAfter(success_spy);
        });
      });
      describe("Testing sync method options in depth", function() {
        var ModelA, ModelB, ajax_stub, _ref, _ref1;
        ModelA = (function(_super) {
          __extends(ModelA, _super);

          function ModelA() {
            _ref = ModelA.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          ModelA.prototype.url = "model_a";

          return ModelA;

        })(Falcon.Model);
        ModelB = (function(_super) {
          __extends(ModelB, _super);

          function ModelB() {
            _ref1 = ModelB.__super__.constructor.apply(this, arguments);
            return _ref1;
          }

          ModelB.prototype.url = "model_b";

          return ModelB;

        })(Falcon.Model);
        ajax_stub = null;
        beforeEach(function() {
          ajax_stub = sinon.stub(jQuery, "ajax");
          return Falcon.cache = false;
        });
        afterEach(function() {
          return ajax_stub.restore();
        });
        it("Should sync properly without options", function() {
          var modelA;
          modelA = new ModelA({
            id: 1
          });
          modelA.sync('GET');
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            type: "GET"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: modelA.makeUrl("GET")
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            data: ""
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            contentType: "application/json"
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            cache: false
          }));
          expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            headers: {}
          }));
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          return expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
        });
        it("Should allow for a specified parent to override", function() {
          var modelA, model_b;
          modelA = new ModelA({
            id: 1
          }, new ModelB({
            id: 'b'
          }));
          modelA.sync('GET', {
            parent: (model_b = new ModelB({
              id: 'b2'
            }))
          });
          return expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: modelA.makeUrl("GET", model_b)
          }));
        });
        return it("Should allow for a null parent", function() {
          var modelA;
          modelA = new ModelA({
            id: 1
          }, new ModelB({
            id: 'b'
          }));
          modelA.sync('GET', {
            parent: null
          });
          return expect(ajax_stub).toHaveBeenCalledWith(jasmine.objectContaining({
            url: modelA.makeUrl("GET", null)
          }));
        });
      });
      return describe("Additional miscellaneous sync tests", function() {
        var ModelA, ModelB, server, _ref, _ref1;
        ModelA = (function(_super) {
          __extends(ModelA, _super);

          function ModelA() {
            _ref = ModelA.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          ModelA.prototype.url = "model_a";

          return ModelA;

        })(Falcon.Model);
        ModelB = (function(_super) {
          __extends(ModelB, _super);

          function ModelB() {
            _ref1 = ModelB.__super__.constructor.apply(this, arguments);
            return _ref1;
          }

          ModelB.prototype.url = "model_b";

          return ModelB;

        })(Falcon.Model);
        server = null;
        beforeEach(function() {
          server = sinon.fakeServer.create();
          return Falcon.cache = false;
        });
        afterEach(function() {
          return server.restore();
        });
        it("Should allow for a third parameter to define the context", function() {
          var modelA, modelB, success_spy;
          modelB = new ModelB({
            id: 'b'
          });
          modelA = new ModelA({
            id: 1
          });
          modelA.sync("GET", (success_spy = sinon.spy()), modelB);
          server.respondWith([200, {}, JSON.stringify(modelA.serialize())]);
          server.respond();
          expect(success_spy).toHaveBeenCalled();
          return expect(success_spy).toHaveBeenCalledOn(modelB);
        });
        it("Should let pass context from fetch to sync", function() {
          var modelA, modelB, success_spy, sync_stub;
          modelB = new ModelB({
            id: 'b'
          });
          modelA = new ModelA({
            id: 1
          });
          sync_stub = sinon.stub(modelA, "sync");
          modelA.fetch((success_spy = sinon.spy()), modelB);
          expect(sync_stub).toHaveBeenCalled();
          expect(sync_stub.firstCall.args[1]).toBe(success_spy);
          return expect(sync_stub.firstCall.args[2]).toBe(modelB);
        });
        it("Should let pass context from create to sync", function() {
          var modelA, modelB, success_spy, sync_stub;
          modelB = new ModelB({
            id: 'b'
          });
          modelA = new ModelA({
            id: 1
          });
          sync_stub = sinon.stub(modelA, "sync");
          modelA.create((success_spy = sinon.spy()), modelB);
          expect(sync_stub).toHaveBeenCalled();
          expect(sync_stub.firstCall.args[1]).toBe(success_spy);
          return expect(sync_stub.firstCall.args[2]).toBe(modelB);
        });
        it("Should let pass context from save to sync", function() {
          var modelA, modelB, success_spy, sync_stub;
          modelB = new ModelB({
            id: 'b'
          });
          modelA = new ModelA({
            id: 1
          });
          sync_stub = sinon.stub(modelA, "sync");
          modelA.save((success_spy = sinon.spy()), modelB);
          expect(sync_stub).toHaveBeenCalled();
          expect(sync_stub.firstCall.args[1]).toBe(success_spy);
          return expect(sync_stub.firstCall.args[2]).toBe(modelB);
        });
        return it("Should let pass context from destroy to sync", function() {
          var modelA, modelB, success_spy, sync_stub;
          modelB = new ModelB({
            id: 'b'
          });
          modelA = new ModelA({
            id: 1
          });
          sync_stub = sinon.stub(modelA, "sync");
          modelA.destroy((success_spy = sinon.spy()), modelB);
          expect(sync_stub).toHaveBeenCalled();
          expect(sync_stub.firstCall.args[1]).toBe(success_spy);
          return expect(sync_stub.firstCall.args[2]).toBe(modelB);
        });
      });
    });
    it("Should match equality properly", function() {
      var ModelA, modelA_1, modelA_2, modelA_a, modelA_null_1, modelA_null_2, _ref;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        return ModelA;

      })(Falcon.Model);
      modelA_1 = new ModelA({
        id: 1
      });
      modelA_2 = new ModelA({
        id: 2
      });
      modelA_a = new ModelA({
        id: 'a'
      });
      modelA_null_1 = new ModelA;
      modelA_null_2 = new ModelA;
      expect(modelA_1.equals(modelA_1)).toBe(true);
      expect(modelA_1.equals(modelA_2)).toBe(false);
      expect(modelA_1.equals(1)).toBe(true);
      expect(modelA_1.equals(new ModelA({
        id: 1
      }))).toBe(true);
      expect(modelA_a.equals(modelA_a)).toBe(true);
      expect(modelA_a.equals(modelA_2)).toBe(false);
      expect(modelA_a.equals('a')).toBe(true);
      expect(modelA_a.equals(new ModelA({
        id: 'a'
      }))).toBe(true);
      expect(modelA_null_1.equals(modelA_null_2)).toBe(false);
      return expect(modelA_null_1.equals(modelA_null_1)).toBe(true);
    });
    describe("Testing the mixin method", function() {
      it("Should implement mixins properly", function() {
        var ModelA, ModelB, mixin_spy, modelA, _ref, _ref1;
        ModelA = (function(_super) {
          __extends(ModelA, _super);

          function ModelA() {
            _ref = ModelA.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          ModelA.prototype.initialize = function() {
            return this.model_b = new ModelB;
          };

          return ModelA;

        })(Falcon.Model);
        ModelB = (function(_super) {
          __extends(ModelB, _super);

          function ModelB() {
            _ref1 = ModelB.__super__.constructor.apply(this, arguments);
            return _ref1;
          }

          return ModelB;

        })(Falcon.Model);
        modelA = new ModelA;
        expect(modelA.hello).not.toBeDefined();
        expect(modelA.foo).not.toBeDefined();
        expect(modelA.model_b.test).not.toBeDefined();
        modelA.mixin({
          "hello": (mixin_spy = sinon.spy()),
          "foo": ko.observable("bar"),
          "model_b": {
            "test": "123"
          }
        });
        expect(modelA.hello).toBeDefined();
        expect(modelA.hello).toEqual(jasmine.any(Function));
        expect(ko.isObservable(modelA.foo)).toBe(true);
        expect(modelA.foo()).toBe('bar');
        expect(modelA.model_b.test).toBeDefined();
        expect(modelA.model_b.test).toBe('123');
        modelA.hello('world');
        expect(mixin_spy).toHaveBeenCalledOnce();
        expect(mixin_spy).toHaveBeenCalledOn(modelA);
        expect(mixin_spy.firstCall.args[0]).toBe(modelA);
        return expect(mixin_spy.firstCall.args[1]).toBe('world');
      });
      return it("Should preserve existing values in the model", function() {
        var ModelA, model_a, _ref;
        ModelA = (function(_super) {
          __extends(ModelA, _super);

          function ModelA() {
            _ref = ModelA.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          return ModelA;

        })(Falcon.Model);
        model_a = new ModelA({
          "hello": "world",
          "foo": "bar"
        });
        expect(model_a.get("hello")).toBe("world");
        expect(model_a.get("foo")).toBe("bar");
        expect(ko.isObservable(model_a.hello)).toBe(false);
        model_a.mixin({
          "hello": ko.observable(),
          "foo": "baz"
        });
        expect(model_a.get("hello")).toBe("world");
        expect(model_a.get("foo")).toBe("bar");
        return expect(ko.isObservable(model_a.hello)).toBe(true);
      });
    });
    describe("Testing clone() method", function() {
      var ModelA, ModelB, ModelC, _ref, _ref1, _ref2;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        ModelA.prototype.initialize = function() {
          return this.foo = ko.observable();
        };

        return ModelA;

      })(Falcon.Model);
      ModelB = (function(_super) {
        __extends(ModelB, _super);

        function ModelB() {
          _ref1 = ModelB.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        return ModelB;

      })(Falcon.Model);
      ModelC = (function(_super) {
        __extends(ModelC, _super);

        function ModelC() {
          _ref2 = ModelC.__super__.constructor.apply(this, arguments);
          return _ref2;
        }

        return ModelC;

      })(Falcon.Model);
      it("Should do a basic clone properly", function() {
        var modelA1, modelA2, modelB;
        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.clone();
        expect(modelA1).not.toBe(modelA2);
        expect(modelA2.hello).toBeDefined();
        expect(modelA2.foo).toBeDefined();
        expect(modelA2.id).toBeDefined();
        expect(modelA2.parent).toBeDefined();
        expect(modelA2.id).toBe(1);
        expect(modelA2.parent).toBe(modelB);
        expect(ko.isObservable(modelA2.foo)).toBe(true);
        return expect(modelA2.foo()).toBe("bar");
      });
      it("Should do clone properly additional fields properly", function() {
        var modelA1, modelA2, modelB;
        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.clone(["id", "foo"]);
        expect(modelA1).not.toBe(modelA2);
        expect(modelA2.hello).not.toBeDefined();
        expect(modelA2.foo).toBeDefined();
        expect(modelA2.id).toBeDefined();
        expect(modelA2.parent).toBeDefined();
        expect(modelA2.id).toBe(1);
        expect(modelA2.parent).toBe(modelB);
        expect(ko.isObservable(modelA2.foo)).toBe(true);
        return expect(modelA2.foo()).toBe("bar");
      });
      it("Should do clone properly additional fields properly without parent", function() {
        var modelA1, modelA2, modelB;
        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.clone(["id", "hello"], null);
        expect(modelA1).not.toBe(modelA2);
        expect(modelA2.hello).toBeDefined();
        expect(modelA2.foo).toBeDefined();
        expect(modelA2.id).toBeDefined();
        expect(modelA2.parent).toBeNull();
        expect(modelA2.id).toBe(1);
        expect(modelA2.parent).toBeNull();
        expect(ko.isObservable(modelA2.hello)).toBe(false);
        expect(modelA2.hello).toBe("world");
        expect(ko.isObservable(modelA2.foo)).toBe(true);
        return expect(modelA2.foo()).not.toBeDefined();
      });
      it("Should do clone properly with additional fields properly without parent or id fields", function() {
        var modelA1, modelA2, modelB;
        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.clone(["hello"], null);
        expect(modelA1).not.toBe(modelA2);
        expect(modelA2.hello).toBeDefined();
        expect(modelA2.foo).toBeDefined();
        expect(modelA2.parent).toBeNull();
        expect(modelA2.id).toBeNull();
        expect(modelA2.parent).toBeNull();
        expect(ko.isObservable(modelA2.hello)).toBe(false);
        expect(modelA2.hello).toBe("world");
        expect(ko.isObservable(modelA2.foo)).toBe(true);
        return expect(modelA2.foo()).not.toBeDefined();
      });
      it("Should do clone properly additional fields properly with new parent", function() {
        var modelA1, modelA2, modelB, modelC;
        modelC = new ModelC();
        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.clone(["id", "hello"], modelC);
        expect(modelA1).not.toBe(modelA2);
        expect(modelA2.hello).toBeDefined();
        expect(modelA2.foo).toBeDefined();
        expect(modelA2.id).toBeDefined();
        expect(modelA2.parent).toBeDefined();
        expect(modelA2.parent).toBe(modelC);
        expect(modelA2.id).toBe(1);
        expect(modelA2.parent).toBe(modelC);
        expect(ko.isObservable(modelA2.hello)).toBe(false);
        expect(modelA2.hello).toBe("world");
        expect(ko.isObservable(modelA2.foo)).toBe(true);
        return expect(modelA2.foo()).not.toBeDefined();
      });
      return it("Should do clone properly additional fields properly with new parent or id fields", function() {
        var modelA1, modelA2, modelB, modelC;
        modelC = new ModelC();
        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.clone(["hello"], modelC);
        expect(modelA1).not.toBe(modelA2);
        expect(modelA2.hello).toBeDefined();
        expect(modelA2.foo).toBeDefined();
        expect(modelA2.parent).toBeDefined();
        expect(modelA2.parent).toBe(modelC);
        expect(modelA2.id).toBeNull();
        expect(modelA2.parent).toBe(modelC);
        expect(ko.isObservable(modelA2.hello)).toBe(false);
        expect(modelA2.hello).toBe("world");
        expect(ko.isObservable(modelA2.foo)).toBe(true);
        return expect(modelA2.foo()).not.toBeDefined();
      });
    });
    return it("Should properly detect if the model is new or not", function() {
      var ModelA, modelA, _ref;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        return ModelA;

      })(Falcon.Model);
      modelA = new ModelA;
      expect(modelA.isNew()).toBe(true);
      modelA = new ModelA({
        id: 1
      });
      expect(modelA.isNew()).toBe(false);
      modelA = new ModelA({
        id: 'a'
      });
      return expect(modelA.isNew()).toBe(false);
    });
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Falcon.Collection", function() {
    var CollectionA, CollectionB, CollectionC, CollectionD, CollectionD2, CollectionD3, CollectionE, ModelA, ModelB, ModelC, ModelD, ModelE, _ref, _ref1, _ref10, _ref11, _ref2, _ref3, _ref4, _ref5, _ref6, _ref7, _ref8, _ref9;
    ModelA = (function(_super) {
      __extends(ModelA, _super);

      function ModelA() {
        _ref = ModelA.__super__.constructor.apply(this, arguments);
        return _ref;
      }

      ModelA.prototype.url = 'model_a';

      return ModelA;

    })(Falcon.Model);
    ModelB = (function(_super) {
      __extends(ModelB, _super);

      function ModelB() {
        _ref1 = ModelB.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      ModelB.prototype.url = 'model_b';

      return ModelB;

    })(Falcon.Model);
    ModelC = (function(_super) {
      __extends(ModelC, _super);

      function ModelC() {
        _ref2 = ModelC.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      ModelC.prototype.url = 'model_c';

      return ModelC;

    })(Falcon.Model);
    ModelD = (function(_super) {
      __extends(ModelD, _super);

      function ModelD() {
        _ref3 = ModelD.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      ModelD.prototype.url = function() {
        return 'model_d';
      };

      return ModelD;

    })(Falcon.Model);
    CollectionA = (function(_super) {
      __extends(CollectionA, _super);

      function CollectionA() {
        _ref4 = CollectionA.__super__.constructor.apply(this, arguments);
        return _ref4;
      }

      CollectionA.prototype.model = ModelA;

      return CollectionA;

    })(Falcon.Collection);
    CollectionB = (function(_super) {
      __extends(CollectionB, _super);

      function CollectionB() {
        _ref5 = CollectionB.__super__.constructor.apply(this, arguments);
        return _ref5;
      }

      CollectionB.prototype.model = ModelB;

      return CollectionB;

    })(Falcon.Collection);
    CollectionC = (function(_super) {
      __extends(CollectionC, _super);

      function CollectionC() {
        _ref6 = CollectionC.__super__.constructor.apply(this, arguments);
        return _ref6;
      }

      CollectionC.prototype.model = ModelC;

      return CollectionC;

    })(Falcon.Collection);
    CollectionD = (function(_super) {
      __extends(CollectionD, _super);

      function CollectionD() {
        _ref7 = CollectionD.__super__.constructor.apply(this, arguments);
        return _ref7;
      }

      CollectionD.prototype.model = ModelD;

      return CollectionD;

    })(Falcon.Collection);
    CollectionD2 = (function(_super) {
      __extends(CollectionD2, _super);

      function CollectionD2() {
        _ref8 = CollectionD2.__super__.constructor.apply(this, arguments);
        return _ref8;
      }

      CollectionD2.prototype.model = ModelD;

      CollectionD2.prototype.url = 'collection_d2';

      return CollectionD2;

    })(Falcon.Collection);
    CollectionD3 = (function(_super) {
      __extends(CollectionD3, _super);

      function CollectionD3() {
        _ref9 = CollectionD3.__super__.constructor.apply(this, arguments);
        return _ref9;
      }

      CollectionD3.prototype.model = ModelD;

      CollectionD3.prototype.url = function() {
        return 'collection_d3';
      };

      return CollectionD3;

    })(Falcon.Collection);
    ModelE = (function(_super) {
      __extends(ModelE, _super);

      function ModelE() {
        _ref10 = ModelE.__super__.constructor.apply(this, arguments);
        return _ref10;
      }

      ModelE.prototype.url = 'model_e';

      ModelE.prototype.initialize = function() {
        return this.title = ko.observable();
      };

      return ModelE;

    })(Falcon.Model);
    CollectionE = (function(_super) {
      __extends(CollectionE, _super);

      function CollectionE() {
        _ref11 = CollectionE.__super__.constructor.apply(this, arguments);
        return _ref11;
      }

      CollectionE.prototype.model = ModelE;

      return CollectionE;

    })(Falcon.Collection);
    beforeEach(function() {
      Falcon.baseApiUrl = "";
      return Falcon.baseTemplateUrl = "";
    });
    it("Should initialize properly", function() {
      var collectionA, init_stub, modelB, models;
      init_stub = sinon.stub(CollectionA.prototype, "initialize");
      collectionA = new CollectionA;
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith();
      expect(init_stub).toHaveBeenCalledOn(collectionA);
      init_stub.reset();
      models = [
        {
          "hello": "world"
        }, {
          "hello": "world2"
        }
      ];
      collectionA = new CollectionA(models);
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith(models);
      expect(collectionA.parent).not.toBeDefined();
      expect(collectionA.length()).toBe(2);
      init_stub.reset();
      modelB = new ModelB;
      collectionA = new CollectionA(models, modelB);
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith(models);
      expect(collectionA.parent).toBe(modelB);
      expect(collectionA.length()).toBe(2);
      init_stub.reset();
      modelB = new ModelB;
      collectionA = new CollectionA(modelB, models);
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith(models);
      expect(collectionA.parent).toBe(modelB);
      expect(collectionA.length()).toBe(2);
      init_stub.reset();
      models = [
        new ModelA({
          "hello": "world"
        }), new ModelA({
          "hello": "world2"
        })
      ];
      collectionA = new CollectionA(models);
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith(models);
      expect(collectionA.parent).not.toBeDefined();
      expect(collectionA.length()).toBe(2);
      init_stub.reset();
      modelB = new ModelB;
      collectionA = new CollectionA(models, modelB);
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith(models);
      expect(collectionA.parent).toBe(modelB);
      expect(collectionA.length()).toBe(2);
      init_stub.reset();
      modelB = new ModelB;
      collectionA = new CollectionA(modelB, models);
      expect(init_stub).toHaveBeenCalledOnce();
      expect(init_stub).toHaveBeenCalledWith(models);
      expect(collectionA.parent).toBe(modelB);
      expect(collectionA.length()).toBe(2);
      init_stub.reset();
      return init_stub.restore();
    });
    it("Should create RawrCollection with defaults that have correct arguments", function() {
      var RawrCollection, hello_spy, input_data, rawr_class, _ref12;
      hello_spy = null;
      RawrCollection = (function(_super) {
        __extends(RawrCollection, _super);

        function RawrCollection() {
          _ref12 = RawrCollection.__super__.constructor.apply(this, arguments);
          return _ref12;
        }

        RawrCollection.prototype.defaults = {
          'hello': (hello_spy = sinon.spy())
        };

        return RawrCollection;

      })(Falcon.Collection);
      expect(hello_spy).not.toHaveBeenCalled();
      rawr_class = new RawrCollection(input_data = ["one", "two", "three"]);
      expect(hello_spy).toHaveBeenCalled;
      expect(hello_spy.callCount).toBe(1);
      expect(hello_spy.firstCall.args.length).toBe(1);
      return expect(hello_spy.firstCall.args[0]).toBe(input_data);
    });
    describe("Testing the different fill method combinations", function() {
      describe("Test default option", function() {
        it("Should properly add items into an empty collection", function() {
          var collectionA;
          collectionA = new CollectionA;
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ]);
          expect(collectionA.length()).toBe(2);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(2);
          return expect(collectionA.at(1).get('hello')).toBe("world2");
        });
        return it("Should properly replace items into a populated collection", function() {
          var collectionA;
          collectionA = new CollectionA([
            {
              id: 2,
              "hello": "world3"
            }
          ]);
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ]);
          expect(collectionA.length()).toBe(2);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(2);
          return expect(collectionA.at(1).get('hello')).toBe("world2");
        });
      });
      describe("Test 'replace' option", function() {
        it("Should properly add items into an empty collection", function() {
          var collectionA;
          collectionA = new CollectionA;
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'replace'
          });
          expect(collectionA.length()).toBe(2);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(2);
          return expect(collectionA.at(1).get('hello')).toBe("world2");
        });
        return it("Should properly replace items into a populated collection", function() {
          var collectionA;
          collectionA = new CollectionA([
            {
              id: 2,
              "hello": "world3"
            }
          ]);
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'replace'
          });
          expect(collectionA.length()).toBe(2);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(2);
          return expect(collectionA.at(1).get('hello')).toBe("world2");
        });
      });
      describe("Test 'append' option", function() {
        it("Should properly add items into an empty collection", function() {
          var collectionA;
          collectionA = new CollectionA;
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'append'
          });
          expect(collectionA.length()).toBe(2);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(2);
          return expect(collectionA.at(1).get('hello')).toBe("world2");
        });
        return it("Should properly append items into a populated collection", function() {
          var collectionA;
          collectionA = new CollectionA([
            {
              id: 3,
              "hello": "world3"
            }
          ]);
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'append'
          });
          expect(collectionA.length()).toBe(3);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(3);
          expect(collectionA.at(0).get('hello')).toBe("world3");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(1);
          expect(collectionA.at(1).get('hello')).toBe("world");
          expect(collectionA.at(2)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(2).get('id')).toBe(2);
          return expect(collectionA.at(2).get('hello')).toBe("world2");
        });
      });
      describe("Test 'prepend' option", function() {
        it("Should properly add items into an empty collection", function() {
          var collectionA;
          collectionA = new CollectionA;
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'prepend'
          });
          expect(collectionA.length()).toBe(2);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(2);
          return expect(collectionA.at(1).get('hello')).toBe("world2");
        });
        return it("Should properly prepend items into a populated collection", function() {
          var collectionA, index;
          collectionA = new CollectionA([
            {
              id: 3,
              "hello": "world3"
            }
          ]);
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'prepend'
          });
          index = 0;
          expect(collectionA.length()).toBe(3);
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(1);
          expect(collectionA.at(index).get('hello')).toBe("world");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(2);
          expect(collectionA.at(index).get('hello')).toBe("world2");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(3);
          return expect(collectionA.at(index).get('hello')).toBe("world3");
        });
      });
      describe("Test 'merge' option", function() {
        it("Should properly add items into an empty collection", function() {
          var collectionA;
          collectionA = new CollectionA;
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'merge'
          });
          expect(collectionA.length()).toBe(2);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(2);
          return expect(collectionA.at(1).get('hello')).toBe("world2");
        });
        it("Should properly merge items into a populated collection", function() {
          var collectionA, index;
          collectionA = new CollectionA([
            {
              id: 3,
              "hello": "world3"
            }, {
              id: 4,
              "hello": "world4"
            }
          ]);
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }, {
              id: 4,
              "hello": "world5"
            }
          ], {
            'method': 'merge'
          });
          index = 0;
          expect(collectionA.length()).toBe(4);
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(3);
          expect(collectionA.at(index).get('hello')).toBe("world3");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(4);
          expect(collectionA.at(index).get('hello')).toBe("world5");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(1);
          expect(collectionA.at(index).get('hello')).toBe("world");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(2);
          expect(collectionA.at(index).get('hello')).toBe("world2");
          return index++;
        });
        return it("Should properly merge items into a populated collection that has a specified comparator", function() {
          var collectionA, index;
          collectionA = new CollectionA([
            {
              id: 3,
              "hello": "world3"
            }, {
              id: 4,
              "hello": "world4"
            }
          ]);
          collectionA.comparator = function(model_a, model_b) {
            var a_id, b_id;
            a_id = parseInt(model_a.get("id"));
            b_id = parseInt(model_b.get("id"));
            if (a_id > b_id) {
              return -1;
            }
            if (a_id < b_id) {
              return 1;
            }
            return 0;
          };
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }, {
              id: 4,
              "hello": "world5"
            }
          ], {
            'method': 'merge'
          });
          index = 0;
          expect(collectionA.length()).toBe(4);
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(4);
          expect(collectionA.at(index).get('hello')).toBe("world5");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(3);
          expect(collectionA.at(index).get('hello')).toBe("world3");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(2);
          expect(collectionA.at(index).get('hello')).toBe("world2");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(1);
          expect(collectionA.at(index).get('hello')).toBe("world");
          return index++;
        });
      });
      describe("Test 'insert' option", function() {
        it("Should properly add items into an empty collection", function() {
          var collectionA;
          collectionA = new CollectionA;
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'insert',
            'insert_index': 2
          });
          expect(collectionA.length()).toBe(2);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(2);
          return expect(collectionA.at(1).get('hello')).toBe("world2");
        });
        it("Should properly insert items into a populated collection", function() {
          var collectionA, index;
          collectionA = new CollectionA([
            {
              id: 3,
              "hello": "world3"
            }, {
              id: 4,
              "hello": "world4"
            }
          ]);
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'insert',
            'insert_index': 1
          });
          index = 0;
          expect(collectionA.length()).toBe(4);
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(3);
          expect(collectionA.at(index).get('hello')).toBe("world3");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(1);
          expect(collectionA.at(index).get('hello')).toBe("world");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(2);
          expect(collectionA.at(index).get('hello')).toBe("world2");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(4);
          expect(collectionA.at(index).get('hello')).toBe("world4");
          return index++;
        });
        it("Should properly insert items into a populated collection at an invalid index", function() {
          var collectionA, index;
          collectionA = new CollectionA([
            {
              id: 3,
              "hello": "world3"
            }, {
              id: 4,
              "hello": "world4"
            }
          ]);
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'insert',
            'insert_index': 5
          });
          index = 0;
          expect(collectionA.length()).toBe(4);
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(3);
          expect(collectionA.at(index).get('hello')).toBe("world3");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(4);
          expect(collectionA.at(index).get('hello')).toBe("world4");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(1);
          expect(collectionA.at(index).get('hello')).toBe("world");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(2);
          expect(collectionA.at(index).get('hello')).toBe("world2");
          return index++;
        });
        return it("Should properly insert items into the beginning of a populated collection", function() {
          var collectionA, index;
          collectionA = new CollectionA([
            {
              id: 3,
              "hello": "world3"
            }, {
              id: 4,
              "hello": "world4"
            }
          ]);
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'insert',
            'insert_index': 0
          });
          index = 0;
          expect(collectionA.length()).toBe(4);
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(1);
          expect(collectionA.at(index).get('hello')).toBe("world");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(2);
          expect(collectionA.at(index).get('hello')).toBe("world2");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(3);
          expect(collectionA.at(index).get('hello')).toBe("world3");
          index++;
          expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(index).get('id')).toBe(4);
          expect(collectionA.at(index).get('hello')).toBe("world4");
          return index++;
        });
      });
      describe("Test invalid option", function() {
        it("Should properly add items into an empty collection", function() {
          var collectionA;
          collectionA = new CollectionA;
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'invalid'
          });
          expect(collectionA.length()).toBe(2);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(2);
          return expect(collectionA.at(1).get('hello')).toBe("world2");
        });
        return it("Should properly replace items into a populated collection", function() {
          var collectionA;
          collectionA = new CollectionA([
            {
              id: 2,
              "hello": "world3"
            }
          ]);
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }, {
              id: 2,
              "hello": "world2"
            }
          ], {
            'method': 'invalid'
          });
          expect(collectionA.length()).toBe(2);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          expect(collectionA.at(1)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(1).get('id')).toBe(2);
          return expect(collectionA.at(1).get('hello')).toBe("world2");
        });
      });
      return describe("Test that parent is being set properly on children models", function() {
        return it("Should properly add items into an empty collection", function() {
          var collectionA, modelB;
          modelB = new ModelB;
          collectionA = new CollectionA(modelB);
          collectionA.fill([
            {
              id: 1,
              "hello": "world"
            }
          ]);
          expect(collectionA.length()).toBe(1);
          expect(collectionA.at(0)).toEqual(jasmine.any(ModelA));
          expect(collectionA.at(0).get('id')).toBe(1);
          expect(collectionA.at(0).get('hello')).toBe("world");
          return expect(collectionA.at(0).parent).toBe(modelB);
        });
      });
    });
    describe("Testing serialize method with proper options", function() {
      var collectionA, collectionC, models;
      collectionA = collectionC = null;
      models = [
        {
          id: 1,
          "hello": "world",
          "foo": "bar"
        }, {
          id: 2,
          "hello": "world2",
          "foo": "bar2"
        }, {
          id: 'a',
          "hello": "worldA",
          "foo": "barA"
        }
      ];
      beforeEach(function() {
        collectionA = new CollectionA(models);
        return collectionC = new CollectionC(models);
      });
      it("Should test basic form of serialize method", function() {
        var serialized;
        serialized = collectionA.serialize();
        return expect(serialized).toEqual(models);
      });
      it("Should test specific fields for serialize method", function() {
        var serialized;
        serialized = collectionA.serialize(["foo"]);
        return expect(serialized).toEqual([
          {
            "foo": "bar"
          }, {
            "foo": "bar2"
          }, {
            "foo": "barA"
          }
        ]);
      });
      it("Should test specific fields for serialize method, just id", function() {
        var serialized;
        serialized = collectionA.serialize("id");
        return expect(serialized).toEqual([
          {
            id: 1
          }, {
            id: 2
          }, {
            id: 'a'
          }
        ]);
      });
      return it("Should test specific fields for serialize method, string value", function() {
        var serialized;
        serialized = collectionA.serialize("foo");
        return expect(serialized).toEqual([
          {
            "foo": "bar"
          }, {
            "foo": "bar2"
          }, {
            "foo": "barA"
          }
        ]);
      });
    });
    describe("Testing the makeUrl() method", function() {
      it("Tests the basic makeUrl method", function() {
        var collectionA;
        collectionA = new CollectionA();
        expect(collectionA.makeUrl("GET")).toBe("/model_a");
        expect(collectionA.makeUrl("POST")).toBe("/model_a");
        expect(collectionA.makeUrl("PUT")).toBe("/model_a");
        return expect(collectionA.makeUrl("DELETE")).toBe("/model_a");
      });
      it("Tests the basic makeUrl method, base API url", function() {
        var collectionA;
        collectionA = new CollectionA();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionA.makeUrl("GET")).toBe("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl("POST")).toBe("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl("PUT")).toBe("http://www.falconjs.com/model_a");
        return expect(collectionA.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_a");
      });
      it("Tests the basic makeUrl method, base API url ending with a '/'", function() {
        var collectionA;
        collectionA = new CollectionA();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionA.makeUrl("GET")).toBe("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl("POST")).toBe("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl("PUT")).toBe("http://www.falconjs.com/model_a");
        return expect(collectionA.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_a");
      });
      it("Tests the basic makeUrl method, with parent", function() {
        var collectionA;
        collectionA = new CollectionA(new ModelB({
          id: '1b'
        }));
        expect(collectionA.makeUrl("GET")).toBe("/model_b/1b/model_a");
        expect(collectionA.makeUrl("POST")).toBe("/model_b/1b/model_a");
        expect(collectionA.makeUrl("PUT")).toBe("/model_b/1b/model_a");
        return expect(collectionA.makeUrl("DELETE")).toBe("/model_b/1b/model_a");
      });
      it("Tests the basic makeUrl method, base API url, with parent", function() {
        var collectionA;
        collectionA = new CollectionA(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionA.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/2b/model_a");
        expect(collectionA.makeUrl("POST")).toBe("http://www.falconjs.com/model_b/2b/model_a");
        expect(collectionA.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/2b/model_a");
        return expect(collectionA.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/2b/model_a");
      });
      it("Tests the basic makeUrl method, base API url ending with a '/', with parent", function() {
        var collectionA;
        collectionA = new CollectionA(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionA.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/3b/model_a");
        expect(collectionA.makeUrl("POST")).toBe("http://www.falconjs.com/model_b/3b/model_a");
        expect(collectionA.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/3b/model_a");
        return expect(collectionA.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/3b/model_a");
      });
      it("Tests the basic makeUrl method, model url is a function", function() {
        var collectionD;
        collectionD = new CollectionD();
        expect(collectionD.makeUrl("GET")).toBe("/model_d");
        expect(collectionD.makeUrl("POST")).toBe("/model_d");
        expect(collectionD.makeUrl("PUT")).toBe("/model_d");
        return expect(collectionD.makeUrl("DELETE")).toBe("/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, base API url", function() {
        var collectionD;
        collectionD = new CollectionD();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD.makeUrl("GET")).toBe("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl("POST")).toBe("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl("PUT")).toBe("http://www.falconjs.com/model_d");
        return expect(collectionD.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, base API url ending with a '/'", function() {
        var collectionD;
        collectionD = new CollectionD();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD.makeUrl("GET")).toBe("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl("POST")).toBe("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl("PUT")).toBe("http://www.falconjs.com/model_d");
        return expect(collectionD.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, with parent", function() {
        var collectionD;
        collectionD = new CollectionD(new ModelB({
          id: '1b'
        }));
        expect(collectionD.makeUrl("GET")).toBe("/model_b/1b/model_d");
        expect(collectionD.makeUrl("POST")).toBe("/model_b/1b/model_d");
        expect(collectionD.makeUrl("PUT")).toBe("/model_b/1b/model_d");
        return expect(collectionD.makeUrl("DELETE")).toBe("/model_b/1b/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, with parent, base API url", function() {
        var collectionD;
        collectionD = new CollectionD(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/2b/model_d");
        expect(collectionD.makeUrl("POST")).toBe("http://www.falconjs.com/model_b/2b/model_d");
        expect(collectionD.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/2b/model_d");
        return expect(collectionD.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/2b/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, with parent, base API url ending with a '/'", function() {
        var collectionD;
        collectionD = new CollectionD(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/3b/model_d");
        expect(collectionD.makeUrl("POST")).toBe("http://www.falconjs.com/model_b/3b/model_d");
        expect(collectionD.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/3b/model_d");
        return expect(collectionD.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/3b/model_d");
      });
      it("Tests the basic makeUrl method, defined url string", function() {
        var collectionD2;
        collectionD2 = new CollectionD2();
        expect(collectionD2.makeUrl("GET")).toBe("/collection_d2");
        expect(collectionD2.makeUrl("POST")).toBe("/collection_d2");
        expect(collectionD2.makeUrl("PUT")).toBe("/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).toBe("/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, base API url", function() {
        var collectionD2;
        collectionD2 = new CollectionD2();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD2.makeUrl("GET")).toBe("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl("POST")).toBe("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl("PUT")).toBe("http://www.falconjs.com/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).toBe("http://www.falconjs.com/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, base API url ending with a '/'", function() {
        var collectionD2;
        collectionD2 = new CollectionD2();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD2.makeUrl("GET")).toBe("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl("POST")).toBe("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl("PUT")).toBe("http://www.falconjs.com/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).toBe("http://www.falconjs.com/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, with parent", function() {
        var collectionD2;
        collectionD2 = new CollectionD2(new ModelB({
          id: '1b'
        }));
        expect(collectionD2.makeUrl("GET")).toBe("/model_b/1b/collection_d2");
        expect(collectionD2.makeUrl("POST")).toBe("/model_b/1b/collection_d2");
        expect(collectionD2.makeUrl("PUT")).toBe("/model_b/1b/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).toBe("/model_b/1b/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, with parent, base API url", function() {
        var collectionD2;
        collectionD2 = new CollectionD2(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD2.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/2b/collection_d2");
        expect(collectionD2.makeUrl("POST")).toBe("http://www.falconjs.com/model_b/2b/collection_d2");
        expect(collectionD2.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/2b/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/2b/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, with parent, base API url ending with a '/'", function() {
        var collectionD2;
        collectionD2 = new CollectionD2(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD2.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/3b/collection_d2");
        expect(collectionD2.makeUrl("POST")).toBe("http://www.falconjs.com/model_b/3b/collection_d2");
        expect(collectionD2.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/3b/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/3b/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url function", function() {
        var collectionD3;
        collectionD3 = new CollectionD3();
        expect(collectionD3.makeUrl("GET")).toBe("/collection_d3");
        expect(collectionD3.makeUrl("POST")).toBe("/collection_d3");
        expect(collectionD3.makeUrl("PUT")).toBe("/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).toBe("/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, base API url", function() {
        var collectionD3;
        collectionD3 = new CollectionD3();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD3.makeUrl("GET")).toBe("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl("POST")).toBe("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl("PUT")).toBe("http://www.falconjs.com/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).toBe("http://www.falconjs.com/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, base API url ending with a '/'", function() {
        var collectionD3;
        collectionD3 = new CollectionD3();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD3.makeUrl("GET")).toBe("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl("POST")).toBe("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl("PUT")).toBe("http://www.falconjs.com/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).toBe("http://www.falconjs.com/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, with parent", function() {
        var collectionD3;
        collectionD3 = new CollectionD3(new ModelB({
          id: '1b'
        }));
        expect(collectionD3.makeUrl("GET")).toBe("/model_b/1b/collection_d3");
        expect(collectionD3.makeUrl("POST")).toBe("/model_b/1b/collection_d3");
        expect(collectionD3.makeUrl("PUT")).toBe("/model_b/1b/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).toBe("/model_b/1b/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, with parent, base API url", function() {
        var collectionD3;
        collectionD3 = new CollectionD3(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD3.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/2b/collection_d3");
        expect(collectionD3.makeUrl("POST")).toBe("http://www.falconjs.com/model_b/2b/collection_d3");
        expect(collectionD3.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/2b/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/2b/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, with parent, base API url ending with a '/'", function() {
        var collectionD3;
        collectionD3 = new CollectionD3(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD3.makeUrl("GET")).toBe("http://www.falconjs.com/model_b/3b/collection_d3");
        expect(collectionD3.makeUrl("POST")).toBe("http://www.falconjs.com/model_b/3b/collection_d3");
        expect(collectionD3.makeUrl("PUT")).toBe("http://www.falconjs.com/model_b/3b/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).toBe("http://www.falconjs.com/model_b/3b/collection_d3");
      });
      return it("Should be able to make a url with just a / baseApiUrl", function() {
        var MyCollection, MyModel, my_collection, _ref12, _ref13;
        MyModel = (function(_super) {
          __extends(MyModel, _super);

          function MyModel() {
            _ref12 = MyModel.__super__.constructor.apply(this, arguments);
            return _ref12;
          }

          MyModel.prototype.url = 'my_models';

          return MyModel;

        })(Falcon.Model);
        MyCollection = (function(_super) {
          __extends(MyCollection, _super);

          function MyCollection() {
            _ref13 = MyCollection.__super__.constructor.apply(this, arguments);
            return _ref13;
          }

          MyCollection.prototype.model = MyModel;

          return MyCollection;

        })(Falcon.Collection);
        Falcon.baseApiUrl = "/";
        my_collection = new MyCollection;
        return expect(my_collection.makeUrl("GET")).toBe("/my_models");
      });
    });
    describe("Tesing collection sync methods", function() {
      var collectionA;
      collectionA = null;
      beforeEach(function() {
        return collectionA = new CollectionA;
      });
      describe("Testing 'fetch' alias", function() {
        return it("Should pass the correct options into sync on fetch", function() {
          var sync_stub;
          sync_stub = sinon.stub(collectionA, 'sync');
          collectionA.fetch({
            'hello': 'world'
          });
          expect(sync_stub).toHaveBeenCalledOnce();
          expect(sync_stub).toHaveBeenCalledOn(collectionA);
          return expect(sync_stub).toHaveBeenCalledWith('GET', {
            'hello': 'world'
          });
        });
      });
      describe("Testing sync method $.ajax calls", function() {
        var ajax_stub;
        ajax_stub = null;
        beforeEach(function() {
          ajax_stub = sinon.stub(jQuery, "ajax");
          return Falcon.cache = false;
        });
        afterEach(function() {
          return ajax_stub.restore();
        });
        it("Should fetch properly without options", function() {
          collectionA.fetch();
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            type: "GET"
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            url: collectionA.makeUrl("GET")
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            data: ""
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            contentType: "application/json"
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            cache: false
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            headers: {}
          });
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          return expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
        });
        return it("Should fetch properly with options", function() {
          var _complete, _error, _success;
          Falcon.cache = true;
          collectionA.fetch({
            url: "http://www.falconjs.com",
            data: {
              "hello": "world"
            },
            contentType: "text/html",
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            },
            success: (_success = function() {}),
            error: (_error = function() {}),
            complete: (_complete = function() {})
          });
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            type: "GET"
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            url: "http://www.falconjs.com"
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            data: JSON.stringify({
              "hello": "world"
            })
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            contentType: "text/html"
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            cache: true
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            }
          });
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].success).not.toBe(_success);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].error).not.toBe(_error);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
          return expect(ajax_stub.firstCall.args[0].complete).not.toBe(_complete);
        });
      });
      describe("Testing sync method XHR responses", function() {
        var complete_spy, create_spy, data, destroy_spy, error_data, error_spy, fetch_spy, fill_stub, options, parse_stub, save_spy, server, success_data, success_spy;
        server = null;
        collectionA = null;
        parse_stub = null;
        fill_stub = null;
        fetch_spy = null;
        create_spy = null;
        save_spy = null;
        destroy_spy = null;
        success_spy = null;
        error_spy = null;
        complete_spy = null;
        data = null;
        error_data = null;
        success_data = null;
        options = null;
        beforeEach(function() {
          server = sinon.fakeServer.create();
          collectionA = new CollectionA;
          data = {
            'list': [
              {
                "foo": "bar",
                id: 1
              }, {
                "foo": "bar2",
                id: 2
              }
            ]
          };
          error_data = {
            "error": "Something Wrong"
          };
          success_data = [
            {
              "foo": "bar",
              id: 1
            }, {
              "foo": "bar2",
              id: 2
            }
          ];
          parse_stub = sinon.stub(collectionA, "parse").returns(success_data);
          fill_stub = sinon.stub(collectionA, "fill");
          collectionA.on("fetch", (fetch_spy = sinon.spy()));
          return options = {
            success: (success_spy = sinon.spy()),
            error: (error_spy = sinon.spy()),
            complete: (complete_spy = sinon.spy())
          };
        });
        afterEach(function() {
          return server.restore();
        });
        it("Should call the proper success method", function() {
          collectionA.fetch(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).toBe(1);
          expect(parse_stub.firstCall.args[0]).toEqual(data);
          expect(fill_stub.callCount).toBe(1);
          expect(fill_stub.firstCall.args[0]).toEqual(success_data);
          expect(fill_stub).toHaveBeenCalledAfter(parse_stub);
          expect(fetch_spy).toHaveBeenCalledOnce();
          expect(fetch_spy).toHaveBeenCalledAfter(fill_stub);
          expect(success_spy.callCount).toBe(1);
          expect(success_spy).toHaveBeenCalledOn(collectionA);
          expect(success_spy.firstCall.args.length).toBe(4);
          expect(success_spy.firstCall.args[0]).toBe(collectionA);
          expect(error_spy).not.toHaveBeenCalled();
          expect(complete_spy.callCount).toBe(1);
          expect(complete_spy).toHaveBeenCalledOn(collectionA);
          expect(complete_spy.firstCall.args.length).toBe(3);
          expect(complete_spy.firstCall.args[0]).toBe(collectionA);
          return expect(complete_spy).toHaveBeenCalledAfter(success_spy);
        });
        it("Should not fill when fill option is false on fetch", function() {
          options.fill = false;
          collectionA.fetch(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).toBe(1);
          expect(parse_stub.firstCall.args[0]).toEqual(data);
          expect(fill_stub.callCount).toBe(0);
          expect(fetch_spy).toHaveBeenCalledOnce();
          expect(fetch_spy).toHaveBeenCalledAfter(parse_stub);
          expect(success_spy.callCount).toBe(1);
          expect(success_spy).toHaveBeenCalledOn(collectionA);
          expect(success_spy.firstCall.args.length).toBe(4);
          expect(success_spy.firstCall.args[0]).toBe(collectionA);
          expect(error_spy).not.toHaveBeenCalled();
          expect(complete_spy.callCount).toBe(1);
          expect(complete_spy).toHaveBeenCalledOn(collectionA);
          expect(complete_spy.firstCall.args.length).toBe(3);
          expect(complete_spy.firstCall.args[0]).toBe(collectionA);
          return expect(complete_spy).toHaveBeenCalledAfter(success_spy);
        });
        return it("Should call the error response on an errornous result", function() {
          collectionA.fetch(options);
          server.respondWith([400, {}, JSON.stringify(error_data)]);
          server.respond();
          expect(parse_stub.callCount).toBe(0);
          expect(fill_stub.callCount).toBe(0);
          expect(fetch_spy).not.toHaveBeenCalled();
          expect(success_spy.callCount).toBe(0);
          expect(error_spy.callCount).toBe(1);
          expect(error_spy.firstCall.args.length).toBe(3);
          expect(error_spy).toHaveBeenCalledOn(collectionA);
          expect(complete_spy.firstCall.args[0]).toBe(collectionA);
          expect(complete_spy.callCount).toBe(1);
          expect(complete_spy).toHaveBeenCalledOn(collectionA);
          expect(complete_spy.firstCall.args.length).toBe(3);
          expect(complete_spy.firstCall.args[0]).toBe(collectionA);
          return expect(complete_spy).toHaveBeenCalledAfter(error_spy);
        });
      });
      describe("Testing sync method options in depth", function() {
        var ajax_stub;
        ajax_stub = null;
        beforeEach(function() {
          ajax_stub = sinon.stub(jQuery, "ajax");
          return Falcon.cache = false;
        });
        afterEach(function() {
          return ajax_stub.restore();
        });
        it("Should fetch properly without options", function() {
          collectionA.sync('GET');
          expect(ajax_stub).toHaveBeenCalledOnce();
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            type: "GET"
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            url: collectionA.makeUrl("GET")
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            data: ""
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            contentType: "application/json"
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            cache: false
          });
          expect(ajax_stub).toHaveBeenCalledWithMatch({
            headers: {}
          });
          expect(ajax_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].success.length).toBe(3);
          expect(ajax_stub.firstCall.args[0].error).toEqual(jasmine.any(Function));
          expect(ajax_stub.firstCall.args[0].error.length).toBe(1);
          expect(ajax_stub.firstCall.args[0].complete).toEqual(jasmine.any(Function));
          return expect(ajax_stub.firstCall.args[0].complete.length).toBe(2);
        });
        it("Should allow for a specified parent to override", function() {
          var model_b;
          collectionA.parent = new ModelB({
            id: 'b'
          });
          collectionA.sync('GET', {
            parent: (model_b = new ModelB({
              id: 'b2'
            }))
          });
          return expect(ajax_stub).toHaveBeenCalledWithMatch({
            url: collectionA.makeUrl("GET", model_b)
          });
        });
        return it("Should allow for a specified parent to override", function() {
          collectionA.parent = new ModelB({
            id: 'b'
          });
          collectionA.sync('GET', {
            parent: null
          });
          return expect(ajax_stub).toHaveBeenCalledWithMatch({
            url: collectionA.makeUrl("GET", null)
          });
        });
      });
      return describe("Additional miscellaneous sync tests", function() {
        var server;
        server = null;
        beforeEach(function() {
          server = sinon.fakeServer.create();
          return Falcon.cache = false;
        });
        afterEach(function() {
          return server.restore();
        });
        it("Should allow for a third parameter to define the context", function() {
          var collectionB, success_spy;
          collectionB = new CollectionB;
          collectionA = new CollectionA;
          collectionA.sync("GET", (success_spy = sinon.spy()), collectionB);
          server.respondWith([200, {}, JSON.stringify(collectionA.serialize())]);
          server.respond();
          expect(success_spy).toHaveBeenCalled;
          return expect(success_spy).toHaveBeenCalledOn(collectionB);
        });
        return it("Should pass context from fetch to sync", function() {
          var collectionB, success_spy, sync_stub;
          collectionB = new CollectionB;
          collectionA = new CollectionA;
          sync_stub = sinon.stub(collectionA, "sync");
          collectionA.fetch((success_spy = sinon.spy()), collectionB);
          expect(sync_stub).toHaveBeenCalled;
          expect(sync_stub.firstCall.args[1]).toBe(success_spy);
          return expect(sync_stub.firstCall.args[2]).toBe(collectionB);
        });
      });
    });
    describe("Testing the remove method", function() {
      var collectionA, model_a1, model_a2, model_a3, model_a4, models;
      collectionA = null;
      models = null;
      model_a1 = null;
      model_a2 = null;
      model_a3 = null;
      model_a4 = null;
      beforeEach(function() {
        models = [
          model_a1 = new ModelA({
            id: 1
          }), model_a2 = new ModelA({
            id: 2
          }), model_a3 = new ModelA({
            id: 3
          }), model_a4 = new ModelA({
            id: 4
          })
        ];
        return collectionA = new CollectionA(models);
      });
      it("Should be able to remove a single item", function() {
        expect(collectionA.length()).toBe(4);
        collectionA.remove(model_a2);
        expect(collectionA.length()).toBe(3);
        expect(collectionA.at(0)).toBe(model_a1);
        expect(collectionA.at(1)).toBe(model_a3);
        return expect(collectionA.at(2)).toBe(model_a4);
      });
      it("Should be able to remove multiple items", function() {
        expect(collectionA.length()).toBe(4);
        collectionA.remove([model_a2, model_a3]);
        expect(collectionA.length()).toBe(2);
        expect(collectionA.at(0)).toBe(model_a1);
        return expect(collectionA.at(1)).toBe(model_a4);
      });
      it("Should be able to remove items with a function", function() {
        expect(collectionA.length()).toBe(4);
        collectionA.remove(function(model) {
          return model.get('id') % 2 === 0;
        });
        expect(collectionA.length()).toBe(2);
        expect(collectionA.at(0)).toBe(model_a1);
        return expect(collectionA.at(1)).toBe(model_a3);
      });
      it("Should be able to remove a different model but with the same id", function() {
        expect(collectionA.length()).toBe(4);
        collectionA.remove(new ModelA({
          id: 3
        }));
        expect(collectionA.at(0)).toBe(model_a1);
        expect(collectionA.at(1)).toBe(model_a2);
        return expect(collectionA.at(2)).toBe(model_a4);
      });
      return it("Should be able to remove models who don't have an id, properly", function() {
        collectionA = new CollectionA();
        collectionA.append([
          {
            'text': '1'
          }, {
            'text': '2'
          }, {
            'text': '3'
          }
        ]);
        expect(collectionA.length()).toBe(3);
        model_a1 = collectionA.first();
        collectionA.remove(model_a1);
        return expect(collectionA.length()).toBe(2);
      });
    });
    describe("Test the append and prepend methods", function() {
      var collectionA, fill_stub;
      collectionA = null;
      fill_stub = null;
      beforeEach(function() {
        collectionA = new CollectionA;
        return fill_stub = sinon.stub(collectionA, "fill");
      });
      afterEach(function() {
        return fill_stub.restore();
      });
      it("Should call the proper fill method when appending", function() {
        var input;
        collectionA.append(input = {
          'hello': 'world'
        });
        expect(fill_stub).toHaveBeenCalledOnce();
        return expect(fill_stub).toHaveBeenCalledWith(input, jasmine.objectContaining({
          'method': 'append'
        }));
      });
      return it("Should call the proper fill method when prepending", function() {
        var input;
        collectionA.prepend(input = {
          'hello': 'world'
        });
        expect(fill_stub).toHaveBeenCalledOnce();
        return expect(fill_stub).toHaveBeenCalledWith(input, jasmine.objectContaining({
          'method': 'prepend'
        }));
      });
    });
    describe("Test the insert method", function() {
      var collectionA, fill_stub;
      collectionA = null;
      fill_stub = null;
      beforeEach(function() {
        collectionA = new CollectionA([
          {
            id: 1,
            'hello': 'foo'
          }, {
            id: 4,
            'hello': 'bar'
          }
        ]);
        return fill_stub = sinon.stub(collectionA, "fill");
      });
      it("Should call the proper fill method when inserting without a specific model", function() {
        var input;
        collectionA.insert(input = {
          'hello': 'world'
        });
        expect(fill_stub).toHaveBeenCalledOnce();
        return expect(fill_stub).toHaveBeenCalledWith(input, jasmine.objectContaining({
          'method': 'append'
        }));
      });
      it("Should call the proper fill method when inserting with a valid model", function() {
        var input;
        collectionA.insert(input = {
          'hello': 'world'
        }, 4);
        expect(fill_stub).toHaveBeenCalledOnce();
        return expect(fill_stub).toHaveBeenCalledWith(input, jasmine.objectContaining({
          'method': 'insert',
          'insert_index': 1
        }));
      });
      it("Should call the proper fill method when appending with an invalid model", function() {
        var input;
        collectionA.insert(input = {
          'hello': 'world'
        }, 33);
        expect(fill_stub).toHaveBeenCalledOnce();
        return expect(fill_stub).toHaveBeenCalledWith(input, jasmine.objectContaining({
          'method': 'insert',
          'insert_index': -1
        }));
      });
      return it("Should call the proper fill method when inserting with an iterator", function() {
        var input;
        collectionA.insert(input = {
          'hello': 'world'
        }, (function(m) {
          return m.get('id') === 1;
        }));
        expect(fill_stub).toHaveBeenCalledOnce();
        return expect(fill_stub).toHaveBeenCalledWith(input, jasmine.objectContaining({
          'method': 'insert',
          'insert_index': 0
        }));
      });
    });
    describe("Test the unshift and push methods", function() {
      var append_stub, collectionA, prepend_stub;
      collectionA = null;
      prepend_stub = append_stub = null;
      beforeEach(function() {
        collectionA = new CollectionA([
          {
            id: 1
          }, {
            id: 2
          }
        ]);
        append_stub = sinon.stub(collectionA, 'append');
        return prepend_stub = sinon.stub(collectionA, 'prepend');
      });
      afterEach(function() {
        append_stub.restore();
        return prepend_stub.restore();
      });
      it("Should have unshift be an alias of prepend", function() {
        expect(collectionA.length()).toBe(2);
        collectionA.unshift({
          id: 3
        });
        expect(append_stub).not.toHaveBeenCalled();
        expect(prepend_stub).toHaveBeenCalledOnce();
        return expect(prepend_stub).toHaveBeenCalledWith(jasmine.objectContaining({
          id: 3
        }));
      });
      return it("Should have push be an alias of append", function() {
        expect(collectionA.length()).toBe(2);
        collectionA.push({
          id: 3
        });
        expect(prepend_stub).not.toHaveBeenCalled();
        expect(append_stub).toHaveBeenCalledOnce();
        return expect(append_stub).toHaveBeenCalledWith(jasmine.objectContaining({
          id: 3
        }));
      });
    });
    describe("Test the shift and pop methods", function() {
      var collectionA, model_a1, model_a2, model_a3;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1
        });
        model_a2 = new ModelA({
          id: 2
        });
        model_a3 = new ModelA({
          id: 3
        });
        return collectionA = new CollectionA([model_a1, model_a2, model_a3]);
      });
      it("Should shift the first element off the front", function() {
        var elm;
        elm = collectionA.shift();
        expect(elm).toBe(model_a1);
        return expect(collectionA.length()).toBe(2);
      });
      return it("Should shift the first element off the front", function() {
        var elm;
        elm = collectionA.pop();
        expect(elm).toBe(model_a3);
        return expect(collectionA.length()).toBe(2);
      });
    });
    describe("Test the sort method", function() {
      var collectionA, model_a1, model_a2, model_a3;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = null;
      return it("Should sort properly", function() {
        model_a1 = new ModelA({
          id: 1
        });
        model_a2 = new ModelA({
          id: 2
        });
        model_a3 = new ModelA({
          id: 3
        });
        collectionA = new CollectionA([model_a2, model_a1, model_a3]);
        expect(collectionA.models()).toEqual([model_a2, model_a1, model_a3]);
        collectionA.sort(function(a, b) {
          var a_id, b_id;
          a_id = a.get("id");
          b_id = b.get("id");
          if (a_id > b_id) {
            return 1;
          }
          if (a_id < b_id) {
            return -1;
          }
          return 0;
        });
        return expect(collectionA.models()).toEqual([model_a1, model_a2, model_a3]);
      });
    });
    describe("Test the create method", function() {
      var collectionA, data, modelA, modelB, options, server, success_spy;
      collectionA = null;
      modelB = null;
      modelA = null;
      options = null;
      server = null;
      data = null;
      success_spy = null;
      beforeEach(function() {
        server = sinon.fakeServer.create();
        data = {
          id: 2
        };
        modelB = new ModelB({
          id: 'b'
        });
        collectionA = new CollectionA([
          {
            id: 1
          }
        ], modelB);
        modelA = new ModelA(data, collectionA.parent);
        return options = {
          success: (success_spy = sinon.spy())
        };
      });
      afterEach(function() {
        return server.restore();
      });
      it("Should attempt to initialize and create a new model", function() {
        var collectionB, create_stub, initialize_stub;
        collectionB = new CollectionB;
        initialize_stub = sinon.stub(ModelA.prototype, "initialize");
        create_stub = sinon.stub(ModelA.prototype, "create");
        expect(initialize_stub).not.toHaveBeenCalled();
        expect(create_stub).not.toHaveBeenCalled();
        collectionA.create(data = {
          id: 2
        }, options, collectionB);
        expect(initialize_stub).toHaveBeenCalledOnce();
        expect(initialize_stub).toHaveBeenCalledWith(data);
        expect(create_stub).toHaveBeenCalledOnce();
        expect(create_stub).toHaveBeenCalledAfter(initialize_stub);
        expect(create_stub.firstCall.args.length).toBe(2);
        expect(create_stub.firstCall.args[0]).toBe(options);
        expect(create_stub.firstCall.args[0].success).toEqual(jasmine.any(Function));
        expect(create_stub.firstCall.args[0].method).toBe('append');
        expect(create_stub.firstCall.args[1]).toBe(collectionB);
        initialize_stub.restore();
        return create_stub.restore();
      });
      return it("Should respond correctly from the server", function() {
        var fill_stub, new_model;
        fill_stub = sinon.stub(collectionA, "fill").returns([]);
        collectionA.create(data, options);
        expect(collectionA.length()).toBe(1);
        server.respondWith([200, {}, JSON.stringify(data)]);
        server.respond();
        expect(fill_stub).toHaveBeenCalledOnce();
        expect(fill_stub.firstCall.args.length).toBe(2);
        expect(fill_stub.firstCall.args[0]).toEqual(jasmine.any(Falcon.Model));
        expect(fill_stub.firstCall.args[1]).toBe(options);
        new_model = fill_stub.firstCall.args[0];
        expect(success_spy.callCount).toBe(1);
        expect(success_spy).toHaveBeenCalledAfter(fill_stub);
        expect(success_spy).toHaveBeenCalledOn(new_model);
        expect(success_spy.firstCall.args[0]).toBe(new_model);
        return fill_stub.restore();
      });
    });
    describe("Test the detroy method", function() {
      var collectionA, collectionB, model_a1, model_a2, options, success_spy;
      collectionA = collectionB = null;
      model_a1 = model_a2 = null;
      options = null;
      success_spy = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1
        });
        model_a2 = new ModelA({
          id: 2
        });
        collectionA = new CollectionA([model_a1, model_a2]);
        collectionB = new CollectionB;
        return options = {
          success: (success_spy = sinon.spy())
        };
      });
      it("Should call the destroy method on the model", function() {
        var destroy_stub;
        destroy_stub = sinon.stub(model_a1, "destroy");
        expect(destroy_stub).not.toHaveBeenCalled();
        collectionA.destroy(model_a1, options, collectionB);
        expect(destroy_stub).toHaveBeenCalledOnce();
        expect(destroy_stub).toHaveBeenCalledWith(options, collectionB);
        return destroy_stub.restore();
      });
      it("Should respond correctly from the server", function() {
        var remove_stub, removed_model, server;
        server = sinon.fakeServer.create();
        remove_stub = sinon.stub(collectionA, "remove");
        collectionA.destroy(model_a1, options);
        server.respondWith([200, {}, JSON.stringify({})]);
        server.respond();
        expect(remove_stub).toHaveBeenCalledOnce();
        expect(remove_stub.firstCall.args.length).toBe(1);
        expect(remove_stub.firstCall.args[0]).toEqual(jasmine.any(Falcon.Model));
        removed_model = remove_stub.firstCall.args[0];
        expect(success_spy.callCount).toBe(1);
        expect(success_spy).toHaveBeenCalledAfter(remove_stub);
        expect(success_spy).toHaveBeenCalledOn(removed_model);
        expect(success_spy.firstCall.args[0]).toBe(removed_model);
        remove_stub.restore();
        return server.restore();
      });
      return it("Should destroy using the overriden parent", function() {
        var ajax_args, ajax_spy, collectionA2, model_b, server;
        model_b = new ModelB({
          id: 'b'
        });
        collectionA2 = new CollectionA([model_a1, model_a2], model_b);
        server = sinon.fakeServer.create();
        ajax_spy = sinon.spy($, "ajax");
        collectionA2.destroy(model_a1, {
          parent: null
        });
        server.respondWith([200, {}, JSON.stringify({})]);
        server.respond();
        ajax_spy.restore();
        server.restore();
        expect(ajax_spy).toHaveBeenCalled;
        expect(ajax_spy.callCount).toBe(1);
        ajax_args = ajax_spy.firstCall.args[0];
        expect(ajax_args['type']).toBe("DELETE");
        return expect(ajax_args['url']).toBe(model_a1.makeUrl("DELETE", null));
      });
    });
    describe("Test the at() method", function() {
      var collectionA, model_a1, model_a2, model_a3;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1
        });
        model_a2 = new ModelA({
          id: 2
        });
        model_a3 = new ModelA({
          id: 3
        });
        return collectionA = new CollectionA([model_a1, model_a2, model_a3]);
      });
      it("Should be able to find the correct element at an index", function() {
        expect(collectionA.at(0)).toBe(model_a1);
        expect(collectionA.at(1)).toBe(model_a2);
        return expect(collectionA.at(2)).toBe(model_a3);
      });
      return it("Should return null for invalid indices", function() {
        expect(collectionA.at(-1)).toBe(null);
        expect(collectionA.at(3)).toBe(null);
        return expect(collectionA.at("HELLO")).toBe(null);
      });
    });
    describe("Test the indexOf() method", function() {
      var collectionA, model_a1, model_a2, model_a3, model_a4;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = model_a4 = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1
        });
        model_a2 = new ModelA({
          id: 3
        });
        model_a3 = new ModelA({
          id: 5
        });
        model_a4 = new ModelA({
          id: 8
        });
        return collectionA = new CollectionA([model_a1, model_a2, model_a3, model_a4, model_a3]);
      });
      it("Should find the correct index by model", function() {
        return expect(collectionA.indexOf(model_a3)).toBe(2);
      });
      it("Should find no match index by model", function() {
        return expect(collectionA.indexOf(new ModelA)).toBe(-1);
      });
      it("Should find the correct match index by id", function() {
        return expect(collectionA.indexOf(3)).toBe(1);
      });
      it("Should find the correct match index by truth test method", function() {
        var index;
        index = collectionA.indexOf(function(model) {
          return model.get('id') > 4;
        });
        return expect(index).toBe(2);
      });
      return it("Should find the no match index by truth test method", function() {
        var index;
        index = collectionA.indexOf(function(model) {
          return model.get('id') > 8;
        });
        return expect(index).toBe(-1);
      });
    });
    describe("Test the lastIndexOf() method", function() {
      var collectionA, model_a1, model_a2, model_a3, model_a4;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = model_a4 = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1
        });
        model_a2 = new ModelA({
          id: 3
        });
        model_a3 = new ModelA({
          id: 5
        });
        model_a4 = new ModelA({
          id: 8
        });
        return collectionA = new CollectionA([model_a1, model_a2, model_a3, model_a4, model_a2, model_a3]);
      });
      it("Should find the correct index by model", function() {
        return expect(collectionA.lastIndexOf(model_a3)).toBe(5);
      });
      it("Should find no match index by model", function() {
        return expect(collectionA.lastIndexOf(new ModelA)).toBe(-1);
      });
      it("Should find the correct match index by id", function() {
        return expect(collectionA.lastIndexOf(3)).toBe(4);
      });
      it("Should find the correct match index by truth test method", function() {
        var index;
        index = collectionA.lastIndexOf(function(model) {
          return model.get('id') > 4;
        });
        return expect(index).toBe(5);
      });
      return it("Should find the no match index by truth test method", function() {
        var index;
        index = collectionA.lastIndexOf(function(model) {
          return model.get('id') > 8;
        });
        return expect(index).toBe(-1);
      });
    });
    describe("Test the each() method", function() {
      var collectionA, model_a1, model_a2, model_a3;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1
        });
        model_a2 = new ModelA({
          id: 2
        });
        model_a3 = new ModelA({
          id: 3
        });
        collectionA = new CollectionA();
        return collectionA.fill([model_a1, model_a2, model_a3]);
      });
      it("Should call the iterator with one argument", function() {
        var spy;
        spy = sinon.spy();
        collectionA.each(function(item) {
          return spy.call(this, item);
        });
        expect(spy.callCount).toBe(3);
        expect(spy.firstCall).toHaveBeenCalledWith(model_a1);
        expect(spy.secondCall).toHaveBeenCalledWith(model_a2);
        expect(spy.thirdCall).toHaveBeenCalledWith(model_a3);
        return expect(spy).toHaveBeenAlwaysCalledOn(collectionA);
      });
      it("Should call the iterator with two arguments", function() {
        var spy;
        spy = sinon.spy();
        collectionA.each(function(index, item) {
          return spy.call(this, index, item);
        });
        expect(spy.callCount).toBe(3);
        expect(spy.firstCall).toHaveBeenCalledWith(0, model_a1);
        expect(spy.secondCall).toHaveBeenCalledWith(1, model_a2);
        expect(spy.thirdCall).toHaveBeenCalledWith(2, model_a3);
        return expect(spy).toHaveBeenAlwaysCalledOn(collectionA);
      });
      it("Should call the iterator with a specific context and one argument", function() {
        var context, iterator, spy;
        spy = sinon.spy();
        context = {};
        iterator = function(item) {
          return spy.call(this, item);
        };
        collectionA.each(iterator, context);
        expect(spy.callCount).toBe(3);
        expect(spy.firstCall).toHaveBeenCalledWith(model_a1);
        expect(spy.secondCall).toHaveBeenCalledWith(model_a2);
        expect(spy.thirdCall).toHaveBeenCalledWith(model_a3);
        return expect(spy).toHaveBeenAlwaysCalledOn(context);
      });
      return it("Should call the iterator with a specific context and two arguments", function() {
        var context, iterator, spy;
        spy = sinon.spy();
        context = {};
        iterator = function(index, item) {
          return spy.call(this, index, item);
        };
        collectionA.each(iterator, context);
        expect(spy.callCount).toBe(3);
        expect(spy.firstCall).toHaveBeenCalledWith(0, model_a1);
        expect(spy.secondCall).toHaveBeenCalledWith(1, model_a2);
        expect(spy.thirdCall).toHaveBeenCalledWith(2, model_a3);
        return expect(spy).toHaveBeenAlwaysCalledOn(context);
      });
    });
    describe("Test the first() method", function() {
      var collectionA, model_a1, model_a2, model_a3, model_ab;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = model_ab = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1
        });
        model_a2 = new ModelA({
          id: 2
        });
        model_ab = new ModelA({
          id: 'b'
        });
        model_a3 = new ModelA({
          id: 3
        });
        return collectionA = new CollectionA([model_a1, model_a2, model_ab, model_a3]);
      });
      it("Should get the first element", function() {
        var first;
        first = collectionA.first();
        return expect(first).toBe(model_a1);
      });
      it("Should get the first matcing mdel based on function iterator", function() {
        var first;
        first = collectionA.first(function(model) {
          return model === model_a2;
        });
        return expect(first).toBe(model_a2);
      });
      it("Should get the first matching model based on a model", function() {
        var first;
        first = collectionA.first(model_ab);
        return expect(first).toBe(model_ab);
      });
      it("Should get the first matching model based on an id", function() {
        var first;
        first = collectionA.first(2);
        expect(first).toBe(model_a2);
        first = collectionA.first('b');
        return expect(first).toBe(model_ab);
      });
      return it("Should return the null if nothing passes the iterator", function() {
        var first;
        first = collectionA.first(function(model) {
          return false;
        });
        return expect(first).toBe(null);
      });
    });
    describe("Test the last() method", function() {
      var collectionA, model_a1, model_a2, model_a3, model_ab;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = model_ab = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1
        });
        model_a2 = new ModelA({
          id: 2
        });
        model_ab = new ModelA({
          id: 'b'
        });
        model_a3 = new ModelA({
          id: 3
        });
        return collectionA = new CollectionA([model_a1, model_a2, model_ab, model_a3]);
      });
      it("Should get the last element", function() {
        var last;
        last = collectionA.last();
        return expect(last).toBe(model_a3);
      });
      it("Should get the last matcing mdel based on function iterator", function() {
        var last;
        last = collectionA.last(function(model) {
          return model === model_a2;
        });
        return expect(last).toBe(model_a2);
      });
      it("Should get the last matching model based on a model", function() {
        var last;
        last = collectionA.last(model_ab);
        return expect(last).toBe(model_ab);
      });
      it("Should get the last matching model based on an id", function() {
        var last;
        last = collectionA.last(2);
        expect(last).toBe(model_a2);
        last = collectionA.last('b');
        return expect(last).toBe(model_ab);
      });
      return it("Should return the null if nothing passes the iterator", function() {
        var last;
        last = collectionA.last(function(model) {
          return false;
        });
        return expect(last).toBe(null);
      });
    });
    describe("Test the filter() method", function() {
      var collectionA, model_a1, model_a2, model_a3, model_ab, model_ab2, models;
      model_a1 = new ModelA({
        id: 1
      });
      model_a2 = new ModelA({
        id: 2
      });
      model_ab = new ModelA({
        id: 'b'
      });
      model_ab2 = new ModelA({
        id: 'b'
      });
      model_a3 = new ModelA({
        id: 3
      });
      models = [model_a1, model_a2, model_ab, model_ab, model_ab2, model_a3];
      collectionA = new CollectionA(models);
      it("Should return the all of the models", function() {
        var all;
        all = collectionA.filter();
        expect(all.length).toBe(6);
        return expect(all).toEqual(models);
      });
      it("Should return a limited set of models by function", function() {
        var all;
        all = collectionA.filter(function(model) {
          return model === model_a1 || model === model_ab;
        });
        expect(all.length).toBe(3);
        return expect(all).toEqual([model_a1, model_ab, model_ab]);
      });
      it("Should return a limited set of models by model", function() {
        var all;
        all = collectionA.filter(model_a2);
        expect(all.length).toBe(1);
        return expect(all).toEqual([model_a2]);
      });
      it("Should return a limited set of models by id", function() {
        var all;
        all = collectionA.filter(3);
        expect(all.length).toBe(1);
        expect(all).toEqual([model_a3]);
        all = collectionA.filter('b');
        expect(all.length).toBe(3);
        return expect(all).toEqual([model_ab, model_ab, model_ab2]);
      });
      return it("Should return an empty set of models", function() {
        var all;
        all = collectionA.filter(function(model) {
          return false;
        });
        expect(all.length).toBe(0);
        return expect(all).toEqual([]);
      });
    });
    describe("Test the all() method", function() {
      var collectionA, model_a1, model_a2, models;
      model_a1 = new ModelA({
        id: 1
      });
      model_a2 = new ModelA({
        id: 2
      });
      models = [model_a1, model_a2];
      collectionA = new CollectionA(models);
      return it("Should return all of the models", function() {
        var all;
        all = collectionA.all();
        expect(all.length).toBe(2);
        return expect(all).toEqual(models);
      });
    });
    describe("Test the any() method", function() {
      var collectionA, model_a1, model_a2, model_a3, model_a4, model_ab, model_ab2, models;
      model_a1 = new ModelA({
        id: 1
      });
      model_a2 = new ModelA({
        id: 2
      });
      model_ab = new ModelA({
        id: 'b'
      });
      model_ab2 = new ModelA({
        id: 'b'
      });
      model_a3 = new ModelA({
        id: 3
      });
      model_a4 = new ModelA({
        id: 4
      });
      models = [model_a1, model_a2, model_ab, model_ab, model_ab2, model_a3];
      collectionA = new CollectionA(models);
      it("Should match true based on function", function() {
        var any;
        any = collectionA.any(function(model) {
          return model === model_a1 || model === model_ab;
        });
        expect(any).toBe(true);
        any = collectionA.any(function(model) {
          return model === model_a4;
        });
        return expect(any).toBe(false);
      });
      it("Should match true based on model", function() {
        var any;
        any = collectionA.any(model_a2);
        expect(any).toBe(true);
        any = collectionA.any(model_a4);
        return expect(any).toBe(false);
      });
      it("Should match correctly based on id", function() {
        var any;
        any = collectionA.any(3);
        expect(any).toBe(true);
        any = collectionA.any('b');
        expect(any).toBe(true);
        any = collectionA.any(4);
        expect(any).toBe(false);
        any = collectionA.any('c');
        return expect(any).toBe(false);
      });
      return it("Should not match true based on empty iterator", function() {
        var any;
        any = collectionA.any();
        return expect(any).toBe(false);
      });
    });
    describe("Test the without() method", function() {
      var collectionA, model_a1, model_a2, model_a3, model_ab, model_ab2, models;
      model_a1 = new ModelA({
        id: 1
      });
      model_a2 = new ModelA({
        id: 2
      });
      model_ab = new ModelA({
        id: 'b'
      });
      model_ab2 = new ModelA({
        id: 'b'
      });
      model_a3 = new ModelA({
        id: 3
      });
      models = [model_a1, model_a2, model_ab, model_ab, model_ab2, model_a3];
      collectionA = new CollectionA(models);
      it("Should return the full set of the models when called without an iterator", function() {
        var without;
        without = collectionA.without();
        expect(without.length).toBe(6);
        return expect(without).toEqual(models);
      });
      it("Should return a limited set of models by function", function() {
        var without;
        without = collectionA.without(function(model) {
          return model === model_a1 || model === model_ab;
        });
        expect(without.length).toBe(3);
        return expect(without).toEqual([model_a2, model_ab2, model_a3]);
      });
      it("Should return a limited set of models by model", function() {
        var without;
        without = collectionA.without(model_a2);
        expect(without.length).toBe(5);
        return expect(without).toEqual([model_a1, model_ab, model_ab, model_ab2, model_a3]);
      });
      return it("Should return a limited set of models by id", function() {
        var without;
        without = collectionA.without(3);
        expect(without.length).toBe(5);
        expect(without).toEqual([model_a1, model_a2, model_ab, model_ab, model_ab2]);
        without = collectionA.without('b');
        expect(without.length).toBe(3);
        return expect(without).toEqual([model_a1, model_a2, model_a3]);
      });
    });
    describe("Test the without() method", function() {
      var collectionE, model_e1, model_e2, model_e3, models;
      model_e1 = new ModelE({
        'title': 'e1'
      });
      model_e2 = new ModelE({
        'title': 'e2'
      });
      model_e3 = new ModelE({
        'title': 'e3'
      });
      models = [model_e1, model_e2, model_e3];
      collectionE = new CollectionE(models);
      it("Should pluck the title and unwrap the observables", function() {
        var pluck;
        pluck = collectionE.pluck("title");
        expect(pluck.length).toBe(3);
        return expect(pluck).toEqual(['e1', 'e2', 'e3']);
      });
      it("Should pluck the title and shouldn't unwrap the observables", function() {
        var pluck;
        pluck = collectionE.pluck("title", false);
        expect(pluck.length).toBe(3);
        return expect(pluck).not.toEqual(['e1', 'e2', 'e3']);
      });
      return it("Should pluck the an invalid attribute", function() {
        var pluck;
        pluck = collectionE.pluck("title2");
        expect(pluck.length).toBe(3);
        return expect(pluck).toEqual([void 0, void 0, void 0]);
      });
    });
    describe("Test the slice() method", function() {
      var collectionE, model_e1, model_e2, model_e3, models;
      model_e1 = new ModelE({
        'title': 'e1'
      });
      model_e2 = new ModelE({
        'title': 'e2'
      });
      model_e3 = new ModelE({
        'title': 'e3'
      });
      models = [model_e1, model_e2, model_e3];
      collectionE = new CollectionE(models);
      return it("Should slice properly", function() {
        expect(collectionE.slice(0, 3)).toEqual(models);
        expect(collectionE.slice(0, 1)).toEqual([model_e1]);
        expect(collectionE.slice(1, 3)).toEqual([model_e2, model_e3]);
        return expect(collectionE.slice(-1)).toEqual([model_e3]);
      });
    });
    describe("Testing the mixin() method", function() {
      it("Should implement mixins properly", function() {
        var collectionA, mixin_spy, modelA, modelB;
        modelB = new ModelB;
        modelA = new ModelA;
        modelA.bees = new CollectionB([modelB]);
        collectionA = new CollectionA([modelA]);
        expect(modelA.hello).not.toBeDefined();
        expect(modelA.foo).not.toBeDefined();
        expect(modelB.test).not.toBeDefined();
        collectionA.mixin({
          "hello": (mixin_spy = sinon.spy()),
          "foo": ko.observable("bar"),
          "bees": {
            "test": "123"
          }
        });
        expect(modelA.hello).toEqual(jasmine.any(Function));
        expect(ko.isObservable(modelA.foo)).toBe(true);
        expect(modelA.foo()).toBe('bar');
        expect(modelB.test).toBe('123');
        modelA.hello('world');
        expect(mixin_spy).toHaveBeenCalledOnce();
        expect(mixin_spy).toHaveBeenCalledOn(modelA);
        expect(mixin_spy.firstCall.args[0]).toBe(modelA);
        expect(mixin_spy.firstCall.args[1]).toBe(collectionA);
        return expect(mixin_spy.firstCall.args[2]).toBe('world');
      });
      return it("Should allow for models with values to be added post mixin", function() {
        var TheCollection, TheModel, theCollection, theModel, _ref12, _ref13;
        TheModel = (function(_super) {
          __extends(TheModel, _super);

          function TheModel() {
            _ref12 = TheModel.__super__.constructor.apply(this, arguments);
            return _ref12;
          }

          TheModel.prototype.defaults = {
            "hello": "world"
          };

          return TheModel;

        })(Falcon.Model);
        TheCollection = (function(_super) {
          __extends(TheCollection, _super);

          function TheCollection() {
            _ref13 = TheCollection.__super__.constructor.apply(this, arguments);
            return _ref13;
          }

          TheCollection.prototype.model = TheModel;

          return TheCollection;

        })(Falcon.Collection);
        theCollection = new TheCollection();
        theCollection.mixin({
          "hello": ko.observable()
        });
        theModel = new TheModel;
        expect(theModel.get("hello")).toBe("world");
        theCollection.append(theModel);
        return expect(theModel.get("hello")).toBe("world");
      });
    });
    describe("Test the clone() method", function() {
      var collectionA, model_a1, model_a2, model_a3;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1,
          'title': 'Hello World',
          'extra': 'things'
        });
        model_a2 = new ModelA({
          id: 2,
          'title': 'Foo Bar',
          'extra': 'things2'
        });
        return collectionA = new CollectionA([model_a1, model_a2], new ModelB);
      });
      it("Should do a basic clone properly", function() {
        var clone;
        clone = collectionA.clone();
        expect(clone).not.toBe(collectionA);
        expect(clone.parent).toBe(collectionA.parent);
        expect(clone.length()).toBe(2);
        expect(clone.at(0)).not.toBe(model_a1);
        expect(clone.at(0).get('id')).toBe(1);
        expect(clone.at(0).get('title')).toBe("Hello World");
        expect(clone.at(0).get('extra')).toBe("things");
        expect(clone.at(1)).not.toBe(model_a2);
        expect(clone.at(1).get('id')).toBe(2);
        expect(clone.at(1).get('title')).toBe("Foo Bar");
        return expect(clone.at(1).get('extra')).toBe("things2");
      });
      it("Should do a basic clone properly with extra fields", function() {
        var clone;
        clone = collectionA.clone(["id", "title"]);
        expect(clone).not.toBe(collectionA);
        expect(clone.parent).toBe(collectionA.parent);
        expect(clone.length()).toBe(2);
        expect(clone.at(0)).not.toBe(model_a1);
        expect(clone.at(0).get('id')).toBe(1);
        expect(clone.at(0).get('title')).toBe("Hello World");
        expect(clone.at(0).get('extra')).not.toBeDefined();
        expect(clone.at(1)).not.toBe(model_a2);
        expect(clone.at(1).get('id')).toBe(2);
        expect(clone.at(1).get('title')).toBe("Foo Bar");
        return expect(clone.at(1).get('extra')).not.toBeDefined();
      });
      it("Should do a basic clone properly without a parent", function() {
        var clone;
        clone = collectionA.clone(null);
        expect(clone).not.toBe(collectionA);
        expect(clone.parent).toBe(null);
        expect(clone.length()).toBe(2);
        expect(clone.at(0)).not.toBe(model_a1);
        expect(clone.at(0).get('id')).toBe(1);
        expect(clone.at(0).get('title')).toBe("Hello World");
        expect(clone.at(0).get('extra')).toBe("things");
        expect(clone.at(1)).not.toBe(model_a2);
        expect(clone.at(1).get('id')).toBe(2);
        expect(clone.at(1).get('title')).toBe("Foo Bar");
        return expect(clone.at(1).get('extra')).toBe("things2");
      });
      it("Should do a basic clone properly with extra fields without a parent", function() {
        var clone;
        clone = collectionA.clone(["id", "title"], null);
        expect(clone).not.toBe(collectionA);
        expect(clone.parent).toBe(null);
        expect(clone.length()).toBe(2);
        expect(clone.at(0)).not.toBe(model_a1);
        expect(clone.at(0).get('id')).toBe(1);
        expect(clone.at(0).get('title')).toBe("Hello World");
        expect(clone.at(0).get('extra')).not.toBeDefined();
        expect(clone.at(1)).not.toBe(model_a2);
        expect(clone.at(1).get('id')).toBe(2);
        expect(clone.at(1).get('title')).toBe("Foo Bar");
        return expect(clone.at(1).get('extra')).not.toBeDefined();
      });
      it("Should do a basic clone properly with a new parent", function() {
        var clone, parent;
        clone = collectionA.clone(parent = new ModelC);
        expect(clone).not.toBe(collectionA);
        expect(clone.parent).toBe(parent);
        expect(clone.length()).toBe(2);
        expect(clone.at(0)).not.toBe(model_a1);
        expect(clone.at(0).get('id')).toBe(1);
        expect(clone.at(0).get('title')).toBe("Hello World");
        expect(clone.at(0).get('extra')).toBe("things");
        expect(clone.at(1)).not.toBe(model_a2);
        expect(clone.at(1).get('id')).toBe(2);
        expect(clone.at(1).get('title')).toBe("Foo Bar");
        return expect(clone.at(1).get('extra')).toBe("things2");
      });
      return it("Should do a basic clone properly with extra fields without a parent", function() {
        var clone, parent;
        clone = collectionA.clone(["id", "title"], parent = new ModelC);
        expect(clone).not.toBe(collectionA);
        expect(clone.parent).toBe(parent);
        expect(clone.length()).toBe(2);
        expect(clone.at(0)).not.toBe(model_a1);
        expect(clone.at(0).get('id')).toBe(1);
        expect(clone.at(0).get('title')).toBe("Hello World");
        expect(clone.at(0).get('extra')).not.toBeDefined();
        expect(clone.at(1)).not.toBe(model_a2);
        expect(clone.at(1).get('id')).toBe(2);
        expect(clone.at(1).get('title')).toBe("Foo Bar");
        return expect(clone.at(1).get('extra')).not.toBeDefined();
      });
    });
    describe("Test the reset() method", function() {
      var collectionA, model_a1, model_a2, model_a3, models;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = null;
      models = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1
        });
        model_a2 = new ModelA({
          id: 2
        });
        model_a3 = new ModelA({
          id: 3
        });
        models = [model_a1, model_a2, model_a3];
        return collectionA = new CollectionA(models, new ModelB);
      });
      return it("Should reset properly", function() {
        expect(collectionA.length()).toBe(3);
        expect(collectionA.models()).toEqual(models);
        collectionA.reset();
        expect(collectionA.length()).toBe(0);
        return expect(collectionA.models()).toEqual([]);
      });
    });
    return describe("Test the chain() method", function() {
      var collectionA, model_a1, model_a2, model_a3, model_a4, model_a5;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = model_a4 = model_a5 = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1,
          title: "Model A 1"
        });
        model_a2 = new ModelA({
          id: 2,
          title: "Model A 2"
        });
        model_a3 = new ModelA({
          id: 3,
          title: "Model A 3"
        });
        model_a4 = new ModelA({
          id: 4,
          title: "Model A 4"
        });
        model_a5 = new ModelA({
          id: 5,
          title: "Model A 5"
        });
        return collectionA = new CollectionA([model_a1, model_a2, model_a3, model_a4, model_a5]);
      });
      it("Should be able to chain slice methods", function() {
        var chain_result;
        chain_result = collectionA.chain().slice(1).slice(0, 4).models();
        expect(chain_result).toEqual(jasmine.any(Array));
        return expect(chain_result.length).toBe(4);
      });
      it("Should be able to chain filter methods", function() {
        var chain_result;
        chain_result = collectionA.chain().filter(function(model) {
          return model.get("id") < 4;
        }).filter(function(model) {
          return model.get("id") !== 2;
        }).models();
        expect(chain_result).toEqual(jasmine.any(Array));
        expect(chain_result.length).toBe(2);
        return expect(chain_result).toEqual([model_a1, model_a3]);
      });
      it("Should be able to chain without methods", function() {
        var chain_result;
        chain_result = collectionA.chain().without(2).without(model_a5).models();
        expect(chain_result).toEqual(jasmine.any(Array));
        expect(chain_result.length).toBe(3);
        return expect(chain_result).toEqual([model_a1, model_a3, model_a4]);
      });
      return it("Should be able to chain a without method and sort method", function() {
        var chain_result;
        chain_result = collectionA.chain().without(2).sort(function(a, b) {
          if (a.id > b.id) {
            return -1;
          }
          if (a.id < b.id) {
            return 1;
          }
          return 0;
        }).models();
        expect(chain_result).toEqual(jasmine.any(Array));
        expect(chain_result.length).toBe(4);
        return expect(chain_result).toEqual([model_a5, model_a4, model_a3, model_a1]);
      });
    });
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Falcon.View", function() {
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
      var ajax_stub, getElement_stub, init_stub, jquery_stub;
      init_stub = ajax_stub = getElement_stub = jquery_stub = null;
      afterEach(function() {
        if (init_stub) {
          init_stub.restore();
        }
        if (ajax_stub) {
          ajax_stub.restore();
        }
        if (getElement_stub) {
          getElement_stub.restore();
        }
        if (jquery_stub) {
          jquery_stub.restore();
        }
        return init_stub = ajax_stub = getElement_stub = jquery_stub = null;
      });
      it("Should call the initialize and ajax methods with the correct arguments", function() {
        var view;
        init_stub = sinon.stub(ViewA.prototype, "initialize");
        ajax_stub = sinon.stub($, "ajax");
        getElement_stub = sinon.stub(document, 'getElementById').returns(document.createElement('div'));
        view = new ViewA("Hello", 123);
        expect(view.is_loaded()).toBe(false);
        expect(view._is_rendered).toBe(false);
        expect(init_stub).toHaveBeenCalledOnce();
        expect(init_stub).toHaveBeenCalledWith("Hello", 123);
        expect(init_stub).toHaveBeenCalledOn(view);
        expect(ajax_stub).toHaveBeenCalledOnce();
        expect(ajax_stub).toHaveBeenCalledAfter(init_stub);
        expect(ajax_stub.firstCall.args[0]).toBeDefined();
        return expect(getElement_stub).not.toHaveBeenCalled();
      });
      it("Should call the initialize and jquery methods with the correct arguments", function() {
        var view;
        init_stub = sinon.stub(ViewC.prototype, "initialize");
        ajax_stub = sinon.stub($, "ajax");
        getElement_stub = sinon.stub(document, 'getElementById').returns(document.createElement('div'));
        view = new ViewC("Hello", 123);
        expect(view.is_loaded()).toBe(true);
        expect(view._is_rendered).toBe(false);
        expect(init_stub).toHaveBeenCalledOnce();
        expect(init_stub).toHaveBeenCalledWith("Hello", 123);
        expect(init_stub).toHaveBeenCalledOn(view);
        expect(getElement_stub).toHaveBeenCalledOnce();
        expect(getElement_stub).toHaveBeenCalledAfter(init_stub);
        return expect(ajax_stub).not.toHaveBeenCalled();
      });
      it("Should call the ajax method only once", function() {
        var view;
        ajax_stub = sinon.stub($, "ajax");
        getElement_stub = sinon.stub(document, 'getElementById').returns(document.createElement('div'));
        view = new ViewA();
        expect(view.is_loaded()).toBe(false);
        expect(ajax_stub).toHaveBeenCalledOnce();
        expect(ajax_stub.firstCall.args[0]).toBeDefined();
        ajax_stub.firstCall.args[0].success("Hello World");
        expect(view.is_loaded()).toBe(true);
        expect(getElement_stub).not.toHaveBeenCalled();
        ajax_stub.reset();
        view = new ViewA();
        expect(view.is_loaded()).toBe(true);
        expect(ajax_stub).not.toHaveBeenCalled();
        expect(getElement_stub).not.toHaveBeenCalled();
        ajax_stub.reset();
        view = new ViewB();
        expect(view.is_loaded()).toBe(false);
        expect(ajax_stub).toHaveBeenCalledOnce();
        expect(ajax_stub.firstCall.args[0]).toBeDefined();
        ajax_stub.firstCall.args[0].success("Hello World");
        expect(view.is_loaded()).toBe(true);
        return expect(getElement_stub).not.toHaveBeenCalled();
      });
      it("Should call the jquery method only once", function() {
        var view;
        ajax_stub = sinon.stub($, "ajax");
        getElement_stub = sinon.stub(document, 'getElementById').returns(document.createElement('div'));
        view = new ViewC();
        expect(view.is_loaded()).toBe(true);
        expect(getElement_stub).toHaveBeenCalledOnce();
        expect(ajax_stub).not.toHaveBeenCalled();
        getElement_stub.reset();
        view = new ViewC();
        expect(view.is_loaded()).toBe(true);
        expect(getElement_stub).not.toHaveBeenCalled();
        expect(ajax_stub).not.toHaveBeenCalled();
        getElement_stub.reset();
        view = new ViewD();
        expect(view.is_loaded()).toBe(true);
        expect(getElement_stub).toHaveBeenCalledOnce();
        return expect(ajax_stub).not.toHaveBeenCalled();
      });
      return it("Should not have a template if one is not defined", function() {
        var view;
        ajax_stub = sinon.stub($, "ajax");
        getElement_stub = sinon.stub(document, 'getElementById').returns(document.createElement('div'));
        view = new ViewG();
        expect(view.is_loaded()).toBe(true);
        expect(getElement_stub).not.toHaveBeenCalled();
        return expect(ajax_stub).not.toHaveBeenCalled();
      });
    });
    describe("cacheTemplates", function() {
      var template, template2;
      template = document.createElement("template");
      template.setAttribute("id", "test_template_1");
      template.innerHTML = "Hello World 1";
      template2 = document.createElement("template");
      template2.setAttribute("id", "test_template_2");
      template2.innerHTML = "Hello World 2";
      beforeEach(function() {
        document.body.appendChild(template);
        document.body.appendChild(template2);
        return spyOn(Falcon.View, 'cacheTemplate');
      });
      it("Should have removed and cached the templates", function() {
        var ret, templates;
        templates = document.querySelectorAll("template");
        expect(templates.length).toBe(2);
        ret = Falcon.View.cacheTemplates();
        templates = document.querySelectorAll("template");
        expect(templates.length).toBe(0);
        expect(Falcon.View.cacheTemplate.calls.count()).toBe(2);
        expect(Falcon.View.cacheTemplate.calls.argsFor(0)).toEqual(['#test_template_1', 'Hello World 1']);
        expect(Falcon.View.cacheTemplate.calls.argsFor(1)).toEqual(['#test_template_2', 'Hello World 2']);
        return expect(ret).toBe(Falcon.View);
      });
      return it("Should work properly if no templates exist", function() {
        var ret, templates;
        document.body.removeChild(template);
        document.body.removeChild(template2);
        templates = document.querySelectorAll("template");
        expect(templates.length).toBe(0);
        ret = Falcon.View.cacheTemplates();
        templates = document.querySelectorAll("template");
        expect(templates.length).toBe(0);
        return expect(ret).toBe(Falcon.View);
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
        expect(hello_spy).not.toHaveBeenCalled();
        rawr_class = new RawrView("one", "two", "three");
        expect(hello_spy).toHaveBeenCalled();
        expect(hello_spy.callCount).toEqual(1);
        expect(hello_spy.firstCall.args.length).toEqual(3);
        expect(hello_spy.firstCall.args[0]).toEqual("one");
        expect(hello_spy.firstCall.args[1]).toEqual("two");
        return expect(hello_spy.firstCall.args[2]).toEqual("three");
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
        expect(hello_spy).not.toHaveBeenCalled();
        rawr_class = new RawrView(1234);
        expect(hello_spy).toHaveBeenCalled();
        expect(hello_spy.callCount).toEqual(1);
        expect(hello_spy.firstCall.args.length).toEqual(1);
        return expect(hello_spy.firstCall.args[0]).toEqual(1234);
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
        return expect(new ViewA().makeUrl()).toEqual("/view_a");
      });
      it("Should generate the correct relative url from function", function() {
        return expect(new ViewB().makeUrl()).toEqual("/view_b");
      });
      it("Should generate the correct element id from string", function() {
        return expect(new ViewC().makeUrl()).toEqual("#view_c");
      });
      it("Should generate the correct element id from function", function() {
        return expect(new ViewD().makeUrl()).toEqual("#view_d");
      });
      it("Should generate the correct relative url from string beginning with '/'", function() {
        return expect(new ViewE().makeUrl()).toEqual("/view_e");
      });
      it("Should generate the correct relative url from function beginning with '/'", function() {
        return expect(new ViewF().makeUrl()).toEqual("/view_f");
      });
      it("Should generate the correct relative url from string with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewA().makeUrl()).toEqual("http://www.falconjs.com/view_a");
      });
      it("Should generate the correct relative url from function with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewB().makeUrl()).toEqual("http://www.falconjs.com/view_b");
      });
      it("Should generate the correct element id from string with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewC().makeUrl()).toEqual("#view_c");
      });
      it("Should generate the correct element id from function with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewD().makeUrl()).toEqual("#view_d");
      });
      it("Should generate the correct relative url from string beginning with '/' with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewE().makeUrl()).toEqual("http://www.falconjs.com/view_e");
      });
      it("Should generate the correct relative url from function beginning with '/' with baseTemplateUrl", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com";
        return expect(new ViewF().makeUrl()).toEqual("http://www.falconjs.com/view_f");
      });
      it("Should generate the correct relative url from string with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewA().makeUrl()).toEqual("http://www.falconjs.com/view_a");
      });
      it("Should generate the correct relative url from function with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewB().makeUrl()).toEqual("http://www.falconjs.com/view_b");
      });
      it("Should generate the correct element id from string with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewC().makeUrl()).toEqual("#view_c");
      });
      it("Should generate the correct element id from function with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewD().makeUrl()).toEqual("#view_d");
      });
      it("Should generate the correct relative url from string beginning with '/' with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewE().makeUrl()).toEqual("http://www.falconjs.com/view_e");
      });
      it("Should generate the correct relative url from function beginning with '/' with baseTemplateUrl ending in '/'", function() {
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewF().makeUrl()).toEqual("http://www.falconjs.com/view_f");
      });
      return it("Should not make a url for a 'null' url defined", function() {
        expect(new ViewG().makeUrl()).toEqual(null);
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewG().makeUrl()).toEqual(null);
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
        expect(ko.isObservable(view.hello)).toBe(true);
        expect(view.hello()).toBe('world');
        expect(ko.isComputed(view.foo)).toBe(true);
        expect(view.foo()).toBe('bar');
        expect(ko.isComputed(view.small)).toBe(true);
        expect(view.small()).toBe('world bar');
        expect(view.test).toEqual(jasmine.any(Function));
        expect(view.another).toEqual(jasmine.any(Function));
        viewModel = view.viewModel();
        expect(ko.isObservable(viewModel.hello)).toBe(true);
        expect(viewModel.hello()).toBe('world');
        expect(ko.isComputed(viewModel.foo)).toBe(true);
        expect(viewModel.foo()).toBe('bar');
        expect(ko.isComputed(viewModel.small)).toBe(true);
        expect(viewModel.small()).toBe('world bar');
        expect(viewModel.test).toEqual(jasmine.any(Function));
        expect(viewModel.test).not.toEqual(view.test);
        expect(viewModel.another).toEqual(jasmine.any(Function));
        expect(viewModel.another).not.toEqual(view.another);
        expect(test_stub).not.toHaveBeenCalled();
        expect(another_stub).not.toHaveBeenCalled();
        viewModel.test();
        viewModel.another('hello', 'world');
        expect(test_stub).toHaveBeenCalledOnce();
        expect(test_stub).toHaveBeenCalledOn(view);
        expect(another_stub).toHaveBeenCalledOnce();
        expect(another_stub).toHaveBeenCalledWith('hello', 'world');
        expect(another_stub).toHaveBeenCalledOn(view);
        test_stub.restore();
        return another_stub.restore();
      });
      return it("Should create equal viewModels after the first has been generated", function() {
        var model1, model2, view;
        view = new FullView;
        model1 = view.viewModel();
        model2 = view.viewModel();
        return expect(model1).toEqual(model2);
      });
    });
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Knockout Bindings", function() {
    var $application, $body, application_index, applyApp;
    $application = null;
    application_index = 0;
    $body = null;
    applyApp = function(view) {
      if ($body == null) {
        $body = $("body").first();
      }
      if ($application != null) {
        $application.remove();
      }
      application_index++;
      $body.append($application = $("<div id='application_" + application_index + "'></div>"));
      return Falcon.apply(view, "#application_" + application_index);
    };
    describe("'view' Binding", function() {
      var $content_template, $footer_template, $layout_template, ContentView, FooterView, LayoutView, setup, teardown, view_binding, view_init_spy, view_update_spy, _ref, _ref1, _ref2;
      $layout_template = $footer_template = $content_template = null;
      view_binding = Falcon.getBinding('view');
      view_init_spy = sinon.spy(view_binding, 'init');
      view_update_spy = sinon.spy(view_binding, 'update');
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
      ContentView = (function(_super) {
        __extends(ContentView, _super);

        function ContentView() {
          _ref1 = ContentView.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        ContentView.prototype.url = '#content-template';

        return ContentView;

      })(Falcon.View);
      FooterView = (function(_super) {
        __extends(FooterView, _super);

        function FooterView() {
          _ref2 = FooterView.__super__.constructor.apply(this, arguments);
          return _ref2;
        }

        FooterView.prototype.url = '#footer-template';

        return FooterView;

      })(Falcon.View);
      setup = function() {
        if ($body == null) {
          $body = $("body").first();
        }
        $layout_template = $("				<template id='layout-template'>					<div data-bind='view: $view.content_view'></div>					<div data-bind='view: $view.footer_view'></div>				</template>			");
        $content_template = $("				<template id='content-template'>					The Content				</template>			");
        $footer_template = $("				<template id='footer-template'>					The Footer				</template>			");
        $body.append($layout_template);
        $body.append($footer_template);
        return $body.append($content_template);
      };
      teardown = function() {
        $layout_template.remove();
        $content_template.remove();
        return $footer_template.remove();
      };
      it("Setup", setup);
      it("Should call the view binding on initialization without an observable", function() {
        var render_spy, unrender_spy, view;
        view = new ContentView;
        render_spy = sinon.spy(view, '_render');
        unrender_spy = sinon.spy(view, '_unrender');
        expect(view_init_spy).not.toHaveBeenCalled();
        expect(view_update_spy).not.toHaveBeenCalled();
        expect(render_spy).not.toHaveBeenCalled();
        expect(unrender_spy).not.toHaveBeenCalled();
        applyApp(view);
        expect(view_init_spy).toHaveBeenCalledOnce();
        expect(view_update_spy).toHaveBeenCalledOnce();
        expect(render_spy).toHaveBeenCalledOnce();
        return expect(unrender_spy).not.toHaveBeenCalled();
      });
      describe("Testing changes in views that are contained in observables", function() {
        var content_display_spy, content_dispose_spy, content_render_spy, content_unrender_spy, content_view, display_spy, dispose_spy, footer_display_spy, footer_dispose_spy, footer_render_spy, footer_unrender_spy, footer_view, obs, render_spy, unrender_spy, view;
        view = content_view = footer_view = obs = null;
        render_spy = unrender_spy = display_spy = dispose_spy = null;
        content_render_spy = content_unrender_spy = content_display_spy = content_dispose_spy = null;
        footer_render_spy = footer_unrender_spy = footer_display_spy = footer_dispose_spy = null;
        setup = function() {
          view = new LayoutView;
          content_view = view.content_view();
          footer_view = view.footer_view();
          obs = ko.observable(null);
          render_spy = sinon.spy(view, '_render');
          unrender_spy = sinon.spy(view, '_unrender');
          display_spy = sinon.spy(view, 'display');
          dispose_spy = sinon.spy(view, 'dispose');
          content_render_spy = sinon.spy(content_view, '_render');
          content_unrender_spy = sinon.spy(content_view, '_unrender');
          content_display_spy = sinon.spy(content_view, 'display');
          content_dispose_spy = sinon.spy(content_view, 'dispose');
          footer_render_spy = sinon.spy(footer_view, '_render');
          footer_unrender_spy = sinon.spy(footer_view, '_unrender');
          footer_display_spy = sinon.spy(footer_view, 'display');
          return footer_dispose_spy = sinon.spy(footer_view, 'dispose');
        };
        beforeEach(function() {
          if (view == null) {
            return;
          }
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
        it("Setup", setup);
        it("Should not call any render or unrender methods on unassigned observable", function() {
          applyApp(obs);
          expect(view_init_spy).toHaveBeenCalledOnce();
          expect(view_update_spy).toHaveBeenCalledOnce();
          expect(render_spy).not.toHaveBeenCalled();
          expect(content_render_spy).not.toHaveBeenCalled();
          expect(footer_render_spy).not.toHaveBeenCalled();
          expect(display_spy).not.toHaveBeenCalled();
          expect(content_display_spy).not.toHaveBeenCalled();
          expect(footer_display_spy).not.toHaveBeenCalled();
          expect(unrender_spy).not.toHaveBeenCalled();
          expect(content_render_spy).not.toHaveBeenCalled();
          expect(footer_unrender_spy).not.toHaveBeenCalled();
          expect(dispose_spy).not.toHaveBeenCalled();
          expect(content_dispose_spy).not.toHaveBeenCalled();
          return expect(footer_dispose_spy).not.toHaveBeenCalled();
        });
        it("Should call init, update, and render the correct number of times", function() {
          obs(view);
          expect(view_init_spy).toHaveBeenCalledTwice();
          expect(view_update_spy).toHaveBeenCalledThrice();
          expect(render_spy).toHaveBeenCalledOnce();
          expect(content_render_spy).toHaveBeenCalledOnce();
          expect(footer_render_spy).toHaveBeenCalledOnce();
          expect(display_spy).toHaveBeenCalledOnce();
          expect(content_display_spy).toHaveBeenCalledOnce();
          expect(footer_display_spy).toHaveBeenCalledOnce();
          expect(unrender_spy).not.toHaveBeenCalled();
          expect(content_unrender_spy).not.toHaveBeenCalled();
          expect(footer_unrender_spy).not.toHaveBeenCalled();
          expect(dispose_spy).not.toHaveBeenCalled();
          expect(content_dispose_spy).not.toHaveBeenCalled();
          return expect(footer_dispose_spy).not.toHaveBeenCalled();
        });
        it("Should react to a child view being updated", function() {
          view.content_view(new ContentView);
          expect(view_init_spy).not.toHaveBeenCalled();
          expect(view_update_spy).toHaveBeenCalledOnce();
          expect(render_spy).not.toHaveBeenCalled();
          expect(content_render_spy).not.toHaveBeenCalled();
          expect(footer_render_spy).not.toHaveBeenCalled();
          expect(display_spy).not.toHaveBeenCalled();
          expect(content_display_spy).not.toHaveBeenCalled();
          expect(footer_display_spy).not.toHaveBeenCalled();
          expect(unrender_spy).not.toHaveBeenCalled();
          expect(content_unrender_spy).toHaveBeenCalledOnce();
          expect(footer_unrender_spy).not.toHaveBeenCalled();
          expect(dispose_spy).not.toHaveBeenCalled();
          expect(content_dispose_spy).toHaveBeenCalledOnce();
          return expect(footer_dispose_spy).not.toHaveBeenCalled();
        });
        return it("Should react to the entire, root, view being updated", function() {
          obs(new ContentView);
          expect(view_init_spy).not.toHaveBeenCalled();
          expect(view_update_spy).toHaveBeenCalledOnce();
          expect(render_spy).not.toHaveBeenCalled();
          expect(content_render_spy).not.toHaveBeenCalled();
          expect(footer_render_spy).not.toHaveBeenCalled();
          expect(display_spy).not.toHaveBeenCalled();
          expect(content_display_spy).not.toHaveBeenCalled();
          expect(footer_display_spy).not.toHaveBeenCalled();
          expect(unrender_spy).toHaveBeenCalled();
          expect(content_unrender_spy).not.toHaveBeenCalled();
          expect(footer_unrender_spy).toHaveBeenCalledOnce();
          expect(dispose_spy).toHaveBeenCalledOnce();
          expect(content_dispose_spy).not.toHaveBeenCalled();
          return expect(footer_dispose_spy).toHaveBeenCalledOnce();
        });
      });
      return it("Teardown", teardown);
    });
    describe("Test view binding with an observable array of views", function() {
      var $content_template, $layout_template, ContentView, LayoutView, view_binding, _ref, _ref1;
      view_binding = ko.bindingHandlers['view'];
      LayoutView = (function(_super) {
        __extends(LayoutView, _super);

        function LayoutView() {
          _ref = LayoutView.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        LayoutView.prototype.url = '#layout-template';

        LayoutView.prototype.observables = {
          views: []
        };

        return LayoutView;

      })(Falcon.View);
      $layout_template = $("			<template id='layout-template'>				<!-- ko foreach: $view.views -->					<div data-bind='view: $data'></div>				<!-- /ko -->			</template>		");
      ContentView = (function(_super) {
        __extends(ContentView, _super);

        function ContentView() {
          _ref1 = ContentView.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        ContentView.prototype.url = '#content-template2';

        ContentView.prototype.observables = {
          "_title": "",
          "title": {
            read: function() {
              return this._title();
            },
            write: function(title) {
              return this._title(title);
            }
          }
        };

        return ContentView;

      })(Falcon.View);
      $content_template = $("			<template id='content-template2'>				<div data-bind='title: $view.title'></div>			</template>		");
      beforeEach(function() {
        $body.append($layout_template);
        return $body.append($content_template);
      });
      afterEach(function() {
        $layout_template.remove();
        return $content_template.remove();
      });
      return it("Should call like observables with their own context and update individually", function() {
        var first_content, first_spy, layout, second_content, second_spy;
        layout = new LayoutView;
        first_content = new ContentView;
        second_content = new ContentView;
        Falcon.the_layout = layout;
        first_spy = sinon.spy(first_content, "title");
        second_spy = sinon.spy(second_content, "title");
        applyApp(layout);
        expect(first_spy).not.toHaveBeenCalled();
        expect(second_spy).not.toHaveBeenCalled();
        layout.views.push(first_content);
        expect(first_spy).not.toHaveBeenCalled();
        expect(second_spy).not.toHaveBeenCalled();
        first_spy.reset();
        first_content.title("First Title");
        expect(first_spy).toHaveBeenCalled();
        expect(first_spy).toHaveBeenCalledOn(first_content);
        expect(first_spy).toHaveBeenCalledWith("First Title");
        expect(second_spy).not.toHaveBeenCalled();
        first_spy.reset();
        layout.views.push(second_content);
        expect(first_spy).not.toHaveBeenCalled();
        expect(second_spy).not.toHaveBeenCalled();
        first_spy.reset();
        second_spy.reset();
        second_content.title("Second Title");
        expect(first_spy).not.toHaveBeenCalled();
        expect(second_spy).toHaveBeenCalled();
        expect(second_spy).toHaveBeenCalledOn(second_content);
        expect(second_spy).toHaveBeenCalledWith("Second Title");
        second_spy.reset();
        expect(first_content.title()).toEqual("First Title");
        return expect(second_content.title()).toEqual("Second Title");
      });
    });
    describe("Test execScripts: true for view binding", function() {
      var $test_view_template, TestView, _ref;
      TestView = (function(_super) {
        __extends(TestView, _super);

        function TestView() {
          _ref = TestView.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        TestView.prototype.url = "#test_view";

        TestView.prototype.execScripts = true;

        return TestView;

      })(Falcon.View);
      $test_view_template = $("			<template id='test_view'>				<script type='text/javascript'>window.call_spy();</script>				<script>window.call_another_spy();</script>				<script type='text/template'>window.call_a_third_spy();</script>			</template>		");
      beforeEach(function() {
        window.call_spy = jasmine.createSpy("'Call Spy'");
        window.call_another_spy = jasmine.createSpy("'Call Another Spy'");
        window.call_a_third_spy = jasmine.createSpy("'Call A Third Spy'");
        $body.append($test_view_template);
        window.call_spy.calls.reset();
        window.call_another_spy.calls.reset();
        return window.call_a_third_spy.calls.reset();
      });
      afterEach(function() {
        $test_view_template.remove();
        window.call_spy = window.call_another_spy = window.call_a_third_spy = null;
        delete window.call_spy;
        delete window.call_another_spy;
        return delete window.call_a_third_spy;
      });
      return it("Should call the spies", function() {
        expect(window.call_spy).not.toHaveBeenCalled();
        expect(window.call_another_spy).not.toHaveBeenCalled();
        expect(window.call_a_third_spy).not.toHaveBeenCalled();
        applyApp(new TestView);
        expect(window.call_spy.calls.count()).toBe(1);
        expect(window.call_another_spy.calls.count()).toBe(1);
        return expect(window.call_a_third_spy).not.toHaveBeenCalled();
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
        var $array_list, $array_list_options, $collection_list, $collection_list_options, $layout_template, LayoutView, after_add_spy, before_remove_spy, setup, teardown, view, view_observable, _ref2;
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
            return $(element).remove();
          };

          return LayoutView;

        })(Falcon.View);
        $layout_template = $("				<template id='layout-template'>					<ul class='array_list' data-bind='foreach: $view.array_list'><li>An Item</li></ul>					<ul class='collection_list' data-bind='foreach: $view.collection_list'><li>An Item</li></ul>					<ul class='array_list_options' data-bind='foreach: {data: $view.array_list_options, afterAdd: $view.afterAdd, beforeRemove: $view.beforeRemove}'><li>An Item</li></ul>					<ul class='collection_list_options' data-bind='foreach: {data: $view.collection_list_options, afterAdd: $view.afterAdd, beforeRemove: $view.beforeRemove}'><li>An Item</li></ul>				</template>			");
        view = null;
        view_observable = ko.observable();
        $array_list = $collection_list = null;
        $array_list_options = $collection_list_options = null;
        after_add_spy = before_remove_spy = null;
        setup = function() {
          $body.append($application);
          $body.append($layout_template);
          Falcon.View.cacheTemplates();
          foreach_init_spy = sinon.spy(foreach_binding, 'init');
          foreach_update_spy = sinon.spy(foreach_binding, 'update');
          return applyApp(view_observable);
        };
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
        teardown = function() {
          $application.remove();
          $layout_template.remove();
          foreach_init_spy.restore();
          return foreach_update_spy.restore();
        };
        it("Setup", setup);
        it("Should properly list with an observable array", function() {
          expect(foreach_init_spy).toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_init_spy.callCount).toEqual(4);
          expect(foreach_update_spy.callCount).toEqual(4);
          expect($array_list.children().length).toEqual(0);
          expect($collection_list.children().length).toEqual(0);
          expect($array_list_options.children().length).toEqual(0);
          expect($collection_list_options.children().length).toEqual(0);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.array_list.push("Hello");
          view.array_list.push("World", "Foo Bar");
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(2);
          expect($array_list.children().length).toEqual(3);
          expect($collection_list.children().length).toEqual(0);
          expect($array_list_options.children().length).toEqual(0);
          expect($collection_list_options.children().length).toEqual(0);
          foreach_update_spy.reset();
          view.array_list.pop();
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(1);
          expect($array_list.children().length).toEqual(2);
          expect($collection_list.children().length).toEqual(0);
          expect($array_list_options.children().length).toEqual(0);
          return expect($collection_list_options.children().length).toEqual(0);
        });
        it("Should properly list with a collection", function() {
          expect(foreach_init_spy).toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_init_spy.callCount).toEqual(4);
          expect(foreach_update_spy.callCount).toEqual(4);
          expect($array_list.children().length).toEqual(0);
          expect($collection_list.children().length).toEqual(0);
          expect($array_list_options.children().length).toEqual(0);
          expect($collection_list_options.children().length).toEqual(0);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.collection_list.push(new ModelA);
          view.collection_list.push([new ModelA, new ModelA]);
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(2);
          expect($array_list.children().length).toEqual(0);
          expect($collection_list.children().length).toEqual(3);
          expect($array_list_options.children().length).toEqual(0);
          expect($collection_list_options.children().length).toEqual(0);
          foreach_update_spy.reset();
          view.collection_list.pop();
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(1);
          expect($array_list.children().length).toEqual(0);
          expect($collection_list.children().length).toEqual(2);
          expect($array_list_options.children().length).toEqual(0);
          return expect($collection_list_options.children().length).toEqual(0);
        });
        it("Should properly list with an observable array including options", function() {
          expect(foreach_init_spy).toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_init_spy.callCount).toEqual(4);
          expect(foreach_update_spy.callCount).toEqual(4);
          expect($array_list.children().length).toEqual(0);
          expect($collection_list.children().length).toEqual(0);
          expect($array_list_options.children().length).toEqual(0);
          expect($collection_list_options.children().length).toEqual(0);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.array_list_options.push("Hello2");
          view.array_list_options.push("World2", "Foo Bar2");
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(2);
          expect(after_add_spy.callCount).toEqual(3);
          expect($array_list.children().length).toEqual(0);
          expect($collection_list.children().length).toEqual(0);
          expect($array_list_options.children().length).toEqual(3);
          expect($collection_list_options.children().length).toEqual(0);
          foreach_update_spy.reset();
          after_add_spy.reset();
          view.array_list_options.pop();
          view.array_list_options.pop();
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(2);
          expect(before_remove_spy.callCount).toEqual(2);
          expect($array_list.children().length).toEqual(0);
          expect($collection_list.children().length).toEqual(0);
          expect($array_list_options.children().length).toEqual(1);
          return expect($collection_list_options.children().length).toEqual(0);
        });
        it("Should properly list with a collection including options", function() {
          expect(foreach_init_spy).toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_init_spy.callCount).toEqual(4);
          expect(foreach_update_spy.callCount).toEqual(4);
          expect($array_list.children().length).toEqual(0);
          expect($collection_list.children().length).toEqual(0);
          expect($array_list_options.children().length).toEqual(0);
          expect($collection_list_options.children().length).toEqual(0);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.collection_list_options.push(new ModelA);
          view.collection_list_options.push([new ModelA, new ModelA]);
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(2);
          expect(after_add_spy.callCount).toEqual(3);
          expect($array_list.children().length).toEqual(0);
          expect($collection_list.children().length).toEqual(0);
          expect($array_list_options.children().length).toEqual(0);
          expect($collection_list_options.children().length).toEqual(3);
          foreach_update_spy.reset();
          after_add_spy.reset();
          view.collection_list_options.pop();
          view.collection_list_options.pop();
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(2);
          expect(before_remove_spy.callCount).toEqual(2);
          expect($array_list.children().length).toEqual(0);
          expect($collection_list.children().length).toEqual(0);
          expect($array_list_options.children().length).toEqual(0);
          return expect($collection_list_options.children().length).toEqual(1);
        });
        return it("Teardown", teardown);
      });
      return describe("Test observable bindings against collections", function() {
        var $collection_list, $layout_template, LayoutView, after_add_spy, before_remove_spy, setup, teardown, view, view_observable, _ref2;
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
        setup = function() {
          $body.append($layout_template);
          Falcon.View.cacheTemplates();
          foreach_init_spy = sinon.spy(foreach_binding, 'init');
          foreach_update_spy = sinon.spy(foreach_binding, 'update');
          return applyApp(view_observable);
        };
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
        teardown = function() {
          $application.remove();
          $layout_template.remove();
          foreach_init_spy.restore();
          return foreach_update_spy.restore();
        };
        it("Setup", setup);
        it("Should properly update if collection is switched to another with same update count", function() {
          expect(foreach_init_spy).toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(foreach_init_spy.callCount).toEqual(1);
          expect(foreach_update_spy.callCount).toEqual(1);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.collection_a1.fill([new ModelA, new ModelA]);
          view.collection_a2.fill([new ModelA, new ModelA, new ModelA, new ModelA, new ModelA]);
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(1);
          expect($collection_list.children().length).toEqual(2);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.selected_number(2);
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(1);
          expect($collection_list.children().length).toEqual(5);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.selected_number(1);
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(1);
          return expect($collection_list.children().length).toEqual(2);
        });
        return it("Teardown", teardown);
      });
    });
    describe("Test updated options binding", function() {});
    return describe("Test log binding", function() {});
    /*
    	view_init_spy.restore()
    	view_update_spy.restore()
    */

  });

}).call(this);
