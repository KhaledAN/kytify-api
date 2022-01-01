const joiMiddleware = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body || {});
    if (error == null) {
      next();
    } else {
      const { details } = error;
      console.log("error details : ", details);
      return res.status(400).json({ error: { [details[0].context.key]: details[0].message } });
    }
  };
};
export default joiMiddleware;
