describe('File Conversion Service', function () {

  beforeEach(module('ngImageInput'));

  var convert, $rootScope;
  beforeEach('Get service', inject(function (ngImageInputFileConversionService, _$rootScope_) {
    convert = ngImageInputFileConversionService;
    $rootScope = _$rootScope_;
  }));

  describe('toBase64', function () {

    var frInstance;
    beforeEach('Stub FileReader', function () {
      frInstance = {
        readAsDataURL: sinon.stub()
      }
      window.FileReader = sinon.stub();
      window.FileReader.returns(frInstance);
    });

    it('should return a promise', function () {
      expect(convert.toBase64({}).then).to.be.a('function');
    });

    it('should call readAsDataURL with the passed in file', function () {
      var file = {};
      convert.toBase64(file);
      expect(frInstance.readAsDataURL.calledWith(file)).to.be.ok;
    });

    it('should resolve the promise with the file reader result when it loads', function () {
      var file = {};
      var conversion = convert.toBase64(file);
      frInstance.result = 'base64String';
      frInstance.onload();
      expect(conversion).to.eventually.be.equal('base64String');
      $rootScope.$digest();
    });

    it('should reject the promise with the file reader error on error', function () {
      var file = {};
      var conversion = convert.toBase64(file);
      frInstance.error = 'Oh noes!';
      frInstance.onerror();
      expect(conversion).to.be.rejectedWith('Oh noes!');
      $rootScope.$digest();
    });

  })

});
