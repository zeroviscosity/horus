window.HorusConfig = {
    services: [
        {
            label: 'Example Service',
            url: 'https://api.example.com/api/version',
            parse: function(data) {
                // Do something with the data
                return data.version;
            }
        }
    ]
};

