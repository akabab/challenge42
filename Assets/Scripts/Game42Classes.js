#pragma strict

class Squares extends System.Object
{
	var index : int;
	var position : Vector3 = Vector3(0,0,0);
	var color : int = 0; //{0 = default grey, 1 = blue, 2 = green, 3 = orange}
	var starOrArrow : int = 0; //{0 = default, 1 = star, 2 = playerTop, 3 = playerRight, 4 = playerBottom, 5 = playerLeft}
	var isSelected : boolean = false;
}

class Functions extends System.Object
{
	var nbActions : int = 1;
	var action : Actions[] = new Actions[10];
}

class Actions extends System.Object
{
	var isSelected : boolean;
	var command : int;
	var color : int;
}

class Commands extends System.Object
{
	var isDesactivated : boolean;
	var isSelected : boolean;
}

class Colors extends System.Object
{
	var isSelected : boolean;
}

class Arrow extends System.Object
{
	var index : int = -1;
	enum Directions {Top, Right, Bottom, Left}
	
	var direction : Directions;
}

class Sizes
{
	var screenWidth : int;
	var screenHeight : int;
	
	var grid : int;
	var square : int;
	var smallButton : int;
	var bigButton : int;
	
	var smallMargin : int;
	var mediumMargin : int;
	var bigMargin : int;
	
	var smallOffset : int;
	var mediumOffset : int;
	var bigOffset : int;
	
	function SetSizes ()
	{
		screenWidth = Screen.width;
		screenHeight = Screen.height;
		
		square = Mathf.Round( screenHeight / 18.8 );
		grid = Mathf.Round( square*16 );
		
		smallButton = Mathf.Round( square*1.1 );
		bigButton = Mathf.Round( square*1.2 );
		
		smallMargin = Mathf.Round( square*0.25 );
		mediumMargin = Mathf.Round( square*0.5 );
		bigMargin = Mathf.Round( square*0.75 );
		
		smallOffset = Mathf.Round( smallMargin/10 );
		mediumOffset = Mathf.Round( mediumMargin/10 );
		bigOffset = Mathf.Round( bigMargin/10 );
	}
}