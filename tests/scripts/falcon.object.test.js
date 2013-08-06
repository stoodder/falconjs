(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Tesing event functionality", function() {
    var klass;

    klass = null;
    beforeEach(function() {
      return klass = new Falcon.Object;
    });
    it("Should have correct method definitions", function() {
      expect(klass.on).to.be.a('function');
      expect(klass.on).to.have.length(3);
      expect(klass.off).to.be.a('function');
      expect(klass.off).to.have.length(2);
      expect(klass.has).to.be.a('function');
      expect(klass.has).to.have.length(2);
      return expect(klass.trigger).to.be.a('function');
    });
    it("Should test event methods", function() {
      var click_one, click_two, context_two, mouseover_one;

      klass.on("click", (click_one = sinon.spy()));
      klass.on("click", (click_two = sinon.spy()), (context_two = {}));
      klass.on("mouseover", (mouseover_one = sinon.spy()));
      click_one.should.not.have.been.called;
      click_two.should.not.have.been.called;
      mouseover_one.should.not.have.been.called;
      klass.trigger("click", 1, 2, 3);
      click_one.should.have.been.calledOnce;
      click_one.should.have.been.calledWith(1, 2, 3);
      click_two.should.have.been.calledOnce;
      click_two.should.have.been.calledWith(1, 2, 3);
      click_two.should.have.been.calledOn(context_two);
      mouseover_one.should.not.have.been.called;
      klass.trigger("mouseover", "go", true, {});
      click_one.should.have.been.calledOnce;
      click_two.should.have.been.calledOnce;
      mouseover_one.should.have.been.calledOnce;
      mouseover_one.should.have.been.calledWith("go", true, {});
      expect(klass.has("click", click_one)).to.be["true"];
      expect(klass.has("click", click_two)).to.be["true"];
      expect(klass.has("click", mouseover_one)).to.be["false"];
      click_one.should.have.been.calledOnce;
      click_two.should.have.been.calledOnce;
      mouseover_one.should.have.been.calledOnce;
      expect(klass.has("mouseover", click_one)).to.be["false"];
      expect(klass.has("mouseover", click_two)).to.be["false"];
      expect(klass.has("mouseover", mouseover_one)).to.be["true"];
      click_one.should.have.been.calledOnce;
      click_two.should.have.been.calledOnce;
      mouseover_one.should.have.been.calledOnce;
      klass.off("click", click_one);
      klass.trigger("click", 4, 5, 6);
      click_one.should.have.been.calledOnce;
      click_two.should.have.been.calledTwice;
      click_two.should.have.been.calledWith(4, 5, 6);
      return mouseover_one.should.have.been.calledOnce;
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
        expect(klass).to.include.key('id');
        expect(klass).to.include.key('foo');
        return expect(klass).to.include.key('clazz');
      });
      it("Should have added the correct observable attributes", function() {
        expect(klass).to.include.key('hello');
        expect(klass).to.include.key('foo');
        expect(klass).to.include.key('test');
        expect(klass).to.include.key('_another');
        return expect(klass).to.include.key('another');
      });
      it("Should have added the correct default values", function() {
        expect(klass.id).to.equal(-1);
        expect(klass.foo).to.not.equal('bar');
        expect(klass.free).to.equal('bird');
        return expect(klass.clazz).to.be["instanceof"](Clazz);
      });
      it("Should have added the correct observable type", function() {
        expect(ko.isObservable(klass.hello)).to.be["true"];
        expect(ko.isObservable(klass.foo)).to.be["true"];
        expect(ko.isComputed(klass.test)).to.be["true"];
        expect(ko.isObservable(klass._another)).to.be["true"];
        return expect(ko.isComputed(klass.another)).to.be["true"];
      });
      it("Should have added the correct writeable observable type", function() {
        expect(ko.isWriteableObservable(klass.hello)).to.be["true"];
        expect(ko.isWriteableObservable(klass.foo)).to.be["true"];
        expect(ko.isWriteableObservable(klass.test)).to.be["false"];
        expect(ko.isWriteableObservable(klass._another)).to.be["true"];
        return expect(ko.isWriteableObservable(klass.another)).to.be["true"];
      });
      it("Should have assigned the correct values to observables", function() {
        expect(ko.utils.unwrapObservable(klass.hello)).to.equal("world");
        expect(ko.utils.unwrapObservable(klass.foo)).to.equal("baz");
        expect(ko.utils.unwrapObservable(klass.test)).to.equal("method");
        expect(ko.utils.unwrapObservable(klass._another)).to.equal("good");
        expect(ko.utils.unwrapObservable(klass.another)).to.equal("good method");
        klass.another("great");
        return expect(ko.utils.unwrapObservable(klass.another)).to.equal("great method");
      });
      it("Should have propogated defaults in the child class", function() {
        expect(klass.clazz.id).to.equal('z');
        return expect(klass.clazz.im).to.equal('here');
      });
      it("Should have an observable array", function() {
        expect(ko.isObservable(klass.arr)).to.be["true"];
        expect(klass.arr()).to.be["instanceof"](Array);
        expect(klass.arr().length).to.equal(2);
        return expect(klass.arr()).to.not.equal(Klass.prototype.observables.arr);
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
        expect(hello_spy).to.not.have.been.called;
        rawr_class = new RawrClass("one", "two", "three");
        expect(hello_spy).to.have.been.called;
        expect(hello_spy.callCount).to.equal(1);
        expect(hello_spy.firstCall.args.length).to.equal(3);
        expect(hello_spy.firstCall.args[0]).to.equal("one");
        expect(hello_spy.firstCall.args[1]).to.equal("two");
        return expect(hello_spy.firstCall.args[2]).to.equal("three");
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
        expect(my_klass).to.be["instanceof"](Falcon.Object);
        expect(my_klass).not.to.be["instanceof"](Falcon.Model);
        expect(my_klass).not.to.be["instanceof"](Falcon.Collection);
        expect(my_klass).not.to.be["instanceof"](Falcon.View);
        expect(Klass.prototype.custom).to.be.a('function');
        expect(Klass.prototype.text).to.be.a('string');
        expect(Klass.things).to.be.a('function');
        expect(my_klass.custom).to.be.a('function');
        expect(my_klass.text).to.be.a('string');
        my_klass.custom();
        expect(custom_spy).to.have.been.called;
        expect(custom_spy.firstCall).to.have.been.calledOn(my_klass);
        Klass.things();
        expect(things_spy).to.have.been.called;
        return expect(things_spy.firstCall).to.have.been.calledOn(Klass);
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
        expect(my_klass).to.be["instanceof"](Falcon.Object);
        expect(my_klass).to.be["instanceof"](Falcon.Model);
        expect(my_klass).not.to.be["instanceof"](Falcon.Collection);
        expect(my_klass).not.to.be["instanceof"](Falcon.View);
        expect(Klass.prototype.initialize).to.be.a('function');
        expect(Klass.prototype.custom).to.be.a('function');
        expect(Klass.prototype.text).to.be.a('string');
        expect(Klass.things).to.be.a('function');
        expect(my_klass.initialize).to.be.a('function');
        expect(my_klass.custom).to.be.a('function');
        expect(my_klass.text).to.be.a('string');
        expect(init_spy).to.have.been.called;
        expect(init_spy.firstCall).to.have.been.calledOn(my_klass);
        my_klass.custom();
        expect(custom_spy).to.have.been.called;
        expect(custom_spy.firstCall).to.have.been.calledOn(my_klass);
        Klass.things();
        expect(things_spy).to.have.been.called;
        return expect(things_spy.firstCall).to.have.been.calledOn(Klass);
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
        expect(my_klass).to.be["instanceof"](Falcon.Object);
        expect(my_klass).not.to.be["instanceof"](Falcon.Model);
        expect(my_klass).to.be["instanceof"](Falcon.Collection);
        expect(my_klass).not.to.be["instanceof"](Falcon.View);
        expect(Klass.prototype.initialize).to.be.a('function');
        expect(Klass.prototype.custom).to.be.a('function');
        expect(Klass.prototype.text).to.be.a('string');
        expect(Klass.things).to.be.a('function');
        expect(my_klass.initialize).to.be.a('function');
        expect(my_klass.custom).to.be.a('function');
        expect(my_klass.text).to.be.a('string');
        expect(init_spy).to.have.been.called;
        expect(init_spy.firstCall).to.have.been.calledOn(my_klass);
        my_klass.custom();
        expect(custom_spy).to.have.been.called;
        expect(custom_spy.firstCall).to.have.been.calledOn(my_klass);
        Klass.things();
        expect(things_spy).to.have.been.called;
        return expect(things_spy.firstCall).to.have.been.calledOn(Klass);
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
        expect(my_klass).to.be["instanceof"](Falcon.Object);
        expect(my_klass).not.to.be["instanceof"](Falcon.Model);
        expect(my_klass).not.to.be["instanceof"](Falcon.Collection);
        expect(my_klass).to.be["instanceof"](Falcon.View);
        expect(Klass.prototype.initialize).to.be.a('function');
        expect(Klass.prototype.custom).to.be.a('function');
        expect(Klass.prototype.text).to.be.a('string');
        expect(Klass.things).to.be.a('function');
        expect(my_klass.initialize).to.be.a('function');
        expect(my_klass.custom).to.be.a('function');
        expect(my_klass.text).to.be.a('string');
        expect(init_spy).to.have.been.called;
        expect(init_spy.firstCall).to.have.been.calledOn(my_klass);
        my_klass.custom();
        expect(custom_spy).to.have.been.called;
        expect(custom_spy.firstCall).to.have.been.calledOn(my_klass);
        Klass.things();
        expect(things_spy).to.have.been.called;
        return expect(things_spy.firstCall).to.have.been.calledOn(Klass);
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
        expect(child_klass).to.be["instanceof"](Falcon.Object);
        expect(child_klass).to.be["instanceof"](Klass);
        expect(child_klass).not.to.be["instanceof"](Falcon.Model);
        expect(child_klass).not.to.be["instanceof"](Falcon.Collection);
        expect(child_klass).not.to.be["instanceof"](Falcon.View);
        expect(ChildKlass.prototype.custom).to.be.a('function');
        expect(ChildKlass.prototype.text).to.be.a('string');
        expect(ChildKlass.prototype.another).to.be.a('function');
        expect(ChildKlass.things).to.be.a('function');
        expect(ChildKlass.foo).to.be.a('string');
        expect(child_klass.custom).to.be.a('function');
        expect(child_klass.text).to.be.a('string');
        expect(child_klass.another).to.be.a('function');
        child_klass.custom();
        expect(custom_spy).to.have.been.called;
        expect(custom_spy.firstCall).to.have.been.calledOn(child_klass);
        ChildKlass.things();
        expect(things_spy).to.have.been.called;
        return expect(things_spy.firstCall).to.have.been.calledOn(ChildKlass);
      });
    });
  });

}).call(this);
