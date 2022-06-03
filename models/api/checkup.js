const { models } = require('../../config/DBconnect');
const sequelize = require('sequelize');
const Op = sequelize.Op;

const listCheckUp = () => {
  return models.checkup.findAll({
    where: { isDeleted: false },
    order: [['id', 'ASC']],
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
    }]
  });
};

const listCheckUp2 = () => {
  return models.checkup.findAll({
    raw: true,
    nest: true,
    order: [['id', 'ASC']],
    include: [{
      model: models.patient,
      required: true,
      as: 'patient_patient'
    }]
  });
};

const findCheckUp = (id) => {
  return models.checkup.findAll({
    where: { isDeleted: false, id },
    order: [['id', 'ASC']],
    raw: true,
    nest: true,
    include: [{
      model: models.patient,
      required: true,
      as: 'patient_patient'
    }]
  });
};

const findDisease = async (idcheckup) => {
  return models.checkupDisease.findAll({
    where: { isDeleted: false, idcheckup },
    order: [['iddisease', 'ASC']],
    raw: true,
    nest: true,
    include: [{
      model: models.disease,
      required: false,
      as: 'iddisease_disease'
    }]
  });
};

const findMedicine = async (idcheckup) => {
  return models.checkupMedicine.findAll({
    where: { isDeleted: false, checkup: idcheckup },
    order: [['medicine', 'ASC']],
    raw: true,
    nest: true,
    include: [{
      model: models.medicine,
      required: false,
      as: 'medicine_medicine'
    }]
  });
};

const addCheckup = async ({ patient, symptoms, date }) => {
  try {
    await models.checkup.create({ patient, symptoms, date });
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const addDisease = async ({ idcheckup, iddisease }) => {
  try {
    await models.checkupDisease.create({ idcheckup, iddisease });
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const updateDisease = async ({ idcheckup, olddisease, newdisease }) => {
  try {
    await models.checkupDisease.update(
      { iddisease: newdisease },
      { where: { idcheckup, iddisease: olddisease } }
    );
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};
const deleteDisease = async (idcheckup, iddisease) => {
  try {
    await models.checkupDisease.update({ isDeleted: true }, { where: { idcheckup, iddisease } });
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const addMedicine = async ({ checkup, medicine, number }) => {
  try {
    await models.checkupMedicine.create({ checkup, medicine, number });
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const updateMedicine = async ({ checkup, newmedicine, oldmedicine, number }) => {
  try {
    await models.checkupMedicine.update(
      { medicine: newmedicine, number },
      { where: { checkup, medicine: oldmedicine } }
    );
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const deleteMedicine = async (checkup, medicine) => {
  try {
    await models.checkupMedicine.update({ isDeleted: true }, { where: { checkup, medicine } });
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const updateCheckup = async ({ id, patient, symptoms, date }) => {
  try {
    await models.checkup.update({ patient, symptoms, date }, { where: { id } });
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const deleteCheckUp = async (id) => {
  try {
    await models.checkup.update({ isDeleted: true }, { where: { id } });
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const deleteCheckUpMedicine = async (id) => {
  try {
    await models.checkupMedicine.update({ isDeleted: true }, { where: { checkup: id } });
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const deleteCheckUpDisease = async (id) => {
  try {
    await models.checkupDisease.update({ isDeleted: true }, { where: { idcheckup: id } });
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const listBill = () => {
  return models.bill.findAll({
    order: [['checkup', 'ASC']],
    raw: true,
    nest: true
  });
};

const findBill = checkup => models.bill.findAll({ where: { checkup } });

const addBill = async (bill) => {
  try {
    await models.bill.create({
      checkup: bill.checkup,
      examinationFee: bill.examinationFee,
      medicineFee: bill.medicineFee
    });
  } catch (err) {
    console.log(err.message);
    throw (err);
  }
};

const saleReport = (month, year) => {
  return models.checkup.findAll({
    attributes: [
      'date',
      [sequelize.literal('COUNT("patient_patient")'), 'countOfPatient'],
      [sequelize.literal('SUM("examinationFee")'), 'sumOfFee']
    ],
    where: {
      [Op.and]: [
        sequelize.fn('EXTRACT(MONTH from "date") =', month),
        sequelize.fn('EXTRACT(YEAR from "date") =', year)
      ],
      isDeleted: false
    },
    order: [['date', 'ASC']],
    include: [
      {
        model: models.patient,
        required: true,
        as: 'patient_patient',
        attributes: []
      },
      {
        model: models.bill,
        required: false,
        as: 'bill',
        attributes: []
      }
    ],
    group: ['date'],
    raw: true,
    nest: true
  });
};

const medicineReport = (month, year) => {
  return models.medicine.findAll({
    attributes: [
      'name',
      [sequelize.fn('DISTINCT', sequelize.col('"medicine"."id"')), 'id'],
      [sequelize.literal('COUNT("checkup_checkups")'), 'countOfCheckup'],
      [sequelize.literal('SUM("checkup-medicines"."number")'), 'sumofNumber']
    ],
    order: [['id', 'ASC']],
    include: [
      {
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
          as: 'checkup-medicine',
          attributes: []
        }
      },
      {
        model: models.checkupMedicine,
        required: false,
        as: 'checkup-medicines',
        attributes: []
      }
    ],
    group: [
      'medicine.id',
      'name',
      'checkup_checkups->checkup-medicine.checkup',
      'checkup_checkups->checkup-medicine.medicine'
    ],
    raw: true,
    nest: true
  });
};

const listPatientOfDate = (date) => {
  return models.checkup.findAll({
    where: { date, isDeleted: false },
    order: [['id', 'ASC']],
    include: [{
      model: models.patient,
      required: true,
      as: 'patient_patient'
    }],
    raw: true,
    nest: true
  });
};

const countPatientOfDate = (date) => {
  return models.checkup.findAll({
    attributes: [[sequelize.literal('COUNT("patient_patient")'), 'count']],
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
};

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
  findCheckUp
};
