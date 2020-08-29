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
		
			$query = "SELECT * FROM `AccTest` WHERE `acc`='$acc' ";
			$result = mysql_query($query) or die('Query failed: ' . mysql_error());
			$num_results = mysql_num_rows($result);
			
				if ($num_results ==0)
				{
					$query2 = "insert into `AccTest` values ('$acc', '$pwd', NOW(), 0,1)"; 
					$result2 = mysql_query($query2) or die('Query failed: ' . mysql_error()); 
					
					echo mysql_result($result2, 0); // outputs third employee's name
					/*
					$num_results2 = mysql_num_rows($result2);
					if ($num_results2 >0)
					{
						echo "success";
					}
					if ($num_results2 ==0)
					{
						echo "fail";
					}
					*/
				}
				
				if ($num_results >0)
				{
					echo "fail";
				}
        } 
?>