 DROP PROCEDURE sp_getHash;
DELIMITER $$
	CREATE PROCEDURE sp_getHash(		
		IN Iemail varchar(80),
		IN Isenha varchar(30)
    )
	BEGIN    
		SELECT SHA2(CONCAT(Iemail, Isenha), 256) AS HASH;
	END $$
DELIMITER ;

/* USER */

 DROP PROCEDURE sp_setUser;
DELIMITER $$
	CREATE PROCEDURE sp_setUser(	
		IN Ihash varchar(64),
        IN Iid int(11),
		IN Iemail varchar(80),
		IN Isenha varchar(30),
        IN Iaccess int(11)
    )
	BEGIN    
		SET @access = (SELECT IFNULL(access,-1) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		IF(@access IN (0))THEN
			IF(Iemail="")THEN
				DELETE FROM tb_usuario WHERE id=Iid;
            ELSE			
				IF(Iid=0)THEN
					INSERT INTO tb_usuario (email,hash,access)VALUES(Iemail,SHA2(CONCAT(Iemail, Isenha), 256),Iaccess);            
                ELSE
					IF(Isenha="")THEN
						UPDATE tb_usuario SET email=Iemail, access=Iaccess WHERE id=Iid;
                    ELSE
						UPDATE tb_usuario SET email=Iemail, hash=SHA2(CONCAT(Iemail, Isenha), 256), access=Iaccess WHERE id=Iid;
                    END IF;
                END IF;
            END IF;
            SELECT 1 AS ok;
		ELSE 
			SELECT 0 AS ok;
        END IF;
	END $$
DELIMITER ;

 DROP PROCEDURE sp_viewUser;
DELIMITER $$
	CREATE PROCEDURE sp_viewUser(	
		IN Ihash varchar(64),
		IN Ifield varchar(30),
        IN Isignal varchar(4),
		IN Ivalue varchar(50)
    )
	BEGIN    
		SET @access = (SELECT IFNULL(access,-1) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		IF(@access IN(0))THEN
			SET @quer =CONCAT('SELECT id,email,id_func,access, IF(access=0,"ROOT",IFNULL((SELECT nome FROM tb_usr_perm_perfil WHERE USR.access = id),"DESCONHECIDO")) AS perfil FROM tb_usuario AS USR WHERE ',Ifield,' ',Isignal,' ',Ivalue,';');
			PREPARE stmt1 FROM @quer;
			EXECUTE stmt1;
		ELSE 
			SELECT 0 AS id, "" AS email, 0 AS id_func, 0 AS access;
        END IF;
	END $$
DELIMITER ;

 DROP PROCEDURE sp_updatePass;
DELIMITER $$
	CREATE PROCEDURE sp_updatePass(	
		IN Ihash varchar(64),
		IN Isenha varchar(30)
    )
	BEGIN    
		SET @call_id = (SELECT IFNULL(id,0) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		IF(@call_id > 0)THEN
			UPDATE tb_usuario SET hash = SHA2(CONCAT(email, Isenha), 256) WHERE id=@call_id;
            SELECT 1 AS ok;
		ELSE 
			SELECT 0 AS ok;
        END IF;
	END $$
DELIMITER ;

 DROP PROCEDURE sp_set_usr_perm_perf;
DELIMITER $$
	CREATE PROCEDURE sp_set_usr_perm_perf(	
		IN Ihash varchar(64),
        In Iid int(11),
		IN Inome varchar(30)
    )
	BEGIN    
		SET @access = (SELECT IFNULL(access,-1) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
        IF(@access IN(0))THEN
			IF(Iid = 0 AND Inome != "")THEN
				INSERT INTO tb_usr_perm_perfil (nome) VALUES (Inome);
            ELSE
				IF(Inome = "")THEN
					DELETE FROM tb_usr_perm_perfil WHERE id=Iid;
				ELSE
					UPDATE tb_usr_perm_perfil SET nome = Inome WHERE id=Iid;
                END IF;
            END IF;			
			SELECT * FROM tb_usr_perm_perfil;
        END IF;
	END $$
DELIMITER ;

 DROP PROCEDURE sp_view_usr_perm_perf;
DELIMITER $$
	CREATE PROCEDURE sp_view_usr_perm_perf(	
		IN Ihash varchar(64),
		IN Ifield varchar(30),
        IN Isignal varchar(4),
		IN Ivalue varchar(50)
    )
	BEGIN    
		SET @access = (SELECT IFNULL(access,-1) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		IF(@access IN (0))THEN
			SET @quer = CONCAT('SELECT * FROM tb_usr_perm_perfil WHERE ',Ifield,' ',Isignal,' ',Ivalue,';');
			PREPARE stmt1 FROM @quer;
			EXECUTE stmt1;
		ELSE 
			SELECT 0 AS id, "" AS nome;
        END IF;
	END $$
DELIMITER ;


/* LOGIN */

 DROP PROCEDURE sp_login;
DELIMITER $$
	CREATE PROCEDURE sp_login(	
		IN Iemail varchar(80),
		IN Isenha varchar(30)
    )
	BEGIN    
		SET @hash = (SELECT SHA2(CONCAT(Iemail, Isenha), 256));
        SET @id_func = (SELECT id_func FROM tb_usuario WHERE hash=@hash);
        IF(@id_func)THEN
			SELECT USR.id, USR.email,USR.hash,USR.access,FNC.nome
            FROM tb_usuario AS USR
            INNER JOIN tb_funcionario AS FNC
            ON USR.id_func = FNC.id;
        ELSE
			SELECT *, SUBSTRING_INDEX(email,"@",1) AS nome FROM tb_usuario WHERE hash=@hash;
        END IF;
        
		
	END $$
DELIMITER ;

/* CALENDAR */

 DROP PROCEDURE sp_view_calendar;
DELIMITER $$
	CREATE PROCEDURE sp_view_calendar(	
		IN Ihash varchar(64),
		IN IdataIni date,
		IN IdataFin date
    )
	BEGIN    
		SET @id_call = (SELECT IFNULL(id,0) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		SELECT * FROM tb_calendario WHERE id_user=@id_call AND data_agd>=IdataIni AND data_agd<=IdataFin;
	END $$
DELIMITER ;

 DROP PROCEDURE sp_set_calendar;
DELIMITER $$
	CREATE PROCEDURE sp_set_calendar(	
		IN Ihash varchar(64),
		IN Idata date,
		IN Iobs varchar(255)
    )
	BEGIN    
		SET @id_call = (SELECT IFNULL(id,0) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
        IF(@id_call >0)THEN
			SET @exist = (SELECT COUNT(*) FROM tb_calendario WHERE id_user=@id_call AND data_agd = Idata);
			IF(@exist AND Iobs = "")THEN
				DELETE FROM tb_calendario WHERE id_user=@id_call AND data_agd = Idata; 
			ELSE
				INSERT INTO tb_calendario (id_user, data_agd, obs) VALUES(@id_call, Idata, Iobs)
                ON DUPLICATE KEY UPDATE obs=Iobs;
			END IF;
        END IF;
	END $$
DELIMITER ;

/* MAIL */

 DROP PROCEDURE sp_set_mail;
DELIMITER $$
	CREATE PROCEDURE sp_set_mail(	
		IN Ihash varchar(64),
        IN Iid_to int(11),
		IN Imessage varchar(512)
    )
	BEGIN    
		SET @id_call = (SELECT IFNULL(id,0) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
        IF(@id_call >0)THEN
			INSERT INTO tb_mail (id_from,id_to,message) VALUES (@id_call,Iid_to,Imessage);
        END IF;
	END $$
DELIMITER ;

 DROP PROCEDURE sp_view_mail;
DELIMITER $$
	CREATE PROCEDURE sp_view_mail(	
		IN Ihash varchar(64)
    )
	BEGIN    
		SET @id_call = (SELECT IFNULL(id,0) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		IF(@id_call > 0)THEN
			SELECT MAIL.*, USR.email AS sender
			FROM tb_mail AS MAIL 
			INNER JOIN tb_usuario AS USR
			ON MAIL.id_from = USR.id AND id_to = @id_call;
        END IF;
	END $$
DELIMITER ;

 DROP PROCEDURE sp_read_mail;
DELIMITER $$
	CREATE PROCEDURE sp_read_mail(	
		IN Ihash varchar(64),
        IN Idata datetime,
        IN Iid_from int(11)
    )
	BEGIN    
		SET @id_call = (SELECT IFNULL(id,0) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		IF(@id_call > 0)THEN
			UPDATE tb_mail SET looked=1 WHERE data = Idata AND id_from = Iid_from AND id_to = @id_call;			
        END IF;
	END $$
DELIMITER ;

/* ADMIN */
 DROP PROCEDURE sp_set_setor;
DELIMITER $$
	CREATE PROCEDURE sp_set_setor(	
		IN Ihash varchar(64),
        In Iid_setor int(11),
		IN Inome varchar(30)
    )
	BEGIN    
		SET @access = (SELECT IFNULL(access,-1) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
        IF(@access IN(0))THEN
			IF(Iid_setor = 0)THEN
				INSERT INTO tb_setores (nome) VALUES (Inome);
            ELSE
				IF(Inome = "")THEN
					DELETE FROM tb_setores WHERE id=Iid_setor;
				ELSE
					UPDATE tb_setores SET nome = Inome WHERE id=Iid_setor;
                END IF;
            END IF;			
			SELECT * FROM tb_setores;
        END IF;
	END $$
DELIMITER ;

 DROP PROCEDURE sp_view_setor;
DELIMITER $$
	CREATE PROCEDURE sp_view_setor(	
		IN Ihash varchar(64),
		IN Ifield varchar(30),
        IN Isignal varchar(4),
		IN Ivalue varchar(50)
    )
	BEGIN    
		SET @access = (SELECT IFNULL(access,-1) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		IF(@access IN (0))THEN
			SET @quer =CONCAT('SELECT * FROM tb_setores WHERE ',Ifield,' ',Isignal,' ',Ivalue,';');
			PREPARE stmt1 FROM @quer;
			EXECUTE stmt1;
		ELSE 
			SELECT 0 AS id, "" AS nome;
        END IF;
	END $$
DELIMITER ;

 DROP PROCEDURE sp_set_cargo;
DELIMITER $$
	CREATE PROCEDURE sp_set_cargo(	
		IN Ihash varchar(64),
        In Iid_cargo int(11),
		IN Icargo varchar(30),
        IN Isalario double,
        IN Imensal boolean,
        IN Icbo varchar(8)
    )
	BEGIN    
		SET @access = (SELECT IFNULL(access,-1) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
        IF(@access IN (0))THEN
			IF(Iid_cargo = 0)THEN
				INSERT INTO tb_cargos (cargo,salario,mensal,cbo) VALUES (Icargo, Isalario, Imensal, Icbo);
            ELSE
				IF(Icargo = "")THEN
					DELETE FROM tb_cargos WHERE id=Iid_cargo;
				ELSE
					UPDATE tb_cargos SET cargo = Icargo, salario=Isalario, mensal=Imensal, cbo=Icbo WHERE id=Iid_cargo;
                END IF;
            END IF;			
			SELECT * FROM tb_cargos;
        END IF;
	END $$
DELIMITER ;

 DROP PROCEDURE sp_view_cargo;
DELIMITER $$
	CREATE PROCEDURE sp_view_cargo(	
		IN Ihash varchar(64),
		IN Ifield varchar(30),
        IN Isignal varchar(4),
		IN Ivalue varchar(50)
    )
	BEGIN    
		SET @access = (SELECT IFNULL(access,-1) FROM tb_usuario WHERE hash COLLATE utf8_general_ci = Ihash COLLATE utf8_general_ci LIMIT 1);
		IF(@access IN (0))THEN
			SET @quer = CONCAT('SELECT * FROM tb_cargos WHERE ',Ifield,' ',Isignal,' ',Ivalue,';');
			PREPARE stmt1 FROM @quer;
			EXECUTE stmt1;
		ELSE 
			SELECT 0 AS id, "" AS cargo, 0.00 AS salario, 0 AS mensal, NULL as cbo;
        END IF;
	END $$
DELIMITER ;
