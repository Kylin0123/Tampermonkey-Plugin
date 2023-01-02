
# Tampermonkey-Plugin 一键去除在线翻译网站的换行符（原名：翻译插件——去除换行）

# 使用效果

在各大在线翻译网站的页面上增加了一个“格式化”按钮，用来移除从PDF等复制过来的文本中包含的回车符、换行符、"\n"等，支持DeepL翻译、谷歌翻译、百度翻译、网易有道翻译

# 适用网站

- https://www.deepl.com/translator DeepL翻译
- https://translate.google.cn/ 谷歌翻译（中国）
- https://translate.google.com/ 谷歌翻译（国际）
- https://fanyi.baidu.com/ 百度翻译
- http://fanyi.youdao.com/ 网易有道翻译

# 作者的话

- 这个小工具是作者读研期间阅读英文论文文献有需求顺手做的，现在工作了这类需求减少不一定能注意到各大翻译网站的及时更新，敬请谅解（能帮助到大家还是很高兴的）。
- 如果使用过程中发现某一个翻译网站失效了，如“格式化”按钮消失或者点击“格式化”没有反应，一般而言是翻译网站前端样式做了更新，会前端的同学可以尝试修改CONFIG配置文件的CSS选择器进行自行修复，也可以留言或者发送作者邮箱修复（留言很少看，邮件联系更及时），包括不会前端的小白用户也可以联系作者邮件，邮箱地址为：csczq123456@gmail.com
- 有玩Github的同学欢迎给本开源项目点个Star, https://github.com/Kylin0123/Tampermonkey-Plugin

# 使用Q&A

- Q：为什么点击“格式化”以后右侧的翻译结果不会换行？A：部分翻译网站由于前端代码文本更新机制的原因，在格式化后右边的翻译框不会同步更新，解决方法：编辑一下左边的输入框（比如翻译内容末尾加个空格）即可正常翻译，已知的网站有谷歌翻译、DeepL翻译
- Q：为什么Mac上的Safari浏览器无法正常使用这个脚本？A：本工具由个人使用chrome浏览器维护，safari在css选择器上的行为可能和chrome不一致

# 更新日志

- 2023-01-02：修复deepL失效问题
- 2021-11-11：之前的网站除了百度基本都失效了，重新适配了网站CSS

# 感谢

- 感谢@奥力给 在评论区 https://greasyfork.org/zh-CN/scripts/390059-%E4%B8%80%E9%94%AE%E5%8E%BB%E9%99%A4%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91%E7%BD%91%E7%AB%99%E7%9A%84%E6%8D%A2%E8%A1%8C%E7%AC%A6/discussions/125643 的修复建议
- 感谢@Guang Cai 在GreasyFork在2020年的修改版本（作者当时没能及时更新）： https://greasyfork.org/zh-CN/scripts/402321-%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6-%E5%8E%BB%E9%99%A4%E6%8D%A2%E8%A1%8C-%E6%94%B9

# 请作者喝杯咖啡

- 如果觉得本工具好用的话，欢迎通过支付宝给作者打赏，二维码见图片部分
