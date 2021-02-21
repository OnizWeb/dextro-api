module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        idUser: String,
        sensor: Date,
        fastPen: Date,
        slowPen: Date
      },
      { timestamps: true }
    );

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    const Parameter = mongoose.model("parameter", schema);

    return Parameter;
}
