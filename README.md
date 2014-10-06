ng-input-image (work in progress)
==============

Element directive for quickly adding an image input to any AngularJS-powered form.

```html
  <ng-image-input ng-model="album.art"></ng-image-input>
```

###Features:
- Generates an interface with an image preview.
- Set base64 data URL to ng-model for easy AJAX image uploading (dependent on backend implementation).
- File type validation by adding an `accepted-extensions` attribute to element (e.g. `accepted-extensions="png,jpg"`).
- Image dimensions validation by suppling attributes (`min-height="600"`, `max-width="1000"`).

***This project is a work in progress.***

##Demo Instructions
- node demo/server.js
- Access demo at `http://localhost:8000`
