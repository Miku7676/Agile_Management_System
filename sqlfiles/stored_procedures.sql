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


-- fetch user project details
USE `project_management_system`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `fetchProjectDetails`(IN projId INT)
BEGIN
	DECLARE opstatus INT;
	IF NOT checkProject(projId) THEN
		SET opstatus = 1; -- code 1 : project doesnot exist
	ELSE
        SELECT * FROM project where project_id = projId;
        SELECT USER_ID, ROLE from project_works_on where project_id = projId AND ROLE = 'Member';
		-- select 2 as 'sprints';
        SELECT SPRINT_ID, NAME, START_DT, END_DT FROM sprint WHERE PROJECT_ID = projId;
		-- select 3 as 'tasks'; to be done
        set opstatus = 0;
    END IF;
    SELECT opstatus;
END$$

DELIMITER ;