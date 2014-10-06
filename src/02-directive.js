app.directive('ngImageInput', function (ngImageInputTemplate, ngImageInputValidationService, ngImageInputFileConversionService) {

  var validator = ngImageInputValidationService;
  var conversion = ngImageInputFileConversionService;

  return {
    restrict: 'E',
    template: ngImageInputTemplate,
    scope: {},
    require: 'ngModel',
    link: function (scope, element, attrs, ngModel) {

      // Dimension validation can be provided via element attributes
      // i.e. <ng-image-input min-height="200" max-height="600" />
      var validDimensions = {
        minHeight : attrs.minHeight || 0,
        minWidth : attrs.minWidth || 0,
        maxWidth : attrs.maxWidth || Infinity,
        maxHeight : attrs.maxHeight || Infinity
      };

      // Accepted extensions can be applied with a comma delimited string
      // i.e. <ng-image-input accepted-extensions="gif,png,jpg" />.
      // This will default to no file type validation if attribute is not found.
      var validExtensions = [];
      if (typeof attrs.acceptedExtensions === 'string') {
        validExtensions = attrs.acceptedExtensions.split(',');
      }

      // Preview-specific
      // -----------------------
      var $previewContainer = element.find('div').eq(1);
      var appendPreview = function (image) {
        $previewContainer.find('img').remove();
        $previewContainer.append(image);
      };

      scope.showPreview = false;
      ngModel.$viewChangeListeners.push(function () {
        scope.showPreview = ngModel.$viewValue !== null;
      });

      // On file change
      // ----------------------------------
      var $fileInput = element.find('input');

      $fileInput.on('change', function (e) {

        var file = e.target.files[0];

        // Reset errors, validity of ngModel and force dirty state.
        scope.errors = [];
        ngModel.$dirty = true;
        ngModel.$setValidity('type', true);
        ngModel.$setValidity('dimensions', true);

        // Validate file type if necessary.
        if (validExtensions.length && !validator.validateFileType(file, validExtensions)) {
          scope.$apply(function () { // Element event is not registered to $digest, so we have to $apply.
            ngModel.$setViewValue(null);
            ngModel.$setValidity('type', false);
            scope.errors.push('Invalid image type.');
          });
          return;
        }

        // Get a Data URL for this file via service.
        var convertFileToBase64 = conversion.toBase64(file).catch(console.error.bind(console));

        convertFileToBase64.then(function (dataURL) {

          // Use Data URL to create an image element via service.
          var convertToImage = conversion.toImageObject(dataURL).catch(console.error.bind(console));

          convertToImage.then(function (image) {
            if (!validator.validateImageDimensions(image, validDimensions)) {
              ngModel.$setViewValue(null);
              ngModel.$setValidity('dimensions', false);
              scope.errors.push('Invalid image dimensions.');
            } else {
              appendPreview(image);
              ngModel.$setViewValue(dataURL);
            }
          });

        });

      });

    }

  };

});
