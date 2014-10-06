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
