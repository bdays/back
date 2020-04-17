SELECT
  list.id,
  list. "targetChannelId",
  tmpl.text,
  tmpl.blocks,
  tmpl.attachments
FROM (
  SELECT
    sc.id,
    bday.data ->> 'targetChannelId' AS "targetChannelId",
    bday.data ->> 'templateId' AS "templateId"
  FROM
    public. "Bdays" bday
    INNER JOIN (
      SELECT
        *
      FROM
        public. "BdaySchedules"
      WHERE
        "isCongratulate" = FALSE) sc ON sc. "bdayId" = bday.id)
  LIST
  INNER JOIN (
    SELECT
      *
    FROM
      public. "Templates") tmpl ON CAST(tmpl. "id" AS text) = list. "templateId"
