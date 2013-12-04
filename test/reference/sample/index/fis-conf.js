
fis.config.merge({
    namespace: 'index',
    modules : {
        postpackager : 'ext-map'
    },
    pack: {
        '/static/pkg.css': [
            '/page/index.css',
            '/widget/ui/*.css'
        ],
        '/static/pkg.js': [
            '/widget/ui/*.js'
        ]
    }
});
