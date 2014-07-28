#pragma strict

var background : Texture2D;
var logo : Texture2D;
var challengeAccepted : Texture2D;

var caRect : LTRect;


function Awake ()
{
	caRect = new LTRect((Screen.width - challengeAccepted.width)/2, -200, challengeAccepted.width, challengeAccepted.height);
	
	Anim();
}

function OnGUI()
{
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), background);
	
	GUI.DrawTexture(Rect((Screen.width - logo.width)/2, (Screen.height - logo.height)/2, logo.width, logo.height), logo);
	
	
	GUI.DrawTexture(caRect.rect, challengeAccepted);
}

function Anim ()
{
	yield WaitForSeconds(1);
	
	LeanTween.move(caRect, Vector2((Screen.width - challengeAccepted.width)/2, Screen.height/2.1), 3.0, {"ease":LeanTweenType.easeOutElastic});
	
	yield WaitForSeconds(5);
	
	Application.LoadLevel("Menu");
}