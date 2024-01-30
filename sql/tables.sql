-- DROP TABLE tb_usuario;
CREATE TABLE tb_usuario (
    id int(11) NOT NULL AUTO_INCREMENT,
    email varchar(70) NOT NULL,
    hash varchar(64) NOT NULL,
    id_func int(11) DEFAULT 0,
    access int(11) DEFAULT 1,
	UNIQUE KEY (hash),
	UNIQUE KEY (email),
    FOREIGN KEY (id_func) REFERENCES tb_funcionario(id),
    PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

INSERT INTO tb_usuario (email,hash,access)VALUES("admin@fwtecnologia.com.br","e9a5438692c002bf4e761e95350284a15d740c71bd65edfa8a1217a2be312730",100);

 DROP TABLE tb_funcionario;
CREATE TABLE tb_funcionario (
    id int(11) NOT NULL AUTO_INCREMENT,
    nome varchar(70) NOT NULL,
    id_cargo int(11) DEFAULT 0,
    id_setor int(11) DEFAULT 0,
    id_func int(11) DEFAULT 0,
    FOREIGN KEY (id_cargo) REFERENCES tb_cargos(id),
    FOREIGN KEY (id_setor) REFERENCES tb_setores(id),
    PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- DROP TABLE tb_setores;
CREATE TABLE tb_setores (
    id int(11) NOT NULL AUTO_INCREMENT,
    nome varchar(30) NOT NULL,
    PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

-- DROP TABLE tb_cargos;
CREATE TABLE tb_cargos (
    id int(11) NOT NULL AUTO_INCREMENT,
    cargo varchar(30) NOT NULL,
    salario double NOT NULL DEFAULT 0,
    mensal boolean NOT NULL DEFAULT 0,
    cbo varchar(8),
    PRIMARY KEY (id)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

 DROP TABLE tb_calendario;
CREATE TABLE tb_calendario (
    id_user int(11) NOT NULL,
    data_agd date NOT NULL,
    obs varchar(255),
    PRIMARY KEY (id_user,data_agd)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;

 DROP TABLE tb_mail;
CREATE TABLE tb_mail (
	data TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, 
    id_from int(11) NOT NULL,
    id_to int(11) NOT NULL,
    message varchar(512),
    FOREIGN KEY (id_from) REFERENCES tb_usuario(id),
    FOREIGN KEY (id_to) REFERENCES tb_usuario(id),
    PRIMARY KEY (data,id_from)
) ENGINE=MyISAM AUTO_INCREMENT=0 DEFAULT CHARSET=utf8;