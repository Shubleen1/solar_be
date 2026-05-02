const {
  submitQuery,
  getAllQueries,
  updateQueryStatus,
  deleteQuery
} = require('../services/queryService');

const submit = async (req, res) => {
  try {
    const lead = await submitQuery(req.body);
    res.status(201).json({message: '✅ Inquiry submitted successfully!',leadId: lead._id });
  } catch (err) { res.status(400).json({    message: err.message || 'Something went wrong'  });}
};

const getAll = async (req, res) => {
  try {
    const queries = await getAllQueries();

    res.status(200).json({
      success: true,
      count: queries.length,
      data: queries
    });

  } catch (err) {
    res.status(500).json({
      message: 'Failed to fetch queries'
    });
  }
};

const updateQuery= async(req,res)=>{
  try{
    const{id}=req.params;
    const{status}=req.body;
    const updatedQuery=await updateQueryStatus(id,status);
    res.status(200).json({
      success:true,
      data:updatedQuery
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || 'Something went wrong'
    });
  }
};

const deleteQ = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteQuery(id);
    res.status(200).json({
      success: true,
      message: 'Query deleted successfully'
    });
  } catch (err) {
    res.status(400).json({
      message: err.message || 'Something went wrong'
    });
  }
};

module.exports = {
  submit,
  getAll,
  updateQuery,
  deleteQ
};