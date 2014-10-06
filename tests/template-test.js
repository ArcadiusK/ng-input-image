describe('Template', function () {

  beforeEach(module('ngImageInput'));

  var $rootScope, $compile, digest, templateString;
  beforeEach('Get some tools', inject(function (_$rootScope_, _$compile_, ngImageInputTemplate) {
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    templateString = ngImageInputTemplate;
    digest = function () { $rootScope.$digest(); };
  }));

  var scope;
  beforeEach('Create a parent scope', function () {
    scope = $rootScope.$new();
  })

  var element;
  beforeEach('Compile template', function () {
    element = $compile(templateString)(scope);
  });

  it('should have the expected class', function () {
    expect(element.hasClass('ng-image-input')).to.be.ok;
  });

  it('should have a file input', function () {
    var $input = element.find('input');
    expect($input.attr('type')).to.be.equal('file');
  });

  it('should have a preview container that only shows when scope.showPreview is truey', function () {
    var $previewContainer = element.find('div').eq(0);
    expect($previewContainer.hasClass('image-preview')).to.be.ok;
    scope.showPreview = false;
    digest();
    expect($previewContainer.hasClass('ng-hide')).to.be.ok;
    scope.showPreview = true;
    digest();
    expect($previewContainer.hasClass('ng-hide')).to.be.not.ok;
  });

  it('should have an error list that only shows when there are errors', function () {
    var $errorList = element.find('ul');
    scope.errors = [];
    digest();
    expect($errorList.hasClass('ng-hide')).to.be.ok;
    scope.errors = ['World is exploding.'];
    digest();
    expect($errorList.hasClass('ng-hide')).to.be.not.ok;
    expect($errorList.find('li').length).to.be.equal(1);
    expect($errorList.find('li').eq(0).text().trim()).to.be.equal('World is exploding.');
  });

});
