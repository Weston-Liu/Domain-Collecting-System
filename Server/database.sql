-- ---
-- Globals
-- ---

-- SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
-- SET FOREIGN_KEY_CHECKS=0;

-- ---
-- Table 'data'
-- 
-- ---

DROP TABLE IF EXISTS `data`;
		
CREATE TABLE `data` (
  `id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `site` INTEGER(11) NOT NULL,
  `domain` VARCHAR(40) NOT NULL,
  `applicant` INTEGER(11) NOT NULL,
  `createTime` DATETIME NOT NULL,
  `viewTime` DATETIME NOT NULL,
  UNIQUE (`site`, `domain`),
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'user'
-- 
-- ---

DROP TABLE IF EXISTS `user`;
		
CREATE TABLE `user` (
  `id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(40) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `role` INTEGER(11) NOT NULL DEFAULT 1,
  `country` INTEGER(11) NOT NULL,
  `salt` VARCHAR(255) NOT NULL,
  UNIQUE (`name`),
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'site'
-- 
-- ---

DROP TABLE IF EXISTS `site`;
		
CREATE TABLE `site` (
  `id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(40) NOT NULL,
  `country` INTEGER(11) NOT NULL,
  UNIQUE(`name`, `country`),
  PRIMARY KEY (`id`)
);

-- ---
-- Table 'country'
-- 
-- ---

DROP TABLE IF EXISTS `country`;
		
CREATE TABLE `country` (
  `id` INTEGER(11) NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(40) NOT NULL,
  UNIQUE (`name`),
  PRIMARY KEY (`id`)
);

-- ---
-- Foreign Keys 
-- ---

ALTER TABLE `user` ADD FOREIGN KEY (country) REFERENCES `country` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `site` ADD FOREIGN KEY (country) REFERENCES `country` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `data` ADD FOREIGN KEY (site) REFERENCES `site` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `data` ADD FOREIGN KEY (applicant) REFERENCES `user` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- ---
-- Table Properties
-- ---

-- ALTER TABLE `country` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `site` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `data` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `user` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
-- ALTER TABLE `sessions` ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- ---
-- Test Data
-- ---

INSERT INTO `country` VALUES ('1', 'KR');
INSERT INTO `country` VALUES ('2', 'HK');
INSERT INTO `country` VALUES ('3', 'SG');
INSERT INTO `country` VALUES ('4', 'TW');

INSERT INTO `site` VALUES ('1', 'krcepp_lenovo_unit','1');
INSERT INTO `site` VALUES ('2', 'kreducation_unit','1');
INSERT INTO `site` VALUES ('3', 'krsmb_unit','1');
INSERT INTO `site` VALUES ('4', 'krepp_unit','1');
INSERT INTO `site` VALUES ('5', 'krpartner_unit','1');
INSERT INTO `site` VALUES ('6', 'kraffinity_unit','1');
INSERT INTO `site` VALUES ('7', 'hkcepp_lenovo_unit','2');
INSERT INTO `site` VALUES ('8', 'hkeducation_unit','2');
INSERT INTO `site` VALUES ('9', 'hksmb_lenovo_unit','2');
INSERT INTO `site` VALUES ('10', 'hkepp_lenovo_unit','2');
INSERT INTO `site` VALUES ('11', 'hkcepp_mc_lenovo_unit','2');
INSERT INTO `site` VALUES ('12', 'sgcepp_lenovo_unit','3');
INSERT INTO `site` VALUES ('13', 'sgcepp01_unit','3');
INSERT INTO `site` VALUES ('14', 'sgnonprofit_unit','3');
INSERT INTO `site` VALUES ('15', 'sgepp_lenovo_unit','3');
INSERT INTO `site` VALUES ('16', 'sgpartner_unit','3');
INSERT INTO `site` VALUES ('17', 'sgstcepp_lenovo_unit','3');
INSERT INTO `site` VALUES ('18', 'twepp_unit','4');
INSERT INTO `site` VALUES ('19', 'twedu_unit','4');

INSERT INTO `user` (`name`,`password`,`role`,`country`,`salt`) VALUES ('admin','3f8c2eba9ac4240f49fa8ab1d5678c68','9','1','33a2213e77c555f1d8906c977a628f77');
INSERT INTO `user` (`name`,`password`,`role`,`country`,`salt`) VALUES ('user','43e01cd787ba1ad810b86455281511fa','1','1','62a17b280b0e1fe9a8e1638bb4b15a12');

INSERT INTO `data` VALUES ('1', '1', 'qq.com', '2', '2016-12-07 13:18:03', '2016-12-07 13:18:03');
INSERT INTO `data` VALUES ('2', '2', '163.com', '1', '2016-12-12 13:18:18', '2016-12-19 13:18:23');
