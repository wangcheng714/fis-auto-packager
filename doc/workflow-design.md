
### 环境

* windows 依赖TortoiseSVN 命令行工具

### fis-packager-autopack

* 获取当前目录svn (window需要做检查如没有TortoiseSVN提示输入当前svn路径)
* 读取type和fid配置 ：
    根据fid选择不同的trunk地址
* 发送自动打包请求，等待返回结果
    错误结果 ： 提示错误信息
    正确结果 ： 返回打包配置文件
* 替换本地fis-pack.json文件

### fis-cloud-app-autopack

* 云端保存每个fid对应的svn trunk目录
* 修改现有编译模式
    对于线下分析静态资源的模式 ： 如果是common模块则调用trunk整站编译
    对于线上全部统计模式 ： 则只用编译当前模块