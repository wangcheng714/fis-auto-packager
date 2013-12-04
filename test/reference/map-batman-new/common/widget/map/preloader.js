module.exports = {
    init : function () {
        // 预加载地图JS
        require.async([
            'common:widget/api/api.js',
            'common:widget/api/ext/tfcinfowindow.js'
        ]);
        // 预加载矢量异步文件
        require('common:widget/map/plugin.js').getVectorMdl();
    }
};