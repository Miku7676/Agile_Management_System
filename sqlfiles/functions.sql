DELIMITER $$
CREATE DEFINER=`root`@`localhost` FUNCTION `checkProject`(projId INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
	RETURN EXISTS (SELECT 1 FROM project WHERE PROJECT_ID = projId);
END$$


CREATE DEFINER=`root`@`localhost` FUNCTION `checkUserInProject`(userId VARCHAR(25), projId INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
	RETURN EXISTS (SELECT 1 FROM project_works_on WHERE PROJECT_ID = projId AND USER_ID = userId);
END$$



DELIMITER ;