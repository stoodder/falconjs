(function() {
  describe("jQueryAdapter", function() {
    describe("standardizeOptions", function() {
      var adapter, context, data_object, options, parent, type;
      adapter = new jQueryAdapter;
      parent = new Falcon.Model({
        id: 0
      });
      data_object = new Falcon.Model({
        id: 1
      }, parent);
      type = Falcon.Adapter.GET;
      options = {
        dataType: 'new-json',
        contentType: 'application/new-json',
        params: {
          'hello': 'world'
        },
        headers: {
          'foo': 'bar'
        },
        cache: true
      };
      context = new Falcon.Model({
        id: 3
      });
      beforeEach(function() {
        spyOn(Falcon.Adapter.prototype, 'standardizeOptions').and.callThrough();
        spyOn(adapter, 'resolveUrl').and.callThrough();
        return spyOn(adapter, 'serializeData').and.callThrough();
      });
      it("Should generate the proper options by default", function() {
        var ret;
        ret = adapter.standardizeOptions(data_object, type, null, context);
        expect(adapter.cache).toBe(false);
        expect(Falcon.Adapter.prototype.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.standardizeOptions).toHaveBeenCalledWith(data_object, type, null, context);
        expect(adapter.resolveUrl.calls.count()).toBe(1);
        expect(adapter.resolveUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(ret).toEqual;
        expect(ret['success']).toEqual(jasmine.any(Function));
        expect(ret['error']).toEqual(jasmine.any(Function));
        expect(ret['complete']).toEqual(jasmine.any(Function));
        expect(ret['url']).toEqual(jasmine.any(String));
        expect(ret['attributes']).toEqual(null);
        expect(ret['parent']).toEqual(data_object.parent);
        expect(ret['fill_options']).toEqual(null);
        expect(ret['data']).toEqual('');
        expect(ret['dataType']).toEqual('json');
        expect(ret['contentType']).toEqual('application/json');
        expect(ret['params']).toEqual({});
        expect(ret['headers']).toEqual({});
        return expect(ret['cache']).toEqual(false);
      });
      it("Should pass through options that are given", function() {
        var ret;
        ret = adapter.standardizeOptions(data_object, type, options, context);
        expect(adapter.cache).toBe(false);
        expect(Falcon.Adapter.prototype.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.standardizeOptions).toHaveBeenCalledWith(data_object, type, options, context);
        expect(adapter.resolveUrl.calls.count()).toBe(1);
        expect(adapter.resolveUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(ret).toEqual;
        expect(ret['success']).toEqual(jasmine.any(Function));
        expect(ret['error']).toEqual(jasmine.any(Function));
        expect(ret['complete']).toEqual(jasmine.any(Function));
        expect(ret['url']).toEqual(jasmine.any(String));
        expect(ret['attributes']).toEqual(null);
        expect(ret['parent']).toEqual(data_object.parent);
        expect(ret['fill_options']).toEqual(null);
        expect(ret['data']).toEqual('');
        expect(ret['dataType']).toEqual('new-json');
        expect(ret['contentType']).toEqual('application/new-json');
        expect(ret['params']).toEqual({
          'hello': 'world'
        });
        expect(ret['headers']).toEqual({
          'foo': 'bar'
        });
        expect(ret['cache']).toBe(true);
        return expect(ret).not.toBe(options);
      });
      return it("Should use the adapter's 'cache' value if on is not present in options", function() {
        var ret;
        adapter.cache = true;
        ret = adapter.standardizeOptions(data_object, type, null, context);
        expect(Falcon.Adapter.prototype.standardizeOptions.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.standardizeOptions).toHaveBeenCalledWith(data_object, type, null, context);
        expect(adapter.resolveUrl.calls.count()).toBe(1);
        expect(adapter.resolveUrl).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(adapter.serializeData.calls.count()).toBe(1);
        expect(adapter.serializeData).toHaveBeenCalledWith(data_object, type, jasmine.any(Object), context);
        expect(ret['success']).toEqual(jasmine.any(Function));
        expect(ret['error']).toEqual(jasmine.any(Function));
        expect(ret['complete']).toEqual(jasmine.any(Function));
        expect(ret['url']).toEqual(jasmine.any(String));
        expect(ret['attributes']).toEqual(null);
        expect(ret['parent']).toEqual(data_object.parent);
        expect(ret['fill_options']).toEqual(null);
        expect(ret['data']).toEqual('');
        expect(ret['dataType']).toEqual('json');
        expect(ret['contentType']).toEqual('application/json');
        expect(ret['params']).toEqual({});
        expect(ret['headers']).toEqual({});
        return expect(ret['cache']).toBe(true);
      });
    });
    describe("resolveUrl", function() {
      var adapter, context, data_object, options, params, type;
      adapter = new jQueryAdapter;
      data_object = new Falcon.Model({
        id: 1
      });
      type = Falcon.Adapter.GET;
      options = {
        url: "http://www.google.com"
      };
      params = {
        'hello': 'world',
        'foo': 'bar'
      };
      context = new Falcon.Model({
        id: 2
      });
      beforeEach(function() {
        return spyOn(Falcon.Adapter.prototype, 'resolveUrl').and.callThrough();
      });
      it("Should not have any query string parameters if no params present", function() {
        var ret;
        ret = adapter.resolveUrl(data_object, type, options, context);
        expect(Falcon.Adapter.prototype.resolveUrl.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.resolveUrl).toHaveBeenCalledWith(data_object, type, options, context);
        return expect(ret).toBe("http://www.google.com");
      });
      it("Should append query string parameters properly", function() {
        var ret;
        options.params = params;
        ret = adapter.resolveUrl(data_object, type, options, context);
        expect(Falcon.Adapter.prototype.resolveUrl.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.resolveUrl).toHaveBeenCalledWith(data_object, type, options, context);
        return expect(ret).toBe("http://www.google.com?hello=world&foo=bar");
      });
      return it("Should append paramters to existing paramters", function() {
        var ret;
        options.url = "http://www.google.com?free=bird";
        ret = adapter.resolveUrl(data_object, type, options, context);
        expect(Falcon.Adapter.prototype.resolveUrl.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.resolveUrl).toHaveBeenCalledWith(data_object, type, options, context);
        return expect(ret).toBe("http://www.google.com?free=bird&hello=world&foo=bar");
      });
    });
    describe("serializeData", function() {
      var adapter, context, data_object, options, type;
      adapter = new jQueryAdapter;
      data_object = new Falcon.Model({
        id: 1
      });
      type = Falcon.Adapter.GET;
      options = {
        data: {
          'hello': 'world'
        }
      };
      context = new Falcon.Model({
        id: 2
      });
      beforeEach(function() {
        return spyOn(Falcon.Adapter.prototype, 'serializeData').and.callThrough();
      });
      it("Should return an empty string by default", function() {
        var ret;
        ret = adapter.serializeData(data_object, Falcon.Adapter.GET, {}, context);
        expect(Falcon.Adapter.prototype.serializeData.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.serializeData).toHaveBeenCalledWith(data_object, Falcon.Adapter.GET, jasmine.any(Object), context);
        return expect(ret).toBe("");
      });
      it("Should stringify the data properly", function() {
        var ret;
        ret = adapter.serializeData(data_object, Falcon.Adapter.GET, options, context);
        expect(Falcon.Adapter.prototype.serializeData.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.serializeData).toHaveBeenCalledWith(data_object, Falcon.Adapter.GET, options, context);
        return expect(ret).toBe(JSON.stringify(options.data));
      });
      return it("Should return early if the data is already a string", function() {
        var ret;
        options.data = JSON.stringify(options.data);
        ret = adapter.serializeData(data_object, Falcon.Adapter.GET, options, context);
        expect(Falcon.Adapter.prototype.serializeData.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.serializeData).toHaveBeenCalledWith(data_object, Falcon.Adapter.GET, options, context);
        return expect(ret).toBe(options.data);
      });
    });
    describe("parseRawResponseData", function() {
      var adapter, context, data, data_object, options, type, xhr;
      adapter = new jQueryAdapter;
      data_object = new Falcon.Model({
        id: 1
      });
      type = Falcon.Adapter.GET;
      options = {};
      context = new Falcon.Model({
        id: 2
      });
      data = JSON.stringify({
        "hello": "world"
      });
      xhr = {
        responseText: JSON.stringify({
          "foo": "bar"
        })
      };
      beforeEach(function() {
        return spyOn(Falcon.Adapter.prototype, 'parseRawResponseData').and.callThrough();
      });
      it("Should parse the response data", function() {
        var ret;
        ret = adapter.parseRawResponseData(data_object, type, options, context, {
          data: data,
          xhr: xhr
        });
        expect(Falcon.Adapter.prototype.parseRawResponseData.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, {
          data: data,
          xhr: xhr
        });
        return expect(ret).toEqual({
          "hello": "world"
        });
      });
      it("Should parse the xhr respons text if no data is present", function() {
        var ret;
        ret = adapter.parseRawResponseData(data_object, type, options, context, {
          xhr: xhr
        });
        expect(Falcon.Adapter.prototype.parseRawResponseData.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, {
          xhr: xhr
        });
        return expect(ret).toEqual({
          "foo": "bar"
        });
      });
      it("Should return an empty object if no parsing happend and a model is pased in", function() {
        var ret;
        ret = adapter.parseRawResponseData(data_object, type, options, context, {});
        expect(Falcon.Adapter.prototype.parseRawResponseData.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, {});
        return expect(ret).toEqual({});
      });
      it("Should return and empty array if no parsing happend and a collection is passed in", function() {
        var ret;
        data_object = new Falcon.Collection;
        ret = adapter.parseRawResponseData(data_object, type, options, context, {});
        expect(Falcon.Adapter.prototype.parseRawResponseData.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, {});
        return expect(ret).toEqual([]);
      });
      return it("Should parse the xhr respons text if no data is present", function() {
        var ret;
        data_object = new Falcon.Model;
        ret = adapter.parseRawResponseData(data_object, type, options, context, {
          data: "<h1>Invalid</h1>"
        });
        expect(Falcon.Adapter.prototype.parseRawResponseData.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.parseRawResponseData).toHaveBeenCalledWith(data_object, type, options, context, {
          data: "<h1>Invalid</h1>"
        });
        return expect(ret).toEqual({});
      });
    });
    describe("sync", function() {
      var adapter, complete, context, data_object, error, options, response_data, response_status, response_xhr, success, type, xhr_return;
      adapter = new jQueryAdapter;
      data_object = new Falcon.Model({
        id: 1
      });
      type = Falcon.Adapter.GET;
      options = {
        url: "http://www.google.com",
        data: {
          "hello": "world"
        }
      };
      context = new Falcon.Model({
        id: 2
      });
      xhr_return = {};
      success = error = complete = null;
      response_data = JSON.stringify(options.data);
      response_status = "success";
      response_xhr = {
        responseText: JSON.stringify({
          'foo': 'bar'
        })
      };
      beforeEach(function() {
        spyOn(Falcon.Adapter.prototype, 'sync').and.callThrough();
        spyOn(adapter, 'successResponseHandler');
        spyOn(adapter, 'errorResponseHandler');
        spyOn(adapter, 'completeResponseHandler');
        return spyOn($, "ajax").and.returnValue(xhr_return);
      });
      it("Should set up the ajax request properly", function() {
        var ret, _ref;
        ret = adapter.sync(data_object, Falcon.Adapter.GET, options, context);
        expect(Falcon.Adapter.prototype.sync.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.sync).toHaveBeenCalledWith(data_object, Falcon.Adapter.GET, options, context);
        expect($.ajax.calls.count()).toBe(1);
        expect($.ajax).toHaveBeenCalledWith({
          'type': Falcon.Adapter.GET,
          'url': "http://www.google.com",
          'data': JSON.stringify({
            "hello": "world"
          }),
          'dataType': 'json',
          'contentType': 'application/json',
          'cache': false,
          'headers': {},
          'success': jasmine.any(Function),
          'error': jasmine.any(Function),
          'complete': jasmine.any(Function)
        });
        expect(adapter.successResponseHandler).not.toHaveBeenCalled();
        expect(adapter.errorResponseHandler).not.toHaveBeenCalled();
        expect(adapter.completeResponseHandler).not.toHaveBeenCalled();
        _ref = $.ajax.calls.mostRecent().args[0], success = _ref.success, error = _ref.error, complete = _ref.complete;
        return expect(ret).toBe(xhr_return);
      });
      it("Should call the success response handler properly", function() {
        success(response_data, response_status, response_xhr);
        expect(Falcon.Adapter.prototype.sync).not.toHaveBeenCalled();
        expect($.ajax).not.toHaveBeenCalled();
        expect(adapter.errorResponseHandler).not.toHaveBeenCalled();
        expect(adapter.completeResponseHandler).not.toHaveBeenCalled();
        expect(adapter.successResponseHandler.calls.count()).toBe(1);
        return expect(adapter.successResponseHandler).toHaveBeenCalledWith(data_object, Falcon.Adapter.GET, jasmine.any(Object), context, {
          data: response_data,
          status: response_status,
          xhr: response_xhr
        });
      });
      it("Should call the error response handler properly", function() {
        error(response_xhr);
        expect(Falcon.Adapter.prototype.sync).not.toHaveBeenCalled();
        expect($.ajax).not.toHaveBeenCalled();
        expect(adapter.successResponseHandler).not.toHaveBeenCalled();
        expect(adapter.completeResponseHandler).not.toHaveBeenCalled();
        expect(adapter.errorResponseHandler.calls.count()).toBe(1);
        return expect(adapter.errorResponseHandler).toHaveBeenCalledWith(data_object, Falcon.Adapter.GET, jasmine.any(Object), context, {
          xhr: response_xhr
        });
      });
      it("Should call the complete response handler properly", function() {
        complete(response_xhr, response_status);
        expect(Falcon.Adapter.prototype.sync).not.toHaveBeenCalled();
        expect($.ajax).not.toHaveBeenCalled();
        expect(adapter.successResponseHandler).not.toHaveBeenCalled();
        expect(adapter.errorResponseHandler).not.toHaveBeenCalled();
        expect(adapter.completeResponseHandler.calls.count()).toBe(1);
        return expect(adapter.completeResponseHandler).toHaveBeenCalledWith(data_object, Falcon.Adapter.GET, jasmine.any(Object), context, {
          status: response_status,
          xhr: response_xhr
        });
      });
      return it("Should not call the ajax method if we could not validate the model", function() {
        var ret;
        data_object.validate = (function() {
          return false;
        });
        ret = adapter.sync(data_object, Falcon.Adapter.POST, options, context);
        expect(Falcon.Adapter.prototype.sync.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.sync).toHaveBeenCalledWith(data_object, Falcon.Adapter.POST, options, context);
        expect($.ajax).not.toHaveBeenCalled();
        expect(adapter.successResponseHandler).not.toHaveBeenCalled();
        expect(adapter.errorResponseHandler).not.toHaveBeenCalled();
        expect(adapter.completeResponseHandler).not.toHaveBeenCalled();
        return expect(ret).toBeNull();
      });
    });
    return describe("getTemplate", function() {
      var adapter, callback, elm, error, success;
      adapter = new jQueryAdapter;
      callback = jasmine.createSpy("Loaded Callback");
      elm = null;
      success = error = null;
      beforeEach(function() {
        spyOn(Falcon.Adapter.prototype, 'getTemplate').and.callThrough();
        spyOn($, 'ajax');
        callback.calls.reset();
        elm = document.createElement("div");
        elm.setAttribute("id", "hello_world");
        elm.innerHTML = "Hello World";
        return document.body.appendChild(elm);
      });
      afterEach(function() {
        return document.body.removeChild(elm);
      });
      it("Should throw if an invalid uri is given", function() {
        expect(function() {
          return adapter.getTemplate();
        }).toThrow();
        return expect(function() {
          return adapter.getTemplate(123);
        }).toThrow();
      });
      it("Should throw if an invalid callback is given", function() {
        expect(function() {
          return adapter.getTemplate(uri);
        }).toThrow();
        return expect(function() {
          return adapter.getTemplate(uri, 123);
        }).toThrow();
      });
      it("Should fall back to the original getTemplate method if an identifier is passed in", function() {
        var ret;
        ret = adapter.getTemplate("#hello_world", callback);
        expect(Falcon.Adapter.prototype.getTemplate.calls.count()).toBe(1);
        expect(Falcon.Adapter.prototype.getTemplate).toHaveBeenCalledWith("#hello_world", callback);
        expect(callback.calls.count()).toBe(1);
        expect($.ajax).not.toHaveBeenCalled();
        return expect(ret).toBe(adapter);
      });
      it("Should call the ajax method if a url is passed in", function() {
        var ret, _ref;
        ret = adapter.getTemplate("http://www.google.com", callback);
        expect(Falcon.Adapter.prototype.getTemplate).not.toHaveBeenCalled();
        expect(callback).not.toHaveBeenCalled();
        expect($.ajax.calls.count()).toBe(1);
        expect($.ajax).toHaveBeenCalledWith({
          url: "http://www.google.com",
          type: Falcon.Adapter.GET,
          cache: false,
          error: jasmine.any(Function),
          success: jasmine.any(Function)
        });
        _ref = $.ajax.calls.mostRecent().args[0], success = _ref.success, error = _ref.error;
        return expect(ret).toBe(adapter);
      });
      it("Should call the success routine properly", function() {
        success("Template HTML");
        expect(Falcon.Adapter.prototype.getTemplate).not.toHaveBeenCalled();
        expect($.ajax).not.toHaveBeenCalled();
        expect(callback.calls.count()).toBe(1);
        return expect(callback).toHaveBeenCalledWith("Template HTML");
      });
      return it("Should call the error routine properly", function() {
        error();
        expect(Falcon.Adapter.prototype.getTemplate).not.toHaveBeenCalled();
        expect($.ajax).not.toHaveBeenCalled();
        expect(callback.calls.count()).toBe(1);
        return expect(callback).toHaveBeenCalledWith("");
      });
    });
  });

}).call(this);
