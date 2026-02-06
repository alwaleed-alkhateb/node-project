
const { validationResult } = require('express-validator');
const httpStatus = require('../utils/httpStatus');
const asyncWrapper = require('../middleware/asyncWrapper');
const appError = require('../utils/appError');
const User = require('../model/users.model');
const hash = require('bcryptjs');
const generateToken = require('../utils/generate.jwt');

const getAllUsers = asyncWrapper(
    async (req, res, next) => {
        console.log(req.headers);

        const query = req.query;
        const limit = parseInt(query.limit) || 2;
        const page = parseInt(query.page) || 1;
        const skip = (page - 1) * limit;
        const users = await User.find().select('-__v').skip(skip).limit(limit);
        if (!users) {
            const error = appError.create('Users not found', 404, httpStatus.ERROR);
            return next(error);
        }

        res.status(200).json({ status: httpStatus.SUCCESS, data: users });
    });

const getUserById = asyncWrapper(
    async (req, res, next) => {
        const foundUser = await User.findById(req.params.userId).select('-__v');
        if (!foundUser) {
            const error = appError.create('User not found', 404, httpStatus.ERROR);
            return next(error);
        } else {
            return res.json(foundUser);
        }
    });

const createUsers = asyncWrapper(
    async (req, res) => {
        if (!validationResult(req).isEmpty()) {
            return res.status(400).json({ errors: validationResult(req).array() });
        }
        const oldUser = await User.findOne({ email: req.body.email });
        if (oldUser) {
            return res.status(400).json({ status: httpStatus.ERROR, message: "User with this email already exists" });
        }
        const hashedPassword = await hash.hash(req.body.password, 12);
        const token = await generateToken({ userId: req.body._id, email: req.body.email });
        const newUser = await new User({ ...req.body, password: hashedPassword, token: token }).save();
        res.status(201).json({ status: httpStatus.SUCCESS, data: newUser });
    });

const updateUsers = asyncWrapper(
    async (req, res) => {
        const setData = { $set: req.body }
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, setData, { new: true });
        if (!updatedUser) {
            return res.status(404).send('User not found');
        }

        res.status(201).json({ status: httpStatus.SUCCESS, data: updatedUser });
    });

const deleteUsers = asyncWrapper(
    async (req, res) => {
        const deletedUser = await User.findByIdAndDelete(req.params.userId);
        if (!deletedUser) {
            return res.status(404).send('User not found');
        }
        res.json({ status: httpStatus.SUCCESS, message: "User deleted successfully" });
    });

const loginUser = asyncWrapper(
    async (req, res) => {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });
        const isPasswordValid = await hash.compare(password, user.password);
        if (!user || !isPasswordValid) {
            return res.status(404).json({ status: httpStatus.ERROR, message: "User not found or invalid password" });
        }
        else {
            const token = await generateToken({ userId: req.body._id, email: req.body.email });
            return res.status(200).json({ status: httpStatus.SUCCESS, message: "Login successful", token: token });
        }
    });

module.exports = {
    getAllUsers,
    getUserById,
    createUsers,
    updateUsers,
    deleteUsers,
    loginUser
};