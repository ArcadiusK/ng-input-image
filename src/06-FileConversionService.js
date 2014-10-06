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
