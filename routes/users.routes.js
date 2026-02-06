const express = require('express');
const { body } = require('express-validator');

router = express.Router();

const controllers = require('../controllers/users.controller');

const verifyToken = require('../middleware/verify.token');

const multer = require('multer')

const diskStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        const ext = file.originalname.split('.')[1];
        const fileName = `user-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});

const fileFilter = (req, file, cb) => {
    const imageTypes = file.mimetype.split('/')[0];
    if (imageTypes === 'image') {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
}


const upload = multer({
    storage: diskStorage
    , fileFilter: fileFilter
});

router.route('/')
    .get(verifyToken, controllers.getAllUsers)
    .post(
        body('firstName').notEmpty().isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),
        body('lastName').notEmpty().isLength({ min: 2 }).withMessage('Last name must be at least 2 characters long'),
        controllers.createUsers, upload.single('avatar')
    )

router.route('/login')
    .post(controllers.loginUser);


router.route('/:userId')
    .get(controllers.getUserById)
    .patch(controllers.updateUsers)
    .delete(controllers.deleteUsers);

module.exports = router;
