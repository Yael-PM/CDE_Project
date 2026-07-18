-- Ejecutar una sola vez sobre la base existente después de confirmar que
-- todavía no existe la columna `role`.
ALTER TABLE `user`
  ADD COLUMN `role` ENUM('admin', 'user') NOT NULL DEFAULT 'user'
  AFTER `password`;

-- Sustituye el correo antes de ejecutar esta sentencia.
-- UPDATE `user` SET `role` = 'admin' WHERE `email` = 'admin@tu-dominio.com';

-- La tabla también puede ser creada automáticamente por express-mysql-session.
CREATE TABLE IF NOT EXISTS `sessions` (
  `session_id` VARCHAR(128) COLLATE utf8mb4_bin NOT NULL,
  `expires` INT UNSIGNED NOT NULL,
  `data` MEDIUMTEXT COLLATE utf8mb4_bin,
  PRIMARY KEY (`session_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_bin;
