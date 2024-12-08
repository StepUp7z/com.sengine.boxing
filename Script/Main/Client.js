/*

	Main: Client.js
	Author: VEGETAZ
	Created on: Sep.1, 2023
	Updated on: Sep.20, 2023
	Version: 0.3
	Info: 连接游戏前的页面

*/

// 全局变量，本地玩家
var localPlayer = null;

function OnScriptLoad()
{

	// 进连接前禁止聊天
	SetChatEnabled(false);

	var Startup = GetGlobalVars("Startup");

	// 是否为Server模式
	if(IsServerMode())
	{
		//Server Mode
		// let startup = GetGlobalVars("Startup");

		// 开启主机
		CreateHost(Startup.Map, "Main2");

		return;
	}
	

	
	let view = {
		Cover: 5,
		Tag: "menu",
		Title: "Boxing游戏",
		Info: "菜单",
		Width: 500,
		Align: 1,
		Layout: 1,
		Items: [
			{
				Text: "启动主机",
				OnClick: () => {
					CreateHost(Startup.Map, "Main2");
				}
			},{
				Text: "[color=#ffff00]加入本地服务器（本地测试）[/color]",
				OnClick: () => {
					ConnectHost("127.0.0.1");
				}
			},{
				Text: "地图编辑器",
				OnClick: () => {
					LoadNativeScene(1);
				}
			},{
				Text: "游戏设置",
				OnClick: () => {
					CreateNativeView(1);
				}
			},{
				Text: "多人游戏浏览器",
				OnClick: () => {
					CreateNativeView(2);
				}
			}
		]
	};
	
	CreateNativeMenu(view);
}


// Commands
var commands = {};
commands.helpString = [];

commands.lhelp = function(arg){
	var s = "";

	// Message(`length: ${commands.helpString.length}`);

	for(var i=0; i<commands.helpString.length; i++){
		s += (commands.helpString[i] + " ");

		// 接近极限或者提取结束时输出
		if(s.length >= 50 || (i==commands.helpString.length-1)){

			Message(s);
			s = "";
		}

	}

	
	
};
commands.helpString.push("/lhelp");





function OnLocalPlayerCommand( cmd, arg )
{
	cmd = cmd.toLowerCase() + "";

	// 客户端实现了该指令，故不需要服务端来处理
	if(cmd in commands){
				commands[cmd](arg);
				return false;
	}

	// Message("No Such Local Command! Use /lhelp to check Commands!");
	return true;

}



// ====================== Entity =====================

function OnPlayerEntityLogin( player, entity )
{
	//DLog("OnEntityLogin," + entity.ID);
	
	//外置脚本
	//PlayerBillboard.OnPlayerEntityLogin(player, entity);
	
	if(player.IsLocal)
	{
		Camera.Target = entity;
		
		//Camera.Mode = 2;
		//Camera.FreeCamera = true;

		Camera.Offset = Vector(0, 2, 0);

		Camera.Distance = 5;
		Camera.SmoothTime = 0.3;
		Camera.DistanceSpeed = 2;
	}
}

function OnPlayerEntityLogout( player, entity )
{
	// DLog("On22222," + entity.ID);


	return;

	//外置脚本
	PlayerBillboard.OnPlayerEntityLogout(player, entity);
	
	if(player.IsLocal)
	{
		
	}
}


// ====================== Vehicle =====================

function OnCharacterEnterVehicle( character, vehicle, seat )
{
	// DLog("On22222," + vehicle.ID);


	if(character.Owner != null && character.Owner == World.LocalPlayer)
	{
		Camera.Distance = 18;
	}
}

function OnCharacterExitVehicle( character, vehicle, seat )
{
	// DLog("OnCharacterExitVehicle," + vehicle.ID);

	if(character.Owner != null && character.Owner == World.LocalPlayer)
	{
		Camera.Distance = 8;
	}
}

