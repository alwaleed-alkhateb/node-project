const express = require('express');
const { body } = require('express-validator');

router = express.Router();

const controllers = require('../controllers/courses.controller');

const verifyToken = require('../middleware/verify.token');
const allowedTo = require('../middleware/allowedTo');
const userRole = require('../utils/roleUser');

router.route('/')
    .get(controllers.getAllCourses)
    .post(
        body('name').notEmpty().isLength({ min: 2 }).withMessage('Name must be at least 2 characters long'),
        body('price').isNumeric().withMessage('Price must be a number'), verifyToken, controllers.createCourse
    )

router.route('/:courseId')
    .get(controllers.getCourseById)
    .patch(verifyToken, allowedTo(userRole.ADMIN, userRole.MANGER), controllers.updateCourse)
    .delete(verifyToken, allowedTo(userRole.ADMIN, userRole.MANGER), controllers.deleteCourse);

module.exports = router;
