import React from 'react';
import CommissionForm from './salary-commission-form';

const ListForm = ({ getForm, count, deleteForm }) => {
  return (
    <div className="">
      {count?.length > 0 &&
        count?.map((item, index) => (
          <CommissionForm
            key={index}
            getForm={getForm}
            index={index}
            moreSalaray={count[index]}
            deleteForm={deleteForm}
          />
        ))}
    </div>
  );
};

export default ListForm;
