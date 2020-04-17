const models = require('../models');
const dateUtil = require('../util/date');
const asyncWrapper = require('../util/asyncWrapper');
const CustomError = require('../util/customError');
const sql = require('../sql');

const BdayModel = models.Bday;

async function create(firstName, lastName, date, data) {
  const result = await asyncWrapper(
    BdayModel.create({
      firstName,
      lastName,
      date: date * 1000,
      data,
    }),
    new CustomError().create(),
  );

  return {
    id: result.dataValues.id,
    firstName: result.dataValues.firstName,
    lastName: result.dataValues.lastName,
    date: result.dataValues.date,
    data: result.dataValues.data,
    month: dateUtil.getMonthName(date),
  };
}

async function getAll() {
  const months = await asyncWrapper(
    models.sequelize.query(sql.getListBdays, { type: models.Sequelize.QueryTypes.SELECT }),
    new CustomError().query(),
  );
  const newMonths = {};

  months.forEach((item, i) => {
    newMonths[dateUtil.getListMonthName()[i]] = item.month ? item.month : [];
  });

  return newMonths;
}

async function deleteRecord(recordId) {
  const result = await asyncWrapper(BdayModel.destroy({ where: { id: recordId } }), new CustomError().delete());

  if (!result) throw new CustomError().notModify();

  return result;
}

async function updateRecord(recordId, firstName, lastName, date, data) {
  const record = await asyncWrapper(BdayModel.findOne({ where: { id: recordId } }), new CustomError().query());

  if (!record) throw new CustomError().notFound();

  const updatedRecord = await asyncWrapper(
    record.update({
      firstName,
      lastName,
      data,
      date: date * 1000,
    }),
    new CustomError().update(),
  );

  return {
    id: updatedRecord.dataValues.id,
    firstName: updatedRecord.dataValues.firstName,
    lastName: updatedRecord.dataValues.lastName,
    date: updatedRecord.dataValues.date,
    data: updatedRecord.dataValues.data,
    month: dateUtil.getMonthName(date),
  };
}

async function getById(id, args = {}) {
  const record = await asyncWrapper(BdayModel.findOne({ where: { id }, ...args }), new CustomError().query());
  return record;
}

async function getByIdBasicData(id) {
  return getById(+id, { attributes: ['firstName', 'lastName', 'data', 'date'] });
}

async function getByIdForMatchedTemplate(id) {
  return getById(+id, { attributes: ['firstName', 'lastName', 'data', 'date'] });
}

module.exports = {
  getByIdBasicData,
  create,
  getAll,
  deleteRecord,
  updateRecord,
  getById,
  getByIdForMatchedTemplate,
};
