module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        idUser: String,
        multiAccount: Boolean,
        linkTo: Array,
        advice: Boolean,
        alert: Boolean
      },
      { timestamps: true }
    );

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    const ParameterAccount = mongoose.model("parameterAccount", schema);

    return ParameterAccount;
}
