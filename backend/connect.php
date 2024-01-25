<?php

    $usuario = 'backha49_fw_admin';
    $senha= 'fwadmin2024';
    $servidor = '162.241.203.141';
    $banco = 'backha49_fw';
    $conexao = new mysqli($servidor, $usuario, $senha, $banco);

    if (!$conexao){
        die ("Erro de conexão com localhost, o seguinte erro ocorreu -> ".mysql_error());
    }    

?>