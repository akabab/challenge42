<?php 
		$path = $_SERVER['DOCUMENT_ROOT'];
		$path .= "/config.php";
		include_once($path);

        $acc = mysql_real_escape_string($_GET['acc'], $db_con); 
        $pwd = mysql_real_escape_string($_GET['pwd'], $db_con); 
 
        $hash = $_GET['hash']; 

        $real_hash = md5($acc . $pwd . $secretKey); 

        if($real_hash == $hash) 
		{ 
		
		$query = "SELECT * FROM `AccTest` WHERE `acc`='$acc' AND `pwd`='$pwd'";
		$result = mysql_query($query) or die('Query failed: ' . mysql_error());
		$num_results = mysql_num_rows($result);
		
			if ($num_results ==0)
			{
				echo "fail";	
			}
			
			if ($num_results >0)
			{
				
				$query2 = "UPDATE `AccTest` SET metters = metters + (TIMESTAMPDIFF(SECOND,lastlog , NOW() )*(4*sfvalue)) WHERE acc = '$acc'";			
				$result2 = mysql_query($query2) or die('Query failed: ' . mysql_error());
				
				$query22 = "UPDATE `AccTest` SET lastlog = NOW() WHERE acc= '$acc'";		
				$result22 = mysql_query($query22) or die('Query failed: ' . mysql_error());
				
				
				$query3 = "SELECT metters FROM `AccTest` WHERE `acc`='$acc'";
				$result3 = mysql_query($query3) or die('Query failed: ' . mysql_error());
				$num_results3 = mysql_num_rows($result3);
				if ($num_results3 >0)
				{
					//$toSend = mysql_fetch_array($num_results3);
					//echo $result3;
					
					echo mysql_result($result3, 0); // outputs third employee's name
					
				}
				
				
			}
        } 
?>