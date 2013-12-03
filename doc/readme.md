如何采集线上数据？

    １．fisp install pc-plugin-pack-map  //升级fisp的smarty插件   目前手工copy ， 在tools目录下面

    2.  npm install -g npm install -g fis-postpackager-ext-map  //添加fis编译插件
    3.  fis-config.js中添加

            modules : {
                postpackager : 'ext-map'
            }

    4.  {%html%} 中指定采样率和产品线id

        {%html framework="common:static/lib/js/mod.js" fid="fis_id" sampleRate="1"%}


    4.5 升级BigPipe.js文件

    5. 重新编译上线