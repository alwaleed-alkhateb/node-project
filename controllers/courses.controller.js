
const Course = require('../model/courses.model');
const { validationResult } = require('express-validator');
const httpStatus = require('../utils/httpStatus');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');

const getAllCourses = asyncWrapper(
    async (req, res, next) => {

        const query = req.query;
        const limit = parseInt(query.limit) || 2;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * limit;
        const courses = await Course.find().select('-__v').skip(skip).limit(limit);
        if (!courses) {
            const error = appError.create('Courses not found', 404, httpStatus.ERROR);
            return next(error);
        }

        res.json(courses);
    });

const getCourseById = asyncWrapper(
    async (req, res, next) => {
        const foundCourse = await Course.findById(req.params.courseId).select('-__v');
        if (!foundCourse) {
            const error = appError.create('Course not found', 404, httpStatus.ERROR);
            return next(error);
        } else {
            return res.json(foundCourse);
        }
    });

const createCourse = async (req, res) => {
    if (!validationResult(req).isEmpty()) {
        return res.status(400).json({ errors: validationResult(req).array() });
    }
    const newCourse = await new Course(req.body).save();
    res.status(201).json({ status: httpStatus.SUCCESS, data: newCourse });
};

const updateCourse = async (req, res) => {
    const setData = { $set: req.body }
    const updatedCourse = await Course.findByIdAndUpdate(req.params.courseId, setData, { new: true });
    if (!updatedCourse) {
        return res.status(404).send('Course not found');
    }

    res.status(201).json({ status: httpStatus.SUCCESS, data: updatedCourse });
};

const deleteCourse = async (req, res) => {
    const deletedCourse = await Course.findByIdAndDelete(req.params.courseId);
    if (!deletedCourse) {
        return res.status(404).send('Course not found');
    }
    res.json({ status: httpStatus.SUCCESS, message: "Course deleted successfully" });
};


module.exports = {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
};