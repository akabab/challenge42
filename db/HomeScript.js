#pragma strict

var isLogged : boolean = false;

var deviceGotAcc : boolean = false;
var createAcc : boolean = false;

private var hashKey="mySecretKey"; 
private var LogInAccountUrl="http://www.advicemallard.com/bdd_manager/loginaccount.php?"; 
private var CreateAccountUrl="http://www.advicemallard.com/bdd_manager/createaccount.php?";
 
var accT : String =  "" ;
var pwdT : String =  "" ;

function Awake () 
{ 
	//PlayerPrefs.SetString("acc", "JeremyDou"); 
    //PlayerPrefs.SetString("pwd", ""); 
    //PlayerPrefs.SetInt("speedFactor", 1);
    
	GameObject.Find("AnimatedSprite").GetComponent(tk2dBaseSprite).color = Color.black;
	
	var accPref : String = PlayerPrefs.GetString("acc");
	if ( accPref != "")
	{
		deviceGotAcc = true;
		ServerSync();
	}
	else
	{
		deviceGotAcc = false;
	}
	
	
}


function OnGUI()
{
	if (!deviceGotAcc)
	{
		if ( !createAcc)
		{
			if( GUI.Button(Rect(Screen.width/3, Screen.height/2, 400,200), "Create Account"))
			{
			
				createAcc = true;
				
			}
		}
		
		if ( createAcc)
		{
			accT = GUI.TextField( Rect(Screen.width/3, Screen.height/2, 100,20), accT, 55);
			pwdT = GUI.TextField( Rect(Screen.width/3, Screen.height/2 + 50 , 100,20), pwdT, 55);
			
			if( GUI.Button(Rect(Screen.width/3, Screen.height/2 + 100 , 100,50), "Accept"))
			{
				CreateAcc(accT, pwdT);
			}
		}
	}
}

function CreateAcc(_acc : String, _pwd: String)
{
	var acc : String = _acc;
	var pwd : String = _pwd;
	
	var hash :String =Md5.Md5Sum(acc + pwd + hashKey); 
	
	
	var CreateAccountUrl_Final :String = CreateAccountUrl + "&acc=" + WWW.EscapeURL(acc) + "&pwd=" + WWW.EscapeURL(pwd) + "&hash=" + hash;
 
    var hs_post : WWW = WWW(CreateAccountUrl_Final);
    yield hs_post;
    
    if(hs_post.error) {
        print("There was an error: " + hs_post.error);
    }
    else 
    {
    	if (hs_post.text == "0")
    	{ 
    		deviceGotAcc = true;
    		PlayerPrefs.SetString("acc", acc); 
    		PlayerPrefs.SetString("pwd", pwd); 
    		SyncSuccess("0");
    	}
    	if (hs_post.text == "fail")
    	{
    		Debug.Log ("ERROR: Already Used!");
    	}
    	if (hs_post.text != "fail" && hs_post.text != "success")
    	{
    		Debug.Log ("Recieved from server: " + hs_post.text);
    	}
   		 
    }
	
}

function ServerSync()
{
	var acc : String = PlayerPrefs.GetString("acc");
	var pwd : String = PlayerPrefs.GetString("pwd");
	
	var hash :String =Md5.Md5Sum(acc + pwd + hashKey); 
	
	
	var LogInAccountUrl_Final :String = LogInAccountUrl + "&acc=" + WWW.EscapeURL(acc) + "&pwd=" + WWW.EscapeURL(pwd) + "&hash=" + hash;
 
    var hs_post : WWW = WWW(LogInAccountUrl_Final);
    
    
    yield hs_post;
    
    if(hs_post.error) {
        print("There was an error: " + hs_post.error);
    }
    else 
    {
    	if (hs_post.text != "fail")
    	{
    		SyncSuccess(hs_post.text);
    	}
    	if (hs_post.text == "fail")
    	{
    		Debug.Log ("ERROR: Wrong Account or Password!");
    	}
    	if (hs_post.text != "fail" && hs_post.text != "success")
    	{
    		//Debug.Log ("Recieved from server: " + hs_post.text);
    	}
   		 
    }
}

function SyncSuccess(_metters : String)
{
	GameObject.Find("AnimatedSprite").GetComponent(tk2dBaseSprite).color = Color.white;
	
	var metterInt : int = parseInt(_metters);
	GameObject.FindWithTag("Player").GetComponent(Player).meters = metterInt;
	
	isLogged = true;
}


/*

var hash :String =Md5.Md5Sum(accname + accpassword + secretKey); 
	
    // Pour encrypter les données de type String on utilise : WWW.EscapeURL(StringToEncrypt) 
    var LogInAccountUrl_Final :String = LogInAccountUrl + "&accname=" + WWW.EscapeURL(accname) + "&accpassword=" + WWW.EscapeURL(accpassword) + "&hash=" + hash;
 
    var hs_post : WWW = WWW(LogInAccountUrl_Final);
    yield hs_post;
    
    if(hs_post.error) {
        print("There was an error: " + hs_post.error);
    }
    else 
    {
    	if (hs_post.text == "success")
    	{
    		Debug.Log ("Logged!");
    	}
    	if (hs_post.text == "fail")
    	{
    		Debug.Log ("ERROR: Wrong Account or Password!");
    	}
    	if (hs_post.text != "fail" && hs_post.text != "success")
    	{
    		Debug.Log ("Recieved from server: " + hs_post.text);
    	}
   		 
    }

*/