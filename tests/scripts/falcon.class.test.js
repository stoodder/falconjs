(function() {
  var __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  describe("Tesing event functionality", function() {
    var klass;

    klass = null;
    beforeEach(function() {
      return klass = new Falcon.Class;
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
    return describe("Test #observables and #defaults", function() {
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

      })(Falcon.Class);
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

      })(Falcon.Class);
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
      return it("Should have propogated defaults in the child class", function() {
        expect(klass.clazz.id).to.equal('z');
        return expect(klass.clazz.im).to.equal('here');
      });
    });
  });

}).call(this);
