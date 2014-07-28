#pragma strict
var resolution : Vector2;
var size : Sizes;

var level : String;
var levelName : String;
var levelIndex : int;

var square : Squares[] = new Squares[256];

var nbFunctions : int = 1;
var function_ : Functions[] = new Functions[5];

var selectedAction : Actions;
var color : Colors[] = new Colors[4];
var starOrArrowTexture : Texture2D[] = new Texture2D[6];
var commandTexture : Texture2D[] = new Texture2D[12];
var command : Commands[] = new Commands[12];
var nbCommands : int;

var controlTexture : Texture2D[];
var colorStyle : GUIStyle[];
var otherStyle : GUIStyle[];
var otherTexture : Texture2D[];
var background : Texture2D;

@HideInInspector
var arrowDirection : int = 2;
@HideInInspector
var levelLoaded : boolean = false;

var message : String;

//@HideInInspector
var speedX1 : float = 0.3;
var speedX2 : float = 0.15;
var speedX3 : float = 0.1;

var delay : float;
var timeElapsed : float = 0; 

private var x1Toggle : boolean = true;
private var x2Toggle : boolean = false;
private var x3Toggle : boolean = false;

@HideInInspector
var messageTime : float = 0;
@HideInInspector
var nbStars : int = -1;
//@HideInInspector
var actionToExecute : Actions[] = new Actions[1000];
@HideInInspector
var arrow : Arrow;
@HideInInspector
var arrowSquare : Squares;
@HideInInspector
var actionToDisplay : int = 0;
@HideInInspector
var actualAction : Actions;
@HideInInspector
var isPlaying : boolean = false;
@HideInInspector
var isPaused : boolean = false;
@HideInInspector
var win : boolean = false;
@HideInInspector
var dead : boolean = false;

var needHelp : boolean = false;
var settingToggle : boolean = false;

var isTesting : boolean = false;


function Awake ()
{
	resolution = Vector2(Screen.width, Screen.height);
	
	size.SetSizes();
	
	SetFontSizes();
	
	
	SetSquaresIndex();
	
	SetSquaresPosition();
	
	//if (PlayerPrefs.HasKey("LevelIndex")) {
		levelIndex = parseInt( PlayerPrefs.GetString("levelIndex") );
		level = PlayerPrefs.GetString("level" + levelIndex);
		Load( level );
	//}
	
	//level = (level.Split("#"[0]))[1];

	if ( levelIndex == 0 )
	{
		isTesting = true;
	}
	else isTesting = false;
	
	var levelMenu_script : LevelMenu;
	levelMenu_script = gameObject.GetComponent(LevelMenu);	
	
	delay = speedX1;
}

function Update ()
{
	//Set resolutionS
	if ( Vector2(Screen.width, Screen.height) != resolution )
	{
		resolution = Vector2(Screen.width, Screen.height);
		size.SetSizes();
		SetFontSizes();
	}
	
	if (levelLoaded)
	{
		CheckForArrowSquare();
		
		if ( CheckForStars() == 0 ) //All stars are picked -> WIN
		{
			isPaused = true;
			Pause();

			if (!isTesting)
				SetMessage("You Win !", 1);
			win = true;
		}
		
		if ( square[ arrow.index ].color == 0 )  //Player is on a grey square -> GAMEOVER
		{
			//Stop();
			Pause();
			dead = true;
			SetMessage("You Died !", 1);
		}
			
		if (isPlaying)
		{
			timeElapsed += Time.deltaTime;
		}
		
		if (timeElapsed >= delay)
		{
			timeElapsed = 0;
			ReadAction();
		}
	}
	
}


function OnGUI ()
{
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), background);
	
	DrawGrid();

	DrawControls();
	
	DrawCommands();
	
	DrawColors();
	
	DrawFunctions();
	
	
	if (message)
	{
		GUI.Label(Rect( (size.bigMargin + size.grid + size.mediumMargin), Screen.height - size.smallButton, size.screenWidth - (size.bigMargin + size.grid + size.mediumMargin) - (size.smallButton*3 + size.smallMargin*3 + size.mediumMargin), size.smallButton), message, otherStyle[0]);
	}

	
	if (win && !isTesting)
	{
		if ( GUI.Button(Rect( Screen.width - (size.smallButton*3 + size.smallMargin*2 + size.mediumMargin), Screen.height - size.smallButton, size.smallButton, size.smallButton), GUIContent(otherTexture[1], "Continue"), otherStyle[0]) )
		{
			levelIndex += 1;
			level = PlayerPrefs.GetString( "level" + levelIndex );
			if (!level)
			{
				Debug.Log("no more level");
				levelIndex -= 1;
				level = PlayerPrefs.GetString( "level" + levelIndex );
			}
			else
			{
				var oldValue = PlayerPrefs.GetInt("levelsUnlocked");
				if (levelIndex > oldValue) PlayerPrefs.SetInt("levelsUnlocked", levelIndex);
				
				CleanFunctions();
				Load(level);
			}
		}
	}
	
	if (dead)
	{
		if ( GUI.Button(Rect( Screen.width - (size.smallButton*3 + size.smallMargin*2 + size.mediumMargin), Screen.height - size.smallButton, size.smallButton, size.smallButton), GUIContent(otherTexture[3], "Replay"), otherStyle[0]) )
		{
			Stop();
		}
	}
	
	
	settingToggle = GUI.Toggle(Rect(Screen.width - (size.smallButton + size.mediumMargin), Screen.height - size.smallButton, size.smallButton, size.smallButton), settingToggle, GUIContent(otherTexture[4], "Settings"), otherStyle[0]);
	
	if (settingToggle)
	{
		if ( GUI.Button(Rect(Screen.width - (size.smallButton + size.mediumMargin), Screen.height - (size.smallButton*2 + size.bigOffset), size.smallButton, size.smallButton), GUIContent(otherTexture[0], "Menu"), otherStyle[0]) ) Application.LoadLevel("Menu");
		
		needHelp = GUI.Toggle(Rect(Screen.width - (size.smallButton + size.mediumMargin), Screen.height - (size.smallButton*3 + size.bigOffset*2), size.smallButton, size.smallButton), needHelp, GUIContent(otherTexture[5], "Help"), otherStyle[0]);
	
	}
	
	if (isTesting)
	{
		if ( GUI.Button(Rect(Screen.width - (size.smallButton*2 + size.smallMargin + size.mediumMargin), Screen.height - size.smallButton, size.smallButton, size.smallButton), GUIContent(otherTexture[2], "Edit"), otherStyle[0]) ) Application.LoadLevel( "Editor" );
	
		if (win)
		{
			//GUI.TextField(Rect(size.bigMargin, Screen.height - 25, size.grid, 20), level);

			SetMessage("Save level to the Web ->", 1);
			if ( !isRequesting && GUI.Button(Rect( Screen.width - (size.smallButton*3 + size.smallMargin*2 + size.mediumMargin), Screen.height - size.smallButton, size.smallButton, size.smallButton), GUIContent(otherTexture[6], "Save"), otherStyle[0]) )
				SendRequest();
		}
		else
			GUI.Label(Rect(size.bigMargin, Screen.height - size.mediumMargin, size.square*7.5, size.mediumMargin), "Testing: " + levelName, otherStyle[1]); //levelName area
	}
	else GUI.Label(Rect(size.bigMargin, Screen.height - size.mediumMargin, size.square*7.5, size.mediumMargin), levelName, otherStyle[1]); //levelName area
	
	
	if (GUI.tooltip && needHelp)
	{
		GUI.Label(Rect(Input.mousePosition.x - (GUI.tooltip.Length*15)/2, Screen.height - Input.mousePosition.y - size.square*3/4, GUI.tooltip.Length*15, size.square/1.6), "" + GUI.tooltip, otherStyle[3]);
	}

}

var messagePriority : int;

function SetMessage(newMessage : String, priority : int) {
	if (newMessage != message && priority >= messagePriority) {
		message = newMessage;
		messagePriority = priority;
	}
}

var isRequesting : boolean = false;

private var url = "http://www.ycribier.com/challenge42/db/42SaveLevel.php"; 

function SendRequest ()
{
	isRequesting = true;

	SetMessage("Saving level ...", 2);
	
	var request : WWW = new WWW( url + "?levelName=" + WWW.EscapeURL(levelName) + "&stringKey=" + WWW.EscapeURL(level) + "&author=" + WWW.EscapeURL("anonymous") );
	//var request : WWW = new WWW( url + "?levelName=" + levelName + "&stringKey=" + level + "&author=" + "anonymous" );
	
	yield request;
	
	if (request.error)
	{
        Debug.Log("There was an error: " + request.error);
    }
	else
	{
		var result = request.text;

		switch (result) {
			case "GOOD":
				Debug.Log("GOOD");
				SetMessage("Level Saved !", 2);
				yield WaitForSeconds(1);
				Application.LoadLevel("Menu");
				break;
			case "NAMEX":
				Debug.Log("Name already exists!");
				SetMessage("Name already exists!", 2);
				break;
		}
	}

	//Debug.Log(" Query: " + request.url);

	isRequesting = false;
}

//////////////////////////////////
//			METHODS				//
//////////////////////////////////

function DrawGrid ()
{
	var k : int = 0;
	
	GUI.BeginGroup(Rect(size.bigMargin, size.mediumMargin*2 + size.smallButton, size.grid, size.grid));
	
	for(var j : int = 0; j < 16; j++)
	{
		for(var i : int = 0; i < 16; i++)
		{
			GUI.Label(Rect(i*size.square, j*size.square, size.square, size.square), starOrArrowTexture[square[k].starOrArrow], colorStyle[square[k].color]);
			
			k++;
		}
	}
	
	GUI.EndGroup();
}

function DrawControls ()
{
	var controlButtonSize : int = size.smallButton;
	var controlButtonOffset : int = size.bigOffset;
	
	var groupMargin : Vector2 = Vector2(size.mediumMargin, size.mediumMargin);
	
	
	//Controls
	GUI.BeginGroup(Rect(groupMargin.x, groupMargin.y, (controlButtonSize*5 + controlButtonOffset*4), controlButtonSize));
	
	var tempPlayToggle : boolean = GUI.Toggle(Rect(0, 0, controlButtonSize, controlButtonSize), isPlaying, GUIContent(controlTexture[0], "Play"), otherStyle[0]);
	
	if (tempPlayToggle != isPlaying) 
	{
		if (tempPlayToggle == true)
		{
			//If Play is pressed (Toggle is enabled) :   				
			Play();
		}
 		else
 		{
			//(Toggle is disabled) :
			tempPlayToggle = true; //Force Toggle to stay true - Only Pause or Stop can turn it false;
  			
 		}
 		isPlaying = tempPlayToggle;
	}
		
	//if ( GUI.Button(Rect(43, 0, 40, 40), controlTexture[1], otherStyle[0]) && !isPaused ) Pause(); //Pause
	
	var tempPauseToggle : boolean = GUI.Toggle(Rect( (controlButtonSize + controlButtonOffset), 0, controlButtonSize, controlButtonSize), isPaused, GUIContent(controlTexture[1], "Pause"), otherStyle[0]);
	
	if (tempPauseToggle != isPaused) 
	{
		if (tempPauseToggle == true)
		{
			//If Play is pressed (Toggle is enabled) :   				
			if (isPlaying) Pause();
			else tempPauseToggle = false;
		}
 		else
 		{
			//(Toggle is disabled) :
			tempPauseToggle = true; //Force Toggle to stay true - Only Play can turn it false;
  			
 		}
 		isPaused = tempPauseToggle;
	}
	
	if ( GUI.Button(Rect( (controlButtonSize + controlButtonOffset)*2, 0, controlButtonSize, controlButtonSize), GUIContent(controlTexture[2], "Next Action"), otherStyle[0]) && !dead && !win) //NextAction
	{
		if (!isPaused && !isPlaying) InitExecutionArea(); //Set ExecutionArea with F1 Actions
		
		if (!isPaused) Pause();
		
		NextAction();
	}
	
	if ( GUI.Button(Rect( (controlButtonSize + controlButtonOffset)*3, 0, controlButtonSize, controlButtonSize), GUIContent(controlTexture[3], "Stop"), otherStyle[0]) ) Stop();
		
	if ( GUI.Button(Rect( (controlButtonSize + controlButtonOffset)*4, 0, controlButtonSize, controlButtonSize), GUIContent(controlTexture[4], "Clean All"), otherStyle[0]) ) CleanFunctions(); //CleanFunctions
	
	GUI.EndGroup();
	
	
	
	
	
	//Execution Area
	GUI.BeginGroup(Rect( groupMargin.x + (controlButtonSize*5 + controlButtonOffset*4) + size.smallMargin, groupMargin.y, Screen.width - ( (groupMargin.x + (controlButtonSize*5 + controlButtonOffset*4) + 10) + (10 + (controlButtonSize*3 + controlButtonOffset*2) + groupMargin.x) ), controlButtonSize));
	
	for(var i : int = 0; i < actionToDisplay; i++)
	{
		GUI.Label(Rect( (controlButtonSize + controlButtonOffset)*i, 0, controlButtonSize, controlButtonSize), commandTexture[ actionToExecute[i].command ], colorStyle[ actionToExecute[i].color ]);
	}
	
	GUI.EndGroup();	
	
	
	
	
	//SpeedControls
	GUI.BeginGroup(Rect(Screen.width - (controlButtonSize*3 + controlButtonOffset*2) - groupMargin.x, groupMargin.y, (controlButtonSize*3 + controlButtonOffset*2), controlButtonSize));
	
		
	var tempX1Toggle : boolean = GUI.Toggle(Rect(0, 0, controlButtonSize, controlButtonSize), x1Toggle, GUIContent(controlTexture[5], "Speed"), otherStyle[0]);
	
	if (tempX1Toggle != x1Toggle) 
	{
		if (tempX1Toggle == true)
		{
			//If X1 is pressed (Toggle is enabled) :   				
			x2Toggle = false;
			x3Toggle = false;
			delay = speedX1;
		}
 		else
 		{
			//(Toggle is disabled) :
  			tempX1Toggle = true;
 		}
 		x1Toggle = tempX1Toggle;
	}
	
	
	var tempX2Toggle : boolean = GUI.Toggle(Rect( (controlButtonSize + controlButtonOffset), 0, controlButtonSize, controlButtonSize), x2Toggle, controlTexture[6], otherStyle[0]);
	
	if (tempX2Toggle != x2Toggle) 
	{
		if (tempX2Toggle == true)
		{
			//If X1 is pressed (Toggle is enabled) :   				
			x1Toggle = false;
			x3Toggle = false;
			delay = speedX2;
		}
 		else
 		{
			//(Toggle is disabled) :
  			tempX2Toggle = true;
 		}
 		x2Toggle = tempX2Toggle;
	}
	
	
	var tempX3Toggle : boolean = GUI.Toggle(Rect( (controlButtonSize + controlButtonOffset)*2, 0, controlButtonSize, controlButtonSize), x3Toggle, controlTexture[7], otherStyle[0]);
	
	if (tempX3Toggle != x3Toggle) 
	{
		if (tempX3Toggle == true)
		{
			//If X1 is pressed (Toggle is enabled) :   				
			x1Toggle = false;
			x2Toggle = false;
			delay = speedX3;
		}
 		else
 		{
			//(Toggle is disabled) :
  			tempX3Toggle = true;
 		}
 		x3Toggle = tempX3Toggle;
	}	
		
	
	GUI.EndGroup();
}




function DrawCommands ()
{
	var commandButtonSize : int = size.bigButton;
	var commandButtonOffset : int = size.mediumOffset;
	
	GUI.Label(Rect( (size.bigMargin + size.grid + size.mediumMargin), size.screenHeight*0.112, size.screenWidth - (size.bigMargin + size.grid + size.mediumMargin) - size.bigMargin, size.square), "Commands", otherStyle[4]);
	
	GUI.BeginGroup(Rect( (size.bigMargin*2 + size.grid), size.screenHeight*0.2, (commandButtonSize*11 + commandButtonOffset*10), commandButtonSize));
	
	var k : int = 1;
	
	nbCommands = 6 + nbFunctions;
	
	for(var j : int = 0; j < nbCommands; j++)
	{	
		if (!command[k].isDesactivated)
		{				
			if (isPlaying || isPaused)
			{
				GUI.Label(Rect( (commandButtonSize + commandButtonOffset)*j, 0, commandButtonSize, commandButtonSize), GUIContent(commandTexture[k], "" + commandTexture[k].name), colorStyle[0]);
			}
			else
			{		
				var tempCommandToggle : boolean = GUI.Toggle(Rect( (commandButtonSize + commandButtonOffset)*j, 0, commandButtonSize, commandButtonSize), command[k].isSelected, GUIContent(commandTexture[k], "" + commandTexture[k].name), colorStyle[0]);
				
				if (tempCommandToggle != command[k].isSelected) 
				{
					if (tempCommandToggle == true)
					{
		   				//When a Command isSelected (Toggle is enabled) :   				
		   				CleanCommandToggle();
	       				
	       				if (selectedAction.isSelected)
	       				{
	       					selectedAction.command = k;
	       				}
	       				else tempCommandToggle = false;
		   			}
			 		else
			 		{
		   				//When none Command isSelected (Toggle is disabled) :
		      			if (selectedAction.isSelected)
	       				{
	       					selectedAction.command = 0;
	       				} 	
			 		}
			 		command[k].isSelected = tempCommandToggle;
				}
			}	
		}
		k++;
	}
		
	GUI.EndGroup();	
}



function DrawColors ()
{
	var colorButtonSize : int = size.bigButton;
	var colorButtonOffset : int = size.mediumOffset;
	
	
	GUI.BeginGroup(Rect( (size.bigMargin*2 + size.grid + size.mediumMargin), size.screenHeight*0.293, (colorButtonSize*3 + colorButtonOffset*2), colorButtonSize));
	
	var k : int = 1;
	var nbColors : int = 3;
	
	for(var i : int = 0; i < nbColors; i++)
	{
		if (isPlaying || isPaused)
		{
			GUI.Label(Rect( (colorButtonSize + colorButtonOffset)*i, 0, colorButtonSize, colorButtonSize), GUIContent("", "" + colorStyle[k].name), colorStyle[k]);
		}
		else
		{
			var tempColorToggle : boolean = GUI.Toggle(Rect(i*(colorButtonSize + colorButtonOffset), 0, colorButtonSize, colorButtonSize), color[k].isSelected, GUIContent("", "" + colorStyle[k].name), colorStyle[k]);
					
			if (tempColorToggle != color[k].isSelected) 
			{
				if (tempColorToggle == true)
				{
	   				//When a Color isSelected (Toggle is enabled) :   				
	   				CleanColorToggle();	
		   				
	   				if (selectedAction.isSelected)
	   				{
	   					selectedAction.color = k;
	   				}
	   				else tempColorToggle = false;
		   			
	   			}
		 		else
		 		{
	   				//When none Color isSelected (Toggle is disabled) :
	   				if (selectedAction.isSelected)
	   				{
	   					selectedAction.color = 0;
	   				}	   				
		 		}
		 		color[k].isSelected = tempColorToggle;
			}
		}
		k++;
	}
	
		GUI.EndGroup();	
}

function DrawFunctions ()
{
	var functionButtonSize : int = size.smallButton;
	var functionButtonOffset : int = size.bigOffset;
	
	GUI.Label(Rect( (size.bigMargin + size.grid + size.mediumMargin), size.screenHeight*0.434, size.screenWidth - (size.bigMargin + size.grid + size.mediumMargin) - size.bigMargin, size.square), "Functions", otherStyle[4]);
	
	GUI.BeginGroup(Rect( (size.bigMargin*2 + size.grid), size.screenHeight*0.521, (functionButtonSize + 6) + (functionButtonSize*10 + functionButtonOffset*9), (functionButtonSize*5 + 12*4) )); //FunctionsArea
	
	for(var f : int = 0; f < nbFunctions; f++)
	{	
		var functionX : int = 0;
		var functionY : int = f*(functionButtonSize + 12);
		
		GUI.Label(Rect(functionX, functionY, functionButtonSize, functionButtonSize), "F" + (f + 1), otherStyle[0]);
		
		for(var a : int = 0; a < function_[f].nbActions; a++)
		{	
			var actionX : int = (functionButtonSize + 6) + (functionButtonSize + functionButtonOffset)*a;
			var actionY : int = f*(functionButtonSize + 12);	
			
			if (isPlaying || isPaused)
			{
				GUI.Label(Rect(actionX, actionY, functionButtonSize, functionButtonSize), commandTexture[function_[f].action[a].command], colorStyle[function_[f].action[a].color]);
			}
			else
			{			
				var tempFunctionToggle : boolean = GUI.Toggle(Rect(actionX, actionY, functionButtonSize, functionButtonSize), function_[f].action[a].isSelected, commandTexture[function_[f].action[a].command], colorStyle[function_[f].action[a].color]);
			
				if (tempFunctionToggle != function_[f].action[a].isSelected) 
				{
	    			if (tempFunctionToggle == true)
	    			{
	       				//When an Action isSelected (Toggle is enabled) :
	       				selectedAction = function_[f].action[a];
	       				
	       				CleanFunctionToggle();
										
				 		CheckForCommandAndColor();
	       			}
	   		 		else
	   		 		{
	       				//When none Action isSelected (Toggle is disabled) :
	       				selectedAction = new Actions();
	       				
	       				CleanCommandToggle();
	       				CleanColorToggle();
	       				         				
	  		 		}
	  		 		function_[f].action[a].isSelected = tempFunctionToggle;
				}
			}			
		}
	}
	
	GUI.EndGroup();
}

function CheckForCommandAndColor () //Look if the selected action has Command and/or Color associated, and if so, check "true" the Command and Color .isSelected
{	
	CleanCommandToggle();
	command[selectedAction.command].isSelected = true;
	
	CleanColorToggle();	
	color[selectedAction.color].isSelected = true; 	
}

function CleanFunctionToggle ()
{
	for(var f : int = 0; f < function_.length; f++)
	{
		for(var a : int = 0; a < function_[f].action.length; a++)
		{		
			if (function_[f].action[a].isSelected)
			{		
				function_[f].action[a].isSelected = false;
			} 
		}
	}
}

function CleanCommandToggle ()
{
	for(var c : int = 0; c < command.length; c++)
	{		
		if (command[c].isSelected)
		{		
			command[c].isSelected = false;
		} 
	}
}

function CleanColorToggle ()
{
	for(var c : int = 0; c < color.length; c++)
	{		
		if (color[c].isSelected)
		{		
			color[c].isSelected = false;
		} 
	}
}

function SetSquaresIndex ()
{
	var k : int = 0;
	
	for(var sq : Squares in square)
	{
		sq.index += k;
		k++;
	}
}

function SetSquaresPosition ()
{
	var k : int = 0;
	
	for(var j : int = 0; j < 16; j++)
	{
		for(var i : int = 0; i < 16; i++)
		{
			square[k].position = Vector3(i,j,0);
			k++;
		}
	}
}

	
	
function Load (_level : String)
{		
	ResetGrid();
	
	var error : boolean = false;
	var errorMessage : String = null;
	
	var sqArray : String[]; 
	var sqProp : String[];
	var tempSqIndex : int[];
	var tempSqColor : int[];
	var tempSqStarOrArrow : int[];
	
	
	var nbActions : String[];
	var tempNbFunctions : int;
	var tempNbActions : int[];
	
	
	var cmds : String[];
	var tempCommandIndex : int[];
	
	
	var ar : String[];
	var tempArrowIndex : int;
	var tempArrowDirection : int;
	
	//PRE LOADING -> Check for errors in file
	if (!_level.Contains("#")) errorMessage = "File incorrect : there is no #";
	else
	{
		//Get level ID
		var zeroSplit = _level.Split("#"[0]);
		
		if (!_level.Contains("S")) errorMessage = "File incorrect : there is no S";
		else
		{
			//PreLoad Squares
			var firstSplit = zeroSplit[1].Split("S"[0]);
					
			sqArray = firstSplit[0].Split("/"[0]);
			
			tempSqIndex = new int[sqArray.length -1];
			tempSqColor = new int[sqArray.length -1];
			tempSqStarOrArrow = new int[sqArray.length -1];
				
			for(var i : int = 0; i < sqArray.length -1; i++)
			{
				sqProp = sqArray[i].Split(","[0]);
				//Debug.Log( "" + sqProp[0] + " " + sqProp[1] + " " + sqProp[2] + "" );
	
				if ( !sqProp[0] ) errorMessage = "SquareIndex value : " + i + " is missing";
				else
				{
					tempSqIndex[i] = parseInt( sqProp[0] );
					
					if (tempSqIndex[i] < 0 || tempSqIndex[i] > 255) errorMessage = "File incorrect : some sqIndex values are not valids";
				}
				
				if ( !sqProp[1] ) errorMessage = "SquareColor value : " + i + " is missing";
				else
				{
					tempSqColor[i] = parseInt( sqProp[1] );
					
					if (tempSqColor[i] < 1 || tempSqColor[i] > 3) errorMessage = "File incorrect : some sqColor values are not valids";
				}
				
				if ( !sqProp[2] ) errorMessage = "SquareStarOrArrow value : " + i + " is missing";
				else
				{
					tempSqStarOrArrow[i] = parseInt( sqProp[2] );
					
					if (tempSqStarOrArrow[i] < 0 || tempSqStarOrArrow[i] > 5) errorMessage = "File incorrect : some sqCommand values are not valids";
				}
			}
			
			if (!_level.Contains("F")) errorMessage = "File incorrect : there is no F";
			else
			{
				//PreLoad Functions+Actions
				var secondSplit = firstSplit[1].Split("F"[0]);
				
				nbActions = secondSplit[0].Split(","[0]);
				
				tempNbFunctions = nbActions.Length -1;
				
				tempNbActions = new int[tempNbFunctions];
				
				if (tempNbFunctions < 1 || tempNbFunctions > 6) errorMessage = "File incorrect : nbFunctions value is not valid"; 
				else
				{
					for(var j : int = 0; j < tempNbFunctions; j++)
					{						
						tempNbActions[j] = parseInt( nbActions[j] );
						
						if (tempNbActions[j] < 1 || tempNbActions[j] > 10) errorMessage = "File incorrect : some nbActions values are not valids";
					}
				}
								
				if (!_level.Contains("C")) errorMessage = "File incorrect : there is no C";
				else
				{	
					//PreLoad Available Commands
					var thirdSplit = secondSplit[1].Split("C"[0]);
					
					cmds = thirdSplit[0].Split(","[0]);				
					
					tempCommandIndex = new int[cmds.Length - 1];
					
					for(var k : int = 0; k < cmds.Length -1; k++) //Activate the ones
					{
						tempCommandIndex[k] = parseInt(cmds[k]);
						
						if (tempCommandIndex[k] < 1 || tempCommandIndex[k] > 12) errorMessage = "File incorrect : some CommandIndex values are not valids";
					}
				
					if (!_level.Contains("A")) Debug.Log("File incorrect : there is no A");
					else
					{
						//PreLoad Arrow Infos
						var fourthSplit = thirdSplit[1].Split("A"[0]);
						
						ar = fourthSplit[0].Split(","[0]);
						
						tempArrowIndex = parseInt( ar[0] );
						tempArrowDirection = parseInt( ar[1] );
						
						if (tempArrowIndex < 0 || tempArrowIndex > 255) errorMessage = "File incorrect : ArrowIndex value is not valid";
						
						if (tempArrowDirection < 0 || tempArrowDirection > 3) errorMessage = "File incorrect : ArrowDirection value is not valid";
									
					}		
				}	
			}
		}	 
	}
	
	
	//If no errors in File -> Load Level
	if (errorMessage)
	{
		levelLoaded = false;
		Debug.Log(errorMessage);
	}
	else
	{
		//Load Level ID
		levelName = zeroSplit[0];
		
		//Load Squares
		for(var s : int = 0; s < sqArray.length -1; s++)
		{
			square[ tempSqIndex[s] ].color = tempSqColor[s];
			square[ tempSqIndex[s] ].starOrArrow = tempSqStarOrArrow[s];
		}
		
		//Load Functions+Actions
		nbFunctions = tempNbFunctions;
		
		for(var f : int = 0; f < tempNbFunctions; f++)
		{
			function_[f].nbActions = tempNbActions[f];
		}
		
		//Load Commands
		for(var cmd : Commands in command) //Desactivate ALL
		{
			cmd.isDesactivated = true;
		}
		
		for(var c : int = 0; c < cmds.Length -1; c++) //Activate the ones
		{
			command[ tempCommandIndex[c] ].isDesactivated = false;
		}
		
		//Load Arrow Infos
		arrow.index = tempArrowIndex;
		arrow.direction = tempArrowDirection;
								
		arrowDirection = tempArrowDirection + 2;
	
	
	
		levelLoaded = true;
	}

}

function ResetGrid ()
{
	for(var sq : Squares in square)
	{
		sq.color = 0;
		sq.starOrArrow = 0;
	}	
}

function CheckForArrowSquare () 
{
	for(var sq : Squares in square)
	{
		if (sq.starOrArrow >= 2)
		{
			arrowSquare = sq;
		}
	}
}

function CheckForStars () : int
{
	nbStars = 0;
	
	for(var sq : Squares in square)
	{
		if (sq.starOrArrow == 1)
		{
			nbStars += 1;
		}
	}
	return nbStars;
}



function InitExecutionArea ()
{
	actionToDisplay = function_[0].nbActions;
	
	for(var i : int = 0; i < actionToDisplay; i++)
	{
		actionToExecute[i] = function_[0].action[i];
	}
}

function ReadAction ()
{
	if (actionToDisplay > 0)
	{
		actualAction = actionToExecute[0];
	
		//Compare action color with sq color
		if ( actualAction.color == square[ arrow.index ].color || actualAction.color == 0 )
		{
			//color has been verified			
			ExecuteCommand( actualAction.command );
		}
			
		//Read next action
		for(var i : int = 0; i < actionToDisplay; i++)
		{
			actionToExecute[i] = actionToExecute[i+1];
		}
		actionToDisplay -= 1;
	}
	
	else
	{
		//Stop();
		Pause();
		dead = true;		
		SetMessage("Program is empty !", 1);
	}
}

function CoordToSquareIndex (_coord : Vector2) : int
{
	var k : int = 0;
	var index : int = -1;
	
	for(var j : int = 0; j < 16; j++)
	{
		for(var i : int = 0; i < 16; i++)
		{
			if (i == _coord.x && j == _coord.y) index = k;
			else k++;
		}
	}
	return index;
}

function ExecuteCommand (_cmd : int)
{
	switch(_cmd)
	{
		case 0:	break;
		
	
		case 1:	//Move Forward
			square[ arrow.index ].starOrArrow = 0; //Remove Arrow on last Square
				
			var actualPos : Vector2 = square[ arrow.index ].position;
			
			var newPos : Vector2;
			 			
			switch(arrow.direction) //Change arrow Index depending on direction
			{
				case arrow.direction.Top: 
						newPos = Vector2(actualPos.x, actualPos.y - 1);
						break;
						
				case arrow.direction.Right:
						newPos = Vector2(actualPos.x + 1, actualPos.y);
						break;
				
				case arrow.direction.Bottom:
						newPos = Vector2(actualPos.x, actualPos.y + 1);
						break;
						
				case arrow.direction.Left:
						newPos = Vector2(actualPos.x - 1, actualPos.y);
						break;
			}
			var newIndex : int = CoordToSquareIndex( newPos );
			
			if (newIndex != -1)
			{
				arrow.index = newIndex;
				square[ arrow.index ].starOrArrow = arrow.direction + 2; //Set Arrow on new Square
			}
			else 
			{
				//Stop(); //Out of the Grid -> GAMEOVER
				Pause();
				dead = true;
				SetMessage("You Died !", 1);
			}
			break;
		
			
		case 2: //Turn Right
			arrow.direction += 1;
			
			if (arrow.direction > 3) arrow.direction = 0;
			
			square[ arrow.index ].starOrArrow = arrow.direction + 2;
			break;
		
		
		case 3: //Turn Right
			arrow.direction -= 1;
			
			if (arrow.direction < 0) arrow.direction = 3;
			
			square[ arrow.index ].starOrArrow = arrow.direction + 2;
			break;
			
		
		case 4: //Paint blue
			square[ arrow.index ].color = 1;
			break;
			
			
		case 5: //Paint green
			square[ arrow.index ].color = 2;
			break;
			
			
		case 6: //Paint orange
			square[ arrow.index ].color = 3;
			break;
			
		case 7: //Repeat F1
		case 8: //Repeat F2
		case 9: //Repeat F3
		case 10: //Repeat F4
		case 11: //Repeat F5
		case 12: //Repeat F6
			var nbActionsInFunction : int = function_[ _cmd -7 ].nbActions;
			var nbActionsUnexecuted : int = actionToDisplay - 1; 
			
			actionToDisplay += nbActionsInFunction;
			
			for(var d : int = nbActionsUnexecuted + 1; d > 0; d--) //Stack the unExecuted Actions at the end
			{
				actionToExecute[d + nbActionsInFunction] = actionToExecute[d];
			}
			
			for(var i : int = 0; i < nbActionsInFunction; i++) //replace f? with all function_[?] Actions
			{
				actionToExecute[i + 1] = function_[ _cmd -7 ].action[i];
			}
			break;
	}
}




//CONTROLS
function Play()
{
	if (!isPaused) InitExecutionArea(); //Set ExecutionArea with F1 Actions
	isPaused = false;
}

function Pause ()
{
	isPaused = true;
	isPlaying = false;
}

function NextAction ()
{
	timeElapsed = delay;
}

function Stop ()
{
	isPlaying = false;
	isPaused = false;
	actionToDisplay = 0;
	timeElapsed = 0;
	nbStars = 0;
	message = null;
	win = false;
	dead = false;
	
	Load( level );
}

function CleanFunctions ()
{
	Stop();
	
	for(var f : Functions in function_)
	{
		for(var a : int = 0; a < 10; a++)
		{
			f.action[a] = new Actions();
		}
	}	
	CleanCommandToggle();
	CleanColorToggle();
	CleanFunctionToggle();
	selectedAction.isSelected = false;
}

function SetFontSizes ()
{
	otherStyle[0].fontSize = Mathf.Round(Screen.height/25.07);
	otherStyle[1].fontSize = Mathf.Round(Screen.height/37.6);
	otherStyle[3].fontSize = Mathf.Round(Screen.height/41.78);
	otherStyle[4].fontSize = Mathf.Round(Screen.height/25.07);
}

