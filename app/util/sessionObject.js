exports.sessionObject = (userObject) => ({
  id: userObject.id,
  userName: userObject.userName,
  email: userObject.email,
  avatar: userObject.avatar,
  bio: userObject.bio,
  promoters: userObject.promoters,
  promoting: userObject.promoting,
  wallet: userObject.walletId,
  verified: userObject.verified,
});
