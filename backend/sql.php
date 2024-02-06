<?php

    $query_db = array(
        /* LOGIN */
        "LOG-0"  => 'CALL sp_login("x00","x01");', // USER, PASS

        /* USERS */
        "USR-0"  => 'CALL sp_viewUser("x00","x01","x02","x03");', // #, FIELD,SIGNAL, VALUE
        "USR-1"  => 'CALL sp_setUser("x00",x01,"x02","x03",x04);', // #, ID, EMAIL, PASS, ACCESS
        "USR-2"  => 'CALL sp_updatePass("x00","x01");', // #, PASS
        "USR-3"  => 'CALL sp_check_usr_mail("x00");', // #

        /* CALENDAR */
        "CAL-0"  => 'CALL sp_view_calendar("x00","x01","x02");', // #,DT_INI, DT_FIN
        "CAL-1"  => 'CALL sp_set_calendar("x00","x01","x02");', // #, DT_AGD, OBS
        
        /* MAIL */
        "MAIL-0"  => 'CALL sp_set_mail("x00",x01,"x02");', // #, ID_TO, MESSAGE
        "MAIL-1"  => 'CALL sp_view_mail("x00",x01);', // #, I_SEND
        "MAIL-2"  => 'CALL sp_all_mail_adress("x00");', // #                
        "MAIL-3"  => 'CALL sp_del_mail("x00","x01",x02, x03);', // #, DATA, ID_FROM, ID_TO
        "MAIL-4"  => 'CALL sp_mark_mail("x00","x01",x02, x03);', // #, DATA, ID_FROM, ID_TO

        /* ADMIN */
        "ADM-0"  => 'CALL sp_set_setor("x00",x01,"x02");', // #, ID_SETOR, NOME
        "ADM-1"  => 'CALL sp_view_setor("x00","x01","x02","x03");', // #, FIELD,SIGNAL, VALUE
        "ADM-2"  => 'CALL sp_set_cargo("x00",x01,"x02",x03,x04,"x05");', // #, ID_CARGO, CARGO, SALARIO, MENSAL, CBO
        "ADM-3"  => 'CALL sp_view_cargo("x00","x01","x02","x03");', // #, FIELD,SIGNAL, VALUE
        "ADM-4"  => 'CALL sp_set_usr_perm_perf("x00",x01,"x02");', // #, ID, NOME
        "ADM-5"  => 'CALL sp_view_usr_perm_perf("x00","x01","x02","x03");', // #, FIELD,SIGNAL, VALUE

    );

?>