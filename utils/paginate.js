const paginate = async (model, query = {}, options = {}) => {
  const {
    page = 1,
    limit = 10,
    sort = { createdAt: -1 },
    populate = '',
  } = options;

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    model.find(query).sort(sort).skip(skip).limit(limit).populate(populate),
    model.countDocuments(query),
  ]);

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

module.exports = paginate;