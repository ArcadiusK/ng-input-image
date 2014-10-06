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
