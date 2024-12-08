/*

	Main2: Client.js
	Author: VEGETAZ
	Created on: Sep.1, 2023
	Updated on: Dec.09, 2024
	Version: 0.0.3

*/

// 本地玩家
var localPlayer = null;

// 新版VAngle相反！
var BoxingVAngle = -50;
var CommonVAngle = -30;

// 健康，不健康滤镜
var healthVignette = [Color(0, 0, 0), Color(200, 0, 0) ];


// ============================== Script ================================


function OnScriptLoad()
{
	// ...
}



// 帧更新事件，deltaTime单位为秒
function OnFrameUpdate(deltaTime){

	// ...

}


// ============================== Stream Data ================================

// 接收到来自服务端发送的自定义数据时事件
function OnServerStreamData( number, data)
{
	data = JSON.parse(data);
	let key = data.key;

	switch(key){

		case "BoxingVAngle":
				if(data.value == 1) Camera.VAngle = BoxingVAngle;
				else Camera.VAngle = CommonVAngle;
				break;

		case "HealthVignette":
				if(data.value == 0){
					Camera.Vignette = 0;
					Camera.VignetteColor = healthVignette[0];
				}
				else{
					// 最大0.8，此处value为损失的血量
					Camera.Vignette = data.value/100 - 0.15;
					Camera.VignetteColor = healthVignette[1];
				}
				break;

	}

}





// =========================== Entity ===================================

function OnPlayerEntityLogin( player, entity )
{
	// DLog("OnEntityLogin," + entity.ID);
	
	//外置脚本
	//PlayerBillboard.OnPlayerEntityLogin(player, entity);
	
	if(player.IsLocal)
	{
		Camera.Target = entity;
		
		//Camera.Mode = 2;
		//Camera.FreeCamera = true;
		Camera.Offset = Vector(0, 1.5, 0);

		// Test
		Camera.ForwardMode = true;


		Camera.Distance = 9;
		Camera.SmoothTime = 0.3;
		Camera.DistanceSpeed = 2;
		Camera.VAngle = CommonVAngle;


		// 设置本地玩家变量
		localPlayer = player;

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


// =========================== Vehicle ==========================

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








// ============================== Local Commands ================================

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

commands.ticks = function(arg){

	Message(`ticks: ${GetModTickCount()}`);
	
	
};
commands.helpString.push("/ticks");

// 测试异步
commands.testasync = function(arg){

	Message(`${arg}`);

	// arg = parseInt(arg);

	Message(`${arg}`);

	(async function(){

		return await new Promise((resolve, error)=>{

			Message(`in promise`);

			// 无异步效果
			if(arg == 1) //setTimeout(resolve, 3000, "Async resolve");
			Timer.Create(()=>resolve("Async Resolve Timer."), 5, 1);
			else if(arg == 2) // setTimeout(()=>{error("Async error")}, 5000, );
			Timer.Create(()=>error("Async Error Timer."), 5, 1, );
		});

	})().then(result => Message(`Async Result: ${result}`)).catch(e => Message(`Async Error: ${e}`));
	
	
};
commands.helpString.push("/testasync");

async function testasyncf(arg){
		return await new Promise((resolve, error)=>{

			Message(`in promise`);

			if(arg == 1) //setTimeout(resolve, 3000, "Async resolve");
			Timer.Create(resolve, 3, 1, "Async Resolve Timer.");
			else if(arg == 2) // setTimeout(error, 5000, "Async error");
			Timer.Create(error, 3, 1, "Async Error Timer.");
		});
}

// 测试setTimeout
commands.teststo = function(arg){

	// 无异步效果，无延时效果
	setTimeout(()=>{Message(`Timeout done!`)}, 3);
	
	
};
commands.helpString.push("/teststo");



commands.islocal = function(arg){

	Message(`isLocal: ${localPlayer == World.LocalPlayer}`);
	
	
};
commands.helpString.push("/islocal");



commands.testlhealth = function(arg){

	Message(`isLocalHealth: ${localPlayer.Health}`);
	
	
};
commands.helpString.push("/testlhealth");


commands.testvig = function(arg){


	if(arg == null || arg == "") return;

	Message(`arg: ${arg}`);

	Camera.Vignette = parseFloat(arg);

	Camera.VignetteColor = Color(30, 170, 70);
	
	Message(`Vigenette Set to: ${arg}`);
	
	
};
commands.helpString.push("/testvig");

// 测试相机
commands.testcam = function(arg){


	if(arg == null || arg == "") return;

	Message(`arg: ${arg}`);

	Camera.Distance = parseInt(arg);

	
	Message(`Camera Distance Set to: ${arg}`);
	
	
};
commands.helpString.push("/testcam");

// 测试第一人称（固定，不跟随鼠标移动）
commands.testfp = function(arg){

	if(arg != "off"){

		Camera.Offset = Vector(0, 1.77, 0);
		Camera.Distance = 0;
		Camera.SmoothTime = 0;
		Camera.DistanceSpeed = 2;
		Camera.VAngle = 10;
	
	}
	else{
		Camera.Offset = Vector(0, 1.5, 0);
		Camera.Distance = 9;
		Camera.SmoothTime = 0.5;
		Camera.DistanceSpeed = 2;
		Camera.VAngle = 25;
	}

	Message(`Camera First Point(Fixed) Set to: ${!arg?"on":"off"}`);
	
	
};
commands.helpString.push("/testcam");

commands.reconnect = function(arg){

	Message("Reconnecting...");

	Reconnect();
	
	
};
commands.helpString.push("/reconnect");

commands.reload = function(arg){

	Message("Reloading...");

	CreateHost("eg_vgtz_Sep01", "Main2");
	
	
};
commands.helpString.push("/reload");



// 本地指令事件
function OnLocalPlayerCommand( cmd, arg )
{

	cmd = cmd.toLowerCase() + "";

	// 当指令在Client生效时，不需要服务端处理
	if(cmd in commands){
				commands[cmd](arg);
				return false;
	}

	// Message("No Such Local Command! Use /lhelp to check Commands!");
	return true;



}





