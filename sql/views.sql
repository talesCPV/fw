 /* PRODUTOS */
 
 	DROP VIEW vw_prod_forn;
	CREATE VIEW vw_prod_forn AS
		SELECT PROD.id, COALESCE(EMP.fantasia,"") AS fornecedor
			FROM tb_produto AS PROD
			LEFT JOIN tb_empresa AS EMP
			ON PROD.id_emp = EMP.id;

 SELECT * FROM vw_prod_forn;

 	DROP VIEW vw_prod_reserva;
	CREATE VIEW vw_prod_reserva AS
		SELECT PROD.id, COALESCE(RES.qtd,0) AS reserva
			FROM tb_produto AS PROD
			LEFT JOIN tb_prod_reserva AS RES
			ON RES.id_prod = PROD.id
            AND RES.pago = 0;

 SELECT * FROM vw_prod_reserva;
 
-- 	DROP VIEW vw_prod;
	CREATE VIEW vw_prod AS
		SELECT PROD.*, FORN.fornecedor, RES.reserva, (PROD.estoque - RES.reserva) AS disponivel
		FROM tb_produto AS PROD
		INNER JOIN vw_prod_forn AS FORN
		INNER JOIN vw_prod_reserva AS RES
		ON RES.id = PROD.id
		AND FORN.id=PROD.id;

 SELECT * FROM vw_prod;
 
 /* */