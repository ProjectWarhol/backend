const db = require('../models');
const {
  noPathErrorHandler,
} = require('../middlewares/error_handlers.middleware');

const { NftContent } = db;

exports.findNftById = async (id, res) => {
  const nft = await NftContent.findByPk(id, { rejectOnEmpty: true }).catch(
    () => {
      noPathErrorHandler(res, 'Nft');
    }
  );

  return nft;
};
