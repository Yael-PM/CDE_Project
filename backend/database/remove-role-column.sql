-- Ejecutar una sola vez si una versión anterior agregó `user.role`.
-- Es seguro ejecutarlo aunque la columna no exista.
SET @drop_role_sql = (
  SELECT IF(
    EXISTS(
      SELECT 1
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'user'
        AND COLUMN_NAME = 'role'
    ),
    'ALTER TABLE `user` DROP COLUMN `role`',
    'SELECT ''La columna role no existe'' AS message'
  )
);

PREPARE drop_role_statement FROM @drop_role_sql;
EXECUTE drop_role_statement;
DEALLOCATE PREPARE drop_role_statement;
