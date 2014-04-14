(function() {
  var _MockHelper;

  this.MockHelper = new (_MockHelper = (function() {
    function _MockHelper() {}

    _MockHelper.prototype.makeElement = function(tagName) {
      var element;
      if (tagName == null) {
        tagName = "div";
      }
      element = document.createElement(tagName);
      element.bindings = function(bindings) {
        element.setAttribute("data-bind", bindings);
        return element;
      };
      element.andApply = function(viewModel) {
        ko.applyBindings(viewModel, element);
        return element;
      };
      element.setId = function(id) {
        element.setAttribute('id', id);
        return element;
      };
      element.html = function(html) {
        element.innerHTML = html;
        return element;
      };
      element.addToDOM = function() {
        document.body.appendChild(element);
        return element;
      };
      element.removeFromDOM = function() {
        ko.removeNode(element);
        return element;
      };
      return element;
    };

    _MockHelper.prototype.makeView = function(url) {
      var view;
      view = new (Falcon.View.extend({
        url: url
      }));
      view._render = jasmine.createSpy("Render Spy").and.callFake(view._render);
      view.display = jasmine.createSpy("Display Spy").and.callFake(view.display);
      view._unrender = jasmine.createSpy("Unrender Spy").and.callFake(view._unrender);
      view.dispose = jasmine.createSpy("Dispose Spy").and.callFake(view.dispose);
      view.resetSpies = function() {
        view._render.calls.reset();
        view.display.calls.reset();
        view._unrender.calls.reset();
        view.dispose.calls.reset();
        return view;
      };
      view.triggerReady = function() {
        Falcon.ready.calls.mostRecent().args[0]();
        return view;
      };
      return view;
    };

    _MockHelper.prototype.makeCommentBinding = function(binding) {
      var end_comment, fragment, start_comment;
      start_comment = document.createComment(" ko " + binding + " ");
      end_comment = document.createComment(" /ko ");
      fragment = document.createElement('div');
      fragment.appendChild(start_comment);
      fragment.appendChild(end_comment);
      fragment.start_comment = start_comment;
      fragment.end_comment = end_comment;
      fragment.andApply = function(viewModel) {
        ko.applyBindings(viewModel, fragment);
        return fragment;
      };
      fragment.getInnerHTML = function() {
        var childNode, childNodes, temp, _i, _len;
        childNodes = ko.virtualElements.childNodes(start_comment);
        temp = document.createElement("div");
        for (_i = 0, _len = childNodes.length; _i < _len; _i++) {
          childNode = childNodes[_i];
          temp.appendChild(childNode.cloneNode(true));
        }
        return temp.innerHTML;
      };
      fragment.addToDOM = function() {
        document.body.appendChild(fragment);
        return fragment;
      };
      fragment.removeFromDOM = function() {
        ko.removeNode(fragment);
        return fragment;
      };
      return fragment;
    };

    return _MockHelper;

  })());

}).call(this);
