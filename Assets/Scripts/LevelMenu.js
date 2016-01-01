#pragma strict

var resolution : Vector2;
var size : Sizes;

var background : Texture2D;

var texture : Texture2D[];
var otherStyle : GUIStyle[];

var levelsUnlocked : int = 0;

var levelToLoad : String;

var propSize : int;

var menuGO : GameObject;

function Awake ()
{
  size.SetSizes();

  if( PlayerPrefs.HasKey("levelsUnlocked") )
  {
    levelsUnlocked =  PlayerPrefs.GetInt("levelsUnlocked");
  }
  else levelsUnlocked = 1;

  //webLevels_GO.GetComponent(GetWebLevels).display = false;
}


function Update()
{
  size.SetSizes();

  propSize = Screen.height / 6;
}

//var webLevels_GO : GameObject;
//var webLevelToggle : boolean;

function OnGUI()
{
  //RESET LEVELS
//  if( GUI.Button(Rect(Screen.width - 64, Screen.height - 44, 44, 44), texture[0], otherStyle[0]) ) PlayerPrefs.DeleteAll();
//  GUI.DrawTexture(Rect(0,0,Screen.width,Screen.height), background);

  DrawLevelBoxes();

  //Back button
  if ( GUI.Button(Rect(Screen.width - size.smallButton - size.bigMargin*2, Screen.height - size.smallButton, size.smallButton, size.smallButton), GUIContent(texture[0], "Back"), otherStyle[0]) ) {
    gameObject.SetActive(false);
    menuGO.SetActive(true);
  }

  if( GUI.Button(Rect(0, 0, 20, 20), "", otherStyle[3]) ) levelsUnlocked = Mathf.Max(1, levelsUnlocked - 1);
  if( GUI.Button(Rect(Screen.width - 20, 0, 20, 20), "", otherStyle[3]) ) levelsUnlocked = Mathf.Min(levelsUnlocked + 1, 20);
  /*
  if( GUI.Button(Rect(size.bigMargin*2, Screen.height - size.smallButton, size.smallButton, size.smallButton), GUIContent(texture[0], "Create Level"), otherStyle[0]) ) SceneManagement.SceneManager.LoadScene( "Editor" );

  //levelToLoad = GUI.TextField(Rect((Screen.width - Screen.width*0.8)/2, Screen.height - size.smallButton*0.8, Screen.width*0.8, 22), levelToLoad);

  //if( GUI.Button(Rect((Screen.width - Screen.width*0.8)/2 + Screen.width*0.8 + size.mediumMargin, Screen.height - size.smallButton, size.smallButton, size.smallButton), GUIContent(texture[1], "Web Levels"), otherStyle[0]) )
  if( GUI.Button(Rect(Screen.width - (size.smallButton + size.bigMargin*2), Screen.height - size.smallButton, size.smallButton, size.smallButton), GUIContent(texture[1], "Web Levels"), otherStyle[0]) )
  {
    if(!webLevelToggle)
    {
      webLevels_GO.GetComponent(GetWebLevels).display = true;

      webLevelToggle = true;
    }
    else
    {
      webLevels_GO.GetComponent(GetWebLevels).display = false;

      webLevelToggle = false;
    }
  }
  */
  /*if(levelToLoad)
  {
    if( GUI.Button(Rect((Screen.width - Screen.width*0.8)/2 + Screen.width*0.8 + size.mediumMargin, Screen.height - size.smallButton, size.smallButton, size.smallButton), GUIContent(texture[1], "Load"), otherStyle[0]) )
    {
      PlayerPrefs.DeleteKey("levelIndex");
      PlayerPrefs.SetString("levelIndex", "999");
      PlayerPrefs.SetString("level999", levelToLoad);

      SceneManagement.SceneManager.LoadScene ("Game");
    }
  }*/
  /*
  if(GUI.tooltip)
  {
    GUI.Label(Rect(Input.mousePosition.x - 60, Screen.height - Input.mousePosition.y - 30, 120, 25), "" + GUI.tooltip, otherStyle[2]);
  }
  */
}

function DrawLevelBoxes ()
{
  var k : int = 1;

  GUI.BeginGroup(Rect( ( Screen.width - (propSize*5 + propSize*0.4) )/2, ( Screen.height - (propSize*4 + propSize*0.3) )/2, Screen.width, Screen.height) );

  for(var j : int = 0; j < 4; j++)
  {
    for(var i : int = 0; i < 5; i++)
    {
      if(k <= levelsUnlocked)
      {
        if( GUI.Button(Rect(i*propSize*1.1, j*propSize*1.1, propSize, propSize), "" + k, otherStyle[0]) )
        {
          PlayerPrefs.DeleteKey("levelIndex");
          PlayerPrefs.SetString("levelIndex", k.ToString() );

          SceneManagement.SceneManager.LoadScene("Game");
        }
      }
      else
      {
        GUI.Label(Rect(i*propSize*1.1, j*propSize*1.1, propSize, propSize), "", otherStyle[1]);
      }

      k++;
    }
  }

  GUI.EndGroup();
}