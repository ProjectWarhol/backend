const path = require('path');
const fs = require('fs');
const { NFTStorage, File } = require('nft.storage');

// Save it to IPFS
const saveNftToStorage = async (req, filePath) => {
  const {
    name,
    description,
    creatorUsername,
    creatorAdress,
    ownerAdress,
    date,
    location,
    positionInTree,
    amountSold,
  } = req.body;

  const fileExtension = req.files.image.mimetype.split('/')[1];
  const client = new NFTStorage({
    token: process.env.NFT_STORAGE_KEY,
  });

  try {
    const metadata = await client.store({
      name,
      description,
      image: new File([fs.readFileSync(filePath)], `${name}.${fileExtension}`, {
        type: req.files.image.mimetype,
      }),
      attributes: {
        creatorUsername,
        creatorAdress,
        ownerAdress,
        date,
        location,
        positionInTree,
        amountSold,
      },
    });
    return { success: true, data: metadata.url };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Upload NFT to NftStorage
// eslint-disable-next-line consistent-return
exports.uploadNft = (req, _res, next) => {
  if (!req.files) {
    return next(new StatusError('No file in body', 400));
  }

  if (!req.body.name) {
    return next(new StatusError('No name in body', 400));
  }

  if (!req.body.description) {
    return next(new StatusError('No description in body', 400));
  }

  if (!req.body.creatorUsername) {
    return next(new StatusError('No creatorUsername in body', 400));
  }

  if (!req.body.creatorAddress) {
    return next(new StatusError('No creatorAddress in body', 400));
  }

  if (!req.body.ownerAddress) {
    return next(new StatusError('No ownerAddress in body', 400));
  }

  if (!req.body.date) {
    return next(new StatusError('No date in body', 400));
  }

  if (!req.body.location) {
    return next(new StatusError('No location in body', 400));
  }

  if (!req.body.positionInTree) {
    return next(new StatusError('No positionInTree in body', 400));
  }

  if (!req.body.amountSold) {
    return next(new StatusError('No amountSold in body', 400));
  }

  const file = req.files.image;
  const filePath = path.join(__dirname, '/tmp_nft_sources/', file.name);

  file.mv(filePath, async (err) => {
    if (err) {
      // return res.status(500).send(err); !!! POSSIBLE VERBOSE ERROR !!!
      return next(
        new StatusError('Something went wrong while uploading NFT', 500)
      );
    }

    const metaData = await saveNftToStorage(req, filePath);

    if (!metaData.success) {
      // return res.status(500).send({
      //   message: metaData.error,      !!! POSSIBLE VERBOSE ERROR !!!
      // });
      return next(
        new StatusError('Something went wrong while saving NFT', 500)
      );
    }

    req.body.filePath = filePath;
    req.body.metadataUrl = metaData.data;
    return next();
  });
};
