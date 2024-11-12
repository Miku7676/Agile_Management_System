
USE `project_management_system`;
DROP procedure IF EXISTS `fetchComments`;
DELIMITER $$
CREATE DEFINER=`devansh` PROCEDURE `fetchComments`(IN projectId INT, IN userId VARCHAR(25))
BEGIN
	DECLARE opstatus INT;
	IF NOT checkProject(projectId) AND NOT checkUserInProject(userID, projectId)  THEN
		SET opstatus = 1; -- code 1 : project doesnot exist
	ELSE
        SELECT c.COMMENT_ID, c.CONTENT, c.TIMESTAMP, u.USERNAME, u.USER_ID FROM comment AS c JOIN user AS u ON c.USER_ID = u.USER_ID WHERE project_id = projectId;
        set opstatus = 0;
    END IF;
    SELECT opstatus;
END$$

DELIMITER ;


USE `project_management_system`;
DROP procedure IF EXISTS `project_management_system`.`fetchProjectDetails`;
;

DELIMITER $$
USE `project_management_system`$$
CREATE DEFINER=`devansh`@`%` PROCEDURE `fetchProjectDetails`(IN projId INT)
BEGIN
	DECLARE opstatus INT;
	IF NOT checkProject(projId) THEN
		SET opstatus = 1; 
	ELSE
        SELECT * FROM project where project_id = projId;
        SELECT USER_ID, ROLE from project_works_on where project_id = projId AND ROLE = 'Member';
        SELECT SPRINT_ID, NAME, START_DT, END_DT,Description FROM sprint WHERE PROJECT_ID = projId;
		-- select 3 as 'tasks'; to be done
        set opstatus = 0;
    END IF;
    SELECT opstatus;
END$$

DELIMITER ;
;

CREATE DEFINER=`root`@`localhost` PROCEDURE `fetch_sprintTasks`(IN spr_ID INT)
BEGIN
	SELECT 
      s.SPRINT_ID,
      s.NAME,
      s.START_DT,
      s.END_DT,
      s.PROJECT_ID,
      s.Description
    FROM sprint s
    WHERE s.SPRINT_ID = spr_ID;
    
    SELECT t.TASK_ID,  t.TITLE, t.DESCRIPTION, t.ASSIGNED_TO, ts.NAME FROM task as t join task_status as ts ON t.STATUS_ID = ts.STATUS_ID  WHERE SPRINT_ID = spr_ID;
END

CREATE DEFINER=`root`@`localhost` PROCEDURE `createSprint`(
    IN userId VARCHAR(25), 
    IN proj_Id INT,
    IN START_D DATE,
    IN END_D DATE,
    IN S_NAME VARCHAR(100),
    IN S_Desc VARCHAR(150)
)
BEGIN

    IF checkRole(proj_Id, userId) THEN
        INSERT INTO sprint( NAME, START_DT, END_DT, PROJECT_ID, Description) VALUES (S_NAME, START_D, END_D, proj_Id, S_Desc);
        SELECT 1 as 'opt_status';
    ELSE
        SELECT 0 AS 'opt_status';
    END IF;
END

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
END

USE `project_management_system`;
DROP procedure IF EXISTS `project_management_system`.`createTask`;
;

DELIMITER $$
USE `project_management_system`$$
CREATE DEFINER=`devansh`@`%` PROCEDURE `createTask`(IN p_title VARCHAR(100), IN p_description VARCHAR(100),in p_assigned_to VARCHAR(25),in
p_project_id INT, in p_sprint_id INT, in p_status_id int )
BEGIN
	INSERT INTO TASKS (
        TITLE,
        DESCRIPTION,
        ASSIGNED_TO,
        PROJECT_ID,
        SPRINT_ID,
        STATUS_ID
    ) VALUES (
        p_title,
        p_description,
        p_assigned_to,
        p_project_id,
        p_sprint_id,
        p_status_id
    );
    SELECT LAST_INSERT_ID() as TASK_ID;
END$$

DELIMITER ;
;



