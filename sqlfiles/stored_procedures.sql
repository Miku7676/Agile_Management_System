
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

USE `project_management_system`;
DROP procedure IF EXISTS `createTask`;

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



