<?php   
	if (IsSet($_POST["hash"])){
        $path = getcwd().'/../config/menu.json';
        $file = $_POST["file"];

        if (file_exists($path)) {   
            
/*            
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
*/            
        }        
    }

?>