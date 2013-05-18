(function() {
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
    return it("Should test event methods", function() {
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
  });

}).call(this);
