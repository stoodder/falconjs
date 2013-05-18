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
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith();
      init_stub.reset();
      modelA = new ModelA(modelB = new ModelB);
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith();
      expect(modelA.parent).to.be.equal(modelB);
      init_stub.reset();
      modelA = new ModelA(data = {
        "hello": "world"
      });
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith(data);
      expect(modelA.parent).to.be.undefined;
      init_stub.reset();
      modelA = new ModelA(data = {
        "hello": "world"
      }, modelB = new ModelB);
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith(data);
      expect(modelA.parent).to.be.equal(modelB);
      init_stub.reset();
      modelA = new ModelA(modelB = new ModelB, data = {
        "hello": "world"
      });
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith(data);
      expect(modelA.parent).to.be.equal(modelB);
      init_stub.reset();
      modelA = new ModelA(dataModel = new Falcon.Model({
        "hello": "world"
      }), modelB = new ModelB);
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith(dataModel.unwrap());
      expect(modelA.parent).to.be.equal(modelB);
      init_stub.reset();
      return init_stub.restore();
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
      var CollectionC, ModelA, ModelB, ModelC, collectionC, modelA, modelB, modelB2, serialized, server_data, _ref, _ref1, _ref2, _ref3;

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

        ModelA.prototype.fields = {
          "foo": "foo",
          "model_b": "model_b",
          "model_b2": "model_b2",
          "collection_c": "collection_c",
          "_server": "_client",
          "url": "_url"
        };

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

        ModelB.prototype.fields = {
          "b_foo": "b_bar"
        };

        return ModelB;

      })(Falcon.Model);
      ModelC = (function(_super) {
        __extends(ModelC, _super);

        function ModelC() {
          _ref2 = ModelC.__super__.constructor.apply(this, arguments);
          return _ref2;
        }

        ModelC.prototype.fields = {
          "this": "that"
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
      server_data = {
        "id": 33,
        "foo": "bar",
        "_server": "Some Data",
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
            "this": "That One"
          }, {
            "this": "That Two"
          }, {
            "this": "That Three"
          }
        ]
      };
      modelA = new ModelA();
      modelA.fill(server_data);
      expect(modelA.get("id")).to.be.equal(33);
      expect(modelA.get("foo")).to.be.equal("bar");
      expect(modelA.get("_server")).to.be.undefined;
      expect(modelA.get("_client")).to.be.equal("Some Data");
      expect(modelA.get("url")).to.be.equal("model_a");
      expect(modelA.get("_url")).to.be.equal("MODEL_A2");
      expect(modelA.get("model_b")).to.be.equal(modelB);
      expect(modelA.get("model_b").get("b_foo")).to.be.undefined;
      expect(modelA.get("model_b").get("b_bar")).to.be.equal("B BAR");
      expect(modelA.get("model_b").get("url")).to.be.equal("model_b");
      expect(modelA.get("model_b2")).to.be.equal(modelB2);
      expect(modelA.get("model_b2").get("id")).to.be.equal("test");
      expect(modelA.get("model_b2").get("b_foo")).to.be.undefined;
      expect(modelA.get("model_b2").get("b_bar")).to.be.equal("B BAR 2");
      expect(modelA.get("model_b2").get("url")).to.be.equal("model_b2");
      expect(modelA.get("collection_c")).to.be.instanceOf(CollectionC);
      expect(modelA.get("collection_c")).to.be.equal(collectionC);
      expect(modelA.get("collection_c").length()).to.equal(3);
      expect(modelA.get("collection_c").first()).to.be.instanceOf(ModelC);
      expect(modelA.get("collection_c").first().get("this")).to.be.undefined;
      expect(modelA.get("collection_c").first().get("that")).to.equal("That One");
      serialized = modelA.serialize();
      serialized['id'].should.equal(33);
      serialized['foo'].should.equal("bar");
      serialized['_server'].should.equal("Some Data");
      serialized['model_b'].should.be.a("object");
      expect(serialized['model_b']['id']).to.equal(null);
      serialized['model_b']['b_foo'].should.equal("B BAR");
      serialized['model_b2'].should.be.a("object");
      serialized['model_b2']['id'].should.equal("test");
      serialized['model_b2']['b_foo'].should.equal("B BAR 2");
      serialized['collection_c'].should.be.a("array");
      serialized['collection_c'].should.have.length(3);
      serialized['collection_c'][0].should.be.a("object");
      serialized['collection_c'][0]['this'].should.equal("That One");
      expect(serialized['_client']).to.be.undefined;
      expect(serialized["model_b"]['b_bar']).to.be.undefined;
      expect(serialized["model_b2"]['b_bar']).to.be.undefined;
      expect(serialized['collection_c'][0]['that']).to.be.undefined;
      serialized = modelA.serialize(["id", "_client"]);
      serialized['id'].should.equal(33);
      serialized['_server'].should.equal("Some Data");
      expect(serialized['foo']).to.be.undefined;
      expect(serialized['_client']).to.be.undefined;
      expect(serialized["model_b"]).to.be.undefined;
      expect(serialized["model_b2"]).to.be.undefined;
      return expect(serialized["collection_c"]).to.be.undefined;
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

        ModelA.prototype.fields = {
          "quux": "foo"
        };

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
      modelA = new ModelA;
      modelA.fill({
        "quux": "bar",
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
      expect(unwrapped['quux']).to.be.undefined;
      unwrapped['foo'].should.be.a("function");
      unwrapped['foo']().should.equal("bar");
      unwrapped['model_b'].should.be.a("object");
      unwrapped['model_b']['something'].should.be.a("function");
      unwrapped['model_b']['something']().should.equal("cool");
      unwrapped['collection_c'].should.be.a("array");
      unwrapped['collection_c'].should.have.length(2);
      unwrapped['collection_c'][0]['hello'].should.equal("world");
      return unwrapped['collection_c'][1]['hello'].should.equal("world2");
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
        modelA.makeUrl("GET").should.equal("/model_a/1");
        modelA.makeUrl("POST").should.equal("/model_a");
        modelA.makeUrl("PUT").should.equal("/model_a/1");
        return modelA.makeUrl("DELETE").should.equal("/model_a/1");
      });
      it("Should test the makeUrl method, string id, no baseUrl, no parent, no extension", function() {
        var modelB;

        modelB = new ModelB({
          id: "b"
        });
        modelB.makeUrl("GET").should.equal("/model_b/b");
        modelB.makeUrl("POST").should.equal("/model_b");
        modelB.makeUrl("PUT").should.equal("/model_b/b");
        return modelB.makeUrl("DELETE").should.equal("/model_b/b");
      });
      it("Should test the makeUrl method, numeric id, with shorter baseUrl, no parent, no extension", function() {
        var modelA;

        modelA = new ModelA({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        modelA.makeUrl("GET").should.equal("http://www.falconjs.com/model_a/1");
        modelA.makeUrl("POST").should.equal("http://www.falconjs.com/model_a");
        modelA.makeUrl("PUT").should.equal("http://www.falconjs.com/model_a/1");
        return modelA.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_a/1");
      });
      it("Should test the makeUrl method, string id, with shorter baseUrl, no parent, no extension", function() {
        var modelB;

        modelB = new ModelB({
          id: "b"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        modelB.makeUrl("GET").should.equal("http://www.falconjs.com/model_b/b");
        modelB.makeUrl("POST").should.equal("http://www.falconjs.com/model_b");
        modelB.makeUrl("PUT").should.equal("http://www.falconjs.com/model_b/b");
        return modelB.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_b/b");
      });
      it("Should test the makeUrl method, numeric id, with baseUrl, no parent, no extension", function() {
        var modelA;

        modelA = new ModelA({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        modelA.makeUrl("GET").should.equal("http://www.falconjs.com/model_a/1");
        modelA.makeUrl("POST").should.equal("http://www.falconjs.com/model_a");
        modelA.makeUrl("PUT").should.equal("http://www.falconjs.com/model_a/1");
        return modelA.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_a/1");
      });
      it("Should test the makeUrl method, string id, with baseUrl, no parent, no extension", function() {
        var modelB;

        modelB = new ModelB({
          id: "b"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        modelB.makeUrl("GET").should.equal("http://www.falconjs.com/model_b/b");
        modelB.makeUrl("POST").should.equal("http://www.falconjs.com/model_b");
        modelB.makeUrl("PUT").should.equal("http://www.falconjs.com/model_b/b");
        return modelB.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_b/b");
      });
      it("Should test the makeUrl method, no baseUrl, with parent, no extension", function() {
        var modelA, modelB;

        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 2
        }, modelB);
        modelA.makeUrl("GET").should.equal("/model_b/b/model_a/2");
        modelA.makeUrl("POST").should.equal("/model_b/b/model_a");
        modelA.makeUrl("PUT").should.equal("/model_b/b/model_a/2");
        return modelA.makeUrl("DELETE").should.equal("/model_b/b/model_a/2");
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
        modelA.makeUrl("GET").should.equal("http://www.falconjs.com/model_b/b/model_a/2");
        modelA.makeUrl("POST").should.equal("http://www.falconjs.com/model_b/b/model_a");
        modelA.makeUrl("PUT").should.equal("http://www.falconjs.com/model_b/b/model_a/2");
        return modelA.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_b/b/model_a/2");
      });
      it("Should test the makeUrl method, no baseUrl, with explicit parent, no extension", function() {
        var modelA, modelB;

        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 3
        });
        modelA.makeUrl("GET", modelB).should.equal("/model_b/b/model_a/3");
        modelA.makeUrl("POST", modelB).should.equal("/model_b/b/model_a");
        modelA.makeUrl("PUT", modelB).should.equal("/model_b/b/model_a/3");
        return modelA.makeUrl("DELETE", modelB).should.equal("/model_b/b/model_a/3");
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
        modelA.makeUrl("GET", modelB).should.equal("http://www.falconjs.com/model_b/b/model_a/3");
        modelA.makeUrl("POST", modelB).should.equal("http://www.falconjs.com/model_b/b/model_a");
        modelA.makeUrl("PUT", modelB).should.equal("http://www.falconjs.com/model_b/b/model_a/3");
        return modelA.makeUrl("DELETE", modelB).should.equal("http://www.falconjs.com/model_b/b/model_a/3");
      });
      it("Should test the makeUrl method, no baseUrl, with overriden parent, no extension", function() {
        var modelA, modelB;

        modelB = new ModelB({
          id: "b"
        });
        modelA = new ModelA({
          id: 3
        }, modelB);
        modelA.makeUrl("GET", null).should.equal("/model_a/3");
        modelA.makeUrl("POST", null).should.equal("/model_a");
        modelA.makeUrl("PUT", null).should.equal("/model_a/3");
        return modelA.makeUrl("DELETE", null).should.equal("/model_a/3");
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
        modelA.makeUrl("GET", null).should.equal("http://www.falconjs.com/model_a/3");
        modelA.makeUrl("POST", null).should.equal("http://www.falconjs.com/model_a");
        modelA.makeUrl("PUT", null).should.equal("http://www.falconjs.com/model_a/3");
        return modelA.makeUrl("DELETE", null).should.equal("http://www.falconjs.com/model_a/3");
      });
      it("Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", function() {
        var modelC;

        modelC = new ModelC({
          id: 1
        });
        modelC.makeUrl("GET").should.equal("/model_c/1.json");
        modelC.makeUrl("POST").should.equal("/model_c.json");
        modelC.makeUrl("PUT").should.equal("/model_c/1.json");
        return modelC.makeUrl("DELETE").should.equal("/model_c/1.json");
      });
      it("Should test the makeUrl method, numeric index, with shorter baseUrl, no parent, with extension", function() {
        var modelC;

        modelC = new ModelC({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        modelC.makeUrl("GET").should.equal("http://www.falconjs.com/model_c/1.json");
        modelC.makeUrl("POST").should.equal("http://www.falconjs.com/model_c.json");
        modelC.makeUrl("PUT").should.equal("http://www.falconjs.com/model_c/1.json");
        return modelC.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_c/1.json");
      });
      it("Should test the makeUrl method, numeric index, no baseUrl, no parent, with extension", function() {
        var modelC;

        modelC = new ModelC({
          id: 1
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        modelC.makeUrl("GET").should.equal("http://www.falconjs.com/model_c/1.json");
        modelC.makeUrl("POST").should.equal("http://www.falconjs.com/model_c.json");
        modelC.makeUrl("PUT").should.equal("http://www.falconjs.com/model_c/1.json");
        return modelC.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_c/1.json");
      });
      it("Should test the makeUrl method, no baseUrl, with parent, with extension", function() {
        var modelB, modelC;

        modelB = new ModelB({
          id: "b"
        });
        modelC = new ModelC({
          id: 2
        }, modelB);
        modelC.makeUrl("GET").should.equal("/model_b/b/model_c/2.json");
        modelC.makeUrl("POST").should.equal("/model_b/b/model_c.json");
        modelC.makeUrl("PUT").should.equal("/model_b/b/model_c/2.json");
        return modelC.makeUrl("DELETE").should.equal("/model_b/b/model_c/2.json");
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
        modelC.makeUrl("GET").should.equal("http://www.falconjs.com/model_b/b/model_c/2.json");
        modelC.makeUrl("POST").should.equal("http://www.falconjs.com/model_b/b/model_c.json");
        modelC.makeUrl("PUT").should.equal("http://www.falconjs.com/model_b/b/model_c/2.json");
        return modelC.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_b/b/model_c/2.json");
      });
      it("Should test the makeUrl method, no baseUrl, with explicit parent, with extension", function() {
        var modelB, modelC;

        modelB = new ModelB({
          id: "b"
        });
        modelC = new ModelC({
          id: 3
        });
        modelC.makeUrl("GET", modelB).should.equal("/model_b/b/model_c/3.json");
        modelC.makeUrl("POST", modelB).should.equal("/model_b/b/model_c.json");
        modelC.makeUrl("PUT", modelB).should.equal("/model_b/b/model_c/3.json");
        return modelC.makeUrl("DELETE", modelB).should.equal("/model_b/b/model_c/3.json");
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
        modelC.makeUrl("GET", modelB).should.equal("http://www.falconjs.com/model_b/b/model_c/3.json");
        modelC.makeUrl("POST", modelB).should.equal("http://www.falconjs.com/model_b/b/model_c.json");
        modelC.makeUrl("PUT", modelB).should.equal("http://www.falconjs.com/model_b/b/model_c/3.json");
        return modelC.makeUrl("DELETE", modelB).should.equal("http://www.falconjs.com/model_b/b/model_c/3.json");
      });
      it("Should test the makeUrl method, string index, no baseUrl, no parent, with extension", function() {
        var modelD;

        modelD = new ModelD({
          id: "d"
        });
        modelD.makeUrl("GET").should.equal("/model_d/d.json");
        modelD.makeUrl("POST").should.equal("/model_d.json");
        modelD.makeUrl("PUT").should.equal("/model_d/d.json");
        return modelD.makeUrl("DELETE").should.equal("/model_d/d.json");
      });
      it("Should test the makeUrl method, string index, with shorter baseUrl, no parent, with extension", function() {
        var modelD;

        modelD = new ModelD({
          id: "d"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com";
        modelD.makeUrl("GET").should.equal("http://www.falconjs.com/model_d/d.json");
        modelD.makeUrl("POST").should.equal("http://www.falconjs.com/model_d.json");
        modelD.makeUrl("PUT").should.equal("http://www.falconjs.com/model_d/d.json");
        return modelD.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_d/d.json");
      });
      it("Should test the makeUrl method, string index, with baseUrl, no parent, with extension", function() {
        var modelD;

        modelD = new ModelD({
          id: "d"
        });
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        modelD.makeUrl("GET").should.equal("http://www.falconjs.com/model_d/d.json");
        modelD.makeUrl("POST").should.equal("http://www.falconjs.com/model_d.json");
        modelD.makeUrl("PUT").should.equal("http://www.falconjs.com/model_d/d.json");
        return modelD.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_d/d.json");
      });
      it("Should test the makeUrl method, no baseUrl, with non-ext. parent, with extension", function() {
        var modelA, modelD;

        modelD = new ModelD({
          id: "d"
        });
        modelA = new ModelA({
          id: 2
        }, modelD);
        modelA.makeUrl("GET").should.equal("/model_d/d/model_a/2");
        modelA.makeUrl("POST").should.equal("/model_d/d/model_a");
        modelA.makeUrl("PUT").should.equal("/model_d/d/model_a/2");
        return modelA.makeUrl("DELETE").should.equal("/model_d/d/model_a/2");
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
        modelA.makeUrl("GET").should.equal("http://www.falconjs.com/model_d/d/model_a/2");
        modelA.makeUrl("POST").should.equal("http://www.falconjs.com/model_d/d/model_a");
        modelA.makeUrl("PUT").should.equal("http://www.falconjs.com/model_d/d/model_a/2");
        return modelA.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_d/d/model_a/2");
      });
      it("Should test the makeUrl method, no baseUrl, with explicit non-ext. parent, with extension", function() {
        var modelA, modelD;

        modelD = new ModelD({
          id: "d"
        });
        modelA = new ModelA({
          id: 3
        });
        modelA.makeUrl("GET", modelD).should.equal("/model_d/d/model_a/3");
        modelA.makeUrl("POST", modelD).should.equal("/model_d/d/model_a");
        modelA.makeUrl("PUT", modelD).should.equal("/model_d/d/model_a/3");
        return modelA.makeUrl("DELETE", modelD).should.equal("/model_d/d/model_a/3");
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
        modelA.makeUrl("GET", modelD).should.equal("http://www.falconjs.com/model_d/d/model_a/3");
        modelA.makeUrl("POST", modelD).should.equal("http://www.falconjs.com/model_d/d/model_a");
        modelA.makeUrl("PUT", modelD).should.equal("http://www.falconjs.com/model_d/d/model_a/3");
        return modelA.makeUrl("DELETE", modelD).should.equal("http://www.falconjs.com/model_d/d/model_a/3");
      });
      it("Should test the makeUrl method, no baseUrl, with parent, with extension", function() {
        var modelC, modelD;

        modelD = new ModelD({
          id: "d"
        });
        modelC = new ModelC({
          id: 2
        }, modelD);
        modelC.makeUrl("GET").should.equal("/model_d/d/model_c/2.json");
        modelC.makeUrl("POST").should.equal("/model_d/d/model_c.json");
        modelC.makeUrl("PUT").should.equal("/model_d/d/model_c/2.json");
        return modelC.makeUrl("DELETE").should.equal("/model_d/d/model_c/2.json");
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
        modelC.makeUrl("GET").should.equal("http://www.falconjs.com/model_d/d/model_c/2.json");
        modelC.makeUrl("POST").should.equal("http://www.falconjs.com/model_d/d/model_c.json");
        modelC.makeUrl("PUT").should.equal("http://www.falconjs.com/model_d/d/model_c/2.json");
        return modelC.makeUrl("DELETE").should.equal("http://www.falconjs.com/model_d/d/model_c/2.json");
      });
      it("Should test the makeUrl method, no baseUrl, with  explicit parent, with extension", function() {
        var modelC, modelD;

        modelD = new ModelD({
          id: "d"
        });
        modelC = new ModelC({
          id: 3
        });
        modelC.makeUrl("GET", modelD).should.equal("/model_d/d/model_c/3.json");
        modelC.makeUrl("POST", modelD).should.equal("/model_d/d/model_c.json");
        modelC.makeUrl("PUT", modelD).should.equal("/model_d/d/model_c/3.json");
        return modelC.makeUrl("DELETE", modelD).should.equal("/model_d/d/model_c/3.json");
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
        modelC.makeUrl("GET", modelD).should.equal("http://www.falconjs.com/model_d/d/model_c/3.json");
        modelC.makeUrl("POST", modelD).should.equal("http://www.falconjs.com/model_d/d/model_c.json");
        modelC.makeUrl("PUT", modelD).should.equal("http://www.falconjs.com/model_d/d/model_c/3.json");
        return modelC.makeUrl("DELETE", modelD).should.equal("http://www.falconjs.com/model_d/d/model_c/3.json");
      });
      it("Should be able to use url as a function, no parent", function() {
        var modelE;

        modelE = new ModelE({
          id: "e"
        });
        modelE.makeUrl("GET").should.equal("/model_e/e");
        modelE.makeUrl("POST").should.equal("/model_e");
        modelE.makeUrl("PUT").should.equal("/model_e/e");
        return modelE.makeUrl("DELETE").should.equal("/model_e/e");
      });
      it("Should be able to use url as a function, with parent", function() {
        var modelE;

        modelE = new ModelE({
          id: "e"
        }, new ModelB({
          id: "b"
        }));
        modelE.makeUrl("GET").should.equal("/model_b/b/model_e/e");
        modelE.makeUrl("POST").should.equal("/model_b/b/model_e");
        modelE.makeUrl("PUT").should.equal("/model_b/b/model_e/e");
        return modelE.makeUrl("DELETE").should.equal("/model_b/b/model_e/e");
      });
      it("Should be able to use override the url, no parent", function() {
        var modelE;

        modelE = new ModelE({
          id: "e",
          url: "model_e2"
        });
        modelE.makeUrl("GET").should.equal("/model_e2/e");
        modelE.makeUrl("POST").should.equal("/model_e2");
        modelE.makeUrl("PUT").should.equal("/model_e2/e");
        return modelE.makeUrl("DELETE").should.equal("/model_e2/e");
      });
      return it("Should be able to use override the url,with parent", function() {
        var modelE;

        modelE = new ModelE({
          id: "e",
          url: "model_e3"
        }, new ModelB({
          id: "b"
        }));
        modelE.makeUrl("GET").should.equal("/model_b/b/model_e3/e");
        modelE.makeUrl("POST").should.equal("/model_b/b/model_e3");
        modelE.makeUrl("PUT").should.equal("/model_b/b/model_e3/e");
        return modelE.makeUrl("DELETE").should.equal("/model_b/b/model_e3/e");
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
          sync_stub.should.have.been.calledOnce;
          return sync_stub.should.have.been.calledWith("GET", void 0);
        });
        it("Should call sync correctly on fetch with options", function() {
          modelA.fetch({});
          sync_stub.should.have.been.calledOnce;
          return sync_stub.should.have.been.calledWith("GET", {});
        });
        it("Should call sync correctly on create without options", function() {
          modelA.create();
          sync_stub.should.have.been.calledOnce;
          return sync_stub.should.have.been.calledWith("POST", void 0);
        });
        it("Should call sync correctly on create with options", function() {
          modelA.create({});
          sync_stub.should.have.been.calledOnce;
          return sync_stub.should.have.been.calledWith("POST", {});
        });
        it("Should call sync correctly on save without options", function() {
          modelA.save();
          sync_stub.should.have.been.calledOnce;
          return sync_stub.should.have.been.calledWith("PUT", void 0);
        });
        it("Should call sync correctly on save with options", function() {
          modelA.save({});
          sync_stub.should.have.been.calledOnce;
          return sync_stub.should.have.been.calledWith("PUT", {});
        });
        it("Should call sync correctly on destroy without options", function() {
          modelA.destroy();
          sync_stub.should.have.been.calledOnce;
          return sync_stub.should.have.been.calledWith("DELETE", void 0);
        });
        return it("Should call sync correctly on destroy with options", function() {
          modelA.destroy({});
          sync_stub.should.have.been.calledOnce;
          return sync_stub.should.have.been.calledWith("DELETE", {});
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
          ajax_stub.should.have.been.calledOnce;
          ajax_stub.should.have.been.calledWithMatch({
            type: "GET"
          });
          ajax_stub.should.have.been.calledWithMatch({
            url: modelA.makeUrl("GET")
          });
          ajax_stub.should.have.been.calledWithMatch({
            data: ""
          });
          ajax_stub.should.have.been.calledWithMatch({
            contentType: "application/json"
          });
          ajax_stub.should.have.been.calledWithMatch({
            cache: false
          });
          ajax_stub.should.have.been.calledWithMatch({
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
          ajax_stub.should.have.been.calledOnce;
          ajax_stub.should.have.been.calledWithMatch({
            type: "GET"
          });
          ajax_stub.should.have.been.calledWithMatch({
            url: "http://www.falconjs.com"
          });
          ajax_stub.should.have.been.calledWithMatch({
            data: JSON.stringify({
              "hello": "world"
            })
          });
          ajax_stub.should.have.been.calledWithMatch({
            contentType: "text/html"
          });
          ajax_stub.should.have.been.calledWithMatch({
            cache: true
          });
          ajax_stub.should.have.been.calledWithMatch({
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
          ajax_stub.should.have.been.calledOnce;
          ajax_stub.should.have.been.calledWithMatch({
            type: "PUT"
          });
          ajax_stub.should.have.been.calledWithMatch({
            url: modelA.makeUrl("PUT")
          });
          ajax_stub.should.have.been.calledWithMatch({
            data: JSON.stringify({
              "id": 1
            })
          });
          ajax_stub.should.have.been.calledWithMatch({
            contentType: "application/json"
          });
          ajax_stub.should.have.been.calledWithMatch({
            cache: false
          });
          ajax_stub.should.have.been.calledWithMatch({
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
          ajax_stub.should.have.been.calledOnce;
          ajax_stub.should.have.been.calledWithMatch({
            type: "PUT"
          });
          ajax_stub.should.have.been.calledWithMatch({
            url: "http://www.falconjs.com"
          });
          ajax_stub.should.have.been.calledWithMatch({
            data: JSON.stringify({
              "id": 1,
              "hello": "world"
            })
          });
          ajax_stub.should.have.been.calledWithMatch({
            contentType: "text/html"
          });
          ajax_stub.should.have.been.calledWithMatch({
            cache: true
          });
          ajax_stub.should.have.been.calledWithMatch({
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
          ajax_stub.should.have.been.calledOnce;
          ajax_stub.should.have.been.calledWithMatch({
            type: "POST"
          });
          ajax_stub.should.have.been.calledWithMatch({
            url: modelA.makeUrl("POST")
          });
          ajax_stub.should.have.been.calledWithMatch({
            data: JSON.stringify({
              "id": 1
            })
          });
          ajax_stub.should.have.been.calledWithMatch({
            contentType: "application/json"
          });
          ajax_stub.should.have.been.calledWithMatch({
            cache: false
          });
          ajax_stub.should.have.been.calledWithMatch({
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
          ajax_stub.should.have.been.calledOnce;
          ajax_stub.should.have.been.calledWithMatch({
            type: "POST"
          });
          ajax_stub.should.have.been.calledWithMatch({
            url: "http://www.falconjs.com"
          });
          ajax_stub.should.have.been.calledWithMatch({
            data: JSON.stringify({
              "id": 1,
              "hello": "world"
            })
          });
          ajax_stub.should.have.been.calledWithMatch({
            contentType: "text/html"
          });
          ajax_stub.should.have.been.calledWithMatch({
            cache: true
          });
          ajax_stub.should.have.been.calledWithMatch({
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
          ajax_stub.should.have.been.calledOnce;
          ajax_stub.should.have.been.calledWithMatch({
            type: "DELETE"
          });
          ajax_stub.should.have.been.calledWithMatch({
            url: modelA.makeUrl("DELETE")
          });
          ajax_stub.should.have.been.calledWithMatch({
            data: ""
          });
          ajax_stub.should.have.been.calledWithMatch({
            contentType: "application/json"
          });
          ajax_stub.should.have.been.calledWithMatch({
            cache: false
          });
          ajax_stub.should.have.been.calledWithMatch({
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
          ajax_stub.should.have.been.calledOnce;
          ajax_stub.should.have.been.calledWithMatch({
            type: "DELETE"
          });
          ajax_stub.should.have.been.calledWithMatch({
            url: "http://www.falconjs.com"
          });
          ajax_stub.should.have.been.calledWithMatch({
            data: JSON.stringify({
              "hello": "world"
            })
          });
          ajax_stub.should.have.been.calledWithMatch({
            contentType: "text/html"
          });
          ajax_stub.should.have.been.calledWithMatch({
            cache: true
          });
          ajax_stub.should.have.been.calledWithMatch({
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
      return describe("Testing sync method XHR responses", function() {
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
          parse_stub.callCount.should.equal(1);
          parse_stub.firstCall.args[0].should.deep.equal(data);
          fill_stub.callCount.should.equal(1);
          fill_stub.firstCall.args[0].should.deep.equal(success_data);
          fill_stub.should.have.been.calledAfter(parse_stub);
          fetch_spy.should.have.been.calledOnce;
          create_spy.should.not.have.been.called;
          save_spy.should.not.have.been.called;
          destroy_spy.should.not.have.been.called;
          fetch_spy.should.have.been.calledAfter(fill_stub);
          success_spy.callCount.should.equal(1);
          success_spy.should.have.been.calledOn(modelA);
          success_spy.firstCall.args.length.should.equal(4);
          success_spy.firstCall.args[0].should.equal(modelA);
          error_spy.should.not.have.been.called;
          complete_spy.callCount.should.equal(1);
          complete_spy.should.have.been.calledOn(modelA);
          complete_spy.firstCall.args.length.should.equal(3);
          complete_spy.firstCall.args[0].should.equal(modelA);
          return complete_spy.should.have.been.calledAfter(success_spy);
        });
        it("Should not fill when fill option is false on fetch", function() {
          options.fill = false;
          modelA.fetch(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          parse_stub.callCount.should.equal(1);
          parse_stub.firstCall.args[0].should.deep.equal(data);
          fill_stub.callCount.should.equal(0);
          fetch_spy.should.have.been.calledOnce;
          create_spy.should.not.have.been.called;
          save_spy.should.not.have.been.called;
          destroy_spy.should.not.have.been.called;
          fetch_spy.should.have.been.calledAfter(parse_stub);
          success_spy.callCount.should.equal(1);
          success_spy.should.have.been.calledOn(modelA);
          success_spy.firstCall.args.length.should.equal(4);
          success_spy.firstCall.args[0].should.equal(modelA);
          error_spy.should.not.have.been.called;
          complete_spy.callCount.should.equal(1);
          complete_spy.should.have.been.calledOn(modelA);
          complete_spy.firstCall.args.length.should.equal(3);
          complete_spy.firstCall.args[0].should.equal(modelA);
          return complete_spy.should.have.been.calledAfter(success_spy);
        });
        it("Should call the error response on an errornous result", function() {
          modelA.fetch(options);
          server.respondWith([400, {}, JSON.stringify(error_data)]);
          server.respond();
          parse_stub.callCount.should.equal(0);
          fill_stub.callCount.should.equal(0);
          fetch_spy.should.not.have.been.called;
          create_spy.should.not.have.been.called;
          save_spy.should.not.have.been.called;
          destroy_spy.should.not.have.been.called;
          success_spy.callCount.should.equal(0);
          error_spy.callCount.should.equal(1);
          error_spy.firstCall.args.length.should.equal(3);
          error_spy.should.have.been.calledOn(modelA);
          complete_spy.firstCall.args[0].should.equal(modelA);
          complete_spy.callCount.should.equal(1);
          complete_spy.should.have.been.calledOn(modelA);
          complete_spy.firstCall.args.length.should.equal(3);
          complete_spy.firstCall.args[0].should.equal(modelA);
          return complete_spy.should.have.been.calledAfter(error_spy);
        });
        it("Should call the success response on create", function() {
          modelA.create(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          parse_stub.callCount.should.equal(1);
          parse_stub.firstCall.args[0].should.deep.equal(data);
          fill_stub.callCount.should.equal(1);
          fill_stub.firstCall.args[0].should.deep.equal(success_data);
          fill_stub.should.have.been.calledAfter(parse_stub);
          fetch_spy.should.not.have.been.called;
          create_spy.callCount.should.equal(1);
          save_spy.should.not.have.been.called;
          destroy_spy.should.not.have.been.called;
          success_spy.callCount.should.equal(1);
          success_spy.should.have.been.calledOn(modelA);
          success_spy.firstCall.args.length.should.equal(4);
          success_spy.firstCall.args[0].should.equal(modelA);
          error_spy.should.not.have.been.called;
          complete_spy.callCount.should.equal(1);
          complete_spy.should.have.been.calledOn(modelA);
          complete_spy.firstCall.args.length.should.equal(3);
          complete_spy.firstCall.args[0].should.equal(modelA);
          return complete_spy.should.have.been.calledAfter(success_spy);
        });
        it("Should call the success response on save", function() {
          modelA.save(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          parse_stub.callCount.should.equal(1);
          parse_stub.firstCall.args[0].should.deep.equal(data);
          fill_stub.callCount.should.equal(1);
          fill_stub.firstCall.args[0].should.deep.equal(success_data);
          fill_stub.should.have.been.calledAfter(parse_stub);
          fetch_spy.should.not.have.been.called;
          create_spy.should.not.have.been.called;
          save_spy.callCount.should.equal(1);
          destroy_spy.should.not.have.been.called;
          success_spy.callCount.should.equal(1);
          success_spy.should.have.been.calledOn(modelA);
          success_spy.firstCall.args.length.should.equal(4);
          success_spy.firstCall.args[0].should.equal(modelA);
          error_spy.should.not.have.been.called;
          complete_spy.callCount.should.equal(1);
          complete_spy.should.have.been.calledOn(modelA);
          complete_spy.firstCall.args.length.should.equal(3);
          complete_spy.firstCall.args[0].should.equal(modelA);
          return complete_spy.should.have.been.calledAfter(success_spy);
        });
        return it("Should call the success response on destroy", function() {
          modelA.destroy(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          parse_stub.callCount.should.equal(1);
          parse_stub.firstCall.args[0].should.deep.equal(data);
          fill_stub.callCount.should.equal(1);
          fill_stub.firstCall.args[0].should.deep.equal(success_data);
          fill_stub.should.have.been.calledAfter(parse_stub);
          fetch_spy.should.not.have.been.called;
          create_spy.should.not.have.been.called;
          save_spy.should.not.have.been.called;
          destroy_spy.callCount.should.equal(1);
          success_spy.callCount.should.equal(1);
          success_spy.should.have.been.calledOn(modelA);
          success_spy.firstCall.args.length.should.equal(4);
          success_spy.firstCall.args[0].should.equal(modelA);
          error_spy.should.not.have.been.called;
          complete_spy.callCount.should.equal(1);
          complete_spy.should.have.been.calledOn(modelA);
          complete_spy.firstCall.args.length.should.equal(3);
          complete_spy.firstCall.args[0].should.equal(modelA);
          return complete_spy.should.have.been.calledAfter(success_spy);
        });
      });
    });
    it("Should match equality properly", function() {
      var ModelA, modelA_1, modelA_2, modelA_a, _ref;

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
      expect(modelA_1.equals(modelA_1)).to.be["true"];
      expect(modelA_1.equals(modelA_2)).to.be["false"];
      expect(modelA_1.equals(1)).to.be["true"];
      expect(modelA_1.equals(new ModelA({
        id: 1
      }))).to.be["true"];
      expect(modelA_a.equals(modelA_a)).to.be["true"];
      expect(modelA_a.equals(modelA_2)).to.be["false"];
      expect(modelA_a.equals('a')).to.be["true"];
      return expect(modelA_a.equals(new ModelA({
        id: 'a'
      }))).to.be["true"];
    });
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
      mixin_spy.should.have.been.calledOnce;
      mixin_spy.should.have.been.calledOn(modelA);
      mixin_spy.firstCall.args[0].should.equal(modelA);
      return mixin_spy.firstCall.args[1].should.equal('world');
    });
    describe("Testing clone combinations", function() {
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
      it("Should clone properly without overridden parent", function() {
        var modelA1, modelA2, modelB;

        modelB = new ModelB;
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: "bar"
        }, modelB);
        modelA2 = modelA1.clone();
        modelA1.should.not.equal(modelA2);
        modelA1.parent.should.equal(modelA2.parent);
        modelA1.id.should.equal(modelA2.id);
        modelA2.hello.should.equal("world");
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return modelA2.foo().should.equal("bar");
      });
      it("Should clone properly with overriden parent", function() {
        var modelA1, modelA2, modelB, modelC;

        modelB = new ModelB;
        modelC = new ModelC;
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.clone(modelC);
        modelA2.should.not.equal(modelA1);
        modelA2.id.should.equal(modelA1.id);
        modelA2.parent.should.equal(modelC);
        modelA2.hello.should.equal("world");
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return modelA2.foo().should.equal("bar");
      });
      return it("Should clone properly with overriden null parent", function() {
        var modelA1, modelA2, modelB;

        modelB = new ModelB;
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.clone(null);
        modelA2.should.not.equal(modelA1);
        modelA2.id.should.equal(modelA1.id);
        expect(modelA2.parent).to.be.equal(null);
        modelA2.hello.should.equal("world");
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return modelA2.foo().should.equal("bar");
      });
    });
    describe("Testing copy method", function() {
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
      it("Should do a basic copy properly", function() {
        var modelA1, modelA2, modelB;

        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.copy();
        modelA1.should.not.equal(modelA2);
        expect(modelA2.hello).not.to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.id).to.exist;
        expect(modelA2.parent).to.exist;
        expect(modelA2.id).to.equal(1);
        expect(modelA2.parent).to.equal(modelB);
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.undefined;
      });
      it("Should do copy properly additional fields properly", function() {
        var modelA1, modelA2, modelB;

        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.copy(["id", "foo"]);
        modelA1.should.not.equal(modelA2);
        expect(modelA2.hello).not.to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.id).to.exist;
        expect(modelA2.parent).to.exist;
        expect(modelA2.id).to.equal(1);
        expect(modelA2.parent).to.equal(modelB);
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.equal("bar");
      });
      it("Should do copy properly additional fields properly without parent", function() {
        var modelA1, modelA2, modelB;

        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.copy(["id", "hello"], null);
        modelA1.should.not.equal(modelA2);
        expect(modelA2.hello).to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.id).to.exist;
        expect(modelA2.parent).not.to.exist;
        expect(modelA2.id).to.equal(1);
        expect(ko.isObservable(modelA2.hello)).to.be["false"];
        expect(modelA2.hello).to.be.equal("world");
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.undefined;
      });
      it("Should do copy properly additional fields properly without parent or id fields", function() {
        var modelA1, modelA2, modelB;

        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.copy(["hello"], null);
        modelA1.should.not.equal(modelA2);
        expect(modelA2.hello).to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.id).to.exist;
        expect(modelA2.parent).not.to.exist;
        expect(modelA2.id).to.equal(1);
        expect(ko.isObservable(modelA2.hello)).to.be["false"];
        expect(modelA2.hello).to.be.equal("world");
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.undefined;
      });
      it("Should do copy properly additional fields properly with new parent", function() {
        var modelA1, modelA2, modelB, modelC;

        modelC = new ModelC();
        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.copy(["id", "hello"], modelC);
        modelA1.should.not.equal(modelA2);
        expect(modelA2.hello).to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.id).to.exist;
        expect(modelA2.parent).to.exist;
        expect(modelA2.parent).to.equal(modelC);
        expect(modelA2.id).to.equal(1);
        expect(ko.isObservable(modelA2.hello)).to.be["false"];
        expect(modelA2.hello).to.be.equal("world");
        expect(ko.isObservable(modelA2.foo)).to.be["true"];
        return expect(modelA2.foo()).to.be.undefined;
      });
      return it("Should do copy properly additional fields properly with new parent or id fields", function() {
        var modelA1, modelA2, modelB, modelC;

        modelC = new ModelC();
        modelB = new ModelB();
        modelA1 = new ModelA({
          id: 1,
          hello: "world",
          foo: ko.observable("bar")
        }, modelB);
        modelA2 = modelA1.copy(["hello"], modelC);
        modelA1.should.not.equal(modelA2);
        expect(modelA2.hello).to.exist;
        expect(modelA2.foo).to.exist;
        expect(modelA2.id).to.exist;
        expect(modelA2.parent).to.exist;
        expect(modelA2.parent).to.equal(modelC);
        expect(modelA2.id).to.equal(1);
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
