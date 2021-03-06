const { models } = require('../../config/DBconnect');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const listCheckUp = () =>
    models.checkup.findAll({
        where: { isDeleted: false },
        order: [
            ['id', 'ASC']
        ],
        raw: true,
        nest: true,
        include: [{
                model: models.patient,
                required: true,
                as: 'patient_patient'
            },
            {
                model: models.checkupDisease,
                required: false,
                as: 'checkup-diseases',
                where: { isDeleted: false },
                include: {
                    model: models.disease,
                    required: false,
                    as: 'iddisease_disease'
                }
            }, {
                model: models.checkupMedicine,
                required: false,
                as: 'checkup-medicines',
                where: { isDeleted: false },
                include: {
                    model: models.medicine,
                    required: false,
                    as: 'medicine_medicine'
                }
            }
        ]
    });

const listCheckUp2 = () =>
    models.checkup.findAll({
        raw: true,
        nest: true,
        where: { isDeleted: false },

        order: [
            ['id', 'ASC']
        ],
        include: [{
            model: models.patient,
            required: true,
            as: 'patient_patient'
        }]
    });
const listCheckUpOfMonth = (month, year) =>
    models.checkup.findAll({
        raw: true,
        nest: true,
        where: {
            isDeleted: false,
            [Op.and]: [
                sequelize.fn('EXTRACT(MONTH from "date") =', month),
                sequelize.fn('EXTRACT(YEAR from "date") =', year)
            ],
        },

        order: [
            ['id', 'ASC']
        ],
        include: [{
            model: models.patient,
            required: true,
            as: 'patient_patient'
        }]
    });

const findCheckUp = (id) =>
    models.checkup.findAll({
        where: { isDeleted: false, id },
        order: [
            ['id', 'ASC']
        ],
        raw: true,
        nest: true,
        include: [{
            model: models.patient,
            required: true,
            as: 'patient_patient'
        }]
    });

const findDisease = async(idcheckup) =>
    models.checkupDisease.findAll({
        where: { isDeleted: false, idcheckup },
        order: [
            ['iddisease', 'ASC']
        ],
        raw: true,
        nest: true,
        include: [{
            model: models.disease,
            required: false,
            as: 'iddisease_disease'
        }]
    });
const findDisease2 = async(idcheckup, iddisease) =>
    models.checkupDisease.findAll({
        where: { isDeleted: false, idcheckup: idcheckup, iddisease: iddisease },
    });

const findMedicine = async(idcheckup) =>
    models.checkupMedicine.findAll({
        where: { isDeleted: false, checkup: idcheckup },
        order: [
            ['medicine', 'ASC']
        ],
        raw: true,
        nest: true,
        include: [{
            model: models.medicine,
            required: false,
            as: 'medicine_medicine'
        }]
    });
const findMedicine2 = async(checkup, medicine) =>
    models.checkupMedicine.findAll({
        where: { isDeleted: false, checkup: checkup, medicine: medicine },
        raw: true,
        nest: true,

    });

const addCheckup = async({ patient, symptoms, date }) => {
    await models.checkup.create({ patient, symptoms, date });
};

const addDisease = async({ idcheckup, iddisease }) => {
    await models.checkupDisease.create({ idcheckup, iddisease });
};

const updateDisease = async({ idcheckup, olddisease, iddisease }) => {
    await models.checkupDisease.update({ iddisease }, { where: { idcheckup, iddisease: olddisease } });
};

const deleteDisease = async(idcheckup, iddisease) => { await models.checkupDisease.destroy({ where: { idcheckup: idcheckup, iddisease: iddisease } }); };


const addMedicine = async({ checkup, medicine, number }) => {
    await models.checkupMedicine.create({ checkup, medicine, number });
};

const updateMedicine = async({ checkup, medicine, oldmedicine, number }) => {
    await models.checkupMedicine.update({ medicine, number }, { where: { checkup, medicine: oldmedicine } });
};


const deleteMedicine = async(checkup, medicine) => { await models.checkupMedicine.destroy({ where: { checkup, medicine } }); };

const updateCheckup = async({ id, patient, symptoms, date }) => {
    await models.checkup.update({ patient, symptoms, date }, { where: { id } });
};

const deleteCheckUp = async(id) => {
    await models.checkup.update({ isDeleted: true }, { where: { id } });
};

const deleteCheckUpMedicine = async(id) => {
    await models.checkupMedicine.update({ isDeleted: true }, { where: { checkup: id } });
};

const deleteCheckUpDisease = async(id) => {
    await models.checkupDisease.update({ isDeleted: true }, { where: { idcheckup: id } });
};

const listBill = () =>
    models.bill.findAll({
        order: [
            ['checkup', 'ASC']
        ],
        raw: true,
        nest: true
    });

const findBill = async(checkup) =>
    models.bill.findAll({
        where: { checkup: checkup },
        order: [
            ['checkup', 'ASC']
        ],
        raw: true,
        nest: true,
        include: [{
            model: models.checkup,
            required: true,
            as: 'checkup_checkup',
            include: {
                model: models.patient,
                required: false,
                as: 'patient_patient'
            }

        }]
    });

const addBill = async({ checkup, medicineFee, examinationFee }) => {
    await models.bill.create({ checkup, examinationFee, medicineFee });
};
const updateBill = async({ checkup, medicineFee, examinationFee }) => {
    await models.bill.update({ medicineFee, examinationFee }, { where: { checkup } });
};

const saleReport = (month, year) =>
    models.checkup.findAll({
        attributes: [
            'date', [sequelize.literal('COUNT("patient_patient")'), 'countOfPatient'],
            [sequelize.literal('SUM("examinationFee")'), 'sumOfFee']
        ],
        where: {
            [Op.and]: [
                sequelize.fn('EXTRACT(MONTH from "date") =', month),
                sequelize.fn('EXTRACT(YEAR from "date") =', year)
            ],
            isDeleted: false
        },
        order: [
            ['date', 'ASC']
        ],
        include: [{
                model: models.patient,
                required: true,
                as: 'patient_patient',
                attributes: []
            },
            {
                model: models.bill,
                required: true,
                as: 'bill',
                attributes: []
            }
        ],
        group: ['date'],
        raw: true,
        nest: true
    });

const medicineReport = (month, year) => {
    return models.medicine.findAll({
        attributes: [
            [sequelize.fn('DISTINCT', sequelize.col('"medicine"."id"')), 'id'],
            'name', [sequelize.literal('COUNT(DISTINCT("checkup-medicines"."checkup"))'), 'countOfCheckup'],
            'unit_unit.type', [sequelize.literal('SUM(DISTINCT("checkup-medicines"."number"))'), 'sumofNumber']
        ],

        order: [
            ['id', 'ASC']
        ],
        include: [{
                model: models.checkup,
                required: true,
                as: 'checkup_checkups',
                attributes: [],

                where: {
                    [Op.and]: [
                        sequelize.fn('EXTRACT(MONTH from "date") =', month),
                        sequelize.fn('EXTRACT(YEAR from "date") =', year)
                    ],

                    isDeleted: false
                },
                include: {
                    model: models.checkupMedicine,
                    required: false,
                    as: 'checkup-medicines',
                    attributes: []
                }
            },
            {
                model: models.checkupMedicine,
                required: false,
                as: 'checkup-medicines',
                attributes: []
            },
            {
                model: models.unit,
                required: false,
                as: 'unit_unit',
                attributes: []
            }

        ],
        group: ['medicine.id', 'checkup_checkups.id', 'name', 'checkup_checkups->checkup-medicine.checkup', 'checkup_checkups->checkup-medicine.medicine', 'unit_unit.id'],
        raw: true,
        nest: true
    });
};

const listPatientOfDate = date =>
    models.checkup.findAll({
        where: { date, isDeleted: false },
        order: [
            ['id', 'ASC']
        ],
        include: [{
            model: models.patient,
            required: true,
            as: 'patient_patient'
        }],
        raw: true,
        nest: true
    });

const countPatientOfDate = date =>
    models.checkup.findAll({
        attributes: [
            [sequelize.literal('COUNT("patient_patient")'), 'count']
        ],
        where: { date, isDeleted: false },
        include: [{
            model: models.patient,
            required: true,
            as: 'patient_patient',
            attributes: []
        }],
        raw: true,
        nest: true
    });

module.exports = {
    listCheckUp,
    addCheckup,
    updateCheckup,
    deleteCheckUp,
    addDisease,
    findDisease,
    findMedicine,
    updateDisease,
    deleteDisease,
    addMedicine,
    updateMedicine,
    deleteMedicine,
    listCheckUp2,
    addBill,
    findBill,
    listBill,
    saleReport,
    medicineReport,
    listPatientOfDate,
    countPatientOfDate,
    deleteCheckUpDisease,
    deleteCheckUpMedicine,
    findCheckUp,
    updateBill,
    findDisease2,
    findMedicine2,
    listCheckUpOfMonth
};