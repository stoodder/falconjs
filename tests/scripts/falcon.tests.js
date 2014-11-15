(function() {
  describe("Falcon", function() {
    it("Should be a falcon object", function() {
      return expect(Falcon instanceof Falcon.Object).toBe(true);
    });
    describe("apply", function() {
      var view;
      view = null;
      beforeEach(function() {
        var observable_view;
        spyOn(ko, 'applyBindings');
        spyOn(ko, 'applyBindingAccessorsToNode');
        view = new Falcon.View;
        observable_view = ko.observable(view);
        return spyOn(Falcon, 'ready');
      });
      it("Should find the correct element with an HTMLElement", function() {
        var callback, element, ret;
        element = document.createElement("div");
        document.body.appendChild(element);
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, element, callback);
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode).not.toHaveBeenCalled();
        expect(Falcon.ready.calls.count()).toBe(1);
        expect(Falcon.ready).toHaveBeenCalledWith(jasmine.any(Function));
        Falcon.ready.calls.mostRecent().args[0]();
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode.calls.count()).toBe(1);
        expect(ko.applyBindingAccessorsToNode).toHaveBeenCalledWith(element, {
          view: jasmine.any(Function)
        });
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should find the correct element by id", function() {
        var callback, element, ret;
        element = document.createElement("div");
        element.setAttribute("id", "test");
        document.body.appendChild(element);
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, "#test", callback);
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode).not.toHaveBeenCalled();
        expect(Falcon.ready.calls.count()).toBe(1);
        expect(Falcon.ready).toHaveBeenCalledWith(jasmine.any(Function));
        Falcon.ready.calls.mostRecent().args[0]();
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode.calls.count()).toBe(1);
        expect(ko.applyBindingAccessorsToNode).toHaveBeenCalledWith(element, {
          view: jasmine.any(Function)
        });
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should find the correct element using Falcon.applicationElement", function() {
        var callback, element, ret;
        element = document.createElement("div");
        document.body.appendChild(element);
        Falcon.applicationElement = element;
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, callback);
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode).not.toHaveBeenCalled();
        expect(Falcon.ready.calls.count()).toBe(1);
        expect(Falcon.ready).toHaveBeenCalledWith(jasmine.any(Function));
        Falcon.ready.calls.mostRecent().args[0]();
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode.calls.count()).toBe(1);
        expect(ko.applyBindingAccessorsToNode).toHaveBeenCalledWith(element, {
          view: jasmine.any(Function)
        });
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should find the correct element by id us Falcon.applicationElement", function() {
        var callback, element, ret;
        element = document.createElement("div");
        element.setAttribute("id", "test");
        document.body.appendChild(element);
        Falcon.applicationElement = "#test";
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, callback);
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode).not.toHaveBeenCalled();
        expect(Falcon.ready.calls.count()).toBe(1);
        expect(Falcon.ready).toHaveBeenCalledWith(jasmine.any(Function));
        Falcon.ready.calls.mostRecent().args[0]();
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode.calls.count()).toBe(1);
        expect(ko.applyBindingAccessorsToNode).toHaveBeenCalledWith(element, {
          view: jasmine.any(Function)
        });
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should allow for an HTMLElement as the applicationElement", function() {
        var callback, element, ret;
        element = document.createElement("div");
        document.body.appendChild(element);
        Falcon.applicationElement = element;
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, callback);
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode).not.toHaveBeenCalled();
        expect(Falcon.ready.calls.count()).toBe(1);
        expect(Falcon.ready).toHaveBeenCalledWith(jasmine.any(Function));
        Falcon.ready.calls.mostRecent().args[0]();
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode.calls.count()).toBe(1);
        expect(ko.applyBindingAccessorsToNode).toHaveBeenCalledWith(element, {
          view: jasmine.any(Function)
        });
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should find the correct element by id in the applicationEement", function() {
        var callback, element, ret;
        element = document.createElement("div");
        element.setAttribute("id", "test");
        document.body.appendChild(element);
        Falcon.applicationElement = "#test";
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, callback);
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode).not.toHaveBeenCalled();
        expect(Falcon.ready.calls.count()).toBe(1);
        expect(Falcon.ready).toHaveBeenCalledWith(jasmine.any(Function));
        Falcon.ready.calls.mostRecent().args[0]();
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode.calls.count()).toBe(1);
        expect(ko.applyBindingAccessorsToNode).toHaveBeenCalledWith(element, {
          view: jasmine.any(Function)
        });
        expect(callback.calls.count()).toBe(1);
        expect(ret).toBe(Falcon);
        return document.body.removeChild(element);
      });
      it("Should not fail if no element can be found", function() {
        var callback, ret;
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, "#notreal", callback);
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode).not.toHaveBeenCalled();
        expect(Falcon.ready.calls.count()).toBe(1);
        expect(Falcon.ready).toHaveBeenCalledWith(jasmine.any(Function));
        Falcon.ready.calls.mostRecent().args[0]();
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode.calls.count()).toBe(1);
        expect(ko.applyBindingAccessorsToNode).toHaveBeenCalledWith(document.body, {
          view: jasmine.any(Function)
        });
        expect(callback.calls.count()).toBe(1);
        return expect(ret).toBe(Falcon);
      });
      it("Should not fail if no applicationElement can be found", function() {
        var callback, ret;
        Falcon.applicationElement = "#notreal";
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(view, callback);
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode).not.toHaveBeenCalled();
        expect(Falcon.ready.calls.count()).toBe(1);
        expect(Falcon.ready).toHaveBeenCalledWith(jasmine.any(Function));
        Falcon.ready.calls.mostRecent().args[0]();
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode.calls.count()).toBe(1);
        expect(ko.applyBindingAccessorsToNode).toHaveBeenCalledWith(document.body, {
          view: jasmine.any(Function)
        });
        expect(callback.calls.count()).toBe(1);
        return expect(ret).toBe(Falcon);
      });
      return it("Should call applyBindings if no root view or viewModel is given", function() {
        var callback, ret;
        Falcon.applicationElement = "#notreal";
        callback = jasmine.createSpy("Callback");
        ret = Falcon.apply(callback);
        expect(ko.applyBindings).not.toHaveBeenCalled();
        expect(ko.applyBindingAccessorsToNode).not.toHaveBeenCalled();
        expect(Falcon.ready.calls.count()).toBe(1);
        expect(Falcon.ready).toHaveBeenCalledWith(jasmine.any(Function));
        Falcon.ready.calls.mostRecent().args[0]();
        expect(ko.applyBindingAccessorsToNode).not.toHaveBeenCalled();
        expect(ko.applyBindings.calls.count()).toBe(1);
        expect(ko.applyBindings).toHaveBeenCalledWith({}, document.body);
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
    var obj;
    obj = null;
    beforeEach(function() {
      return obj = new Falcon.Object();
    });
    describe("on, off, trigger, has", function() {
      var click_one, click_two, context_two, mouseover_one;
      click_one = click_two = context_two = mouseover_one = null;
      beforeEach(function() {
        obj.on("click", (click_one = sinon.spy()));
        obj.on("click", (click_two = sinon.spy()), (context_two = {}));
        return obj.on("mouseover", (mouseover_one = sinon.spy()));
      });
      it("Should not call any of the methods before trigger", function() {
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).not.toHaveBeenCalled();
        return expect(mouseover_one).not.toHaveBeenCalled();
      });
      it("Should trigger both click routines", function() {
        obj.trigger("click", 1, 2, 3);
        expect(click_one).toHaveBeenCalledOnce();
        expect(click_one).toHaveBeenCalledWith(1, 2, 3);
        expect(click_two).toHaveBeenCalledOnce();
        expect(click_two).toHaveBeenCalledWith(1, 2, 3);
        expect(click_two).toHaveBeenCalledOn(context_two);
        return expect(mouseover_one).not.toHaveBeenCalled();
      });
      it("Should call the mouseover routine", function() {
        obj.trigger("mouseover", "go", true, {});
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).not.toHaveBeenCalled();
        expect(mouseover_one).toHaveBeenCalledOnce();
        return expect(mouseover_one).toHaveBeenCalledWith("go", true, {});
      });
      it("Should be able to find the click event methods and shouldn't have attempted to call the methods", function() {
        expect(obj.has("click", click_one)).toBe(true);
        expect(obj.has("click", click_two)).toBe(true);
        expect(obj.has("click", mouseover_one)).toBe(false);
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).not.toHaveBeenCalled();
        return expect(mouseover_one).not.toHaveBeenCalled();
      });
      it("Should be able to find the mouseover event methods", function() {
        expect(obj.has("mouseover", click_one)).toBe(false);
        expect(obj.has("mouseover", click_two)).toBe(false);
        expect(obj.has("mouseover", mouseover_one)).toBe(true);
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).not.toHaveBeenCalled();
        return expect(mouseover_one).not.toHaveBeenCalled();
      });
      it("Should be able to remove an event properly", function() {
        obj.off("click", click_one);
        obj.trigger("click", 4, 5, 6);
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).toHaveBeenCalledOnce();
        expect(click_two).toHaveBeenCalledWith(4, 5, 6);
        return expect(mouseover_one).not.toHaveBeenCalled();
      });
      it("Should be able to remove all events", function() {
        obj.off();
        obj.trigger("click", [4, 5, 6]);
        obj.trigger("mouseover", []);
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).not.toHaveBeenCalled();
        return expect(mouseover_one).not.toHaveBeenCalled();
      });
      it("Should remove an event even if the callback is part of two different object instances", function() {
        var MiscObj, callback_spy, obj1, obj2, other_obj, _ref;
        callback_spy = sinon.spy();
        MiscObj = (function(_super) {
          __extends(MiscObj, _super);

          function MiscObj() {
            _ref = MiscObj.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          MiscObj.prototype.callback = function() {
            return callback_spy();
          };

          return MiscObj;

        })(Falcon.Object);
        obj1 = new MiscObj;
        obj2 = new MiscObj;
        other_obj = new MiscObj;
        other_obj.on("click", obj1.callback);
        other_obj.on("click", obj2.callback);
        other_obj.trigger("click");
        expect(callback_spy).toHaveBeenCalledTwice();
        callback_spy.reset();
        other_obj.off("click", obj1.callback);
        other_obj.trigger("click");
        return expect(callback_spy).not.toHaveBeenCalled();
      });
      return it("Should remove an event utilizing the proper context", function() {
        var MiscObj, callback_spy, obj1, obj2, other_obj, _ref;
        callback_spy = sinon.spy();
        MiscObj = (function(_super) {
          __extends(MiscObj, _super);

          function MiscObj() {
            _ref = MiscObj.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          MiscObj.prototype.callback = function() {
            return callback_spy();
          };

          return MiscObj;

        })(Falcon.Object);
        obj1 = new MiscObj;
        obj2 = new MiscObj;
        other_obj = new MiscObj;
        other_obj.on("click", obj1.callback, obj1);
        other_obj.on("click", obj2.callback, obj2);
        other_obj.trigger("click");
        expect(callback_spy).toHaveBeenCalledTwice();
        callback_spy.reset();
        other_obj.off("click", obj1.callback, obj1);
        other_obj.trigger("click");
        return expect(callback_spy).toHaveBeenCalledOnce();
      });
    });
    describe("listenTo", function() {
      var collection, login_callback, model, model_2, notify_callback, object, view;
      object = model = model_2 = collection = view = null;
      login_callback = notify_callback = null;
      beforeEach(function() {
        object = new Falcon.Object;
        model = new Falcon.Model;
        model_2 = new Falcon.Model;
        collection = new Falcon.Collection;
        view = new Falcon.View;
        login_callback = sinon.spy();
        return notify_callback = sinon.spy();
      });
      it("Should have no listeners by default", function() {
        return expect(object.__falcon_object__listeners__).toBeNull();
      });
      return it("Should add listeners properly", function() {
        expect(object.listenTo(model, "login", login_callback)).toBe(object);
        expect(object.listenTo(model_2, "login", notify_callback)).toBe(object);
        expect(object.listenTo(model_2, "login", login_callback)).toBe(object);
        expect(login_callback).not.toHaveBeenCalled();
        expect(object.__falcon_object__listeners__.length).toBe(3);
        model.trigger("login");
        expect(login_callback).toHaveBeenCalledOnce();
        expect(login_callback).toHaveBeenCalledOn(object);
        expect(notify_callback).not.toHaveBeenCalled();
        login_callback.reset();
        model_2.trigger("login");
        expect(login_callback).toHaveBeenCalledOnce();
        expect(login_callback).toHaveBeenCalledOn(object);
        expect(notify_callback).toHaveBeenCalledOnce();
        return expect(notify_callback).toHaveBeenCalledOn(object);
      });
    });
    describe("stopListening", function() {
      var callback_one, callback_two, model, object, view;
      object = model = view = null;
      callback_one = callback_two = null;
      beforeEach(function() {
        object = new Falcon.Object;
        model = new Falcon.Model;
        view = new Falcon.View;
        callback_one = sinon.spy();
        callback_two = sinon.spy();
        object.listenTo(model, "login", callback_one);
        object.listenTo(model, "login", callback_one);
        object.listenTo(model, "notify", callback_two);
        object.listenTo(view, "login", callback_two);
        return object.listenTo(view, "notify", callback_one);
      });
      it("Should stop listening to everything", function() {
        var ret;
        ret = object.stopListening();
        model.trigger("login", "model login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        model.trigger("notify", "model notify");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        view.trigger("login", "view login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        view.trigger("notify", "view notify");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        return expect(ret).toBe(object);
      });
      it("Should stop listening to events based on object", function() {
        var ret;
        ret = object.stopListening(model);
        model.trigger("login", "model login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        model.trigger("notify", "model notify");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        view.trigger("login", "view login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("view login");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("notify", "view notify");
        expect(callback_one).toHaveBeenCalledOnce();
        expect(callback_one).toHaveBeenCalledWith("view notify");
        expect(callback_one).toHaveBeenCalledOn(object);
        expect(callback_two).not.toHaveBeenCalled();
        callback_one.reset();
        return expect(ret).toBe(object);
      });
      it("Should stop listening to events based on event", function() {
        var ret;
        ret = object.stopListening("login");
        model.trigger("login", "model login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        model.trigger("notify", "model notify");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("model notify");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("login", "view login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        view.trigger("notify", "view notify");
        expect(callback_one).toHaveBeenCalledOnce();
        expect(callback_one).toHaveBeenCalledWith("view notify");
        expect(callback_one).toHaveBeenCalledOn(object);
        expect(callback_two).not.toHaveBeenCalled();
        callback_one.reset();
        return expect(ret).toBe(object);
      });
      it("Should stop listeing to events based on callback", function() {
        var ret;
        ret = object.stopListening(callback_one);
        model.trigger("login", "model login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        model.trigger("notify", "model notify");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("model notify");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("login", "view login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("view login");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("notify", "view notify");
        expect(callback_one).not.toHaveBeenCalledOnce();
        expect(callback_two).not.toHaveBeenCalled();
        return expect(ret).toBe(object);
      });
      it("Should stop listening to events based on object and event", function() {
        var ret;
        ret = object.stopListening(model, "login");
        model.trigger("login", "model login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        model.trigger("notify", "model notify");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("model notify");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("login", "view login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("view login");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("notify", "view notify");
        expect(callback_one).toHaveBeenCalledOnce();
        expect(callback_one).toHaveBeenCalledWith("view notify");
        expect(callback_one).toHaveBeenCalledOn(object);
        expect(callback_two).not.toHaveBeenCalled();
        callback_one.reset();
        return expect(ret).toBe(object);
      });
      it("Should stop listening to events based on object and callback", function() {
        var ret;
        ret = object.stopListening(model, callback_two);
        model.trigger("login", "model login");
        expect(callback_one).toHaveBeenCalledTwice();
        expect(callback_one).toHaveBeenCalledWith("model login");
        expect(callback_one).toHaveBeenCalledOn(object);
        expect(callback_two).not.toHaveBeenCalled();
        callback_one.reset();
        model.trigger("notify", "model notify");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        callback_two.reset();
        view.trigger("login", "view login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("view login");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("notify", "view notify");
        expect(callback_one).toHaveBeenCalledOnce();
        expect(callback_one).toHaveBeenCalledWith("view notify");
        expect(callback_one).toHaveBeenCalledOn(object);
        expect(callback_two).not.toHaveBeenCalled();
        callback_one.reset();
        return expect(ret).toBe(object);
      });
      it("Should stop listening to events based on event and callback", function() {
        var ret;
        ret = object.stopListening("login", callback_two);
        model.trigger("login", "model login");
        expect(callback_one).toHaveBeenCalledTwice();
        expect(callback_one).toHaveBeenCalledWith("model login");
        expect(callback_one).toHaveBeenCalledOn(object);
        expect(callback_two).not.toHaveBeenCalled();
        callback_one.reset();
        model.trigger("notify", "model notify");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("model notify");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("login", "view login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        view.trigger("notify", "view notify");
        expect(callback_one).toHaveBeenCalledOnce();
        expect(callback_one).toHaveBeenCalledWith("view notify");
        expect(callback_one).toHaveBeenCalledOn(object);
        expect(callback_two).not.toHaveBeenCalled();
        callback_one.reset();
        return expect(ret).toBe(object);
      });
      it("Should stop listening to events based on object, event, and callback", function() {
        var ret;
        ret = object.stopListening(model, "login", callback_one);
        model.trigger("login", "model login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).not.toHaveBeenCalled();
        model.trigger("notify", "model notify");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("model notify");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("login", "view login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("view login");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("notify", "view notify");
        expect(callback_one).toHaveBeenCalledOnce();
        expect(callback_one).toHaveBeenCalledWith("view notify");
        expect(callback_one).toHaveBeenCalledOn(object);
        expect(callback_two).not.toHaveBeenCalled();
        callback_one.reset();
        return expect(ret).toBe(object);
      });
      it("Should not remove any events if nothing matches", function() {
        var invalid_callback;
        invalid_callback = sinon.spy();
        expect(object.stopListening(new Falcon.Collection)).toBe(object);
        expect(object.stopListening("invalid_event")).toBe(object);
        expect(object.stopListening(invalid_callback)).toBe(object);
        expect(object.stopListening(model, "invalid_event")).toBe(object);
        expect(object.stopListening(model, invalid_callback)).toBe(object);
        expect(object.stopListening(model, "login", invalid_callback)).toBe(object);
        expect(invalid_callback).not.toHaveBeenCalled();
        model.trigger("login", "model login");
        expect(callback_one).toHaveBeenCalledTwice();
        expect(callback_one).toHaveBeenCalledWith("model login");
        expect(callback_one).toHaveBeenCalledOn(object);
        expect(callback_two).not.toHaveBeenCalled();
        callback_one.reset();
        model.trigger("notify", "model notify");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("model notify");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("login", "view login");
        expect(callback_one).not.toHaveBeenCalled();
        expect(callback_two).toHaveBeenCalledOnce();
        expect(callback_two).toHaveBeenCalledWith("view login");
        expect(callback_two).toHaveBeenCalledOn(object);
        callback_two.reset();
        view.trigger("notify", "view notify");
        expect(callback_one).toHaveBeenCalledOnce();
        expect(callback_one).toHaveBeenCalledWith("view notify");
        expect(callback_one).toHaveBeenCalledOn(object);
        expect(callback_two).not.toHaveBeenCalled();
        return callback_one.reset();
      });
      return it("Should only remove an individual's instance callback", function() {
        var MiscObj, callback_spy, obj1, obj2, other_obj, _ref;
        callback_spy = sinon.spy();
        MiscObj = (function(_super) {
          __extends(MiscObj, _super);

          function MiscObj() {
            _ref = MiscObj.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          MiscObj.prototype.callback = function() {
            return callback_spy();
          };

          return MiscObj;

        })(Falcon.Object);
        obj1 = new MiscObj;
        obj2 = new MiscObj;
        other_obj = new MiscObj;
        obj1.listenTo(other_obj, "click", obj1.callback);
        obj2.listenTo(other_obj, "click", obj2.callback);
        other_obj.trigger("click");
        expect(callback_spy).toHaveBeenCalledTwice();
        callback_spy.reset();
        obj1.stopListening();
        other_obj.trigger("click");
        return expect(callback_spy).toHaveBeenCalledOnce();
      });
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
      obj = null;
      beforeEach(function() {
        return obj = new Klass;
      });
      it("Should have added the correct default attributes", function() {
        expect(obj['id']).toBeDefined();
        expect(obj['foo']).toBeDefined();
        expect(obj['free']).toBeDefined();
        expect(obj['def_arr']).toBeDefined();
        return expect(obj['clazz']).toBeDefined();
      });
      it("Should have added the correct observable attributes", function() {
        expect(obj['hello']).toBeDefined();
        expect(obj['foo']).toBeDefined();
        expect(obj['test']).toBeDefined();
        expect(obj['_another']).toBeDefined();
        return expect(obj['another']).toBeDefined();
      });
      it("Should have added the correct default values", function() {
        expect(obj.id).toBe(-1);
        expect(obj.foo).not.toBe('bar');
        expect(obj.free).toBe('bird');
        return expect(obj.clazz).toEqual(jasmine.any(Clazz));
      });
      it("Should have the correct values for a default array", function() {
        expect(obj.def_arr).toEqual([1, 2, 3]);
        return expect(obj.def_arr).not.toBe(Klass.prototype.defaults.def_arr);
      });
      it("Should have added the correct observable type", function() {
        expect(ko.isObservable(obj.hello)).toBe(true);
        expect(ko.isObservable(obj.foo)).toBe(true);
        expect(ko.isComputed(obj.test)).toBe(true);
        expect(ko.isObservable(obj._another)).toBe(true);
        return expect(ko.isComputed(obj.another)).toBe(true);
      });
      it("Should have added the correct writeable observable type", function() {
        expect(ko.isWriteableObservable(obj.hello)).toBe(true);
        expect(ko.isWriteableObservable(obj.foo)).toBe(true);
        expect(ko.isWriteableObservable(obj.test)).toBe(false);
        expect(ko.isWriteableObservable(obj._another)).toBe(true);
        return expect(ko.isWriteableObservable(obj.another)).toBe(true);
      });
      it("Should have assigned the correct values to observables", function() {
        expect(ko.utils.unwrapObservable(obj.hello)).toBe("world");
        expect(ko.utils.unwrapObservable(obj.foo)).toBe("baz");
        expect(ko.utils.unwrapObservable(obj.test)).toBe("method");
        expect(ko.utils.unwrapObservable(obj._another)).toBe("good");
        expect(ko.utils.unwrapObservable(obj.another)).toBe("good method");
        obj.another("great");
        return expect(ko.utils.unwrapObservable(obj.another)).toBe("great method");
      });
      it("Should have propogated defaults in the child class", function() {
        expect(obj.clazz.id).toBe('z');
        return expect(obj.clazz.im).toBe('here');
      });
      it("Should have an observable array", function() {
        expect(ko.isObservable(obj.arr)).toBe(true);
        expect(obj.arr()).toEqual(jasmine.any(Array));
        expect(obj.arr().length).toBe(2);
        return expect(obj.arr()).not.toBe(Klass.prototype.observables.arr);
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
      it("Should extend Falcon.Object properly", function() {
        var Klass, custom_spy, my_obj, things_spy;
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
        my_obj = new Klass;
        expect(my_obj).toEqual(jasmine.any(Falcon.Object));
        expect(my_obj).not.toEqual(jasmine.any(Falcon.Model));
        expect(my_obj).not.toEqual(jasmine.any(Falcon.Collection));
        expect(my_obj).not.toEqual(jasmine.any(Falcon.View));
        expect(Klass.prototype.custom).toEqual(jasmine.any(Function));
        expect(Klass.prototype.text).toEqual(jasmine.any(String));
        expect(Klass.things).toEqual(jasmine.any(Function));
        expect(my_obj.custom).toEqual(jasmine.any(Function));
        expect(my_obj.text).toEqual(jasmine.any(String));
        my_obj.custom();
        expect(custom_spy).toHaveBeenCalled();
        expect(custom_spy.firstCall).toHaveBeenCalledOn(my_obj);
        Klass.things();
        expect(things_spy).toHaveBeenCalled();
        return expect(things_spy.firstCall).toHaveBeenCalledOn(Klass);
      });
      it("Should extend Falcon.Model properly", function() {
        var Klass, custom_spy, init_spy, my_obj, things_spy;
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
        my_obj = new Klass;
        expect(my_obj).toEqual(jasmine.any(Falcon.Object));
        expect(my_obj).toEqual(jasmine.any(Falcon.Model));
        expect(my_obj).not.toEqual(jasmine.any(Falcon.Collection));
        expect(my_obj).not.toEqual(jasmine.any(Falcon.View));
        expect(Klass.prototype.initialize).toEqual(jasmine.any(Function));
        expect(Klass.prototype.custom).toEqual(jasmine.any(Function));
        expect(Klass.prototype.text).toEqual(jasmine.any(String));
        expect(Klass.things).toEqual(jasmine.any(Function));
        expect(my_obj.initialize).toEqual(jasmine.any(Function));
        expect(my_obj.custom).toEqual(jasmine.any(Function));
        expect(my_obj.text).toEqual(jasmine.any(String));
        expect(init_spy).toHaveBeenCalled();
        expect(init_spy.firstCall).toHaveBeenCalledOn(my_obj);
        my_obj.custom();
        expect(custom_spy).toHaveBeenCalled();
        expect(custom_spy.firstCall).toHaveBeenCalledOn(my_obj);
        Klass.things();
        expect(things_spy).toHaveBeenCalled();
        return expect(things_spy.firstCall).toHaveBeenCalledOn(Klass);
      });
      it("Should extend Falcon.Collection properly", function() {
        var Klass, custom_spy, init_spy, my_obj, things_spy;
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
        my_obj = new Klass;
        expect(my_obj).toEqual(jasmine.any(Falcon.Object));
        expect(my_obj).not.toEqual(jasmine.any(Falcon.Model));
        expect(my_obj).toEqual(jasmine.any(Falcon.Collection));
        expect(my_obj).not.toEqual(jasmine.any(Falcon.View));
        expect(Klass.prototype.initialize).toEqual(jasmine.any(Function));
        expect(Klass.prototype.custom).toEqual(jasmine.any(Function));
        expect(Klass.prototype.text).toEqual(jasmine.any(String));
        expect(Klass.things).toEqual(jasmine.any(Function));
        expect(my_obj.initialize).toEqual(jasmine.any(Function));
        expect(my_obj.custom).toEqual(jasmine.any(Function));
        expect(my_obj.text).toEqual(jasmine.any(String));
        expect(init_spy).toHaveBeenCalled();
        expect(init_spy.firstCall).toHaveBeenCalledOn(my_obj);
        my_obj.custom();
        expect(custom_spy).toHaveBeenCalled();
        expect(custom_spy.firstCall).toHaveBeenCalledOn(my_obj);
        Klass.things();
        expect(things_spy).toHaveBeenCalled();
        return expect(things_spy.firstCall).toHaveBeenCalledOn(Klass);
      });
      it("Should extend Falcon.View properly", function() {
        var Klass, custom_spy, init_spy, my_obj, things_spy;
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
        my_obj = new Klass;
        expect(my_obj).toEqual(jasmine.any(Falcon.Object));
        expect(my_obj).not.toEqual(jasmine.any(Falcon.Model));
        expect(my_obj).not.toEqual(jasmine.any(Falcon.Collection));
        expect(my_obj).toEqual(jasmine.any(Falcon.View));
        expect(Klass.prototype.initialize).toEqual(jasmine.any(Function));
        expect(Klass.prototype.custom).toEqual(jasmine.any(Function));
        expect(Klass.prototype.text).toEqual(jasmine.any(String));
        expect(Klass.things).toEqual(jasmine.any(Function));
        expect(my_obj.initialize).toEqual(jasmine.any(Function));
        expect(my_obj.custom).toEqual(jasmine.any(Function));
        expect(my_obj.text).toEqual(jasmine.any(String));
        expect(init_spy).toHaveBeenCalled();
        expect(init_spy.firstCall).toHaveBeenCalledOn(my_obj);
        my_obj.custom();
        expect(custom_spy).toHaveBeenCalled();
        expect(custom_spy.firstCall).toHaveBeenCalledOn(my_obj);
        Klass.things();
        expect(things_spy).toHaveBeenCalled();
        return expect(things_spy.firstCall).toHaveBeenCalledOn(Klass);
      });
      return it("Should allow for deep inheritence", function() {
        var ChildKlass, Klass, child_obj, custom_spy, things_spy;
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
        child_obj = new ChildKlass;
        expect(child_obj).toEqual(jasmine.any(Falcon.Object));
        expect(child_obj).toEqual(jasmine.any(Klass));
        expect(child_obj).not.toEqual(jasmine.any(Falcon.Model));
        expect(child_obj).not.toEqual(jasmine.any(Falcon.Collection));
        expect(child_obj).not.toEqual(jasmine.any(Falcon.View));
        expect(ChildKlass.prototype.custom).toEqual(jasmine.any(Function));
        expect(ChildKlass.prototype.text).toEqual(jasmine.any(String));
        expect(ChildKlass.prototype.another).toEqual(jasmine.any(Function));
        expect(ChildKlass.things).toEqual(jasmine.any(Function));
        expect(ChildKlass.foo).toEqual(jasmine.any(String));
        expect(child_obj.custom).toEqual(jasmine.any(Function));
        expect(child_obj.text).toEqual(jasmine.any(String));
        expect(child_obj.another).toEqual(jasmine.any(Function));
        child_obj.custom();
        expect(custom_spy).toHaveBeenCalled();
        expect(custom_spy.firstCall).toHaveBeenCalledOn(child_obj);
        ChildKlass.things();
        expect(things_spy).toHaveBeenCalled();
        return expect(things_spy.firstCall).toHaveBeenCalledOn(ChildKlass);
      });
    });
  });

}).call(this);

(function() {
  describe("Falcon.DataAdapter", function() {
    describe("extend", function() {});
    describe("resolveRequestType", function() {
      var adapter, context, data_object, options;
      adapter = new Falcon.DataAdapter;
      data_object = new Falcon.Model;
      options = {};
      context = null;
      it("Should return GET if type isn't a string", function() {
        expect(adapter.resolveRequestType(data_object, null, options, context)).toBe(Falcon.GET);
        return expect(adapter.resolveRequestType(data_object, 123, options, context)).toBe(Falcon.GET);
      });
      it("Should return GET is type isn't GET, PUT, POST, DELETE", function() {
        return expect(adapter.resolveRequestType(data_object, "HELLO WORLD", options, context)).toBe(Falcon.GET);
      });
      it("Should cast get, put, post, delete (lower case) to their proper forms", function() {
        expect(adapter.resolveRequestType(data_object, "get", options, context)).toBe(Falcon.GET);
        expect(adapter.resolveRequestType(data_object, "put", options, context)).toBe(Falcon.PUT);
        expect(adapter.resolveRequestType(data_object, "post", options, context)).toBe(Falcon.POST);
        return expect(adapter.resolveRequestType(data_object, "delete", options, context)).toBe(Falcon.DELETE);
      });
      return it("Should ignore whitespace", function() {
        expect(adapter.resolveRequestType(data_object, "  GET  ", options, context)).toBe(Falcon.GET);
        expect(adapter.resolveRequestType(data_object, "  PUT  ", options, context)).toBe(Falcon.PUT);
        expect(adapter.resolveRequestType(data_object, "  POST  ", options, context)).toBe(Falcon.POST);
        return expect(adapter.resolveRequestType(data_object, "  DELETE  ", options, context)).toBe(Falcon.DELETE);
      });
    });
    describe("resovleContext", function() {
      var adapter, context, data_object, options, type;
      adapter = new Falcon.DataAdapter;
      data_object = new Falcon.Model({
        id: 1
      });
      type = Falcon.GET;
      options = {
        context: {
          id: 2
        }
      };
      context = {
        id: 3
      };
      it("Should resolve the context properly if given", function() {
        return expect(adapter.resolveContext(data_object, type, options, context)).toBe(context);
      });
      it("Should fallback on the options context if no context is given", function() {
        expect(adapter.resolveContext(data_object, type, options, null)).toBe(options.context);
        return expect(adapter.resolveContext(data_object, type, options)).toBe(options.context);
      });
      return it("Should fall back on the data_object as context if no context or options.context is given", function() {
        expect(adapter.resolveContext(data_object, type, {}, null)).toBe(data_object);
        return expect(adapter.resolveContext(data_object, type, {})).toBe(data_object);
      });
    });
    describe("standardizeOptions", function() {
      var adapter, context, data_object, parent, type;
      adapter = new Falcon.DataAdapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      type = Falcon.GET;
      context = {
        id: 3
      };
      beforeEach(function() {
        spyOn(adapter, 'resolveUrl').and.callThrough();
        return spyOn(adapter, 'serializeData').and.callThrough();
      });
      it("Should present standard options if nothing is passed in", function() {
        var ret;
        ret = adapter.standardizeOptions(data_object, type, null, context);
        expect(ret['id']).not.toBeDefined();
        expect(ret['success']).toEqual(jasmine.any(Function));
        expect(ret['complete']).toEqual(jasmine.any(Function));
        expect(ret['error']).toEqual(jasmine.any(Function));
        expect(ret['parent']).toEqual(data_object.parent);
        expect(ret['url']).toEqual(jasmine.any(String));
        expect(ret['data']).toBeNull();
        expect(ret['attributes']).toBeNull();
        expect(ret['fill_options']).toBeNull();
        expect(adapter.resolveUrl.calls.count()).toBe(1);
        expect(adapter.resolveUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        return expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
      });
      it("Should maintain options that are passed in", function() {
        var attributes, complete, data, error, fill_options, id, options, ret, success, url;
        id = 'hello_world';
        success = (function() {});
        complete = (function() {});
        error = (function() {});
        parent = null;
        attributes = ['id', 'hello'];
        url = 'http://www.google.com';
        data = {
          'hello': 'world'
        };
        attributes = ['id', 'hello'];
        fill_options = {
          'method': 'append'
        };
        options = {
          id: id,
          success: success,
          complete: complete,
          error: error,
          parent: parent,
          attributes: attributes,
          url: url,
          data: data,
          attributes: attributes,
          fill_options: fill_options
        };
        ret = adapter.standardizeOptions(data_object, type, options, context);
        expect(ret['id']).toBe(options.id);
        expect(ret['success']).toBe(options.success);
        expect(ret['complete']).toBe(options.complete);
        expect(ret['error']).toBe(options.error);
        expect(ret['parent']).toBe(options.parent);
        expect(ret['url']).toBe(options.url);
        expect(ret['data']).toBe(options.data);
        expect(ret['attributes']).toBe(options.attributes);
        expect(ret['fill_options']).toBe(options.fill_options);
        expect(adapter.resolveUrl.calls.count()).toBe(1);
        expect(adapter.resolveUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(ret).not.toBe(options);
        return expect(options).toEqual({
          id: id,
          success: success,
          complete: complete,
          error: error,
          parent: parent,
          attributes: attributes,
          url: url,
          data: data,
          attributes: attributes,
          fill_options: fill_options
        });
      });
      it("Should assign a function to the complete attribute of the options", function() {
        var options, ret;
        options = (function() {});
        ret = adapter.standardizeOptions(data_object, type, options, context);
        expect(ret['id']).not.toBeDefined();
        expect(ret['success']).toEqual(jasmine.any(Function));
        expect(ret['complete']).toEqual(options);
        expect(ret['error']).toEqual(jasmine.any(Function));
        expect(ret['parent']).toEqual(data_object.parent);
        expect(ret['attributes']).toBeNull();
        expect(ret['url']).toEqual(jasmine.any(String));
        expect(ret['data']).toBeNull();
        expect(ret['fill_options']).toBeNull();
        expect(adapter.resolveUrl.calls.count()).toBe(1);
        expect(adapter.resolveUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        return expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
      });
      it("Should split a string into an array of attributes", function() {
        var options, ret;
        options = "id,hello_world,title";
        ret = adapter.standardizeOptions(data_object, type, options, context);
        expect(ret['id']).not.toBeDefined();
        expect(ret['success']).toEqual(jasmine.any(Function));
        expect(ret['complete']).toEqual(jasmine.any(Function));
        expect(ret['error']).toEqual(jasmine.any(Function));
        expect(ret['parent']).toEqual(data_object.parent);
        expect(ret['attributes']).toEqual(['id', 'hello_world', 'title']);
        expect(ret['url']).toEqual(jasmine.any(String));
        expect(ret['data']).toBeNull();
        expect(ret['fill_options']).toBeNull();
        expect(adapter.resolveUrl.calls.count()).toBe(1);
        expect(adapter.resolveUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        return expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
      });
      it("Should pass through an array into the attrbutes attribute of the options", function() {
        var options, ret;
        options = ['id', 'hello_world', 'title'];
        ret = adapter.standardizeOptions(data_object, type, options, context);
        expect(ret['id']).not.toBeDefined();
        expect(ret['success']).toEqual(jasmine.any(Function));
        expect(ret['complete']).toEqual(jasmine.any(Function));
        expect(ret['error']).toEqual(jasmine.any(Function));
        expect(ret['parent']).toEqual(data_object.parent);
        expect(ret['attributes']).toEqual(options);
        expect(ret['url']).toEqual(jasmine.any(String));
        expect(ret['data']).toBeNull();
        expect(ret['fill_options']).toBeNull();
        expect(adapter.resolveUrl.calls.count()).toBe(1);
        expect(adapter.resolveUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        return expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
      });
      return it("Should allow for attributes to be an object", function() {
        var attributes, options, ret;
        attributes = {
          'id': true,
          'model_1': {
            'id': true
          }
        };
        options = {
          attributes: attributes
        };
        ret = adapter.standardizeOptions(data_object, type, options, context);
        expect(ret['id']).not.toBeDefined();
        expect(ret['success']).toEqual(jasmine.any(Function));
        expect(ret['complete']).toEqual(jasmine.any(Function));
        expect(ret['error']).toEqual(jasmine.any(Function));
        expect(ret['parent']).toEqual(data_object.parent);
        expect(ret['attributes']).toEqual(attributes);
        expect(ret['url']).toEqual(jasmine.any(String));
        expect(ret['data']).toBeNull();
        expect(ret['fill_options']).toBeNull();
        expect(adapter.resolveUrl.calls.count()).toBe(1);
        expect(adapter.resolveUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(ret).not.toBe(options);
        return expect(options).toEqual({
          attributes: attributes
        });
      });
    });
    describe("resolveUrl", function() {
      var adapter, context, data_object, options;
      adapter = new Falcon.DataAdapter;
      data_object = new Falcon.Model({
        id: 1
      });
      context = {
        id: 3
      };
      options = {
        parent: new Falcon.Model
      };
      beforeEach(function() {
        return spyOn(data_object, 'makeUrl').and.returnValue("http://www.falconjs.com");
      });
      it("Should call the data objects resolveUrl method", function() {
        var ret;
        ret = adapter.resolveUrl(data_object, Falcon.GET, options, context);
        expect(data_object.makeUrl.calls.count()).toBe(1);
        return expect(ret).toBe("http://www.falconjs.com");
      });
      return it("Should use the options' url if one is available", function() {
        var ret;
        options.url = "http://www.google.com";
        ret = adapter.resolveUrl(data_object, Falcon.GET, options, context);
        expect(data_object.makeUrl).not.toHaveBeenCalled();
        return expect(ret).toBe("http://www.google.com");
      });
    });
    describe("makeBaseUrl", function() {
      var adapter, baseApiUrl, context, data_object, options;
      adapter = new Falcon.DataAdapter;
      data_object = new Falcon.Model({
        id: 1,
        endpoint: "a"
      });
      context = data_object;
      options = null;
      baseApiUrl = null;
      beforeEach(function() {
        baseApiUrl = Falcon.baseApiUrl;
        Falcon.baseApiUrl = null;
        return options = {};
      });
      afterEach(function() {
        return Falcon.baseApiUrl = baseApiUrl;
      });
      it("Should generate a base url properly without a parent with GET", function() {
        var ret;
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("/");
      });
      it("Should generate a base url properly without a parent with POST", function() {
        var ret;
        ret = adapter.makeBaseUrl(data_object, Falcon.POST, options, context);
        return expect(ret).toBe("/");
      });
      it("Should generate a base url properly without a parent with PUT", function() {
        var ret;
        ret = adapter.makeBaseUrl(data_object, Falcon.PUT, options, context);
        return expect(ret).toBe("/");
      });
      it("Should generate a base url properly without a parent with DELETE", function() {
        var ret;
        ret = adapter.makeBaseUrl(data_object, Falcon.DELETE, options, context);
        return expect(ret).toBe("/");
      });
      it("Should generate a base url properly with a single parent with GET", function() {
        var ret;
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        });
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("/b/2/");
      });
      it("Should generate a base url properly with a single parent with POST", function() {
        var ret;
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        });
        ret = adapter.makeBaseUrl(data_object, Falcon.POST, options, context);
        return expect(ret).toBe("/b/2/");
      });
      it("Should generate a base url properly with a single parent with PUT", function() {
        var ret;
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        });
        ret = adapter.makeBaseUrl(data_object, Falcon.PUT, options, context);
        return expect(ret).toBe("/b/2/");
      });
      it("Should generate a base url properly with a single parent with DELETE", function() {
        var ret;
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        });
        ret = adapter.makeBaseUrl(data_object, Falcon.DELETE, options, context);
        return expect(ret).toBe("/b/2/");
      });
      it("Should generate a url properly with more than one parent with GET", function() {
        var parent_model, ret;
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("/c/3/b/2/");
      });
      it("Should generate a url properly with more than one parent with POSt", function() {
        var parent_model, ret;
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, "POSt", options, context);
        return expect(ret).toBe("/c/3/b/2/");
      });
      it("Should generate a url properly with more than one parent with PUT", function() {
        var parent_model, ret;
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.PUT, options, context);
        return expect(ret).toBe("/c/3/b/2/");
      });
      it("Should generate a url properly with more than one parent with DELETE", function() {
        var parent_model, ret;
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.DELETE, options, context);
        return expect(ret).toBe("/c/3/b/2/");
      });
      it("Should generate a url properly using the parent from within options with GET", function() {
        var parent_model, ret;
        options.parent = new Falcon.Model({
          id: 4,
          endpoint: "d"
        });
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("/d/4/");
      });
      it("Should generate a url properly using the parent from within options with POST", function() {
        var parent_model, ret;
        options.parent = new Falcon.Model({
          id: 4,
          endpoint: "d"
        });
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.POST, options, context);
        return expect(ret).toBe("/d/4/");
      });
      it("Should generate a url properly using the parent from within options with PUT", function() {
        var parent_model, ret;
        options.parent = new Falcon.Model({
          id: 4,
          endpoint: "d"
        });
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.PUT, options, context);
        return expect(ret).toBe("/d/4/");
      });
      it("Should generate a url properly using the parent from within options with DELETE", function() {
        var parent_model, ret;
        options.parent = new Falcon.Model({
          id: 4,
          endpoint: "d"
        });
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.DELETE, options, context);
        return expect(ret).toBe("/d/4/");
      });
      it("Should include the base api url with regular parent", function() {
        var parent_model, ret;
        Falcon.baseApiUrl = "http://www.falconjs.com";
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("http://www.falconjs.com/c/3/b/2/");
      });
      it("Should include the base api url with regular parent and a trailing slash", function() {
        var parent_model, ret;
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("http://www.falconjs.com/c/3/b/2/");
      });
      it("Should include the base api url with an options parent", function() {
        var parent_model, ret;
        Falcon.baseApiUrl = "http://www.falconjs.com";
        options.parent = new Falcon.Model({
          id: 4,
          endpoint: "d"
        });
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("http://www.falconjs.com/d/4/");
      });
      it("Should include the base api url with an options parent and a trailing slash", function() {
        var parent_model, ret;
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        options.parent = new Falcon.Model({
          id: 4,
          endpoint: "d"
        });
        parent_model = new Falcon.Model({
          id: 3,
          endpoint: "c"
        });
        data_object.parent = new Falcon.Model({
          id: 2,
          endpoint: "b"
        }, parent_model);
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("http://www.falconjs.com/d/4/");
      });
      it("Should include the base api url without a parent", function() {
        var ret;
        Falcon.baseApiUrl = "http://www.falconjs.com";
        data_object.parent = null;
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("http://www.falconjs.com/");
      });
      it("Should include the base api url without a parent and a trailing slash", function() {
        var ret;
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        data_object.parent = null;
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("http://www.falconjs.com/");
      });
      it("Should include the base api url with an empty base url", function() {
        var ret;
        Falcon.baseApiUrl = "";
        data_object.parent = null;
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("/");
      });
      it("Should include the base api url with the root basse url", function() {
        var ret;
        Falcon.baseApiUrl = "/";
        data_object.parent = null;
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("/");
      });
      return it("Should include the base api url with the root base url and a trailing slash", function() {
        var ret;
        Falcon.baseApiUrl = "//";
        data_object.parent = null;
        ret = adapter.makeBaseUrl(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("/");
      });
    });
    describe("makeUrlComponents", function() {
      var adapter, base_api_url, context, data_object, options;
      adapter = null;
      base_api_url = null;
      data_object = null;
      options = null;
      context = null;
      beforeEach(function() {
        base_api_url = Falcon.baseApiUrl;
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        adapter = new Falcon.DataAdapter;
        spyOn(adapter, "resolveRequestType").and.callThrough();
        spyOn(adapter, "makeBaseUrl").and.callThrough();
        data_object = new Falcon.Model({
          id: 1,
          endpoint: "a"
        });
        options = {};
        return context = data_object;
      });
      afterEach(function() {
        return Falcon.baseApiUrl = base_api_url;
      });
      it("Should return the url components properly with GET", function() {
        var ret;
        ret = adapter.makeUrlComponents(data_object, Falcon.GET, options, context);
        expect(adapter.resolveRequestType.calls.count()).toBe(1);
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, Falcon.GET, options, context);
        expect(adapter.makeBaseUrl.calls.count()).toBe(1);
        expect(adapter.makeBaseUrl).toHaveBeenCalledWith(data_object, Falcon.GET, options, context);
        return expect(ret).toEqual({
          'base_url': "http://www.falconjs.com/",
          'endpoint': "a",
          'id': "1",
          'extension': ""
        });
      });
      it("Should return the url components properly with POST", function() {
        var ret;
        ret = adapter.makeUrlComponents(data_object, Falcon.POST, options, context);
        expect(adapter.resolveRequestType.calls.count()).toBe(1);
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, Falcon.POST, options, context);
        expect(adapter.makeBaseUrl.calls.count()).toBe(1);
        expect(adapter.makeBaseUrl).toHaveBeenCalledWith(data_object, Falcon.POST, options, context);
        return expect(ret).toEqual({
          'base_url': "http://www.falconjs.com/",
          'endpoint': "a",
          'id': "1",
          'extension': ""
        });
      });
      it("Should return the url components properly with PUT", function() {
        var ret;
        ret = adapter.makeUrlComponents(data_object, Falcon.PUT, options, context);
        expect(adapter.resolveRequestType.calls.count()).toBe(1);
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, Falcon.PUT, options, context);
        expect(adapter.makeBaseUrl.calls.count()).toBe(1);
        expect(adapter.makeBaseUrl).toHaveBeenCalledWith(data_object, Falcon.PUT, options, context);
        return expect(ret).toEqual({
          'base_url': "http://www.falconjs.com/",
          'endpoint': "a",
          'id': "1",
          'extension': ""
        });
      });
      it("Should return the url components properly with DELETE", function() {
        var ret;
        ret = adapter.makeUrlComponents(data_object, Falcon.DELETE, options, context);
        expect(adapter.resolveRequestType.calls.count()).toBe(1);
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        expect(adapter.makeBaseUrl.calls.count()).toBe(1);
        expect(adapter.makeBaseUrl).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        return expect(ret).toEqual({
          'base_url': "http://www.falconjs.com/",
          'endpoint': "a",
          'id': "1",
          'extension': ""
        });
      });
      it("Should get the correct endpoint wiht a url method definition on the data object", function() {
        var ret;
        data_object.endpoint = function() {
          return "b";
        };
        ret = adapter.makeUrlComponents(data_object, Falcon.DELETE, options, context);
        expect(adapter.resolveRequestType.calls.count()).toBe(1);
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        expect(adapter.makeBaseUrl.calls.count()).toBe(1);
        expect(adapter.makeBaseUrl).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        return expect(ret).toEqual({
          'base_url': "http://www.falconjs.com/",
          'endpoint': "b",
          'id': "1",
          'extension': ""
        });
      });
      it("Should remove slashes from the endpoint", function() {
        var ret;
        data_object.endpoint = "/c//";
        ret = adapter.makeUrlComponents(data_object, Falcon.DELETE, options, context);
        expect(adapter.resolveRequestType.calls.count()).toBe(1);
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        expect(adapter.makeBaseUrl.calls.count()).toBe(1);
        expect(adapter.makeBaseUrl).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        return expect(ret).toEqual({
          'base_url': "http://www.falconjs.com/",
          'endpoint': "c",
          'id': "1",
          'extension': ""
        });
      });
      it("Should be able to handle extensions properly", function() {
        var ret;
        data_object.endpoint = "d.json";
        ret = adapter.makeUrlComponents(data_object, Falcon.DELETE, options, context);
        expect(adapter.resolveRequestType.calls.count()).toBe(1);
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        expect(adapter.makeBaseUrl.calls.count()).toBe(1);
        expect(adapter.makeBaseUrl).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        return expect(ret).toEqual({
          'base_url': "http://www.falconjs.com/",
          'endpoint': "d",
          'id': "1",
          'extension': ".json"
        });
      });
      it("Should be able to handle extensions properly only after the last slash", function() {
        var ret;
        data_object.endpoint = "d.json/hello";
        ret = adapter.makeUrlComponents(data_object, Falcon.DELETE, options, context);
        expect(adapter.resolveRequestType.calls.count()).toBe(1);
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        expect(adapter.makeBaseUrl.calls.count()).toBe(1);
        expect(adapter.makeBaseUrl).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        return expect(ret).toEqual({
          'base_url': "http://www.falconjs.com/",
          'endpoint': "d.json/hello",
          'id': "1",
          'extension': ""
        });
      });
      it("Should handle collections properly", function() {
        var CollectionE, ModelE, ret;
        ModelE = Falcon.Model.extend({
          endpoint: 'e'
        });
        CollectionE = Falcon.Collection.extend({
          model: ModelE
        });
        data_object = new CollectionE;
        ret = adapter.makeUrlComponents(data_object, Falcon.DELETE, options, context);
        expect(adapter.resolveRequestType.calls.count()).toBe(1);
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        expect(adapter.makeBaseUrl.calls.count()).toBe(1);
        expect(adapter.makeBaseUrl).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        return expect(ret).toEqual({
          'base_url': "http://www.falconjs.com/",
          'endpoint': "e",
          'id': null,
          'extension': ""
        });
      });
      return it("Should handle collections with extensions properly", function() {
        var CollectionE, ModelE, ret;
        ModelE = Falcon.Model.extend({
          endpoint: 'e.json'
        });
        CollectionE = Falcon.Collection.extend({
          model: ModelE
        });
        data_object = new CollectionE;
        ret = adapter.makeUrlComponents(data_object, Falcon.DELETE, options, context);
        expect(adapter.resolveRequestType.calls.count()).toBe(1);
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        expect(adapter.makeBaseUrl.calls.count()).toBe(1);
        expect(adapter.makeBaseUrl).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        return expect(ret).toEqual({
          'base_url': "http://www.falconjs.com/",
          'endpoint': "e",
          'id': null,
          'extension': ".json"
        });
      });
    });
    describe("makeUrl", function() {
      var adapter, base_api_url, context, data_object, options, parent_object;
      adapter = null;
      base_api_url = null;
      data_object = null;
      parent_object = null;
      options = null;
      context = null;
      beforeEach(function() {
        base_api_url = Falcon.baseApiUrl;
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        parent_object = new Falcon.Model({
          id: 2,
          endpoint: "b"
        });
        data_object = new Falcon.Model({
          id: 1,
          endpoint: "a.json"
        }, parent_object);
        options = {};
        context = data_object;
        adapter = new Falcon.DataAdapter;
        return spyOn(adapter, "makeUrlComponents").and.callThrough();
      });
      afterEach(function() {
        return Falcon.baseApiUrl = base_api_url;
      });
      it("Should return the correct url on GET", function() {
        var ret;
        ret = adapter.makeUrl(data_object, Falcon.GET, options, context);
        expect(adapter.makeUrlComponents.calls.count()).toBe(1);
        expect(adapter.makeUrlComponents).toHaveBeenCalledWith(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("http://www.falconjs.com/b/2/a/1.json");
      });
      it("Should return the correct url on POST", function() {
        var ret;
        ret = adapter.makeUrl(data_object, Falcon.POST, options, context);
        expect(adapter.makeUrlComponents.calls.count()).toBe(1);
        expect(adapter.makeUrlComponents).toHaveBeenCalledWith(data_object, Falcon.POST, options, context);
        return expect(ret).toBe("http://www.falconjs.com/b/2/a.json");
      });
      it("Should return the correct url on PUT", function() {
        var ret;
        ret = adapter.makeUrl(data_object, Falcon.PUT, options, context);
        expect(adapter.makeUrlComponents.calls.count()).toBe(1);
        expect(adapter.makeUrlComponents).toHaveBeenCalledWith(data_object, Falcon.PUT, options, context);
        return expect(ret).toBe("http://www.falconjs.com/b/2/a/1.json");
      });
      it("Should return the correct url on DELETE", function() {
        var ret;
        ret = adapter.makeUrl(data_object, Falcon.DELETE, options, context);
        expect(adapter.makeUrlComponents.calls.count()).toBe(1);
        expect(adapter.makeUrlComponents).toHaveBeenCalledWith(data_object, Falcon.DELETE, options, context);
        return expect(ret).toBe("http://www.falconjs.com/b/2/a/1.json");
      });
      return it("Should return the correct url on GET with a collection", function() {
        var CollectionE, ModelE, ret;
        ModelE = Falcon.Model.extend({
          endpoint: 'e.json'
        });
        CollectionE = Falcon.Collection.extend({
          model: ModelE
        });
        data_object = new CollectionE;
        ret = adapter.makeUrl(data_object, Falcon.GET, options, context);
        expect(adapter.makeUrlComponents.calls.count()).toBe(1);
        expect(adapter.makeUrlComponents).toHaveBeenCalledWith(data_object, Falcon.GET, options, context);
        return expect(ret).toBe("http://www.falconjs.com/e.json");
      });
    });
    describe("serializeData", function() {
      var adapter, attributes, context, data_object, options, parent, serialized_data;
      adapter = new Falcon.DataAdapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      context = {
        id: 3
      };
      options = {
        data: {
          id: 4
        }
      };
      attributes = ["id", "hello"];
      serialized_data = {
        'hello': 'world'
      };
      beforeEach(function() {
        return spyOn(data_object, 'serialize').and.returnValue(serialized_data);
      });
      it("Should use the data attribute of options if one is present", function() {
        expect(adapter.serializeData(data_object, Falcon.GET, options, context)).toBe(options.data);
        expect(adapter.serializeData(data_object, Falcon.POST, options, context)).toBe(options.data);
        expect(adapter.serializeData(data_object, Falcon.PUT, options, context)).toBe(options.data);
        expect(adapter.serializeData(data_object, Falcon.DELETE, options, context)).toBe(options.data);
        return expect(data_object.serialize).not.toHaveBeenCalled();
      });
      it("Should call the serialize method on the data object if the request type is POST", function() {
        var ret;
        ret = adapter.serializeData(data_object, Falcon.POST, {
          attributes: attributes
        }, context);
        expect(data_object.serialize.calls.count()).toBe(1);
        expect(data_object.serialize).toHaveBeenCalledWith(attributes);
        return expect(ret).toBe(serialized_data);
      });
      it("Should call the serialize method on the data object if the request type is PUT", function() {
        var ret;
        ret = adapter.serializeData(data_object, Falcon.PUT, {
          attributes: attributes
        }, context);
        expect(data_object.serialize.calls.count()).toBe(1);
        expect(data_object.serialize).toHaveBeenCalledWith(attributes);
        return expect(ret).toBe(serialized_data);
      });
      return it("Should not call serialzie on GET or DELETE", function() {
        var ret;
        ret = adapter.serializeData(data_object, Falcon.GET, {
          attributes: attributes
        }, context);
        ret = adapter.serializeData(data_object, Falcon.DELETE, {
          attributes: attributes
        }, context);
        expect(data_object.serialize).not.toHaveBeenCalled();
        return expect(ret).not.toBeDefined();
      });
    });
    describe("parseRawResponseData", function() {
      var adapter, context, data_object, options, parent, response_args, type;
      adapter = new Falcon.DataAdapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      type = Falcon.GET;
      context = {
        id: 3
      };
      options = {};
      response_args = {
        id: 5
      };
      return it("Should simply return the response arguments for the base adapter class", function() {
        return expect(adapter.parseRawResponseData(data_object, type, options, context, response_args)).toBe(response_args);
      });
    });
    describe("successResponseHandler", function() {
      var adapter, complete, context, data_object, error, fill_options, options, parent, parsed_data, raw_response_data, response_args, success, type;
      adapter = new Falcon.DataAdapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      context = new Falcon.Model({
        id: 2
      }, parent);
      type = Falcon.GET;
      success = sinon.spy();
      error = sinon.spy();
      complete = sinon.spy();
      fill_options = {
        'method': 'merge'
      };
      options = {
        success: success,
        error: error,
        complete: complete,
        fill_options: fill_options
      };
      parsed_data = {
        id: 5
      };
      raw_response_data = {
        model: parsed_data
      };
      response_args = {
        data: JSON.stringify(raw_response_data)
      };
      beforeEach(function() {
        spyOn(adapter, 'parseRawResponseData').and.returnValue(raw_response_data);
        spyOn(data_object, 'parse').and.returnValue(parsed_data);
        spyOn(data_object, 'fill');
        spyOn(data_object, 'trigger');
        success.reset();
        error.reset();
        return complete.reset();
      });
      it("Should call the correct methods on GET", function() {
        type = Falcon.GET;
        adapter.successResponseHandler(data_object, type, options, context, response_args);
        expect(adapter.parseRawResponseData.calls.count()).toBe(1);
        expect(adapter.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, response_args);
        expect(data_object.parse.calls.count()).toBe(1);
        expect(data_object.parse).toHaveBeenCalledWith(raw_response_data, options);
        expect(data_object.fill.calls.count()).toBe(1);
        expect(data_object.fill).toHaveBeenCalledWith(parsed_data, options.fill_options);
        expect(data_object.trigger.calls.count()).toBe(1);
        expect(data_object.trigger).toHaveBeenCalledWith("fetch", parsed_data);
        expect(success.callCount).toBe(1);
        expect(success).toHaveBeenCalledWith(data_object, raw_response_data, options, response_args);
        expect(success).toHaveBeenCalledOn(context);
        expect(error).not.toHaveBeenCalled();
        return expect(complete).not.toHaveBeenCalled();
      });
      it("Should call the correct methods on POST", function() {
        type = Falcon.POST;
        adapter.successResponseHandler(data_object, type, options, context, response_args);
        expect(adapter.parseRawResponseData.calls.count()).toBe(1);
        expect(adapter.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, response_args);
        expect(data_object.parse.calls.count()).toBe(1);
        expect(data_object.parse).toHaveBeenCalledWith(raw_response_data, options);
        expect(data_object.fill.calls.count()).toBe(1);
        expect(data_object.fill).toHaveBeenCalledWith(parsed_data, options.fill_options);
        expect(data_object.trigger.calls.count()).toBe(1);
        expect(data_object.trigger).toHaveBeenCalledWith("create", parsed_data);
        expect(success.callCount).toBe(1);
        expect(success).toHaveBeenCalledWith(data_object, raw_response_data, options, response_args);
        expect(success).toHaveBeenCalledOn(context);
        expect(error).not.toHaveBeenCalled();
        return expect(complete).not.toHaveBeenCalled();
      });
      it("Should call the correct methods on PUT", function() {
        type = Falcon.PUT;
        adapter.successResponseHandler(data_object, type, options, context, response_args);
        expect(adapter.parseRawResponseData.calls.count()).toBe(1);
        expect(adapter.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, response_args);
        expect(data_object.parse.calls.count()).toBe(1);
        expect(data_object.parse).toHaveBeenCalledWith(raw_response_data, options);
        expect(data_object.fill.calls.count()).toBe(1);
        expect(data_object.fill).toHaveBeenCalledWith(parsed_data, options.fill_options);
        expect(data_object.trigger.calls.count()).toBe(1);
        expect(data_object.trigger).toHaveBeenCalledWith("save", parsed_data);
        expect(success.callCount).toBe(1);
        expect(success).toHaveBeenCalledWith(data_object, raw_response_data, options, response_args);
        expect(success).toHaveBeenCalledOn(context);
        expect(error).not.toHaveBeenCalled();
        return expect(complete).not.toHaveBeenCalled();
      });
      return it("Should call the correct methods on DELETE", function() {
        type = Falcon.DELETE;
        adapter.successResponseHandler(data_object, type, options, context, response_args);
        expect(adapter.parseRawResponseData.calls.count()).toBe(1);
        expect(adapter.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, response_args);
        expect(data_object.parse.calls.count()).toBe(1);
        expect(data_object.parse).toHaveBeenCalledWith(raw_response_data, options);
        expect(data_object.fill.calls.count()).toBe(1);
        expect(data_object.fill).toHaveBeenCalledWith(parsed_data, options.fill_options);
        expect(data_object.trigger.calls.count()).toBe(1);
        expect(data_object.trigger).toHaveBeenCalledWith("destroy", parsed_data);
        expect(success.callCount).toBe(1);
        expect(success).toHaveBeenCalledWith(data_object, raw_response_data, options, response_args);
        expect(success).toHaveBeenCalledOn(context);
        expect(error).not.toHaveBeenCalled();
        return expect(complete).not.toHaveBeenCalled();
      });
    });
    describe("errorResponseHandler", function() {
      var adapter, complete, context, data_object, error, options, parent, parsed_data, raw_response_data, response_args, success, type;
      adapter = new Falcon.DataAdapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      context = new Falcon.Model({
        id: 2
      }, parent);
      type = Falcon.GET;
      success = sinon.spy();
      error = sinon.spy();
      complete = sinon.spy();
      options = {
        success: success,
        error: error,
        complete: complete
      };
      parsed_data = {
        id: 5
      };
      raw_response_data = {
        model: parsed_data
      };
      response_args = {
        data: JSON.stringify(raw_response_data)
      };
      beforeEach(function() {
        spyOn(adapter, 'parseRawResponseData').and.returnValue(raw_response_data);
        success.reset();
        error.reset();
        return complete.reset();
      });
      return it("Should call the error method correctly", function() {
        adapter.errorResponseHandler(data_object, type, options, context, response_args);
        expect(adapter.parseRawResponseData.calls.count()).toBe(1);
        expect(adapter.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, response_args);
        expect(error.callCount).toBe(1);
        expect(error).toHaveBeenCalledWith(data_object, raw_response_data, options, response_args);
        expect(error).toHaveBeenCalledOn(context);
        expect(success).not.toHaveBeenCalled();
        return expect(complete).not.toHaveBeenCalled();
      });
    });
    describe("completeResponseHandler", function() {
      var adapter, complete, context, data_object, error, options, parent, parsed_data, raw_response_data, response_args, success, type;
      adapter = new Falcon.DataAdapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      context = new Falcon.Model({
        id: 2
      }, parent);
      type = Falcon.GET;
      success = sinon.spy();
      error = sinon.spy();
      complete = sinon.spy();
      options = {
        success: success,
        error: error,
        complete: complete
      };
      parsed_data = {
        id: 5
      };
      raw_response_data = {
        model: parsed_data
      };
      response_args = {
        data: JSON.stringify(raw_response_data)
      };
      beforeEach(function() {
        spyOn(adapter, 'parseRawResponseData').and.returnValue(raw_response_data);
        success.reset();
        error.reset();
        return complete.reset();
      });
      return it("Should call the complete method correctly", function() {
        adapter.completeResponseHandler(data_object, type, options, context, response_args);
        expect(adapter.parseRawResponseData.calls.count()).toBe(1);
        expect(adapter.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, response_args);
        expect(complete.callCount).toBe(1);
        expect(complete).toHaveBeenCalledWith(data_object, raw_response_data, options, response_args);
        expect(complete).toHaveBeenCalledOn(context);
        expect(success).not.toHaveBeenCalled();
        return expect(error).not.toHaveBeenCalled();
      });
    });
    return describe("sync", function() {
      var adapter, context, data_object, options, parent, type;
      adapter = new Falcon.DataAdapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      context = new Falcon.Model({
        id: 2
      }, parent);
      type = Falcon.GET;
      options = {};
      beforeEach(function() {
        sinonSpyOn(adapter, 'resolveRequestType');
        sinonSpyOn(adapter, 'standardizeOptions');
        sinonSpyOn(adapter, 'resolveContext');
        return sinonSpyOn(data_object, 'validate');
      });
      it("Should throw if a data object isn't passed in", function() {
        expect(function() {
          return adapter.sync();
        }).toThrow();
        expect(function() {
          return adapter.sync(123);
        }).toThrow();
        expect(function() {
          return adapter.sync(new Falcon.View);
        }).toThrow();
        expect(adapter.resolveRequestType).not.toHaveBeenCalled();
        expect(adapter.standardizeOptions).not.toHaveBeenCalled();
        expect(adapter.resolveContext).not.toHaveBeenCalled();
        return expect(data_object.validate).not.toHaveBeenCalled();
      });
      it("Should return properly on GET", function() {
        var ret;
        type = Falcon.GET;
        ret = adapter.sync(data_object, type, options, context);
        expect(adapter.resolveRequestType).toHaveBeenCalledOnce();
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledOnce();
        expect(adapter.standardizeOptions).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledAfter(adapter.resolveRequestType);
        expect(adapter.resolveContext).toHaveBeenCalledOnce();
        expect(adapter.resolveContext).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.resolveContext).toHaveBeenCalledAfter(adapter.standardizeOptions);
        expect(data_object.validate).not.toHaveBeenCalled();
        return expect(ret).toEqual({
          data_object: data_object,
          type: Falcon.GET,
          options: jasmine.any(Object),
          context: context,
          is_valid: true
        });
      });
      it("Should return properly on POST", function() {
        var ret;
        type = Falcon.POST;
        ret = adapter.sync(data_object, type, options, context);
        expect(adapter.resolveRequestType).toHaveBeenCalledOnce();
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledOnce();
        expect(adapter.standardizeOptions).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledAfter(adapter.resolveRequestType);
        expect(adapter.resolveContext).toHaveBeenCalledOnce();
        expect(adapter.resolveContext).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.resolveContext).toHaveBeenCalledAfter(adapter.standardizeOptions);
        expect(data_object.validate).toHaveBeenCalledOnce();
        expect(data_object.validate).toHaveBeenCalledWith(jasmine.any(Object));
        expect(data_object.validate).toHaveBeenCalledAfter(adapter.resolveContext);
        return expect(ret).toEqual({
          data_object: data_object,
          type: Falcon.POST,
          options: jasmine.any(Object),
          context: context,
          is_valid: true
        });
      });
      it("Should return properly on PUT", function() {
        var ret;
        type = Falcon.PUT;
        ret = adapter.sync(data_object, type, options, context);
        expect(adapter.resolveRequestType).toHaveBeenCalledOnce();
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledOnce();
        expect(adapter.standardizeOptions).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledAfter(adapter.resolveRequestType);
        expect(adapter.resolveContext).toHaveBeenCalledOnce();
        expect(adapter.resolveContext).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.resolveContext).toHaveBeenCalledAfter(adapter.standardizeOptions);
        expect(data_object.validate).toHaveBeenCalledOnce();
        expect(data_object.validate).toHaveBeenCalledWith(jasmine.any(Object));
        expect(data_object.validate).toHaveBeenCalledAfter(adapter.resolveContext);
        return expect(ret).toEqual({
          data_object: data_object,
          type: Falcon.PUT,
          options: jasmine.any(Object),
          context: context,
          is_valid: true
        });
      });
      it("Should return properly on DELETE", function() {
        var ret;
        type = Falcon.DELETE;
        ret = adapter.sync(data_object, type, options, context);
        expect(adapter.resolveRequestType).toHaveBeenCalledOnce();
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledOnce();
        expect(adapter.standardizeOptions).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledAfter(adapter.resolveRequestType);
        expect(adapter.resolveContext).toHaveBeenCalledOnce();
        expect(adapter.resolveContext).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.resolveContext).toHaveBeenCalledAfter(adapter.standardizeOptions);
        expect(data_object.validate).not.toHaveBeenCalled();
        return expect(ret).toEqual({
          data_object: data_object,
          type: Falcon.DELETE,
          options: jasmine.any(Object),
          context: context,
          is_valid: true
        });
      });
      it("Should return properly with a failed POST validation", function() {
        var ret;
        type = Falcon.POST;
        data_object.validate = sinon.spy(function() {
          return false;
        });
        ret = adapter.sync(data_object, type, options, context);
        expect(adapter.resolveRequestType).toHaveBeenCalledOnce();
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledOnce();
        expect(adapter.standardizeOptions).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledAfter(adapter.resolveRequestType);
        expect(adapter.resolveContext).toHaveBeenCalledOnce();
        expect(adapter.resolveContext).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.resolveContext).toHaveBeenCalledAfter(adapter.standardizeOptions);
        expect(data_object.validate).toHaveBeenCalledOnce();
        expect(data_object.validate).toHaveBeenCalledWith(jasmine.any(Object));
        expect(data_object.validate).toHaveBeenCalledAfter(adapter.resolveContext);
        return expect(ret).toEqual({
          data_object: data_object,
          type: Falcon.POST,
          options: jasmine.any(Object),
          context: context,
          is_valid: false
        });
      });
      it("Should return properly with a failed PUT validation", function() {
        var ret;
        type = Falcon.PUT;
        data_object.validate = sinon.spy(function() {
          return false;
        });
        ret = adapter.sync(data_object, type, options, context);
        expect(adapter.resolveRequestType).toHaveBeenCalledOnce();
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledOnce();
        expect(adapter.standardizeOptions).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledAfter(adapter.resolveRequestType);
        expect(adapter.resolveContext).toHaveBeenCalledOnce();
        expect(adapter.resolveContext).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.resolveContext).toHaveBeenCalledAfter(adapter.standardizeOptions);
        expect(data_object.validate).toHaveBeenCalledOnce();
        expect(data_object.validate).toHaveBeenCalledWith(jasmine.any(Object));
        expect(data_object.validate).toHaveBeenCalledAfter(adapter.resolveContext);
        return expect(ret).toEqual({
          data_object: data_object,
          type: Falcon.PUT,
          options: jasmine.any(Object),
          context: context,
          is_valid: false
        });
      });
      return it("Should not call validate on a collection", function() {
        var ret;
        type = Falcon.POST;
        data_object = new Falcon.Collection;
        data_object.validate = sinon.spy(function() {
          return false;
        });
        ret = adapter.sync(data_object, type, options, context);
        expect(adapter.resolveRequestType).toHaveBeenCalledOnce();
        expect(adapter.resolveRequestType).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledOnce();
        expect(adapter.standardizeOptions).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.standardizeOptions).toHaveBeenCalledAfter(adapter.resolveRequestType);
        expect(adapter.resolveContext).toHaveBeenCalledOnce();
        expect(adapter.resolveContext).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.resolveContext).toHaveBeenCalledAfter(adapter.standardizeOptions);
        expect(data_object.validate).not.toHaveBeenCalled();
        return expect(ret).toEqual({
          data_object: data_object,
          type: Falcon.POST,
          options: jasmine.any(Object),
          context: context,
          is_valid: true
        });
      });
    });
  });

}).call(this);

(function() {
  xdescribe("Falcon.TemplateAdapter", function() {
    describe("resolveTemplate", function() {
      var adapter, callback, elm, elm_id, template, uri;
      adapter = new Falcon.TemplateAdapter;
      elm_id = "my-template";
      uri = "#" + elm_id;
      callback = null;
      template = "Hello World";
      elm = null;
      beforeEach(function() {
        callback = jasmine.createSpy();
        spyOn(document, 'getElementById').and.callThrough();
        elm = document.createElement("div");
        elm.setAttribute("id", elm_id);
        elm.innerHTML = template;
        return document.body.appendChild(elm);
      });
      afterEach(function() {
        return document.body.removeChild(elm);
      });
      it("Should throw if an invalid uri is given", function() {
        expect(function() {
          return adapter.resolveTemplate();
        }).toThrow();
        return expect(function() {
          return adapter.resolveTemplate(123);
        }).toThrow();
      });
      it("Should throw if an invalid callback is given", function() {
        expect(function() {
          return adapter.resolveTemplate(uri);
        }).toThrow();
        return expect(function() {
          return adapter.resolveTemplate(uri, 123);
        }).toThrow();
      });
      it("Should retrieve the element and assign the inner html", function() {
        var ret;
        ret = adapter.resolveTemplate(uri, callback);
        expect(document.getElementById.calls.count()).toBe(1);
        expect(document.getElementById).toHaveBeenCalledWith("my-template");
        expect(callback.calls.count()).toBe(1);
        expect(callback).toHaveBeenCalledWith(template);
        return expect(ret).toBe(adapter);
      });
      return it("Should assign an empty template to an unfound identifier", function() {
        var ret;
        ret = adapter.resolveTemplate("#the_wrong_template_id", callback);
        expect(document.getElementById.calls.count()).toBe(1);
        expect(document.getElementById).toHaveBeenCalledWith("the_wrong_template_id");
        expect(callback.calls.count()).toBe(1);
        expect(callback).toHaveBeenCalledWith("");
        return expect(ret).toBe(adapter);
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
        templates = document.getElementsByTagName("template");
        expect(templates.length).toBe(2);
        ret = Falcon.View.cacheTemplates();
        templates = document.getElementsByTagName("template");
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
        templates = document.getElementsByTagName("template");
        expect(templates.length).toBe(0);
        ret = Falcon.View.cacheTemplates();
        templates = document.getElementsByTagName("template");
        expect(templates.length).toBe(0);
        return expect(ret).toBe(Falcon.View);
      });
    });
    return describe("makeUrl", function() {
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
      return it("Should return an empty string if no url is defined", function() {
        expect(new ViewG().makeUrl()).toEqual("");
        Falcon.baseTemplateUrl = "http://www.falconjs.com/";
        return expect(new ViewG().makeUrl()).toEqual("");
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
    describe("initialize", function() {
      var ModelA, ModelB, _ref, _ref1;
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
      beforeEach(function() {
        sinonSpyOn(ModelA.prototype, 'initialize');
        return sinonSpyOn(ModelA.prototype, 'fill');
      });
      it("Should call initialize on construction", function() {
        var model;
        model = new ModelA;
        return expect(ModelA.prototype.initialize).toHaveBeenCalledOnce();
      });
      it("Shoudl allow for a parent model", function() {
        var modelA, modelB;
        modelA = new ModelA(modelB = new ModelB);
        expect(ModelA.prototype.initialize).toHaveBeenCalledOnce();
        expect(ModelA.prototype.fill).not.toHaveBeenCalled();
        return expect(modelA.parent).toBe(modelB);
      });
      it("Should allow for input data", function() {
        var data, modelA;
        modelA = new ModelA(data = {
          "hello": "world"
        });
        expect(ModelA.prototype.initialize).toHaveBeenCalledOnce();
        expect(ModelA.prototype.initialize).toHaveBeenCalledWith(data);
        expect(ModelA.prototype.fill).toHaveBeenCalledOnce();
        expect(ModelA.prototype.fill).toHaveBeenCalledWith(data);
        return expect(modelA.parent).not.toBeDefined();
      });
      it("Should allow for input data and a parent model", function() {
        var data, modelA, modelB;
        modelA = new ModelA(data = {
          "hello": "world"
        }, modelB = new ModelB);
        expect(ModelA.prototype.initialize).toHaveBeenCalledOnce();
        expect(ModelA.prototype.initialize).toHaveBeenCalledWith(data);
        expect(ModelA.prototype.fill).toHaveBeenCalledOnce();
        expect(ModelA.prototype.fill).toHaveBeenCalledWith(data);
        return expect(modelA.parent).toBe(modelB);
      });
      it("Should allow for the data and parent to be switched", function() {
        var data, modelA, modelB;
        modelA = new ModelA(modelB = new ModelB, data = {
          "hello": "world"
        });
        expect(ModelA.prototype.initialize).toHaveBeenCalledOnce();
        expect(ModelA.prototype.initialize).toHaveBeenCalledWith(data);
        expect(ModelA.prototype.fill).toHaveBeenCalledOnce();
        expect(ModelA.prototype.fill).toHaveBeenCalledWith(data);
        return expect(modelA.parent).toBe(modelB);
      });
      it("Should allow for a falcon mode to be the datat object", function() {
        var dataModel, modelA, modelB;
        modelA = new ModelA(dataModel = new Falcon.Model({
          "hello": "world"
        }), modelB = new ModelB);
        expect(ModelA.prototype.initialize).toHaveBeenCalledOnce();
        expect(ModelA.prototype.initialize).toHaveBeenCalledWith(dataModel);
        expect(ModelA.prototype.fill).toHaveBeenCalledOnce();
        expect(ModelA.prototype.fill).toHaveBeenCalledWith(dataModel);
        return expect(modelA.parent).toBe(modelB);
      });
      return it("Should throw if a model isn't passed in as the parent", function() {
        expect(function() {
          return new modelA(data, {});
        }).toThrow();
        expect(function() {
          return new modelA(data, new Falcon.Collection);
        }).toThrow();
        expect(ModelA.prototype.initialize).not.toHaveBeenCalled();
        return expect(ModelA.prototype.fill).not.toHaveBeenCalled();
      });
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
    describe("serialize and fill", function() {
      var CollectionC, ModelA, ModelB, ModelC, ModelD, ModelE, ModelF, collectionC, data, modelA, modelB, modelB2, original_model_b3, _ref, _ref1, _ref2, _ref3, _ref4, _ref5, _ref6;
      modelB = null;
      modelB2 = null;
      collectionC = null;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        ModelA.prototype.endpoint = "model_a";

        ModelA.prototype.observables = {
          '_client': null
        };

        ModelA.prototype.defaults = {
          'model_b': function() {
            return modelB = new ModelB;
          },
          'model_b2': function() {
            return modelB2 = new ModelB;
          },
          'collection_c': function() {
            return collectionC = new CollectionC;
          },
          'model_b3': function() {
            return new ModelB;
          }
        };

        return ModelA;

      })(Falcon.Model);
      ModelB = (function(_super) {
        __extends(ModelB, _super);

        function ModelB() {
          _ref1 = ModelB.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        ModelB.prototype.endpoint = "model_b";

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
      ModelD = (function(_super) {
        __extends(ModelD, _super);

        function ModelD() {
          _ref4 = ModelD.__super__.constructor.apply(this, arguments);
          return _ref4;
        }

        ModelD.prototype.defaults = {
          'model_e': function() {
            return new ModelE;
          }
        };

        ModelD.prototype.observables = {
          'hello': 'world',
          'foo': true
        };

        return ModelD;

      })(Falcon.Model);
      ModelE = (function(_super) {
        __extends(ModelE, _super);

        function ModelE() {
          _ref5 = ModelE.__super__.constructor.apply(this, arguments);
          return _ref5;
        }

        ModelE.prototype.observables = {
          'free': 'bird',
          'bar': true
        };

        return ModelE;

      })(Falcon.Model);
      ModelF = (function(_super) {
        __extends(ModelF, _super);

        function ModelF() {
          _ref6 = ModelF.__super__.constructor.apply(this, arguments);
          return _ref6;
        }

        ModelF.prototype.observables = {
          'free': function() {
            return 'bird';
          }
        };

        return ModelF;

      })(Falcon.Model);
      data = {
        "id": 33,
        "foo": "bar",
        "endpoint": "MODEL_A2",
        "model_b": {
          "b_foo": "B BAR"
        },
        "model_b2": {
          "id": "test",
          "b_foo": "B BAR 2",
          "endpoint": "model_b2"
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
      it("Should fill properly", function() {
        expect(modelA.get("id")).toBe(33);
        expect(modelA.get("foo")).toBe("bar");
        expect(modelA.get("endpoint")).toBe("MODEL_A2");
        expect(modelA.get("model_b")).toBe(modelB);
        expect(modelA.get("model_b").get("b_foo")).toBe("B BAR");
        expect(modelA.get("model_b").get("endpoint")).toBe("model_b");
        expect(modelA.get("model_b2")).toBe(modelB2);
        expect(modelA.get("model_b2").get("id")).toBe("test");
        expect(modelA.get("model_b2").get("b_foo")).toBe("B BAR 2");
        expect(modelA.get("model_b2").get("endpoint")).toBe("model_b2");
        expect(original_model_b3).toEqual(jasmine.any(ModelB));
        expect(data.model_b3).toEqual(jasmine.any(ModelB));
        expect(data.model_b3).not.toBe(original_model_b3);
        expect(modelA.get("model_b3")).toBe(data.model_b3);
        expect(modelA.get("collection_c")).toBe(collectionC);
        expect(modelA.get("collection_c").length()).toBe(3);
        expect(modelA.get("collection_c").first()).toEqual(jasmine.any(ModelC));
        return expect(modelA.get("collection_c").first().get("that")).toBe("That One");
      });
      it("Should retain reference to the original observables", function() {
        var bar_obs, foo_obs, free_obs, hello_obs, model_d;
        model_d = new ModelD();
        expect(model_d.get('hello')).toBe('world');
        expect(model_d.get('foo')).toBe(true);
        expect(model_d.model_e.get('free')).toBe('bird');
        expect(model_d.model_e.get('bar')).toBe(true);
        hello_obs = model_d.hello;
        foo_obs = model_d.foo;
        free_obs = model_d.model_e.free;
        bar_obs = model_d.model_e.bar;
        expect(ko.isWriteableObservable(hello_obs)).toBe(true);
        expect(ko.isWriteableObservable(foo_obs)).toBe(true);
        expect(ko.isWriteableObservable(free_obs)).toBe(true);
        expect(ko.isWriteableObservable(bar_obs)).toBe(true);
        model_d.fill({
          'hello': 'WORLD!',
          'foo': false,
          'model_e': {
            'free': 'BIRD!',
            'bar': false
          }
        });
        expect(model_d.get('hello')).toBe('WORLD!');
        expect(model_d.get('foo')).toBe(false);
        expect(model_d.model_e.get('free')).toBe('BIRD!');
        expect(model_d.model_e.get('bar')).toBe(false);
        expect(model_d.hello).toBe(hello_obs);
        expect(model_d.foo).toBe(foo_obs);
        expect(model_d.model_e.free).toBe(free_obs);
        return expect(model_d.model_e.bar).toBe(bar_obs);
      });
      it("Should not overwrite computed observables", function() {
        var modelF, obs;
        modelF = new ModelF;
        obs = modelF.free;
        modelF.fill({
          'free': 'hello world'
        });
        expect(modelF.free).toBe(obs);
        return expect(modelF.get('free')).toBe('bird');
      });
      it("Should serialize properly", function() {
        var serialized;
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
        return expect(serialized['collection_c'][0]['that']).toBe("That One");
      });
      it("Should serialzie properly with attributes", function() {
        var serialized;
        serialized = modelA.serialize(["id", "foo"]);
        expect(serialized['id']).toBe(33);
        expect(serialized['foo']).toBe("bar");
        expect(serialized["model_b"]).not.toBeDefined();
        expect(serialized["model_b2"]).not.toBeDefined();
        return expect(serialized["collection_c"]).not.toBeDefined();
      });
      it("Should serialzie properly with a single attribute", function() {
        var serialized;
        serialized = modelA.serialize(["foo"]);
        expect(serialized['foo']).toBe("bar");
        expect(serialized['id']).not.toBeDefined();
        expect(serialized["model_b"]).not.toBeDefined();
        expect(serialized["model_b2"]).not.toBeDefined();
        expect(serialized["model_b3"]).not.toBeDefined();
        return expect(serialized["collection_c"]).not.toBeDefined();
      });
      it("Should serialzie properly with a deep attributes", function() {
        var serialized;
        serialized = modelA.serialize({
          "id": null,
          "model_b2": {
            "b_foo": null,
            "endpoint": null
          }
        });
        expect(serialized['id']).toBe(33);
        expect(serialized['model_b2']).toEqual(jasmine.any(Object));
        expect(serialized['model_b2']['b_foo']).toBe("B BAR 2");
        expect(serialized["model_b"]).not.toBeDefined();
        expect(serialized["model_b3"]).not.toBeDefined();
        return expect(serialized["collection_c"]).not.toBeDefined();
      });
      return it("Should serialize without prototype elements of Falcon.Object", function() {
        var key, serialized, value, _results;
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
      return expect(unwrapped['endpoint']).not.toBeDefined();
    });
    describe("Testing makeUrl combinations", function() {
      var ModelA, ModelB, ModelC, ModelD, ModelE, _ref, _ref1, _ref2, _ref3, _ref4;
      ModelA = (function(_super) {
        __extends(ModelA, _super);

        function ModelA() {
          _ref = ModelA.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        ModelA.prototype.endpoint = "model_a";

        return ModelA;

      })(Falcon.Model);
      ModelB = (function(_super) {
        __extends(ModelB, _super);

        function ModelB() {
          _ref1 = ModelB.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        ModelB.prototype.endpoint = "/model_b";

        return ModelB;

      })(Falcon.Model);
      ModelC = (function(_super) {
        __extends(ModelC, _super);

        function ModelC() {
          _ref2 = ModelC.__super__.constructor.apply(this, arguments);
          return _ref2;
        }

        ModelC.prototype.endpoint = "model_c.json";

        return ModelC;

      })(Falcon.Model);
      ModelD = (function(_super) {
        __extends(ModelD, _super);

        function ModelD() {
          _ref3 = ModelD.__super__.constructor.apply(this, arguments);
          return _ref3;
        }

        ModelD.prototype.endpoint = "model_d.json";

        return ModelD;

      })(Falcon.Model);
      ModelE = (function(_super) {
        __extends(ModelE, _super);

        function ModelE() {
          _ref4 = ModelE.__super__.constructor.apply(this, arguments);
          return _ref4;
        }

        ModelE.prototype.endpoint = function() {
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
      it("Should be able to use endpoint as a function, no parent", function() {
        var modelE;
        modelE = new ModelE({
          id: "e"
        });
        expect(modelE.makeUrl("GET")).toBe("/model_e/e");
        expect(modelE.makeUrl("POST")).toBe("/model_e");
        expect(modelE.makeUrl("PUT")).toBe("/model_e/e");
        return expect(modelE.makeUrl("DELETE")).toBe("/model_e/e");
      });
      it("Should be able to use endpoint as a function, with parent", function() {
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
      it("Should be able to use override the endpoint, no parent", function() {
        var modelD;
        modelD = new ModelD({
          id: "d",
          endpoint: "model_d2"
        });
        expect(modelD.makeUrl("GET")).toBe("/model_d2/d");
        expect(modelD.makeUrl("POST")).toBe("/model_d2");
        expect(modelD.makeUrl("PUT")).toBe("/model_d2/d");
        return expect(modelD.makeUrl("DELETE")).toBe("/model_d2/d");
      });
      it("Should be able to use override the endpoint,with parent", function() {
        var modelD;
        modelD = new ModelD({
          id: "d",
          endpoint: "model_d3"
        }, new ModelB({
          id: "b"
        }));
        expect(modelD.makeUrl("GET")).toBe("/model_b/b/model_d3/d");
        expect(modelD.makeUrl("POST")).toBe("/model_b/b/model_d3");
        expect(modelD.makeUrl("PUT")).toBe("/model_b/b/model_d3/d");
        return expect(modelD.makeUrl("DELETE")).toBe("/model_b/b/model_d3/d");
      });
      it("Should be able to use override the function endpoint, no parent", function() {
        var modelE;
        modelE = new ModelD({
          id: "d",
          endpoint: "model_d2"
        });
        expect(modelE.makeUrl("GET")).toBe("/model_d2/d");
        expect(modelE.makeUrl("POST")).toBe("/model_d2");
        expect(modelE.makeUrl("PUT")).toBe("/model_d2/d");
        return expect(modelE.makeUrl("DELETE")).toBe("/model_d2/d");
      });
      it("Should be able to use override the function endpoint,with parent", function() {
        var modelE;
        modelE = new ModelE({
          id: "e",
          endpoint: "model_e3"
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

          ModelA.prototype.endpoint = "model_a";

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
      return describe("sync", function() {
        var model;
        model = new Falcon.Model;
        beforeEach(function() {
          return spyOn(Falcon.dataAdapter, 'sync');
        });
        return it("Should call the falcon adapter", function() {
          var context, options, type;
          type = "GET";
          options = {};
          context = new Falcon.Model;
          model.sync(type, options, context);
          expect(Falcon.dataAdapter.sync.calls.count()).toBe(1);
          return expect(Falcon.dataAdapter.sync).toHaveBeenCalledWith(model, type, options, context);
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
    describe("mixin", function() {
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
        return expect(mixin_spy.firstCall.args[0]).toBe('world');
      });
      it("Should preserve existing values in the model", function() {
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
      it("Should not overwrite existing values", function() {
        var TheModel, the_model, _ref;
        TheModel = (function(_super) {
          __extends(TheModel, _super);

          function TheModel() {
            _ref = TheModel.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          return TheModel;

        })(Falcon.Model);
        the_model = new TheModel;
        expect(the_model.get('is_read')).not.toBeDefined();
        the_model.mixin({
          is_read: ko.observable(true)
        });
        expect(ko.isObservable(the_model.is_read)).toBe(true);
        expect(the_model.get('is_read')).toBe(true);
        the_model.mixin({
          is_read: ko.observable(false)
        });
        expect(ko.isObservable(the_model.is_read)).toBe(true);
        return expect(the_model.get('is_read')).toBe(true);
      });
      return it("Should not lose reference to existing observables", function() {
        var TheModel, original_observable, the_model, _ref;
        TheModel = (function(_super) {
          __extends(TheModel, _super);

          function TheModel() {
            _ref = TheModel.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          TheModel.prototype.observables = {
            'hello': 'world'
          };

          return TheModel;

        })(Falcon.Model);
        the_model = new TheModel;
        expect(the_model.hello()).toBe('world');
        original_observable = the_model.hello;
        the_model.mixin({
          'hello': ko.observable('foo bar')
        });
        expect(original_observable).toBe(the_model.hello);
        return expect(the_model.hello()).toBe('world');
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

      ModelA.prototype.endpoint = 'model_a';

      return ModelA;

    })(Falcon.Model);
    ModelB = (function(_super) {
      __extends(ModelB, _super);

      function ModelB() {
        _ref1 = ModelB.__super__.constructor.apply(this, arguments);
        return _ref1;
      }

      ModelB.prototype.endpoint = 'model_b';

      return ModelB;

    })(Falcon.Model);
    ModelC = (function(_super) {
      __extends(ModelC, _super);

      function ModelC() {
        _ref2 = ModelC.__super__.constructor.apply(this, arguments);
        return _ref2;
      }

      ModelC.prototype.endpoint = 'model_c';

      return ModelC;

    })(Falcon.Model);
    ModelD = (function(_super) {
      __extends(ModelD, _super);

      function ModelD() {
        _ref3 = ModelD.__super__.constructor.apply(this, arguments);
        return _ref3;
      }

      ModelD.prototype.endpoint = function() {
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

      CollectionD2.prototype.endpoint = 'collection_d2';

      return CollectionD2;

    })(Falcon.Collection);
    CollectionD3 = (function(_super) {
      __extends(CollectionD3, _super);

      function CollectionD3() {
        _ref9 = CollectionD3.__super__.constructor.apply(this, arguments);
        return _ref9;
      }

      CollectionD3.prototype.model = ModelD;

      CollectionD3.prototype.endpoint = function() {
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

      ModelE.prototype.endpoint = 'model_e';

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
    describe("initialize", function() {
      var model, models;
      models = [
        {
          "hello": "world"
        }, {
          "hello": "world2"
        }
      ];
      model = new ModelB;
      beforeEach(function() {
        return sinonSpyOn(CollectionA.prototype, 'initialize');
      });
      it("Should initialize properly with an empty collection", function() {
        var collection;
        collection = new CollectionA;
        expect(CollectionA.prototype.initialize).toHaveBeenCalledOnce();
        expect(CollectionA.prototype.initialize).toHaveBeenCalledWith();
        return expect(CollectionA.prototype.initialize).toHaveBeenCalledOn(collection);
      });
      it("Should initialize properly with an array of objects", function() {
        var collection;
        collection = new CollectionA(models);
        expect(CollectionA.prototype.initialize).toHaveBeenCalledOnce();
        expect(CollectionA.prototype.initialize).toHaveBeenCalledWith(models);
        expect(collection.parent).not.toBeDefined();
        return expect(collection.length()).toBe(2);
      });
      it("Should set up the parent correctly", function() {
        var collection;
        collection = new CollectionA(models, model);
        expect(CollectionA.prototype.initialize).toHaveBeenCalledOnce();
        expect(CollectionA.prototype.initialize).toHaveBeenCalledWith(models);
        expect(collection.parent).toBe(model);
        return expect(collection.length()).toBe(2);
      });
      it("Should be able to switch the order of the models and parent", function() {
        var collection;
        collection = new CollectionA(model, models);
        expect(CollectionA.prototype.initialize).toHaveBeenCalledOnce();
        expect(CollectionA.prototype.initialize).toHaveBeenCalledWith(models);
        expect(collection.parent).toBe(model);
        return expect(collection.length()).toBe(2);
      });
      it("Should be able to accept an array of models", function() {
        var collection;
        models = [
          new ModelA({
            "hello": "world"
          }), new ModelA({
            "hello": "world2"
          })
        ];
        collection = new CollectionA(models);
        expect(CollectionA.prototype.initialize).toHaveBeenCalledOnce();
        expect(CollectionA.prototype.initialize).toHaveBeenCalledWith(models);
        expect(collection.parent).not.toBeDefined();
        return expect(collection.length()).toBe(2);
      });
      it("Should be able to accept an array of models with a parent model", function() {
        var collection;
        collection = new CollectionA(models, model);
        expect(CollectionA.prototype.initialize).toHaveBeenCalledOnce();
        expect(CollectionA.prototype.initialize).toHaveBeenCalledWith(models);
        expect(collection.parent).toBe(model);
        return expect(collection.length()).toBe(2);
      });
      it("Should be able to switch the order of an array of models and parent", function() {
        var collection;
        collection = new CollectionA(model, models);
        expect(CollectionA.prototype.initialize).toHaveBeenCalledOnce();
        expect(CollectionA.prototype.initialize).toHaveBeenCalledWith(models);
        expect(collection.parent).toBe(model);
        return expect(collection.length()).toBe(2);
      });
      return it("Should throw if the parent isn't a model", function() {
        return expect(function() {
          return new CollectionA(models, {});
        }).toThrow();
      });
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
    describe("set", function() {
      var collection, model_1, model_2, model_3;
      model_1 = new ModelA({
        'hello': 'water',
        'foo': 'baz'
      });
      model_2 = new ModelA({
        'hello': 'earth',
        'foo': 'zip'
      });
      model_3 = new ModelA({
        'hello': 'mars',
        'foo': 'zab'
      });
      collection = new CollectionA([model_1, model_2, model_3]);
      beforeEach(function() {
        spyOn(model_1, 'set');
        spyOn(model_2, 'set');
        return spyOn(model_3, 'set');
      });
      it("Should update all of the values", function() {
        var ret;
        ret = collection.set('hello', 'world');
        expect(model_1.set.calls.count()).toBe(1);
        expect(model_1.set).toHaveBeenCalledWith('hello', 'world');
        expect(model_2.set.calls.count()).toBe(1);
        expect(model_2.set).toHaveBeenCalledWith('hello', 'world');
        expect(model_3.set.calls.count()).toBe(1);
        expect(model_3.set).toHaveBeenCalledWith('hello', 'world');
        return expect(ret).toBe(collection);
      });
      return it("Should be able to set using an object", function() {
        var ret;
        ret = collection.set({
          'hello': 'world :D',
          'foo': 'bar'
        });
        expect(model_1.set.calls.count()).toBe(1);
        expect(model_1.set).toHaveBeenCalledWith({
          'hello': 'world :D',
          'foo': 'bar'
        }, void 0);
        expect(model_2.set.calls.count()).toBe(1);
        expect(model_2.set).toHaveBeenCalledWith({
          'hello': 'world :D',
          'foo': 'bar'
        }, void 0);
        expect(model_3.set.calls.count()).toBe(1);
        expect(model_3.set).toHaveBeenCalledWith({
          'hello': 'world :D',
          'foo': 'bar'
        }, void 0);
        return expect(ret).toBe(collection);
      });
    });
    describe("fill", function() {
      var collection, items, options;
      collection = null;
      items = options = null;
      beforeEach(function() {
        collection = new CollectionA;
        items = [{}, {}];
        spyOn(collection, 'replace');
        spyOn(collection, 'prepend');
        spyOn(collection, 'append');
        spyOn(collection, 'insert');
        return spyOn(collection, 'merge');
      });
      it("Should call the replace method by default", function() {
        options = {};
        collection.fill(items, options);
        expect(collection.replace.calls.count()).toBe(1);
        expect(collection.replace).toHaveBeenCalledWith(items, {
          'method': 'replace',
          'comparator': null
        });
        expect(collection.append).not.toHaveBeenCalled();
        expect(collection.prepend).not.toHaveBeenCalled();
        expect(collection.merge).not.toHaveBeenCalled();
        expect(collection.insert).not.toHaveBeenCalled();
        return expect(collection.replace.calls.mostRecent().args[1]).not.toBe(options);
      });
      it("Should call the replace when an invalid method is given", function() {
        options = {
          'method': 'replacezzzzzz'
        };
        collection.fill(items, options);
        expect(collection.replace.calls.count()).toBe(1);
        expect(collection.replace).toHaveBeenCalledWith(items, {
          'method': 'replace',
          'comparator': null
        });
        expect(collection.append).not.toHaveBeenCalled();
        expect(collection.prepend).not.toHaveBeenCalled();
        expect(collection.merge).not.toHaveBeenCalled();
        expect(collection.insert).not.toHaveBeenCalled();
        return expect(collection.replace.calls.mostRecent().args[1]).not.toBe(options);
      });
      it("Should call the replace when requested", function() {
        options = {
          'method': 'replace'
        };
        collection.fill(items, options);
        expect(collection.replace.calls.count()).toBe(1);
        expect(collection.replace).toHaveBeenCalledWith(items, {
          'method': 'replace',
          'comparator': null
        });
        expect(collection.append).not.toHaveBeenCalled();
        expect(collection.prepend).not.toHaveBeenCalled();
        expect(collection.merge).not.toHaveBeenCalled();
        expect(collection.insert).not.toHaveBeenCalled();
        return expect(collection.replace.calls.mostRecent().args[1]).not.toBe(options);
      });
      it("Should call the append when requested", function() {
        options = {
          'method': 'append'
        };
        collection.fill(items, options);
        expect(collection.append.calls.count()).toBe(1);
        expect(collection.append).toHaveBeenCalledWith(items, {
          'method': 'append',
          'comparator': null
        });
        expect(collection.replace).not.toHaveBeenCalled();
        expect(collection.prepend).not.toHaveBeenCalled();
        expect(collection.merge).not.toHaveBeenCalled();
        expect(collection.insert).not.toHaveBeenCalled();
        return expect(collection.append.calls.mostRecent().args[1]).not.toBe(options);
      });
      it("Should call the prepend when requested", function() {
        options = {
          'method': 'prepend'
        };
        collection.fill(items, options);
        expect(collection.prepend.calls.count()).toBe(1);
        expect(collection.prepend).toHaveBeenCalledWith(items, {
          'method': 'prepend',
          'comparator': null
        });
        expect(collection.replace).not.toHaveBeenCalled();
        expect(collection.append).not.toHaveBeenCalled();
        expect(collection.merge).not.toHaveBeenCalled();
        expect(collection.insert).not.toHaveBeenCalled();
        return expect(collection.prepend.calls.mostRecent().args[1]).not.toBe(options);
      });
      it("Should call the merge when requested", function() {
        options = {
          'method': 'merge'
        };
        collection.fill(items, options);
        expect(collection.merge.calls.count()).toBe(1);
        expect(collection.merge).toHaveBeenCalledWith(items, {
          'method': 'merge',
          'comparator': null
        });
        expect(collection.replace).not.toHaveBeenCalled();
        expect(collection.append).not.toHaveBeenCalled();
        expect(collection.prepend).not.toHaveBeenCalled();
        expect(collection.insert).not.toHaveBeenCalled();
        return expect(collection.merge.calls.mostRecent().args[1]).not.toBe(options);
      });
      return it("Should call the insert when requested", function() {
        options = {
          'method': 'insert',
          'index': 3
        };
        collection.fill(items, options);
        expect(collection.insert.calls.count()).toBe(1);
        expect(collection.insert).toHaveBeenCalledWith(items, {
          'method': 'insert',
          'index': 3,
          'comparator': null
        });
        expect(collection.replace).not.toHaveBeenCalled();
        expect(collection.append).not.toHaveBeenCalled();
        expect(collection.prepend).not.toHaveBeenCalled();
        expect(collection.merge).not.toHaveBeenCalled();
        return expect(collection.insert.calls.mostRecent().args[1]).not.toBe(options);
      });
    });
    describe("replace", function() {
      it("Should properly add items into an empty collection", function() {
        var collectionA;
        collectionA = new CollectionA;
        collectionA.replace([
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
        collectionA.replace([
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
    describe("append", function() {
      it("Should properly add items into an empty collection", function() {
        var collectionA;
        collectionA = new CollectionA;
        collectionA.append([
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
      it("Should properly append items into a populated collection", function() {
        var collectionA;
        collectionA = new CollectionA([
          {
            id: 3,
            "hello": "world3"
          }
        ]);
        collectionA.append([
          {
            id: 1,
            "hello": "world"
          }, {
            id: 2,
            "hello": "world2"
          }
        ]);
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
      return it("Should properly add items into an empty collection and set the parent properly", function() {
        var collectionA, modelB;
        modelB = new ModelB;
        collectionA = new CollectionA(modelB);
        collectionA.append([
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
    describe("prepend", function() {
      it("Should properly add items into an empty collection", function() {
        var collectionA;
        collectionA = new CollectionA;
        collectionA.prepend([
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
      return it("Should properly prepend items into a populated collection", function() {
        var collectionA, index;
        collectionA = new CollectionA([
          {
            id: 3,
            "hello": "world3"
          }
        ]);
        collectionA.prepend([
          {
            id: 1,
            "hello": "world"
          }, {
            id: 2,
            "hello": "world2"
          }
        ]);
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
    describe("merge", function() {
      it("Should properly add items into an empty collection", function() {
        var collectionA;
        collectionA = new CollectionA;
        collectionA.merge([
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
        collectionA.merge([
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
        ]);
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
      it("Should not overwrite previous references on merge", function() {
        var MergeCollection, MergeModel, SubMergeModel, foo_obs, hello_obs, merge_collection, merge_model, merge_model2, _ref12, _ref13, _ref14;
        MergeModel = (function(_super) {
          __extends(MergeModel, _super);

          function MergeModel() {
            _ref12 = MergeModel.__super__.constructor.apply(this, arguments);
            return _ref12;
          }

          MergeModel.prototype.defaults = {
            'sub': function() {
              return new SubMergeModel;
            }
          };

          MergeModel.prototype.observables = {
            'foo': 'bar'
          };

          return MergeModel;

        })(Falcon.Model);
        SubMergeModel = (function(_super) {
          __extends(SubMergeModel, _super);

          function SubMergeModel() {
            _ref13 = SubMergeModel.__super__.constructor.apply(this, arguments);
            return _ref13;
          }

          SubMergeModel.prototype.observables = {
            'hello': 'world'
          };

          return SubMergeModel;

        })(Falcon.Model);
        MergeCollection = (function(_super) {
          __extends(MergeCollection, _super);

          function MergeCollection() {
            _ref14 = MergeCollection.__super__.constructor.apply(this, arguments);
            return _ref14;
          }

          MergeCollection.prototype.model = MergeModel;

          return MergeCollection;

        })(Falcon.Collection);
        merge_model = new MergeModel({
          id: 1
        });
        merge_collection = new MergeCollection([merge_model]);
        expect(merge_model.get('foo')).toBe('bar');
        expect(merge_model.sub.get('hello')).toBe('world');
        foo_obs = merge_model.foo;
        hello_obs = merge_model.sub.hello;
        expect(ko.isObservable(foo_obs)).toBe(true);
        expect(ko.isObservable(hello_obs)).toBe(true);
        expect(merge_collection.all()).toEqual([merge_model]);
        merge_collection.merge([
          {
            'id': 1,
            'foo': 'BAR',
            'sub': {
              'hello': 'WORLD'
            }
          }, (merge_model2 = new MergeModel)
        ]);
        expect(merge_model.get('foo')).toBe('BAR');
        expect(merge_model.sub.get('hello')).toBe('WORLD');
        expect(foo_obs).toBe(merge_model.foo);
        expect(hello_obs).toBe(merge_model.sub.hello);
        return expect(merge_collection.all()).toEqual([merge_model, merge_model2]);
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
        collectionA.merge([
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
        ]);
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
    describe("insert", function() {
      it("Should properly add items into an empty collection", function() {
        var collectionA;
        collectionA = new CollectionA;
        collectionA.insert([
          {
            id: 1,
            "hello": "world"
          }, {
            id: 2,
            "hello": "world2"
          }
        ], {
          'index': 2
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
        collectionA.insert([
          {
            id: 1,
            "hello": "world"
          }, {
            id: 2,
            "hello": "world2"
          }
        ], {
          'index': 1
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
      it("Should properly insert items into a populated collection with an iterator function", function() {
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
        collectionA.insert([
          {
            id: 1,
            "hello": "world"
          }, {
            id: 2,
            "hello": "world2"
          }
        ], function(model) {
          return model.get('id') === 4;
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
      it("Should properly insert items into a populated collection with an integer id", function() {
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
        collectionA.insert([
          {
            id: 1,
            "hello": "world"
          }, {
            id: 2,
            "hello": "world2"
          }
        ], 4);
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
      it("Should properly insert items into a populated collection with a string id", function() {
        var collectionA, index;
        collectionA = new CollectionA([
          {
            id: '3',
            "hello": "world3"
          }, {
            id: '4',
            "hello": "world4"
          }
        ]);
        collectionA.insert([
          {
            id: '1',
            "hello": "world"
          }, {
            id: '2',
            "hello": "world2"
          }
        ], '4');
        index = 0;
        expect(collectionA.length()).toBe(4);
        expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
        expect(collectionA.at(index).get('id')).toBe('3');
        expect(collectionA.at(index).get('hello')).toBe("world3");
        index++;
        expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
        expect(collectionA.at(index).get('id')).toBe('1');
        expect(collectionA.at(index).get('hello')).toBe("world");
        index++;
        expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
        expect(collectionA.at(index).get('id')).toBe('2');
        expect(collectionA.at(index).get('hello')).toBe("world2");
        index++;
        expect(collectionA.at(index)).toEqual(jasmine.any(ModelA));
        expect(collectionA.at(index).get('id')).toBe('4');
        expect(collectionA.at(index).get('hello')).toBe("world4");
        return index++;
      });
      it("Should properly insert items into a populated collection with a model", function() {
        var collectionA, index, model;
        collectionA = new CollectionA([
          new ModelA({
            id: 3,
            "hello": "world3"
          }), model = new ModelA({
            id: 4,
            "hello": "world4"
          })
        ]);
        collectionA.insert([
          new ModelA({
            id: 1,
            "hello": "world"
          }), new ModelA({
            id: 2,
            "hello": "world2"
          })
        ], model);
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
        collectionA.insert([
          {
            id: 1,
            "hello": "world"
          }, {
            id: 2,
            "hello": "world2"
          }
        ], {
          'index': 5
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
        collectionA.insert([
          {
            id: 1,
            "hello": "world"
          }, {
            id: 2,
            "hello": "world2"
          }
        ], {
          'index': 0
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
        Falcon.debug = true;
        serialized = collectionA.serialize();
        expect(serialized).toEqual(models);
        return Falcon.debug = false;
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
        expect(collectionA.makeUrl(Falcon.GET)).toBe("/model_a");
        expect(collectionA.makeUrl(Falcon.POST)).toBe("/model_a");
        expect(collectionA.makeUrl(Falcon.PUT)).toBe("/model_a");
        return expect(collectionA.makeUrl(Falcon.DELETE)).toBe("/model_a");
      });
      it("Tests the basic makeUrl method, base API url", function() {
        var collectionA;
        collectionA = new CollectionA();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionA.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_a");
        return expect(collectionA.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_a");
      });
      it("Tests the basic makeUrl method, base API url ending with a '/'", function() {
        var collectionA;
        collectionA = new CollectionA();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionA.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_a");
        return expect(collectionA.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_a");
      });
      it("Tests the basic makeUrl method, with parent", function() {
        var collectionA;
        collectionA = new CollectionA(new ModelB({
          id: '1b'
        }));
        expect(collectionA.makeUrl(Falcon.GET)).toBe("/model_b/1b/model_a");
        expect(collectionA.makeUrl(Falcon.POST)).toBe("/model_b/1b/model_a");
        expect(collectionA.makeUrl(Falcon.PUT)).toBe("/model_b/1b/model_a");
        return expect(collectionA.makeUrl(Falcon.DELETE)).toBe("/model_b/1b/model_a");
      });
      it("Tests the basic makeUrl method, base API url, with parent", function() {
        var collectionA;
        collectionA = new CollectionA(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionA.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_b/2b/model_a");
        expect(collectionA.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_b/2b/model_a");
        expect(collectionA.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_b/2b/model_a");
        return expect(collectionA.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_b/2b/model_a");
      });
      it("Tests the basic makeUrl method, base API url ending with a '/', with parent", function() {
        var collectionA;
        collectionA = new CollectionA(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionA.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_b/3b/model_a");
        expect(collectionA.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_b/3b/model_a");
        expect(collectionA.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_b/3b/model_a");
        return expect(collectionA.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_b/3b/model_a");
      });
      it("Tests the basic makeUrl method, model url is a function", function() {
        var collectionD;
        collectionD = new CollectionD();
        expect(collectionD.makeUrl(Falcon.GET)).toBe("/model_d");
        expect(collectionD.makeUrl(Falcon.POST)).toBe("/model_d");
        expect(collectionD.makeUrl(Falcon.PUT)).toBe("/model_d");
        return expect(collectionD.makeUrl(Falcon.DELETE)).toBe("/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, base API url", function() {
        var collectionD;
        collectionD = new CollectionD();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_d");
        return expect(collectionD.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, base API url ending with a '/'", function() {
        var collectionD;
        collectionD = new CollectionD();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_d");
        return expect(collectionD.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, with parent", function() {
        var collectionD;
        collectionD = new CollectionD(new ModelB({
          id: '1b'
        }));
        expect(collectionD.makeUrl(Falcon.GET)).toBe("/model_b/1b/model_d");
        expect(collectionD.makeUrl(Falcon.POST)).toBe("/model_b/1b/model_d");
        expect(collectionD.makeUrl(Falcon.PUT)).toBe("/model_b/1b/model_d");
        return expect(collectionD.makeUrl(Falcon.DELETE)).toBe("/model_b/1b/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, with parent, base API url", function() {
        var collectionD;
        collectionD = new CollectionD(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_b/2b/model_d");
        expect(collectionD.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_b/2b/model_d");
        expect(collectionD.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_b/2b/model_d");
        return expect(collectionD.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_b/2b/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, with parent, base API url ending with a '/'", function() {
        var collectionD;
        collectionD = new CollectionD(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_b/3b/model_d");
        expect(collectionD.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_b/3b/model_d");
        expect(collectionD.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_b/3b/model_d");
        return expect(collectionD.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_b/3b/model_d");
      });
      it("Tests the basic makeUrl method, defined url string", function() {
        var collectionD2;
        collectionD2 = new CollectionD2();
        expect(collectionD2.makeUrl(Falcon.GET)).toBe("/collection_d2");
        expect(collectionD2.makeUrl(Falcon.POST)).toBe("/collection_d2");
        expect(collectionD2.makeUrl(Falcon.PUT)).toBe("/collection_d2");
        return expect(collectionD2.makeUrl(Falcon.DELETE)).toBe("/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, base API url", function() {
        var collectionD2;
        collectionD2 = new CollectionD2();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD2.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/collection_d2");
        return expect(collectionD2.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, base API url ending with a '/'", function() {
        var collectionD2;
        collectionD2 = new CollectionD2();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD2.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/collection_d2");
        return expect(collectionD2.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, with parent", function() {
        var collectionD2;
        collectionD2 = new CollectionD2(new ModelB({
          id: '1b'
        }));
        expect(collectionD2.makeUrl(Falcon.GET)).toBe("/model_b/1b/collection_d2");
        expect(collectionD2.makeUrl(Falcon.POST)).toBe("/model_b/1b/collection_d2");
        expect(collectionD2.makeUrl(Falcon.PUT)).toBe("/model_b/1b/collection_d2");
        return expect(collectionD2.makeUrl(Falcon.DELETE)).toBe("/model_b/1b/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, with parent, base API url", function() {
        var collectionD2;
        collectionD2 = new CollectionD2(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD2.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_b/2b/collection_d2");
        expect(collectionD2.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_b/2b/collection_d2");
        expect(collectionD2.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_b/2b/collection_d2");
        return expect(collectionD2.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_b/2b/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, with parent, base API url ending with a '/'", function() {
        var collectionD2;
        collectionD2 = new CollectionD2(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD2.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_b/3b/collection_d2");
        expect(collectionD2.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_b/3b/collection_d2");
        expect(collectionD2.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_b/3b/collection_d2");
        return expect(collectionD2.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_b/3b/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url function", function() {
        var collectionD3;
        collectionD3 = new CollectionD3();
        expect(collectionD3.makeUrl(Falcon.GET)).toBe("/collection_d3");
        expect(collectionD3.makeUrl(Falcon.POST)).toBe("/collection_d3");
        expect(collectionD3.makeUrl(Falcon.PUT)).toBe("/collection_d3");
        return expect(collectionD3.makeUrl(Falcon.DELETE)).toBe("/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, base API url", function() {
        var collectionD3;
        collectionD3 = new CollectionD3();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD3.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/collection_d3");
        return expect(collectionD3.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, base API url ending with a '/'", function() {
        var collectionD3;
        collectionD3 = new CollectionD3();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD3.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/collection_d3");
        return expect(collectionD3.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, with parent", function() {
        var collectionD3;
        collectionD3 = new CollectionD3(new ModelB({
          id: '1b'
        }));
        expect(collectionD3.makeUrl(Falcon.GET)).toBe("/model_b/1b/collection_d3");
        expect(collectionD3.makeUrl(Falcon.POST)).toBe("/model_b/1b/collection_d3");
        expect(collectionD3.makeUrl(Falcon.PUT)).toBe("/model_b/1b/collection_d3");
        return expect(collectionD3.makeUrl(Falcon.DELETE)).toBe("/model_b/1b/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, with parent, base API url", function() {
        var collectionD3;
        collectionD3 = new CollectionD3(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD3.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_b/2b/collection_d3");
        expect(collectionD3.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_b/2b/collection_d3");
        expect(collectionD3.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_b/2b/collection_d3");
        return expect(collectionD3.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_b/2b/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, with parent, base API url ending with a '/'", function() {
        var collectionD3;
        collectionD3 = new CollectionD3(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD3.makeUrl(Falcon.GET)).toBe("http://www.falconjs.com/model_b/3b/collection_d3");
        expect(collectionD3.makeUrl(Falcon.POST)).toBe("http://www.falconjs.com/model_b/3b/collection_d3");
        expect(collectionD3.makeUrl(Falcon.PUT)).toBe("http://www.falconjs.com/model_b/3b/collection_d3");
        return expect(collectionD3.makeUrl(Falcon.DELETE)).toBe("http://www.falconjs.com/model_b/3b/collection_d3");
      });
      return it("Should be able to make a url with just a / baseApiUrl", function() {
        var MyCollection, MyModel, my_collection, _ref12, _ref13;
        MyModel = (function(_super) {
          __extends(MyModel, _super);

          function MyModel() {
            _ref12 = MyModel.__super__.constructor.apply(this, arguments);
            return _ref12;
          }

          MyModel.prototype.endpoint = 'my_models';

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
        return expect(my_collection.makeUrl(Falcon.GET)).toBe("/my_models");
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
          return expect(sync_stub).toHaveBeenCalledWith(Falcon.GET, {
            'hello': 'world'
          });
        });
      });
      return describe("sync", function() {
        var collection;
        collection = new Falcon.Collection;
        beforeEach(function() {
          return spyOn(Falcon.dataAdapter, 'sync');
        });
        return it("Should call the falcon adapter", function() {
          var context, options, type;
          type = "GET";
          options = {};
          context = new Falcon.Collection;
          collection.sync(type, options, context);
          expect(Falcon.dataAdapter.sync.calls.count()).toBe(1);
          return expect(Falcon.dataAdapter.sync).toHaveBeenCalledWith(collection, type, options, context);
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
    describe("sort", function() {
      var collectionA, model_a1, model_a2, model_a3;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = null;
      it("Should sort properly", function() {
        var ret;
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
        ret = collectionA.sort(function(a, b) {
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
        expect(collectionA.models()).toEqual([model_a1, model_a2, model_a3]);
        return expect(ret).toBe(collectionA);
      });
      return it("Should use the built-in comparator if none is given", function() {
        var ret;
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
        collectionA.comparator = function(a, b) {
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
        };
        ret = collectionA.sort();
        expect(collectionA.models()).toEqual([model_a1, model_a2, model_a3]);
        return expect(ret).toBe(collectionA);
      });
    });
    describe("create", function() {
      var collection, context, model, options, success;
      model = new ModelA;
      options = {
        success: jasmine.createSpy("Success Spy")
      };
      context = new ModelA;
      collection = new CollectionA;
      collection.parent = new ModelB;
      success = null;
      beforeEach(function() {
        spyOn(model, 'create');
        spyOn(collection, 'fill');
        spyOn(Falcon.dataAdapter, 'standardizeOptions').and.callThrough();
        return options.success.calls.reset();
      });
      it("Should return null if no model is set in the collection", function() {
        collection.model = null;
        expect(collection.create(model, options, context)).toBeNull();
        expect(model.create).not.toHaveBeenCalled();
        expect(collection.fill).not.toHaveBeenCalled();
        expect(options.success).not.toHaveBeenCalled();
        expect(Falcon.dataAdapter.standardizeOptions).not.toHaveBeenCalled();
        return collection.model = ModelA;
      });
      it("Should call the model create method", function() {
        var fill_options, output_options;
        collection.create(model, options, context);
        expect(Falcon.dataAdapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.dataAdapter.standardizeOptions).toHaveBeenCalledWith(model, 'POST', options, context);
        expect(model.create.calls.count()).toBe(1);
        expect(model.create).toHaveBeenCalledWith(jasmine.any(Object), context);
        expect(collection.fill).not.toHaveBeenCalled();
        expect(options.success).not.toHaveBeenCalled();
        output_options = model.create.calls.mostRecent().args[0];
        expect(output_options).not.toBe(options);
        success = output_options.success, fill_options = output_options.fill_options;
        expect(success).not.toBe(options.success);
        return expect(fill_options).toEqual({
          'method': 'append'
        });
      });
      it("Should call the proper routines in the success method", function() {
        success(model);
        expect(model.create).not.toHaveBeenCalled();
        expect(Falcon.dataAdapter.standardizeOptions).not.toHaveBeenCalled();
        expect(collection.fill.calls.count()).toBe(1);
        expect(collection.fill).toHaveBeenCalledWith(model, {
          'method': 'append'
        });
        expect(options.success.calls.count()).toBe(1);
        expect(options.success).toHaveBeenCalledWith(model);
        return expect(options.success.calls.mostRecent().object).toBe(context);
      });
      it("Should generate a model if raw data is passed in", function() {
        var data;
        spyOn(ModelA.prototype, 'initialize');
        spyOn(ModelA.prototype, 'create');
        data = {};
        collection.create(data, options, context);
        expect(ModelA.prototype.initialize.calls.count()).toBe(1);
        expect(ModelA.prototype.initialize).toHaveBeenCalledWith(data, collection.parent);
        model = ModelA.prototype.initialize.calls.mostRecent().object;
        expect(model.parent).toBe(collection.parent);
        expect(Falcon.dataAdapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.dataAdapter.standardizeOptions).toHaveBeenCalledWith(model, 'POST', options, context);
        expect(model.create.calls.count()).toBe(1);
        expect(model.create).toHaveBeenCalledWith(jasmine.any(Object), context);
        expect(collection.fill).not.toHaveBeenCalled();
        return expect(options.success).not.toHaveBeenCalled();
      });
      it("Should set up the correct context if none is given", function() {
        collection.create(model, options);
        expect(Falcon.dataAdapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.dataAdapter.standardizeOptions).toHaveBeenCalledWith(model, 'POST', options, model);
        expect(model.create.calls.count()).toBe(1);
        return expect(model.create).toHaveBeenCalledWith(jasmine.any(Object), model);
      });
      return it("Should not overwrite the fill options", function() {
        var fill_options;
        collection.create(model, {
          fill_options: {
            'method': 'merge'
          }
        }, context);
        fill_options = model.create.calls.mostRecent().args[0].fill_options;
        return expect(fill_options).toEqual({
          'method': 'merge'
        });
      });
    });
    describe("destroy", function() {
      var collection, context, model_1, model_2, model_3, model_4, options, success;
      model_1 = new ModelA({
        id: 1
      });
      model_2 = new ModelA({
        id: 2
      });
      model_3 = new ModelA({
        id: 3
      });
      model_4 = new ModelA({
        id: 4
      });
      collection = new CollectionA([model_1, model_2, model_4]);
      context = new ModelA;
      options = {
        success: jasmine.createSpy("Success Spy")
      };
      success = null;
      beforeEach(function() {
        spyOn(model_1, 'destroy');
        spyOn(model_2, 'destroy');
        spyOn(model_3, 'destroy');
        spyOn(model_4, 'destroy');
        spyOn(collection, 'remove');
        spyOn(Falcon.dataAdapter, 'standardizeOptions').and.callThrough();
        return options.success.calls.reset();
      });
      it("Should return null if a model isn't set on the collection", function() {
        collection.model = null;
        expect(collection.destroy(model_1, options, context)).toBeNull();
        expect(Falcon.dataAdapter.standardizeOptions).not.toHaveBeenCalled();
        expect(model_1.destroy).not.toHaveBeenCalled();
        return collection.model = ModelA;
      });
      it("Should return null if a model that doesnt exist in the collection is given", function() {
        expect(collection.destroy(model_3, options, context)).toBeNull();
        expect(Falcon.dataAdapter.standardizeOptions).not.toHaveBeenCalled();
        return expect(model_1.destroy).not.toHaveBeenCalled();
      });
      it("Should call the correct method when removing a model that exists in the collection", function() {
        var output_options;
        collection.destroy(model_1, options, context);
        expect(Falcon.dataAdapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.dataAdapter.standardizeOptions).toHaveBeenCalledWith(model_1, 'DELETE', options, context);
        expect(model_1.destroy.calls.count()).toBe(1);
        expect(model_1.destroy).toHaveBeenCalledWith(jasmine.any(Object), context);
        expect(collection.remove).not.toHaveBeenCalled();
        expect(options.success).not.toHaveBeenCalled();
        output_options = model_1.destroy.calls.mostRecent().args[0];
        expect(output_options).not.toBe(options);
        success = output_options.success;
        return expect(success).not.toBe(options.success);
      });
      it("Should call the proper routines in the success method", function() {
        success(model_1);
        expect(model_1.destroy).not.toHaveBeenCalled();
        expect(Falcon.dataAdapter.standardizeOptions).not.toHaveBeenCalled();
        expect(collection.remove.calls.count()).toBe(1);
        expect(collection.remove).toHaveBeenCalledWith(model_1);
        expect(options.success.calls.count()).toBe(1);
        expect(options.success).toHaveBeenCalledWith(model_1);
        return expect(options.success.calls.mostRecent().object).toBe(context);
      });
      it("Should be able to remove a model based on id", function() {
        collection.destroy(2, options, context);
        expect(Falcon.dataAdapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.dataAdapter.standardizeOptions).toHaveBeenCalledWith(model_2, 'DELETE', options, context);
        expect(model_2.destroy.calls.count()).toBe(1);
        expect(model_2.destroy).toHaveBeenCalledWith(jasmine.any(Object), context);
        expect(collection.remove).not.toHaveBeenCalled();
        return expect(options.success).not.toHaveBeenCalled();
      });
      return it("Should set up the correct context if none is given", function() {
        collection.destroy(model_4, options);
        expect(Falcon.dataAdapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.dataAdapter.standardizeOptions).toHaveBeenCalledWith(model_4, 'DELETE', options, model_4);
        expect(model_4.destroy.calls.count()).toBe(1);
        return expect(model_4.destroy).toHaveBeenCalledWith(jasmine.any(Object), model_4);
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
      var collectionA, model_a1, model_a2, model_a3, model_ab, model_none;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = model_ab = null;
      model_none = null;
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
        model_none = new ModelA;
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
      it("Should return the null if nothing passes the iterator", function() {
        var first;
        first = collectionA.first(function(model) {
          return false;
        });
        return expect(first).toBe(null);
      });
      it("Should allow for an array to be passed in", function() {
        var first;
        first = collectionA.first([model_none]);
        expect(first).toBeNull();
        first = collectionA.first([model_a1]);
        expect(first).toEqual(model_a1);
        first = collectionA.first([model_none, model_a1]);
        return expect(first).toEqual(model_a1);
      });
      return it("Should allow for a collection to be passed in", function() {
        var first;
        first = collectionA.first(new CollectionA([model_none]));
        expect(first).toBeNull();
        first = collectionA.first(new CollectionA([model_a1]));
        expect(first).toEqual(model_a1);
        first = collectionA.first(new CollectionA([model_none, model_a1]));
        return expect(first).toEqual(model_a1);
      });
    });
    describe("last", function() {
      var collectionA, model_a1, model_a2, model_a3, model_ab, model_none;
      collectionA = null;
      model_a1 = model_a2 = model_a3 = model_ab = null;
      model_none = null;
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
        model_none = new ModelA;
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
      it("Should return the null if nothing passes the iterator", function() {
        var last;
        last = collectionA.last(function(model) {
          return false;
        });
        return expect(last).toBe(null);
      });
      it("Should allow for an array to be passed in", function() {
        var last;
        last = collectionA.last([model_none]);
        expect(last).toBeNull();
        last = collectionA.last([model_a1]);
        expect(last).toEqual(model_a1);
        last = collectionA.last([model_none, model_a1]);
        return expect(last).toEqual(model_a1);
      });
      return it("Should allow for a collection to be passed in", function() {
        var last;
        last = collectionA.last(new CollectionA([model_none]));
        expect(last).toBeNull();
        last = collectionA.last(new CollectionA([model_a1]));
        expect(last).toEqual(model_a1);
        last = collectionA.last(new CollectionA([model_none, model_a1]));
        return expect(last).toEqual(model_a1);
      });
    });
    describe("filter", function() {
      var collectionA, model_a1, model_a2, model_a3, model_ab, model_ab2, model_none, models;
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
      model_none = new ModelA;
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
      it("Should return an empty set of models", function() {
        var all;
        all = collectionA.filter(function(model) {
          return false;
        });
        expect(all.length).toBe(0);
        return expect(all).toEqual([]);
      });
      it("Should allow for an array to be passed in", function() {
        var filter;
        filter = collectionA.filter([model_none]);
        expect(filter).toEqual([]);
        filter = collectionA.filter([model_a1]);
        expect(filter).toEqual([model_a1]);
        filter = collectionA.filter([model_none, model_a1]);
        return expect(filter).toEqual([model_a1]);
      });
      return it("Should allow for a collection to be passed in", function() {
        var filter;
        filter = collectionA.filter(new CollectionA([model_none]));
        expect(filter).toEqual([]);
        filter = collectionA.filter(new CollectionA([model_a1]));
        expect(filter).toEqual([model_a1]);
        filter = collectionA.filter(new CollectionA([model_none, model_a1]));
        return expect(filter).toEqual([model_a1]);
      });
    });
    describe("all", function() {
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
    describe("any", function() {
      var collectionA, model_a1, model_a2, model_a3, model_a4, model_ab, model_ab2, model_none, models;
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
      model_none = new ModelA;
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
      it("Should not match true based on empty iterator", function() {
        var any;
        any = collectionA.any();
        return expect(any).toBe(false);
      });
      it("Should allow for an array to be passed in", function() {
        var any;
        any = collectionA.any([model_none]);
        expect(any).toBe(false);
        any = collectionA.any([model_a1]);
        expect(any).toBe(true);
        any = collectionA.any([model_none, model_a1]);
        return expect(any).toBe(true);
      });
      return it("Should allow for a collection to be passed in", function() {
        var any;
        any = collectionA.any(new CollectionA([model_none]));
        expect(any).toBe(false);
        any = collectionA.any(new CollectionA([model_a1]));
        expect(any).toBe(true);
        any = collectionA.any(new CollectionA([model_none, model_a1]));
        return expect(any).toBe(true);
      });
    });
    describe("without", function() {
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
      collectionA = null;
      models = null;
      beforeEach(function() {
        models = [model_a1, model_a2, model_ab, model_ab, model_ab2, model_a3];
        return collectionA = new CollectionA(models);
      });
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
      it("Should return a limited set of models by id", function() {
        var without;
        without = collectionA.without(3);
        expect(without.length).toBe(5);
        expect(without).toEqual([model_a1, model_a2, model_ab, model_ab, model_ab2]);
        without = collectionA.without('b');
        expect(without.length).toBe(3);
        return expect(without).toEqual([model_a1, model_a2, model_a3]);
      });
      it("Should allow for an array to be passed in", function() {
        var without;
        without = collectionA.without([model_a1, model_ab]);
        expect(without.length).toBe(3);
        return expect(without).toEqual([model_a2, model_ab2, model_a3]);
      });
      return it("Should allow for a collection to be passed in", function() {
        var without;
        without = collectionA.without(new CollectionA([model_a1, model_ab]));
        expect(without.length).toBe(3);
        return expect(without).toEqual([model_a2, model_ab2, model_a3]);
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
    describe("mixin", function() {
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
        return expect(mixin_spy.firstCall.args[0]).toBe('world');
      });
      it("Should allow for models with values to be added post mixin", function() {
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
      return it("Should unwrap observables when exchanging lists", function() {
        var TheCollection, TheModel, the_first_collection, the_model, the_next_collection, _ref12, _ref13;
        TheModel = (function(_super) {
          __extends(TheModel, _super);

          function TheModel() {
            _ref12 = TheModel.__super__.constructor.apply(this, arguments);
            return _ref12;
          }

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
        the_first_collection = new TheCollection;
        the_next_collection = new TheCollection;
        the_first_collection.mixin({
          'is_read': ko.observable(false)
        });
        the_next_collection.mixin({
          'is_read': ko.observable(false)
        });
        the_model = new TheModel;
        expect(the_model.get('is_read')).not.toBeDefined();
        the_first_collection.push(the_model);
        expect(the_model.get('is_read')).toBe(false);
        the_first_collection.remove(the_model);
        expect(the_model.get('is_read')).toBe(false);
        the_next_collection.push(the_model);
        return expect(the_model.get('is_read')).toBe(false);
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
      it("Should be able to chain a without method and sort method", function() {
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
      return it("Should keep the length up to date", function() {
        var chain;
        chain = collectionA.chain();
        expect(chain.length()).toBe(5);
        expect(collectionA.length()).toBe(5);
        chain.slice(0, 3);
        expect(chain.length()).toBe(3);
        expect(collectionA.length()).toBe(5);
        chain.push(new ModelA);
        expect(chain.length()).toBe(4);
        expect(collectionA.length()).toBe(5);
        chain.unshift(new ModelA);
        expect(chain.length()).toBe(5);
        return expect(collectionA.length()).toBe(5);
      });
    });
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Falcon.View", function() {
    beforeEach(function() {
      Falcon.baseTemplateUrl = "";
      return Falcon.templateAdapter.resetCache();
    });
    describe("constructor", function() {
      beforeEach(function() {
        spyOn(Falcon.View.prototype, 'initialize');
        return spyOn(Falcon.templateAdapter, 'resolveTemplate');
      });
      it("Should call the correct methods by default", function() {
        var callback, view;
        view = new (Falcon.View.extend({
          endpoint: "#hello_world"
        }));
        expect(Falcon.View.prototype.initialize.calls.count()).toBe(1);
        expect(Falcon.View.prototype.initialize).toHaveBeenCalledWith();
        expect(Falcon.templateAdapter.resolveTemplate.calls.count()).toBe(1);
        expect(Falcon.templateAdapter.resolveTemplate).toHaveBeenCalledWith(view, jasmine.any(Function));
        callback = Falcon.templateAdapter.resolveTemplate.calls.argsFor(0)[1];
        callback("Some Template");
        return expect(view.__falcon_view__loaded_template__()).toBe("Some Template");
      });
      return it("Should recognize pre-defined templates", function() {
        var view;
        view = new (Falcon.View.extend({
          endpoint: "#hello_world",
          template: "Hello Template"
        }));
        expect(Falcon.View.prototype.initialize.calls.count()).toBe(1);
        expect(Falcon.View.prototype.initialize).toHaveBeenCalledWith();
        expect(Falcon.templateAdapter.resolveTemplate).not.toHaveBeenCalled();
        return expect(view.__falcon_view__loaded_template__()).toBe("Hello Template");
      });
    });
    describe("makeUrl", function() {
      var view;
      view = null;
      beforeEach(function() {
        spyOn(Falcon.templateAdapter, 'resolveTemplate');
        spyOn(Falcon.templateAdapter, 'makeUrl').and.returnValue("http://www.falconjs.com/hello_world.tmpl");
        return view = new Falcon.View;
      });
      return it("Should call the makeUrl method on the template adapter", function() {
        var ret;
        ret = view.makeUrl();
        expect(Falcon.templateAdapter.makeUrl.calls.count()).toBe(1);
        expect(Falcon.templateAdapter.makeUrl).toHaveBeenCalledWith(view);
        return expect(ret).toBe("http://www.falconjs.com/hello_world.tmpl");
      });
    });
    return describe("createViewModel", function() {
      var FullView, _ref;
      FullView = (function(_super) {
        __extends(FullView, _super);

        function FullView() {
          _ref = FullView.__super__.constructor.apply(this, arguments);
          return _ref;
        }

        FullView.prototype.endpoint = 'full_view';

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
        viewModel = view.createViewModel();
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
        model1 = view.createViewModel();
        model2 = view.createViewModel();
        return expect(model1).toEqual(model2);
      });
    });
  });

}).call(this);

(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Bindings", function() {
    describe("view", function() {
      var view_binding;
      view_binding = Falcon.getBinding('view');
      beforeEach(function() {
        spyOn(ko.virtualElements, 'emptyNode').and.callThrough();
        spyOn(Falcon.View.prototype, '_render').and.callThrough();
        spyOn(Falcon.View.prototype, '_unrender').and.callThrough();
        return spyOn(Falcon, 'ready');
      });
      describe("Basic Exception Cases", function() {
        it("Should initialize correctly, but empty the node if a view isn't given", function() {
          var element, test_view;
          test_view = {};
          element = MockHelper.makeElement().bindings("view: test_view").html("Hello World").andApply({
            test_view: test_view
          });
          expect(ko.virtualElements.emptyNode.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode).toHaveBeenCalledWith(element);
          expect(Falcon.View.prototype._render).not.toHaveBeenCalled();
          expect(Falcon.View.prototype._unrender).not.toHaveBeenCalled();
          return expect(element.innerHTML).toBe("");
        });
        it("Should initialize correctly, but empty the node if the view is already loaded", function() {
          var element, test_view;
          test_view = new Falcon.View();
          test_view.__falcon_view__is_loaded__(false);
          element = MockHelper.makeElement().bindings("view: test_view").html("Hello World").andApply({
            test_view: test_view
          });
          expect(ko.virtualElements.emptyNode.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode).toHaveBeenCalledWith(element);
          expect(Falcon.View.prototype._render).not.toHaveBeenCalled();
          expect(Falcon.View.prototype._unrender).not.toHaveBeenCalled();
          return expect(element.innerHTML).toBe("");
        });
        return it("Should initialize correctly, but empty the node if given an empty template", function() {
          var element, test_view;
          test_view = new Falcon.View();
          test_view.__falcon_view__is_loaded__(true);
          test_view.template = jasmine.createSpy("Template Spy").and.returnValue("");
          element = MockHelper.makeElement().bindings("view: test_view").html("Hello World").andApply({
            test_view: test_view
          });
          expect(test_view.template.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode).toHaveBeenCalledWith(element);
          expect(Falcon.View.prototype._render).not.toHaveBeenCalled();
          expect(Falcon.View.prototype._unrender).not.toHaveBeenCalled();
          return expect(element.innerHTML).toBe("");
        });
      });
      describe("Observable Exception Cases", function() {
        it("Should initialize correctly with observable, but empty the node if a view isn't given", function() {
          var element, test_view;
          test_view = {};
          element = MockHelper.makeElement().bindings("view: test_view").html("Hello World").andApply({
            test_view: ko.observable(test_view)
          });
          expect(ko.virtualElements.emptyNode.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode).toHaveBeenCalledWith(element);
          expect(Falcon.View.prototype._render).not.toHaveBeenCalled();
          expect(Falcon.View.prototype._unrender).not.toHaveBeenCalled();
          return expect(element.innerHTML).toBe("");
        });
        it("Should initialize correctly with observable, but empty the node if the view is already loaded", function() {
          var element, test_view;
          test_view = new Falcon.View();
          test_view.__falcon_view__is_loaded__(false);
          element = MockHelper.makeElement().bindings("view: test_view").html("Hello World").andApply({
            test_view: ko.observable(test_view)
          });
          expect(ko.virtualElements.emptyNode.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode).toHaveBeenCalledWith(element);
          expect(Falcon.View.prototype._render).not.toHaveBeenCalled();
          expect(Falcon.View.prototype._unrender).not.toHaveBeenCalled();
          return expect(element.innerHTML).toBe("");
        });
        return it("Should initialize correctly with observable, but empty the node if given an empty template", function() {
          var element, test_view;
          test_view = new Falcon.View();
          test_view.__falcon_view__is_loaded__(true);
          test_view.template = jasmine.createSpy("Template Spy").and.returnValue("");
          element = MockHelper.makeElement().bindings("view: test_view").html("Hello World").andApply({
            test_view: ko.observable(test_view)
          });
          expect(test_view.template.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode).toHaveBeenCalledWith(element);
          expect(Falcon.View.prototype._render).not.toHaveBeenCalled();
          expect(Falcon.View.prototype._unrender).not.toHaveBeenCalled();
          return expect(element.innerHTML).toBe("");
        });
      });
      describe("Basic Usage", function() {
        var element, view;
        view = null;
        element = null;
        it("Setup", function() {
          var hello_world;
          return hello_world = MockHelper.makeElement("template").setId("hello_world").html("Hello World").addToDOM();
        });
        it("Should setup the view binding properly with a basic view", function() {
          view = MockHelper.makeView("#hello_world").triggerReady();
          element = MockHelper.makeElement().bindings("view: view").addToDOM().andApply({
            view: view
          });
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view._render.calls.count()).toBe(1);
          expect(view.display.calls.count()).toBe(1);
          expect(view._unrender).not.toHaveBeenCalled();
          expect(view.dispose).not.toHaveBeenCalled();
          expect(element.innerHTML).toBe("Hello World");
          return view.resetSpies();
        });
        it("Should unrender properly when removed from the DOM", function() {
          element.removeFromDOM();
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view._render).not.toHaveBeenCalled();
          expect(view.display).not.toHaveBeenCalled();
          expect(view._unrender.calls.count()).toBe(1);
          return expect(view.dispose.calls.count()).toBe(1);
        });
        return it("Teardown", function() {
          return Falcon.View.resetCache();
        });
      });
      describe("Basic Observable Usage", function() {
        var element, obs, view_a, view_b;
        obs = ko.observable();
        element = null;
        view_a = view_b = null;
        it("Setup", function() {
          var foo_bar, hello_world;
          hello_world = MockHelper.makeElement("template").setId("hello_world").html("Hello World").addToDOM();
          return foo_bar = MockHelper.makeElement("template").setId("foo_bar").html("Foo Bar").addToDOM();
        });
        it("Should apply blank observable properly", function() {
          element = MockHelper.makeElement().bindings("view: obs").addToDOM().andApply({
            obs: obs
          });
          expect(ko.virtualElements.emptyNode.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode).toHaveBeenCalledWith(element);
          return expect(element.innerHTML).toBe("");
        });
        it("Should update the template when a valid view with template is given", function() {
          view_a = MockHelper.makeView("#hello_world").triggerReady();
          obs(view_a);
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render.calls.count()).toBe(1);
          expect(view_a.display.calls.count()).toBe(1);
          expect(view_a._unrender).not.toHaveBeenCalled();
          expect(view_a.dispose).not.toHaveBeenCalled();
          expect(element.innerHTML).toBe("Hello World");
          return view_a.resetSpies();
        });
        it("Should swap views properly", function() {
          view_b = MockHelper.makeView("#foo_bar").triggerReady();
          obs(view_b);
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render).not.toHaveBeenCalled();
          expect(view_a.display).not.toHaveBeenCalled();
          expect(view_a._unrender.calls.count()).toBe(1);
          expect(view_a.dispose.calls.count()).toBe(1);
          expect(view_b._render.calls.count()).toBe(1);
          expect(view_b.display.calls.count()).toBe(1);
          expect(view_b._unrender).not.toHaveBeenCalled();
          expect(view_b.dispose).not.toHaveBeenCalled();
          expect(element.innerHTML).toBe("Foo Bar");
          view_a.resetSpies();
          return view_b.resetSpies();
        });
        it("Should unrender properly when removed from the DOM", function() {
          element.removeFromDOM();
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render).not.toHaveBeenCalled();
          expect(view_a.display).not.toHaveBeenCalled();
          expect(view_a._unrender).not.toHaveBeenCalled();
          expect(view_a.dispose).not.toHaveBeenCalled();
          expect(view_b._render).not.toHaveBeenCalled();
          expect(view_b.display).not.toHaveBeenCalled();
          expect(view_b._unrender.calls.count()).toBe(1);
          return expect(view_b.dispose.calls.count()).toBe(1);
        });
        return it("Teardown", function() {
          return Falcon.View.resetCache();
        });
      });
      describe("Basic Comment Binding Usage", function() {
        var comment, view;
        comment = null;
        view = null;
        it("Setup", function() {
          var hello_world;
          return hello_world = MockHelper.makeElement("template").setId("hello_world").html("Hello World").addToDOM();
        });
        it("Should setup the view binding properly with basic view", function() {
          view = MockHelper.makeView("hello_world").triggerReady();
          comment = MockHelper.makeCommentBinding("view: view").addToDOM().andApply({
            view: view
          });
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view._render.calls.count()).toBe(1);
          expect(view.display.calls.count()).toBe(1);
          expect(view._unrender).not.toHaveBeenCalled();
          expect(view.dispose).not.toHaveBeenCalled();
          expect(comment.getInnerHTML()).toBe("Hello World");
          return view.resetSpies();
        });
        it("Should unrender properly when removed from the DOM", function() {
          comment.removeFromDOM();
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view._render).not.toHaveBeenCalled();
          expect(view.display).not.toHaveBeenCalled();
          expect(view._unrender.calls.count()).toBe(1);
          return expect(view.dispose.calls.count()).toBe(1);
        });
        return it("Teardown", function() {
          return Falcon.View.resetCache();
        });
      });
      describe("Basic Observable Comment Binding Usage", function() {
        var comment, obs, view_a, view_b;
        obs = ko.observable();
        comment = null;
        view_a = view_b = null;
        it("Setup", function() {
          var foo_bar, hello_world;
          hello_world = MockHelper.makeElement("template").setId("hello_world").html("Hello World").addToDOM();
          return foo_bar = MockHelper.makeElement("template").setId("foo_bar").html("Foo Bar").addToDOM();
        });
        it("Should apply blank observable properly", function() {
          comment = MockHelper.makeCommentBinding("view: obs").addToDOM().andApply({
            obs: obs
          });
          expect(ko.virtualElements.emptyNode.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode).toHaveBeenCalledWith(comment.start_comment);
          return expect(comment.getInnerHTML()).toBe("");
        });
        it("Should update the template when a valid view with template is given", function() {
          view_a = MockHelper.makeView("#hello_world").triggerReady();
          obs(view_a);
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render.calls.count()).toBe(1);
          expect(view_a.display.calls.count()).toBe(1);
          expect(view_a._unrender).not.toHaveBeenCalled();
          expect(view_a.dispose).not.toHaveBeenCalled();
          expect(comment.getInnerHTML()).toBe("Hello World");
          return view_a.resetSpies();
        });
        it("Should swap views properly", function() {
          view_b = MockHelper.makeView("#foo_bar").triggerReady();
          obs(view_b);
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render).not.toHaveBeenCalled();
          expect(view_a.display).not.toHaveBeenCalled();
          expect(view_a._unrender.calls.count()).toBe(1);
          expect(view_a.dispose.calls.count()).toBe(1);
          expect(view_b._render.calls.count()).toBe(1);
          expect(view_b.display.calls.count()).toBe(1);
          expect(view_b._unrender).not.toHaveBeenCalled();
          expect(view_b.dispose).not.toHaveBeenCalled();
          expect(comment.getInnerHTML()).toBe("Foo Bar");
          view_a.resetSpies();
          return view_b.resetSpies();
        });
        it("Should unrender properly when removed from the DOM", function() {
          comment.removeFromDOM();
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render).not.toHaveBeenCalled();
          expect(view_a.display).not.toHaveBeenCalled();
          expect(view_a._unrender).not.toHaveBeenCalled();
          expect(view_a.dispose).not.toHaveBeenCalled();
          expect(view_b._render).not.toHaveBeenCalled();
          expect(view_b.display).not.toHaveBeenCalled();
          expect(view_b._unrender.calls.count()).toBe(1);
          return expect(view_b.dispose.calls.count()).toBe(1);
        });
        return it("Teardown", function() {
          return Falcon.View.resetCache();
        });
      });
      describe("Basic Nested Usage", function() {
        var element, parent_view, view;
        view = null;
        parent_view = null;
        element = null;
        it("Setup", function() {
          MockHelper.makeElement("template").setId("parent_template").html("<div data-bind='view: $view.child_view'></div>").addToDOM();
          return MockHelper.makeElement("template").setId("hello_world").html("Hello World").addToDOM();
        });
        it("Should setup the view binding properly with a basic view", function() {
          view = MockHelper.makeView("#hello_world").triggerReady();
          parent_view = MockHelper.makeView("#parent_template").triggerReady();
          parent_view.child_view = view;
          element = MockHelper.makeElement().bindings("view: view").addToDOM().andApply({
            view: parent_view
          });
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(parent_view._render.calls.count()).toBe(1);
          expect(parent_view.display.calls.count()).toBe(1);
          expect(parent_view._unrender).not.toHaveBeenCalled();
          expect(parent_view.dispose).not.toHaveBeenCalled();
          expect(view._render.calls.count()).toBe(1);
          expect(view.display.calls.count()).toBe(1);
          expect(view._unrender).not.toHaveBeenCalled();
          expect(view.dispose).not.toHaveBeenCalled();
          parent_view.resetSpies();
          return view.resetSpies();
        });
        it("Should unrender properly when removed from the DOM", function() {
          element.removeFromDOM();
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(parent_view._render).not.toHaveBeenCalled();
          expect(parent_view.display).not.toHaveBeenCalled();
          expect(parent_view._unrender.calls.count()).toBe(1);
          expect(parent_view.dispose.calls.count()).toBe(1);
          expect(view._render).not.toHaveBeenCalled();
          expect(view.display).not.toHaveBeenCalled();
          expect(view._unrender.calls.count()).toBe(1);
          return expect(view.dispose.calls.count()).toBe(1);
        });
        return it("Teardown", function() {
          return Falcon.View.resetCache();
        });
      });
      describe("Basic Nested Observable Usage", function() {
        var element, obs, view_a, view_b;
        obs = ko.observable();
        element = null;
        view_a = view_b = null;
        it("Setup", function() {
          MockHelper.makeElement("template").setId("parent_template").html("<div data-bind='view: $view.child_view'></div>").addToDOM();
          MockHelper.makeElement("template").setId("hello_world").html("Hello World").addToDOM();
          return MockHelper.makeElement("template").setId("foo_bar").html("Foo Bar").addToDOM();
        });
        it("Should apply blank observable properly", function() {
          element = MockHelper.makeElement().bindings("view: obs").addToDOM().andApply({
            obs: obs
          });
          expect(ko.virtualElements.emptyNode.calls.count()).toBe(1);
          expect(ko.virtualElements.emptyNode).toHaveBeenCalledWith(element);
          return expect(element.innerHTML).toBe("");
        });
        it("Should update the template when a valid view with template is given", function() {
          view_a = MockHelper.makeView("#parent_template").triggerReady();
          view_a.child_view = MockHelper.makeView("#hello_world").triggerReady();
          obs(view_a);
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render.calls.count()).toBe(1);
          expect(view_a.display.calls.count()).toBe(1);
          expect(view_a._unrender).not.toHaveBeenCalled();
          expect(view_a.dispose).not.toHaveBeenCalled();
          expect(view_a.child_view._render.calls.count()).toBe(1);
          expect(view_a.child_view.display.calls.count()).toBe(1);
          expect(view_a.child_view._unrender).not.toHaveBeenCalled();
          expect(view_a.child_view.dispose).not.toHaveBeenCalled();
          view_a.resetSpies();
          return view_a.child_view.resetSpies();
        });
        it("Should swap views properly", function() {
          view_b = MockHelper.makeView("#parent_template").triggerReady();
          view_b.child_view = MockHelper.makeView("#hello_world").triggerReady();
          obs(view_b);
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render).not.toHaveBeenCalled();
          expect(view_a.display).not.toHaveBeenCalled();
          expect(view_a._unrender.calls.count()).toBe(1);
          expect(view_a.dispose.calls.count()).toBe(1);
          expect(view_a.child_view._render).not.toHaveBeenCalled();
          expect(view_a.child_view.display).not.toHaveBeenCalled();
          expect(view_a.child_view._unrender.calls.count()).toBe(1);
          expect(view_a.child_view.dispose.calls.count()).toBe(1);
          expect(view_b._render.calls.count()).toBe(1);
          expect(view_b.display.calls.count()).toBe(1);
          expect(view_b._unrender).not.toHaveBeenCalled();
          expect(view_b.dispose).not.toHaveBeenCalled();
          expect(view_b.child_view._render.calls.count()).toBe(1);
          expect(view_b.child_view.display.calls.count()).toBe(1);
          expect(view_b.child_view._unrender).not.toHaveBeenCalled();
          expect(view_b.child_view.dispose).not.toHaveBeenCalled();
          view_a.resetSpies();
          view_a.child_view.resetSpies();
          view_b.resetSpies();
          return view_b.child_view.resetSpies();
        });
        it("Should unrender properly when removed from the DOM", function() {
          element.removeFromDOM();
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render).not.toHaveBeenCalled();
          expect(view_a.display).not.toHaveBeenCalled();
          expect(view_a._unrender).not.toHaveBeenCalled();
          expect(view_a.dispose).not.toHaveBeenCalled();
          expect(view_a.child_view._render).not.toHaveBeenCalled();
          expect(view_a.child_view.display).not.toHaveBeenCalled();
          expect(view_a.child_view._unrender).not.toHaveBeenCalled();
          expect(view_a.child_view.dispose).not.toHaveBeenCalled();
          expect(view_b._render).not.toHaveBeenCalled();
          expect(view_b.display).not.toHaveBeenCalled();
          expect(view_b._unrender.calls.count()).toBe(1);
          expect(view_b.dispose.calls.count()).toBe(1);
          expect(view_b.child_view._render).not.toHaveBeenCalled();
          expect(view_b.child_view.display).not.toHaveBeenCalled();
          expect(view_b.child_view._unrender.calls.count()).toBe(1);
          return expect(view_b.child_view.dispose.calls.count()).toBe(1);
        });
        return it("Teardown", function() {
          return Falcon.View.resetCache();
        });
      });
      describe("Basic Nested Comment Usage", function() {
        var comment, parent_view, view;
        view = null;
        parent_view = null;
        comment = null;
        it("Setup", function() {
          MockHelper.makeElement("template").setId("parent_template").html("<div data-bind='view: $view.child_view'></div>").addToDOM();
          return MockHelper.makeElement("template").setId("hello_world").html("Hello World").addToDOM();
        });
        it("Should setup the view binding properly with a basic view", function() {
          view = MockHelper.makeView("#hello_world").triggerReady();
          parent_view = MockHelper.makeView("#parent_template").triggerReady();
          parent_view.child_view = view;
          comment = MockHelper.makeCommentBinding("view: view").addToDOM().andApply({
            view: parent_view
          });
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(parent_view._render.calls.count()).toBe(1);
          expect(parent_view.display.calls.count()).toBe(1);
          expect(parent_view._unrender).not.toHaveBeenCalled();
          expect(parent_view.dispose).not.toHaveBeenCalled();
          expect(view._render.calls.count()).toBe(1);
          expect(view.display.calls.count()).toBe(1);
          expect(view._unrender).not.toHaveBeenCalled();
          expect(view.dispose).not.toHaveBeenCalled();
          parent_view.resetSpies();
          return view.resetSpies();
        });
        it("Should unrender properly when removed from the DOM", function() {
          comment.removeFromDOM();
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(parent_view._render).not.toHaveBeenCalled();
          expect(parent_view.display).not.toHaveBeenCalled();
          expect(parent_view._unrender.calls.count()).toBe(1);
          expect(parent_view.dispose.calls.count()).toBe(1);
          expect(view._render).not.toHaveBeenCalled();
          expect(view.display).not.toHaveBeenCalled();
          expect(view._unrender.calls.count()).toBe(1);
          return expect(view.dispose.calls.count()).toBe(1);
        });
        return it("Teardown", function() {
          return Falcon.View.resetCache();
        });
      });
      describe("Basic Nested Comment Observable Usage", function() {
        var comment, obs, view_a, view_b;
        obs = ko.observable();
        comment = null;
        view_a = view_b = null;
        it("Setup", function() {
          MockHelper.makeElement("template").setId("parent_template").html("<div data-bind='view: $view.child_view'></div>").addToDOM();
          MockHelper.makeElement("template").setId("hello_world").html("Hello World").addToDOM();
          return MockHelper.makeElement("template").setId("foo_bar").html("Foo Bar").addToDOM();
        });
        it("Should apply blank observable properly", function() {
          comment = MockHelper.makeCommentBinding("view: obs").addToDOM().andApply({
            obs: obs
          });
          expect(ko.virtualElements.emptyNode.calls.count()).toBe(1);
          return expect(ko.virtualElements.emptyNode).toHaveBeenCalledWith(comment.start_comment);
        });
        it("Should update the template when a valid view with template is given", function() {
          view_a = MockHelper.makeView("#parent_template").triggerReady();
          view_a.child_view = MockHelper.makeView("#hello_world").triggerReady();
          obs(view_a);
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render.calls.count()).toBe(1);
          expect(view_a.display.calls.count()).toBe(1);
          expect(view_a._unrender).not.toHaveBeenCalled();
          expect(view_a.dispose).not.toHaveBeenCalled();
          expect(view_a.child_view._render.calls.count()).toBe(1);
          expect(view_a.child_view.display.calls.count()).toBe(1);
          expect(view_a.child_view._unrender).not.toHaveBeenCalled();
          expect(view_a.child_view.dispose).not.toHaveBeenCalled();
          view_a.resetSpies();
          return view_a.child_view.resetSpies();
        });
        it("Should swap views properly", function() {
          view_b = MockHelper.makeView("#parent_template").triggerReady();
          view_b.child_view = MockHelper.makeView("#hello_world").triggerReady();
          obs(view_b);
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render).not.toHaveBeenCalled();
          expect(view_a.display).not.toHaveBeenCalled();
          expect(view_a._unrender.calls.count()).toBe(1);
          expect(view_a.dispose.calls.count()).toBe(1);
          expect(view_a.child_view._render).not.toHaveBeenCalled();
          expect(view_a.child_view.display).not.toHaveBeenCalled();
          expect(view_a.child_view._unrender.calls.count()).toBe(1);
          expect(view_a.child_view.dispose.calls.count()).toBe(1);
          expect(view_b._render.calls.count()).toBe(1);
          expect(view_b.display.calls.count()).toBe(1);
          expect(view_b._unrender).not.toHaveBeenCalled();
          expect(view_b.dispose).not.toHaveBeenCalled();
          expect(view_b.child_view._render.calls.count()).toBe(1);
          expect(view_b.child_view.display.calls.count()).toBe(1);
          expect(view_b.child_view._unrender).not.toHaveBeenCalled();
          expect(view_b.child_view.dispose).not.toHaveBeenCalled();
          view_a.resetSpies();
          view_a.child_view.resetSpies();
          view_b.resetSpies();
          return view_b.child_view.resetSpies();
        });
        it("Should unrender properly when removed from the DOM", function() {
          comment.removeFromDOM();
          expect(ko.virtualElements.emptyNode).not.toHaveBeenCalled();
          expect(view_a._render).not.toHaveBeenCalled();
          expect(view_a.display).not.toHaveBeenCalled();
          expect(view_a._unrender).not.toHaveBeenCalled();
          expect(view_a.dispose).not.toHaveBeenCalled();
          expect(view_a.child_view._render).not.toHaveBeenCalled();
          expect(view_a.child_view.display).not.toHaveBeenCalled();
          expect(view_a.child_view._unrender).not.toHaveBeenCalled();
          expect(view_a.child_view.dispose).not.toHaveBeenCalled();
          expect(view_b._render).not.toHaveBeenCalled();
          expect(view_b.display).not.toHaveBeenCalled();
          expect(view_b._unrender.calls.count()).toBe(1);
          expect(view_b.dispose.calls.count()).toBe(1);
          expect(view_b.child_view._render).not.toHaveBeenCalled();
          expect(view_b.child_view.display).not.toHaveBeenCalled();
          expect(view_b.child_view._unrender.calls.count()).toBe(1);
          return expect(view_b.child_view.dispose.calls.count()).toBe(1);
        });
        return it("Teardown", function() {
          return Falcon.View.resetCache();
        });
      });
      return describe("Nest Views in Observable Arrays with Element Bindings", function() {
        var child_view, element, obsArr, parent_view;
        element = null;
        obsArr = ko.observableArray([]);
        parent_view = null;
        child_view = null;
        beforeEach(function() {
          if (parent_view != null) {
            parent_view.resetSpies();
          }
          return child_view != null ? child_view.resetSpies() : void 0;
        });
        it("Should set up properly", function() {
          MockHelper.makeElement("template").setId("parent_template").html("<div data-bind='view: $view.child_view'></div>").addToDOM();
          MockHelper.makeElement("template").setId("hello_world").html("Hello World").addToDOM();
          element = MockHelper.makeElement().bindings("foreach: obsArr").html("<div data-bind='view: $data'></div>").addToDOM().andApply({
            obsArr: obsArr
          });
          parent_view = MockHelper.makeView("#parent_template", {
            defaults: {
              'child_view': function() {
                child_view = MockHelper.makeView("#hello_world").triggerReady();
                return child_view;
              }
            }
          }).triggerReady();
          expect(parent_view._render).not.toHaveBeenCalled();
          expect(parent_view.display).not.toHaveBeenCalled();
          expect(parent_view._unrender).not.toHaveBeenCalled();
          expect(parent_view.dispose).not.toHaveBeenCalled();
          expect(child_view._render).not.toHaveBeenCalled();
          expect(child_view.display).not.toHaveBeenCalled();
          expect(child_view._unrender).not.toHaveBeenCalled();
          return expect(child_view.dispose).not.toHaveBeenCalled();
        });
        it("Should call the correct display and dispose methods of sub views", function() {
          obsArr.push(parent_view);
          expect(parent_view._render.calls.count()).toBe(1);
          expect(parent_view.display.calls.count()).toBe(1);
          expect(parent_view._unrender).not.toHaveBeenCalled();
          expect(parent_view.dispose).not.toHaveBeenCalled();
          expect(child_view._render.calls.count()).toBe(1);
          expect(child_view.display.calls.count()).toBe(1);
          expect(child_view._unrender).not.toHaveBeenCalled();
          return expect(child_view.dispose).not.toHaveBeenCalled();
        });
        it("Should call the correct display and dispose methods of the sub views when removed", function() {
          obsArr([]);
          expect(parent_view._render).not.toHaveBeenCalled();
          expect(parent_view.display).not.toHaveBeenCalled();
          expect(parent_view._unrender.calls.count()).toBe(1);
          expect(parent_view.dispose.calls.count()).toBe(1);
          expect(child_view._render).not.toHaveBeenCalled();
          expect(child_view.display).not.toHaveBeenCalled();
          expect(child_view._unrender.calls.count()).toBe(1);
          return expect(child_view.dispose.calls.count()).toBe(1);
        });
        return it("Teardown", function() {
          element.removeFromDOM();
          return Falcon.View.resetCache();
        });
      });
    });
    describe("foreach", function() {
      var foreach_binding;
      foreach_binding = null;
      beforeEach(function() {
        if (foreach_binding == null) {
          foreach_binding = Falcon.__binding__original_foreach__;
        }
        spyOn(foreach_binding, 'init').and.callThrough();
        return spyOn(foreach_binding, 'update').and.callThrough();
      });
      describe("Basic Array", function() {
        var afterAdd, afterRender, beforeRemove, items, setupSpies;
        items = null;
        afterAdd = beforeRemove = afterRender = null;
        setupSpies = function() {
          afterAdd = jasmine.createSpy("afterAdd");
          beforeRemove = jasmine.createSpy("beforeRemove").and.callFake(function(element) {
            var _ref;
            return (_ref = element.parentNode) != null ? _ref.removeChild(element) : void 0;
          });
          return afterRender = jasmine.createSpy("afterRender");
        };
        beforeEach(function() {
          items = [
            {
              text: "Hello World"
            }, {
              text: "Foo Bar"
            }, {
              text: "Free Bird"
            }
          ];
          if (afterAdd != null) {
            afterAdd.calls.reset();
          }
          if (beforeRemove != null) {
            beforeRemove.calls.reset();
          }
          return afterRender != null ? afterRender.calls.reset() : void 0;
        });
        it("Should bind properly against an array", function() {
          var element;
          element = MockHelper.makeElement("ul").bindings("foreach: items").html("<li data-bind='text: text'></li>").andApply({
            items: items
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Foo Bar");
          expect(element.childNodes[2].innerText).toBe("Free Bird");
          expect(foreach_binding.init.calls.count()).toBe(1);
          return expect(foreach_binding.update.calls.count()).toBe(1);
        });
        return it("Should bind properly against an array with an expanded binding defintiion", function() {
          var element;
          setupSpies();
          element = MockHelper.makeElement("ul").bindings("foreach: {				                    	data: items,				                    	afterAdd: afterAdd,				                    	beforeRemove: beforeRemove,				                    	afterRender: afterRender				                    }").html("<li data-bind='text: text'></li>").andApply({
            items: items,
            afterAdd: afterAdd,
            beforeRemove: beforeRemove,
            afterRender: afterRender
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Foo Bar");
          expect(element.childNodes[2].innerText).toBe("Free Bird");
          expect(afterAdd).not.toHaveBeenCalled();
          expect(afterRender.calls.count()).toBe(3);
          expect(beforeRemove).not.toHaveBeenCalled();
          expect(foreach_binding.init.calls.count()).toBe(1);
          return expect(foreach_binding.update.calls.count()).toBe(1);
        });
      });
      describe("Observable Array", function() {
        var afterAdd, afterRender, beforeRemove, element, items, setupItems, setupSpies;
        items = null;
        element = null;
        afterAdd = beforeRemove = afterRender = null;
        setupItems = function() {
          return items = ko.observableArray([
            {
              text: "Hello World"
            }, {
              text: "Foo Bar"
            }, {
              text: "Free Bird"
            }
          ]);
        };
        setupSpies = function() {
          afterAdd = jasmine.createSpy("afterAdd");
          beforeRemove = jasmine.createSpy("beforeRemove").and.callFake(function(element) {
            var _ref;
            return (_ref = element.parentNode) != null ? _ref.removeChild(element) : void 0;
          });
          return afterRender = jasmine.createSpy("afterRender");
        };
        beforeEach(function() {
          if (afterAdd != null) {
            afterAdd.calls.reset();
          }
          if (beforeRemove != null) {
            beforeRemove.calls.reset();
          }
          return afterRender != null ? afterRender.calls.reset() : void 0;
        });
        it("Should bind properly against an array", function() {
          setupItems();
          element = MockHelper.makeElement("ul").bindings("foreach: items").html("<li data-bind='text: text'></li>").andApply({
            items: items
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Foo Bar");
          expect(element.childNodes[2].innerText).toBe("Free Bird");
          expect(foreach_binding.init.calls.count()).toBe(1);
          return expect(foreach_binding.update.calls.count()).toBe(1);
        });
        it("Should remove elements", function() {
          items.pop();
          items.pop();
          expect(element.childNodes.length).toBe(1);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(foreach_binding.init.calls.count()).toBe(0);
          return expect(foreach_binding.update.calls.count()).toBe(2);
        });
        it("Should add elements", function() {
          items.push({
            text: "Qux"
          });
          items.push({
            text: "Quux"
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Qux");
          expect(element.childNodes[2].innerText).toBe("Quux");
          expect(foreach_binding.init.calls.count()).toBe(0);
          return expect(foreach_binding.update.calls.count()).toBe(2);
        });
        it("Should bind properly against an array with an expanded binding defintiion", function() {
          setupItems();
          setupSpies();
          element = MockHelper.makeElement("ul").bindings("foreach: {				                    	data: items,				                    	afterAdd: afterAdd,				                    	beforeRemove: beforeRemove,				                    	afterRender: afterRender				                    }").html("<li data-bind='text: text'></li>").andApply({
            items: items,
            afterAdd: afterAdd,
            beforeRemove: beforeRemove,
            afterRender: afterRender
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Foo Bar");
          expect(element.childNodes[2].innerText).toBe("Free Bird");
          expect(afterAdd).not.toHaveBeenCalled();
          expect(afterRender.calls.count()).toBe(3);
          expect(beforeRemove).not.toHaveBeenCalled();
          expect(foreach_binding.init.calls.count()).toBe(1);
          return expect(foreach_binding.update.calls.count()).toBe(1);
        });
        it("Should remove elements with expanded definition", function() {
          items.pop();
          items.pop();
          expect(element.childNodes.length).toBe(1);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(afterAdd).not.toHaveBeenCalled();
          expect(afterRender).not.toHaveBeenCalled();
          expect(beforeRemove.calls.count()).toBe(2);
          expect(foreach_binding.init.calls.count()).toBe(0);
          return expect(foreach_binding.update.calls.count()).toBe(2);
        });
        return it("Should add elements with expanded definition", function() {
          items.push({
            text: "Qux"
          });
          items.push({
            text: "Quux"
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Qux");
          expect(element.childNodes[2].innerText).toBe("Quux");
          expect(afterAdd.calls.count()).toBe(2);
          expect(afterRender.calls.count()).toBe(2);
          expect(beforeRemove).not.toHaveBeenCalled();
          expect(foreach_binding.init.calls.count()).toBe(0);
          return expect(foreach_binding.update.calls.count()).toBe(2);
        });
      });
      return describe("Collection", function() {
        var TestCollection, TestModel, afterAdd, afterRender, beforeRemove, element, items, setupItems, setupSpies, _ref, _ref1;
        TestModel = (function(_super) {
          __extends(TestModel, _super);

          function TestModel() {
            _ref = TestModel.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          return TestModel;

        })(Falcon.Model);
        TestCollection = (function(_super) {
          __extends(TestCollection, _super);

          function TestCollection() {
            _ref1 = TestCollection.__super__.constructor.apply(this, arguments);
            return _ref1;
          }

          TestCollection.prototype.model = TestModel;

          return TestCollection;

        })(Falcon.Collection);
        items = null;
        element = null;
        afterAdd = beforeRemove = afterRender = null;
        setupItems = function() {
          return items = new TestCollection([
            new TestModel({
              text: "Hello World"
            }), new TestModel({
              text: "Foo Bar"
            }), new TestModel({
              text: "Free Bird"
            })
          ]);
        };
        setupSpies = function() {
          afterAdd = jasmine.createSpy("afterAdd");
          beforeRemove = jasmine.createSpy("beforeRemove").and.callFake(function(element) {
            var _ref2;
            return (_ref2 = element.parentNode) != null ? _ref2.removeChild(element) : void 0;
          });
          return afterRender = jasmine.createSpy("afterRender");
        };
        beforeEach(function() {
          if (afterAdd != null) {
            afterAdd.calls.reset();
          }
          if (beforeRemove != null) {
            beforeRemove.calls.reset();
          }
          return afterRender != null ? afterRender.calls.reset() : void 0;
        });
        it("Should bind properly against an collection", function() {
          setupItems();
          element = MockHelper.makeElement("ul").bindings("foreach: items").html("<li data-bind='text: text'></li>").andApply({
            items: items
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Foo Bar");
          expect(element.childNodes[2].innerText).toBe("Free Bird");
          expect(foreach_binding.init.calls.count()).toBe(1);
          return expect(foreach_binding.update.calls.count()).toBe(1);
        });
        it("Should remove elements", function() {
          items.pop();
          items.pop();
          expect(element.childNodes.length).toBe(1);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(foreach_binding.init.calls.count()).toBe(0);
          return expect(foreach_binding.update.calls.count()).toBe(2);
        });
        it("Should add elements", function() {
          items.push(new TestModel({
            text: "Qux"
          }));
          items.push(new TestModel({
            text: "Quux"
          }));
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Qux");
          expect(element.childNodes[2].innerText).toBe("Quux");
          expect(foreach_binding.init.calls.count()).toBe(0);
          return expect(foreach_binding.update.calls.count()).toBe(2);
        });
        it("Should bind properly against an collection with an expanded binding defintiion", function() {
          setupItems();
          setupSpies();
          element = MockHelper.makeElement("ul").bindings("foreach: {				                    	data: items,				                    	afterAdd: afterAdd,				                    	beforeRemove: beforeRemove,				                    	afterRender: afterRender				                    }").html("<li data-bind='text: text'></li>").andApply({
            items: items,
            afterAdd: afterAdd,
            beforeRemove: beforeRemove,
            afterRender: afterRender
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Foo Bar");
          expect(element.childNodes[2].innerText).toBe("Free Bird");
          expect(afterAdd).not.toHaveBeenCalled();
          expect(afterRender.calls.count()).toBe(3);
          expect(beforeRemove).not.toHaveBeenCalled();
          expect(foreach_binding.init.calls.count()).toBe(1);
          return expect(foreach_binding.update.calls.count()).toBe(1);
        });
        it("Should remove elements with expanded definition", function() {
          items.pop();
          items.pop();
          expect(element.childNodes.length).toBe(1);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(afterAdd).not.toHaveBeenCalled();
          expect(afterRender).not.toHaveBeenCalled();
          expect(beforeRemove.calls.count()).toBe(2);
          expect(foreach_binding.init.calls.count()).toBe(0);
          return expect(foreach_binding.update.calls.count()).toBe(2);
        });
        return it("Should add elements with expanded definition", function() {
          items.push(new TestModel({
            text: "Qux"
          }));
          items.push(new TestModel({
            text: "Quux"
          }));
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Qux");
          expect(element.childNodes[2].innerText).toBe("Quux");
          expect(afterAdd.calls.count()).toBe(2);
          expect(afterRender.calls.count()).toBe(2);
          expect(beforeRemove).not.toHaveBeenCalled();
          expect(foreach_binding.init.calls.count()).toBe(0);
          return expect(foreach_binding.update.calls.count()).toBe(2);
        });
      });
    });
    describe("options", function() {
      var options_binding;
      options_binding = null;
      beforeEach(function() {
        if (options_binding == null) {
          options_binding = Falcon.__binding__original_options__;
        }
        spyOn(options_binding, 'init').and.callThrough();
        return spyOn(options_binding, 'update').and.callThrough();
      });
      describe("Basic Array", function() {
        var items;
        items = null;
        beforeEach(function() {
          return items = [
            {
              text: "Hello World"
            }, {
              text: "Foo Bar"
            }, {
              text: "Free Bird"
            }
          ];
        });
        return it("Should bind properly against an array", function() {
          var element;
          element = MockHelper.makeElement("select").bindings("options: items, optionsText: 'text'").andApply({
            items: items
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Foo Bar");
          expect(element.childNodes[2].innerText).toBe("Free Bird");
          expect(options_binding.init.calls.count()).toBe(1);
          return expect(options_binding.update.calls.count()).toBe(1);
        });
      });
      describe("Observable Array", function() {
        var element, items, setupItems;
        items = null;
        element = null;
        setupItems = function() {
          return items = ko.observableArray([
            {
              text: "Hello World"
            }, {
              text: "Foo Bar"
            }, {
              text: "Free Bird"
            }
          ]);
        };
        it("Should bind properly against an array", function() {
          setupItems();
          element = MockHelper.makeElement("select").bindings("options: items, optionsText: 'text'").andApply({
            items: items
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Foo Bar");
          expect(element.childNodes[2].innerText).toBe("Free Bird");
          expect(options_binding.init.calls.count()).toBe(1);
          return expect(options_binding.update.calls.count()).toBe(1);
        });
        it("Should remove elements", function() {
          items.pop();
          items.pop();
          expect(element.childNodes.length).toBe(1);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(options_binding.init.calls.count()).toBe(0);
          return expect(options_binding.update.calls.count()).toBe(2);
        });
        return it("Should add elements", function() {
          items.push({
            text: "Qux"
          });
          items.push({
            text: "Quux"
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Qux");
          expect(element.childNodes[2].innerText).toBe("Quux");
          expect(options_binding.init.calls.count()).toBe(0);
          return expect(options_binding.update.calls.count()).toBe(2);
        });
      });
      return describe("Collection", function() {
        var TestCollection, TestModel, element, items, setupItems, _ref, _ref1;
        TestModel = (function(_super) {
          __extends(TestModel, _super);

          function TestModel() {
            _ref = TestModel.__super__.constructor.apply(this, arguments);
            return _ref;
          }

          return TestModel;

        })(Falcon.Model);
        TestCollection = (function(_super) {
          __extends(TestCollection, _super);

          function TestCollection() {
            _ref1 = TestCollection.__super__.constructor.apply(this, arguments);
            return _ref1;
          }

          TestCollection.prototype.model = TestModel;

          return TestCollection;

        })(Falcon.Collection);
        items = null;
        element = null;
        setupItems = function() {
          return items = new TestCollection([
            new TestModel({
              text: "Hello World"
            }), new TestModel({
              text: "Foo Bar"
            }), new TestModel({
              text: "Free Bird"
            })
          ]);
        };
        it("Should bind properly against an collection", function() {
          setupItems();
          element = MockHelper.makeElement("select").bindings("options: items, optionsText: 'text'").andApply({
            items: items
          });
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Foo Bar");
          expect(element.childNodes[2].innerText).toBe("Free Bird");
          expect(options_binding.init.calls.count()).toBe(1);
          return expect(options_binding.update.calls.count()).toBe(1);
        });
        it("Should remove elements", function() {
          items.pop();
          items.pop();
          expect(element.childNodes.length).toBe(1);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(options_binding.init.calls.count()).toBe(0);
          return expect(options_binding.update.calls.count()).toBe(2);
        });
        return it("Should add elements", function() {
          items.push(new TestModel({
            text: "Qux"
          }));
          items.push(new TestModel({
            text: "Quux"
          }));
          expect(element.childNodes.length).toBe(3);
          expect(element.childNodes[0].innerText).toBe("Hello World");
          expect(element.childNodes[1].innerText).toBe("Qux");
          expect(element.childNodes[2].innerText).toBe("Quux");
          expect(options_binding.init.calls.count()).toBe(0);
          return expect(options_binding.update.calls.count()).toBe(2);
        });
      });
    });
    return describe("log", function() {
      describe("Bound to Element", function() {
        var element, obs;
        element = null;
        obs = ko.observable("Foo Bar");
        beforeEach(function() {
          return spyOn(console, 'log');
        });
        it("Should log properly with basic value", function() {
          element = MockHelper.makeElement("div").bindings("log: value").andApply({
            value: "Hello World"
          });
          expect(console.log.calls.count()).toBe(1);
          return expect(console.log).toHaveBeenCalledWith("Hello World");
        });
        it("Should log properly with an observable value", function() {
          element = MockHelper.makeElement("div").bindings("log: value").andApply({
            value: obs
          });
          expect(console.log.calls.count()).toBe(1);
          return expect(console.log).toHaveBeenCalledWith("Foo Bar");
        });
        return it("Should change value", function() {
          obs("Free Bird");
          expect(console.log.calls.count()).toBe(1);
          return expect(console.log).toHaveBeenCalledWith("Free Bird");
        });
      });
      return describe("Bound to Comment", function() {
        var element, obs;
        element = null;
        obs = ko.observable("Foo Bar");
        beforeEach(function() {
          return spyOn(console, 'log');
        });
        it("Should log properly with basic value", function() {
          element = MockHelper.makeCommentBinding("log: value").andApply({
            value: "Hello World"
          });
          expect(console.log.calls.count()).toBe(1);
          return expect(console.log).toHaveBeenCalledWith("Hello World");
        });
        it("Should log properly with an observable value", function() {
          element = MockHelper.makeCommentBinding("log: value").andApply({
            value: obs
          });
          expect(console.log.calls.count()).toBe(1);
          return expect(console.log).toHaveBeenCalledWith("Foo Bar");
        });
        return it("Should change value", function() {
          obs("Free Bird");
          expect(console.log.calls.count()).toBe(1);
          return expect(console.log).toHaveBeenCalledWith("Free Bird");
        });
      });
    });
  });

}).call(this);
