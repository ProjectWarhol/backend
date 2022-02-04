exports.sessionObject = (userObject) => ({
  id: userObject.id,
  userName: userObject.userName,
  email: userObject.email,
  avatar: userObject.avatar,
  wallet: userObject.walletId,
  collection: userObject.collectionsId,
});
