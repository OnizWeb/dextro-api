module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        sample: Number,
        injection: Boolean,
        injectionDose: Number,
        comment: String,
        idUser: String
      },
      { timestamps: true }
    );

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    const Analysis = mongoose.model("analysis", schema);

    return Analysis;
}
