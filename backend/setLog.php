<?php   

        function getEmail(){
                include "connect.php";

                $rows = array();
                $query = 'SELECT email FROM tb_usuario WHERE hash="'.$_POST["hash"].'";'
                $result = mysqli_query($conexao, $query);
                if(is_object($result)){
                    if($result->num_rows > 0){			
                        while($r = mysqli_fetch_assoc($result)) {
                            $rows[] = $r;
                        }
                    }        
                }
    
                var_dump($rows);


                $conexao->close(); 
        }


        if (IsSet($_POST["line"])){


                $path = getcwd().'/../config/log/'.date("m_Y").'.txt';
        //        $line = $_POST["line"]; 
                $line = mb_convert_encoding($_POST["line"],'UTF-8'); 
                
                $fp = fopen($path, "a+");
        //        $fp = "\xEF\xBB\xBF".$fp;
        //        fputs($fp, $line."\n");
                fwrite($fp, utf8_encode($line."\n")); 
                fclose($fp);    
        }

?>