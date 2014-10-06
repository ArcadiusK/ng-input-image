describe('Validation Service', function () {

  beforeEach(module('ngImageInput'));

  var validator;
  beforeEach('Get service', inject(function (ngImageInputValidationService) {
    validator = ngImageInputValidationService;
  }));

  describe('validateFileType', function () {

    it('should return false if file type does not match an accepted mime type', function () {
      expect(validator.validateFileType({ type: 'image/jpeg' }, ['gif', 'png'])).to.be.not.ok;
    });

    it('should return true if file type does match an accepted mime type', function () {
      expect(validator.validateFileType({ type: 'image/jpeg' }, ['gif', 'png', 'jpg'])).to.be.ok;
    });

  });

  describe('validateImageDimensions', function () {

    it('should correctly validate each dimension', function () {

      var validDimensions = {
        minHeight: 500,
        maxHeight: 800,
        minWidth: 800,
        maxWidth: 1200
      };validDimensions

      expect(validator.validateImageDimensions({ width: 700, height: 600 }, validDimensions)).to.be.not.ok;
      expect(validator.validateImageDimensions({ width: 1300, height: 600 }, validDimensions)).to.be.not.ok;
      expect(validator.validateImageDimensions({ width: 900, height: 400 }, validDimensions)).to.be.not.ok;
      expect(validator.validateImageDimensions({ width: 900, height: 1000 }, validDimensions)).to.be.not.ok;

      expect(validator.validateImageDimensions({ width: 900, height: 600 }, validDimensions)).to.be.ok;
      expect(validator.validateImageDimensions({ width: 800, height: 600 }, validDimensions)).to.be.ok;
      expect(validator.validateImageDimensions({ width: 800, height: 800 }, validDimensions)).to.be.ok;

    });

  });

});
