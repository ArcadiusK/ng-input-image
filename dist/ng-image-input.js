(function (angular, factory) {
    'use strict';
    if (typeof module !== 'undefined' && module.exports) {

    } else if (typeof define === 'function' && define.amd) {
        define(['angular'], function (angular) {
            return factory(angular);
        });
    } else {
        return factory(angular);
    }
}(window.angular || null, function (angular) {
    'use strict';

var app = angular.module('ngImageInput', []);

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

app.factory('ngImageInputTemplate', function () {
    return '<div class="ng-image-input">\
              <ul ng-show="errors.length" class="errors">\
                <li ng-repeat="error in errors">\
                  {{ error }}\
                </li>\
              </ul>\
              <input type="file" />\
              <div ng-show="showPreview" class="image-preview">\
                <span>Preview:</span>\
              </div>\
            </div>';
});

app.factory('ImageMIMETypes', function () {
  // Clearly incomplete duh doy.
  return {
    'gif': 'image/gif',
    'bmp': 'image/bmp',
    'png': 'image/png',
    'jpeg': 'image/jpeg',
    'jpg': 'image/jpeg'
  };
});

app.service('ngImageInputValidationService', function (ImageMIMETypes) {

  this.validateFileType = function (file, acceptedExtensions) {
    var acceptedMimeTypes = acceptedExtensions.map(function (extension) {
      return ImageMIMETypes[extension];
    });
    return acceptedMimeTypes.indexOf(file.type) !== -1;
  };

  this.validateImageDimensions = function (image, dimensions) {
      return image.width >= dimensions.minWidth &&
             image.width <= dimensions.maxWidth &&
             image.height >= dimensions.minHeight &&
             image.height <= dimensions.maxHeight;
  };

});

app.service('ngImageInputFileConversionService', function ($q) {

  if (typeof window.FileReader === 'undefined') {
    throw new Error('Browser does not support File API');
  }

  this.toBase64 = function (file) {

    var d = $q.defer();
    var fileReader = new FileReader();

    fileReader.readAsDataURL(file);

    fileReader.onload = function () {
      d.resolve(fileReader.result);
    };

    fileReader.onerror = function () {
      d.reject(fileReader.error);
    }

    return d.promise;

  };

  this.toImageObject = function (dataURL) {

    var d = $q.defer();

    var image = new Image();
    image.src = dataURL;

    image.onload = function () {
      d.resolve(image);
    };

    image.onerror = function () {
      d.reject('Error loading image.');
    };

    return d.promise;

  };

});

  return app;
  
}));
