<?php   
	if (IsSet($_POST["user"])){
        $path = getcwd().'/../config/config.json';
        $user = $_POST["user"];
        $field = $_POST["field"];
        $value = $_POST["value"];      
        if (file_exists($path)) {          
            $fp = fopen($path, "r");
            $txt = "";
            while (!feof ($fp)) {
                $txt = $txt . fgets($fp,4096);
            }
            fclose($fp); 
            $json = json_decode($txt); 

            if(!property_exists($json, $user)){
                $json->$user = new class{};
            }               
            $json->$user->$field = $value;                                        
            return file_put_contents($path, json_encode($json));
        }        
    }

?>