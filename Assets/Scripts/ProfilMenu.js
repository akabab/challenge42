#pragma strict

var background : Texture2D;

var otherStyle : GUIStyle[];

var playerName : String;

var isNewProfil : boolean;

class Profils
{
	var isSelected : boolean = false;
	var playerName : String = "NEW";
	var lvlsUnlocked : int;
	
}

var profil : Profils[];

function Awake ()
{
	
}


function OnGUI ()
{
	GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), background);
	
	DrawProfil();
	
	if( isNewProfil ) EnterPlayerName();
}


function DrawProfil ()
{
	var screenOffset : Vector2 = Vector2( Screen.width/2 - (150 + 5), Screen.height/2 - (150 + 5) );
	
	var k : int = 0;
	
	for(var j : int = 0; j < 2; j++)
	{
		for(var i : int = 0; i < 2; i++)
		{		
			var profilPos : Vector2 = Vector2(screenOffset.x + 160*i, screenOffset.y + 160*j);
			
			var tempProfilToggle : boolean = GUI.Toggle(Rect(profilPos.x, profilPos.y, 150, 150), profil[k].isSelected, profil[k].playerName, otherStyle[0]);
			
			if (tempProfilToggle != profil[k].isSelected) 
			{
				if (tempProfilToggle == true)
				{
					//Toggle is enabled :   				
					if( profil[k].playerName == "NEW" ) isNewProfil = true;
				}
		 		else
		 		{
					//Toggle is disabled :
		  			
		 		}
		 		profil[k].isSelected = tempProfilToggle;
			}
			
			
			
			GUI.Button(Rect(profilPos.x + 100, profilPos.y + 100, 50, 50), "DEL", otherStyle[0]);	
			
			k++;	
		}	
		
		
	}
	
	


}

function EnterPlayerName ()
{
	playerName = GUI.TextField(Rect(Screen.width/2, Screen.height - 150, 200, 50), playerName);

}