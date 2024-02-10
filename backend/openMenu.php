<?php   

function addItem($access,$obj){
  $menu = [];

  for($i = 0; $i< count($obj); $i++){  

    if (in_array($access,$obj[$i]->access )) {

      $item = new stdClass();
      $item->modulo = $obj[$i]->modulo;
//      $item->script = $obj[$i]->script;
      $item->icone = $obj[$i]->icone;
      $item->link = $obj[$i]->link;
      $item->janela = $obj[$i]->janela;
      $item->label = $obj[$i]->label;
      $item->width = $obj[$i]->width;
      $item->access = crip(json_encode($obj[$i]->access));
      $item->itens = [];

      if(count($obj[$i]->itens) > 0){
          array_push($item->itens, addItem($access, $obj[$i]->itens));          
      } 
      array_push($menu, $item);
    }       
  }

  return $menu;
}

  $out = [];

	if (IsSet($_POST["hash"])){
	  $path = "../config/menu.json";
	  $hash = $_POST["hash"];
    $access = -1;
    
    include "connect.php";
    include "crip.php";

    $query = "SELECT access FROM tb_usuario WHERE hash=\"$hash\";";

// echo $query;    

    $result = mysqli_query($conexao, $query);
		$qtd_lin = $result->num_rows;

		if($qtd_lin > 0){
      $row = $result->fetch_assoc();
//      var_dump($row);
      $access = $row["access"];

		}

	    $conexao->close();  

      if (file_exists($path)) {
          $fp = fopen($path, "r");
          $resp = "";
          while (!feof ($fp)) {
              $resp = $resp . fgets($fp,4096);
          }
          fclose($fp);
          $json = json_decode($resp);
          $out = addItem($access,$json->itens);
      }            

  }
        
//    var_dump($out);
	print json_encode($out);

?>