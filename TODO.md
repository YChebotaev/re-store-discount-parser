[x] Раскрывать списки «Показать еще \_ предложений»

[x] Не отправлять уведомления при первом прогоне.

[x] Заставить работать

[x] Задеплоить

[x] Удалить jobs/DiscountJob.js:20-30

[x] Удалить lib/classes/ChangesMessage.old.js

[x] Заменить демо-задачу на рабочую index.js:11-13

[x] Удалить pupeeter.js:9-14

[x] Выполнить код:

ALTER TABLE `RunStates`
ADD COLUMN `lastCheck` DATETIME;

[x] Выполнить коды:

ALTER TABLE `RunStates`
ADD COLUMN `blocked` TINYINT(1);

ALTER TABLE `RunStates`
ADD COLUMN `blockedBy` VARCHAR(255);

[x] Выполнить в базе:

ALTER TABLE `RunStates`
ADD COLUMN `latestNewMessage` DATETIME;

ALTER TABLE `RunStates`
ADD COLUMN `latestUpdateMessage` DATETIME;
