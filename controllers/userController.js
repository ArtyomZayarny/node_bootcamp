const getAllUsers = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route not yet defined',
    });
  };
  
  const createUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route not yet defined',
    });
  };
  
  const getUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route not yet defined',
    });
  };
  
  const updateUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route not yet defined',
    });
  };
  
  const deleteUser = (req, res) => {
    res.status(500).json({
      status: 'error',
      message: 'This route not yet defined',
    });
  };

  const userController = {
    getAllUsers,
    createUser,
    getUser,
    updateUser,
    deleteUser
  }

  module.exports = userController;