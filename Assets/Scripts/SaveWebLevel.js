#pragma strict
@script ExecuteInEditMode

var isRequesting : boolean = false;

private var url = "http://www.ycribier.com/challenge42/db/42SaveLevel.php"; 

var rect : Rect;

var levelName : String;
var stringKey : String;
var author : String;

function OnGUI ()
{	
	if ( GUILayout.Button("save") ) SendRequest();
}	

function SendRequest ()
{
	isRequesting = true;
	
	var request : WWW = new WWW( WWW.EscapeURL(url + "?levelName=" + levelName + "&stringKey=" + stringKey + "&author=" + author) );
	
	yield request;
	
	if (request.error)
	{
        Debug.Log("There was an error: " + request.error);
    }
	else
	{
		if (request.text == "0")
			Debug.Log("good " + request.text);
		else
			Debug.Log("not good " + request.text);
	}
		
	isRequesting = false;
}
