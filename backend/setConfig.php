<?php   
	if (IsSet($_POST["user"]) && IsSet($_POST["field"]) && IsSet($_POST["file"]) && IsSet($_POST["value"])){

        $path = getcwd().'/../assets/func/'.$_POST["user"].'/'.$_POST["file"];
//        $path = getcwd().'/../config/config.json';
//        $user = $_POST["user"];
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
/*
            if(!property_exists($json, $field)){
                $json->$field = new class{};
            }
*/
            $json->$field = $value;                                        
            return file_put_contents($path, json_encode($json));
        }        
    }

?>