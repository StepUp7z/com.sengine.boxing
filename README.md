# 沙盘引擎-SEngine之空白模组项目

- 创建时间：Sep.01, 2023
- 更新时间：Dec.09, 2024
- 版本：v0.0.15

## 说明

- 本模组为粗糙的演示，在0.0.15版本进行了可读性优化
- 下面为空白模板的README内容

## 文件结构

### Language

放置语言相关的文件夹。

### Map

放置模组地图的文件夹。

### Script

放置脚本文件的文件夹。

### Space

放置通用文件的文件。里面的文件可用API：ReadFile来读取。

### Host

Host目录表示服务端特有的目录（虽然也会同步给客户端，但是只同步Host目录，里面的文件不会同步），主要用于存放由服务端管理的文件，比如数据库、存档等等权威文件。亦可用于存放设计上不下放给客户端的文件。

#### SaveData

Host文件夹下，用于存放SaveItem相关操作的文件。

### Store

放置资源的文件夹。

- Font：字体文件夹
命名规范：与字体文件同名
- GUI：游戏UI关键配置相关的文件夹
并不表示和UI有关的素材放到这里，UI素材仍然属于Texture（除非是FGUI的特定资源，需要放到这里）
命名规范：按具体引擎功能要求命名
- Sound：声音、音频资源文件夹
只应该存放常见音频格式的文件（.mp3、.ogg、.wav等）
命名规范：s10000_SoundName.mp3（或其他格式）
为了区分引擎内声音和外部声音，所以自定义音频ID要求至少从10000开始
- Texture：图片、贴图资源文件夹
命名规范：标准命名方式即可，最好是不会被轻易更改的文件名（因为引擎内直接用文件名查找使用）
- Video：视频类资源文件夹
只应该存放常见视频格式的文件（.mp4、.ogv等）
命名规范：v10000_VideoName.mp4（或其他格式）
为了区分引擎内视频和外部视屏，所以自定义视频ID要求至少从10000开始
- Model：模型资源文件夹
命名规范：m10000_ModelName.gltf

### Cover.png

模组列表的封面与背景图片.

### Icon.ico

启动模组后引擎窗口的图标。

### Mod.json

放置着每个模组的独立配置项的配置文件。通常发布一个版本后不建议轻易修改，同时这也是模组识别的关键因素，此文件应确保存在且有效。  
详细说明：[https://sengine.mp-gamer.com/developer/config/mod_json](https://sengine.mp-gamer.com/developer/config/mod_json)

- 配置项：功能说明
- Name：模组的标准名称（建议使用英文+固定名称）（模组名称的多语言可使用Language机制实现）
- Author：模组作者
- Info：模组信息（介绍）
- Version：模组版本（仅显示及记录作用，无匹配验证）
自V0.8版本开始，由于自动下载机制的更新，不再验证模组Version是否相同
- Font：模组字体名称（可使用玩家系统已存在的字体名；对于自定义字体，目前仅支持沙盘引擎内置字体列表）
必须严格使用字体列表内名称或"索引"
（例如："TsangerYuYangT"与"1"表示相同的字体及作用）
- DefaultLanguage：模组默认语言（如果模组内Language/不存在和EngineLanguage相同的语言，则优先使用DefaultLanguage，通常建议设置为English）
- Website：模组官方网站
- NetworkPort：服务器主机端口号（默认值：8192）
只有在脚本层面未指定明确端口参数时（忽略参数），才会优先使用此处设定
注意：通常建议优先使用此属性，而不是直接在脚本指定端口，这样也可兼容于LAN服务器的搜索

### Startup.json

它的作用：允许开发者通过GetGlobalVars("Startup")获取此文件内的所有文本（内容只读，且并不限于json文本格式，即使内部是一串诗歌也不会报错）。  

通过此属性的机制，开发者可扩展实现许多前置功能（例如：专用服务端的前置配置，房间名、端口号、房间最大人数等）。  
详细说明：[https://sengine.mp-gamer.com/developer/config/startup_json](https://sengine.mp-gamer.com/developer/config/startup_json)

### jsconfig.json

vscode的配置文件。

### Local.json

独立本地配置项，由引擎每次载入模组后自动生成及修改。

- 配置项：功能说明
- LastTime：模组上次运行时间，由引擎自动赋值
- LastLicense：上次License.txt文件的哈希记录，避免重复显示窗口
- LastPlayerUUID：上次运行此模组的玩家UUID，判断是否为新玩家

### Developer.txt

开发者列表文件。

### Licence.txt + License.txt

许可证文本文件。

### 类型定义文件(index.d.ts)

**在ide或智能编辑器中可获取智能提示**  

## 相关网址 & 其他信息

### Gitee空白模组项目

<https://gitee.com/zainus-harvey-yip/com.sengine.blank>

### Wiki

[https://sengine.mp-gamer.com](https://sengine.mp-gamer.com)

### Indienova 游戏资料

[https://indienova.com/g/SandtableEngine/presskit](https://indienova.com/g/SandtableEngine/presskit)

### 引擎开发者及工作室信息

[https://sengine.mp-gamer.com/studio](https://sengine.mp-gamer.com/studio)

### 联系我们 & 加入社区

有什么好的创意或者想法吗？非常欢迎联系我们，让我们看到有人在关注！ 我们很愿意聆听你对《沙盘引擎》的想法和建议，欢迎勾搭~  

- E-Mail：<fantasyjoyed@163.com>
- QQGroup：798458058
- Kook：<https://kook.top/o6Ggd1>
- Discord: <https://discord.gg/3xEq9awnxa>
