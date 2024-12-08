/**
 * # 测试插件  
 * 
 * - 作者：VEGETAZ  
 * - 创建时间：Aug.14, 2024  
 * - 更新时间：Dec.08, 2024  
 * - 版本：v0.0.2  
 * 
 * ## 说明
 * 
 * - 作为插件的服务端脚本
 * - 简单演示了Plugin的实现
 * - 详细说明（Wiki）[https://sengine.mp-gamer.com/scripting/world/main](https://sengine.mp-gamer.com/scripting/world/main)
 * 
 */


// 测试插件
var TestPlugin = {
	
	// ==== 数据区 ====
	name: "TestPlugin",
	time: "2024.08.14",
	
	// 存放：事件监听器实例哈希值，deinit中用
	listeners: [],
	
	// ==== 功能区 ====
	show: function(){
		Message(`name: ${this.name}`);
		Message(`time: ${this.time}`);
	},
	
	// 初始化
	init: function(){
		// 遍历事件实现
		for(let eventName in this.events){
			// 注册事件监听：事件名，事件实现
			let listener = AddListener(eventName, this.events[eventName]);
			// 加入容器
			this.listeners.push(listener);
		}
	},
	// 反向初始化-插件关闭用
	deinit: function(){
		// 取消事件监听
		for(let i=0; i<this.listeners.length; i++){
			RemoveListener(this.listeners[i]);
		}
	},
	
	// ==== 事件区 ====
	events: {
		// 指令
		OnPlayerCommand: function(player, cmd, arg){
			DLog(`TestPlugin拦截到cmd事件：${player.Name}使用${cmd}指令并传参${arg}`);
			DLog(TestPlugin.show());
		},
		// ...Others
		
	},
	
	
	
};


// 加载本文件即刻调用初始化
TestPlugin.init();

