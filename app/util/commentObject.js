exports.commentObject = (comment) => ({
  userName: comment.User.userName,
  avatar: comment.User.avatar,
  comment: comment.comment,
  createdAt: comment.createdAt,
  updatedAt: comment.updatedAt,
});
