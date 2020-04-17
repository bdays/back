const models = require('../models');
const asyncWrapper = require('../util/asyncWrapper');
const CustomError = require('../util/customError');
const sql = require('../sql');

const BdayModel = models.Bday;
const BdayScheduleModel = models.BdaySchedule;
const sequelize = models.Sequelize;

async function getAll() {
  BdayModel.hasMany(BdayScheduleModel, { foreignKey: 'bdayId' });

  const list = await asyncWrapper(
    BdayModel.findAll({
      attributes: [
        [sequelize.literal('"BdaySchedules".id'), 'id'],
        [sequelize.literal('"BdaySchedules"."bdayId"'), 'bdayId'],
        'firstName',
        'lastName',
        [sequelize.literal("data ?| array['templateId']"), 'isSetTemplateId'],
        [sequelize.literal("data ?| array['targetChannelId']"), 'isSetTargetChannelId'],
        [sequelize.literal('"BdaySchedules"."isCongratulate"'), 'isCongratulate'],
        [sequelize.literal('"BdaySchedules".date'), 'date'],
        [sequelize.literal('"BdaySchedules"."updatedAt"'), 'updatedAt'],
      ],
      include: [{ model: BdayScheduleModel, attributes: [], required: true, raw: true }],
    }).then((records) => records.map((record) => record.dataValues)),
    new CustomError().query(),
    true,
  );

  return list;
}

async function getScheduleTemplates() {
  const records = await asyncWrapper(
    models.sequelize.query(sql.getScheduleTemplates, { type: models.Sequelize.QueryTypes.SELECT }),
    new CustomError().query(),
  );

  return records;
}

async function setCongratulate(recordId) {
  const record = await asyncWrapper(
    BdayScheduleModel.findOne({ where: { id: recordId } }),
    new CustomError().query(),
    true,
  );

  await asyncWrapper(
    record.update({
      isCongratulate: true,
    }),
    new CustomError().update(),
    true,
  );
}

module.exports = {
  getAll,
  getScheduleTemplates,
  setCongratulate,
};
