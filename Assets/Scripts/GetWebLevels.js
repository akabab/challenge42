#pragma strict
import System.Collections.Generic;

@script ExecuteInEditMode

var isRequesting : boolean = false;

private var getLevelsUrl = "http://www.ycribier.com/challenge42/db/42Levels.php";

var groupRect : Rect;

var pinkTexture : Texture2D;
var whiteTexture : Texture2D;

var tabButtonStyle : GUIStyle;
var tabStyle : GUIStyle;

var triangleTextures : Texture2D[];

var display : boolean;

var scrollPosition : Vector2;

private var trianglePos : Vector2;
private var k : int = 0;

var ratingBG : Texture2D;
var ratingAlphaBG : Texture2D;

var rect : Rect;

//rqID >> {0 : Name CRST, 1 : Name DESC, 2 : Author CRST, 3 : Author DESC, 4 : Rating CRST, 5 : Rating DESC}

var levelData : String;

var levelNameArray : Array;
var keyStringArray : Array;
var authorArray : Array;
//var ratingArray : Array;
var ratingArray : List.<float>;

var levelName : String[];
var keyString : String[];
var author : String[];
var rating : float[];

var texture : Texture2D[];
var otherStyle : GUIStyle[];
var menuGO : GameObject;
var size : Sizes;

function Awake ()
{
  size.SetSizes();
  display = true;

  groupRect = new Rect((Screen.width - 750) / 2, (Screen.height - 500) / 2, 750, 500);
  levelNameArray = new Array();
  keyStringArray = new Array();
  authorArray = new Array();
  //ratingArray = new Array();
  ratingArray = new List.<float>();

  SendRequest(0);
  trianglePos = Vector2(560,22);
  k = 1;
}


function OnGUI ()
{
  //Back button
  if ( GUI.Button(Rect(Screen.width - size.smallButton - size.bigMargin*2, Screen.height - size.smallButton, size.smallButton, size.smallButton), GUIContent(texture[0], "Back"), otherStyle[0]) ) {
    gameObject.SetActive(false);
    menuGO.SetActive(true);
  }

  if (display)
  {
    GUI.depth = -1;
    GUI.BeginGroup(groupRect);

    GUI.DrawTexture(Rect(0, 0, groupRect.width, groupRect.height), pinkTexture);
    GUI.DrawTexture(Rect(2, 2, groupRect.width - 4, groupRect.height - 4), whiteTexture);

    if( GUI.Button(Rect(5, 5, 245, 45), "Name", tabButtonStyle) && !isRequesting )
    {
      trianglePos = Vector2(80,22);

      if(k != 1)
      {
        SendRequest(0);
        k = 1;
      }
      else
      {
        SendRequest(1);
        k = 2;
      }
    }
    if( GUI.Button(Rect(250, 5, 250, 45), "Author", tabButtonStyle) && !isRequesting )
    {
      trianglePos = Vector2(312,22);

      if(k != 1)
      {
        k = 1;
        SendRequest(2);
      }
      else
      {
        k = 2;
        SendRequest(3);
      }
    }
    if( GUI.Button(Rect(500, 5, 245, 45), "Rating", tabButtonStyle) && !isRequesting )
    {
      trianglePos = Vector2(560,22);

      if(k != 1)
      {
        k = 1;
        SendRequest(5);
      }
      else
      {
        k = 2;
        SendRequest(4);
      }
    }

    GUI.DrawTexture(Rect(trianglePos.x, trianglePos.y, 16, 16), triangleTextures[k]);

    //SCROLL
    GUI.BeginGroup(Rect(0,50,750,450));

    scrollPosition = GUI.BeginScrollView(Rect(0,0,780,450), scrollPosition, Rect(0,00,700,levelName.Length*40));

    for(var i : int = 0; i < levelName.Length; i++)
    {
       if( GUI.Button(Rect(5, i*40, 245, 40), "" + levelName[i], tabStyle) )
       {
        PlayerPrefs.DeleteKey("levelIndex");

        PlayerPrefs.SetString("levelIndex", "666");
        //PlayerPrefs.SetString("level666", levelName[i] + "#" + keyString[i] );
        PlayerPrefs.SetString("level666", "" + keyString[i] );

        Application.LoadLevel ("Game");
       }

       GUI.Label(Rect(250, i*40, 250, 40), "" + author[i], tabStyle);

       //GUI.Label(Rect(500, i*40, 245, 40), "" + rating[i].ToString(), tabStyle);

       GUI.BeginGroup(Rect(546,0,150,1000000));

       GUI.DrawTexture(Rect(0, 10 + i*40, 154, 20), ratingBG);

       GUI.DrawTexture(Rect(-3 + rating[i]*32, 10 + i*40, 154, 20), ratingAlphaBG);

       GUI.EndGroup();
    }

    GUI.EndScrollView();

    GUI.EndGroup();

    GUI.EndGroup();
  }

}

function SendRequest (_rdID : int)
{
  isRequesting = true;

  var request : WWW = WWW( getLevelsUrl + "?rqID=" + _rdID );

  yield request;

  if (request.error)
  {
    print("There was an error posting the high score: " + request.error);

    //Connection problem -> display message
  }
  else
  {
    levelData = request.text;
    //Debug.Log(levelData);

    FillLevelArrays();
  }
  isRequesting = false;
}


function FillLevelArrays ()
{
  levelNameArray = new Array();
  keyStringArray = new Array();
  authorArray = new Array();
  ratingArray = new List.<float>();

  var levelEntries : String[] = levelData.Split("\n"[0]);

  for (var entry : String in levelEntries)
  {
    if (entry.Length > 0)
    {
      var entrySplit = entry.Split("-"[0]);

      levelNameArray.Push(entrySplit[0]);
      keyStringArray.Push(entrySplit[1]);
      authorArray.Push(entrySplit[2]);
      ratingArray.Add(float.Parse(entrySplit[3]));
    }
  }

  levelName = levelNameArray.ToBuiltin(String) as String[];
  keyString = keyStringArray.ToBuiltin(String) as String[];
  author = authorArray.ToBuiltin(String) as String[];
  //rating = ratingArray.ToBuiltin(float) as float[];
  rating = ratingArray.ToArray();
}
