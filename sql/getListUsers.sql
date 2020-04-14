SELECT
  a. "id",
  a. "creatorId",
  a. "userName",
  a. "role",
  a. "createdAt",
  b. "userName" AS "creatorUserName"
FROM
  public. "Auths" a
  LEFT JOIN (
    SELECT
      "userName",
      id
    FROM
      public. "Auths") b ON a. "creatorId" = b.id
ORDER BY
  id ASC
