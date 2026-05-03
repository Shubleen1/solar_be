const MESSAGES = {
  QUERY: {
    CREATED: 'Inquiry submitted successfully',
    FETCHED: 'Queries fetched successfully',
    UPDATED: 'Query updated successfully',
    DELETED: 'Query deleted successfully',
    NOT_FOUND: 'Query not found',
    INVALID_STATUS: 'Invalid status',
  },
  COMMON: {
    BAD_REQUEST: 'Invalid request data',
    SERVER_ERROR: 'Something went wrong',
  },
 USER: {
  FETCHED: "Users fetched successfully",
  SINGLE_FETCHED: "User fetched successfully",
  UPDATED: "User updated successfully",
  DELETED: "User deleted successfully",
  NOT_FOUND: "User not found"
}
};

module.exports = MESSAGES;