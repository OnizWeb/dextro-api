module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        idUser: String,
        limits: Array,
        stepDose: Array
      },
      { timestamps: true }
    );

    schema.method("toJSON", function() {
      const { __v, _id, ...object } = this.toObject();
      object.id = _id;
      return object;
    });

    const InsulinProtocol = mongoose.model("insulineProtocol", schema);

    return InsulinProtocol;
}
