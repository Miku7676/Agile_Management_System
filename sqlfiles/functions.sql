DELIMITER $$
CREATE DEFINER=`devansh`@`localhost` FUNCTION `checkProject`(projId INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
	RETURN EXISTS (SELECT 1 FROM project WHERE PROJECT_ID = projId);
END$$


CREATE DEFINER=`devansh`@`localhost` FUNCTION `checkUserInProject`(userId VARCHAR(25), projId INT) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
	RETURN EXISTS (SELECT 1 FROM project_works_on WHERE PROJECT_ID = projId AND USER_ID = userId);
END$$


CREATE DEFINER=`root`@`localhost` FUNCTION `checkRole`(proj_Id INT, usr_Id varchar(25)) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
	RETURN EXISTS (SELECT 1 FROM PROJECT_WORKS_ON WHERE PROJECT_ID = proj_id AND USER_ID = usr_Id AND ROLE = 'Scrum_Master');
END

CREATE DEFINER=`root`@`localhost` FUNCTION `checkUserRole`(proj_Id INT, user_Id varchar(25)) RETURNS tinyint(1)
    DETERMINISTIC
BEGIN
	RETURN EXISTS(SELECT 1 FROM project_works_on where PROJECT_ID = proj_Id and USER_ID = user_Id and ROLE = "Scrum_Master");
END
DELIMITER ;