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
    describe("on, off, trigger, has", function() {
      var click_one, click_two, context_two, mouseover_one;
      click_one = click_two = context_two = mouseover_one = null;
      beforeEach(function() {
        klass.on("click", (click_one = sinon.spy()));
        klass.on("click", (click_two = sinon.spy()), (context_two = {}));
        return klass.on("mouseover", (mouseover_one = sinon.spy()));
      });
      it("Should not call any of the methods before trigger", function() {
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).not.toHaveBeenCalled();
        return expect(mouseover_one).not.toHaveBeenCalled();
      });
      it("Should trigger both click routines", function() {
        klass.trigger("click", 1, 2, 3);
        expect(click_one).toHaveBeenCalledOnce();
        expect(click_one).toHaveBeenCalledWith(1, 2, 3);
        expect(click_two).toHaveBeenCalledOnce();
        expect(click_two).toHaveBeenCalledWith(1, 2, 3);
        expect(click_two).toHaveBeenCalledOn(context_two);
        return expect(mouseover_one).not.toHaveBeenCalled();
      });
      it("Should call the mouseover routine", function() {
        klass.trigger("mouseover", "go", true, {});
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).not.toHaveBeenCalled();
        expect(mouseover_one).toHaveBeenCalledOnce();
        return expect(mouseover_one).toHaveBeenCalledWith("go", true, {});
      });
      it("Should be able to find the click event methods and shouldn't have attempted to call the methods", function() {
        expect(klass.has("click", click_one)).toBe(true);
        expect(klass.has("click", click_two)).toBe(true);
        expect(klass.has("click", mouseover_one)).toBe(false);
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).not.toHaveBeenCalled();
        return expect(mouseover_one).not.toHaveBeenCalled();
      });
      it("Should be able to find the mouseover event methods", function() {
        expect(klass.has("mouseover", click_one)).toBe(false);
        expect(klass.has("mouseover", click_two)).toBe(false);
        expect(klass.has("mouseover", mouseover_one)).toBe(true);
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).not.toHaveBeenCalled();
        return expect(mouseover_one).not.toHaveBeenCalled();
      });
      return it("Should be able to remove an event properly", function() {
        klass.off("click", click_one);
        klass.trigger("click", 4, 5, 6);
        expect(click_one).not.toHaveBeenCalled();
        expect(click_two).toHaveBeenCalledOnce();
        expect(click_two).toHaveBeenCalledWith(4, 5, 6);
        return expect(mouseover_one).not.toHaveBeenCalled();
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
      return it("Should not remove any events if nothing matches", function() {
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
  describe("Falcon.Adapter", function() {
    describe("extend", function() {});
    describe("resolveRequestType", function() {
      var adapter, context, data_object, options;
      adapter = new Falcon.Adapter;
      data_object = new Falcon.Model;
      options = {};
      context = null;
      it("Should return GET if type isn't a string", function() {
        expect(adapter.resolveRequestType(data_object, null, options, context)).toBe("GET");
        return expect(adapter.resolveRequestType(data_object, 123, options, context)).toBe("GET");
      });
      it("Should return GET is type isn't GET, PUT, POST, DELETE", function() {
        return expect(adapter.resolveRequestType(data_object, "HELLO WORLD", options, context)).toBe("GET");
      });
      it("Should cast get, put, post, delete (lower case) to their proper forms", function() {
        expect(adapter.resolveRequestType(data_object, "get", options, context)).toBe("GET");
        expect(adapter.resolveRequestType(data_object, "put", options, context)).toBe("PUT");
        expect(adapter.resolveRequestType(data_object, "post", options, context)).toBe("POST");
        return expect(adapter.resolveRequestType(data_object, "delete", options, context)).toBe("DELETE");
      });
      return it("Should ignore whitespace", function() {
        expect(adapter.resolveRequestType(data_object, "  GET  ", options, context)).toBe("GET");
        expect(adapter.resolveRequestType(data_object, "  PUT  ", options, context)).toBe("PUT");
        expect(adapter.resolveRequestType(data_object, "  POST  ", options, context)).toBe("POST");
        return expect(adapter.resolveRequestType(data_object, "  DELETE  ", options, context)).toBe("DELETE");
      });
    });
    describe("resovleContext", function() {
      var adapter, context, data_object, options, type;
      adapter = new Falcon.Adapter;
      data_object = new Falcon.Model({
        id: 1
      });
      type = "GET";
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
      adapter = new Falcon.Adapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      type = "GET";
      context = {
        id: 3
      };
      beforeEach(function() {
        spyOn(adapter, 'makeUrl').and.callThrough();
        return spyOn(adapter, 'serializeData').and.callThrough();
      });
      it("Should present standard options if nothing is passed in", function() {
        var ret;
        ret = adapter.standardizeOptions(data_object, type, null, context);
        expect(ret).toEqual({
          'success': jasmine.any(Function),
          'complete': jasmine.any(Function),
          'error': jasmine.any(Function),
          'parent': data_object.parent,
          'url': jasmine.any(String),
          'data': void 0,
          'attributes': null,
          'fill_options': null
        });
        expect(adapter.makeUrl.calls.count()).toBe(1);
        expect(adapter.makeUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        return expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
      });
      it("Should maintain options that are passed in", function() {
        var attributes, complete, data, error, fill_options, options, ret, success, url;
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
        expect(ret).toEqual({
          'success': options.success,
          'complete': options.complete,
          'error': options.error,
          'parent': null,
          'url': options.url,
          'data': options.data,
          'attributes': options.attributes,
          'fill_options': fill_options
        });
        expect(adapter.makeUrl.calls.count()).toBe(1);
        expect(adapter.makeUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(ret).not.toBe(options);
        return expect(options).toEqual({
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
        var options;
        options = (function() {});
        expect(adapter.standardizeOptions(data_object, type, options, context)).toEqual({
          'success': jasmine.any(Function),
          'complete': options,
          'error': jasmine.any(Function),
          'parent': data_object.parent,
          'attributes': null,
          'url': jasmine.any(String),
          'data': void 0,
          'fill_options': null
        });
        expect(adapter.makeUrl.calls.count()).toBe(1);
        expect(adapter.makeUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        return expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
      });
      it("Should split a string into an array of attributes", function() {
        var options;
        options = "id,hello_world,title";
        expect(adapter.standardizeOptions(data_object, type, options, context)).toEqual({
          'success': jasmine.any(Function),
          'complete': jasmine.any(Function),
          'error': jasmine.any(Function),
          'parent': data_object.parent,
          'attributes': ['id', 'hello_world', 'title'],
          'url': jasmine.any(String),
          'data': void 0,
          'fill_options': null
        });
        expect(adapter.makeUrl.calls.count()).toBe(1);
        expect(adapter.makeUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        return expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
      });
      it("Should pass through an array into the attrbutes attribute of the options", function() {
        var options;
        options = ['id', 'hello_world', 'title'];
        expect(adapter.standardizeOptions(data_object, type, options, context)).toEqual({
          'success': jasmine.any(Function),
          'complete': jasmine.any(Function),
          'error': jasmine.any(Function),
          'parent': data_object.parent,
          'attributes': options,
          'url': jasmine.any(String),
          'data': void 0,
          'fill_options': null
        });
        expect(adapter.makeUrl.calls.count()).toBe(1);
        expect(adapter.makeUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
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
        expect(ret).toEqual({
          'success': jasmine.any(Function),
          'complete': jasmine.any(Function),
          'error': jasmine.any(Function),
          'parent': data_object.parent,
          'attributes': attributes,
          'url': jasmine.any(String),
          'data': void 0,
          'fill_options': null
        });
        expect(adapter.makeUrl.calls.count()).toBe(1);
        expect(adapter.makeUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(ret).not.toBe(options);
        return expect(options).toEqual({
          attributes: attributes
        });
      });
    });
    describe("makeUrl", function() {
      var adapter, context, data_object, options, parent;
      adapter = new Falcon.Adapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      context = {
        id: 3
      };
      options = {
        parent: new Falcon.Model
      };
      beforeEach(function() {
        return spyOn(data_object, 'makeUrl').and.returnValue("http://www.falconjs.com");
      });
      it("Should return the url of the options if one is present", function() {
        var ret;
        ret = adapter.makeUrl(data_object, "GET", {
          url: 'http://www.google.com'
        }, null);
        expect(data_object.makeUrl).not.toHaveBeenCalled();
        return expect(ret).toBe('http://www.google.com');
      });
      return it("Should call the makeUrl method on the data object properly", function() {
        var ret;
        ret = adapter.makeUrl(data_object, "PUT", options, null);
        expect(data_object.makeUrl.calls.count()).toBe(1);
        expect(data_object.makeUrl).toHaveBeenCalledWith("PUT", options.parent);
        return expect(ret).toBe('http://www.falconjs.com');
      });
    });
    describe("serializeData", function() {
      var adapter, attributes, context, data_object, options, parent, serialized_data;
      adapter = new Falcon.Adapter;
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
        expect(adapter.serializeData(data_object, "GET", options, context)).toBe(options.data);
        expect(adapter.serializeData(data_object, "POST", options, context)).toBe(options.data);
        expect(adapter.serializeData(data_object, "PUT", options, context)).toBe(options.data);
        expect(adapter.serializeData(data_object, "DELETE", options, context)).toBe(options.data);
        return expect(data_object.serialize).not.toHaveBeenCalled();
      });
      it("Should call the serialize method on the data object if the request type is POST", function() {
        var ret;
        ret = adapter.serializeData(data_object, "POST", {
          attributes: attributes
        }, context);
        expect(data_object.serialize.calls.count()).toBe(1);
        expect(data_object.serialize).toHaveBeenCalledWith(attributes);
        return expect(ret).toBe(serialized_data);
      });
      it("Should call the serialize method on the data object if the request type is PUT", function() {
        var ret;
        ret = adapter.serializeData(data_object, "PUT", {
          attributes: attributes
        }, context);
        expect(data_object.serialize.calls.count()).toBe(1);
        expect(data_object.serialize).toHaveBeenCalledWith(attributes);
        return expect(ret).toBe(serialized_data);
      });
      return it("Should not call serialzie on GET or DELETE", function() {
        var ret;
        ret = adapter.serializeData(data_object, "GET", {
          attributes: attributes
        }, context);
        ret = adapter.serializeData(data_object, "DELETE", {
          attributes: attributes
        }, context);
        expect(data_object.serialize).not.toHaveBeenCalled();
        return expect(ret).not.toBeDefined();
      });
    });
    describe("parseRawResponseData", function() {
      var adapter, context, data_object, options, parent, response_args, type;
      adapter = new Falcon.Adapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      type = "GET";
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
      adapter = new Falcon.Adapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      context = new Falcon.Model({
        id: 2
      }, parent);
      type = "GET";
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
        type = "GET";
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
        type = "POST";
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
        type = "PUT";
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
        type = "DELETE";
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
      adapter = new Falcon.Adapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      context = new Falcon.Model({
        id: 2
      }, parent);
      type = "GET";
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
      adapter = new Falcon.Adapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      context = new Falcon.Model({
        id: 2
      }, parent);
      type = "GET";
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
    describe("sync", function() {
      var adapter, context, data_object, options, parent, type;
      adapter = new Falcon.Adapter;
      parent = new Falcon.Model;
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      context = new Falcon.Model({
        id: 2
      }, parent);
      type = "GET";
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
        type = "GET";
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
          type: "GET",
          options: jasmine.any(Object),
          context: context,
          is_valid: true
        });
      });
      it("Should return properly on POST", function() {
        var ret;
        type = "POST";
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
          type: "POST",
          options: jasmine.any(Object),
          context: context,
          is_valid: true
        });
      });
      it("Should return properly on PUT", function() {
        var ret;
        type = "PUT";
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
          type: "PUT",
          options: jasmine.any(Object),
          context: context,
          is_valid: true
        });
      });
      it("Should return properly on DELETE", function() {
        var ret;
        type = "DELETE";
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
          type: "DELETE",
          options: jasmine.any(Object),
          context: context,
          is_valid: true
        });
      });
      it("Should return properly with a failed POST validation", function() {
        var ret;
        type = "POST";
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
          type: "POST",
          options: jasmine.any(Object),
          context: context,
          is_valid: false
        });
      });
      it("Should return properly with a failed PUT validation", function() {
        var ret;
        type = "PUT";
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
          type: "PUT",
          options: jasmine.any(Object),
          context: context,
          is_valid: false
        });
      });
      return it("Should not call validate on a collection", function() {
        var ret;
        type = "POST";
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
          type: "POST",
          options: jasmine.any(Object),
          context: context,
          is_valid: true
        });
      });
    });
    return describe("getTemplate", function() {
      var adapter, callback, elm, elm_id, template, uri, view;
      adapter = new Falcon.Adapter;
      elm_id = "my-template";
      uri = "#" + elm_id;
      view = new Falcon.View({
        url: uri
      });
      callback = null;
      template = "Hello World";
      elm = null;
      beforeEach(function() {
        callback = jasmine.createSpy();
        spyOn(Falcon.View, 'cacheTemplate');
        spyOn(document, 'getElementById').and.callThrough();
        elm = document.createElement("div");
        elm.setAttribute("id", elm_id);
        elm.innerHTML = template;
        return document.body.appendChild(elm);
      });
      afterEach(function() {
        return document.body.removeChild(elm);
      });
      it("Should retrieve the element and assign the inner html", function() {
        var ret;
        ret = adapter.getTemplate(view, uri, callback);
        expect(document.getElementById.calls.count()).toBe(1);
        expect(document.getElementById).toHaveBeenCalledWith("my-template");
        expect(Falcon.View.cacheTemplate.calls.count()).toBe(1);
        expect(Falcon.View.cacheTemplate).toHaveBeenCalledWith(uri, template);
        expect(callback.calls.count()).toBe(1);
        return expect(ret).toBe(adapter);
      });
      it("Should assign an empty template to an unfound identifier", function() {
        var ret;
        ret = adapter.getTemplate(view, "#the_wrong_template_id", callback);
        expect(document.getElementById.calls.count()).toBe(1);
        expect(document.getElementById).toHaveBeenCalledWith("the_wrong_template_id");
        expect(Falcon.View.cacheTemplate.calls.count()).toBe(1);
        expect(Falcon.View.cacheTemplate).toHaveBeenCalledWith("#the_wrong_template_id", "");
        expect(callback.calls.count()).toBe(1);
        return expect(ret).toBe(adapter);
      });
      return it("Should work properly without a callback", function() {
        var ret;
        ret = adapter.getTemplate(view, uri);
        expect(document.getElementById.calls.count()).toBe(1);
        expect(document.getElementById).toHaveBeenCalledWith("my-template");
        expect(Falcon.View.cacheTemplate.calls.count()).toBe(1);
        expect(Falcon.View.cacheTemplate).toHaveBeenCalledWith(uri, template);
        return expect(ret).toBe(adapter);
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
      var CollectionC, ModelA, ModelB, ModelC, ModelD, ModelE, collectionC, data, modelA, modelB, modelB2, original_model_b3, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
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
      it("Should fill properly", function() {
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
            "url": null
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
      return describe("sync", function() {
        var model;
        model = new Falcon.Model;
        beforeEach(function() {
          return spyOn(Falcon.adapter, 'sync');
        });
        return it("Should call the falcon adapter", function() {
          var context, options, type;
          type = "GET";
          options = {};
          context = new Falcon.Model;
          model.sync(type, options, context);
          expect(Falcon.adapter.sync.calls.count()).toBe(1);
          return expect(Falcon.adapter.sync).toHaveBeenCalledWith(model, type, options, context);
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
      return describe("sync", function() {
        var collection;
        collection = new Falcon.Collection;
        beforeEach(function() {
          return spyOn(Falcon.adapter, 'sync');
        });
        return it("Should call the falcon adapter", function() {
          var context, options, type;
          type = "GET";
          options = {};
          context = new Falcon.Collection;
          collection.sync(type, options, context);
          expect(Falcon.adapter.sync.calls.count()).toBe(1);
          return expect(Falcon.adapter.sync).toHaveBeenCalledWith(collection, type, options, context);
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
        spyOn(Falcon.adapter, 'standardizeOptions').and.callThrough();
        return options.success.calls.reset();
      });
      it("Should return null if no model is set in the collection", function() {
        collection.model = null;
        expect(collection.create(model, options, context)).toBeNull();
        expect(model.create).not.toHaveBeenCalled();
        expect(collection.fill).not.toHaveBeenCalled();
        expect(options.success).not.toHaveBeenCalled();
        expect(Falcon.adapter.standardizeOptions).not.toHaveBeenCalled();
        return collection.model = ModelA;
      });
      it("Should call the model create method", function() {
        var fill_options, output_options;
        collection.create(model, options, context);
        expect(Falcon.adapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.adapter.standardizeOptions).toHaveBeenCalledWith(model, 'POST', options, context);
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
        expect(Falcon.adapter.standardizeOptions).not.toHaveBeenCalled();
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
        expect(ModelA.prototype.initialize).toHaveBeenCalledWith(data);
        model = ModelA.prototype.initialize.calls.mostRecent().object;
        expect(Falcon.adapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.adapter.standardizeOptions).toHaveBeenCalledWith(model, 'POST', options, context);
        expect(model.create.calls.count()).toBe(1);
        expect(model.create).toHaveBeenCalledWith(jasmine.any(Object), context);
        expect(collection.fill).not.toHaveBeenCalled();
        return expect(options.success).not.toHaveBeenCalled();
      });
      it("Should set up the correct context if none is given", function() {
        collection.create(model, options);
        expect(Falcon.adapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.adapter.standardizeOptions).toHaveBeenCalledWith(model, 'POST', options, model);
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
        spyOn(Falcon.adapter, 'standardizeOptions').and.callThrough();
        return options.success.calls.reset();
      });
      it("Should return null if a model isn't set on the collection", function() {
        collection.model = null;
        expect(collection.destroy(model_1, options, context)).toBeNull();
        expect(Falcon.adapter.standardizeOptions).not.toHaveBeenCalled();
        expect(model_1.destroy).not.toHaveBeenCalled();
        return collection.model = ModelA;
      });
      it("Should return null if a model that doesnt exist in the collection is given", function() {
        expect(collection.destroy(model_3, options, context)).toBeNull();
        expect(Falcon.adapter.standardizeOptions).not.toHaveBeenCalled();
        return expect(model_1.destroy).not.toHaveBeenCalled();
      });
      it("Should call the correct method when removing a model that exists in the collection", function() {
        var output_options;
        collection.destroy(model_1, options, context);
        expect(Falcon.adapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.adapter.standardizeOptions).toHaveBeenCalledWith(model_1, 'DELETE', options, context);
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
        expect(Falcon.adapter.standardizeOptions).not.toHaveBeenCalled();
        expect(collection.remove.calls.count()).toBe(1);
        expect(collection.remove).toHaveBeenCalledWith(model_1);
        expect(options.success.calls.count()).toBe(1);
        expect(options.success).toHaveBeenCalledWith(model_1);
        return expect(options.success.calls.mostRecent().object).toBe(context);
      });
      it("Should be able to remove a model based on id", function() {
        collection.destroy(2, options, context);
        expect(Falcon.adapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.adapter.standardizeOptions).toHaveBeenCalledWith(model_2, 'DELETE', options, context);
        expect(model_2.destroy.calls.count()).toBe(1);
        expect(model_2.destroy).toHaveBeenCalledWith(jasmine.any(Object), context);
        expect(collection.remove).not.toHaveBeenCalled();
        return expect(options.success).not.toHaveBeenCalled();
      });
      return it("Should set up the correct context if none is given", function() {
        collection.destroy(model_4, options);
        expect(Falcon.adapter.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.adapter.standardizeOptions).toHaveBeenCalledWith(model_4, 'DELETE', options, model_4);
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
    describe("constructor", function() {
      beforeEach(function() {
        spyOn(Falcon.View.prototype, 'initialize').and.callThrough();
        spyOn(Falcon.View.prototype, 'makeUrl').and.callThrough();
        return spyOn(Falcon.adapter, 'getTemplate').and.callThrough();
      });
      it("Should call the correct methods by default", function() {
        var view;
        view = new (Falcon.View.extend({
          url: "#hello_world"
        }));
        expect(view.makeUrl.calls.count()).toBe(1);
        expect(view.initialize.calls.count()).toBe(1);
        expect(view.initialize).toHaveBeenCalledWith();
        expect(Falcon.adapter.getTemplate.calls.count()).toBe(1);
        expect(Falcon.adapter.getTemplate).toHaveBeenCalledWith(view, "#hello_world", jasmine.any(Function));
        return expect(view.is_loaded()).toBe(true);
      });
      it("Should recognized cached templates", function() {
        var view;
        view = new (Falcon.View.extend({
          url: "#hello_world"
        }));
        view.makeUrl.calls.reset();
        view.initialize.calls.reset();
        Falcon.adapter.getTemplate.calls.reset();
        view = new (Falcon.View.extend({
          url: "#hello_world"
        }));
        expect(view.makeUrl.calls.count()).toBe(1);
        expect(view.initialize.calls.count()).toBe(1);
        expect(view.initialize).toHaveBeenCalledWith();
        expect(Falcon.adapter.getTemplate).not.toHaveBeenCalled();
        return expect(view.is_loaded()).toBe(true);
      });
      return it("Should not call the adapter on an empty template uri", function() {
        var view;
        view = new (Falcon.View.extend({
          url: null
        }));
        expect(view.makeUrl.calls.count()).toBe(1);
        expect(view.initialize.calls.count()).toBe(1);
        expect(view.initialize).toHaveBeenCalledWith();
        expect(Falcon.adapter.getTemplate).not.toHaveBeenCalled();
        return expect(view.is_loaded()).toBe(true);
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
      var FullView, _ref7;
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
    var application, application_index, applyApp, _childCount, _createApplication, _createTemplate;
    application = null;
    application_index = 0;
    _createApplication = function() {
      var elm;
      application_index++;
      elm = document.createElement("div");
      elm.setAttribute("id", "application_" + application_index);
      return elm;
    };
    _createTemplate = function(id, html) {
      var elm;
      elm = document.createElement("template");
      elm.setAttribute("id", id);
      elm.innerHTML = html;
      return elm;
    };
    _childCount = function(elm) {
      var child, count, _i, _len, _ref;
      count = 0;
      _ref = elm.childNodes;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        child = _ref[_i];
        if (child.nodeType === 1) {
          count++;
        }
      }
      return count;
    };
    applyApp = function(view) {
      if (application != null) {
        document.body.removeChild(application);
      }
      document.body.appendChild(application = _createApplication());
      return Falcon.apply(view, "#application_" + application_index);
    };
    describe("'view' Binding", function() {
      var ContentView, FooterView, LayoutView, content_template, footer_template, layout_template, view_binding, view_init_spy, view_update_spy, _ref, _ref1, _ref2;
      layout_template = footer_template = content_template = null;
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
      layout_template = _createTemplate("layout-template", "			<div data-bind='view: $view.content_view'></div>			<div data-bind='view: $view.footer_view'></div>		");
      ContentView = (function(_super) {
        __extends(ContentView, _super);

        function ContentView() {
          _ref1 = ContentView.__super__.constructor.apply(this, arguments);
          return _ref1;
        }

        ContentView.prototype.url = '#content-template';

        return ContentView;

      })(Falcon.View);
      content_template = _createTemplate("content-template", "The Content");
      FooterView = (function(_super) {
        __extends(FooterView, _super);

        function FooterView() {
          _ref2 = FooterView.__super__.constructor.apply(this, arguments);
          return _ref2;
        }

        FooterView.prototype.url = '#footer-template';

        return FooterView;

      })(Falcon.View);
      footer_template = _createTemplate("footer-template", "The Footer");
      it("Setup", function() {
        document.body.appendChild(layout_template);
        document.body.appendChild(content_template);
        return document.body.appendChild(footer_template);
      });
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
        var content_display_spy, content_dispose_spy, content_render_spy, content_unrender_spy, content_view, display_spy, dispose_spy, footer_display_spy, footer_dispose_spy, footer_render_spy, footer_unrender_spy, footer_view, obs, render_spy, setup, unrender_spy, view;
        view = content_view = footer_view = obs = null;
        render_spy = unrender_spy = display_spy = dispose_spy = null;
        content_render_spy = content_unrender_spy = content_display_spy = content_dispose_spy = null;
        footer_render_spy = footer_unrender_spy = footer_display_spy = footer_dispose_spy = null;
        setup = function() {
          Falcon.View.resetCache();
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
      return it("Teardown", function() {
        Falcon.View.resetCache();
        document.body.removeChild(layout_template);
        document.body.removeChild(content_template);
        return document.body.removeChild(footer_template);
      });
    });
    describe("Test view binding with an observable array of views", function() {
      var ContentView, LayoutView, content_template, layout_template, view_binding, _ref, _ref1;
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
      layout_template = _createTemplate("layout-template", "			<!-- ko foreach: $view.views -->				<div data-bind='view: $data'></div>			<!-- /ko -->		");
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
      content_template = _createTemplate("content-template2", "			<div data-bind='title: $view.title'></div>		");
      beforeEach(function() {
        document.body.appendChild(layout_template);
        return document.body.appendChild(content_template);
      });
      afterEach(function() {
        document.body.removeChild(layout_template);
        return document.body.removeChild(content_template);
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
      var TestView, test_view_template, _ref;
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
      test_view_template = _createTemplate("test_view", "			<script type='text/javascript'>window.call_spy();</script>			<script>window.call_another_spy();</script>			<script type='text/template'>window.call_a_third_spy();</script>		");
      beforeEach(function() {
        window.call_spy = jasmine.createSpy("'Call Spy'");
        window.call_another_spy = jasmine.createSpy("'Call Another Spy'");
        window.call_a_third_spy = jasmine.createSpy("'Call A Third Spy'");
        document.body.appendChild(test_view_template);
        window.call_spy.calls.reset();
        window.call_another_spy.calls.reset();
        return window.call_a_third_spy.calls.reset();
      });
      afterEach(function() {
        document.body.removeChild(test_view_template);
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
        var LayoutView, after_add_spy, array_list, array_list_options, before_remove_spy, collection_list, collection_list_options, layout_template, setup, teardown, view, view_observable, _ref2;
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
            return element.parentNode.removeChild(element);
          };

          return LayoutView;

        })(Falcon.View);
        layout_template = _createTemplate('layout-template', "				<ul class='array_list' data-bind='foreach: $view.array_list'><li>An Item</li></ul>				<ul class='collection_list' data-bind='foreach: $view.collection_list'><li>An Item</li></ul>				<ul class='array_list_options' data-bind='foreach: {data: $view.array_list_options, afterAdd: $view.afterAdd, beforeRemove: $view.beforeRemove}'><li>An Item</li></ul>				<ul class='collection_list_options' data-bind='foreach: {data: $view.collection_list_options, afterAdd: $view.afterAdd, beforeRemove: $view.beforeRemove}'><li>An Item</li></ul>			");
        view = null;
        view_observable = ko.observable();
        array_list = collection_list = null;
        array_list_options = collection_list_options = null;
        after_add_spy = before_remove_spy = null;
        setup = function() {
          Falcon.View.resetCache();
          document.body.appendChild(application);
          document.body.appendChild(layout_template);
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
          prev_array_list = array_list;
          array_list = document.querySelectorAll(".array_list")[0];
          collection_list = document.querySelectorAll(".collection_list")[0];
          array_list_options = document.querySelectorAll(".array_list_options")[0];
          return collection_list_options = document.querySelectorAll(".collection_list_options")[0];
        });
        afterEach(function() {
          application.innerHTML = "";
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          after_add_spy.restore();
          return before_remove_spy.restore();
        });
        teardown = function() {
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
          expect(_childCount(array_list)).toEqual(0);
          expect(_childCount(collection_list)).toEqual(0);
          expect(_childCount(array_list_options)).toEqual(0);
          expect(_childCount(collection_list_options)).toEqual(0);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.array_list.push("Hello");
          view.array_list.push("World", "Foo Bar");
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(2);
          expect(_childCount(array_list)).toEqual(3);
          expect(_childCount(collection_list)).toEqual(0);
          expect(_childCount(array_list_options)).toEqual(0);
          expect(_childCount(collection_list_options)).toEqual(0);
          foreach_update_spy.reset();
          view.array_list.pop();
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(1);
          expect(_childCount(array_list)).toEqual(2);
          expect(_childCount(collection_list)).toEqual(0);
          expect(_childCount(array_list_options)).toEqual(0);
          return expect(_childCount(collection_list_options)).toEqual(0);
        });
        it("Should properly list with a collection", function() {
          expect(foreach_init_spy).toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_init_spy.callCount).toEqual(4);
          expect(foreach_update_spy.callCount).toEqual(4);
          expect(_childCount(array_list)).toEqual(0);
          expect(_childCount(collection_list)).toEqual(0);
          expect(_childCount(array_list_options)).toEqual(0);
          expect(_childCount(collection_list_options)).toEqual(0);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.collection_list.push(new ModelA);
          view.collection_list.push([new ModelA, new ModelA]);
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(2);
          expect(_childCount(array_list)).toEqual(0);
          expect(_childCount(collection_list)).toEqual(3);
          expect(_childCount(array_list_options)).toEqual(0);
          expect(_childCount(collection_list_options)).toEqual(0);
          foreach_update_spy.reset();
          view.collection_list.pop();
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(1);
          expect(_childCount(array_list)).toEqual(0);
          expect(_childCount(collection_list)).toEqual(2);
          expect(_childCount(array_list_options)).toEqual(0);
          return expect(_childCount(collection_list_options)).toEqual(0);
        });
        it("Should properly list with an observable array including options", function() {
          expect(foreach_init_spy).toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_init_spy.callCount).toEqual(4);
          expect(foreach_update_spy.callCount).toEqual(4);
          expect(_childCount(array_list)).toEqual(0);
          expect(_childCount(collection_list)).toEqual(0);
          expect(_childCount(array_list_options)).toEqual(0);
          expect(_childCount(collection_list_options)).toEqual(0);
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
          expect(_childCount(array_list)).toEqual(0);
          expect(_childCount(collection_list)).toEqual(0);
          expect(_childCount(array_list_options)).toEqual(3);
          expect(_childCount(collection_list_options)).toEqual(0);
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
          expect(_childCount(array_list)).toEqual(0);
          expect(_childCount(collection_list)).toEqual(0);
          expect(_childCount(array_list_options)).toEqual(1);
          return expect(_childCount(collection_list_options)).toEqual(0);
        });
        it("Should properly list with a collection including options", function() {
          expect(foreach_init_spy).toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(after_add_spy).not.toHaveBeenCalled();
          expect(before_remove_spy).not.toHaveBeenCalled();
          expect(foreach_init_spy.callCount).toEqual(4);
          expect(foreach_update_spy.callCount).toEqual(4);
          expect(_childCount(array_list)).toEqual(0);
          expect(_childCount(collection_list)).toEqual(0);
          expect(_childCount(array_list_options)).toEqual(0);
          expect(_childCount(collection_list_options)).toEqual(0);
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
          expect(_childCount(array_list)).toEqual(0);
          expect(_childCount(collection_list)).toEqual(0);
          expect(_childCount(array_list_options)).toEqual(0);
          expect(_childCount(collection_list_options)).toEqual(3);
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
          expect(_childCount(array_list)).toEqual(0);
          expect(_childCount(collection_list)).toEqual(0);
          expect(_childCount(array_list_options)).toEqual(0);
          return expect(_childCount(collection_list_options)).toEqual(1);
        });
        return it("Teardown", teardown);
      });
      return describe("Test observable bindings against collections", function() {
        var LayoutView, layout_template, _ref2;
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
        layout_template = _createTemplate('layout-template', "				<ul class='collection_list' data-bind='foreach: $view.selected_collection'><li>An Item</li></ul>			");
        it("Setup", function() {
          document.body.appendChild(layout_template);
          return Falcon.View.cacheTemplates();
        });
        it("Should properly update if collection is switched to another with same update count", function() {
          var collection_list, view, view_observable;
          view_observable = ko.observable();
          foreach_init_spy = sinon.spy(foreach_binding, 'init');
          foreach_update_spy = sinon.spy(foreach_binding, 'update');
          applyApp(view_observable);
          view = new LayoutView;
          view_observable(view);
          collection_list = document.querySelectorAll(".collection_list")[0];
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
          expect(_childCount(collection_list)).toEqual(2);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.selected_number(2);
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(1);
          expect(_childCount(collection_list)).toEqual(5);
          foreach_init_spy.reset();
          foreach_update_spy.reset();
          view.selected_number(1);
          expect(foreach_init_spy).not.toHaveBeenCalled();
          expect(foreach_update_spy).toHaveBeenCalled();
          expect(foreach_update_spy.callCount).toEqual(1);
          expect(_childCount(collection_list)).toEqual(2);
          foreach_init_spy.restore();
          return foreach_update_spy.restore();
        });
        return it("Teardown", function() {
          return Falcon.View.resetCache();
        });
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
