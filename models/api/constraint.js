const async = require('hbs/lib/async');
const { use } = require('passport');
const { models } = require('../../config/DBconnect');

const findConstraint = att => models.constraint.findOne({ attributes: [att] });

const username = findConstraint('username');

const password = findConstraint('password');

const maxPatient = findConstraint('maxPatient');

const examinationFee = findConstraint('examinationFee');
/*const updateConstraint = async(newContraint, user) => {
    await models.constraint.update({
        username: newContraint.username,
        password: newContraint.password,
        maxPatient: newContraint.maxPatient,
        examinationFee: newContraint.examinationFee
    }, { where: { username: user } });
};*/

const updateConstraint = async(newContraint, user) => {
    await models.constraint.update({
        username: newContraint.username,
        password: newContraint.password,
        maxPatient: newContraint.maxPatient,
        examinationFee: newContraint.examinationFee
    }, { where: { username: user } });
};

const find = (user) => models.constraint.findAll({
    where: { username: user },
});
module.exports = {
    username,
    password,
    maxPatient,
    examinationFee,
    updateConstraint,
    find
};