const ColumnWorkingTime = () => {
  let am = ['12:00 AM', '12:30 AM'];
  let pm = ['12:00 PM', '12:30 PM'];
  for (let i = 1; i < 12; i++) {
    if (i < 10) i = '0' + i;
    am = [...am, `${i}:00 AM`, `${i}:30 AM`];
    pm = [...pm, `${i}:00 PM`, `${i}:30 PM`];
  }
  const times = [...am, ...pm].map((item) => ({ label: item, value: item }));
  return [
    {
      title: 'Monday',
      name: ['Monday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Shift Start',
      name: ['Monday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },
    {
      title: 'Shift End',
      name: ['Monday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },

    {
      title: 'Tuesday',
      name: ['Tuesday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Shift Start',
      name: ['Tuesday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },
    {
      title: 'Shift End',
      name: ['Tuesday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },

    {
      title: 'Wednesday',
      name: ['Wednesday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Shift Start',
      name: ['Wednesday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },
    {
      title: 'Shift End',
      name: ['Wednesday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },

    {
      title: 'Thursday',
      name: ['Thursday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Shift Start',
      name: ['Thursday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },
    {
      title: 'Shift End',
      name: ['Thursday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },

    {
      title: 'Friday',
      name: ['Friday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Shift Start',
      name: ['Friday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },
    {
      title: 'Shift End',
      name: ['Friday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },

    {
      title: 'Saturday',
      name: ['Saturday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Shift Start',
      name: ['Saturday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },
    {
      title: 'Shift End',
      name: ['Saturday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },

    {
      title: 'Sunday',
      name: ['Sunday', 'isCheck'],
      formItem: {
        col: 4,
        type: 'checkbox',
      },
    },
    {
      title: 'Shift Start',
      name: ['Sunday', 'timeStart'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },
    {
      title: 'Shift End',
      name: ['Sunday', 'timeEnd'],
      formItem: {
        col: 4,
        type: 'select',
        list: times,
        allowClear: false,
      },
    },
  ];
};

export default ColumnWorkingTime;
