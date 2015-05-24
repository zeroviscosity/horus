# Horus: Serivce Monitoring System

Create `assets/js/config.js` and add something like this:

```javascript
window.HorusConfig = {
    services: [
        {
            label: 'Example Service',
            url: 'https://api.example.com/api/version',
            parse: function(data) {
                // Return something from the data for display purposes
                return data.version;
            }
        }
    ]
};
```

Compile the js using Browserify and Reactify:

```bash
browserify -t reactify js/app.jsx -o assets/js/app.js
```

Start the server:

```bash
cargo run
```
