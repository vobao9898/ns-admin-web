import React from 'react';

const ColumnBusiness = () => {
  return [
    {
      title: 'Has Merchant been previously identified by Visa/Mastercard Risk Programs?',
      formItem: {
        col: 6,
        colTablet: 12,
        render: (form, values, generateForm, index) => (
          <>
            {generateForm(
              {
                title: 'Has Merchant been previously identified by Visa/Mastercard Risk Programs?',
                name: ['businessInfo', 'question1', 'isAccept'],
                formItem: {
                  type: 'radio',
                  list: [
                    { value: false, label: 'No' },
                    { value: true, label: 'Yes (if yes, who was the processor)' },
                  ],
                },
              },
              index + '1',
            )}
            {generateForm(
              {
                title: '',
                name: ['businessInfo', 'question1', 'desc'],
                formItem: {
                  placeholder: 'Processor',
                },
              },
              index + '2',
              false,
            )}
          </>
        ),
      },
    },
    {
      title:
        'Has Merchant or any associated principal and/or owners disclosed below filed bankruptcy or been subject to any involuntary bankruptcy?',
      formItem: {
        col: 6,
        colTablet: 12,
        render: (form, values, generateForm, index) => (
          <>
            {generateForm(
              {
                title:
                  'Has Merchant or any associated principal and/or owners disclosed below filed bankruptcy or been subject to any involuntary bankruptcy?',
                name: ['businessInfo', 'question2', 'isAccept'],
                formItem: {
                  type: 'radio',
                  list: [
                    { value: false, label: 'No' },
                    { value: true, label: 'Yes (if yes, who was the processor)' },
                  ],
                },
              },
              index + '1',
            )}
            {generateForm(
              {
                title: '',
                name: ['businessInfo', 'question2', 'desc'],
                formItem: {
                  placeholder: 'Processor',
                },
              },
              index + '2',
              false,
            )}
          </>
        ),
      },
    },
    {
      title: 'Will product(s) or service(s) be sold outside of US?',
      formItem: {
        col: 6,
        colTablet: 12,
        render: (form, values, generateForm, index) => (
          <>
            {generateForm(
              {
                title: 'Will product(s) or service(s) be sold outside of US?',
                name: ['businessInfo', 'question3', 'isAccept'],
                formItem: {
                  type: 'radio',
                  list: [
                    { value: false, label: 'No' },
                    { value: true, label: 'Yes' },
                  ],
                },
              },
              index + '1',
            )}
            {generateForm(
              {
                title: '',
                name: ['businessInfo', 'question3', 'desc'],
                formItem: {
                  placeholder: '',
                },
              },
              index + '2',
              false,
            )}
          </>
        ),
      },
    },
    {
      title: 'Has a processor ever terminated your Merchant account?',
      name: 'merchant4',
      formItem: {
        col: 6,
        colTablet: 12,
        render: (form, values, generateForm, index) => (
          <>
            {generateForm(
              {
                title: 'Has a processor ever terminated your Merchant account?',
                name: ['businessInfo', 'question4', 'isAccept'],
                formItem: {
                  type: 'radio',
                  list: [
                    { value: false, label: 'No' },
                    { value: true, label: 'Yes (if yes, what was program and when)' },
                  ],
                },
              },
              index + '1',
            )}
            {generateForm(
              {
                title: '',
                name: ['businessInfo', 'question4', 'desc'],
                formItem: {
                  placeholder: 'Program and when',
                },
              },
              index + '2',
              false,
            )}
          </>
        ),
      },
    },
    {
      title: 'Have you ever accepted Credit/Debit cards before?',
      name: 'merchant5',
      formItem: {
        col: 6,
        colTablet: 12,
        render: (form, values, generateForm, index) => (
          <>
            {generateForm(
              {
                title: 'Have you ever accepted Credit/Debit cards before?',
                name: ['businessInfo', 'question5', 'isAccept'],
                formItem: {
                  type: 'radio',
                  list: [
                    { value: false, label: 'No' },
                    { value: true, label: 'Yes (if yes, date filed)' },
                  ],
                },
              },
              index + '1',
            )}
            {generateForm(
              {
                title: '',
                name: ['businessInfo', 'question5', 'desc'],
                formItem: {
                  placeholder: '',
                },
              },
              index + '2',
              false,
            )}
          </>
        ),
      },
    },
  ];
};
export default ColumnBusiness;
