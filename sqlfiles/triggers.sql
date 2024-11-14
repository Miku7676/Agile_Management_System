DELIMITER &&

CREATE TRIGGER log_project_insert
AFTER INSERT ON project
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action_type, message)
    VALUES ('sprint', NEW.PROJECT_ID, 'INSERT', "created project");
END&&

CREATE TRIGGER log_sprint_insert
AFTER INSERT ON sprint
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action_type, message)
    VALUES ('sprint', NEW.sprint_id, 'INSERT', "created sprint");
END&&

CREATE TRIGGER log_sprint_delete
AFTER DELETE ON sprint
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action_type, message)
    VALUES ('sprint', OLD.sprint_id, 'DELETE', "deleted sprint");
END&&

CREATE TRIGGER log_task_insert
AFTER INSERT ON task
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action_type, message)
    VALUES ('task', NEW.task_id, 'INSERT', "created task");
END&&

CREATE TRIGGER log_task_delete
AFTER DELETE ON task
FOR EACH ROW
BEGIN
    INSERT INTO audit_log (table_name, record_id, action_type, message)
    VALUES ('task', OLD.task_id, 'DELETE', "deleted task");
END&&
DELIMITER ;