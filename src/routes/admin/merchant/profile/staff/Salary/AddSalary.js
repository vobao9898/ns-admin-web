import React, { useState } from 'react';
import { Form } from 'components';
import StaffAddSalaryColumns from 'columns/merchant/detail/staff/staff-add-salary';

const AddSalary = ({ handSubmit, salary, formSalary }) => {
  const [values, setValues] = useState(salary || {});
  const handleNext = async () => {
    const value = await formSalary.validateFields();
    handSubmit(value);
  };

  return (
    <>
      <Form form={formSalary} values={values} columns={StaffAddSalaryColumns({ values, setValues })} />
      <button
        className="bg-blue-500 text-white text-base p-2 w-full rounded-xl hover:bg-blue-400 mt-1 mr-2"
        id="submit-form"
        onClick={handleNext}
      >
        Next
      </button>
    </>
  );
};

export default AddSalary;
