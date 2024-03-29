 /* PRODUTOS */
 
--	DROP VIEW vw_prod_forn;
--	CREATE VIEW vw_prod_forn AS
		SELECT PROD.id, COALESCE(EMP.fantasia,"") AS fornecedor
			FROM tb_produto AS PROD
			LEFT JOIN tb_empresa AS EMP
			ON PROD.id_emp = EMP.id;

 SELECT * FROM vw_prod_forn;

-- 	DROP VIEW vw_prod_reserva;
--	CREATE VIEW vw_prod_reserva AS
		SELECT PROD.id, SUM(COALESCE(RES.qtd,0)) AS reserva
			FROM tb_produto AS PROD
			LEFT JOIN tb_prod_reserva AS RES
			ON RES.id_prod = PROD.id
            AND RES.pago = 0
            GROUP BY PROD.id;

 SELECT * FROM vw_prod_reserva;
 
-- 	DROP VIEW vw_prod;
--	CREATE VIEW vw_prod AS
		SELECT PROD.*, FORN.fornecedor, RES.reserva, (PROD.estoque - RES.reserva) AS disponivel
		FROM tb_produto AS PROD
		INNER JOIN vw_prod_forn AS FORN
		INNER JOIN vw_prod_reserva AS RES
		ON RES.id = PROD.id
		AND FORN.id=PROD.id;

 SELECT * FROM vw_prod;
 
 /* FUNCIONÁRIOS */
 
-- 	DROP VIEW vw_func_setor;
-- 	CREATE VIEW vw_func_setor AS
 SELECT FUNC.id, COALESCE(STR.nome,"") AS setor
	FROM tb_funcionario AS FUNC
	LEFT JOIN tb_setores AS STR
	ON FUNC.id_setor = STR.id;

SELECT * FROM vw_func_setor;
    
-- 	DROP VIEW vw_func_cargo;
-- 	CREATE VIEW vw_func_cargo AS
 SELECT FUNC.id, COALESCE(CRG.cargo,"") AS cargo, CRG.mensal
	FROM tb_funcionario AS FUNC
	LEFT JOIN tb_cargos AS CRG
	ON FUNC.id_cargo = CRG.id;

SELECT * FROM vw_func_cargo;
    
-- 	DROP VIEW vw_func;
-- 	CREATE VIEW vw_func AS
		SELECT FUNC.*, CRG.cargo, STR.setor, CRG.mensal
		FROM tb_funcionario AS FUNC
		INNER JOIN vw_func_setor AS STR
		INNER JOIN vw_func_cargo AS CRG
		ON  FUNC.id = STR.id
		AND FUNC.id = CRG.id;
    
SELECT * FROM vw_func;    

/* RELOGIO DE PONTO */

-- 	DROP VIEW vw_date_range;
-- 	CREATE VIEW vw_date_range AS
SELECT date, WEEKOFYEAR(date) AS semana, DAYOFWEEK(date) AS dia_semana FROM 
(SELECT ADDDATE('2020-01-01',t4.i*10000 + t3.i*1000 + t2.i*100 + t1.i*10 + t0.i) date FROM
 (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t0,
 (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t1,
 (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t2,
 (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t3,
 (SELECT 0 i UNION SELECT 1 UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 UNION SELECT 7 UNION SELECT 8 UNION SELECT 9) t4) v;
 
 SELECT * FROM vw_date_range WHERE date BETWEEN '2024-02-01' AND '2024-02-29';
 
-- 	DROP VIEW vw_relogio_ponto;
-- 	CREATE VIEW vw_relogio_ponto AS 
	SELECT DT.date, GROUP_CONCAT(COALESCE(RP.id,0) SEPARATOR ',') AS id, GROUP_CONCAT(COALESCE(RP.id_func,0) SEPARATOR ',') AS id_func,GROUP_CONCAT(COALESCE(TIME(RP.entrada),"00:00:00") SEPARATOR ',') AS entrada, GROUP_CONCAT(COALESCE(TIME(RP.saida),"00:00:00") SEPARATOR ',') AS saida
	FROM vw_date_range AS DT
	LEFT JOIN tb_relogio_ponto AS RP
	ON DT.date = DATE(RP.entrada)
    AND id_func IN (1,2)
    AND DT.date BETWEEN '2024-02-01' AND '2024-02-29'
    GROUP BY date
    ORDER BY date;
    
SELECT * FROM vw_relogio_ponto WHERE date BETWEEN '2024-02-01' AND '2024-02-29';    