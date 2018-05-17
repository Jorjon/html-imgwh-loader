An HTML loader that adds `width` and `height` attributes to all `img` tags in the HTML file.

Converts
```HTML
<img src="logo.png"/>
```
into
```HTML
<img src="logo.png" width="126" height="130"/>
```


## Installation
`npm install html-imgwh-loader`

## Usage
```Javascript
rules: [
    {
        test: /\.pug$/,
        use: [
            {
                loader: 'html-loader'
            },
            {
                loader: 'html-imgwh-loader'
            },
            {
                loader: 'pug-html-loader',
                options: {
                    pretty: true,
                    doctype: 'html'
                }
            }
        ]
    }
  ]
```
