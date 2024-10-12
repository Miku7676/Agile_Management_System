DELIMITER $$
USE project_management_system$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `addUserToProject`(IN projId INT, IN userId VARCHAR(25))
BEGIN
	DECLARE projectExists BOOLEAN;
    DECLARE userExists BOOLEAN;
    SET projectExists = checkProject(projId);
    SET userExists = checkUserInProject(userId,projId);
	IF projectExists and NOT userExists THEN
		INSERT INTO `project_works_on`(USER_ID,PROJECT_ID,ROLE) VALUES (userId,projId,'Member');
        SELECT 0 AS opstatus;
	ELSE
		IF NOT projectExists THEN SELECT 1 AS opstatus; -- code 1 : project id not found
        ELSE
			SELECT 2 AS opstatus; -- code 2 : user id already exists for project
		END IF;
	END IF;	
END$$





DELIMITER ;