(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Test Collection Methods", function() {
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
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith();
      init_stub.should.have.been.calledOn(collectionA);
      init_stub.reset();
      models = [
        {
          "hello": "world"
        }, {
          "hello": "world2"
        }
      ];
      collectionA = new CollectionA(models);
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith(models);
      expect(collectionA.parent).to.be.undefined;
      expect(collectionA.length()).to.equal(2);
      init_stub.reset();
      modelB = new ModelB;
      collectionA = new CollectionA(models, modelB);
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith(models);
      expect(collectionA.parent).to.equal(modelB);
      expect(collectionA.length()).to.equal(2);
      init_stub.reset();
      modelB = new ModelB;
      collectionA = new CollectionA(modelB, models);
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith(models);
      expect(collectionA.parent).to.equal(modelB);
      expect(collectionA.length()).to.equal(2);
      init_stub.reset();
      models = [
        new ModelA({
          "hello": "world"
        }), new ModelA({
          "hello": "world2"
        })
      ];
      collectionA = new CollectionA(models);
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith(models);
      expect(collectionA.parent).to.be.undefined;
      expect(collectionA.length()).to.equal(2);
      init_stub.reset();
      modelB = new ModelB;
      collectionA = new CollectionA(models, modelB);
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith(models);
      expect(collectionA.parent).to.equal(modelB);
      expect(collectionA.length()).to.equal(2);
      init_stub.reset();
      modelB = new ModelB;
      collectionA = new CollectionA(modelB, models);
      init_stub.should.have.been.calledOnce;
      init_stub.should.have.been.calledWith(models);
      expect(collectionA.parent).to.equal(modelB);
      expect(collectionA.length()).to.equal(2);
      init_stub.reset();
      return init_stub.restore();
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
          collectionA.length().should.equal(2);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(2);
          return collectionA.at(1).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(2);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(2);
          return collectionA.at(1).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(2);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(2);
          return collectionA.at(1).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(2);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(2);
          return collectionA.at(1).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(2);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(2);
          return collectionA.at(1).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(3);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(3);
          collectionA.at(0).get('hello').should.equal("world3");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(1);
          collectionA.at(1).get('hello').should.equal("world");
          collectionA.at(2).should.be["instanceof"](ModelA);
          collectionA.at(2).get('id').should.equal(2);
          return collectionA.at(2).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(2);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(2);
          return collectionA.at(1).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(3);
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(1);
          collectionA.at(index).get('hello').should.equal("world");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(2);
          collectionA.at(index).get('hello').should.equal("world2");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(3);
          return collectionA.at(index).get('hello').should.equal("world3");
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
          collectionA.length().should.equal(2);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(2);
          return collectionA.at(1).get('hello').should.equal("world2");
        });
        return it("Should properly merge items into a populated collection", function() {
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
          collectionA.length().should.equal(4);
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(3);
          collectionA.at(index).get('hello').should.equal("world3");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(4);
          collectionA.at(index).get('hello').should.equal("world5");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(1);
          collectionA.at(index).get('hello').should.equal("world");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(2);
          collectionA.at(index).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(2);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(2);
          return collectionA.at(1).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(4);
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(3);
          collectionA.at(index).get('hello').should.equal("world3");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(1);
          collectionA.at(index).get('hello').should.equal("world");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(2);
          collectionA.at(index).get('hello').should.equal("world2");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(4);
          collectionA.at(index).get('hello').should.equal("world4");
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
          collectionA.length().should.equal(4);
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(3);
          collectionA.at(index).get('hello').should.equal("world3");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(4);
          collectionA.at(index).get('hello').should.equal("world4");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(1);
          collectionA.at(index).get('hello').should.equal("world");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(2);
          collectionA.at(index).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(4);
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(1);
          collectionA.at(index).get('hello').should.equal("world");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(2);
          collectionA.at(index).get('hello').should.equal("world2");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(3);
          collectionA.at(index).get('hello').should.equal("world3");
          index++;
          collectionA.at(index).should.be["instanceof"](ModelA);
          collectionA.at(index).get('id').should.equal(4);
          collectionA.at(index).get('hello').should.equal("world4");
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
          collectionA.length().should.equal(2);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(2);
          return collectionA.at(1).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(2);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          collectionA.at(1).should.be["instanceof"](ModelA);
          collectionA.at(1).get('id').should.equal(2);
          return collectionA.at(1).get('hello').should.equal("world2");
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
          collectionA.length().should.equal(1);
          collectionA.at(0).should.be["instanceof"](ModelA);
          collectionA.at(0).get('id').should.equal(1);
          collectionA.at(0).get('hello').should.equal("world");
          return collectionA.at(0).parent.should.equal(modelB);
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
        return serialized.should.deep.equal(models);
      });
      it("Should test specific fields for serialize method", function() {
        var serialized;

        serialized = collectionA.serialize(["foo"]);
        return serialized.should.deep.equal([
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
        return serialized.should.deep.equal([
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
        return serialized.should.deep.equal([
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
        expect(collectionA.makeUrl("GET")).to.equal("/model_a");
        expect(collectionA.makeUrl("POST")).to.equal("/model_a");
        expect(collectionA.makeUrl("PUT")).to.equal("/model_a");
        return expect(collectionA.makeUrl("DELETE")).to.equal("/model_a");
      });
      it("Tests the basic makeUrl method, base API url", function() {
        var collectionA;

        collectionA = new CollectionA();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionA.makeUrl("GET")).to.equal("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl("POST")).to.equal("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_a");
        return expect(collectionA.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_a");
      });
      it("Tests the basic makeUrl method, base API url ending with a '/'", function() {
        var collectionA;

        collectionA = new CollectionA();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionA.makeUrl("GET")).to.equal("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl("POST")).to.equal("http://www.falconjs.com/model_a");
        expect(collectionA.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_a");
        return expect(collectionA.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_a");
      });
      it("Tests the basic makeUrl method, with parent", function() {
        var collectionA;

        collectionA = new CollectionA(new ModelB({
          id: '1b'
        }));
        expect(collectionA.makeUrl("GET")).to.equal("/model_b/1b/model_a");
        expect(collectionA.makeUrl("POST")).to.equal("/model_b/1b/model_a");
        expect(collectionA.makeUrl("PUT")).to.equal("/model_b/1b/model_a");
        return expect(collectionA.makeUrl("DELETE")).to.equal("/model_b/1b/model_a");
      });
      it("Tests the basic makeUrl method, base API url, with parent", function() {
        var collectionA;

        collectionA = new CollectionA(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionA.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/2b/model_a");
        expect(collectionA.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b/2b/model_a");
        expect(collectionA.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/2b/model_a");
        return expect(collectionA.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/2b/model_a");
      });
      it("Tests the basic makeUrl method, base API url ending with a '/', with parent", function() {
        var collectionA;

        collectionA = new CollectionA(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionA.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/3b/model_a");
        expect(collectionA.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b/3b/model_a");
        expect(collectionA.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/3b/model_a");
        return expect(collectionA.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/3b/model_a");
      });
      it("Tests the basic makeUrl method, model url is a function", function() {
        var collectionD;

        collectionD = new CollectionD();
        expect(collectionD.makeUrl("GET")).to.equal("/model_d");
        expect(collectionD.makeUrl("POST")).to.equal("/model_d");
        expect(collectionD.makeUrl("PUT")).to.equal("/model_d");
        return expect(collectionD.makeUrl("DELETE")).to.equal("/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, base API url", function() {
        var collectionD;

        collectionD = new CollectionD();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD.makeUrl("GET")).to.equal("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl("POST")).to.equal("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_d");
        return expect(collectionD.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, base API url ending with a '/'", function() {
        var collectionD;

        collectionD = new CollectionD();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD.makeUrl("GET")).to.equal("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl("POST")).to.equal("http://www.falconjs.com/model_d");
        expect(collectionD.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_d");
        return expect(collectionD.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, with parent", function() {
        var collectionD;

        collectionD = new CollectionD(new ModelB({
          id: '1b'
        }));
        expect(collectionD.makeUrl("GET")).to.equal("/model_b/1b/model_d");
        expect(collectionD.makeUrl("POST")).to.equal("/model_b/1b/model_d");
        expect(collectionD.makeUrl("PUT")).to.equal("/model_b/1b/model_d");
        return expect(collectionD.makeUrl("DELETE")).to.equal("/model_b/1b/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, with parent, base API url", function() {
        var collectionD;

        collectionD = new CollectionD(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/2b/model_d");
        expect(collectionD.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b/2b/model_d");
        expect(collectionD.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/2b/model_d");
        return expect(collectionD.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/2b/model_d");
      });
      it("Tests the basic makeUrl method, model url is a function, with parent, base API url ending with a '/'", function() {
        var collectionD;

        collectionD = new CollectionD(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/3b/model_d");
        expect(collectionD.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b/3b/model_d");
        expect(collectionD.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/3b/model_d");
        return expect(collectionD.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/3b/model_d");
      });
      it("Tests the basic makeUrl method, defined url string", function() {
        var collectionD2;

        collectionD2 = new CollectionD2();
        expect(collectionD2.makeUrl("GET")).to.equal("/collection_d2");
        expect(collectionD2.makeUrl("POST")).to.equal("/collection_d2");
        expect(collectionD2.makeUrl("PUT")).to.equal("/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).to.equal("/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, base API url", function() {
        var collectionD2;

        collectionD2 = new CollectionD2();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD2.makeUrl("GET")).to.equal("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl("POST")).to.equal("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl("PUT")).to.equal("http://www.falconjs.com/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).to.equal("http://www.falconjs.com/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, base API url ending with a '/'", function() {
        var collectionD2;

        collectionD2 = new CollectionD2();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD2.makeUrl("GET")).to.equal("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl("POST")).to.equal("http://www.falconjs.com/collection_d2");
        expect(collectionD2.makeUrl("PUT")).to.equal("http://www.falconjs.com/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).to.equal("http://www.falconjs.com/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, with parent", function() {
        var collectionD2;

        collectionD2 = new CollectionD2(new ModelB({
          id: '1b'
        }));
        expect(collectionD2.makeUrl("GET")).to.equal("/model_b/1b/collection_d2");
        expect(collectionD2.makeUrl("POST")).to.equal("/model_b/1b/collection_d2");
        expect(collectionD2.makeUrl("PUT")).to.equal("/model_b/1b/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).to.equal("/model_b/1b/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, with parent, base API url", function() {
        var collectionD2;

        collectionD2 = new CollectionD2(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD2.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/2b/collection_d2");
        expect(collectionD2.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b/2b/collection_d2");
        expect(collectionD2.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/2b/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/2b/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url string, with parent, base API url ending with a '/'", function() {
        var collectionD2;

        collectionD2 = new CollectionD2(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD2.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/3b/collection_d2");
        expect(collectionD2.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b/3b/collection_d2");
        expect(collectionD2.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/3b/collection_d2");
        return expect(collectionD2.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/3b/collection_d2");
      });
      it("Tests the basic makeUrl method, defined url function", function() {
        var collectionD3;

        collectionD3 = new CollectionD3();
        expect(collectionD3.makeUrl("GET")).to.equal("/collection_d3");
        expect(collectionD3.makeUrl("POST")).to.equal("/collection_d3");
        expect(collectionD3.makeUrl("PUT")).to.equal("/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).to.equal("/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, base API url", function() {
        var collectionD3;

        collectionD3 = new CollectionD3();
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD3.makeUrl("GET")).to.equal("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl("POST")).to.equal("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl("PUT")).to.equal("http://www.falconjs.com/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).to.equal("http://www.falconjs.com/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, base API url ending with a '/'", function() {
        var collectionD3;

        collectionD3 = new CollectionD3();
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD3.makeUrl("GET")).to.equal("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl("POST")).to.equal("http://www.falconjs.com/collection_d3");
        expect(collectionD3.makeUrl("PUT")).to.equal("http://www.falconjs.com/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).to.equal("http://www.falconjs.com/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, with parent", function() {
        var collectionD3;

        collectionD3 = new CollectionD3(new ModelB({
          id: '1b'
        }));
        expect(collectionD3.makeUrl("GET")).to.equal("/model_b/1b/collection_d3");
        expect(collectionD3.makeUrl("POST")).to.equal("/model_b/1b/collection_d3");
        expect(collectionD3.makeUrl("PUT")).to.equal("/model_b/1b/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).to.equal("/model_b/1b/collection_d3");
      });
      it("Tests the basic makeUrl method, defined url function, with parent, base API url", function() {
        var collectionD3;

        collectionD3 = new CollectionD3(new ModelB({
          id: '2b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com";
        expect(collectionD3.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/2b/collection_d3");
        expect(collectionD3.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b/2b/collection_d3");
        expect(collectionD3.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/2b/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/2b/collection_d3");
      });
      return it("Tests the basic makeUrl method, defined url function, with parent, base API url ending with a '/'", function() {
        var collectionD3;

        collectionD3 = new CollectionD3(new ModelB({
          id: '3b'
        }));
        Falcon.baseApiUrl = "http://www.falconjs.com/";
        expect(collectionD3.makeUrl("GET")).to.equal("http://www.falconjs.com/model_b/3b/collection_d3");
        expect(collectionD3.makeUrl("POST")).to.equal("http://www.falconjs.com/model_b/3b/collection_d3");
        expect(collectionD3.makeUrl("PUT")).to.equal("http://www.falconjs.com/model_b/3b/collection_d3");
        return expect(collectionD3.makeUrl("DELETE")).to.equal("http://www.falconjs.com/model_b/3b/collection_d3");
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
          sync_stub.should.have.been.calledOnce;
          sync_stub.should.have.been.calledOn(collectionA);
          return sync_stub.should.have.been.calledWith('GET', {
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
          ajax_stub.should.have.been.calledOnce;
          ajax_stub.should.have.been.calledWithMatch({
            type: "GET"
          });
          ajax_stub.should.have.been.calledWithMatch({
            url: collectionA.makeUrl("GET")
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
          parse_stub.callCount.should.equal(1);
          parse_stub.firstCall.args[0].should.deep.equal(data);
          fill_stub.callCount.should.equal(1);
          fill_stub.firstCall.args[0].should.deep.equal(success_data);
          fill_stub.should.have.been.calledAfter(parse_stub);
          fetch_spy.should.have.been.calledOnce;
          fetch_spy.should.have.been.calledAfter(fill_stub);
          success_spy.callCount.should.equal(1);
          success_spy.should.have.been.calledOn(collectionA);
          success_spy.firstCall.args.length.should.equal(4);
          success_spy.firstCall.args[0].should.equal(collectionA);
          error_spy.should.not.have.been.called;
          complete_spy.callCount.should.equal(1);
          complete_spy.should.have.been.calledOn(collectionA);
          complete_spy.firstCall.args.length.should.equal(3);
          complete_spy.firstCall.args[0].should.equal(collectionA);
          return complete_spy.should.have.been.calledAfter(success_spy);
        });
        it("Should not fill when fill option is false on fetch", function() {
          options.fill = false;
          collectionA.fetch(options);
          server.respondWith([200, {}, JSON.stringify(data)]);
          server.respond();
          parse_stub.callCount.should.equal(1);
          parse_stub.firstCall.args[0].should.deep.equal(data);
          fill_stub.callCount.should.equal(0);
          fetch_spy.should.have.been.calledOnce;
          fetch_spy.should.have.been.calledAfter(parse_stub);
          success_spy.callCount.should.equal(1);
          success_spy.should.have.been.calledOn(collectionA);
          success_spy.firstCall.args.length.should.equal(4);
          success_spy.firstCall.args[0].should.equal(collectionA);
          error_spy.should.not.have.been.called;
          complete_spy.callCount.should.equal(1);
          complete_spy.should.have.been.calledOn(collectionA);
          complete_spy.firstCall.args.length.should.equal(3);
          complete_spy.firstCall.args[0].should.equal(collectionA);
          return complete_spy.should.have.been.calledAfter(success_spy);
        });
        return it("Should call the error response on an errornous result", function() {
          collectionA.fetch(options);
          server.respondWith([400, {}, JSON.stringify(error_data)]);
          server.respond();
          parse_stub.callCount.should.equal(0);
          fill_stub.callCount.should.equal(0);
          fetch_spy.should.not.have.been.called;
          success_spy.callCount.should.equal(0);
          error_spy.callCount.should.equal(1);
          error_spy.firstCall.args.length.should.equal(3);
          error_spy.should.have.been.calledOn(collectionA);
          complete_spy.firstCall.args[0].should.equal(collectionA);
          complete_spy.callCount.should.equal(1);
          complete_spy.should.have.been.calledOn(collectionA);
          complete_spy.firstCall.args.length.should.equal(3);
          complete_spy.firstCall.args[0].should.equal(collectionA);
          return complete_spy.should.have.been.calledAfter(error_spy);
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
          ajax_stub.should.have.been.calledOnce;
          ajax_stub.should.have.been.calledWithMatch({
            type: "GET"
          });
          ajax_stub.should.have.been.calledWithMatch({
            url: collectionA.makeUrl("GET")
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
          return ajax_stub.should.have.been.calledWithMatch({
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
          return ajax_stub.should.have.been.calledWithMatch({
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
          expect(success_spy).to.have.been.called;
          return expect(success_spy).to.have.been.calledOn(collectionB);
        });
        return it("Should pass context from fetch to sync", function() {
          var collectionB, success_spy, sync_stub;

          collectionB = new CollectionB;
          collectionA = new CollectionA;
          sync_stub = sinon.stub(collectionA, "sync");
          collectionA.fetch((success_spy = sinon.spy()), collectionB);
          expect(sync_stub).to.have.been.called;
          expect(sync_stub.firstCall.args[1]).to.equal(success_spy);
          return expect(sync_stub.firstCall.args[2]).to.equal(collectionB);
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
        expect(collectionA.length()).to.equal(4);
        collectionA.remove(model_a2);
        expect(collectionA.length()).to.equal(3);
        expect(collectionA.at(0)).to.equal(model_a1);
        expect(collectionA.at(1)).to.equal(model_a3);
        return expect(collectionA.at(2)).to.equal(model_a4);
      });
      it("Should be able to remove multiple items", function() {
        expect(collectionA.length()).to.equal(4);
        collectionA.remove([model_a2, model_a3]);
        expect(collectionA.length()).to.equal(2);
        expect(collectionA.at(0)).to.equal(model_a1);
        return expect(collectionA.at(1)).to.equal(model_a4);
      });
      it("Should be able to remove items with a function", function() {
        expect(collectionA.length()).to.equal(4);
        collectionA.remove(function(model) {
          return model.get('id') % 2 === 0;
        });
        expect(collectionA.length()).to.equal(2);
        expect(collectionA.at(0)).to.equal(model_a1);
        return expect(collectionA.at(1)).to.equal(model_a3);
      });
      it("Should be able to remove a different model but with the same id", function() {
        expect(collectionA.length()).to.equal(4);
        collectionA.remove(new ModelA({
          id: 3
        }));
        expect(collectionA.at(0)).to.equal(model_a1);
        expect(collectionA.at(1)).to.equal(model_a2);
        return expect(collectionA.at(2)).to.equal(model_a4);
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
        expect(collectionA.length()).to.equal(3);
        model_a1 = collectionA.first();
        collectionA.remove(model_a1);
        return expect(collectionA.length()).to.equal(2);
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
        fill_stub.should.have.been.calledOnce;
        return fill_stub.should.have.been.deep.calledWith(input, {
          'method': 'append'
        });
      });
      return it("Should call the proper fill method when prepending", function() {
        var input;

        collectionA.prepend(input = {
          'hello': 'world'
        });
        fill_stub.should.have.been.calledOnce;
        return fill_stub.should.have.been.deep.calledWith(input, {
          'method': 'prepend'
        });
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
        fill_stub.should.have.been.calledOnce;
        return fill_stub.should.have.been.deep.calledWith(input, {
          'method': 'append'
        });
      });
      it("Should call the proper fill method when inserting with a valid model", function() {
        var input;

        collectionA.insert(input = {
          'hello': 'world'
        }, 4);
        fill_stub.should.have.been.calledOnce;
        return fill_stub.should.have.been.deep.calledWith(input, {
          'method': 'insert',
          'insert_index': 1
        });
      });
      it("Should call the proper fill method when appending with an invalid model", function() {
        var input;

        collectionA.insert(input = {
          'hello': 'world'
        }, 33);
        fill_stub.should.have.been.calledOnce;
        return fill_stub.should.have.been.deep.calledWith(input, {
          'method': 'insert',
          'insert_index': -1
        });
      });
      return it("Should call the proper fill method when inserting with an iterator", function() {
        var input;

        collectionA.insert(input = {
          'hello': 'world'
        }, (function(m) {
          return m.get('id') === 1;
        }));
        fill_stub.should.have.been.calledOnce;
        return fill_stub.should.have.been.deep.calledWith(input, {
          'method': 'insert',
          'insert_index': 0
        });
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
        collectionA.length().should.equal(2);
        collectionA.unshift({
          id: 3
        });
        append_stub.should.not.have.been.called;
        prepend_stub.should.have.been.calledOnce;
        return prepend_stub.should.have.been.deep.calledWith({
          id: 3
        });
      });
      return it("Should have push be an alias of append", function() {
        collectionA.length().should.equal(2);
        collectionA.push({
          id: 3
        });
        prepend_stub.should.not.have.been.called;
        append_stub.should.have.been.calledOnce;
        return append_stub.should.have.been.deep.calledWith({
          id: 3
        });
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
        expect(elm).to.equal(model_a1);
        return expect(collectionA.length()).to.equal(2);
      });
      return it("Should shift the first element off the front", function() {
        var elm;

        elm = collectionA.pop();
        expect(elm).to.equal(model_a3);
        return expect(collectionA.length()).to.equal(2);
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
        expect(collectionA.models()).to.deep.equal([model_a2, model_a1, model_a3]);
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
        return expect(collectionA.models()).to.deep.equal([model_a1, model_a2, model_a3]);
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
        expect(initialize_stub).to.not.have.been.called;
        expect(create_stub).to.not.have.been.called;
        collectionA.create(data = {
          id: 2
        }, options, collectionB);
        expect(initialize_stub).to.have.been.calledOnce;
        expect(initialize_stub).to.have.been.calledWith(data);
        expect(create_stub).to.have.been.calledOnce;
        expect(create_stub).to.have.been.calledAfter(initialize_stub);
        expect(create_stub.firstCall.args.length).to.equal(2);
        expect(create_stub.firstCall.args[0]).to.equal(options);
        expect(create_stub.firstCall.args[0].success).to.be.a('function');
        expect(create_stub.firstCall.args[0].method).to.equal('append');
        expect(create_stub.firstCall.args[1]).to.equal(collectionB);
        initialize_stub.restore();
        return create_stub.restore();
      });
      return it("Should respond correctly from the server", function() {
        var fill_stub, new_model;

        fill_stub = sinon.stub(collectionA, "fill").returns([]);
        collectionA.create(data, options);
        expect(collectionA.length()).to.equal(1);
        server.respondWith([200, {}, JSON.stringify(data)]);
        server.respond();
        fill_stub.should.have.been.calledOnce;
        expect(fill_stub.firstCall.args.length).to.equal(2);
        expect(fill_stub.firstCall.args[0]).to.be["instanceof"](Falcon.Model);
        expect(fill_stub.firstCall.args[1]).to.equal(options);
        new_model = fill_stub.firstCall.args[0];
        expect(success_spy.callCount).to.equal(1);
        expect(success_spy).to.have.been.calledAfter(fill_stub);
        expect(success_spy).to.have.been.calledOn(new_model);
        expect(success_spy.firstCall.args[0]).to.equal(new_model);
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
        destroy_stub.should.not.have.been.called;
        collectionA.destroy(model_a1, options, collectionB);
        destroy_stub.should.have.been.calledOnce;
        destroy_stub.should.have.been.calledWith(options, collectionB);
        return destroy_stub.restore();
      });
      it("Should respond correctly from the server", function() {
        var remove_stub, removed_model, server;

        server = sinon.fakeServer.create();
        remove_stub = sinon.stub(collectionA, "remove");
        collectionA.destroy(model_a1, options);
        server.respondWith([200, {}, JSON.stringify({})]);
        server.respond();
        remove_stub.should.have.been.calledOnce;
        expect(remove_stub.firstCall.args.length).to.equal(1);
        expect(remove_stub.firstCall.args[0]).to.be["instanceof"](Falcon.Model);
        removed_model = remove_stub.firstCall.args[0];
        expect(success_spy.callCount).to.equal(1);
        expect(success_spy).to.have.been.calledAfter(remove_stub);
        expect(success_spy).to.have.been.calledOn(removed_model);
        expect(success_spy.firstCall.args[0]).to.equal(removed_model);
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
        expect(ajax_spy).to.have.been.called;
        expect(ajax_spy.callCount).to.equal(1);
        ajax_args = ajax_spy.firstCall.args[0];
        expect(ajax_args['type']).to.equal("DELETE");
        return expect(ajax_args['url']).to.equal(model_a1.makeUrl("DELETE", null));
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
        expect(collectionA.at(0)).to.equal(model_a1);
        expect(collectionA.at(1)).to.equal(model_a2);
        return expect(collectionA.at(2)).to.equal(model_a3);
      });
      return it("Should return null for invalid indices", function() {
        expect(collectionA.at(-1)).to.equal(null);
        expect(collectionA.at(3)).to.equal(null);
        return expect(collectionA.at("HELLO")).to.equal(null);
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
        return expect(collectionA.indexOf(model_a3)).to.equal(2);
      });
      it("Should find no match index by model", function() {
        return expect(collectionA.indexOf(new ModelA)).to.equal(-1);
      });
      it("Should find the correct match index by id", function() {
        return expect(collectionA.indexOf(3)).to.equal(1);
      });
      it("Should find the correct match index by truth test method", function() {
        var index;

        index = collectionA.indexOf(function(model) {
          return model.get('id') > 4;
        });
        return expect(index).to.equal(2);
      });
      return it("Should find the no match index by truth test method", function() {
        var index;

        index = collectionA.indexOf(function(model) {
          return model.get('id') > 8;
        });
        return expect(index).to.equal(-1);
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
        return collectionA = new CollectionA([model_a1, model_a2, model_a3]);
      });
      it("Should call the iterator with one argument", function() {
        var spy;

        spy = sinon.spy();
        collectionA.each(function(item) {
          return spy.call(this, item);
        });
        expect(spy.callCount).to.equal(3);
        expect(spy.firstCall).to.be.calledWith(model_a1);
        expect(spy.secondCall).to.be.calledWith(model_a2);
        expect(spy.thirdCall).to.be.calledWith(model_a3);
        return expect(spy).to.have.always.been.calledOn(collectionA);
      });
      it("Should call the iterator with two arguments", function() {
        var spy;

        spy = sinon.spy();
        collectionA.each(function(index, item) {
          return spy.call(this, index, item);
        });
        expect(spy.callCount).to.equal(3);
        expect(spy.firstCall).to.be.calledWith(0, model_a1);
        expect(spy.secondCall).to.be.calledWith(1, model_a2);
        expect(spy.thirdCall).to.be.calledWith(2, model_a3);
        return expect(spy).to.have.always.been.calledOn(collectionA);
      });
      it("Should call the iterator with a specific context and one argument", function() {
        var context, iterator, spy;

        spy = sinon.spy();
        context = {};
        iterator = function(item) {
          return spy.call(this, item);
        };
        collectionA.each(iterator, context);
        expect(spy.callCount).to.equal(3);
        expect(spy.firstCall).to.be.calledWith(model_a1);
        expect(spy.secondCall).to.be.calledWith(model_a2);
        expect(spy.thirdCall).to.be.calledWith(model_a3);
        return expect(spy).to.have.always.been.calledOn(context);
      });
      return it("Should call the iterator with a specific context and two arguments", function() {
        var context, iterator, spy;

        spy = sinon.spy();
        context = {};
        iterator = function(index, item) {
          return spy.call(this, index, item);
        };
        collectionA.each(iterator, context);
        expect(spy.callCount).to.equal(3);
        expect(spy.firstCall).to.be.calledWith(0, model_a1);
        expect(spy.secondCall).to.be.calledWith(1, model_a2);
        expect(spy.thirdCall).to.be.calledWith(2, model_a3);
        return expect(spy).to.have.always.been.calledOn(context);
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
        return expect(first).to.equal(model_a1);
      });
      it("Should get the first matcing mdel based on function iterator", function() {
        var first;

        first = collectionA.first(function(model) {
          return model === model_a2;
        });
        return expect(first).to.equal(model_a2);
      });
      it("Should get the first matching model based on a model", function() {
        var first;

        first = collectionA.first(model_ab);
        return expect(first).to.equal(model_ab);
      });
      it("Should get the first matching model based on an id", function() {
        var first;

        first = collectionA.first(2);
        expect(first).to.equal(model_a2);
        first = collectionA.first('b');
        return expect(first).to.equal(model_ab);
      });
      return it("Should return the null if nothing passes the iterator", function() {
        var first;

        first = collectionA.first(function(model) {
          return false;
        });
        return expect(first).to.equal(null);
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
        return expect(last).to.equal(model_a3);
      });
      it("Should get the last matcing mdel based on function iterator", function() {
        var last;

        last = collectionA.last(function(model) {
          return model === model_a2;
        });
        return expect(last).to.equal(model_a2);
      });
      it("Should get the last matching model based on a model", function() {
        var last;

        last = collectionA.last(model_ab);
        return expect(last).to.equal(model_ab);
      });
      it("Should get the last matching model based on an id", function() {
        var last;

        last = collectionA.last(2);
        expect(last).to.equal(model_a2);
        last = collectionA.last('b');
        return expect(last).to.equal(model_ab);
      });
      return it("Should return the null if nothing passes the iterator", function() {
        var last;

        last = collectionA.last(function(model) {
          return false;
        });
        return expect(last).to.equal(null);
      });
    });
    describe("Test the all() method", function() {
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

        all = collectionA.all();
        expect(all.length).to.equal(6);
        return expect(all).to.deep.equal(models);
      });
      it("Should return a limited set of models by function", function() {
        var all;

        all = collectionA.all(function(model) {
          return model === model_a1 || model === model_ab;
        });
        expect(all.length).to.equal(3);
        return expect(all).to.deep.equal([model_a1, model_ab, model_ab]);
      });
      it("Should return a limited set of models by model", function() {
        var all;

        all = collectionA.all(model_a2);
        expect(all.length).to.equal(1);
        return expect(all).to.deep.equal([model_a2]);
      });
      it("Should return a limited set of models by id", function() {
        var all;

        all = collectionA.all(3);
        expect(all.length).to.equal(1);
        expect(all).to.deep.equal([model_a3]);
        all = collectionA.all('b');
        expect(all.length).to.equal(3);
        return expect(all).to.deep.equal([model_ab, model_ab, model_ab2]);
      });
      return it("Should return an empty set of models", function() {
        var all;

        all = collectionA.all(function(model) {
          return false;
        });
        expect(all.length).to.equal(0);
        return expect(all).to.deep.equal([]);
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
        expect(any).to.be["true"];
        any = collectionA.any(function(model) {
          return model === model_a4;
        });
        return expect(any).to.be["false"];
      });
      it("Should match true based on model", function() {
        var any;

        any = collectionA.any(model_a2);
        expect(any).to.be["true"];
        any = collectionA.any(model_a4);
        return expect(any).to.be["false"];
      });
      it("Should match correctly based on id", function() {
        var any;

        any = collectionA.any(3);
        expect(any).to.be["true"];
        any = collectionA.any('b');
        expect(any).to.be["true"];
        any = collectionA.any(4);
        expect(any).to.be["false"];
        any = collectionA.any('c');
        return expect(any).to.be["false"];
      });
      return it("Should not match true based on empty iterator", function() {
        var any;

        any = collectionA.any();
        return expect(any).to.be["false"];
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
        expect(without.length).to.equal(6);
        return expect(without).to.deep.equal(models);
      });
      it("Should return a limited set of models by function", function() {
        var without;

        without = collectionA.without(function(model) {
          return model === model_a1 || model === model_ab;
        });
        expect(without.length).to.equal(3);
        return expect(without).to.deep.equal([model_a2, model_ab2, model_a3]);
      });
      it("Should return a limited set of models by model", function() {
        var without;

        without = collectionA.without(model_a2);
        expect(without.length).to.equal(5);
        return expect(without).to.deep.equal([model_a1, model_ab, model_ab, model_ab2, model_a3]);
      });
      return it("Should return a limited set of models by id", function() {
        var without;

        without = collectionA.without(3);
        expect(without.length).to.equal(5);
        expect(without).to.deep.equal([model_a1, model_a2, model_ab, model_ab, model_ab2]);
        without = collectionA.without('b');
        expect(without.length).to.equal(3);
        return expect(without).to.deep.equal([model_a1, model_a2, model_a3]);
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
        expect(pluck.length).to.equal(3);
        return expect(pluck).to.deep.equal(['e1', 'e2', 'e3']);
      });
      it("Should pluck the title and shouldn't unwrap the observables", function() {
        var pluck;

        pluck = collectionE.pluck("title", false);
        expect(pluck.length).to.equal(3);
        return expect(pluck).to.not.deep.equal(['e1', 'e2', 'e3']);
      });
      return it("Should pluck the an invalid attribute", function() {
        var pluck;

        pluck = collectionE.pluck("title2");
        expect(pluck.length).to.equal(3);
        return expect(pluck).to.deep.equal([void 0, void 0, void 0]);
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
        expect(collectionE.slice(0, 3)).to.deep.equal(models);
        expect(collectionE.slice(0, 1)).to.deep.equal([model_e1]);
        expect(collectionE.slice(1, 3)).to.deep.equal([model_e2, model_e3]);
        return expect(collectionE.slice(-1)).to.deep.equal([model_e3]);
      });
    });
    describe("Testing the mixin() method", function() {
      return it("Should implement mixins properly", function() {
        var collectionA, mixin_spy, modelA, modelB;

        modelB = new ModelB;
        modelA = new ModelA;
        modelA.bees = new CollectionB([modelB]);
        collectionA = new CollectionA([modelA]);
        expect(modelA.hello).to.be.undefined;
        expect(modelA.foo).to.be.undefined;
        expect(modelB.test).to.be.undefined;
        collectionA.mixin({
          "hello": (mixin_spy = sinon.spy()),
          "foo": ko.observable("bar"),
          "bees": {
            "test": "123"
          }
        });
        expect(modelA.hello).not.to.be.undefined;
        expect(modelA.hello).to.be.a('function');
        expect(ko.isObservable(modelA.foo)).to.be["true"];
        expect(modelA.foo()).to.equal('bar');
        expect(modelB.test).not.to.be.undefined;
        expect(modelB.test).to.equal('123');
        modelA.hello('world');
        mixin_spy.should.have.been.calledOnce;
        mixin_spy.should.have.been.calledOn(modelA);
        mixin_spy.firstCall.args[0].should.equal(modelA);
        mixin_spy.firstCall.args[1].should.equal(collectionA);
        return mixin_spy.firstCall.args[2].should.equal('world');
      });
    });
    describe("Testing the clone() method", function() {
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
        return collectionA = new CollectionA([model_a1, model_a2, model_a3], new ModelB);
      });
      it("Should clone properly with same parent", function() {
        var clone;

        clone = collectionA.clone();
        expect(clone).to.not.equal(collectionA);
        expect(clone.length()).to.equal(3);
        expect(clone.at(0)).to.equal(model_a1);
        expect(clone.at(1)).to.equal(model_a2);
        expect(clone.at(2)).to.equal(model_a3);
        return expect(clone.parent).to.equal(collectionA.parent);
      });
      it("Should clone properly with different parent", function() {
        var clone, parent;

        clone = collectionA.clone(parent = new ModelD);
        expect(clone).to.not.equal(collectionA);
        expect(clone.length()).to.equal(3);
        expect(clone.at(0)).to.equal(model_a1);
        expect(clone.at(1)).to.equal(model_a2);
        expect(clone.at(2)).to.equal(model_a3);
        expect(clone.parent).to.not.equal(collectionA.parent);
        return expect(clone.parent).to.equal(parent);
      });
      return it("Should clone properly with different no parent", function() {
        var clone;

        clone = collectionA.clone(null);
        expect(clone).to.not.equal(collectionA);
        expect(clone.length()).to.equal(3);
        expect(clone.at(0)).to.equal(model_a1);
        expect(clone.at(1)).to.equal(model_a2);
        expect(clone.at(2)).to.equal(model_a3);
        expect(clone.parent).to.not.equal(collectionA.parent);
        return expect(clone.parent).to.equal(null);
      });
    });
    describe("Test the copy() method", function() {
      var collectionA, model_a1, model_a2, model_a3;

      collectionA = null;
      model_a1 = model_a2 = model_a3 = null;
      beforeEach(function() {
        model_a1 = new ModelA({
          id: 1,
          'title': 'Hello World'
        });
        model_a2 = new ModelA({
          id: 2,
          'title': 'Foo Bar'
        });
        return collectionA = new CollectionA([model_a1, model_a2], new ModelB);
      });
      it("Should do a basic copy properly", function() {
        var copy;

        copy = collectionA.copy();
        expect(copy).to.not.equal(collectionA);
        expect(copy.parent).to.equal(collectionA.parent);
        expect(copy.length()).to.equal(2);
        expect(copy.at(0)).to.not.equal(model_a1);
        expect(copy.at(0).get('id')).to.equal(1);
        expect(copy.at(0).get('title')).to.be.undefined;
        expect(copy.at(1)).to.not.equal(model_a2);
        expect(copy.at(1).get('id')).to.equal(2);
        return expect(copy.at(1).get('title')).to.be.undefined;
      });
      it("Should do a basic copy properly with extra fields", function() {
        var copy;

        copy = collectionA.copy(["id", "title"]);
        expect(copy).to.not.equal(collectionA);
        expect(copy.parent).to.equal(collectionA.parent);
        expect(copy.length()).to.equal(2);
        expect(copy.at(0)).to.not.equal(model_a1);
        expect(copy.at(0).get('id')).to.equal(1);
        expect(copy.at(0).get('title')).to.be.equal("Hello World");
        expect(copy.at(1)).to.not.equal(model_a2);
        expect(copy.at(1).get('id')).to.equal(2);
        return expect(copy.at(1).get('title')).to.be.equal("Foo Bar");
      });
      it("Should do a basic copy properly without a parent", function() {
        var copy;

        copy = collectionA.copy(null);
        expect(copy).to.not.equal(collectionA);
        expect(copy.parent).to.equal(null);
        expect(copy.length()).to.equal(2);
        expect(copy.at(0)).to.not.equal(model_a1);
        expect(copy.at(0).get('id')).to.equal(1);
        expect(copy.at(0).get('title')).to.be.undefined;
        expect(copy.at(1)).to.not.equal(model_a2);
        expect(copy.at(1).get('id')).to.equal(2);
        return expect(copy.at(1).get('title')).to.be.undefined;
      });
      it("Should do a basic copy properly with extra fields without a parent", function() {
        var copy;

        copy = collectionA.copy(["id", "title"], null);
        expect(copy).to.not.equal(collectionA);
        expect(copy.parent).to.equal(null);
        expect(copy.length()).to.equal(2);
        expect(copy.at(0)).to.not.equal(model_a1);
        expect(copy.at(0).get('id')).to.equal(1);
        expect(copy.at(0).get('title')).to.be.equal("Hello World");
        expect(copy.at(1)).to.not.equal(model_a2);
        expect(copy.at(1).get('id')).to.equal(2);
        return expect(copy.at(1).get('title')).to.be.equal("Foo Bar");
      });
      it("Should do a basic copy properly without a parent", function() {
        var copy, parent;

        copy = collectionA.copy(parent = new ModelC);
        expect(copy).to.not.equal(collectionA);
        expect(copy.parent).to.equal(parent);
        expect(copy.length()).to.equal(2);
        expect(copy.at(0)).to.not.equal(model_a1);
        expect(copy.at(0).get('id')).to.equal(1);
        expect(copy.at(0).get('title')).to.be.undefined;
        expect(copy.at(1)).to.not.equal(model_a2);
        expect(copy.at(1).get('id')).to.equal(2);
        return expect(copy.at(1).get('title')).to.be.undefined;
      });
      return it("Should do a basic copy properly with extra fields without a parent", function() {
        var copy, parent;

        copy = collectionA.copy(["id", "title"], parent = new ModelC);
        expect(copy).to.not.equal(collectionA);
        expect(copy.parent).to.equal(parent);
        expect(copy.length()).to.equal(2);
        expect(copy.at(0)).to.not.equal(model_a1);
        expect(copy.at(0).get('id')).to.equal(1);
        expect(copy.at(0).get('title')).to.be.equal("Hello World");
        expect(copy.at(1)).to.not.equal(model_a2);
        expect(copy.at(1).get('id')).to.equal(2);
        return expect(copy.at(1).get('title')).to.be.equal("Foo Bar");
      });
    });
    return describe("Test the reset() method", function() {
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
        expect(collectionA.length()).to.equal(3);
        expect(collectionA.models()).to.deep.equal(models);
        collectionA.reset();
        expect(collectionA.length()).to.equal(0);
        return expect(collectionA.models()).to.deep.equal([]);
      });
    });
  });

}).call(this);
