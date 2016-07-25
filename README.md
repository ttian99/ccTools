# ccTools
the ccTools is used build file resource.js and package.json for cocos project.
## how to used
1.要使用本工具需要nodejs
没有nodejs的同学，请前往[官网](https://nodejs.org)下载安装, 已有的可以忽略此步。

2.将本工具文件夹放置于你的cocos项目的根目录
```
git clone https://github.com/ttian99/ccTools.git
```
3.创建resource.js
双击运行createRes.bat，或者使用命令行如下，项目里面的resource.js会重新生成
```
node createRes.js
```

4.创建package.json
双击createJson.bat，或者使用命令行如下，项目里面的package.json会重新生成
```
node createJson.js
```