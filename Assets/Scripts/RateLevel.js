#pragma strict
@script ExecuteInEditMode

var display : boolean;

var rateValue : int;

private var groupRect : Rect;

var pinkTexture : Texture2D;
var whiteTexture : Texture2D;
var ratingBG : Texture2D;
var ratingAlphaBG : Texture2D;

private var starPos : float;

function Awake ()
{
	groupRect = Rect( (Screen.width - 500)/2 , (Screen.height - 100)/2, 500, 100 );
}

function OnGUI ()
{
	if(display)
	{
		GUI.BeginGroup(groupRect);
		
		GUI.DrawTexture(Rect(0,0,groupRect.width,groupRect.height), pinkTexture);
		GUI.DrawTexture(Rect(2,2,groupRect.width-4,groupRect.height-4), whiteTexture);
		
		//Rate stars
		GUI.BeginGroup(Rect(5,5,490,90));
				 
		GUI.DrawTexture(Rect(-5,-5,500,100), ratingBG);
		
		GUI.DrawTexture(Rect(starPos,5,500,100), ratingAlphaBG);
		
		GUI.EndGroup();
		
		if( GUI.Button(Rect(0,0,500,100), "", GUIStyle.none) ) SendRateRequest(rateValue);
						
		GUI.EndGroup();
		
		StarHover();
	}
}

private var rateLevelUrl = "http://www.advicemallard.com/bdd_manager/42RateLevel.php?"; 

var isRequesting : boolean;
var levelIndex : int;

function SendRateRequest (_newRate : int)
{
	isRequesting = true;
	
	var request : WWW = WWW( rateLevelUrl + "&newRate=" + _newRate + "&levelIndex=" + levelIndex);
	
	yield request;
	
	if(request.error)
	{
        print("There was an error posting the high score: " + request.error);
    }
	else
	{
		Debug.Log("New Rate = " + request.text);
	}
	
	isRequesting = false;
		
}



function StarHover ()
{
	var mousePosX : float = Input.mousePosition.x - groupRect.x;
	var mousePosY : float = Input.mousePosition.y - groupRect.y;
	 
	if(mousePosY >=10 && mousePosY <= 90)
	{	
		if(mousePosX >= 10 && mousePosX < 100)
		{
			starPos = 100;
			rateValue = 1;
		}
		
		else if(mousePosX >= 100 && mousePosX < 200)
		{
			starPos = 200;
			rateValue = 2;
		}
		
		else if(mousePosX >= 200 && mousePosX < 300)
		{
			starPos = 300;
			rateValue = 3;
		}
		
		else if(mousePosX >= 300 && mousePosX < 400)
		{
			starPos = 400;
			rateValue = 4;
		}
		
		else if(mousePosX >= 400 && mousePosX < 500)
		{
			starPos = 500;
			rateValue = 5;
		}
		
		else
		{
			starPos = 0;
			rateValue = 0;
		}
	}
	
}