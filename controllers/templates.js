const responseError = require('../util/responseError');
const responseSuccess = require('../util/responseSuccess');
const TemplatesService = require('../services/templates');
const BdaysService = require('../services/bdays');
const deepFind = require('../util/deepFind');

const regexTemplateVariable = /(<!![\\._a-zA-Z]+!!>)/gm;

function changeTemplateVariable(text, userData) {
  let copy = text;
  if (copy) {
    const findItems = copy.match(regexTemplateVariable);

    if (findItems && findItems.length) {
      findItems.forEach((item) => {
        const path = item.replace('<!!', '', -1).replace('!!>', '', -1);
        copy = copy.replace(item, deepFind(userData, path) || '', -1).trim();
      });
    }
  }
  return copy;
}

function templateBlock(block, userData, timeStart, timeout) {
  const newBlock = {};

  Object.keys(block).some((item) => {
    if (typeof block[item] === 'object') {
      if (block[item].length) {
        block[item].some((itemBlock) => {
          const preparedBlock = templateBlock(itemBlock, userData, timeStart, timeout);

          if (!newBlock[item]) newBlock[item] = [];

          newBlock[item].push(preparedBlock.newBlock);

          return preparedBlock.err;
        });
      } else {
        const preparedBlock = templateBlock(block[item], userData, timeStart, timeout);
        newBlock[item] = preparedBlock.newBlock;
        return preparedBlock.err;
      }

      return false;
    }

    if (item === 'text' && typeof block[item] === 'string') {
      newBlock[item] = changeTemplateVariable(block[item], userData);
      return false;
    }

    newBlock[item] = block[item];
    return false;
  });

  return {
    newBlock,
    err: new Date().getTime() - timeStart >= timeout ? new Error('timeout error') : null,
  };
}

class Templates {
  async create(req, res) {
    try {
      const { title, text, blocks, attachments } = req.body;
      const row = await TemplatesService.create(title, text, blocks, attachments || []);

      const response = responseSuccess.created(row);

      res.status(response.status).json(response.body);
    } catch (e) {
      const response = responseError.create();
      res.status(response.status).json(response.body);
    }
  }

  async updateRecord(req, res) {
    try {
      const { templateId } = req.params;
      const { title, text, blocks, attachments } = req.body;
      const row = await TemplatesService.updateRecord(templateId, title, text, blocks, attachments || []);

      const response = responseSuccess.updateRecord(row);

      res.status(response.status).json(response.body);
    } catch (e) {
      const response = responseError.updateRecord();
      res.status(response.status).json(response.body);
    }
  }

  async deleteRecord(req, res) {
    try {
      const { templateId } = req.params;
      const data = await TemplatesService.deleteRecord(templateId);

      const response = responseSuccess.deleteRecord(data);

      res.status(response.status).send(response.body);
    } catch (e) {
      const response = responseError.deleteRecord();
      res.status(response.status).json(response.body);
    }
  }

  async getMatched(req, res) {
    try {
      const { templateId, bdayId } = req.params;

      const user = await BdaysService.getById(+bdayId, { attributes: ['firstName', 'lastName', 'data', 'date'] });
      const template = await TemplatesService.getById(+templateId, {
        attributes: ['title', 'text', 'blocks', 'attachments'],
      });

      const copyTemplateBlocks = [...template.blocks];

      template.blocks = [];
      let err = null;
      copyTemplateBlocks.some((block) => {
        const preparedBlock = templateBlock(block, user, new Date().getTime(), 3000);
        template.blocks.push(preparedBlock.newBlock);
        err = preparedBlock.err;
        return err;
      });

      if (err) {
        const response = responseError.timeout();
        res.status(response.status).json(response.body);
        return;
      }
      const response = responseSuccess.query(template);

      res.status(response.status).json(response.body);
    } catch (e) {
      const response = responseError.query();
      res.status(response.status).json(response.body);
    }
  }

  async get(req, res) {
    try {
      const { templateId } = req.params;
      const row = await TemplatesService.getById(+templateId, {
        attributes: ['title', 'text', 'blocks', 'attachments'],
      });

      const response = responseSuccess.query(row);

      res.status(response.status).json(response.body);
    } catch (e) {
      const response = responseError.query();
      res.status(response.status).json(response.body);
    }
  }

  async getAll(req, res) {
    try {
      const row = await TemplatesService.getAll({
        attributes: ['id', 'title'],
      });

      const response = responseSuccess.query(row);

      res.status(response.status).json(response.body);
    } catch (e) {
      const response = responseError.query();
      res.status(response.status).json(response.body);
    }
  }
}

module.exports = new Templates();
