#pragma strict

var background : Texture2D;
var buttonStyle : GUIStyle[];

var playGO : GameObject;
var webLevelsGO : GameObject;
var createGO : GameObject;
var settingsGO : GameObject;

//var menuGO : GameObject[];

function OnGUI ()
{
  //GUI.depth = 10;
  //GUI.DrawTexture(Rect(0, 0, Screen.width, Screen.height), background);

  var k : int = 0;

  for(var j : int = 0; j < 2; j++)
  {
    for(var i : int = 0; i < 2; i++)
    {
      if( GUI.Button(Rect( Screen.width/2 - 180 + i*180, Screen.height/2 - 180 + j*180, 168, 168), "", buttonStyle[k]) ) MenuAction(k);
      k++;
    }
  }
}

function MenuAction (_k : int)
{
  if (_k != 3)
    this.gameObject.SetActive(false);

  switch(_k)
  {
    case 0: //Play
      playGO.SetActive(true);
      break;

    case 1: //Web levels
      //Display webLevels GameObject, retrieve info if connected !
      webLevelsGO.SetActive(true);
      break;

    case 2: //Create
      //Load Editor Level
      Application.LoadLevel("Editor");
      break;

    case 3: //Settings

      break;
  }
}