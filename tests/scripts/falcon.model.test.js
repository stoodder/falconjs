(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Testing Model Methods", function() {
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
      expect(init_stub).to.have.been.calledOnce;
      expect(init_stub).to.have.been.calledWith();
      init_stub.reset();
      modelA = new ModelA(modelB = new ModelB);
      expect(init_stub).to.have.been.calledOnce;
      expect(init_stub).to.have.been.calledWith();
      expect(modelA.parent).to.be.equal(modelB);
      init_stub.reset();
      modelA = new ModelA(data = {
        "hello": "world"
      });
      expect(init_stub).to.have.been.calledOnce;
      expect(init_stub).to.have.been.calledWith(data);
      expect(modelA.parent).to.be.undefined;
      init_stub.reset();
      modelA = new ModelA(data = {
        "hello": "world"
      }, modelB = new ModelB);
      expect(init_stub).to.have.been.calledOnce;
      expect(init_stub).to.have.been.calledWith(data);
      expect(modelA.parent).to.be.equal(modelB);
      init_stub.reset();
      modelA = new ModelA(modelB = new ModelB, data = {
        "hello": "world"
      });
      expect(init_stub).to.have.been.calledOnce;
      expect(init_stub).to.have.been.calledWith(data);
      expect(modelA.parent).to.be.equal(modelB);
      init_stub.reset();
      modelA = new ModelA(dataModel = new Falcon.Model({
        "hello": "world"
      }), modelB = new ModelB);
      expect(init_stub).to.have.been.calledOnce;
      expect(init_stub).to.have.been.calledWith(dataModel.unwrap());
      expect(modelA.parent).to.be.equal(modelB);
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
      expect(hello_spy).to.not.have.been.called;
      rawr_class = new RawrModel(input_data = {
        "one": "one",
        "two": "two",
        "three": "three"
      });
      expect(hello_spy).to.have.been.called;
      expect(hello_spy.callCount).to.equal(1);
      expect(hello_spy.firstCall.args.length).to.equal(1);
      return expect(hello_spy.firstCall.args[0]).to.equal(input_data);
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
      expect(modelA["hello"]).to.be.equal("world");
      expect(modelA["foo"]).to.be.a("function");
      expect(modelA["truth"]).to.be["true"];
      expect(modelA["model_b"]).to.be.instanceOf(ModelB);
      expect(modelA["model_b"]).to.be.equal(modelB);
      expect(modelA.get("hello")).to.be.equal("world");
      expect(modelA.get("foo")).to.be.equal("bar");
      expect(modelA.get("truth")).to.be.equal(true);
      expect(modelA["model_b"]).to.be.instanceOf(ModelB);
      expect(modelA["model_b"]).to.be.equal(modelB);
      modelA.set("foo", "baz");
      modelA.set("hello", "goodbye");
      expect(modelA.get("hello")).to.be.equal("goodbye");
      expect(modelA.get("foo")).to.be.equal("baz");
      expect(modelA.get("truth")).to.be.equal(true);
      expect(modelA["model_b"]).to.be.instanceOf(ModelB);
      expect(modelA["model_b"]).to.be.instanceOf(ModelB);
      expect(modelA["model_b"]).to.be.equal(modelB);
      modelA.set({
        "foo": "bar",
        "hello": "world"
      });
      expect(modelA.get("hello")).to.be.equal("world");
      expect(modelA.get("foo")).to.be.equal("bar");
      expect(modelA.get("truth")).to.be.equal(true);
      expect(modelA["model_b"]).to.be.instanceOf(ModelB);
      expect(modelA["model_b"]).to.be.instanceOf(ModelB);
      expect(modelA["model_b"]).to.be.equal(modelB);
      modelA.toggle("truth");
      expect(modelA.get("hello")).to.be.equal("world");
      expect(modelA.get("foo")).to.be.equal("bar");
      expect(modelA.get("truth")).to.be.equal(false);
      expect(modelA["model_b"]).to.be.instanceOf(ModelB);
      expect(modelA["model_b"]).to.be.equal(modelB);
      return expect(modelB.get("something")).to.be.equal("cool");
    });
    it("Should test the fill and serialize methods", function() {
      var CollectionC, ModelA, ModelB, ModelC, collectionC, data, key, modelA, modelB, modelB2, serialized, value, _ref, _ref1, _ref2, _ref3, _results;

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
      modelA.fill(data);
      expect(modelA.get("id")).to.be.equal(33);
      expect(modelA.get("foo")).to.be.equal("bar");
      expect(modelA.get("url")).to.be.equal("MODEL_A2");
      expect(modelA.get("model_b")).to.be.equal(modelB);
      expect(modelA.get("model_b").get("b_foo")).to.be.equal("B BAR");
      expect(modelA.get("model_b").get("url")).to.be.equal("model_b");
      expect(modelA.get("model_b2")).to.be.equal(modelB2);
      expect(modelA.get("model_b2").get("id")).to.be.equal("test");
      expect(modelA.get("model_b2").get("b_foo")).to.be.equal("B BAR 2");
      expect(modelA.get("model_b2").get("url")).to.be.equal("model_b2");
      expect(modelA.get("collection_c")).to.be.equal(collectionC);
      expect(modelA.get("collection_c").length()).to.equal(3);
      expect(modelA.get("collection_c").first()).to.be.instanceOf(ModelC);
      expect(modelA.get("collection_c").first().get("that")).to.equal("That One");
      serialized = modelA.serialize();
      expect(serialized['id']).to.equal(33);
      expect(serialized['foo']).to.equal("bar");
      expect(serialized['model_b']).to.be.a("object");
      expect(serialized['model_b']['id']).to.equal(null);
      expect(serialized['model_b']['b_foo']).to.equal("B BAR");
      expect(serialized['model_b2']).to.be.a("object");
      expect(serialized['model_b2']['id']).to.equal("test");
      expect(serialized['model_b2']['b_foo']).to.equal("B BAR 2");
      expect(serialized['collection_c']).to.be.a("array");
      expect(serialized['collection_c']).to.have.length(3);
      expect(serialized['collection_c'][0]).to.be.a("object");
      expect(serialized['collection_c'][0]['that']).to.equal("That One");
      serialized = modelA.serialize(["id", "foo"]);
      expect(serialized['id']).to.equal(33);
      expect(serialized['foo']).to.equal("bar");
      expect(serialized["model_b"]).to.be.undefined;
      expect(serialized["model_b2"]).to.be.undefined;
      expect(serialized["collection_c"]).to.be.undefined;
      serialized = modelA.serialize(["foo"]);
      expect(serialized['foo']).to.equal("bar");
      expect(serialized['id']).to.be.undefined;
      expect(serialized["model_b"]).to.be.undefined;
      expect(serialized["model_b2"]).to.be.undefined;
      expect(serialized["collection_c"]).to.be.undefined;
      serialized = modelA.serialize({
        "id": null,
        "model_b2": {
          "b_foo": null,
          "url": null
        }
      });
      expect(serialized['id']).to.equal(33);
      expect(serialized['model_b2']).to.be.a("object");
      expect(serialized['model_b2']['b_foo']).to.equal("B BAR 2");
      expect(serialized["model_b"]).to.be.undefined;
      expect(serialized["collection_c"]).to.be.undefined;
      serialized = modelA.serialize();
      for (key in serialized) {
        value = serialized[key];
        expect(Falcon.Object.prototype).to.not.include.keys(key);
      }
      serialized = modelA.serialize();
      _results = [];
      for (key in serialized) {
        value = serialized[key];
        if (key !== "id") {
          _results.push(expect(Falcon.Model.prototype).to.not.include.keys(key));
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
      expect(unwrapped['foo']).to.be.a("function");
      expect(unwrapped['foo']()).to.equal("bar");
      expect(unwrapped['model_b']).to.be.a("object");
      expect(unwrapped['model_b']['something']).to.be.a("function");
      expect(unwrapped['model_b']['something']()).to.equal("cool");
      expect(unwrapped['collection_c']).to.be.a("array");
      expect(unwrapped['collection_c']).to.have.length(2);
      expect(unwrapped['collection_c'][0]['hello']).to.equal("world");
      expect(unwrapped['collection_c'][1]['hello']).to.equal("world2");
      expect(unwrapped['id']).to.equal(null);
      expect(unwrapped['parent']).to.be.undefined;
      return expect(unwrapped['url']).to.be.undefined;
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
        expect(modelA.makeUrl("GET")).to.equal("/model_a/1");
        expect(modelA.makeUrl("POST")).to.equal("/model_a");
        expect(modelA.makeUrl("PUT")).to.equal("/model_a/1");
        return expect(modelA.makeUrl("DELETE")).to.equal("/model_a/1");
      });
      it("Should test the makeUrl method, string id, no baseUrl, no parent, no extension", function() {
        var modelB;

        modelB = new ModelB({
          id: "b"
        });
        expect(modelB.makeUrl("GET")).to.equal("/model_b/b");
        expect(modelB.makeUrl("POST")).to.equal("/model_b");
        expect(modelB.makeUrl("PUT")).to.equal("/model_b/b");
        return expect(modelB.makeUrl("DELETE")).to.equal("/model_b/b");
      });
      it("Should test the makeUrl method, numeric id, with shorter baseUrl, no parent, no extension", function() {
        var modelA;

        modelA = new ModelA({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(modelA.makeUrl("GET")).to.equal("http://www.falconjs.com/model_a/1");
        expect(modelA.makeUrl("POST")).to.equal("http://www.falconjs.com/model_a");
        expect(modelA.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_a/1");
        return expect(modelA.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_a/1");
      });
      it("Should test the makeUrl method, string id, with shorter baseUrl, no parent, no extension", function() {
        var modelB;

        modelB = new ModelB({
          id: "b"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(modelB.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/b");
        expect(modelB.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b");
        expect(modelB.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/b");
        return expect(modelB.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/b");
      });
      it("Should test the makeUrl method, numeric id, with baseUrl, no parent, no extension", function() {
        var modelA;

        modelA = new ModelA({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelA.makeUrl("GET")).to.equal("http://www.falconjs.com/model_a/1");
        expect(modelA.makeUrl("POST")).to.equal("http://www.falconjs.com/model_a");
        expect(modelA.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_a/1");
        return expect(modelA.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_a/1");
      });
      it("Should test the makeUrl method, string id, with baseUrl, no parent, no extension", function() {
        var modelB;

        modelB = new ModelB({
          id: "b"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelB.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/b");
        expect(modelB.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b");
        expect(modelB.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/b");
        return expect(modelB.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/b");
      });
      it("Should test the makeUrl method, no baseUrl, with parent, no extension", function() {
        var modelA, modelB;

        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 2
        }, modelB);
        expect(modelA.makeUrl("GET")).to.equal("/model_b/b/model_a/2");
        expect(modelA.makeUrl("POST")).to.equal("/model_b/b/model_a");
        expect(modelA.makeUrl("PUT")).to.equal("/model_b/b/model_a/2");
        return expect(modelA.makeUrl("DELETE")).to.equal("/model_b/b/model_a/2");
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
        expect(modelA.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/b/model_a/2");
        expect(modelA.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b/b/model_a");
        expect(modelA.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/b/model_a/2");
        return expect(modelA.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/b/model_a/2");
      });
      it("Should test the makeUrl method, no baseUrl, with explicit parent, no extension", function() {
        var modelA, modelB;

        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 3
        });
        expect(modelA.makeUrl("GET", modelB)).to.equal("/model_b/b/model_a/3");
        expect(modelA.makeUrl("POST", modelB)).to.equal("/model_b/b/model_a");
        expect(modelA.makeUrl("PUT", modelB)).to.equal("/model_b/b/model_a/3");
        return expect(modelA.makeUrl("DELETE", modelB)).to.equal("/model_b/b/model_a/3");
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
        expect(modelA.makeUrl("GET", modelB)).to.equal("http://www.falconjs.com/model_b/b/model_a/3");
        expect(modelA.makeUrl("POST", modelB)).to.equal("http://www.falconjs.com/model_b/b/model_a");
        expect(modelA.makeUrl("PUT", modelB)).to.equal("http://www.falconjs.com/model_b/b/model_a/3");
        return expect(modelA.makeUrl("DELETE", modelB)).to.equal("http://www.falconjs.com/model_b/b/model_a/3");
      });
      it("Should test the makeUrl method, no baseUrl, with overriden parent, no extension", function() {
        var modelA, modelB;

        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 3
        }, modelB);
        expect(modelA.makeUrl("GET", null)).to.equal("/model_a/3");
        expect(modelA.makeUrl("POST", null)).to.equal("/model_a");
        expect(modelA.makeUrl("PUT", null)).to.equal("/model_a/3");
        return expect(modelA.makeUrl("DELETE", null)).to.equal("/model_a/3");
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
        expect(modelA.makeUrl("GET", null)).to.equal("http://www.falconjs.com/model_a/3");
        expect(modelA.makeUrl("POST", null)).to.equal("http://www.falconjs.com/model_a");
        expect(modelA.makeUrl("PUT", null)).to.equal("http://www.falconjs.com/model_a/3");
        return expect(modelA.makeUrl("DELETE", null)).to.equal("http://www.falconjs.com/model_a/3");
      });
      it("Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", function() {
        var modelC;

        modelC = new ModelC({
          id: 1
        });
        expect(modelC.makeUrl("GET")).to.equal("/model_c/1.json");
        expect(modelC.makeUrl("POST")).to.equal("/model_c.json");
        expect(modelC.makeUrl("PUT")).to.equal("/model_c/1.json");
        return expect(modelC.makeUrl("DELETE")).to.equal("/model_c/1.json");
      });
      it("Should test the makeUrl method, numeric index, with shorter baseUrl, no parent, with extension", function() {
        var modelC;

        modelC = new ModelC({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(modelC.makeUrl("GET")).to.equal("http://www.falconjs.com/model_c/1.json");
        expect(modelC.makeUrl("POST")).to.equal("http://www.falconjs.com/model_c.json");
        expect(modelC.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_c/1.json");
        return expect(modelC.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_c/1.json");
      });
      it("Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", function() {
        var modelC;

        modelC = new ModelC({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelC.makeUrl("GET")).to.equal("http://www.falconjs.com/model_c/1.json");
        expect(modelC.makeUrl("POST")).to.equal("http://www.falconjs.com/model_c.json");
        expect(modelC.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_c/1.json");
        return expect(modelC.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_c/1.json");
      });
      it("Should test the makeUrl method, no baseUrl, with parent, with extension", function() {
        var modelB, modelC;

        modelB = new ModelB({
          id: "b"
        });
        modelC = new ModelC({
          id: 2
        }, modelB);
        expect(modelC.makeUrl("GET")).to.equal("/model_b/b/model_c/2.json");
        expect(modelC.makeUrl("POST")).to.equal("/model_b/b/model_c.json");
        expect(modelC.makeUrl("PUT")).to.equal("/model_b/b/model_c/2.json");
        return expect(modelC.makeUrl("DELETE")).to.equal("/model_b/b/model_c/2.json");
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
        expect(modelC.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/b/model_c/2.json");
        expect(modelC.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b/b/model_c.json");
        expect(modelC.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/b/model_c/2.json");
        return expect(modelC.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/b/model_c/2.json");
      });
      it("Should test the makeUrl method, no baseUrl, with explicit parent, with extension", function() {
        var modelB, modelC;

        modelB = new ModelB({
          id: "b"
        });
        modelC = new ModelC({
          id: 3
        });
        expect(modelC.makeUrl("GET", modelB)).to.equal("/model_b/b/model_c/3.json");
        expect(modelC.makeUrl("POST", modelB)).to.equal("/model_b/b/model_c.json");
        expect(modelC.makeUrl("PUT", modelB)).to.equal("/model_b/b/model_c/3.json");
        return expect(modelC.makeUrl("DELETE", modelB)).to.equal("/model_b/b/model_c/3.json");
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
        expect(modelC.makeUrl("GET", modelB)).to.equal("http://www.falconjs.com/model_b/b/model_c/3.json");
        expect(modelC.makeUrl("POST", modelB)).to.equal("http://www.falconjs.com/model_b/b/model_c.json");
        expect(modelC.makeUrl("PUT", modelB)).to.equal("http://www.falconjs.com/model_b/b/model_c/3.json");
        return expect(modelC.makeUrl("DELETE", modelB)).to.equal("http://www.falconjs.com/model_b/b/model_c/3.json");
      });
      it("Should test the makeUrl method, string index, no baseUrl, no parent, with extension", function() {
        var modelD;

        modelD = new ModelD({
          id: "d"
        });
        expect(modelD.makeUrl("GET")).to.equal("/model_d/d.json");
        expect(modelD.makeUrl("POST")).to.equal("/model_d.json");
        expect(modelD.makeUrl("PUT")).to.equal("/model_d/d.json");
        return expect(modelD.makeUrl("DELETE")).to.equal("/model_d/d.json");
      });
      it("Should test the makeUrl method, string index, with shorter baseUrl, no parent, with extension", function() {
        var modelD;

        modelD = new ModelD({
          id: "d"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(modelD.makeUrl("GET")).to.equal("http://www.falconjs.com/model_d/d.json");
        expect(modelD.makeUrl("POST")).to.equal("http://www.falconjs.com/model_d.json");
        expect(modelD.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_d/d.json");
        return expect(modelD.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_d/d.json");
      });
      it("Should test the makeUrl method, string index, with baseUrl, no parent, with extension", function() {
        var modelD;

        modelD = new ModelD({
          id: "d"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(modelD.makeUrl("GET")).to.equal("http://www.falconjs.com/model_d/d.json");
        expect(modelD.makeUrl("POST")).to.equal("http://www.falconjs.com/model_d.json");
        expect(modelD.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_d/d.json");
        return expect(modelD.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_d/d.json");
      });
      it("Should test the makeUrl method, no baseUrl, with non-ext. parent, with extension", function() {
        var modelA, modelD;

        modelD = new ModelD({
          id: "d"
        });
        modelA = new ModelA({
          id: 2
        }, modelD);
        expect(modelA.makeUrl("GET")).to.equal("/model_d/d/model_a/2");
        expect(modelA.makeUrl("POST")).to.equal("/model_d/d/model_a");
        expect(modelA.makeUrl("PUT")).to.equal("/model_d/d/model_a/2");
        return expect(modelA.makeUrl("DELETE")).to.equal("/model_d/d/model_a/2");
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
        expect(modelA.makeUrl("GET")).to.equal("http://www.falconjs.com/model_d/d/model_a/2");
        expect(modelA.makeUrl("POST")).to.equal("http://www.falconjs.com/model_d/d/model_a");
        expect(modelA.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_d/d/model_a/2");
        return expect(modelA.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_d/d/model_a/2");
      });
      it("Should test the makeUrl method, no baseUrl, with explicit non-ext. parent, with extension", function() {
        var modelA, modelD;

        modelD = new ModelD({
          id: "d"
        });
        modelA = new ModelA({
          id: 3
        });
        expect(modelA.makeUrl("GET", modelD)).to.equal("/model_d/d/model_a/3");
        expect(modelA.makeUrl("POST", modelD)).to.equal("/model_d/d/model_a");
        expect(modelA.makeUrl("PUT", modelD)).to.equal("/model_d/d/model_a/3");
        return expect(modelA.makeUrl("DELETE", modelD)).to.equal("/model_d/d/model_a/3");
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
        expect(modelA.makeUrl("GET", modelD)).to.equal("http://www.falconjs.com/model_d/d/model_a/3");
        expect(modelA.makeUrl("POST", modelD)).to.equal("http://www.falconjs.com/model_d/d/model_a");
        expect(modelA.makeUrl("PUT", modelD)).to.equal("http://www.falconjs.com/model_d/d/model_a/3");
        return expect(modelA.makeUrl("DELETE", modelD)).to.equal("http://www.falconjs.com/model_d/d/model_a/3");
      });
      it("Should test the makeUrl method, no baseUrl, with parent, with extension", function() {
        var modelC, modelD;

        modelD = new ModelD({
          id: "d"
        });
        modelC = new ModelC({
          id: 2
        }, modelD);
        expect(modelC.makeUrl("GET")).to.equal("/model_d/d/model_c/2.json");
        expect(modelC.makeUrl("POST")).to.equal("/model_d/d/model_c.json");
        expect(modelC.makeUrl("PUT")).to.equal("/model_d/d/model_c/2.json");
        return expect(modelC.makeUrl("DELETE")).to.equal("/model_d/d/model_c/2.json");
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
        expect(modelC.makeUrl("GET")).to.equal("http://www.falconjs.com/model_d/d/model_c/2.json");
        expect(modelC.makeUrl("POST")).to.equal("http://www.falconjs.com/model_d/d/model_c.json");
        expect(modelC.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_d/d/model_c/2.json");
        return expect(modelC.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_d/d/model_c/2.json");
      });
      it("Should test the makeUrl method, no baseUrl, with  explicit parent, with extension", function() {
        var modelC, modelD;

        modelD = new ModelD({
          id: "d"
        });
        modelC = new ModelC({
          id: 3
        });
        expect(modelC.makeUrl("GET", modelD)).to.equal("/model_d/d/model_c/3.json");
        expect(modelC.makeUrl("POST", modelD)).to.equal("/model_d/d/model_c.json");
        expect(modelC.makeUrl("PUT", modelD)).to.equal("/model_d/d/model_c/3.json");
        return expect(modelC.makeUrl("DELETE", modelD)).to.equal("/model_d/d/model_c/3.json");
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
        expect(modelC.makeUrl("GET", modelD)).to.equal("http://www.falconjs.com/model_d/d/model_c/3.json");
        expect(modelC.makeUrl("POST", modelD)).to.equal("http://www.falconjs.com/model_d/d/model_c.json");
        expect(modelC.makeUrl("PUT", modelD)).to.equal("http://www.falconjs.com/model_d/d/model_c/3.json");
        return expect(modelC.makeUrl("DELETE", modelD)).to.equal("http://www.falconjs.com/model_d/d/model_c/3.json");
      });
      it("Should be able to use url as a function, no parent", function() {
        var modelE;

        modelE = new ModelE({
          id: "e"
        });
        expect(modelE.makeUrl("GET")).to.equal("/model_e/e");
        expect(modelE.makeUrl("POST")).to.equal("/model_e");
        expect(modelE.makeUrl("PUT")).to.equal("/model_e/e");
        return expect(modelE.makeUrl("DELETE")).to.equal("/model_e/e");
      });
      it("Should be able to use url as a function, with parent", function() {
        var modelE;

        modelE = new ModelE({
          id: "e"
        }, new ModelB({
          id: "b"
        }));
        expect(modelE.makeUrl("GET")).to.equal("/model_b/b/model_e/e");
        expect(modelE.makeUrl("POST")).to.equal("/model_b/b/model_e");
        expect(modelE.makeUrl("PUT")).to.equal("/model_b/b/model_e/e");
        return expect(modelE.makeUrl("DELETE")).to.equal("/model_b/b/model_e/e");
      });
      it("Should be able to use override the url, no parent", function() {
        var modelE;

        modelE = new ModelE({
          id: "e",
          url: "model_e2"
        });
        expect(modelE.makeUrl("GET")).to.equal("/model_e2/e");
        expect(modelE.makeUrl("POST")).to.equal("/model_e2");
        expect(modelE.makeUrl("PUT")).to.equal("/model_e2/e");
        return expect(modelE.makeUrl("DELETE")).to.equal("/model_e2/e");
      });
      it("Should be able to use override the url,with parent", function() {
        var modelE;

        modelE = new ModelE({
          id: "e",
          url: "model_e3"
        }, new ModelB({
          id: "b"
        }));
        expect(modelE.makeUrl("GET")).to.equal("/model_b/b/model_e3/e");
        expect(modelE.makeUrl("POST")).to.equal("/model_b/b/model_e3");
        expect(modelE.makeUrl("PUT")).to.equal("/model_b/b/model_e3/e");
        return expect(modelE.makeUrl("DELETE")).to.equal("/model_b/b/model_e3/e");
      });
      return it("Should be able to handle '/' baseApiUrl", function() {
        var modelA;

        modelA = new ModelA({
          id: 1
        });
        Falcon.baseApiUrl = "/";
        expect(modelA.makeUrl("GET")).to.equal("/model_a/1");
        expect(modelA.makeUrl("POST")).to.equal("/model_a");
        expect(modelA.makeUrl("PUT")).to.equal("/model_a/1");
        return expect(modelA.makeUrl("DELETE")).to.equal("/model_a/1");
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
          expect(sync_stub).to.have.been.calledOnce;
          return expect(sync_stub).to.have.been.calledWith("GET", void 0);
        });
        it("Should call sync correctly on fetch with options", function() {
          modelA.fetch({});
          expect(sync_stub).to.have.been.calledOnce;
          return expect(sync_stub).to.have.been.calledWith("GET", {});
        });
        it("Should call sync correctly on create without options", function() {
          modelA.create();
          expect(sync_stub).to.have.been.calledOnce;
          return expect(sync_stub).to.have.been.calledWith("POST", void 0);
        });
        it("Should call sync correctly on create with options", function() {
          modelA.create({});
          expect(sync_stub).to.have.been.calledOnce;
          return expect(sync_stub).to.have.been.calledWith("POST", {});
        });
        it("Should call sync correctly on save without options", function() {
          modelA.set('id', 1);
          modelA.save();
          expect(sync_stub).to.have.been.calledOnce;
          return expect(sync_stub).to.have.been.calledWith("PUT", void 0);
        });
        it("Should call sync correctly on save with options", function() {
          modelA.set('id', 1);
          modelA.save({});
          expect(sync_stub).to.have.been.calledOnce;
          return expect(sync_stub).to.have.been.calledWith("PUT", {});
        });
        it("Should call sync correctly on destroy without options", function() {
          modelA.destroy();
          expect(sync_stub).to.have.been.calledOnce;
          return expect(sync_stub).to.have.been.calledWith("DELETE", void 0);
        });
        return it("Should call sync correctly on destroy with options", function() {
          modelA.destroy({});
          expect(sync_stub).to.have.been.calledOnce;
          return expect(sync_stub).to.have.been.calledWith("DELETE", {});
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
          expect(ajax_stub).to.have.been.calledOnce;
          expect(ajax_stub).to.have.been.calledWithMatch({
            type: "GET"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            url: modelA.makeUrl("GET")
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            data: ""
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            contentType: "application/json"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            cache: false
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            headers: {}
          });
          expect(ajax_stub.firstCall.args[0].success).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].success).to.have.length(3);
          expect(ajax_stub.firstCall.args[0].error).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].error).to.have.length(1);
          expect(ajax_stub.firstCall.args[0].complete).to.be.a("function");
          return expect(ajax_stub.firstCall.args[0].complete).to.have.length(2);
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
          expect(ajax_stub).to.have.been.calledOnce;
          expect(ajax_stub).to.have.been.calledWithMatch({
            type: "GET"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            url: "http://www.falconjs.com"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            data: JSON.stringify({
              "hello": "world"
            })
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            contentType: "text/html"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            cache: true
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            }
          });
          expect(ajax_stub.firstCall.args[0].success).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].success).to.have.length(3);
          expect(ajax_stub.firstCall.args[0].success).to.not.equal(_success);
          expect(ajax_stub.firstCall.args[0].error).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].error).to.have.length(1);
          expect(ajax_stub.firstCall.args[0].error).to.not.equal(_error);
          expect(ajax_stub.firstCall.args[0].complete).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].complete).to.have.length(2);
          return expect(ajax_stub.firstCall.args[0].complete).to.not.equal(_complete);
        });
        it("Should save properly without options", function() {
          var modelA;

          modelA = new ModelA({
            id: 1
          });
          modelA.save();
          expect(ajax_stub).to.have.been.calledOnce;
          expect(ajax_stub).to.have.been.calledWithMatch({
            type: "PUT"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            url: modelA.makeUrl("PUT")
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            data: JSON.stringify({
              "id": 1
            })
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            contentType: "application/json"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            cache: false
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            headers: {}
          });
          expect(ajax_stub.firstCall.args[0].success).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].success).to.have.length(3);
          expect(ajax_stub.firstCall.args[0].error).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].error).to.have.length(1);
          expect(ajax_stub.firstCall.args[0].complete).to.be.a("function");
          return expect(ajax_stub.firstCall.args[0].complete).to.have.length(2);
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
          expect(ajax_stub).to.have.been.calledOnce;
          expect(ajax_stub).to.have.been.calledWithMatch({
            type: "PUT"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            url: "http://www.falconjs.com"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            data: JSON.stringify({
              "hello": "world"
            })
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            contentType: "text/html"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            cache: true
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            }
          });
          expect(ajax_stub.firstCall.args[0].success).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].success).to.have.length(3);
          expect(ajax_stub.firstCall.args[0].success).to.not.equal(_success);
          expect(ajax_stub.firstCall.args[0].error).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].error).to.have.length(1);
          expect(ajax_stub.firstCall.args[0].error).to.not.equal(_error);
          expect(ajax_stub.firstCall.args[0].complete).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].complete).to.have.length(2);
          return expect(ajax_stub.firstCall.args[0].complete).to.not.equal(_complete);
        });
        it("Should create properly without options", function() {
          var modelA;

          modelA = new ModelA({
            id: 1
          });
          modelA.create();
          expect(ajax_stub).to.have.been.calledOnce;
          expect(ajax_stub).to.have.been.calledWithMatch({
            type: "POST"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            url: modelA.makeUrl("POST")
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            data: JSON.stringify({
              "id": 1
            })
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            contentType: "application/json"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            cache: false
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            headers: {}
          });
          expect(ajax_stub.firstCall.args[0].success).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].success).to.have.length(3);
          expect(ajax_stub.firstCall.args[0].error).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].error).to.have.length(1);
          expect(ajax_stub.firstCall.args[0].complete).to.be.a("function");
          return expect(ajax_stub.firstCall.args[0].complete).to.have.length(2);
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
          expect(ajax_stub).to.have.been.calledOnce;
          expect(ajax_stub).to.have.been.calledWithMatch({
            type: "POST"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            url: "http://www.falconjs.com"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            data: JSON.stringify({
              "hello": "world"
            })
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            contentType: "text/html"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            cache: true
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            }
          });
          expect(ajax_stub.firstCall.args[0].success).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].success).to.have.length(3);
          expect(ajax_stub.firstCall.args[0].success).to.not.equal(_success);
          expect(ajax_stub.firstCall.args[0].error).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].error).to.have.length(1);
          expect(ajax_stub.firstCall.args[0].error).to.not.equal(_error);
          expect(ajax_stub.firstCall.args[0].complete).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].complete).to.have.length(2);
          return expect(ajax_stub.firstCall.args[0].complete).to.not.equal(_complete);
        });
        it("Should destroy properly without options", function() {
          var modelA;

          modelA = new ModelA({
            id: 1
          });
          modelA.destroy();
          expect(ajax_stub).to.have.been.calledOnce;
          expect(ajax_stub).to.have.been.calledWithMatch({
            type: "DELETE"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            url: modelA.makeUrl("DELETE")
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            data: ""
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            contentType: "application/json"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            cache: false
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            headers: {}
          });
          expect(ajax_stub.firstCall.args[0].success).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].success).to.have.length(3);
          expect(ajax_stub.firstCall.args[0].error).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].error).to.have.length(1);
          expect(ajax_stub.firstCall.args[0].complete).to.be.a("function");
          return expect(ajax_stub.firstCall.args[0].complete).to.have.length(2);
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
          expect(ajax_stub).to.have.been.calledOnce;
          expect(ajax_stub).to.have.been.calledWithMatch({
            type: "DELETE"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            url: "http://www.falconjs.com"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            data: JSON.stringify({
              "hello": "world"
            })
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            contentType: "text/html"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            cache: true
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            headers: {
              "User-Agent": "User-Agent",
              "Chrome": "Chrome"
            }
          });
          expect(ajax_stub.firstCall.args[0].success).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].success).to.have.length(3);
          expect(ajax_stub.firstCall.args[0].success).to.not.equal(_success);
          expect(ajax_stub.firstCall.args[0].error).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].error).to.have.length(1);
          expect(ajax_stub.firstCall.args[0].error).to.not.equal(_error);
          expect(ajax_stub.firstCall.args[0].complete).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].complete).to.have.length(2);
          return expect(ajax_stub.firstCall.args[0].complete).to.not.equal(_complete);
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
          expect(parse_stub.callCount).to.equal(1);
          expect(parse_stub.firstCall.args[0]).to.deep.equal(data);
          expect(fill_stub.callCount).to.equal(1);
          expect(fill_stub.firstCall.args[0]).to.deep.equal(success_data);
          expect(fill_stub).to.have.been.calledAfter(parse_stub);
          expect(fetch_spy).to.have.been.calledOnce;
          expect(create_spy).to.not.have.been.called;
          expect(save_spy).to.not.have.been.called;
          expect(destroy_spy).to.not.have.been.called;
          expect(fetch_spy).to.have.been.calledAfter(fill_stub);
          expect(success_spy.callCount).to.equal(1);
          expect(success_spy).to.have.been.calledOn(modelA);
          expect(success_spy.firstCall.args.length).to.equal(4);
          expect(success_spy.firstCall.args[0]).to.equal(modelA);
          expect(error_spy).to.not.have.been.called;
          expect(complete_spy.callCount).to.equal(1);
          expect(complete_spy).to.have.been.calledOn(modelA);
          expect(complete_spy.firstCall.args.length).to.equal(3);
          expect(complete_spy.firstCall.args[0]).to.equal(modelA);
          return expect(complete_spy).to.have.been.calledAfter(success_spy);
        });
        it("Should not fill when fill option is false on fetch", function() {
          options.fill = false;
          modelA.fetch(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).to.equal(1);
          expect(parse_stub.firstCall.args[0]).to.deep.equal(data);
          expect(fill_stub.callCount).to.equal(0);
          expect(fetch_spy).to.have.been.calledOnce;
          expect(create_spy).to.not.have.been.called;
          expect(save_spy).to.not.have.been.called;
          expect(destroy_spy).to.not.have.been.called;
          expect(fetch_spy).to.have.been.calledAfter(parse_stub);
          expect(success_spy.callCount).to.equal(1);
          expect(success_spy).to.have.been.calledOn(modelA);
          expect(success_spy.firstCall.args.length).to.equal(4);
          expect(success_spy.firstCall.args[0]).to.equal(modelA);
          expect(error_spy).to.not.have.been.called;
          expect(complete_spy.callCount).to.equal(1);
          expect(complete_spy).to.have.been.calledOn(modelA);
          expect(complete_spy.firstCall.args.length).to.equal(3);
          expect(complete_spy.firstCall.args[0]).to.equal(modelA);
          return expect(complete_spy).to.have.been.calledAfter(success_spy);
        });
        it("Should call the error response on an errornous result", function() {
          modelA.fetch(options);
          server.respondWith([400, {}, JSON.stringify(error_data)]);
          server.respond();
          expect(parse_stub.callCount).to.equal(0);
          expect(fill_stub.callCount).to.equal(0);
          expect(fetch_spy).to.not.have.been.called;
          expect(create_spy).to.not.have.been.called;
          expect(save_spy).to.not.have.been.called;
          expect(destroy_spy).to.not.have.been.called;
          expect(success_spy.callCount).to.equal(0);
          expect(error_spy.callCount).to.equal(1);
          expect(error_spy.firstCall.args.length).to.equal(3);
          expect(error_spy).to.have.been.calledOn(modelA);
          expect(complete_spy.firstCall.args[0]).to.equal(modelA);
          expect(complete_spy.callCount).to.equal(1);
          expect(complete_spy).to.have.been.calledOn(modelA);
          expect(complete_spy.firstCall.args.length).to.equal(3);
          expect(complete_spy.firstCall.args[0]).to.equal(modelA);
          return expect(complete_spy).to.have.been.calledAfter(error_spy);
        });
        it("Should call the success response on create", function() {
          modelA.create(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).to.equal(1);
          expect(parse_stub.firstCall.args[0]).to.deep.equal(data);
          expect(fill_stub.callCount).to.equal(1);
          expect(fill_stub.firstCall.args[0]).to.deep.equal(success_data);
          expect(fill_stub).to.have.been.calledAfter(parse_stub);
          expect(fetch_spy).to.not.have.been.called;
          expect(create_spy.callCount).to.equal(1);
          expect(save_spy).to.not.have.been.called;
          expect(destroy_spy).to.not.have.been.called;
          expect(success_spy.callCount).to.equal(1);
          expect(success_spy).to.have.been.calledOn(modelA);
          expect(success_spy.firstCall.args.length).to.equal(4);
          expect(success_spy.firstCall.args[0]).to.equal(modelA);
          expect(error_spy).to.not.have.been.called;
          expect(complete_spy.callCount).to.equal(1);
          expect(complete_spy).to.have.been.calledOn(modelA);
          expect(complete_spy.firstCall.args.length).to.equal(3);
          expect(complete_spy.firstCall.args[0]).to.equal(modelA);
          return expect(complete_spy).to.have.been.calledAfter(success_spy);
        });
        it("Should call the success response on save", function() {
          modelA.set('id', 1);
          modelA.save(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).to.equal(1);
          expect(parse_stub.firstCall.args[0]).to.deep.equal(data);
          expect(fill_stub.callCount).to.equal(1);
          expect(fill_stub.firstCall.args[0]).to.deep.equal(success_data);
          expect(fill_stub).to.have.been.calledAfter(parse_stub);
          expect(fetch_spy).to.not.have.been.called;
          expect(create_spy).to.not.have.been.called;
          expect(save_spy.callCount).to.equal(1);
          expect(destroy_spy).to.not.have.been.called;
          expect(success_spy.callCount).to.equal(1);
          expect(success_spy).to.have.been.calledOn(modelA);
          expect(success_spy.firstCall.args.length).to.equal(4);
          expect(success_spy.firstCall.args[0]).to.equal(modelA);
          expect(error_spy).to.not.have.been.called;
          expect(complete_spy.callCount).to.equal(1);
          expect(complete_spy).to.have.been.calledOn(modelA);
          expect(complete_spy.firstCall.args.length).to.equal(3);
          expect(complete_spy.firstCall.args[0]).to.equal(modelA);
          return expect(complete_spy).to.have.been.calledAfter(success_spy);
        });
        return it("Should call the success response on destroy", function() {
          modelA.destroy(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          expect(parse_stub.callCount).to.equal(1);
          expect(parse_stub.firstCall.args[0]).to.deep.equal(data);
          expect(fill_stub.callCount).to.equal(1);
          expect(fill_stub.firstCall.args[0]).to.deep.equal(success_data);
          expect(fill_stub).to.have.been.calledAfter(parse_stub);
          expect(fetch_spy).to.not.have.been.called;
          expect(create_spy).to.not.have.been.called;
          expect(save_spy).to.not.have.been.called;
          expect(destroy_spy.callCount).to.equal(1);
          expect(success_spy.callCount).to.equal(1);
          expect(success_spy).to.have.been.calledOn(modelA);
          expect(success_spy.firstCall.args.length).to.equal(4);
          expect(success_spy.firstCall.args[0]).to.equal(modelA);
          expect(error_spy).to.not.have.been.called;
          expect(complete_spy.callCount).to.equal(1);
          expect(complete_spy).to.have.been.calledOn(modelA);
          expect(complete_spy.firstCall.args.length).to.equal(3);
          expect(complete_spy.firstCall.args[0]).to.equal(modelA);
          return expect(complete_spy).to.have.been.calledAfter(success_spy);
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
          expect(ajax_stub).to.have.been.calledOnce;
          expect(ajax_stub).to.have.been.calledWithMatch({
            type: "GET"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            url: modelA.makeUrl("GET")
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            data: ""
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            contentType: "application/json"
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            cache: false
          });
          expect(ajax_stub).to.have.been.calledWithMatch({
            headers: {}
          });
          expect(ajax_stub.firstCall.args[0].success).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].success).to.have.length(3);
          expect(ajax_stub.firstCall.args[0].error).to.be.a("function");
          expect(ajax_stub.firstCall.args[0].error).to.have.length(1);
          expect(ajax_stub.firstCall.args[0].complete).to.be.a("function");
          return expect(ajax_stub.firstCall.args[0].complete).to.have.length(2);
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
          return expect(ajax_stub).to.have.been.calledWithMatch({
            url: modelA.makeUrl("GET", model_b)
          });
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
          return expect(ajax_stub).to.have.been.calledWithMatch({
            url: modelA.makeUrl("GET", null)
          });
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
          expect(success_spy).to.have.been.called;
          return expect(success_spy).to.have.been.calledOn(modelB);
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
          expect(sync_stub).to.have.been.called;
          expect(sync_stub.firstCall.args[1]).to.equal(success_spy);
          return expect(sync_stub.firstCall.args[2]).to.equal(modelB);
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
          expect(sync_stub).to.have.been.called;
          expect(sync_stub.firstCall.args[1]).to.equal(success_spy);
          return expect(sync_stub.firstCall.args[2]).to.equal(modelB);
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
          expect(sync_stub).to.have.been.called;
          expect(sync_stub.firstCall.args[1]).to.equal(success_spy);
          return expect(sync_stub.firstCall.args[2]).to.equal(modelB);
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
          expect(sync_stub).to.have.been.called;
          expect(sync_stub.firstCall.args[1]).to.equal(success_spy);
          return expect(sync_stub.firstCall.args[2]).to.equal(modelB);
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
      expect(modelA_1.equals(modelA_1)).to.be["true"];
      expect(modelA_1.equals(modelA_2)).to.be["false"];
      expect(modelA_1.equals(1)).to.be["true"];
      expect(modelA_1.equals(new ModelA({
        id: 1
      }))).to.be["true"];
      expect(modelA_a.equals(modelA_a)).to.be["true"];
      expect(modelA_a.equals(modelA_2)).to.be["false"];
      expect(modelA_a.equals('a')).to.be["true"];
      expect(modelA_a.equals(new ModelA({
        id: 'a'
      }))).to.be["true"];
      expect(modelA_null_1.equals(modelA_null_2)).to.be["false"];
      return expect(modelA_null_1.equals(modelA_null_1)).to.be["true"];
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
        expect(modelA.hello).to.be.undefined;
        expect(modelA.foo).to.be.undefined;
        expect(modelA.model_b.test).to.be.undefined;
        modelA.mixin({
          "hello": (mixin_spy = sinon.spy()),
          "foo": ko.observable("bar"),
          "model_b": {
            "test": "123"
          }
        });
        expect(modelA.hello).not.to.be.undefined;
        expect(modelA.hello).to.be.a('function');
        expect(ko.isObservable(modelA.foo)).to.be["true"];
        expect(modelA.foo()).to.equal('bar');
        expect(modelA.model_b.test).not.to.be.undefined;
        expect(modelA.model_b.test).to.equal('123');
        modelA.hello('world');
        expect(mixin_spy).to.have.been.calledOnce;
        expect(mixin_spy).to.have.been.calledOn(modelA);
        expect(mixin_spy.firstCall.args[0]).to.equal(modelA);
        return expect(mixin_spy.firstCall.args[1]).to.equal('world');
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
        expect(model_a.get("hello")).to.equal("world");
        expect(model_a.get("foo")).to.equal("bar");
        expect(ko.isObservable(model_a.hello)).to.be["false"];
        model_a.mixin({
          "hello": ko.observable(),
          "foo": "baz"
        });
        expect(model_a.get("hello")).to.equal("world");
        expect(model_a.get("foo")).to.equal("bar");
        return expect(ko.isObservable(model_a.hello)).to.be["true"];
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
        expect(modelA1).to.not.equal(modelA2);
        expect(modelA2.hello).to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.id).to.exist;
        expect(modelA2.parent).to.exist;
        expect(modelA2.id).to.equal(1);
        expect(modelA2.parent).to.equal(modelB);
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.equal("bar");
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
        expect(modelA1).to.not.equal(modelA2);
        expect(modelA2.hello).not.to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.id).to.exist;
        expect(modelA2.parent).to.exist;
        expect(modelA2.id).to.equal(1);
        expect(modelA2.parent).to.equal(modelB);
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.equal("bar");
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
        expect(modelA1).to.not.equal(modelA2);
        expect(modelA2.hello).to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.id).to.exist;
        expect(modelA2.parent).not.to.exist;
        expect(modelA2.id).to.equal(1);
        expect(modelA2.parent).to.equal(null);
        expect(ko.isObservable(modelA2.hello)).to.be["false"];
        expect(modelA2.hello).to.be.equal("world");
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.undefined;
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
        expect(modelA1).to.not.equal(modelA2);
        expect(modelA2.hello).to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.parent).not.to.exist;
        expect(modelA2.id).to.equal(null);
        expect(modelA2.parent).to.equal(null);
        expect(ko.isObservable(modelA2.hello)).to.be["false"];
        expect(modelA2.hello).to.be.equal("world");
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.undefined;
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
        expect(modelA1).to.not.equal(modelA2);
        expect(modelA2.hello).to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.id).to.exist;
        expect(modelA2.parent).to.exist;
        expect(modelA2.parent).to.equal(modelC);
        expect(modelA2.id).to.equal(1);
        expect(modelA2.parent).to.equal(modelC);
        expect(ko.isObservable(modelA2.hello)).to.be["false"];
        expect(modelA2.hello).to.be.equal("world");
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.undefined;
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
        expect(modelA1).to.not.equal(modelA2);
        expect(modelA2.hello).to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.parent).to.exist;
        expect(modelA2.parent).to.equal(modelC);
        expect(modelA2.id).to.equal(null);
        expect(modelA2.parent).to.equal(modelC);
        expect(ko.isObservable(modelA2.hello)).to.be["false"];
        expect(modelA2.hello).to.be.equal("world");
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.undefined;
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
      expect(modelA.isNew()).to.be["true"];
      modelA = new ModelA({
        id: 1
      });
      expect(modelA.isNew()).to.be["false"];
      modelA = new ModelA({
        id: 'a'
      });
      return expect(modelA.isNew()).to.be["false"];
    });
  });

}).call(this);
