<?php
// Connection's Parameters
$db_host="advicemallardcom.ipagemysql.com";
$db_name="bdd_name";
$username="bdd_user";
$password="19122911";
$db_con=mysql_connect($db_host,$username,$password);
$connection_string=mysql_select_db($db_name);
// Connection
mysql_connect($db_host,$username,$password);
mysql_select_db($db_name);

$secretKey="mySecretKey"; # Change this value to match the value stored in the client javascript below 
//$db_host="testpipe.99k.org";
//$db_name="testpipe_99k_testdb";
//$username="842380_testuser";
//$password="957957!!";
?>