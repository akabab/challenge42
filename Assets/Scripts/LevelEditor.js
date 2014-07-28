/*#pragma strict
import System.String;

var levelID : String;

var square : Squares[];

var nbFunctions : int = 1;
var function_ : Functions[]; //= new Functions[6];

var color : Colors[];
var starOrArrowTexture : Texture2D[];
var commandTexture : Texture2D[];
var command : Commands[];
var nbCommands : int;

var controlTexture : Texture2D[];
var colorStyle : GUIStyle[];
var otherStyle : GUIStyle[];

private var starIsSelected : boolean;
private var arrowIsSelected : boolean;

var background : Texture2D;


var speedX1 : float = 0.3;
var speedX2 : float = 0.15;
var speedX3 : float = 0.1;

var delay : float;
var timeElapsed : float = 0; 

private var x1Toggle : boolean = true;
private var x2Toggle : boolean = false;
private var x3Toggle : boolean = false;

@HideInInspector
var isPlaying : boolean = false;
@HideInInspector
var isPaused : boolean = false;


//PROCESSING

var once : boolean = false;
var firstSquareToggle : boolean;
var firstSquareIndex : int = -1;
var firstSquareCoord : Vector2 = Vector2(-100,-100);
var tempCoord : Vector2 = Vector2(-100,-100); // has to be != (0,0)

private var arrowDirection : int = 2; //{2,3,4,5}
//@HideInInspector()
var arrowSquare : Squares;

var totalSquaresToSave : int = 0;
var savedSquare : Squares[];

var atLeastOneSquareIsSelected : boolean = false;

var isOnGrid : boolean = false;

var savedLevel : String;

var selectedAction : Actions;
var isTesting : boolean;

function Awake ()
{
	SetSquaresIndex();
	//NbFunctions = 1;
	//function_ = new Functions[6];
	//verify each function has nbActions = 1 and action = new Actions[10]
}



function OnGUI ()
{
	GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), background);
	
	DrawGrid();
		
	if(isTesting)
	{
		DrawControls();
		DrawExecutionArea();
	}
	
	DrawCommands();
	
	DrawColors();
	
	
	CheckForSquaresSelected();
	
	if(!isTesting)
	{
		DrawStar();
		
		DrawArrow();
	}
	
	DrawFunctions();
	
	SelectMultiSquares();
	
	if( GUI.Button(Rect(0, 713, 60, 40), "del", otherStyle[2]) )
	{
		ResetGrid();	
		nbFunctions = 1; //Temporary ??
	}
	
	
	if( GUI.Button(Rect(100, 713, 80, 40), "save", otherStyle[2]) )
	{
		SaveSquares(); 
		
		savedLevel = "#SFCA";
		
		//Save Level ID
		var indexID : int = savedLevel.IndexOf("#");
		
		savedLevel = savedLevel.Insert(indexID, "" + levelID);
		
		//Save Squares properties
		for(var s : Squares in savedSquare)
		{
			var tempSqProp : String = "" + s.index + "," + s.color + "," + s.starOrArrow;
			
			var indexS : int = savedLevel.IndexOf("S");
			
			savedLevel = savedLevel.Insert(indexS, "" + tempSqProp + "/"); 
		}
		//Save Functions+Actions
		for(var f : int = 0; f < nbFunctions; f++)
		{
			var tempNbActions : String = "" + function_[f].nbActions;
			
			var indexF : int = savedLevel.IndexOf("F");
			
			savedLevel = savedLevel.Insert(indexF, "" + tempNbActions + ",");
		}
		
		//Save Available Commands
		for(var c : int = 1; c < 7 + nbFunctions; c++)
		{
			var indexC : int = savedLevel.IndexOf("C");
			
			if(command[c].isSelected == false) //<=> !isDesactivated 
			{
				savedLevel = savedLevel.Insert(indexC, "" + c + ",");
			}
		}
		
		//Save Arrow
		var indexA : int = savedLevel.IndexOf("A");
		
		savedLevel = savedLevel.Insert(indexA, "" + arrowSquare.index + "," + (arrowSquare.starOrArrow - 2) + ","); 
		
		

		
		//Encrypting in MD5
		//savedLevel = Md5Sum(savedLevel); 
	}
	

	if(savedLevel)
	{
		if( GUI.Button(Rect(200, 713, 80, 40), "load", otherStyle[2]) )
		{
			LoadLevel();
		}
	}
	
	
	
	//EDIT OR TEST MODE
	if( isTesting == false)
	{
		if( GUI.Button(Rect(600, 713, 80, 40), "test", otherStyle[2]) ) isTesting = true;
	}
	else 
	{
		if( GUI.Button(Rect(600, 713, 80, 40), "edit", otherStyle[2]) ) isTesting = false;
	}
	
	//GUI PROCESSING

}

function LoadLevel ()
{		
	ResetGrid();
	
	//Load Squares
	var firstSplit = savedLevel.Split("S"[0]);
			
	var sqArray = firstSplit[0].Split("/"[0]);
	
	for(var i : int = 0; i < sqArray.Length -1; i++)
	{
		var sqProp = sqArray[i].Split(","[0]);
		
		var tempIndex : int = parseInt( sqProp[0] );
		var tempColor : int = parseInt( sqProp[1] );
		var tempStarOrArrow : int = parseInt( sqProp[2] );
		
		square[ tempIndex ].index = tempIndex;
		square[ tempIndex ].color = tempColor;
		square[ tempIndex ].starOrArrow = tempStarOrArrow;
	}
	
	//Load Functions+Actions
	var secondSplit = firstSplit[1].Split("F"[0]);
	
	var nbActions = secondSplit[0].Split(","[0]);
	
	nbFunctions = nbActions.Length -1;
	
	for(var j : int = 0; j < nbActions.Length -1; j++)
	{
		function_[j].nbActions = parseInt( nbActions[j] );
	}
	
	//Load Available Commands
	var thirdSplit = secondSplit[1].Split("C"[0]);
	
	var cmds = thirdSplit[0].Split(","[0]);
	
	for(var cm : Commands in command)
	{
		cm.isSelected = true;
	}
	
	for(var k : int = 0; k < cmds.Length -1; k++)
	{
		command[ parseInt(cmds[k]) ].isSelected = false;
	}
	
	//Load Arrow Infos
	var fourthSplit = thirdSplit[1].Split("A"[0]);
	
	var ar = fourthSplit[0].Split(","[0]);
	
	arrow.index = parseInt( ar[0] );
	arrow.direction = parseInt( ar[1] );
	
	
	arrowDirection = parseInt( ar[1] ) + 2;
}


		
function Md5Sum(strToEncrypt: String)
{
	var encoding = System.Text.UTF8Encoding();
	var bytes = encoding.GetBytes(strToEncrypt);
 
	// encrypt bytes
	var md5 = System.Security.Cryptography.MD5CryptoServiceProvider();
	var hashBytes:byte[] = md5.ComputeHash(bytes);
 
	// Convert the encrypted bytes back to a string (base 16)
	var hashString = "";
 
	for (var i = 0; i < hashBytes.Length; i++)
	{
		hashString += System.Convert.ToString(hashBytes[i], 16).PadLeft(2, "0"[0]);
	}
 
	return hashString.PadLeft(32, "0"[0]);
}


	
  /////////////////////////////////	
 //			  METHODS 			//	
/////////////////////////////////	

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

function SetSquaresIndex ()
{
	var k : int = 0;
	for(var sq : Squares in square)
	{
		sq.index += k;
		k++;
	}
}


function DrawGrid ()
{
	var k : int = 0;
	
	GUI.BeginGroup(Rect(40, 82, 640, 640));
	
	for(var j : int = 0; j < 16; j++)
	{
		for(var i : int = 0; i < 16; i++)
		{
			if( isTesting )
			{
				GUI.Label(Rect(i*40, j*40, 40, 40), starOrArrowTexture[square[k].starOrArrow], colorStyle[square[k].color]);
				k++;
			}
			
			else
			{
				var tempSquareToggle : boolean = GUI.Toggle(Rect(i*40, j*40, 40, 40), square[k].isSelected, starOrArrowTexture[square[k].starOrArrow], colorStyle[square[k].color]);
				
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
	}
	
	GUI.EndGroup();
}

function DrawControls ()
{
	//Controls
	GUI.BeginGroup(Rect(20, 20, 212, 40));
	
	//if( GUI.Button(Rect(0, 0, 40, 40), controlTexture[0], otherStyle[0]) && !isPlaying ) Play(); //Play

	var tempPlayToggle : boolean = GUI.Toggle(Rect(0, 0, 40, 40), isPlaying, controlTexture[0], otherStyle[0]);
	
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
		
	//if( GUI.Button(Rect(43, 0, 40, 40), controlTexture[1], otherStyle[0]) && !isPaused ) Pause(); //Pause
	
	var tempPauseToggle : boolean = GUI.Toggle(Rect(43, 0, 40, 40), isPaused, controlTexture[1], otherStyle[0]);
	
	if (tempPauseToggle != isPaused) 
	{
		if (tempPauseToggle == true)
		{
			//If Play is pressed (Toggle is enabled) :   				
			if(isPlaying) Pause();
			else tempPauseToggle = false;
		}
 		else
 		{
			//(Toggle is disabled) :
			tempPauseToggle = true; //Force Toggle to stay true - Only Play can turn it false;
  			
 		}
 		isPaused = tempPauseToggle;
	}
	
	if( GUI.Button(Rect(86, 0, 40, 40), controlTexture[2], otherStyle[0]) ) //NextAction
	{
		if(!isPaused && !isPlaying) InitExecutionArea(); //Set ExecutionArea with F1 Actions
		
		if(!isPaused) Pause();
		
		NextAction();
	}
	
	if( GUI.Button(Rect(129, 0, 40, 40), controlTexture[3], otherStyle[0]) ) Stop();
		
	if( GUI.Button(Rect(172, 0, 40, 40), controlTexture[4], otherStyle[0]) ) CleanFunctions(); //CleanFunctions
	
	GUI.EndGroup();
	
	
	//SpeedControls
	GUI.BeginGroup(Rect(1134, 20, 126, 40));
	
	//if( GUI.Button(Rect(0, 0, 40, 40), controlTexture[5], otherStyle[0]) ) delay = 0.4; //x1
		
	var tempX1Toggle : boolean = GUI.Toggle(Rect(0, 0, 40, 40), x1Toggle, controlTexture[5], otherStyle[0]);
	
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
	
	//if( GUI.Button(Rect(43, 0, 40, 40), controlTexture[6], otherStyle[0]) ) delay = 0.2; //x2
	
	var tempX2Toggle : boolean = GUI.Toggle(Rect(43, 0, 40, 40), x2Toggle, controlTexture[6], otherStyle[0]);
	
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
	
	//if( GUI.Button(Rect(86, 0, 40, 40), controlTexture[7], otherStyle[0]) ) delay = 0.1; //x3
	
	var tempX3Toggle : boolean = GUI.Toggle(Rect(86, 0, 40, 40), x3Toggle, controlTexture[7], otherStyle[0]);
	
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
	GUI.BeginGroup(Rect(730, 162, 513, 40));
	
	var k : int = 1;
		
	if(!isTesting)
	{
		nbCommands = 6 + nbFunctions;
		
		for(var i : int = 0; i < nbCommands; i++)
		{
			command[k].isSelected = GUI.Toggle(Rect(i*(40 + 3), 0, 40, 40), command[k].isSelected, commandTexture[k], otherStyle[3]);
			command[k].isDesactivated = command[k].isSelected;
			k++;
			
		}		
	}
	else if(isTesting)
	{
		nbCommands = 6 + nbFunctions;
		
		for(var j : int = 0; j < nbCommands; j++)
		{
			if(!command[k].isDesactivated)
			{				
				var tempCommandToggle : boolean = GUI.Toggle(Rect(j*(40 + 3), 0, 40, 40), command[k].isSelected, commandTexture[k], colorStyle[0]);
				
				if (tempCommandToggle != command[k].isSelected) 
				{
					if (tempCommandToggle == true)
					{
		   				//When a Command isSelected (Toggle is enabled) :   				
		   				CleanCommandToggle();
           				
           				if(selectedAction.isSelected)
           				{
           					selectedAction.command = k;
           				}
           				else tempCommandToggle = false;
		   			}
			 		else
			 		{
		   				//When none Command isSelected (Toggle is disabled) :
		      			if(selectedAction.isSelected)
           				{
           					selectedAction.command = 0;
           				} 	
			 		}
			 		command[k].isSelected = tempCommandToggle;
				}
			}
			
			k++;
		}
	}
	
	GUI.EndGroup();	
}

function DrawColors ()
{
	GUI.BeginGroup(Rect(730, 242, 169, 40));
	
	var k : int;
	var nbColors : int;
	
	if(isTesting)
	{
		k = 1;
		nbColors = 3;
	}
	else
	{
		k = 0;
		nbColors = 4;
	}
	
	for(var i : int = 0; i < nbColors; i++)
	{
		var tempColorToggle : boolean = GUI.Toggle(Rect(i*(40 + 3), 0, 40, 40), color[k].isSelected, "", colorStyle[k]);
				
		if (tempColorToggle != color[k].isSelected) 
		{
			if (tempColorToggle == true)
			{
   				//When a Color isSelected (Toggle is enabled) :   				
   				if(isTesting)
   				{
	   				CleanColorToggle();	
		   				
	   				if(selectedAction.isSelected)
	   				{
	   					selectedAction.color = k;
	   				}
	   				else tempColorToggle = false;
	   			}
	   			else
	   			{
		   			SetSquaresColor(k);
	   				CleanSquareToggle();
	   				tempColorToggle = false;
	   			}
   			}
	 		else
	 		{
   				//When none Color isSelected (Toggle is disabled) :
      			if(isTesting)
   				{
	   				if(selectedAction.isSelected)
	   				{
	   					selectedAction.color = 0;
	   				}
	   			}	
	 		}
	 		color[k].isSelected = tempColorToggle;
		}
		
		k++;
	}
	
		GUI.EndGroup();	
}

function DrawStar ()
{
	var tempStarToggle : boolean = GUI.Toggle(Rect(730, 302, 40, 40), starIsSelected, starOrArrowTexture[1], colorStyle[0]);
				
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
	if( GUI.Button(Rect(858, 302, 40, 40), starOrArrowTexture[arrowDirection], colorStyle[0]) )
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
	GUI.BeginGroup(Rect(730, 392, 520, 340)); //FunctionsArea
	
	for(var f : int = 0; f < nbFunctions; f++)
	{	
		var functionX : int = 0;
		var functionY : int = f*60;
		
		GUI.Label(Rect(functionX, functionY, 40,40), "F" + (f + 1), otherStyle[2]);
		
		for(var a : int = 0; a < function_[f].nbActions; a++)
		{	
			var actionX : int = 50 + a*(40 + 3);
			var actionY : int = f*60;
			
			if( !isTesting )
			{
				GUI.Label(Rect(actionX, actionY, 40, 40), "", colorStyle[0]); // temporary
			}
			else
			{
				var tempToggle : boolean = GUI.Toggle(Rect(actionX, actionY, 40, 40), function_[f].action[a].isSelected, commandTexture[function_[f].action[a].command], colorStyle[function_[f].action[a].color]);
			
				if (tempToggle != function_[f].action[a].isSelected) 
				{
        			if (tempToggle == true)
        			{
           				//When an Action isSelected (Toggle is enabled) :
           				selectedAction = function_[f].action[a];
           				
           				CleanFunctionToggle();
										
				 		CheckForCommandAndColor();
           			}
       		 		else
       		 		{
           				//When none Action isSelected (Toggle is disabled) :
           				selectedAction = null;
           				
           				CleanCommandToggle();
           				CleanColorToggle();
           				         				
      		 		}
      		 		function_[f].action[a].isSelected = tempToggle;
   				}
			}			
		}
		
		if( !isTesting ) AddOrRemoveActions(f, actionX, actionY);
	}
	
	if( !isTesting ) AddOrRemoveFunctions(f, functionX, functionY);
	
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



function AddOrRemoveFunctions (_f : int, _functionX : int, _functionY : int)
{
	if( nbFunctions >= 2 )
	{
		if( GUI.Button(Rect(_functionX, _functionY, 40, 40), "", otherStyle[0]) )
		{
			nbFunctions -= 1;
		}
	}
	
	if( GUI.Button(Rect(_functionX, _functionY + (40 + 20), 40, 40), "", otherStyle[1]) )
	{
		nbFunctions += 1;
		function_[_f].nbActions = 1;
	}
}		

function AddOrRemoveActions (_f : int, _actionX : int, _actionY : int)
{
	if( function_[_f].nbActions >= 2 )
	{
		if( GUI.Button(Rect(_actionX + (40 + 3), _actionY, 40, 40), "", otherStyle[0]) )
		{
			function_[_f].nbActions -= 1;
		}
	}
	
	if( GUI.Button(Rect(_actionX + (2*40 + 2*3), _actionY, 40, 40), "", otherStyle[1]) )
	{
		function_[_f].nbActions += 1;
	}
}	
	
	
	

function SetSquaresColor (_k : int)
{
	for(var sq : Squares in square)
	{
		if(sq.isSelected)
		{
			sq.color = _k;
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

function ResetGrid ()
{
	for(var sq : Squares in square)
	{
		CleanSquareToggle();
		sq.color = 0;
		sq.starOrArrow = 0;
	}	
}



function SelectMultiSquares ()
{
	var x : int = Input.mousePosition.x - 40;
	var y : int = Screen.height - Input.mousePosition.y - 82; //To set Top-Left corner of the Grid to (0,0)
	
	if( Input.GetKeyDown(KeyCode.Mouse0) && x >= 0 && x <= 639 && y >= 0 && y <= 639 ) isOnGrid = true;
	if( Input.GetKeyUp(KeyCode.Mouse0) || x < 0 || x > 639 || y < 0 || y > 639 ) isOnGrid = false;
		
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

function GetCoordInGrid (_x : int, _y : int) : Vector2
{
	var floorX : int = Mathf.FloorToInt(_x / 40);
	var floorY : int = Mathf.FloorToInt(_y / 40);
	
	return Vector2(floorX, floorY);
}

function CoordToSquareIndex (_coord : Vector2) : int
{
	var k : int = 0;
	var index : int = 0;
	
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

//CONTROLS METHODS

var actionToExecute : Actions[];

class Arrow extends System.Object
{
	var index : int = -1;
	enum Directions {Top, Right, Bottom, Left}
	
	var direction : Directions;
}
var arrow : Arrow;

var actionToDisplay : int = 0;

var actualAction : Actions;

function DrawExecutionArea ()
{	
	GUI.BeginGroup(Rect(252, 20, 862, 40));

	for(var i : int = 0; i < actionToDisplay; i++)
	{
		GUI.Label(Rect(i*(40 + 3), 0, 40, 40), commandTexture[ actionToExecute[i].command ], colorStyle[ actionToExecute[i].color ]);
	}
	
	GUI.EndGroup();
}


function Update ()
{
	CheckForArrowSquare();
	
	if(isPlaying)
	{
		timeElapsed += Time.deltaTime;
	
		if(timeElapsed > delay)
		{
			timeElapsed = 0;
			ReadAction();
		}
	}
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
	if(actionToDisplay != 0) actualAction = actionToExecute[0];
	else
	{
		Stop();
		Debug.Log("GAMEOVER");
	}
	
	//Compare action color with sq color
	if( actualAction.color == square[ arrow.index ].color || actualAction.color == 0 )
	{
		//color has been verified
		//delay = 0.4;
		ExecuteCommand( actualAction.command );
	}
	//else delay = 0.02;
		
	//Read next action
	for(var i : int = 0; i < actionToDisplay; i++)
	{
		actionToExecute[i] = actionToExecute[i+1];
	}
	actionToDisplay -= 1;
	
	
}


function ExecuteCommand (_cmd : int)
{
	switch(_cmd)
	{
		case 0:	break;
		
		
		case 1:	//Move Forward
			square[ arrow.index ].starOrArrow = 0; //Remove Arrow on last Square
				
			switch(arrow.direction) //Change arrow Index depending on direction
			{
				case arrow.direction.Top: 
						arrow.index -= 16;
						break;
						
				case arrow.direction.Right:
						arrow.index += 1;
						break;
				
				case arrow.direction.Bottom:
						arrow.index += 16;
						break;
						
				case arrow.direction.Left:
						arrow.index -= 1;
						break;
			}
			square[ arrow.index ].starOrArrow = arrow.direction + 2;
			
			break;
		
			
		case 2: //Turn Right
			arrow.direction += 1;
			
			if(arrow.direction > 3) arrow.direction = 0;
			
			square[ arrow.index ].starOrArrow = arrow.direction + 2;
			
			break;
		
		
		case 3: //Turn Right
			arrow.direction -= 1;
			
			if(arrow.direction < 0) arrow.direction = 3;
			
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
			
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
		case 12:
			var nbActionsInFunction : int = function_[ _cmd -7 ].nbActions;
			
			actionToDisplay += nbActionsInFunction;
			
			for(var d : int = 1; d < actionToDisplay; d++) //Stack the unExecuted Actions at the end
			{
				actionToExecute[ nbActionsInFunction + d] = actionToExecute[d];
			}
			
			for(var i : int = 0; i < nbActionsInFunction; i++) //replace function_[?] command-Action with all function_[?] Actions
			{
				actionToExecute[i + 1] = function_[ _cmd -7 ].action[i];
			}
			
			break;
	}
}




//CONTROLS
function Play()
{
	if(!isPaused) InitExecutionArea(); //Set ExecutionArea with F1 Actions
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


*/



