
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

