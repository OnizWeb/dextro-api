module.exports = mongoose => {
  var schema = mongoose.Schema(
    {
      firstname: String,
      lastname: String,
      mail: String,
      birthday: Date,
      login: String,
      password: String,
      role: String,
      active: Boolean,
      myAnalysis: Array
    },
    {timestamps: true}
  );

  schema.method("toJSON", function() {
    const { __v, _id, password, active, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const User = mongoose.model("user", schema);

  return User;
}
