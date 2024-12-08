/*

	Main2: World.js
	Author: VEGETAZ
	Created on: Sep.1, 2023
	Updated on: Dec.09, 2024
	Version: 0.0.7
*/


// ======================================= 全局变量区 ====================================

// NPC列表
var npcs = null;


// 玩家血条（数组）
var healthBars = null;

// npc血条（数组）
var npcHealthBars = null;

// 血条预设颜色，健康红，不健康黄
var healthBarsColor = [ Color(255, 0, 0), Color(200, 200, 0) ];


// 血条状态分界线：20%
var healthBarsHealthyLevel = 20;


// 给角色增加血条，NPC/玩家
function newHealthBar(isNpc, char){

	// NPC
	if(isNpc){

		npcHealthBars.push(Billboard.Create(2));
		let newIndex = npcHealthBars.length-1;

		npcHealthBars[newIndex].Target = char;
		npcHealthBars[newIndex].Text = char.Name;
		npcHealthBars[newIndex].Progress = char.Health*0.01;
		npcHealthBars[newIndex].Offset = Vector(0, 3, 0);
		var color = (char.Health > healthBarsHealthyLevel) ? 0 : 1;
		npcHealthBars[newIndex].Color = healthBarsColor[color];
	}
	// 玩家
	else{

		let plr = char.Owner;
		healthBars[plr.ID] = Billboard.Create(2);

		healthBars[plr.ID].Target = char;
		healthBars[plr.ID].Text = char.Name;
		healthBars[plr.ID].Progress = char.Health*0.01;
		healthBars[plr.ID].Offset = Vector(0, 3, 0);
		var color = (char.Health > healthBarsHealthyLevel) ? 0 : 1;
		healthBars[plr.ID].Color = healthBarsColor[color];
	}

}



// ============================== Script ================================


// 脚本加载时事件
function OnScriptLoad()
{


	// 初始化全局数组
	npcs = [];

	npcHealthBars = [];

	// 设置天气
	SetWeather(0);

	// 获取JSON配置作为对象
	var ModJSON = GetGlobalVars("Mod");

	var Startup = GetGlobalVars("Startup");
	SetMaxPlayers(Startup.MaxPlayers);

	DLog(`MaxPlayers:${Startup.MaxPlayers}`);

	// 玩家血条数组初始化
	healthBars = new Array(GetMaxPlayers()).fill(null);

	// Boxing模块初始化
	BoxingTable.init();

}


function OnScriptUnload(){


	npcs = [];

	npcHealthBars = [];

	healthBars = [];


}


// 每帧调用事件，参数为间隔时间
function OnFrameUpdate(deltaTime)
{
	let i = 0;
	// 全服玩家更新状态
	for(i=0; i<GetMaxPlayers(); i++){

		let player = Player.Find(i);

		// if(player != null && player.Character.IsSpawned){

		if(player != null){

			if(player.Character != null){

				if(healthBars == null) return;

				// 血量更新
				healthBars[player.ID].Progress = player.Entity.Health*0.01;
				var color = (player.Entity.Health > healthBarsHealthyLevel) ? 0 : 1;
				healthBars[player.ID].Color = healthBarsColor[color];

			}

		}

	}


	if(npcs == null) return;

	// 全服npc更新状态
	for(i=0; i<npcs.length; i++){

		let npc = npcs[i];

		// if(npc == null) continue;

		// 血量更新
		if(npcHealthBars == null) return;

		npcHealthBars[i].Progress = (npc.Health*0.01);
		var color = (npc.Health > healthBarsHealthyLevel) ? 0 : 1;
		npcHealthBars[i].Color = healthBarsColor[color];

	}


}




// ============================== Player Connection ================================

function OnPlayerJoin( player )
{
	// DLog("Join222 = " + player.Name);

}

function OnPlayerPart(player, reason){

	healthBars[player.ID].Remove();
	healthBars[player.ID] = null; // Help GC（也许）

}



function OnPlayerComplete( player )
{

	// 创建角色并绑定
	let chara = Character.Create(0, Vector(0, 0, 0), 0);

	player.SetEntity(chara, false);

	// 血条初始化
	/*
	healthBars[player.ID] = Billboard.Create(2);
	healthBars[player.ID].Target = player.Character;
	healthBars[player.ID].Text = player.Name;
	healthBars[player.ID].Progress = player.Entity.Health*0.01;
	healthBars[player.ID].Offset = Vector(0, 3, 0);
	var color = (player.Entity.Health > healthBarsHealthyLevel) ? 0 : 1;
	healthBars[player.ID].Color = healthBarsColor[color];
	*/

	newHealthBar(false, player.Character);


	// Boxing位置指引
	// player.AddGuider(player.ID, POS.ENTRANCE1, true);
	player.AddGuider(player.ID, POS.ENTRANCE1, false);
	// indicators[player.ID] = true;


	/*
	// 每十秒检查一次玩家是否在Boxing范围内，不在则添加指示器
	player.BoxingPolyTimer = Timer.Create(()=>{
		// 已存在是return
		// if(indicators[player.ID]) return;

		if(!InPoly(player.Entity.Pos, BoxingPoly[0], BoxingPoly[1], BoxingPoly[2], BoxingPoly[3], BoxingPoly[4])){
			player.AddGuider(player.ID, POS.ENTRANCE1, false);
			indicators[player.ID] = true;
		}
		else{
			if(player.ExistGuider(player.ID)){
				player.RemoveGuider(player.ID);
				indicators[player.ID] = false;
			}
		}
	}, 5, 0);

	*/

	player.Message("指令：/score 可查看当前分数");
	
	return;
}



// ======================= Entity =====================

function OnPlayerEntityLogin( player, entity )
{
	// DLog("S1," + entity.ID);
	// player.Message("Ur Entity Logined!");
}

function OnPlayerEntityLogout( player, entity )
{
	// DLog("S2," + entity.ID);

}



// ======================= Character =====================


function OnCharacterDamaged(character, damage, from, type, isImmunity)
{

	// DLog(`Damage: ${damage}`);

}

function OnCharacterSpawn( character )
{
	let data = {"key":"HealthVignette", "value":0};
	// Send Stream
	let plr = character.Owner;
	if(plr != null){
		plr.SendData(0, JSON.stringify(data));
	}
}

// 角色死亡时事件
function OnCharacterDeath( character, reason )
{}

// 角色击杀时事件，killer为击杀者，character为被击杀者
function OnCharacterKill( killer, character, reason )
{}


// 角色健康值改变时事件
function OnCharacterHealthChange( character, oldHealth, newHealth )
{
	if(newHealth < oldHealth){
		let damage = oldHealth - newHealth;
		// 伤害提示
		Billboard.CreateTips(`血量-${damage}`, character.Pos, 1, 1, false, false);
	}

	// 变为不健康
	if( oldHealth >= healthBarsHealthyLevel && newHealth < healthBarsHealthyLevel ){
		let data = {"key":"HealthVignette", "value":100-newHealth};
		// Send Stream
		let plr = character.Owner;
		if(plr != null){
			plr.SendData(1, JSON.stringify(data));
		}
	}
	// 变为健康
	else if( oldHealth < healthBarsHealthyLevel && newHealth >= healthBarsHealthyLevel ){
		let data = {"key":"HealthVignette", "value":0};
		// Send Stream
		let plr = character.Owner;
		if(plr != null){
			plr.SendData(0, JSON.stringify(data));
		}
	}

}


// ============================== Commands （指令）================================

// Commands
var commands = {};
commands.helpString = [];

// help
commands.help = function(player, arg){
	var s = "";

	// for(var i=0; i<commands.helpString.length; i++) DLog(commands.helpString[i]);

	// Message(`Cmds length: ${commands.helpString.length}`);

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

// cmds
commands.cmds = commands.help;
commands.helpString.push("/cmds");

// commands
commands.commands = commands.help;
commands.helpString.push("/commands");

// exec
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



// kill
commands.kill = function(player, arg){
	player.Entity.Kill();
}

commands.helpString.push("/kill");

// skin
commands.skin = function(player, arg){

	if(arg == null || arg == "" || !IsNum(arg)) return player.Message("指令需要合法的参数！");

	player.Entity.Skin = parseInt(arg);
	player.Message("更换Skin：" + arg);

}

commands.helpString.push("/skin");

// respawn
commands.respawn = function(player, arg){
	player.Entity.Respawn();
}

commands.helpString.push("/respawn");

// newnpc
commands.newnpc = function(player, arg){

	npcs.push(Character.Create(0, player.Entity.Pos, player.Entity.Angle));
	player.Message(`npcs.length: ${npcs.length}`);

	npcs[npcs.length-1].AITarget = player.Entity;

	// SetName
	npcs[npcs.length-1].Name = (arg == null) ? "NPC"+npcs.length-1 : arg+"";

	if(!npcs[npcs.length-1].IsSpawned) npcs[npcs.length-1].Spawn();

	newHealthBar(true, npcs[npcs.length-1]);
	
}

commands.helpString.push("/newnpc");


// setnpc
commands.setnpc = function(player, arg){

	if(arg == null || arg == "" || !IsNum(arg)) return player.Message("指令需要合法的参数！");

	let n = parseInt(arg);
	if(n<0 || n>=npcs.length) return player.Message(`0~${npcs.length-1}`);

	// [0,3]内，循环+1
	npcs[n].AIState = (npcs[n].AIState+1)%4;

	if(!npcs[n].IsSpawned) Timer.Create( ()=> {npcs[npcs.length-1].Spawn();} ,2);

	return player.Message(`npc[${arg}].State: ${npcs[n].AIState}`);
}

commands.helpString.push("/setnpc");

// new Pickup
commands.newpickup = function(player, arg){

	if(arg == null || arg == "") return player.Message("指令需要合法的参数！");

	let args = arg.split(" ");
	if(args.length < 2) return player.Message("指令需要足够的参数！");

	// if(args[0]!="-1"&&!IsNum(args[0]) || !IsNum(args[1])) return player.Message("指令需要合法的参数(Num)！");

	let pType = (args[0] == "-1") ? -1 : parseInt(args[0]);

	Message(`args[0]: ${args[0]}, args[1]: ${args[1]}`);

	Pickup.Create(pType, parseInt(args[1]), player.Pos);

	Message(`Created Pickup ${args[0]}:${args[1]} at ${player.Pos}`);

	Message(`Pickup Count:${Pickup.GetCount()}`);
	
}

commands.helpString.push("/newpickup");



// goto pos
commands.topos = function(player, arg){

	if(arg == null || arg == "") return player.Message("指令需要合法的参数！");

	let args = arg.split(" ");
	if(args.length < 3) return player.Message("指令需要足够的参数！");

	 if(!args[0].startsWith("-")&&!IsNum(args[0]) 
		|| !args[1].startsWith("-")&&!IsNum(args[1]) 
		|| !args[2].startsWith("-")&&!IsNum(args[2])) return player.Message("指令需要合法的参数(Num)！");

	player.Entity.Pos = Vector(parseFloat(args[0]), parseFloat(args[1]), parseFloat(args[2]));

	Message(`Goto Pos: ${args[0]},${args[1]},${args[2]}`);
	
}

commands.helpString.push("/topos");


// get pos
commands.getpos = function(player, arg){

	player.Message(`Pos: ${player.Entity.Pos}`);
	
}

commands.helpString.push("/getpos");



// score
commands.score = function(player, arg){

	player.Subtitle(`Boxing分数: ${score[player.ID]}`);
	
}

commands.helpString.push("/score");



function OnPlayerCommand( player, cmd, arg ){

	cmd = cmd.toLowerCase() + "";

	if(!(cmd in commands)){
		Message("No Such Command! Use /help to check Commands!");
		return;
	}

	// O(1)时间复杂度的定位
	commands[cmd](player, arg);

	return;

}



// ======================= PickUp =====================

// 进入Pickup时事件
function OnPickupEntered( pickup, entity )
{}

function OnPickupExited( pickup, entity )
{
	/*
	DLog("exitp " + pickup.ID);
	DLog(entity.PickupTime);
	*/
}


// ======================= CheckPoint =====================


function OnCheckpointEntered( checkpoint, entity )
{
	DLog("entercc " + checkpoint.ID);

	return;
}

function OnCheckpointExited( checkpoint, entity )
{
	/*
	DLog("exitcc " + checkpoint.ID);
	DLog(entity.CheckpointTime);
	*/
}


// ======================= Vehicle =====================

function OnCharacterEnterVehicle( character, vehicle, seat )
{
	// DLog("SERVER OnCharacterEnterVehicle," + vehicle.ID);
	
	return;

}

function OnCharacterExitVehicle( character, vehicle, seat )
{
	// DLog("SERVER OnCharacterExitVehicle," + vehicle.ID);
}




// Find Player
function fp(id)
{
	return Player.Find(id);
}



// ======================================= 自定义区域 =========================

// Boxing模块
var BoxingTable = {
	
	// ==== 数据区 ====
	// 变量区
	npcIndex: -1,

	plrIndex: -1,

	score: null,

	// 入口pickup
	entrance: null,

	// 玩家Boxing指示器，记录是否存在指示器
	indicators: null,


	// 存放：事件监听器实例哈希值，deinit中用
	listeners: [],
	
	// 常量区
	NONE_INDEX: -1,
	SPAWN_DELAY_SECONDS: 2,
	MAX_HEALTH: 100,
	
	OUTLINE_TYPE: 2,

	READY_SECONDS: 3,
	COUNT_DOWN_ANNOUCNE_TYPE: 3,
	COUNT_DOWN_SCALE_SECONDS: 1,
	
	// 结束类型枚举
	END_TYPES: {
		WON: 0,
		DIED: 1,
		PART: 2,
	},
	// 分数影响
	SCORE_OFFSET: [2, -1, -2],
	// 结束消息
	END_MSG: ["胜利", "死亡", "退出"],

	AI_READY_STATE: 2,
	// 对应AIState，暂时如此简易，之后再智能点
	DIFFICULTY: 3,

	POS: {
		NPC: Vector(0.2, 0.0, 58.0),
		PLAYER: Vector(7.4, 0.0, 50.5),
		EXIT: Vector(3.8, 0, 38.9),
		ENTRANCE1: Vector(4, 0, 47),
		ENTRANCE2: Vector(4, 0, 67),
	},

	PICKUP: {
		TYPS: 0,
		MODEL: 3118,
	},


	// 暂存，Boxing皮肤集
	SKINS: [90, 35, 104, 16];

	POLY: [
		Vector(22.9, 0.0, 41.1)
		,
		Vector(-17.3, 0.0, 39.5)
		,
		Vector(-30.6, 0.0, 85.5)
		,
		Vector(2.0, 0.0, 107.1)
		,
		Vector(39.8, 0.0, 86.9)
	],
	
	// ==== 功能区 ====
	// npc出生
	spawnNpc: function(){
		let npc = npcs[npcIndex];
		if(npc != null){
			// 延迟出生防止出拳bug（初步怀疑出拳时死亡导致的bug）
			if(!npc.IsSpawned) Timer.Create( ()=> {
				npc.Respawn();
			}, SPAWN_DELAY_SECONDS);

			npc.Health = MAX_HEALTH;
			npc.Pos = POS.NPC;
		}
		return npc;
	}
	// 初始化玩家
	initPlayer: function(player){
		this.plrIndex = player.ID;
		player.Character.Health = this.MAX_HEALTH;
		player.Character.Pos = this.POS.PLAYER;
	},

	// 开始Boxing
	start: function(player){

		// 设置
		// npc血量、位置
		let npc = this.spawnNpc();

		// 玩家血量、位置
		this.initPlayer(player);
		
		// 发送给客户端数据
		let data = {"key":"BoxingVAngle", "value":1};
		// Send Stream to Change Camera
		player.SendData(1, JSON.stringify(data));

		// npc绑定对手
		npc.AITarget = player.Character;
		npc.AIState = this.AI_READY_STATE;

		// 设置描边
		npc.OutlineTargetTo(player, OUTLINE_TYPE);

		// 通知
		Announce(`${player.Name} 开启 npc Boxing挑战！`);

		// 相关信息提示
		let score = this.score[player.ID];
		player.Subtitle(`当前分数：${score}`);

		// 倒计时
		Timer.Create( () => {
			this.countDown(this.READY_SECONDS, player.ID)
		}, 1);
		Timer.Create( ()=> {
			this.npcs[this.npcIndex].AIState = this.DIFFICULTY;
			Player.Find(plrIndex).Entity.Frozen = false;
		}, (this.READY_SECONDS+1));

		// 暂时冻结玩家
		player.Entity.Frozen = true;

		// 关闭入口
		this.setPickup(false);

	},

	// to player，倒计时函数
	countDown: function(sec, playerID){

		this.timerAnnouncePlayer(sec+"", COUNT_DOWN_ANNOUCNE_TYPE, playerID);

		sec--;

		// 后续处理
		if(sec > 0){
			Timer.Create(() => this.countDown(sec, playerID), COUNT_DOWN_SCALE_SECONDS);
		}
		else if(sec == 0) {
			// 清空
			Timer.Create(() => this.timerAnnouncePlayer("", COUNT_DOWN_ANNOUCNE_TYPE, playerID), COUNT_DOWN_SCALE_SECONDS);
		}


	},

	// 用于定时器给玩家发送消息
	timerMessagePlayer: function(msg, playerID){

		let plr = Player.Find(playerID);
		if(plr == null) return;

		plr.Message(msg);

	}

	// 用于定时器给玩家发送公告
	timerAnnouncePlayer: function(msg, type, playerID){

		let plr = Player.Find(playerID);
		if(plr == null) return;

		plr.Announce(msg, type);

	}

	// 结束Boxing
	end: function(type){

		// 未开启时return
		if(this.plrIndex == this.NONE_INDEX) return;

		// 分数影响
		this.score[this.plrIndex] += this.SCORE_OFFSET[type];

		// 历史写法，可拓展
		// 玩家胜利：击败npc
		if(type == this.END_TYPES.WON){
			// 获胜+2分
			// score[plrIndex]+=2;
		}
		// 玩家失败：玩家死亡
		else if(type == this.END_TYPES.DIED){
			// 失败扣1分
			// score[plrIndex]--;
		}
		// 玩家失败：玩家退出
		else if(type == this.END_TYPES.PART){
			// 无操作
		}


		let plr = Player.Find(this.plrIndex);
		// 通知
		// 设置boxing玩家
		// 玩家血量、位置
		if(plr != null){
			Announce(`${plr.Name} vs NPC : ${this.END_MSG[type]}！`);
			plr.Character.Pos = this.POS.EXIT;

			// 延迟复活，以避免无法出拳的bug
			if(!plr.Character.IsSpawned){
				Timer.Create( ()=> { plr.Character.Respawn(); }, this.SPAWN_DELAY_SECONDS);
				Message(`将在${this.SPAWN_DELAY_SECONDS}秒后复活...`);
			}
			plr.Character.Health = this.MAX_HEALTH;

			// 相关信息提示
			plr.Subtitle(`当前分数：${score[plr.ID]}`);

			let data = {"key":"BoxingVAngle", "value":0};
			// Send Stream to Change Camera
			plr.SendData(0, JSON.stringify(data));

		}
		else{
			Announce(`玩家${plrIndex} vs NPC : ${this.END_MSG[type]}`);
		}

		// 重置挑战玩家ID，同时标志跳转结束
		this.plrIndex = this.NONE_INDEX;

		// 设置
		// npc血量、位置、攻击状态
		let npc = npcs[this.npcIndex];
		if(npc != null){
			// 延迟复活，以避免无法出拳的bug
			if(!npc.IsSpawned) Timer.Create( ()=> {npc.Respawn();}, this.SPAWN_DELAY_SECONDS);
			npc.Health = this.MAX_HEALTH;
			npc.Pos = this.POS.NPC;

			// npc取消绑定对手
			npc.AITarget = null;
			npc.AIState = this.NONE_INDEX;

			// 设置描边
			npc.OutlineTargetOutAll();
		}

		// 开启挑战入口
		setPickup(true);

	},

	// 设置挑战入口（Pickup）开关
	setPickup: function(toggle){

		// 开启入口
		if(toggle){

			this.entrance = Pickup.Create(PICKUP.TYPE, PICKUP.MODEL, POS.ENTRANCE1);
			Message("Boxing Entrance Re-Opened! 欢迎挑战！");

		}

		// 删除入口
		else{

			this.entrance.Remove();
			this.entrance = null; // Help GC（也许）
			Message(`Boxing Entrance Closed! 暂时关闭挑战！`);

		}

	},
	
	
	// 初始化
	init: function(){
		// 玩家Boxing指示器初始化
		this.indicators = new Array(GetMaxPlayers()).fill(false);

		// Boxing NPC创建
		let npc = Character.Create(0, POS.NPC, 0);
		npc.Name = "Boxing_NPC"
		npc.AIState = AI_READY_STATE;
		npcs.push(npc);
		this.npcIndex = npcs.length-1;

		// NPC新增血条
		newHealthBar(true, npcs[npcs.length-1]);

		// Boxing 分数初始化
		this.score = new Array(GetMaxPlayers()).fill(0);

		// Boxing Entrance Open
		this.setPickup(true);
		
		// 遍历事件实现
		for(let eventName in this.events){
			// 注册事件监听：事件名，事件实现
			let listener = AddListener(eventName, this.events[eventName]);
			// 加入容器
			this.listeners.push(listener);
		}
	},

	// 反向初始化-模块关闭用
	deinit: function(){
		// 取消事件监听
		for(let i=0; i<this.listeners.length; i++){
			RemoveListener(this.listeners[i]);
		}
		
		this.indicators = null;
		// 不推荐，因为血条删除麻烦，数组移除会带来现存npcId移位
		// npcs.remove[this.npcIndex];
		
		this.score = null;
		this.setPickup(false);
	},
	
	// ==== 事件区 ====
	events: {
		// 进入拾取物
		OnPickupEntered: function( pickup, entity ){
			if( pickup.ID == BoxingTable.entrance.ID ){
				BoxingTable.start(entity.Owner);
			}
		},
		// 角色击杀
		OnCharacterKill: function( killer, character, reason ){
			if( character == npcs[BoxingTable.npcIndex] ){
				BoxingTable.end(BoxingTable.END_TYPES.WON);
			}
		},
		// 角色死亡
		OnCharacterDeath: function( character, reason ){
			let plr = character.Owner;
			if( plr != null && plr.ID == BoxingTable.plrIndex ){
				BoxingTable.end(BoxingTable.END_TYPES.DIED);
			}
		},
		// 玩家断线
		OnPlayerPart: function(player, reason){

			if(player.ID == BoxingTable.plrIndex){
				BoxingTable.end(BoxingTable.END_TYPES.PART);
			}

			// 玩家Boxing指示器处理
			this.indicators[player.ID] = null;
			if(BoxingPolyTimer in player){
				player.BoxingPolyTimer.Remove();
				player.BoxingPolyTimer = null;
				delete player.BoxingPolyTimer;
			}

		},
		// 玩家进入
		OnPlayerJoin: function( player ){
			// 初始化Boxing分数
			this.score[player.ID] = 0;
		}
		
	},
	
	
};









