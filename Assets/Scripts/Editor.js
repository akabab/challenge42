#pragma strict
var resolution : Vector2;
var size : Sizes;

var level : String;
var levelID : String;
var levelIndex : int;
var savedLevel : String;

var square : Squares[] = new Squares[256];

var nbFunctions : int = 1;
var function_ : Functions[] = new Functions[5];

var selectedAction : Actions;
var color : Colors[] = new Colors[4];
var starOrArrowTexture : Texture2D[] = new Texture2D[6];
var commandTexture : Texture2D[] = new Texture2D[12];
var command : Commands[] = new Commands[12];
var nbCommands : int;

var controlTexture : Texture2D[] = new Texture2D[8];
var colorStyle : GUIStyle[];
var otherStyle : GUIStyle[];
var otherTexture : Texture2D[];
var background : Texture2D;


var gridOffset : Vector2 = Vector2(30, 56);
@HideInInspector
var arrowDirection : int = 2;
@HideInInspector
var levelLoaded : boolean = false;
//@HideInInspector
var message : String;
@HideInInspector
var messageTime : float = 0;
@HideInInspector
var nbStars : int = -1;
//@HideInInspector
var actionToExecute : Actions[] = new Actions[1000];
@HideInInspector
var arrow : Arrow;
//@HideInInspector
var arrowSquare : Squares;
@HideInInspector
var actionToDisplay : int = 0;
@HideInInspector
var actualAction : Actions;
@HideInInspector
var starIsSelected : boolean;
@HideInInspector
var atLeastOneSquareIsSelected : boolean = false;
@HideInInspector
var isOnGrid : boolean = false;
@HideInInspector
var once : boolean = false;
@HideInInspector
var firstSquareToggle : boolean;
@HideInInspector
var firstSquareIndex : int = -1;
@HideInInspector
var firstSquareCoord : Vector2 = Vector2(-100,-100);
@HideInInspector
var tempCoord : Vector2 = Vector2(-100,-100); // has to be != (0,0)

var totalSquaresToSave : int = 0;
var savedSquare : Squares[];

var levelIsSaved : boolean = false;


function Awake ()
{
	resolution = Vector2(Screen.width, Screen.height);

	size.SetSizes();
	
	SetFontSizes();
		
	
	SetSquaresIndex();
	arrowSquare.index = -1;
	
	SetSquaresPosition();
	
	if( PlayerPrefs.HasKey("level0") )
	{
		level = PlayerPrefs.GetString("level0");	
		Load( level );
	}
}

function SetFontSizes ()
{
	otherStyle[0].fontSize = Mathf.Round(Screen.height/25.07);
	otherStyle[4].fontSize = Mathf.Round(Screen.height/25.07);
	otherStyle[5].fontSize = Mathf.Round(Screen.height/37.6);
}

function Update ()
{
	//Set resolutions
	if( Vector2(Screen.width, Screen.height) != resolution )
	{
		resolution = Vector2(Screen.width, Screen.height);
		size.SetSizes();
		SetFontSizes();
	}
	
	CheckForArrowSquare(); 
}


function OnGUI ()
{
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), background);
	
	DrawGrid();
	
	DrawCommands();
	
	DrawColors();
	
	CheckForSquaresSelected();

	DrawStar();
	
	DrawArrow();
	
	DrawFunctions();
	
	SelectMultiSquares();
	
	
	if( PlayerPrefs.HasKey("level0") )
	{
		if( GUI.Button(Rect((size.bigMargin + size.grid + size.mediumMargin), Screen.height - size.smallButton, size.smallButton, size.smallButton), otherTexture[1], otherStyle[0]) ) Load( level ); //LOAD
	}
	
	
	if( GUI.Button(Rect((size.bigMargin + size.grid + size.mediumMargin) + (size.smallButton + size.smallMargin), Screen.height - size.smallButton, size.smallButton, size.smallButton), otherTexture[2], otherStyle[0]) ) Save(); //SAVE
	
	if( levelIsSaved )
	{
		if( GUI.Button(Rect(Screen.width - (size.smallButton*2 + size.smallMargin + size.mediumMargin), Screen.height - size.smallButton, size.smallButton, size.smallButton), otherTexture[4], otherStyle[0]) ) //TEST LEVEL
		{
			//Save();
			PlayerPrefs.SetString("levelIndex", "0");
			PlayerPrefs.SetString("level0", savedLevel);
			SceneManagement.SceneManager.LoadScene( "Game" );	 
		} 
	}
	
	if( GUI.Button(Rect(Screen.width - (size.smallButton + size.mediumMargin), Screen.height - size.smallButton, size.smallButton, size.smallButton), otherTexture[0], otherStyle[0]) ) SceneManagement.SceneManager.LoadScene("Menu"); //MENU
			
	
	if( GUI.Button(Rect(0, Screen.height - size.smallButton, size.smallButton, size.smallButton), otherTexture[3], otherStyle[0]) ) //DEL
	{
		ResetGrid();	
		nbFunctions = 1;
		arrowSquare = new Squares();
		arrowSquare.index = -1;
	}
		
	if(message)
	{
		GUI.Label(Rect((size.bigMargin + size.grid + size.mediumMargin) + (size.smallButton*2 + size.smallMargin*2), Screen.height - size.smallButton, size.screenWidth - ( (size.bigMargin + size.grid + size.mediumMargin) + (size.smallButton*4 + size.smallMargin*4) + size.mediumMargin ), size.smallButton), message, otherStyle[0]); //MESSAGE
		
		messageTime += Time.deltaTime;
		if(messageTime >= 3) message = null;	
	}
	else messageTime = 0;
	
	GUI.Label(Rect(size.smallButton + size.mediumMargin, Screen.height - size.smallButton, size.mediumMargin*4, size.smallButton), "Level ID", otherStyle[5]);
	
	levelID = GUI.TextField(Rect(size.smallButton + size.bigMargin + size.mediumMargin*4, Screen.height - size.smallButton/1.189, size.mediumMargin*5, 22), levelID);
	
}


//////////////////////////////////
//			METHODS				//
//////////////////////////////////

function DrawGrid ()
{
	var k : int = 0;
	
	GUI.BeginGroup(Rect(size.bigMargin, size.mediumMargin*2, size.grid, size.grid));
	
	for(var j : int = 0; j < 16; j++)
	{
		for(var i : int = 0; i < 16; i++)
		{			
			var tempSquareToggle : boolean = GUI.Toggle(Rect(i*size.square, j*size.square, size.square, size.square), square[k].isSelected, starOrArrowTexture[square[k].starOrArrow], colorStyle[square[k].color]);
			
			if (tempSquareToggle != square[k].isSelected) 
			{
				if (tempSquareToggle == true)
				{
	   				//When a Square (square[k]) isSelected (Toggle is enabled) :
	   				square[k].isSelected = false;	//to counter mouseclick (of SelectMulti) effect 			
	   				
	   			}
		 		else
		 		{
	   				//When none Square (square[k]) isSelected (Toggle is disabled) :
	   				square[k].isSelected = true;	//to counter mouseclick (of SelectMulti) effect
	   				        				
		 		}
	 			//square[k].isSelected = tempSquareToggle;
			}
			
			square[k].position = Vector3(i,j,0);
			k++;			
		}
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
	
	for(var i : int = 0; i < nbCommands; i++)
	{
		command[k].isSelected = GUI.Toggle(Rect( (commandButtonSize + commandButtonOffset)*i, 0, commandButtonSize, commandButtonSize), command[k].isSelected, commandTexture[k], otherStyle[3]);
		command[k].isDesactivated = command[k].isSelected;
		k++;		
	}
	
	GUI.EndGroup();	
}


function DrawColors ()
{
	var colorButtonSize : int = size.bigButton;
	var colorButtonOffset : int = size.mediumOffset;
	
	GUI.BeginGroup(Rect( (size.bigMargin*2 + size.grid + size.mediumMargin), size.screenHeight*0.293, (colorButtonSize*4 + colorButtonOffset*3), colorButtonSize));
	
	var k : int = 0;
	var nbColors : int = 4;
		
	for(var i : int = 0; i < nbColors; i++)
	{
		var tempColorToggle : boolean = GUI.Toggle(Rect( (colorButtonSize + colorButtonOffset)*i, 0, colorButtonSize, colorButtonSize), color[k].isSelected, "", colorStyle[k]);
				
		if (tempColorToggle != color[k].isSelected) 
		{
			if (tempColorToggle == true)
			{
   				//When a Color isSelected (Toggle is enabled) :   				
	   			SetSquaresColor(k);
   				CleanSquareToggle();
   				tempColorToggle = false;	   			
   			}
	 		else
	 		{
   				//When none Color isSelected (Toggle is disabled) :
	
	 		}
	 		color[k].isSelected = tempColorToggle;
		}
		
		k++;
	}
	
	GUI.EndGroup();	
}


function DrawStar ()
{
	var tempStarToggle : boolean = GUI.Toggle(Rect( (size.bigMargin*2 + size.grid + size.mediumMargin) + (size.bigButton*4 + size.mediumOffset*3) + size.bigMargin, size.screenHeight*0.293, size.bigButton, size.bigButton), starIsSelected, starOrArrowTexture[1], colorStyle[0]);
				
	if (tempStarToggle != starIsSelected) 
	{
		if (tempStarToggle == true)
		{
			//When Star isSelected (Toggle is enabled) :   				
			SetSquaresStar();
			CleanSquareToggle();
			tempStarToggle = false;			
		}
 		else
 		{
			//When Star !isSelected (Toggle is disabled) :
			        				
 		}
 		starIsSelected = tempStarToggle;
	}
}


function DrawArrow () //Check "Button - Set Arrow" FlowChart
{
	if( GUI.Button(Rect( (size.bigMargin*2 + size.grid + size.mediumMargin) + (size.bigButton*5 + size.mediumOffset*4) + size.bigMargin*2, size.screenHeight*0.293, size.bigButton, size.bigButton), starOrArrowTexture[arrowDirection], colorStyle[0]) )
	{
		if( atLeastOneSquareIsSelected )
		{
			SetSquareArrow();
		}
		else if( arrowSquare.starOrArrow >= 2 )
		{
			arrowDirection += 1;
			if( arrowDirection == 6 ) arrowDirection = 2;
			
			arrowSquare.starOrArrow = arrowDirection;
		}
	}
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
			
			GUI.Label(Rect(actionX, actionY, functionButtonSize, functionButtonSize), "", colorStyle[0]); // temporary		
		}
		
		AddOrRemoveActions(f, actionX, actionY);
	}
	
	AddOrRemoveFunctions(f, functionX, functionY);
	
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
			if(function_[f].action[a].isSelected)
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
		if(command[c].isSelected)
		{		
			command[c].isSelected = false;
		} 
	}
}

function CleanColorToggle ()
{
	for(var c : int = 0; c < color.length; c++)
	{		
		if(color[c].isSelected)
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

function SetSquaresColor (_k : int)
{
	for(var sq : Squares in square)
	{
		if(sq.isSelected)
		{
			sq.color = _k;
			if(_k == 0) sq.starOrArrow = 0;
		}
	}
}

function SetSquaresStar ()
{
	for(var sq : Squares in square)
	{
		if(sq.isSelected)
		{
			if(sq.color != 0)
			{	
				if(sq.starOrArrow == 0) sq.starOrArrow = 1;
				else if(sq.starOrArrow == 1) sq.starOrArrow = 0;
			}
		}
	}	
}

function SetSquareArrow ()
{
	if( firstSquareIndex != arrowSquare.index ) //is FirstSq != last arrowSq ?
	{		
		if( square[firstSquareIndex].color != 0 ) //is FirstSq colored ?
		{
			arrowSquare.starOrArrow = 0; //Remove last arrowSq
			arrowSquare = square[firstSquareIndex]; //Set arrowSq with FirstSq
			arrowSquare.starOrArrow = arrowDirection;
		}
	}
	else 
	{		
		arrowSquare.starOrArrow = 0; //Remove last arrowSquare
		arrowSquare = new Squares();
		arrowSquare.index = -1;
	}
	
	CleanSquareToggle();
}

function CleanSquareToggle ()
{
	for(var sq : Squares in square)
	{
		if(sq.isSelected)
		{
			sq.isSelected = false;
		}
	}
	firstSquareIndex = -1;
}

function CheckFirstSquareToggle (_x : int, _y : int)
{
	firstSquareCoord = GetCoordInGrid(_x,_y);
	firstSquareIndex = CoordToSquareIndex(firstSquareCoord);
	firstSquareToggle = square[ firstSquareIndex ].isSelected;
	
	if(firstSquareToggle == false )
	{
		square[ CoordToSquareIndex(firstSquareCoord) ].isSelected = true;
	}
	else 
	{
		square[ CoordToSquareIndex(firstSquareCoord) ].isSelected = false;
	}	
}

function SelectMultiSquares ()
{
	var x : int = Input.mousePosition.x - size.bigMargin;
	var y : int = Screen.height - Input.mousePosition.y - size.mediumMargin*2; //To set Top-Left corner of the Grid to (0,0)
	
	if( Input.GetKeyDown(KeyCode.Mouse0) && x >= 0 && x <= size.grid -1 && y >= 0 && y <= size.grid -1 ) isOnGrid = true;
	if( Input.GetKeyUp(KeyCode.Mouse0) || x < 0 || x > size.grid -1 || y < 0 || y > size.grid -1 ) isOnGrid = false;
		
	if(isOnGrid)
	{
		if(!once)
			{
				CheckFirstSquareToggle(x,y);
				
				once = true;
			}
		
		if( GetCoordInGrid(x,y) != tempCoord && GetCoordInGrid(x,y) != firstSquareCoord ) 
		{
			//if coord has changed :
			tempCoord = GetCoordInGrid(x,y);
			var k : int = CoordToSquareIndex(tempCoord); //return the square hovered index
			
			if(firstSquareToggle == false)
			{
				square[k].isSelected = true;
			}
			else
			{
				square[k].isSelected = false;
			}
		}
	}		
	else
	{
		tempCoord = Vector2(-100,-100);
		firstSquareCoord = Vector2(-100,-100);
		once = false;
	}	
}

function Save ()
{
	if(arrowSquare.starOrArrow < 2)
	{
		message = "No Player";
		levelIsSaved = false;
	}
	else
	{	
		SaveSquares(); 
		
		savedLevel = "#SFCA";
		
		//Save Level ID
		var indexID : int = savedLevel.LastIndexOf("#");
		
		savedLevel = savedLevel.Insert(indexID, "" + levelID);
		
		//Save Squares properties
		for(var s : Squares in savedSquare)
		{
			var tempSqProp : String = "" + s.index + "," + s.color + "," + s.starOrArrow;
			
			var indexS : int = savedLevel.LastIndexOf("S");
			
			savedLevel = savedLevel.Insert(indexS, "" + tempSqProp + "/"); 
		}
		//Save Functions+Actions
		for(var f : int = 0; f < nbFunctions; f++)
		{
			var tempNbActions : String = "" + function_[f].nbActions;
			
			var indexF : int = savedLevel.LastIndexOf("F");
			
			savedLevel = savedLevel.Insert(indexF, "" + tempNbActions + ",");
		}
		
		//Save Available Commands
		for(var c : int = 1; c < 7 + nbFunctions; c++)
		{
			var indexC : int = savedLevel.LastIndexOf("C");
			
			if(command[c].isSelected == false) //<=> !isDesactivated 
			{
				savedLevel = savedLevel.Insert(indexC, "" + c + ",");
			}
		}
		
		//Save Arrow
		var indexA : int = savedLevel.LastIndexOf("A");
		
		savedLevel = savedLevel.Insert(indexA, "" + arrowSquare.index + "," + (arrowSquare.starOrArrow - 2) + ","); 
	
	
		message = "Level Saved";
		levelIsSaved = true;
	}
}



function CheckForTotalSquaresToSave ()
{
	totalSquaresToSave = 0;
	
	for(var sq : Squares in square)
	{
		if( sq.color != 0 )
		{
			totalSquaresToSave++;
		}
	}
}

function SaveSquares ()
{
	var k : int = 0;
		
	CheckForTotalSquaresToSave();
	
	savedSquare = new Squares[totalSquaresToSave];
	
	for(var sq : Squares in square)
	{
		if( sq.color != 0 )
		{			
			savedSquare[k] = sq;
			k++;
		}
	}
}


function Load (_level : String)
{		
	ResetGrid();
	
	var error : boolean = false;
	var errorMessage : String;
	
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
	if(!_level.Contains("#")) errorMessage = "File incorrect : there is no #";
	else
	{
		//Get level ID
		var zeroSplit = _level.Split("#"[0]);
		
		if(!_level.Contains("S")) errorMessage = "File incorrect : there is no S";
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
	
				if( !sqProp[0] ) errorMessage = "SquareIndex value : " + i + " is missing";
				else
				{
					tempSqIndex[i] = parseInt( sqProp[0] );
					
					if(tempSqIndex[i] < 0 || tempSqIndex[i] > 255) errorMessage = "File incorrect : some sqIndex values are not valids";
				}
				
				if( !sqProp[1] ) errorMessage = "SquareColor value : " + i + " is missing";
				else
				{
					tempSqColor[i] = parseInt( sqProp[1] );
					
					if(tempSqColor[i] < 1 || tempSqColor[i] > 3) errorMessage = "File incorrect : some sqColor values are not valids";
				}
				
				if( !sqProp[2] ) errorMessage = "SquareStarOrArrow value : " + i + " is missing";
				else
				{
					tempSqStarOrArrow[i] = parseInt( sqProp[2] );
					
					if(tempSqStarOrArrow[i] < 0 || tempSqStarOrArrow[i] > 5) errorMessage = "File incorrect : some sqCommand values are not valids";
				}
			}
			
			if(!_level.Contains("F")) errorMessage = "File incorrect : there is no F";
			else
			{
				//PreLoad Functions+Actions
				var secondSplit = firstSplit[1].Split("F"[0]);
				
				nbActions = secondSplit[0].Split(","[0]);
				
				tempNbFunctions = nbActions.Length -1;
				
				tempNbActions = new int[tempNbFunctions];
				
				if(tempNbFunctions < 1 || tempNbFunctions > 6) errorMessage = "File incorrect : nbFunctions value is not valid"; 
				else
				{
					for(var j : int = 0; j < tempNbFunctions; j++)
					{						
						tempNbActions[j] = parseInt( nbActions[j] );
						
						if(tempNbActions[j] < 1 || tempNbActions[j] > 10) errorMessage = "File incorrect : some nbActions values are not valids";
					}
				}
								
				if(!_level.Contains("C")) errorMessage = "File incorrect : there is no C";
				else
				{	
					//PreLoad Available Commands
					var thirdSplit = secondSplit[1].Split("C"[0]);
					
					cmds = thirdSplit[0].Split(","[0]);				
					
					tempCommandIndex = new int[cmds.Length - 1];
					
					for(var k : int = 0; k < cmds.Length -1; k++) //Activate the ones
					{
						tempCommandIndex[k] = parseInt(cmds[k]);
						
						if(tempCommandIndex[k] < 1 || tempCommandIndex[k] > 12) errorMessage = "File incorrect : some CommandIndex values are not valids";
					}
				
					if(!_level.Contains("A")) Debug.Log("File incorrect : there is no A");
					else
					{
						//PreLoad Arrow Infos
						var fourthSplit = thirdSplit[1].Split("A"[0]);
						
						ar = fourthSplit[0].Split(","[0]);
						
						tempArrowIndex = parseInt( ar[0] );
						tempArrowDirection = parseInt( ar[1] );
						
						if(tempArrowIndex < 0 || tempArrowIndex > 255) errorMessage = "File incorrect : ArrowIndex value is not valid";
						
						if(tempArrowDirection < 0 || tempArrowDirection > 3) errorMessage = "File incorrect : ArrowDirection value is not valid";
									
					}		
				}	
			}
		}	 
	}
	
	
	//If no errors in File -> Load Level
	if(errorMessage)
	{
		levelLoaded = false;
		Debug.Log(errorMessage);
	}
	else
	{
		//Load Level ID
		levelID = zeroSplit[0];
		
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
	
	
		message = "Level Loaded";
		levelLoaded = true;
	}

}

function AddOrRemoveFunctions (_f : int, _functionX : int, _functionY : int)
{
	if( nbFunctions >= 2 )
	{
		if( GUI.Button(Rect(_functionX, _functionY, size.smallButton, size.smallButton), "", otherStyle[1]) )
		{
			nbFunctions -= 1;
		}
	}
	
	if( GUI.Button(Rect(_functionX, _functionY + (size.smallButton + size.mediumMargin), size.smallButton, size.smallButton), "", otherStyle[2]) )
	{
		nbFunctions += 1;
		function_[_f].nbActions = 1;
	}
}		

function AddOrRemoveActions (_f : int, _actionX : int, _actionY : int)
{
	if( function_[_f].nbActions >= 2 )
	{
		if( GUI.Button(Rect(_actionX, _actionY, size.smallButton, size.smallButton), "", otherStyle[1]) )
		{
			function_[_f].nbActions -= 1;
		}
	}
	
	if( GUI.Button(Rect(_actionX + (size.smallButton + size.bigOffset), _actionY, size.smallButton, size.smallButton), "", otherStyle[2]) )
	{
		function_[_f].nbActions += 1;
	}
}	

function CheckForSquaresSelected ()
{
	for(var sq : Squares in square)
	{
		if( sq.isSelected )
		{
			atLeastOneSquareIsSelected = true;
			return;
		}
		else atLeastOneSquareIsSelected = false;
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
		if(sq.starOrArrow >= 2)
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
		if(sq.starOrArrow == 1)
		{
			nbStars += 1;
		}
	}
	return nbStars;
}

function DrawExecutionArea ()
{	
	GUI.BeginGroup(Rect(252, 20, 862, 40));
	
	for(var i : int = 0; i < actionToDisplay; i++)
	{
		GUI.Label(Rect(i*(40 + 3), 0, 40, 40), commandTexture[ actionToExecute[i].command ], colorStyle[ actionToExecute[i].color ]);
	}
	
	GUI.EndGroup();
}

function GetCoordInGrid (_x : int, _y : int) : Vector2
{
	var floorX : int = Mathf.FloorToInt(_x / size.square);
	var floorY : int = Mathf.FloorToInt(_y / size.square);
	
	return Vector2(floorX, floorY);
}

function CoordToSquareIndex (_coord : Vector2) : int
{
	var k : int = 0;
	var index : int = -1;
	
	for(var j : int = 0; j < 16; j++)
	{
		for(var i : int = 0; i < 16; i++)
		{
			if(i == _coord.x && j == _coord.y) index = k;
			else k++;
		}
	}
	return index;
}
