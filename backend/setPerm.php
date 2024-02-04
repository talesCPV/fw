<?php   
	if (IsSet($_POST["hash"])){
        $path = getcwd().'/../config/menu.json';
        $json = $_POST["json"];

        $menu = json_decode($json, true);
        var_dump($menu['menu']);

        return file_put_contents($path, json_encode($menu));

         
    }
 
?>