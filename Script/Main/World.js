/*

	Main: World.js
	Author: VEGETAZ
	Created on: Sep.1, 2023
	Updated on: Sep20, 2023
	Version: 0.3
	Info: 连接游戏前的世界

*/





// npc列表
var npcs = [];

var pp = null;
var charas = [];

// Commands
var commands = {};
commands.helpString = [];

commands.help = function(player, arg){
	var s = "";

	for(var i=0; i<commands.helpString.length; i++){
		s += (commands.helpString[i] + " ");

		// 接近极限或者提取结束时输出
		if(s.length >= 50 || (i==commands.helpString.length-1)){

			Message(s);
			s = "";
		}

	}

};
commands.helpString.push("/help");

commands.exec = function(player, arg){
	if(arg == null) return;
	try{
		Exec(arg);
		Message("Exec: " + arg.length);
	}catch(e)
	{
		Message("Exec Error: " + e);
	}
};

commands.helpString.push("/exec");


commands.kill = function(player, arg){
	player.Entity.Kill();
}

commands.helpString.push("/kill");




function OnScriptLoad()
{
	// DLog("load: Main World");

	SetWeather(0);
	// SetMaxPlayers(GetGlobalVars("MaxPlayers"));

	var Startup = GetGlobalVars("Startup");
	SetMaxPlayers(Startup.MaxPlayers);


	//SetGameRule("fogmultiplier", 2);

}

function OnPlayerJoin( player )
{
	// DLog(player.Name + " joined");
	Message(`${player.Name} joined.`);
}

function OnPlayerComplete( player )
{
	let chara = Character.Create(0, Vector(0, 0, 0), 0);

	player.SetEntity(chara, false);

	Message(`${player.Name} completed.`);

	return;

}



function OnPlayerCommand( player, cmd, arg )
{

	cmd = cmd.toLowerCase() + "";

	if(!(cmd in commands)){
		Message("No Such Command! Use /help to check Commands!");
		return;
	}

	commands[cmd](player, arg);

}

function OnPlayerEntityLogin( player, entity )
{
	// DLog("S1," + entity.ID);
}

function OnPlayerEntityLogout( player, entity )
{
	// DLog("S2," + entity.ID);

}

function OnPickupEntered( pickup, entity )
{
	// DLog("enterP " + pickup.ID);
}

function OnPickupExited( pickup, entity )
{
	/*
	DLog("exitp " + pickup.ID);
	DLog(entity.PickupTime);
	*/
}

function OnCheckpointEntered( checkpoint, entity )
{
	// DLog("entercc " + checkpoint.ID);

	return;
}

function OnCheckpointExited( checkpoint, entity )
{
	/*
	DLog("exitcc " + checkpoint.ID);
	DLog(entity.CheckpointTime);
	*/
}

function OnCharacterEnterVehicle( character, vehicle, seat )
{
	// DLog("SERVER OnCharacterEnterVehicle," + vehicle.ID);
	
	return;

	character.SetProp(index, id, num);
	character.AddProp(id, num);
	
	vehicle.SetProp(index, id, num);
	vehicle.AddProp(id, num);
}

function OnCharacterExitVehicle( character, vehicle, seat )
{
	// DLog("SERVER OnCharacterExitVehicle," + vehicle.ID);
}

function fp(id)
{
	return Player.Find(id);
}