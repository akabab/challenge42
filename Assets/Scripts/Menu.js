#pragma strict

var background : Texture2D;
var buttonStyle : GUIStyle[];

var playGO : GameObject;
var webLevelsGO : GameObject;
var createGO : GameObject;
var settingsGO : GameObject;

function OnGUI() {
  var k : int = 0;

  for (var j : int = 0; j < 2; j++) {
    for (var i : int = 0; i < 2; i++) {
      if (GUI.Button(Rect(Screen.width/2 - 180 + i*180, Screen.height/2 - 180 + j*180, 168, 168), "", buttonStyle[k])) {
      	MenuAction(k);
      }
      k++;
    }
  }
}

function MenuAction(k : int) {
  if (k != 3)
    this.gameObject.SetActive(false);

  switch (k) {
    case 0: //Play
      playGO.SetActive(true);
      break;

    case 1: //Web levels
      webLevelsGO.SetActive(true);
      break;

    case 2: //Create
      SceneManagement.SceneManager.LoadScene("Editor");
      break;

    case 3: //Settings
      // TODO
      break;
  }
}